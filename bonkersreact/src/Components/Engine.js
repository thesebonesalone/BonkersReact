import React, { Component, useState, useEffect, useRef } from "react";
import Entity from "../Assets/Entities/Entity";
import Player from "../Assets/Entities/Player";
import TileDraw from "./TileDraw";
import TileSet from "../Assets/TileSet.png";
import Raptor from "../Assets/Entities/Raptor";
import DireWolf from "../Assets/Entities/DireWolf";
import BlueWhale from "../Assets/Entities/BlueWhale";
import Urlis from "../Assets/Urlis";
import Exit from "../Assets/Exits/Exit";
function Engine() {
  const [mounted, setMounted] = useState(false);
  const [mouseDownTime, setMouseDownTime] = useState(0);
  const [clickedThing, setClickedThing] = useState("Loading...");
  const playerCoord = useRef({ x: 64, y: 48 });
  const loaded = useRef(false);
  const tileMap = useRef(null);
  const loading = useRef(false);
  const moveRight = useRef(false);
  const moveLeft = useRef(false);
  const moveDown = useRef(false);
  const moveUp = useRef(false);
  const mapNumber = useRef(1);
  const map = useRef([]);
  const entityLoop = useRef({});
  const exitLoop = useRef({});
  const loopInterval = useRef(null);
  let up = false;
  let down = false;
  let left = false;
  let right = false;
  let action = false;

  let count = 0;
  let mainCanvas = null;
  let mainCtx = null;
  let cameraX = 0;
  let cameraY = 0;
  let camera = null;
  let cameraCtx = null;
  let cameraWidth = 160;
  let cameraHeight = 120;
  let entityCount = 0;

  document.addEventListener("keydown", (e) => checkKeyDown(e));
  document.addEventListener("keyup", (e) => checkKeyUp(e));
  document.addEventListener("mousedown", (e) => handleMouseDown(e));
  document.addEventListener("mouseup", (e) => handleMouseUp(e));

  function setProps() {
    let camera = document.getElementById("camera-canvas");
    let cameraCtx = camera.getContext("2d");
    return {
      keys: { up: up, down: down, left: left, right: right, action: action },
      count: count,
      canvas: camera,
      ctx: cameraCtx,
      map: map.current,
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
      case "e":
        action = true;
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
      case "e":
        action = false;
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
    tileMap.current.drawBuffer();
    count += 1;
    for (const entity in entityLoop.current) {
      entityLoop.current[entity].setProps(setProps());
      // entity.loop()
    }
    for (const entity in entityLoop.current) {
      entityLoop.current[entity].loop();
    }
    for (const entity in entityLoop.current) {
      entityLoop.current[entity].draw();
    }
    for (const exit in exitLoop.current) {
      let player = entityLoop.current[0];
      exitLoop.current[exit].setProps({
        player: player,
        moveMaps: () =>
          moveMaps(exitLoop.current[exit].goTo, exitLoop.current[exit].kind),
      });
    }
    for (const exit in exitLoop.current) {
      exitLoop.current[exit].loop();
    }
    mainCtx.translate(0.5,0.5)
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

    mainCtx.fillStyle = "blue";
    mainCtx.fillRect(
      mainCanvas.dataset.mousex,
      mainCanvas.dataset.mousey,
      3,
      3
    );
    mainCtx.translate(-0.5,-0.5)
  }

  function moveMaps(goTo, kind) {
    clearInterval(loopInterval.current);
    setClickedThing("loading...");
    playerCoord.current = {x: entityLoop.current[0].x, y: entityLoop.current[0].y}
    mapNumber.current = goTo;
    tileMap.current = null;
    setMounted(false);
    map.current = [];
    loading.current = false;
    entityLoop.current = {};
    exitLoop.current = {};
    switch (kind) {
      case "right":
        moveRight.current = true;
        break;
      case "left":
        moveLeft.current = true;
        break;
      case "up":
        moveUp.current = true;
        break;
      case "down":
        moveDown.current = true;
        break;
    }
  }

  function handleMouseMove(e) {
    let offset = e.target.getBoundingClientRect();
    let newMouseX = Math.floor(
      ((e.clientX - offset.left) * e.target.width) / e.target.clientWidth
    );
    let newMouseY = Math.floor(
      ((e.clientY - offset.top) * e.target.height) / e.target.clientHeight
    );

    let mainCanvas = document.getElementById("window-canvas");
    mainCanvas.dataset.mousex = newMouseX;
    mainCanvas.dataset.mousey = newMouseY;
    // debugger
  }
  useEffect(() => {
    if (mounted === false && map.current.length > 0) {
      console.log("moving");
      loopInterval.current = setInterval(() => loop(), 16.66);
      blankScreen();
      setMounted(true);
      camera = document.getElementById("camera-canvas");
      cameraCtx = camera.getContext("2d");

      mainCanvas = document.getElementById("window-canvas");
      mainCtx = mainCanvas.getContext("2d");
      tileMap.current.draw();
    }
    if (map.current.length === 0 && loading.current === false) {
      loading.current = true;
      fetch(Urlis + "/map/show/" + `${mapNumber.current}`)
        .then((resp) => resp.json())
        .then((newMap) => {
          //If you want to create a default map, this is the place
          let brandNew = newMap.tiles.split("[").filter((string) => {
            return string !== "";
          });
          let newMapReturn = [];
          let count = 0;
          for (const string in brandNew) {
            newMapReturn[count] = brandNew[string]
              .split(",")
              .filter((s) => {
                return s !== "";
              })
              .filter((s) => {
                return s !== "]";
              })
              .map((s) => {
                return parseInt(s);
              });
            count += 1;
          }
          map.current = newMapReturn;
          tileMap.current = new TileDraw(map.current);
          function asyncEntities(entities) {
            let newEntities = entities.split("\n");
            let emptyEntities = [];
            for (const index in newEntities) {
              let entity = newEntities[index].split(" ");
              switch (entity[0]) {
                // Add any new Entity creation to this loop

                case "Direwolf":
                  emptyEntities[index] = new DireWolf(
                    setProps(),
                    parseInt(entity[1]),
                    parseInt(entity[2])
                  );
                  break;
                case "Bluewhale":
                  emptyEntities[index] = new BlueWhale(
                    setProps(),
                    parseInt(entity[1]),
                    parseInt(entity[2])
                  );
                  break;
                case "Raptor":
                  emptyEntities[index] = new Raptor(
                    setProps(),
                    parseInt(entity[1]),
                    parseInt(entity[2])
                  );
                  break;
              }
            }
            let currentX
            let currentY
            if (entityLoop.length > 0){
              currentX = entityLoop.current[0].x
              currentY = entityLoop.current[0].y
            } else {
              currentX = playerCoord.current.x
              currentY = playerCoord.current.y
            }

            entityLoop.current = {
              0: new Player(
                setProps(),
                currentX,
                currentY
              ),
            };

            playerCoord.current = {x: currentX, y: currentY}
            if (moveRight.current){
              // debugger
              entityLoop.current[0].x = 8
              entityLoop.current[0].y = currentY
              moveRight.current = false
            }
            if (moveLeft.current){
              entityLoop.current[0].x = tileMap.current.width - 24
              entityLoop.current[0].y = currentY
              moveLeft.current = false
            }
            if (moveUp.current){
              entityLoop.current[0].y = tileMap.current.height - 24
              entityLoop.current[0].x = currentX
              moveUp.current = false
            }
            if (moveDown.current){
              entityLoop.current[0].y = 8
              entityLoop.current[0].x = currentX
              moveDown.current = false
            }
            for (const index in emptyEntities) {
              entityLoop.current[parseInt(index) + 1] =
                emptyEntities[parseInt(index)];
            }
          }
          exitLoop.current = {}
          function asyncExits(exits) {
            let lines = exits.split('\n')
            for (const index in lines) {
              let commands = lines[index].split(' ')
              exitLoop.current[index] = new Exit({}, commands[0], commands[1], commands[2], commands[3], commands[4], commands[5])
            }
          }

          function loadCallback(entities) {
            setTimeout(() => asyncEntities(entities), 16);
            setTimeout(() => asyncExits(newMap.exits), 16);
            setClickedThing("Nada");
          }

          setTimeout(() => loadCallback(newMap.entities), 200);
        });
    }
  });
  function handleMouseDown(e) {
    console.log(entityLoop.current);
    const mainCanvas = document.getElementById("window-canvas");
    const camera = document.getElementById("camera-canvas");
    if (mouseDownTime === 0) {
      let newMouseTime = mouseDownTime + 1;
      setMouseDownTime(newMouseTime);
      let mouseX = mainCanvas.dataset.mousex;
      let mouseY = mainCanvas.dataset.mousey;
      let diffW = camera.dataset.camerawidth / mainCanvas.width;
      let diffH = camera.dataset.cameraheight / mainCanvas.height;
      mouseX = mouseX * diffW;
      mouseY = mouseY * diffH;
      mouseX = parseInt(mouseX) + parseInt(camera.dataset.x);
      mouseY = parseInt(mouseY) + parseInt(camera.dataset.y);
      for (const entity in entityLoop.current) {
        let e = entityLoop.current[entity];
        if (
          mouseX >= e.cb.left &&
          mouseX <= e.cb.right &&
          mouseY >= e.cb.top &&
          mouseY <= e.cb.bottom
        ) {
          setClickedThing(e.name);
        }
      }
    }
  }

  function handleMouseUp(e) {
    setMouseDownTime(0);
  }

  function RenderPlayArea() {
    return (
      <React.Fragment>
        <div
          className="full-screen"
          id="main-screen"
          width="50%"
          height="50%"
        >
          <canvas
            data-mousex="0"
            data-mousey="0"
            height="240"
            width="320"
            id="window-canvas"
            style={{ width: "50%", height: "50%" }}
            onMouseMove={(e) => handleMouseMove(e)}
          ></canvas>
          <canvas
            height={tileMap.current.height}
            width={tileMap.current.width}
            id="buffer-canvas"
            hidden={true}
          />
          <canvas
            data-X={0}
            data-Y={0}
            data-cameraWidth={cameraWidth}
            data-cameraHeight={cameraHeight}
            height={tileMap.current.height}
            width={tileMap.current.width}
            id="camera-canvas"
            hidden={true}
          />
          <img src={TileSet} id="tile-set" hidden={true} />
          <div id="sheet-holder"></div>
        </div>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <h2>{clickedThing !== "Nada" ? clickedThing : "Nothing is Clicked"}</h2>
      {tileMap.current !== null ? RenderPlayArea() : null}
    </React.Fragment>
  );
}

export default Engine;
