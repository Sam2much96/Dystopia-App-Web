import * as LittleJS from 'littlejsengine';

const {EngineObject, mainContext,setGravity,TileLayer,TileLayerData,  rand,hsl,tile,vec2} = LittleJS; //initTileCollision, setTileCollisionData,

import templeMap from "./TempleInterior.json";
import { TILE_CONFIG } from './SpriteAtlas';



//import {Signpost} from '../items/Signpost';

//NPC
//imp
/**
 * Temple Interior Scene
 * 
 * 
 * to do:
 * (1) Quest subsystem (done)
 * (2) Proper Temple interior collision
 * (3) Fire object (1/2) : Edit Enemy spawner object into 2 inherited objects sharing the fire animations
 * (4) Fix missing temple interior frame
 * (5) fix temple dungeon scene break
 * (6) blood splatter fx tiles are now enemy objects
 * (7) finish tiemple interior wall collisions
 * (8) implement tile atlas for drawing dungeon levels
 * (9) implement decision dialogue for entering and exiting dungeon
 *                         // to do:
                        // (1) structure the level collision data properly (done)
                        // (2) NPC shaman collision should trigger the quest sub system (done)
                        // (3) Add fire object with no collisions to layer 2 object positions (1/2)
 * 
 * bugs:
 * (1) enemy collisions cannot be triggered by player bug
 * (2) buggy collisions logic from tiled editor
 * (3) no dungeon sounds
 * (4) no dungeon ui
 * (5) there are ghost collisions in my tile scenes
 */




export class TempleInterior extends EngineObject {

    tileLayer : LittleJS.TileLayer | null = null; // create a tile layer for drawing the lvl
    levelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    collisionGrid: number[][] = []; // for enemy navigation logic
    constructor(){
        super();
        LittleJS.setGravity(0);
        //LittleJS.setGravity(vec2(0));// = 0
        //console.log('Level load triggered');
        //console.log('Number of gameObjects:', LittleJS.engineObjects.length);
        //console.log('Globals:', window.globals);

        //load the game map
        (async () => {
            await this.loadMap();
        })();

    }
    
    async loadMap(){
        try {

            // to do:
            // (1) lock tile data into global tile atlas resource external to the scene
            let LevelSize = vec2(templeMap.width, templeMap.height);

            console.log("Temple Dungeon Level size debug: ", LevelSize);

            //console.log("Map width: %d", LevelSize.x, "/ Map Height:", LevelSize.y);
            this.tileLayer  = new TileLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0)); // create a tile layer for drawing the lvl
            //initTileCollision(LevelSize);

            //initialise an empty collision grid for enemy nav logic
            this.collisionGrid = Array(templeMap.height)
                .fill(null)
                .map(() => Array(templeMap.width).fill(0));

            // load level data as chunks
            this.levelData = this.chunkArray(templeMap.layers[0].data , templeMap.layers[0].width ).reverse();
            //debug level data
           // console.log("level data debug: ", this.levelData);
            this.levelData.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (!val) return;
                                        const pos = LittleJS.vec2(x, y);
                                        const config = TILE_CONFIG[val];
                    
                                        if (!config) {
                                            // Default behavior for undefined tiles
                                            //this.drawMapTile(pos, val - 1, this.tileLayer!, 0);
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
                    
                   
                }
            )})

            this.tileLayer.redraw();
            //Debug or save your collision grid for pathfinding ai
            // 
            //console.log(JSON.stringify(this.collisionGrid));

            // play dungeon 1 sfx
            window.music.dungeon_sfx_1.play();


        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }
    }

    destroy(): void {
        if (this.tileLayer){
            this.tileLayer.destroy();

        //Utils.saveGame(); // save the game state once exiting the temple interior map
        if (this.levelObjects){ // destroy all instanced level objects
            for (const i of this.levelObjects!){
                i.destroy();
                
            }
            this.levelObjects = null;
        }
        }

        LittleJS.engineObjects.length = 0;// clear existing objects
    }

    drawMapTile(pos: LittleJS.Vector2, i = 1, layer: LittleJS.TileLayer, collision : number) {
            
            // docs:
            // (1) tile index is the current tile to draw on the tile layer
            //   it is mapped to e the environment layer's tilesheet
    
            // bugs:
            // (1) does not draw 4 tiles after the temple tile
            const tileIndex = i;
            
            const data = new TileLayerData(tileIndex);
            
            //console.log("tileset debug: ", tileIndex); //, "/ data: ", data
            layer.setData(pos, data);
    
            if (collision ) {
                LittleJS.setTileCollisionData(pos,1);
    
                    // ✅ Record in grid
                if (this.collisionGrid)this.collisionGrid[pos.y][pos.x] = 1;
                    
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
        
    
}
