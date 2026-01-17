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

import { TILE_CONFIG } from './SpriteAtlas';

import {TopDownPlayer} from "../Characters/player";

import {Merchant} from "../Characters/NPC";
import {Utils} from "../../singletons/Utils";
import { Stairs } from '../UI & misc/Exit';
import { LoadMap } from './LoadMap';

// to do : (1) import merchant npc (done)
// to do : (1) implement decision dialogue (1/2)
// to do (1) create a single load map script and export it for all functions fromt 

export class Marketplace extends EngineObject{
    LevelSize: LittleJS.Vector2 | null = null;
    tileLayer: LittleJS.TileLayer | undefined;
    LevelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    collisionGrid: number[][] = []; // for enemy navigation logic
    constructor(){
        super();
        
        // old depreciated load map function
        //this.loadMap();

        // new load map fimctopm
        LoadMap(Shop, this.levelObjects!);
    }

    // to do:
    // (1) rewrite as a static function and lock impl into utils.ts (done)
    

    

        
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


