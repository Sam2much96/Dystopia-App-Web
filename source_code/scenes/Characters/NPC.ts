import * as LittleJS from 'littlejsengine';
import { Player} from './player';
import { Utils, PhysicsObject  } from '../../singletons/Utils';

const {vec2, drawTile, isOverlapping, Timer,tile} = LittleJS;

/**
 * NPC
 * 
 * Base NPC class
 */


class NPC extends PhysicsObject {
    constructor(pos : LittleJS.Vector2){
        super();
        this.pos = pos;
        this.mass = 0; // static mass
        this.currentFrame = 1; // set the current frame for the object

    }

    render(){
        // draw the Merchant tiles (3)
        // this is gotten from the arrangement of tile data in game.ts engine init
        // where tileset 3 is the npc tileset
        //console.log(this.currentFrame); 
        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 3, 0), this.color, 0, this.mirror);

    }

}


/**
 * NPC Trader
 * 
 * Requires:
 * (1) Dialogs subsystem
 * (2) Decision Dialog
 * (3) Translated Dialogs
 * (4) Ads API (done)
 * (5) Database implementation
 * (6) Shop API & Documentation (1/5)
 * (7) Updated Enemy Movement Logic
 * 
 * To Do:
 * (1)NPC movement logic
 */

export class Merchant extends NPC{

    constructor(pos : LittleJS.Vector2){
        super(pos);
        this.currentFrame = 2; // frame 2 (counting from 0) is supposed to be the merchant tile
        // to do:
        //(1) load npc tile (done)
        //(2)
    }


}

/**
 * NPC Old Woman
 * 
 * Features:
 * (1) spawns in overworld top down levels
 */


export class OldWoman extends NPC{
    constructor(pos : LittleJS.Vector2){
        super(pos);
        this.currentFrame = 1; // frame 1 is for the npc in the NPC tileset
    }
}

/**
 * Shaman NPC 
 * 
 * Features:
 * (1) The quest giver
 * (2) Spawns in Temple interior level
 */
export class Shaman extends NPC{
    constructor(pos : LittleJS.Vector2){
        super(pos);
        this.currentFrame = 0;
    }
}