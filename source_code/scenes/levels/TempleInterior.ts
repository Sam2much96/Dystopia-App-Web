import * as LittleJS from 'littlejsengine';

const {EngineObject, mainContext,setGravity,TileLayer,TileLayerData, rand,hsl,initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;

import templeMap from "./TempleInterior.json";
import { Utils } from '../../singletons/Utils';
import {TopDownPlayer} from "../Characters/player";
import { Stairs } from '../UI & misc/Exit';
import { EnemySpawner } from '../UI & misc/Enemyspawner';
/**
 * Temple Interior Scene
 * 
 * 
 * requires:
 * (1) Ladder Object exit scene object (done)
 * (2) NPC aboy
 * (3) Fire object (1/2) : Edit Enemy spawner object into 2 inherited objects sharing the fire animations
 * 
 */


let LevelSize = vec2(templeMap.width, templeMap.height);

export class TempleInterior extends EngineObject {

    tileLayer : LittleJS.TileLayer | null = null; // create a tile layer for drawing the lvl
    levelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    constructor(){
        super();
        setGravity(0);
        this.loadMap();

    }
    
    async loadMap(){
        try {

            console.log("Map width: %d", LevelSize.x, "/ Map Height:", LevelSize.y);
            this.tileLayer  = new TileLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0), vec2(1), 2); // create a tile layer for drawing the lvl
            initTileCollision(LevelSize);
            // load level data as chunks
            this.levelData = Utils.chunkArray(templeMap.layers[0].data , templeMap.layers[0].width ).reverse();
            //debug level data
            console.log("level data debug: ", this.levelData);
            this.levelData.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (val) {


                        if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                            window.player = new TopDownPlayer(vec2(x,y));
                            return
                        }
                        //if (val === 0){ // bow object
                            
                        //}
                        //if (val === 0){ // NPC quest giver
                            
                        //}
                        // to do: (1) fire object
                        if (val === 35){ // first fire tile as enemy spawner placeholder
                            const i = new EnemySpawner(vec2(x, y));
                            this.levelObjects?.push(i);
                            return
                        }
                        if (val ===56){ // stairs exit
                            const o = new Stairs(vec2(x,y));
                            this.levelObjects?.push(o);
                            return

                        }
                        if (val === 69){ // no collision tiles
                            Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0);
                        }
                        if (val === 70){ // collision walls
                            Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1);
                        }
                        // to do :
                        // (1) write item spawner for enemy random drops
                        else{ // every other tile
                            Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0);
                        }

                    }
                   
                }
            )})

            this.tileLayer.redraw();

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }
    }

    destroy(): void {
        if (this.tileLayer){
            this.tileLayer.destroy();

        if (this.levelObjects){ // destroy all instanced level objects
            for (const i of this.levelObjects!){
                i.destroy();
                
            }
            this.levelObjects = null;
        }
        }
    }
}
