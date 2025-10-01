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
        this.mass = 1;
        this.currentFrame = 1; // set the current frame for the object

    }

}


/**
 * NPC Trader
 * 
 * Requires:
 * (1) Dialogs subsystem
 * (2) Decision Dialog
 * (3) Translated Dialogs
 * (4) Ads API
 * (5) Database implementation
 * (6) Shop API & Documentation
 * (7)
 * 
 * To Do:
 * (1)NPC movement logic
 */

export class Merchant extends NPC{

    constructor(pos : LittleJS.Vector2){
        super(pos);

        // to do:
        //(1) load npc tile
        //(2)
    }
}

/**
 * NPC Old Woman
 * 
 */


class OldWoman extends NPC{}

/**
 * NPC Aboy
 * 
 */
class NPC_Aboy extends NPC{}