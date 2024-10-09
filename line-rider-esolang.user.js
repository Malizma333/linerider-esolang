// ==UserScript==

// @name         Line Rider Esolang Interpreter
// @namespace    https://www.linerider.com/
// @author       Malizma
// @description  A Line Rider esolang real-time interpreter for linerider.com.
// @version      0.1.0
// @icon         https://www.linerider.com/favicon.ico

// @match        https://www.linerider.com/*
// @match        https://*.official-linerider.com/*
// @match        http://localhost:*/*
// @match        https://*.surge.sh/*

// @downloadURL  https://github.com/Malizma333/linerider-esolang/raw/master/line-rider-esolang.user.js
// @updateURL    https://github.com/Malizma333/linerider-esolang/raw/master/line-rider-esolang.user.js
// @homepageURL  https://github.com/Malizma333/linerider-esolang
// @supportURL   https://github.com/Malizma333/linerider-esolang/issues
// @grant        none

// ==/UserScript==


function main () {
  console.log("Test");
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