/**
 * 
 * Exit Objects
 * All Exit Objects in this game
 * 
 *  to do:
 * (1) finish writing and implementing dungeon 1 data into the game
 * (2) add vec2(0.45, 0.5) offset to every exit object parent class to fix an offset bug
 * 
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;

import { OverWorld } from '../levels/OverworldTopDown';
import { OverworldSideScrolling } from '../levels/OverworldSideScrolling';
import { Marketplace } from '../levels/Marketplace';
import { TempleInterior } from '../levels/TempleInterior';

export class Hole extends EngineObject {
    /**
     * 
     * Level Exit Collision Object
     * 
     * to do:
     * (1) 
     * (2)  
     */
    ENABLE : boolean = true;
    constructor(posi : LittleJS.Vector2){

        super()
        this.tileInfo = tile(3, 128, 2, 4); // set hole tile 22
        this.pos = posi.add(vec2(0.45, 0.5)); // add offset
        this.size = vec2(1);  

    }

    render(){
        drawTile(this.pos, this.size, tile(3, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player && this.ENABLE){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("Player Entered Exit");
                

                
                //logic
                //save player stats via global function
                window.player.destroy();
                //destroy the overworld scene and player
                window.map.destroy();
                // spawn the new overworld scene 
                
                console.log("Loading the new level");
                window.map = new OverworldSideScrolling();
                this.destroy();
            }
        }
    }
}

export class House1 extends EngineObject {
    /**
     * 
     * Level Exit Collision Object
     * 
     * to do:
     * (1) temporarily disabled for Marketplace and translations implementation
     * (2)  
     */
    ENABLE : boolean = false;
    tileNumber : number;
    constructor(posi : LittleJS.Vector2){

        super()
        this.tileNumber = 48;
        this.tileInfo = tile(this.tileNumber, 128, 2, 4); // set house 1 tile 48
        this.pos = posi;
        this.size = vec2(1);  

    }

    render(){
        drawTile(this.pos, this.size, tile(this.tileNumber, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player && this.ENABLE){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("Player Entered Exit");
                

                
                //logic
                //save player stats via global function
                window.player.destroy();
                //destroy the overworld scene and player
                window.map.destroy();
                // spawn the new overworld scene 
                
                console.log("Loading the new level");
                window.map = new Marketplace();
                this.destroy();
            }
        }
    }
}


export class House2 extends House1 {
    constructor(posi : LittleJS.Vector2){
        super(posi);
        this.tileNumber =49;
    }
}

export class Stairs extends EngineObject { // temple interior exit scene
    ENABLE : boolean = true;

    constructor(pos : LittleJS.Vector2){
        super()
        this.pos = pos.add(vec2(0.45, 0.5)); // add offset
    }


    render(){
        drawTile(this.pos, this.size, tile(55, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player && this.ENABLE){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("Player Entered Staircase Exit");
                

                
                //logic
                //save player stats via global function
                window.player.destroy();
                //destroy the overworld scene and player
                window.map.destroy();
                // spawn the new overworld scene 
                
                console.log("Loading the new level");
                window.map = new OverWorld();
                this.destroy();
            }
        }
    }
}

export class TempleDoor extends EngineObject{ // temple exterior door
ENABLE : boolean = true;
    constructor(posi : LittleJS.Vector2){

        super()
        this.tileInfo = tile(44, 128, 2, 0); // set Temple ext door tile 44
        this.pos = posi;
        //this.size = vec2(1);  

    }

    render(){
        drawTile(this.pos, this.size, tile(44, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player && this.ENABLE){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("Player Entered Temple Entrance");
                

                
                //logic
                //save player stats via global function
                window.player.destroy();
                //destroy the overworld scene and player
                window.map.destroy();
                // spawn the new overworld scene 
                
                console.log("Loading Temple Interior");
                window.map = new TempleInterior();
                this.destroy();
            }
        }
    }
}