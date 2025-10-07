import * as LittleJS from 'littlejsengine';
import { Player} from './player';
import { Utils, PhysicsObject  } from '../../singletons/Utils';
import { QuestGivers } from '../../singletons/Quest';

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
    public questTimer = new Timer(); // for stopping quest process spam in collision detection
    public timeout : number = 10; // timer timeout
    public QuestTriggered: boolean = false; // quest trigger checker
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
        //if (!this.QuestTriggered && isOverlapping(this.pos, this.size, window.player.pos, window.player.size) ) { // if hit collission and attack state
       //     console.log("NPC Hit Collision Detection Triggered");
            // to do:
            // (1) trigger dialogue box (done)
            // (2) implement dialogue translation (1/2)
            // (3) implement decision dialogue
            //enemy.hitCollisionDetected();
        //    this.QuestTriggered = true // softlock this logic
        //    this.questTimer.set(this.timeout);

           
        //}
        //if (this.questTimer.elapsed()){
        //    this.QuestTriggered = false;
        //}
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
        //(2) trigger ads api upon collision (done)
        //(3) Smart  contract escrow
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

            // 
            // reward player with some coin tokens
            //window.inventory.set("suds", 5_000);
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
    update(): void {
        if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size) ) {
            // to do
            //(1) implement dialogue translation as a dialogue singleton subsystem
            window.dialogs.show_dialog("old woman","I wouldn't jump into that hole if i were you! the ground there's not stable at all!" );
        }

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
        this.setCollision(false,false,false,false); // make object not solid


    }

    update(): void {
        //super.update();
         if (!this.QuestTriggered && isOverlapping(this.pos, this.size, window.player.pos, window.player.size) ) {

            // shaman dialogue
            // to do:
            // (1) test quest subsystem (done)
            //(2) connect quest subsystem (done)
            // (3) create quest giver with timeout to stop quest spamming
            //window.dialogs.show_dialog("shaman","quest update coming soon! ");
             // trigger quest giver logic to fetch the appropriate dialogue text
            let quest_diag=QuestGivers.process("fetch quest 1","hey! can get me 1 bomb? thanks", "Bomb", 1, "Arrow",5,"Thank you for the bomb", "please, remember to get me 1 Bomb!");
            window.dialogs.show_dialog("shaman",quest_diag); // print the dialogue text out to the player
            this.QuestTriggered = true;
            this.questTimer.set(this.timeout);
            return
        }
        if (this.questTimer.elapsed()){this.QuestTriggered = false; return}
        
    }
}