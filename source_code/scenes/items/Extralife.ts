import * as LittleJS from 'littlejsengine';

import { Items } from './Items';

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
