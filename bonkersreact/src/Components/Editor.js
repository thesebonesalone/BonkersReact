import TileSet from "../Assets/TileSet.png"; //Add your preffered TileSet here
import React, { useState, useEffect } from "react";
import Urlis from '../Assets/Urlis'

function Editor() {
  const [mouseX, setMouseX] = useState(0); //mouse coordinates in the map
  const [mouseY, setMouseY] = useState(0);
  const [tileMouseX, setTileMouseX] = useState(0); //mouse coordinates in the tilemap selector
  const [tileMouseY, setTileMouseY] = useState(0);
  const [tileX, setTileX] = useState(0); //coordinates of the tilemap's selected sprite
  const [tileY, setTileY] = useState(0);
  const [tileWidth, setTileWidth] = useState(40); //how wide the tilemap is
  const [tileHeight, setTileHeight] = useState(40); //how tall the tilemap is
  const [rendered, setRendered] = useState(false); //sees if the component is doing its first render. If it is it defines all of the dimensions of the canvas
  const [drawFirstBuffer, setDrawFirstBuffer] = useState(true); //sees if buffer has been drawn to yet, if not it builds the scene array and draws the grid to the buffer
  const [sceneArray, setSceneArray] = useState([[0]]); //the output array of the scene
  const canvasWidth = 1000; //defines the size of the canvas in the window. Resize as needed for styling
  const [entityLoad,setEntityLoad] = useState("")
  const [exitLoad, setExitLoad] = useState("")

  useEffect(() => {
    if (tileWidth < 1) {
      setTileWidth(1);
    }
    if (tileHeight < 1) {
      setTileHeight(1);
    }
    const mainCanvas = document.getElementById("main-canvas");
    const tileCanvas = document.getElementById("tile-canvas");
    function summer(total, num) {
      return total + num;
    }
    if (drawFirstBuffer) {
      //checks if the buffer has been drawn or if the tile width and height has changed. if so it creates a new array and sets it properly
      const bufferCanvas = document.getElementById("buffer-canvas");
      const bctx = bufferCanvas.getContext("2d");
      bufferCanvas.width = tileWidth * 17 + 1 * (tileWidth < 1);
      bufferCanvas.height = tileHeight * 17 + 1 * (tileHeight < 1);
      bctx.fillStyle = "white";
      bctx.fillRect(0, 0, bufferCanvas.width, bufferCanvas.height);

      for (var i = 1; i < tileWidth; i++) {
        bctx.beginPath();
        bctx.strokeStyle = "black";
        bctx.lineWidth = "1";
        bctx.moveTo(i * 17, 0);
        bctx.lineTo(i * 17, tileHeight * 17);
        bctx.stroke();
      }
      for (var i = 1; i < tileHeight; i++) {
        bctx.beginPath();
        bctx.strokeStyle = "black";
        bctx.lineWidth = "1";
        bctx.moveTo(0, i * 17);
        bctx.lineTo(tileWidth * 17, i * 17);
        bctx.stroke();
      }

      let oldScene = sceneArray;
      let scene = Array(tileHeight);
      for (var i = 0; i < tileHeight; i++) {
        scene[i] = Array(tileWidth);
        for (var j = 0; j < tileWidth; j++) {
          scene[i][j] = 0;
        }
      }
      let hasTiles = false;
      oldScene.forEach((row) => {
        if (row.reduce(summer) > 0) {
          hasTiles = true;
        }
      });

      if (hasTiles) {
        console.log("Scene has tiles");
        let rowCount = 0;
        oldScene.forEach((row) => {
          let colCount = 0;
          if (rowCount < tileHeight) {
            row.forEach((value) => {
              if (colCount < tileWidth) {
                scene[rowCount][colCount] = oldScene[rowCount][colCount];
                let yy = Math.floor(value / 8);
                let xx = value - yy;
                drawTile(colCount, rowCount, xx, yy);
              }
              colCount += 1;
            });
          }
          rowCount += 1;
        });
      }
      setSceneArray(scene);

      setDrawFirstBuffer(false);
    }
    tileCanvas.width = canvasWidth / 2;
    tileCanvas.height = canvasWidth / 2;
    mainCanvas.width = canvasWidth;
    mainCanvas.height = canvasWidth;
    setRendered(true);
  });
  function drawTile(x, y, tilex, tiley) {
    let tiles = document.getElementById("tile-set");
    const bufferCanvas = document.getElementById("buffer-canvas");
    const bctx = bufferCanvas.getContext("2d");
    bctx.drawImage(
      tiles,
      tilex * 16,
      tiley * 16,
      16,
      16,
      x * 17,
      y * 17,
      16,
      16
    );
  }
  function postMap(){
    let newTiles = '['
    for (let i = 0; i < sceneArray.length; i ++){
      newTiles += "["
      for (let j = 0; j < sceneArray[i].length; j ++){
        newTiles += `${sceneArray[i][j]},`
      }
      newTiles += "],"
    }
    newTiles += "]"
    console.log(newTiles)

    let data = {map: {
      tiles: newTiles,
      entities: entityLoad,
      exits: exitLoad
    }}
    let reqObj = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }
    fetch(Urlis + '/map/create', reqObj)
    .then(resp => resp.json())
    .then(message => console.log(message))
  }




  if (rendered) {
    const mainCanvas = document.getElementById("main-canvas");
    const ctx = mainCanvas.getContext("2d");
    const bufferCanvas = document.getElementById("buffer-canvas");
    const bctx = bufferCanvas.getContext("2d");
    const tileCanvas = document.getElementById("tile-canvas");
    const tctx = tileCanvas.getContext("2d");
    const image = document.getElementById("tile-set");
    
    ctx.fillStyle = "red";
    ctx.drawImage(bufferCanvas, 0, 0, canvasWidth, canvasWidth);
    tctx.drawImage(image, 0, 0, canvasWidth / 2, canvasWidth / 2);
    ctx.fillStyle = "blue";
    // ctx.drawRect
    ctx.fillRect(mouseX - 8, mouseY - 8, 16, 16);
    tctx.beginPath();
    tctx.lineWidth = "4";
    tctx.strokeStyle = "blue";
    tctx.rect(
      tileX * (canvasWidth / 2 / 8),
      tileY * (canvasWidth / 2 / 8),
      canvasWidth / 2 / 8,
      canvasWidth / 2 / 8
    );

    tctx.stroke();
    tctx.fillRect(tileMouseX - 8, tileMouseY - 8, 16, 16);
  }
  function handleMouseMove(e) {
    let offset = e.target.getBoundingClientRect();
    setMouseX(e.clientX - offset.left);
    setMouseY(e.clientY - offset.top);
  }
  function handleTileMove(e) {
    let offset = e.target.getBoundingClientRect();
    setTileMouseX(e.clientX - offset.left);
    setTileMouseY(e.clientY - offset.top);
  }

  function handleTileClick(e) {
    setTileX(Math.floor(tileMouseX / (canvasWidth / 2 / 8)));
    setTileY(Math.floor(tileMouseY / (canvasWidth / 2 / 8)));
  }
  function handleMapClick(e) {
    let xx = Math.floor(mouseX / (canvasWidth / tileWidth));
    let yy = Math.floor(mouseY / (canvasWidth / tileHeight));
    drawTile(xx, yy, tileX, tileY);

    let newScene = sceneArray;
    newScene[yy][xx] = tileX + tileY * 8;
    setSceneArray(newScene);
  }

  function handleTileChange(e) {
    if (e.target.name === "tile-width") {
      if (e.target.value) {
        setTileWidth(e.target.value);
      } else {
        setTileWidth(1);
      }
    } else if (e.target.name === "tile-height") {
      if (e.target.value) {
        setTileHeight(e.target.value);
      } else {
        setTileHeight(1);
      }
    }
    setDrawFirstBuffer(true);
  }
  function sceneArrayBuilder() {
    let newString = "[";
    sceneArray.forEach((row) => {
      newString += `[${row}],`;
    });
    newString += "]";
    return newString;
  }
  function handleEntityChange(e){
    setEntityLoad(e.target.value)
  }
  function handleExitsChange(e){
    setExitLoad(e.target.value)
  }
  function handleMapSubmit(e){
    e.preventDefault()
    postMap()
  }


  return (
    <div>
      <h2>Editor</h2>
      <h3>Current Tile {`${tileX}, ${tileY}`}</h3>
      <h3>
        Mouse X: {Math.floor((mouseX / canvasWidth) * tileWidth * 16)}, Mouse Y:{" "}
        {Math.floor((mouseY / canvasWidth) * tileHeight * 16)}
      </h3>
      <form>
        <input
          type="number"
          name="tile-width"
          placeholder="tile-width"
          value={tileWidth}
          onChange={(e) => handleTileChange(e)}
        ></input>
        <input
          type="number"
          name="tile-height"
          placeholder="tile-height"
          value={tileHeight}
          onChange={(e) => handleTileChange(e)}
        ></input>
      </form>
      <div className="container">
        <div className="row">
          <div className="col-">
            <canvas
              id="main-canvas"
              onMouseMove={(e) => handleMouseMove(e)}
              onClick={(e) => handleMapClick(e)}
            ></canvas>
          </div>
          <canvas id="buffer-canvas" hidden="true"></canvas>
          <img id="tile-set" src={TileSet} hidden="true"></img>
          <div className="col-">
            <form onSubmit={(e) => handleMapSubmit(e)}>
              <textarea placeholder="Input Entity Loop Here" value={entityLoad} onChange={(e) => handleEntityChange(e)}></textarea>
              <textarea placeholder="Define Exits Here" value={exitLoad} onChange={(e) => handleExitsChange(e)}></textarea>
              <input type="submit" value="Save Map"></input>
            </form>
            <canvas
              id="tile-canvas"
              onMouseMove={(e) => handleTileMove(e)}
              onClick={(e) => handleTileClick(e)}
            ></canvas>{" "}
            <input type="text" value={sceneArrayBuilder()} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editor;
