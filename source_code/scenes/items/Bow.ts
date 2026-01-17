import * as LittleJS from 'littlejsengine';

//const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items } from './Items';

export class Bow extends Items{
    /**
     * 
     * Game Bow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */
    //24
          constructor(pos : LittleJS.Vector2,tileIndex = 24){
                  super(pos,tileIndex, "Bow");
              }

}
