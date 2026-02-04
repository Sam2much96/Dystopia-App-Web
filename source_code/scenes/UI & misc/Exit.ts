/**
 * 
 * Exit Objects
 * All Exit Objects in this game
 * 
 *  to do:
 * (1) finish writing and implementing dungeon 1 data into the game
 * (2) add vec2(0.45, 0.5) offset to every exit object parent class to fix an offset bug
 * (3) implement exit to 3d overworld levels (1/2)
 * 
 * bug:
 * (1) auto deletes enemies, and bugs out level reloads
 * 
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;

import { OverWorld } from '../levels/OverworldTopDown';
import { OverworldSideScrolling } from '../levels/OverworldSideScrolling';
import { Marketplace } from '../levels/Marketplace';
import { TempleInterior } from '../levels/TempleInterior';
import { OverWorld3D } from '../levels/Overworld3D';
import {Utils} from "../../singletons/Utils";


// Base Exit Class
// Features:
// (1) saves the to scene to globals singleton
class Exit extends EngineObject{
    public ENABLE : boolean = true;
    public to_scene_as_str : string;
    public to_scene : OverWorld | OverworldSideScrolling | Marketplace | TempleInterior | undefined;
    public tileIndex : number; // hole is default exit
    //private to_scene : any = null;

    constructor(posi : LittleJS.Vector2, size : number, tileIndex : number, to_scene_as_str : string){
        super()
        this.pos = posi;
        this.size = vec2(size);
        this.tileIndex = tileIndex;
        this.to_scene_as_str = to_scene_as_str;
    }

    destroy(){

        //this.destroy();
        // save the scene to the globals
        window.globals.current_level = this.to_scene_as_str;

        Utils.saveGame();
    }

    render(){
        drawTile(this.pos, this.size, tile(this.tileIndex, 128, 2, 0), this.color, 0, this.mirror);        
    }

    update(){

        if (window.player && this.ENABLE){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("Player Entered ", this.to_scene_as_str);
                

                
                //logic
                //save player stats via global function
                window.player.destroy();
                //destroy the overworld scene and player
                window.map.destroy();
                
                // spawn the new overworld scene 
                
                console.log("Loading the new level");

                
                

                // each exit extension has to load their own new scene
                if (this.to_scene_as_str === "Overworld"){
                    window.map = new OverWorld();
                }
                else if (this.to_scene_as_str === "Overworld 2"){
                    window.map = new OverworldSideScrolling();
                }
                else if (this.to_scene_as_str === "Overworld 3"){
                    window.map = new OverWorld3D();
                }
                else if (this.to_scene_as_str === "Marketplace"){
                    window.map = new Marketplace();
                }
                else if (this.to_scene_as_str ==="Temple"){
                    window.map = new TempleInterior();
                }
                else { //default exception
                    window.map = new OverWorld();
                }

                this.destroy();
            }
        }
    }

}




export class Hole extends Exit {
    /**
     * 
     * Level Exit Collision Object
     * 
     * to do:
     * (1) 
     * (2)  
     */
    constructor(posi : LittleJS.Vector2){

        super(posi, 1,3, "Overworld 2");
    }

    
}

export class House1 extends Exit {
    /**
     * 
     * Level Exit Collision Object
     * 
     * to do:
     * (1) temporarily disabled for Marketplace and translations implementation
     * (2)  
     */
    //ENABLE : boolean = true;
    //tileNumber : number;
    constructor(posi : LittleJS.Vector2, size = 1, tileindx = 48){

        super(posi, size,tileindx, "Marketplace");
    }
}


export class House2 extends House1 {
    constructor(posi : LittleJS.Vector2){
        super(posi,1,49);
    }
}

export class Stairs extends Exit { // temple interior exit scene
    
    constructor(pos : LittleJS.Vector2){
        super(pos.add(vec2(0.45, 0.5)),1,55, "Overworld");
        //this.pos = pos.add(vec2(0.45, 0.5)); // add offset
    }

    
}

export class TempleDoor extends Exit{ // temple exterior door

    constructor(posi : LittleJS.Vector2){

        super(posi,1,44, "Temple")
        
    }

}

// to do:
// (1) implement overworld 3d scene
// (2) implement overworld 3d collisions

export class Spaceship1 extends Exit{
    constructor(posi : LittleJS.Vector2, size = 1, tileIndx = 96){
        super(posi,size,tileIndx, "Overworld 3");
    }

}


export class Spaceship2 extends Spaceship1{
    constructor(posi : LittleJS.Vector2){
        super(posi,1,97)
    }
}