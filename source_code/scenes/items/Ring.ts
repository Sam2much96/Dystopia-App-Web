import * as LittleJS from 'littlejsengine';

//const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items } from './Items';

export class Ring extends Items {
    /**
     * 
     * Ring Item (collect)
     * 
     * Features:
     * (1) A collectible ring item
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */
    //27
    constructor(pos : LittleJS.Vector2,tileIndex = 27){
            super(pos,tileIndex, "Ring");
        }
}
