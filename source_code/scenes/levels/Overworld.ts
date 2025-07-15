import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;


//import * as tiled from "@kayahr/tiled";
import overMap from "./overworld.json";
import {Bomb} from "../items/Bomb";

export class OverWorld extends EngineObject{
    /*
        Features

        (1) This render is only adapted to an infinite map

        Unused 
        The Overworld Scene + Objects as children

        Example: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/platformer/gameLevel.js
        Example 2:  https://github.com/eoinmcg/gator/blob/main/src/levels/loader.js
        Example 3 : https://gitlab.com/gcnet-uk/games/worktime/-/blob/main/src/entities/player.ts?ref_type=heads

        Notes:
        (1) LJS doesn't support slanted tiles out the box, 
            youll have to use a custom Engine object with triangle collision for those tiles
            e.g. : new EngineObject(pos, size, 0, vec2(0,0), 1, triangleShape); 
        Bugs:
        (1) Doesn't account for tiled 0.11 data type with chunk layers
        (2) Needs more json debug to recursively adjust logic ( done)
        (3) The objects layer is offset by a couple of horizontal movements
         ( This bug was from merging the layers into a single render as androids don't support muliple layer renders)

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
        
        initTileCollision(vec2(33,54));
        //this.tempExtLayer.setCollision(true,true,true,true);
                
        const chunkArray = (array : any, chunkSize : any) => {
            const numberOfChunks = Math.ceil(array.length / chunkSize)

            return [...Array(numberOfChunks)]
                .map((value, index) => {
                return array.slice(index * chunkSize, (index + 1) * chunkSize)
                })
        }

        const drawMapTile = (pos : any, i = 80, layer : any, collision = 1) => {
            const tileIndex = i;
            const data = new TileLayerData(tileIndex);
            layer.setData(pos, data);
            if (collision) {
            setTileCollisionData(pos, collision);
            }
        }

        const tileCollisionLookup: Record<number, boolean> = {
            10: true,
            15: true,
            20: true,
            // etc.
        };
        // bug:
        //(1) object collision only triggers when the player collides with an item object. It's disabled before
        // (2) the ground tiles and object tiles have confliging tilemap

        // Extract and draw tree/object layer (6 chunks)
        // object chunk has some overlay
        
        //this.treesObjectLayer.redraw(); //objects layers turned of for bad positioning

        // Extract and draw ground layer (7 chunks)
        // get the chunk size to determine the splice size
        
        //const chunk = overMap.layers[0].chunks[0];
        //const chunkWidth = chunk.width;   // 16
        //const chunkHeight = chunk.height; // 16
        //console.log("chunk size debug: ", chunkWidth, "/", chunkHeight); // 16/16
        const groundChunks = chunkArray(overMap.layers[0].data, overMap.layers[0].width).reverse();
        
        // ground chunk width ?
        //console.log("ground chunk width: ", groundChunks[0].width); // 16 chunks 
        /// parameters
        // (1) tile data
        // (2) 16 chunks
        // (3) Layer to draw
        // (4) Collisions
        
        //this.drawChunks(groundChunks, overMap.width, this.tempExtLayer, false);

        // to do : (1) create a tile lookup for the trees
        groundChunks.forEach((row, y) => {
            row.forEach((val : any, x : any) => {
                val = parseInt(val, 10);
                if (val) {
                    // to do:
                    // (1) refactor from if conditionals to a recursive loop with lookup

                    //console.log("val debug : ", val);

                    if (val ===3 ){ // signpost
                        // signpost tile draws with collision
                        // to do : (1) replace tile collision with signpost object that triggers a dialog box
                        console.log("to do : (1) replace tile collision with signpost object that triggers a dialog box"); 
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 8 ){ // boulder
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 10){ // trees
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 11){ // mushroom big
                        // tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 12){ // mushroom small
                        // mushroom small tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 15){ // temp ext tile
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 16){ // temp ext tile
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 17){ // temp ext tile
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 18){ // temp ext
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 19){ // temp ext
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 20){ // temp ext
                        // trees tile draws with collision
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    //21 is bomb
                    if (val ===21){ // bomb object

                        // works
                        const u = new Bomb(vec2(x, y));
                        return

                    }
                    
                    if (val === 29){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 30){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 31){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 32){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 33){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    if (val === 34){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 43){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 44){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 45){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 46){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 47){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 48){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 57){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 58){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 59){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 60){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 61){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 62){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 71){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 72){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 73){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 75){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 76){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 85){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 86){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 87){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 88){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 89){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }
                    if (val === 90){ // temple exterior
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 1);
                    }

                    else {
                        //console.log("tile debug: ", val);
                        drawMapTile(vec2(x, y), val - 1, this.tempExtLayer, 0); // 0 is for no collision, 1 is for collision
                    }
                    }})});
        //const objectChunks = overMap.layers[1].chunks.slice(0, 5);
        //this.drawChunks(objectChunks, overMap.width, this.tempExtLayer,false); // collision works

        // bug: mobiles can only draw 1 tile layer
        // Extract and draw temple exterior (1 chunk)
        //const templeChunk = overMap.layers[2].chunks[0];
        //this.drawChunks([templeChunk], templeChunk.width, this.tempExtLayer,false);
        
        this.tempExtLayer.redraw();



    }

    drawChunks(chunks: any[], width: number, tileLayer : LittleJS.TileLayer, collision: boolean) {
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

    drawMapTile(pos: LittleJS.Vector2, i = 1, layer: LittleJS.TileLayer, collision : boolean) {
        
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
}

