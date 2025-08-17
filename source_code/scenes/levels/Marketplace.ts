/**
 * Top Down Marketplace/ Shop
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;


import Shop from "./Marketplace.json";

import {TopDownPlayer} from "../Characters/player";
// to do : (1) import merchant npc
// to do : (1) implement decision dialogue

export class Marketplace extends EngineObject{
    LevelSize: LittleJS.Vector2 | null = null;
    tileLayer: LittleJS.TileLayer | undefined;
    LevelData: number[][] = []; // matrix data type

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

            
                                    
                                        //console.log("tile debug: ", val);
                                        this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0); // 0 is for no collision, 1 is for collision
                                    
                                    }})});
                                    
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
    
            if (collision) {
                setTileCollisionData(pos,1);
            
            }
        }
    
        destroy(): void {
            
            if (this.tileLayer) this.tileLayer.destroy();
            
    
            
        }

}
