
import * as LittleJS from 'littlejsengine';

const {vec2, TileLayerData, TileLayer, EngineObject, drawTile, tile, isOverlapping} = LittleJS; //setTileCollisionData,
import { TILE_CONFIG } from './SpriteAtlas';

export function LoadMap(Map : any, levelObjects : any[]){

    /**
     * Load Map Funtion
     * 
     * Takes in the Tiled Json map and an empty array as a parameter
     *  
     */
          function chunkArray(array: number[], chunkSize: number) {
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
        function drawMapTile(pos: LittleJS.Vector2, i : number = 1, layer: LittleJS.TileLayer, collision : number) {
                    
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
            
    

    try{
            
            
            let LevelSize = vec2(Map.width, Map.height);
            let tileLayer = new TileLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0), vec2(1));
            //console.log("Map width: %d", Shop.width, "/ Map Height:", Shop.height);
            LittleJS.initTileCollision(vec2(Map.width,Map.height));
            let LevelData = chunkArray(Map.layers[0].data, Map.layers[0].width).reverse();
            LevelData.forEach((row, y) => {
                            row.forEach((val : any, x : any) => {
                                val = parseInt(val, 10);
                                if (!val) return;
                                const pos = LittleJS.vec2(x, y);
                                const config = TILE_CONFIG[val];
                                
                                if (!config) {
                                    // Default behavior for undefined tiles
                                    drawMapTile(pos, val - 1, tileLayer!, 0);
                                    return;
                                    }
                                                    // Draw tile if configured
                                                    if (config.draw) {
                                                    drawMapTile(pos, val - 1, tileLayer!, config.collision ? 1 : 0);
                                                    }
                                
                                                    // Spawn objects if configured
                                                    if (config.spawn) {
                                                        const spawned = config.spawn(pos, []);
                                                    // Handle single or multiple spawns
                                                    if (Array.isArray(spawned)) {
                                                        levelObjects?.push(...spawned);
                                                    }
                                                    else if (spawned) {
                                                        levelObjects?.push(spawned);
                                                    }
                                                    }
                                
                                })});
                                    
                        tileLayer.redraw();
            

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

}