import * as LittleJS from 'littlejsengine';
import { Player} from './player';
import { Utils, PhysicsObject  } from '../../singletons/Utils';

const {vec2, drawTile, isOverlapping, Timer,tile} = LittleJS;

/**
 * NPC
 * 
 * Base NPC class
 * 
 * Features:
 * (1) Triggers adverstising singleton
 * 
 * To do:
 * (1) Implement wallet api into script for sending txn to chain
 * (2) Implement decision dialogue box 
 * (3) Implement NPC dialogue
 * (4) Implement NPC dialogue translations via dialogue singleton
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
    
    update() : void {
        //trigger hit collision detection for NPC
        if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size) ) { // if hit collission and attack state
            console.log("NPC Hit Collision Detection Triggered");
            // to do:
            // (1) trigger dialogue box
            // (2) implement dialogue translation
            // (3) implement decision dialogue
            //enemy.hitCollisionDetected();
        }
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

    public ADS_TRIGGERED : boolean = false;
    public adsTimer = new Timer;

    constructor(pos : LittleJS.Vector2){
        super(pos);
        this.currentFrame = 2; // frame 2 (counting from 0) is supposed to be the merchant tile
        this.setCollision(false,false,false,false); // make object not collide
        // to do:
        //(1) load npc tile (done)
        //(2) trigger ads api upon collision
    }

    update(): void {

        // Ads trigger checker
        // only triggers the ads once
        // to do:
        // (1) add cooldown timer for ads trigger checker
        if (!this.ADS_TRIGGERED && isOverlapping(this.pos, this.size, window.player.pos, window.player.size) ) { // if hit collission and attack state
            //show banner ads
            window.dialogs.show_dialog("You have no coins, and you want to earn free coins from ads? Okay", "Merchant");
            window.ads.showAds();
            this.ADS_TRIGGERED = true;
            
            //create a 8 minutes 20 seconds ads trigger cooldown
            this.adsTimer.set(500);
        }
        if (this.adsTimer.elapsed()){
            this.ADS_TRIGGERED = false;
        }
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
        //this.isSolid = false;
        this.setCollision(false,false,false,false); // make object not collide
    }
    //update(): void {
    //    super.update();
    //}
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