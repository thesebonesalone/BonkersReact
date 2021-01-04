import React, { useState, useEffect } from "react";
import Entity from "./Entity"
import SpriteSheet from "../PlayerSpriteSheet.png";

class Player extends Entity {
    constructor(props,x,y){
        super(props,x,y)
        this.name = "player"

    }
  
}

export default Player;
