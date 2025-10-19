/**
 * 
 * Signpost Object
 * 
 * Requires:
 * (1) Dialogue box & dialogue singleton (done)
 * (2) Signpost sprite object (done)
 * 
 * Features:
 * (1) Attaches a dialogue trigger as a child object that triggers a dialogue event
 * (2) Shows player usefull info 
 * (3) Acts as an visual I/O for communicating the game state to the player
 * 
 * To Do:
 * (1) Implement signpost object in the overworld maps (1/2)
 * (2) Show the player translated dialogue (0/3)
 * 
 * Bugs:
 * (1) map can only have one signpost on every level unless the dialogue for each signpost can be set differently using some game logic / algorithm
 */
import * as LittleJS from 'littlejsengine';
import { DialogTrigger } from '../../singletons/Dialogs';
const {EngineObject,tile} = LittleJS;

export class Signpost extends EngineObject {

    // to do:
    // (1) create signpost object with collision
    // (2) trigger the dialogue singleton on collision with class text
    // (3) spawn signpost object on overworld map
    //public dialogue : string = ""; //placeholder text for all signpost
    private speaker : string = window.dialogs.t("dir3", window.dialogs.language) ;//"Signpost"; // to do: translate Signpost too
    private dialogueTrigger = new DialogTrigger(this.pos, this.size);

    private dialogue = window.dialogs.t("dir2", window.dialogs.language);
    constructor(pos : LittleJS.Vector2){
        super();
        this.pos = pos;
        this.tileInfo = tile(2, 128, 2, 0);
        // add the dialogue event trigger
        this.addChild(this.dialogueTrigger);
        this.dialogueTrigger.dialogue = this.dialogue;
        this.dialogueTrigger.speaker = this.speaker;
        

    }



}