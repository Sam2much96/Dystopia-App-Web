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
 * (3) Decision Dialogue box (1/3)
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
 * 
 *  Bugs:
 * (1) hot wallet api is unreliable and require region specific configuration
 * (2)
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer, initTileCollision, tile,vec2} = LittleJS;


import Shop from "./Marketplace.json";

import {TopDownPlayer} from "../Characters/player";
import {Merchant} from "../Characters/NPC";
import {Utils} from "../../singletons/Utils";
import { Stairs } from '../UI & misc/Exit';


// to do : (1) import merchant npc (done)
// to do : (1) implement decision dialogue (1/2)
// to do

export class Marketplace extends EngineObject{
    LevelSize: LittleJS.Vector2 | null = null;
    tileLayer: LittleJS.TileLayer | undefined;
    LevelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    collisionGrid: number[][] = []; // for enemy navigation logic
    constructor(){
        super();
        this.loadMap();
    }

    async loadMap(){
        try{
            this.LevelSize = vec2(Shop.width, Shop.height);
            this.tileLayer = new TileLayer(vec2(0,0),this.LevelSize, tile(2, 128, 2, 0), vec2(1));
            console.log("Map width: %d", Shop.width, "/ Map Height:", Shop.height);
            initTileCollision(vec2(Shop.width,Shop.height));
            this.LevelData = Utils.chunkArray(Shop.layers[0].data, Shop.layers[0].width).reverse();
            this.LevelData.forEach((row, y) => {
                            row.forEach((val : any, x : any) => {
                                val = parseInt(val, 10);
                                if (val) {
                                    // to do:
                                    // (1) refactor from if conditionals to a recursive loop with lookup
            
                                    //console.log("val debug : ", val);
                                    /**
                                     * Tile Collision Layer Logic in badly written if conditionals
                                     * 
                                     * Features:
                                     * (1) sets tile collision for each tile on /off 
                                     * (2) creates objects spawns for object tiles
                                     * 
                                     * 
                                     */
                                    // temp player spawn tile
                                    // to do:
                                    // (1) Global sprite atlas table for parent class logic
                                    if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                                        window.player = new TopDownPlayer(vec2(x,y));

                                        //spawn merchant npc
                                        const r = new Merchant(vec2((x + .5),( y + 3.5)));
                                        console.log("marketplaceplayer spawn position debug: ",x,"/",y);

                                        this.levelObjects?.push(r);
                                        this.levelObjects?.push(window.player);
                                        return
                                    }

                                    // to do:
                                    // add exit tile for the marketplace (done)
                                    if (val ===56){ // stairs exit
                                        const o = new Stairs(vec2(x,y));
                                        this.levelObjects?.push(o);
                                        return
                                    }
                                    //70 is temple interior collision walls
                                    // 83 is the first white tile
                                    // 84 is the seconde white tiles
                                    if (val===84){
                                        //draw white tiles with collisions in the marketplace
                                        Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1); // 0 is for no collision, 1 is for collision
                                    }

                                    // to do:
                                    // (1) add collision tiles for the white tiles  in this level
            
                                    else{
                                        //console.log("tile debug: ", val);
                                        Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0); // 0 is for no collision, 1 is for collision
                                    }
                                    
                                    
                                    }})});
                                    
                        this.tileLayer.redraw();
            

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

    }

        
        destroy(): void {
            
            if (this.tileLayer) this.tileLayer.destroy();
            Utils.saveGame(); // save the game state once exiting the temple interior map
            if (this.levelObjects){ // destroy all instanced level objects
                for (const i of this.levelObjects!){
                    i.destroy();
            }
            this.levelObjects = null;
            }  
 
        }

}
