import * as LittleJS from 'littlejsengine';
import { Player} from './player';
import { Utils, PhysicsObject  } from '../../singletons/Utils';
import { QuestGivers } from '../../singletons/Quest';
import { DialogTrigger } from '../../singletons/Dialogs';

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
 * (1) Dialogs subsystem (done)
 * (2) Decision Dialog (0/3)
 * (3) Translated Dialogs (0/3)
 * (4) Ads API (done)
 * (5) Database implementation (1/3)
 * (6) Shop API & Documentation (2/5)
 * (7) Updated Enemy Movement Logic (2/3)
 * 
 * To Do:
 * (1) NPC movement logic (2/3)
 * (2) Give NPC Oldwoman Kill Count Quest
 * (3) Give NPC Merchant decision dialogue
 */

export class Merchant extends NPC{

    public ADS_TRIGGERED : boolean = false;
    public adsTimer = new Timer;
    private dialogue = new DialogTrigger(this.pos, this.size); //dialogue trigger works
    private diag1 : string  = window.dialogs.t("diag1", window.dialogs.language) ;
    private speaker : string = window.dialogs.t("Merchant", window.dialogs.language) ;
    constructor(pos : LittleJS.Vector2){
        super(pos);
        this.currentFrame = 2; // frame 2 (counting from 0) is supposed to be the merchant tile
        this.setCollision(false,false,false,false); // make object not collide
        
        //set the npc dialogue
        this.dialogue.dialogue = this.diag1;
        this.dialogue.speaker = this.speaker;

        //parent the dialogue trigger
        this.addChild(this.dialogue);

        // initilize ads singleton for the first time
        // initilisez the ads singleton ad triggers one auto ads on chrome devices    
        window.ads.initialize(); 

        // to do:
        //(1) load npc tile (done)
        //(2) trigger ads api upon collision (done)
        //(3) Smart  contract escrow (0/3)
    }

    update(): void {

        // Ads trigger checker
        // only triggers the ads once
        // to do:
        // (1) add cooldown timer for ads trigger checker
        if (!this.ADS_TRIGGERED && isOverlapping(this.pos, this.size, window.player.pos, window.player.size) ) { // if hit collission and attack state
            
            // testing dialogues trigger 
            // dialogue trigger handles this dialogue

            //show banner ads
           // 
            window.ads.showAds();
            this.ADS_TRIGGERED = true;
            
            //
            // to do:
            // (1) implement coin logic
            // (2) implement coin calculation
            // (3) fix wallet api
            // (4) implement random enemy item drops

            //create a 8 minutes 20 seconds ads trigger cooldown
            this.adsTimer.set(500);

            // to do:
            // (1) reward player with some coin tokens
            // (2) implement item hud ui for inventory hud updates
            // (3) serialise wallet data and wallet api to game hud 
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
 * 
 * To Do:
 * (1) Implement kill count quest for this NPC
 */


export class OldWoman extends NPC{
    private dialogueTrigger = new DialogTrigger(this.pos, this.size); //dialogue trigger works
    private dialogue : string = window.dialogs.t("diag2");
    private speaker : string = window.dialogs.t("old_woman");
    constructor(pos : LittleJS.Vector2){
        super(pos);
        this.currentFrame = 1; // frame 1 is for the npc in the NPC tileset
        //this.isSolid = false;
        this.setCollision(false,false,false,false); // make object not collide
        

        //set the npc dialogue
        // to do:
        // (1) dialogue translations
        this.dialogueTrigger.dialogue = this.dialogue;
        this.dialogueTrigger.speaker =this.speaker;
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
    private item_needed : string = window.dialogs.t("Bomb") ;
    private amount : number = 1;
    private npcName :string = window.dialogs.t("shaman"); 
    private quest : string = window.dialogs.t("quest");
    private questdiag : string = window.dialogs.t("questdiag1") + " " + this.item_needed + "x " + this.amount + "?";
    private questdiag2 : string = window.dialogs.t("questdiag2") +" " + this.item_needed
    private questdiag3 : string = window.dialogs.t("questdiag3") + " " + this.amount + " " + this.item_needed;
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
            // (2) connect quest subsystem (done)
            // (3) create quest giver with timeout to stop quest spamming
            // (4) fix quest ui quest serialisation

            //window.dialogs.show_dialog("shaman","quest update coming soon! ");
             // trigger quest giver logic to fetch the appropriate dialogue text
            let quest_diag=QuestGivers.process(this.quest,this.questdiag, "Bomb", 1, "Arrow",5,this.questdiag2, this.questdiag3);
            window.dialogs.show_dialog(this.npcName,quest_diag); // print the dialogue text out to the player
            this.QuestTriggered = true;
            this.questTimer.set(this.timeout);
            return
        }
        if (this.questTimer.elapsed()){this.QuestTriggered = false; return}
        
    }
}