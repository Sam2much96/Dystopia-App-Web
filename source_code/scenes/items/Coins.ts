import * as LittleJS from 'littlejsengine';

//const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items } from './Items';

export class Coins extends Items {
    /**
     * 
     * Game Coin Object
     * 
     * to do:
     * (1) Add coins animation sprites
     * (2) Add ATC Transaction to coin collision 
     */
    //22

           constructor(pos : LittleJS.Vector2,tileIndex = 22){
                   super(pos,tileIndex, "Collectibles");
               }

              // add coins backsystem with proper cloud fare workers
}

