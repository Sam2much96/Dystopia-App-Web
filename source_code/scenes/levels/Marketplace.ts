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
            this.LevelData = this.chunkArray(Shop.layers[0].data, Shop.layers[0].width).reverse();
            this.LevelData.forEach((row, y) => {
                            row.forEach((val : any, x : any) => {
                                val = parseInt(val, 10);
                                if (!val) return;
                                const pos = LittleJS.vec2(x, y);
                                const config = TILE_CONFIG[val];
                                
                                if (!config) {
                                    // Default behavior for undefined tiles
                                    this.drawMapTile(pos, val - 1, this.tileLayer!, 0);
                                    return;
                                    }
                                                    // Draw tile if configured
                                                    if (config.draw) {
                                                    this.drawMapTile(pos, val - 1, this.tileLayer!, config.collision ? 1 : 0);
                                                    }
                                
                                                    // Spawn objects if configured
                                                    if (config.spawn) {
                                                        const spawned = config.spawn(pos, this);
                                                    // Handle single or multiple spawns
                                                    if (Array.isArray(spawned)) {
                                                        this.levelObjects?.push(...spawned);
                                                    }
                                                    else if (spawned) {
                                                        this.levelObjects?.push(spawned);
                                                    }
                                                    }
                                
                                })});
                                    
                        this.tileLayer.redraw();
            

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

    }

    drawChunks(chunks: any[], width: number, tileLayer : LittleJS.TileLayer, collision: number) {
                chunks.forEach(chunk => {
                    
                    // breaks here
                    const data = this.chunkArray(chunk, width).reverse();
                    
                    data.forEach((row: any, y: any) => {
                        row.forEach((val: any, x: any) => {
                            //console.log("x and y debug: ",x,"/",y);
                            val = parseInt(val, 10); // convert numbers to base 10
                            if (val) {
    
                                //console.log("val debug: ",val);
                                this.drawMapTile(vec2(x, y), val - 1, tileLayer, collision);
                            }
                        });
                    });
                });
            console.log("finished drawing chunk"); // works
        }
    
        chunkArray(array: number[], chunkSize: number) {
            /*
             * The function chunkArray takes an array of numbers & 
             * splits it into smaller chunks of a specified size.
             * 
             * It separates arrays into 30 size matrices as number[][]
             * each representing a different x and y dimentsion on the tilemap 
             */
    
            
            // algorithm helps loading the level data array as chunks
            const numberOfChunks = Math.ceil(array.length / chunkSize)
    
            return [...Array(numberOfChunks)]
                .map((value, index) => {
                    return array.slice(index * chunkSize, (index + 1) * chunkSize)
                })
        }
    
        drawMapTile(pos: LittleJS.Vector2, i : number = 1, layer: LittleJS.TileLayer, collision : number) {
                    
                    // docs:
                    // (1) tile index is the current tile to draw on the tile layer
                    //   it is mapped to e the environment layer's tilesheet
            
                    const tileIndex = i;
                    
                    const data = new TileLayerData(tileIndex);
                    
                    //console.log("tileset debug: ", tileIndex); //, "/ data: ", data
                    layer.setData(pos, data);
            
                    if (collision ) {
                        LittleJS.setTileCollisionData(pos,1);
            
                            // Record collision data in grid for enemy ai
                            // to do: (1) implement raycast for enemy ai 
                        //if (this.collisionGrid)this.collisionGrid[pos.y][pos.x] = 1;
                            
                    }
    
                  
                    
                    
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
