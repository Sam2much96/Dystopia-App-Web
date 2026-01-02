import * as LittleJS from 'littlejsengine';

const {EngineObject, mainContext,setGravity,TileLayer,TileLayerData, TileCollisionLayer, rand,hsl,tile,vec2} = LittleJS; //initTileCollision, setTileCollisionData,

import templeMap from "./TempleInterior.json";
import { Utils } from '../../singletons/Utils';
import {TopDownPlayer} from "../Characters/player";
import {Shaman} from "../Characters/NPC";
import { Stairs } from '../UI & misc/Exit';
import { EnemySpawner } from '../UI & misc/Enemyspawner';
import {Enemy} from "../Characters/enemy";
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
 * 
 * bugs:
 * (1) enemy collisions cannot be triggered by player bug
 */


let LevelSize = vec2(templeMap.width, templeMap.height);

export class TempleInterior extends EngineObject {

    tileLayer : LittleJS.TileLayer | null = null; // create a tile layer for drawing the lvl
    levelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    collisionGrid: number[][] = []; // for enemy navigation logic
    constructor(){
        super();
        //setGravity(0);
        LittleJS.setGravity(vec2(0));// = 0
        console.log('Level load triggered');
        console.log('Number of gameObjects:', LittleJS.engineObjects.length);
        console.log('Globals:', window.globals);

        //load the game map
        (async () => {
            await this.loadMap();
        })();

    }
    
    async loadMap(){
        try {

            // to do:
            // (1) lock tile data into global tile atlas resource external to the scene

            //console.log("Map width: %d", LevelSize.x, "/ Map Height:", LevelSize.y);
            this.tileLayer  = new TileCollisionLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0)); // create a tile layer for drawing the lvl
            //initTileCollision(LevelSize);

            //initialise an empty collision grid for enemy nav logic
            this.collisionGrid = Array(templeMap.height)
                .fill(null)
                .map(() => Array(templeMap.width).fill(0));

            // load level data as chunks
            this.levelData = Utils.chunkArray(templeMap.layers[0].data , templeMap.layers[0].width ).reverse();
            //debug level data
           // console.log("level data debug: ", this.levelData);
            this.levelData.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (val) {

                        // to do:
                        // (1) structure the level collision data properly
                        // (2) NPC shaman collision should trigger the quest sub system
                        // (3) Add fire object with no collisions to layer 2 object positions
                        if (val === 1){ // no collision temple interior tiles
                            console.log("drawing tile 0shsdhsdgsfjgsjsfjsjgg");
                            this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0);
                            return
                        }

                        if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                            window.player = new TopDownPlayer(vec2(x,y));
                            
                            // spawn the shaman NPC
                            // the quest giver
                            const m = new Shaman(vec2((x+2), (y+1)));

                            this.levelObjects?.push(m);
                            this.levelObjects?.push(window.player);
                            return
                        }
                        if (val === 26){ // blood splatter fx marker
                            let r = new Enemy(vec2(x,y));
                            this.levelObjects?.push(r);
                            window.globals.enemies.push(r);
                            return                            
                        }
                    
                        // to do: (1) fire object
                        // to do : (2) set blood fx positions to enemy spawn points
                        if (val === 35){ // first fire tile as enemy spawner placeholder
                            const i = new EnemySpawner(vec2(x, y));
                            //const i = new Enemy(vec2(x,y));
                            this.levelObjects?.push(i);
                            return
                        }
                        if (val ===56){ // stairs exit
                            const o = new Stairs(vec2(x,y));
                            this.levelObjects?.push(o);
                            return

                        }
                        if (val === 69){ // no collision temple interior tiles
                            this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0);
                            return
                        }
                        if (val === 70){ // collision walls temple interior tiles
                            this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1);
                            return
                        }
                        // to do :
                        // (1) write item spawner for enemy random drops
                        else{ // every other tile
                            this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0);
                            return
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
    
            if (collision && layer instanceof LittleJS.TileCollisionLayer) {
                layer.setCollisionData(pos,1);
    
                    // ✅ Record in grid
                if (this.collisionGrid)this.collisionGrid[pos.y][pos.x] = 1;
                    
            }
        }
    
    
}
