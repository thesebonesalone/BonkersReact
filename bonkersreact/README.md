Welcome to Bonkers React! A React based game engine that uses a Rails backend!

This is very much in the Alpha stage so many features are missing, but here's a run down of what's included!

The Map Editor.

Everything here is stored in the Editor component. To access it please uncoment the Editor in App.js, and comment out Engine.

This is where you will define the maps you see in the game and how they will be traversed. At the moment there is no Edit prior maps function, so what you make is what you make. Be sure to be careful about what you commit to the database!

You will immediately see some useful data on the top of the screen, including the coordinates of the current tile you have selected in the tile selector, the coordinates of the mouse x and mouse y and the width and height in tiles of the current map.

You can click on a tile in the tile selection area and it will select a tile to use on the map screen. By clicking the map screen you place that tile. You can change the width and height of the tilemap by directly inputting a new height or width, but it’s recommended to adjust the height and width with the arrow on the inputs. By doing it this way you will preserve the map you are currently working on.

You will see two text input fields with the placeholder texts “Input Entity Loop Here” and “Define Exits Here” respectively. The first is where you tell the game which entities to load on any given map, the second is where you define how the player will exit the map. These follow very rigid syntax so please read the next section carefully.

When inputting an Entity the format is as such.
	Entityname X Y
	
In other words you would spawn a Bluewhale at the coordinates of 32, 32  by typing the following

	Bluewhale 32 32

If you want to add another entity simply press enter after the Y coordinate.

Exits are slightly trickier. The syntax is as follows.
	
	X Y Height Width GoToMapID Direction
If you wanted to place an exit at the top of the map, that sends the player up to the map with an ID of 2 you would type the following.
	
	16 0 2 32 2 up

You can add multiple exits by pressing enter after the direction.


The Engine.

This is what's actively running the Game Logic. At the moment the game is fitted with a very basic top down player view, you can use WASD to move and click on the different entities to find out their names.

Working on the engine is built to be pretty simple. To create a new Entity create a file in ./Assets/Entities and add the following code.

import React, { useState, useEffect } from "react"
import Entity from "./Entity"
import SpriteSheet from "../PlayerSpriteSheet.png"

class ((CREATE A CLASS NAME HERE)) extends Entity {
    constructor(props, x, y){
        super(props,x,y)
        this.name=((ENTIY NAME))
    }
}

export default ((CLASS NAME))


this will create a standard entity that can be added to a map.

Each entity has a few built in boolean variables that can be set in the constructor to help easily change some built in behavior.

setting this.movesWithKeysCheck to true in the constructor you can move the entity with the movement keys

setting this.bindCamera to entity to true makes the camera follow the player. If two entities have this value as true the camera will follow whichever entity was loaded in last.

setting this.animatesWithMovements to true will make the character animate in the standard way.


Each Entity has a few lifecycle methods that will be called each frame.

setProps() is where information from the engine will be passed to the Entity. Information is passed as an object and more info can be added in that object to keep your entities up to speed.

loop() is where all game logic is stored. Any calculations about the entity should be made here.

draw() is where the entity is drawn to the buffer. This is the final method called in each frame and should not be used for game logic.
