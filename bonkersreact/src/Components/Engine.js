import React, { Component, useState, useEffect } from "react";
import Entity from "../Assets/Entities/Entity";
import Player from "../Assets/Entities/Player"
import TileDraw from "./TileDraw";
import TileSet from "../Assets/TileSet.png";
function Engine() {
  const [mounted, setMounted] = useState(false);
  let map = [
    [
      29,
      28,
      29,
      28,
      29,
      28,
      29,
      28,
      29,
      28,
      29,
      21,
      55,
      22,
      26,
      26,
      26,
      26,
      26,
      26,
    ],
    [
      28,
      29,
      28,
      29,
      21,
      20,
      21,
      20,
      21,
      20,
      21,
      4,
      55,
      22,
      26,
      26,
      26,
      26,
      26,
      26,
    ],
    [29, 21, 20, 21, 1, 2, 2, 2, 3, 4, 4, 4, 55, 30, 26, 26, 26, 26, 26, 26],
    [21, 4, 4, 4, 8, 9, 6, 6, 7, 4, 4, 4, 55, 6, 6, 6, 6, 6, 6, 6],
    [19, 4, 35, 36, 37, 4, 5, 6, 7, 25, 25, 25, 55, 9, 9, 9, 9, 9, 9, 6],
    [21, 4, 43, 44, 45, 4, 5, 6, 7, 33, 40, 33, 55, 4, 50, 4, 4, 4, 4, 5],
    [19, 4, 33, 41, 33, 4, 8, 9, 10, 4, 11, 4, 16, 63, 13, 63, 63, 39, 4, 5],
    [
      21,
      4,
      4,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      11,
      30,
      26,
      13,
      26,
      26,
      55,
      2,
      6,
    ],
    [19, 4, 4, 4, 38, 63, 63, 63, 63, 63, 39, 11, 4, 4, 11, 1, 2, 55, 6, 6],
    [21, 4, 1, 2, 54, 58, 58, 58, 58, 58, 55, 11, 11, 11, 11, 5, 6, 55, 6, 6],
    [4, 4, 5, 6, 54, 58, 58, 58, 58, 58, 55, 2, 3, 11, 1, 6, 6, 55, 6, 6],
    [2, 2, 6, 6, 46, 62, 62, 62, 15, 58, 55, 6, 7, 11, 5, 6, 6, 16, 63, 63],
    [6, 6, 6, 6, 7, 4, 49, 49, 54, 58, 55, 9, 10, 11, 5, 6, 6, 22, 26, 26],
    [9, 9, 9, 9, 10, 4, 49, 49, 46, 62, 47, 4, 4, 11, 8, 9, 9, 30, 26, 26],
    [15, 4, 4, 4, 4, 4, 4, 4, 42, 42, 42, 42, 4, 11, 42, 42, 42, 42, 42, 42],
    [54, 4, 4, 4, 18, 19, 4, 4, 42, 4, 48, 27, 4, 11, 51, 34, 52, 53, 18, 19],
    [54, 4, 4, 18, 29, 21, 4, 4, 42, 48, 48, 4, 4, 11, 59, 60, 60, 61, 20, 28],
    [54, 4, 18, 29, 28, 19, 4, 4, 42, 4, 4, 4, 4, 11, 32, 40, 32, 32, 18, 29],
    [
      54,
      18,
      29,
      28,
      29,
      28,
      19,
      18,
      19,
      18,
      19,
      18,
      19,
      11,
      11,
      11,
      4,
      4,
      20,
      28,
    ],
    [
      54,
      20,
      28,
      29,
      28,
      29,
      28,
      29,
      28,
      29,
      28,
      29,
      28,
      19,
      18,
      19,
      18,
      19,
      18,
      29,
    ],
  ];
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let entityLoop = {};
  let count = 0;
  let mainCanvas = null;
  let mainCtx = null;
  let tileMap = new TileDraw(map);
  let cameraX = 0;
  let cameraY = 0;
  let camera = null;
  let cameraCtx = null;
  let cameraWidth = 160;
  let cameraHeight = 120;
  let entityCount = 0

  document.addEventListener("keydown", (e) => checkKeyDown(e));
  document.addEventListener("keyup", (e) => checkKeyUp(e));

  function setProps() {
    return {
      keys: {up: up,
      down: down,
      left: left,
      right: right},
      count: count,
      canvas: camera,
      ctx: cameraCtx,
      map: map,
    };
  }

  function checkKeyDown(e) {
    switch (e.key) {
      case "w":
        up = true;
        break;
      case "s":
        down = true;
        break;
      case "a":
        left = true;
        break;
      case "d":
        right = true;
        break;
    }
  }
  function checkKeyUp(e) {
    switch (e.key) {
      case "w":
        up = false;
        break;
      case "s":
        down = false;
        break;
      case "a":
        left = false;
        break;
      case "d":
        right = false;
        break;
    }
  }

  function cameraCallBack(x, y) {
    console.log(x, y);
    cameraX = x;
    cameraY = y;
  }

  function blankScreen() {
    mainCanvas = document.getElementById("window-canvas");
    mainCtx = mainCanvas.getContext("2d");
    mainCtx.fillStyle = "black";
    mainCtx.fillRect(0, 0, 640, 480);
  }
  function loop() {
    tileMap.drawBuffer();
    count += 1;
    for (const entity in entityLoop) {
      entityLoop[entity].setProps(setProps());
      // entity.loop()
    }
    for (const entity in entityLoop) {
      entityLoop[entity].loop();
    }
    for (const entity in entityLoop) {
      entityLoop[entity].draw();
    }
    mainCtx.drawImage(
      camera,
      parseInt(camera.dataset.x),
      parseInt(camera.dataset.y),
      cameraWidth,
      cameraHeight,
      0,
      0,
      mainCanvas.width,
      mainCanvas.height
    );
  }
  useEffect(() => {
    if (mounted === false) {
      setInterval(() => loop(), 16.66);
      blankScreen();
      setMounted(true);
      camera = document.getElementById("camera-canvas");
      cameraCtx = camera.getContext("2d");
      entityLoop = { 0: new Entity(setProps(), 64, 48) };
      mainCanvas = document.getElementById("window-canvas");
      mainCtx = mainCanvas.getContext("2d");
      tileMap.draw();
    }
  });

  return (
    <div className="full-screen" id="main-screen" width="100%" height="100%">
      <canvas
        height="240"
        width="320"
        id="window-canvas"
        style={{ width: "100%", height: "100%" }}
      ></canvas>
      <canvas
        height={tileMap.height}
        width={tileMap.width}
        id="buffer-canvas"
        hidden={true}
      />
      <canvas
        data-X={0}
        data-Y={0}
        data-cameraWidth={cameraWidth}
        data-cameraHeight={cameraHeight}
        height={tileMap.height}
        width={tileMap.width}
        id="camera-canvas"
        hidden={true}
      />
      <img src={TileSet} id="tile-set" hidden={true} />
      <div id="sheet-holder"></div>
    </div>
  );
}

export default Engine;