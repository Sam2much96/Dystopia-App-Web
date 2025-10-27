import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items } from '../../singletons/Utils';

export class Arrow extends Items{
    /**
     * 
     * Game Arrow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * (3) implement bullet object for implementing the arrow item's item use
     * (4) implement translated item collect dialogue
     * (5) implement an item base class for ease of update
     * 
     * 
     */
    constructor(pos : LittleJS.Vector2,tileIndex = 23){
        super(pos,tileIndex, "Arrow");
    }
  
}


export class Bullet extends EngineObject{
    // Bullet class object shared by all projectile objects
    // implements the arrow item use
    // spawns a projectile that moves in a straight line and despawns all enemy objects in it's path
    // to do:
    // (1) finish item implementation

    // logic:
    // (0) set bullet item to the arrow item tile
    // (1) rotate bullet item to face the player's facing position
    // (2) translate bullet object position in a straight line
    // (3) despawn object once it's out the camera render / a despawn timer has passed
    constructor(pos : LittleJS.Vector2, facing : string){
        super();
    }

}