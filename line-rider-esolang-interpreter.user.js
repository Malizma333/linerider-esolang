// ==UserScript==

// @name         Line Rider Esolang Interpreter
// @namespace    https://www.linerider.com/
// @author       Malizma
// @description  
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
  console.info("[Esolang Interpreter] Running");

  const instructArray = [];
  const { store } = window;
  const hitLines = new Set();

  store.subscribe(() => {
    const state = store.getState();

    if (!state.player.running) {
      if (hitLines.size > 0) {
        hitLines = new Set();
      }

      return;
    }

    const track = state.simulator.committedEngine;
    const frameData = track.getFrame(Math.floor(state.player.index));

    if(frameData.involvedLineIds.length === 0) {
      return;
    }

    const collidingLines = track.linesList.filter(
      line => !hitLines.has(line.id) && frameData.involvedLineIds.includes(line.id)
    )
    hitLines.union(new Set(collidingLines.map(line => line.id)))
    const instructions = collidingLines.map(
      line => (Math.atan2(line.y2 - line.y1, line.x2 - line.x1) * 2 / Math.PI + 2 * line.flipped + 4) % 4 + 4 * line.type
    ).filter(instruction => instruction === Math.round(instruction));

    instructArray.push(...instructions.toArray());
  });
}

if (window.store) {
  main();
} else {
  const prevInit = window.onAppReady;
  window.onAppReady = () => {
      if (prevInit) prevInit();
      main();
  };
}