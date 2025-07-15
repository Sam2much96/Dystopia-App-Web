import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;


//import * as tiled from "@kayahr/tiled";
import overMap from "./overworld.json";

export class OverWorld extends EngineObject{
    /*
        Unused 
        The Overworld Scene + Objects as children

        Example: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/platformer/gameLevel.js
        Example 2:  https://github.com/eoinmcg/gator/blob/main/src/levels/loader.js
        
        Bugs:
        (1) Doesn't account for tiled 0.11 data type with chunk layers
        (2) Needs more json debug to recursively adjust logic
        */
    //LOADED: boolean = false;
    tileLookup: any;
    LevelSize: LittleJS.Vector2 = vec2(overMap.width, overMap.height);

    // drawing more than one tile bugs out on mobile browsers
    tempExtLayer: LittleJS.TileLayer = new TileLayer(vec2(0,0), this.LevelSize, tile(2, 128, 2, 0));

    layerCount: number = overMap.layers.length;
    ground_layer: number[][] = []; // matrix data type
    ENABLE: boolean = true;
    RENDERED : Boolean = false;
    constructor() {
        super();
        
        

        //this is needed for extra collision logic, drawing collision items, coins etc et al
        // this is used to create object instead of tile
        // bug : redo for godot 128x tileset 
        this.tileLookup =
        {
            coins: 0,
            bomb: 1,
            desert: 2,
            bones: 3,
            tree_1: 4,
            tree_2: 5,
            three_d_dune_1: 6,
            three_d_dune_2: 7,
            signpost: 8,
            ring: 9,
            extra_life: 10,
            grass: 11,
            flowers: 12,
            big_boulder: 13,
            small_boulder: 14,
            spaceship: 15,
            exit: 16, // doors
        }

        
        // TO DO:
        // (1) Organise debug for logic arrangement
        // (2) Recusively handle data chunks with the appropriate algorithm
        //this.LevelSize = vec2(overMap.width, overMap.height);
        //this.layerCount = overMap.layers.length; // would be 1 cuz only 1 leve's made
        
        console.log("Layer count:", this.layerCount);
        console.log("Map width: %d", overMap.width, "/ Map Height:", overMap.height);


        // tile drawing function
        // to do:
        // (1) make class function

        //LittleJS.tileCollision.initTileCollision;
        
        initTileCollision(vec2(30,20));
        this.tempExtLayer.setCollision(true,true,true,true);
        


        // Extract and draw tree/object layer (6 chunks)
        const objectChunks = overMap.layers[1].chunks.slice(0, 5);
        this.drawChunks(objectChunks, overMap.width, this.tempExtLayer,true); // collision works
        //this.treesObjectLayer.redraw(); //objects layers turned of for bad positioning

        // Extract and draw ground layer (7 chunks)
        const groundChunks = overMap.layers[0].chunks.slice(0, 6);
        this.drawChunks(groundChunks, groundChunks[0].width, this.tempExtLayer, false);


        // bug: mobiles can only draw 1 tile layer
        // Extract and draw temple exterior (1 chunk)
        const templeChunk = overMap.layers[2].chunks[0];
        this.drawChunks([templeChunk], templeChunk.width, this.tempExtLayer,false);
        
        this.tempExtLayer.redraw();



    }

    drawChunks(chunks: any[], width: number, tileLayer : LittleJS.TileLayer, collision: boolean) {
            chunks.forEach(chunk => {
                const data = this.chunkArray(chunk.data, width).reverse();
                data.forEach((row: any, y: any) => {
                    row.forEach((val: any, x: any) => {
                        val = parseInt(val, 10); // convert numbers to base 10
                        if (val) {
                            this.drawMapTile(vec2(x, y), val - 1, tileLayer, collision);
                        }
                    });
                });
            });
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

    drawMapTile(pos: LittleJS.Vector2, i = 1, layer: LittleJS.TileLayer, collision : boolean) {
        
        // docs:
        // (1) tile index is the current tile to draw on the tile layer
        //   it is mapped to e the environment layer's tilesheet

        const tileIndex = i;
        
        const data = new TileLayerData(tileIndex);
        
        //console.log("tileset debug: ", tileIndex, "/ data: ", data);
        layer.setData(pos, data);

        if (collision) {
            // works
            // note : collission detection requires using the engine's physics impl
            setTileCollisionData(pos,1);
        
        }
    }
}

