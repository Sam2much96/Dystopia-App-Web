import * as LittleJS from 'littlejsengine';

const {EngineObject, mainContext, setGravity,TileLayer,TileLayerData, initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;

import overMap from "./OverworldSideScrolling.json";

import {SideScrollPlayer} from "../Characters/player";

export class OverworldSideScrolling extends EngineObject {

    /**
     * Overworld Sidescrolling level
     * 
     * Features:
     * (1) Exit Collisions are the blank white tiles
     * (2) Sets scene gravity
     * 
     */


    LevelSize: LittleJS.Vector2 | null = null; // get the level size
    tileLayer : LittleJS.TileLayer | null = null; // create a tile layer for drawing the lvl
    ground_layer: number[][] = []; // matrix data type

    // to do: add exit collision underneath the level and logic to transition to overworld level

    constructor(){
        super();
        setGravity(-.035); // apply global gravity
        this.loadMap();
        
    }

    async loadMap(){
        try {
            //const response = await fetch("./OverworldSideScrolling.json");

            //if (!response.ok) throw new Error("Network Error");
            //const overMap = await response.json();
            //console.log('Map data:', overMap);

            //to do: (1) draw parallax backgrounds

        
            console.log("Map width: %d", overMap.width, "/ Map Height:", overMap.height);


            this.LevelSize = vec2(overMap.width, overMap.height); // get the level size
            this.tileLayer  = new TileLayer(vec2(0,0), this.LevelSize, tile(2, 128, 2, 0)); // create a tile layer for drawing the lvl
            

            initTileCollision(vec2(overMap.width,overMap.height));

            // function for loading the level data from the json files as chunks
            const chunkArray = (array : number[], chunkSize : number) => {
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

            // load level data as chunks
            this.ground_layer = chunkArray(overMap.layers[0].data, overMap.layers[0].width).reverse();

            this.ground_layer.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (val) {

                        // to do: create lookup logic for the ground layer tiles
                        // to doL create parallax background css logic for rhis layer
                        //console.log("overmap val debug : ", val);
                        
                        // temporary player spawn tile
                        if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                            window.player = new SideScrollPlayer(vec2(x,y));
                            return
                        }

                        if (val === 63){ // corner tile
                            drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }

                        if (val === 64){ // corner tile 2
                            drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }

                        if (val === 65){ // corner tile 3
                        drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }
                        else{ // every other tile
                        drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }

                        //exit tile


                }})});
            
            this.tileLayer.redraw();

        
        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }


    }

    destroy(): void {
        if (this.tileLayer) this.tileLayer.destroy();
        setGravity(0);// reset gravity
    }

}