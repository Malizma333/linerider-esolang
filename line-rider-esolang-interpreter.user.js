// ==UserScript==

// @name         Line Rider Esolang Interpreter
// @namespace    https://www.linerider.com/
// @author       Malizma
// @description  Esolang interpreter userscript for linerider.com.
// @version      0.1.0
// @icon         https://www.linerider.com/favicon.ico

// @match        https://www.linerider.com/*
// @match        https://*.official-linerider.com/*
// @match        http://localhost:*/*
// @match        https://*.surge.sh/*

// @downloadURL  https://github.com/Malizma333/linerider-esolang/raw/main/line-rider-esolang-interpreter.user.js
// @updateURL    https://github.com/Malizma333/linerider-esolang/raw/main/line-rider-esolang-interpreter.user.js
// @homepageURL  https://github.com/Malizma333/linerider-esolang
// @supportURL   https://github.com/Malizma333/linerider-esolang/issues
// @grant        none

// ==/UserScript==

function main () {
  console.info('[Esolang Interpreter] Running')

  const ARRAY_SIZE = 65536

  const progState = {
    registerPointer: 0,
    registers: new Uint8Array(ARRAY_SIZE),
    inputBuffer: new Uint8Array(ARRAY_SIZE)
  }

  const { store } = window
  let lastHitIds = new Set()

  function getInstruction (line) {
    let instruction = -1

    if (Math.floor(line.x1 * 1000) === Math.floor(line.x2 * 1000)) {
      if ((line.y1 < line.y2) !== line.flipped) {
        instruction = line.type === 1 ? 5 : 1
      } else {
        instruction = line.type === 1 ? 7 : 3
      }
    }

    if (Math.floor(line.y1 * 1000) === Math.floor(line.y2 * 1000)) {
      if ((line.x1 < line.x2) !== line.flipped) {
        instruction = line.type === 1 ? 4 : 0
      } else {
        instruction = line.type === 1 ? 6 : 2
      }
    }

    let M = 0

    if (line.type === 1) {
      M = Math.sign(line.multiplier) * Math.floor(Math.abs(line.multiplier))

      if (!M) {
        M = line.flipped ? -1 : 1
      }
    }

    return [instruction, M]
  }

  store.subscribe(() => {
    const state = store.getState()

    if (!state.player.running && state.player.index === 0) {
      if (lastHitIds.size > 0) {
        lastHitIds.clear()
      }

      progState.registerPointer = 0
      progState.registers = new Uint8Array(ARRAY_SIZE)
      progState.inputBuffer = []

      return
    }

    const track = state.simulator.committedEngine
    const frameData = track.getFrame(Math.floor(state.player.index))
    const currentHit = track.linesList.filter(line => frameData.involvedLineIds.includes(line.id))
    const currentHitIds = new Set(currentHit.map(line => line.id))
    const diffHitIds = currentHitIds.difference(lastHitIds)
    const diffHit = currentHit.filter(line => diffHitIds.has(line.id)).toArray()
    lastHitIds = currentHitIds

    if (diffHit.length === 0) {
      return
    }

    const instructions = diffHit.map(getInstruction).filter(i => i[0] !== -1)

    if (instructions.length === 0) {
      return
    }

    let currentInstruction = instructions[0]
    for (let i = 1; i < instructions.length; i++) {
      if (instructions[i][0] < currentInstruction[0]) {
        currentInstruction = instructions[i]
      }
    }

    const M = currentInstruction[1]

    switch (currentInstruction[0]) {
      case 0:
        progState.registerPointer = 0
        break
      case 1:
        progState.registers[progState.registerPointer] = 0
        break
      case 2:
        progState.inputBuffer.length = 0
        break
      case 3:
        console.info('[Esolang Interpreter] Program halted')
        store.dispatch({ type: "TRIGGER_COMMAND", payload: "triggers.stop", meta: { ignorable: true } })
        break
      case 4:
        progState.registerPointer = (progState.registerPointer + M) % ARRAY_SIZE
        break
      case 5:
        progState.registers[progState.registerPointer] += M
        break
      case 6:
        if (M > 0) {
          store.dispatch({ type: 'SET_PLAYER_RUNNING', payload: false })
          progState.inputBuffer.push(...window.prompt().split(''))
          const input = progState.inputBuffer.splice(0, M)
          let pointer = progState.registerPointer
          for (let i = 0; i < M; i++) {
            if (i >= input.length) {
              progState.registers[pointer] = 0
            }

            progState.registers[pointer] = input.charCodeAt(i)
            pointer = (pointer + 1) % ARRAY_SIZE
          }
          store.dispatch({ type: 'SET_PLAYER_RUNNING', payload: true })
        } else {
          const output = []
          for (let i = progState.registerPointer; i < progState.registerPointer - M; i++) {
            output.push(String.fromCharCode(progState.registers[progState.registerPointer]))
          }
          console.log(output.join(''))
        }
        break
      case 7:
        if (state.player.index + M < 0) {
          store.dispatch({ type: "TRIGGER_COMMAND", payload: "triggers.stop", meta: { ignorable: true } })
          console.error('[Esolang Interpreter] Attempted jump to negative index')
        } else {
          store.dispatch({ type: 'SET_PLAYER_INDEX', payload: state.player.index + M })
        }
        break
    }
  })
}

if (window.store) {
  main()
} else {
  const prevInit = window.onAppReady
  window.onAppReady = () => {
    if (prevInit) prevInit()
    main()
  }
}
