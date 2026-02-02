/**
 * Top Down Marketplace / Shop
 * 
 * Features:
 * (1) Connects the game to the blockchain via hot wallet api functionality
 * (2) 
 * 
 * requires:
 * (1) Shop Exit Object (done)
 * (2) NPC Merchant (done)
 * (3) Decision Dialogue box (2/3)
 * (4) UI Translations (1/3)
 * (5) hot wallet api (1/3)
 * 
 * to do:
 * (1) add money burning functionality into shop merchant logic
 * (2) flesh out shop implementation fully with new pixel art
 * (3) implement new shop UI
 * (4) implement item rewards
 * (5) fix hot wallet api implementation
 * (6) implement token reward on ads successful viewing
 * (7) improve item purchase ui & ux
 * 
 *  Bugs:
 * (1) hot wallet api is unreliable and require region specific configuration
 * (2) implement cloudfare runner for connecting shop ui to web 3.0 backend
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, initTileCollision, tile,vec2} = LittleJS;


import Shop from "./Marketplace.json";

import { LoadMap } from './LoadMap';

export class Marketplace extends EngineObject{
    LevelSize: LittleJS.Vector2 | null = null;
    tileLayer: LittleJS.TileLayer | undefined;
    LevelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    collisionGrid: number[][] = []; // for enemy navigation logic
    constructor(){
        super();
        // new load map funtion
        LoadMap(Shop, this.levelObjects!);
    }



    

        
        destroy(): void {
            
            if (this.tileLayer) this.tileLayer.destroy();
            //Utils.saveGame(); // save the game state once exiting the temple interior map
            if (this.levelObjects){ // destroy all instanced level objects
                for (const i of this.levelObjects!){
                    i.destroy();
            }
            this.levelObjects = null;
            }  
            LittleJS.engineObjects.length = 0; // clear existing objects
 
        }

}


