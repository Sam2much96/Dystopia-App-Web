import overMap from "./OverworldSideScrolling.json";

import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;

export class OverworldSideScrolling extends EngineObject {


    LevelSize: LittleJS.Vector2 = vec2(overMap.width, overMap.height); // get the level size
    tileLayer : LittleJS.TileLayer = new TileLayer(vec2(0,0), this.LevelSize, tile(2, 128, 2, 0)); // create a tile layer for drawing the lvl
    ground_layer: number[][] = []; // matrix data type

    constructor(){
        super();

        console.log("Map width: %d", overMap.width, "/ Map Height:", overMap.height);

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

                    if (val === 2){ // skull head
                        drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                    }

            }})});
        
        this.tileLayer.redraw();

    }
}