import * as LittleJS from 'littlejsengine';

//const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items } from '../../singletons/Utils';

export class HealthPotion extends Items{
        /**
     * 
     * Game Bomb Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */
   //21
       constructor(pos : LittleJS.Vector2,tileIndex = 21){
               super(pos,tileIndex, "Health Potion");
           }

}
