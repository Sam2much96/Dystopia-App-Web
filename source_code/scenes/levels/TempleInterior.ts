import * as LittleJS from 'littlejsengine';

const {EngineObject, mainContext,setGravity,TileLayer,TileLayerData, rand,hsl,initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;

import templeMap from "./TempleInterior.json";
import { Utils } from '../../singletons/Utils';
import {TopDownPlayer} from "../Characters/player";

/**
 * Temple Interior Scene
 * 
 * 
 * requires:
 * (1) Ladder Object exit scene object
 * (2) NPC aboy
 * (3) Fire object
 * 
 */


let LevelSize = vec2(templeMap.width, templeMap.height);

export class TempleInterior extends EngineObject {

    tileLayer : LittleJS.TileLayer | null = null; // create a tile layer for drawing the lvl
    levelData: number[][] = []; // matrix data type

    constructor(){
        super();
        setGravity(0);

    }
    
    async loadMap(){
        try {

            console.log("Map width: %d", LevelSize.x, "/ Map Height:", LevelSize.y);
            this.tileLayer  = new TileLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0), vec2(1), 2); // create a tile layer for drawing the lvl
            initTileCollision(LevelSize);
            // load level data as chunks
            this.levelData = Utils.chunkArray(templeMap.layers[0].data , templeMap.layers[0].width ).reverse();

            this.levelData.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (val) {

                    }
                    else{ // every other tile
                        Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1);
                    }
                }
            )})

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }
    }

    destroy(): void {
        if (this.tileLayer){
            this.tileLayer.destroy();
        }
    }
}
