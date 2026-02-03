/**
 * The Game's Top Down Overworld Map
 * 
 * Bugs:
 * (1) Breaks on mobile browsers when changing scenes (not sure why it breaks, i've tried resizing the level into 2, and it didn't work)
 * (2) Takes too long to load the entire overmap level in mobile browser
 * (3) 2d game devel breaks on yandex browsers
 * (4) level redesign breaks in latest littlejs and current versions
 * 
 * To Do:
 * (1) remove all boiler plate code so this level codebase is more maintainable
 * (2) simplify all boiler plate code into a for loop
 * (3) implement a tile atlas for each object
 */
import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, ParticleEmitter, tile,vec2} = LittleJS; //initTileCollision, setTileCollisionData



// all items used in this level
import overMap from "./overworld.json";
import { LoadMap } from './LoadMap';
import { TILE_CONFIG } from './SpriteAtlas';



export class OverWorld extends EngineObject{
    /*
        Features

        (1) Renders the overworld map
        (2) Renders the overworld objects
        (3) saves the game state with static functions 

        Unused 
        The Overworld Scene + Objects as children

        Example: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/platformer/gameLevel.js
        Example 2:  https://github.com/eoinmcg/gator/blob/main/src/levels/loader.js
        Example 3 : https://gitlab.com/gcnet-uk/games/worktime/-/blob/main/src/entities/player.ts?ref_type=heads

        Bugs:


         To Do:
         (7) create temple interior pixel art background and tileset (2/3)

        */
    
    LevelSize: LittleJS.Vector2 | null = null;
    tempExtLayer: LittleJS.TileLayer | null = null;
    tempLater : LittleJS.TileLayer | null = null;
    //tempExtCollisionLayer : LittleJS.TileCollisionLayer| undefined;
    ground_layer: number[][] = []; // matrix data type
    
    levelObjects : any[] | null = []; // for storing all the spawned object
    collisionGrid: number[][] = []; // for enemy navigation logic
    skyParticles : any ;//rain particle fx testing

    constructor() {
        super();
        //save current level to globals
        window.globals.current_level ="Overworld";

        console.log('Level load triggered');
        console.log('Number of gameObjects:', LittleJS.engineObjects.length);
        console.log('Globals:', window.globals);

        //debug json file 
        console.log("map debug: ",overMap);

        //temporarily disabled for refactoring Jan 2 2026
        //Utils.saveGame();

        //load the game map
        (async () => {
            // bugs:
            // (1) new load map function breaks the already very buggy enemy navigation
            //LoadMap(overMap, this.levelObjects!);
            await this.loadMap();
        })();


    }

    async loadMap(){
        // loading the map data using fetch requests instead of imports
        // the purpose is to remove the resolve url function in the final build binary
        //all assets are also preloaded        
        try {

            this.LevelSize = vec2(overMap.width, overMap.height);
            
            // drawing more than one tile bugs out on mobile browsers
            this.tempExtLayer = new LittleJS.TileLayer(vec2(0,0), this.LevelSize, tile(2, 128, 2, 0));
           
           // console.log("Map width: %d", overMap.width, "/ Map Height:", overMap.height);
            

            
            LittleJS.initTileCollision(vec2(overMap.width,overMap.height));
            
            //initialise an empty collision grid for enemy nav logic
            this.collisionGrid = Array(overMap.height)
                .fill(null)
                .map(() => Array(overMap.width).fill(0));

            
            
            this.ground_layer = this.chunkArray(overMap.layers[0].data, overMap.layers[0].width).reverse();
            //console.log("ground layer debbug: ", this.ground_layer);
            
            this.ground_layer.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (!val) return;
                    const pos = LittleJS.vec2(x, y);
                    const config = TILE_CONFIG[val];

                    if (!config) {
                        // Default behavior for undefined tiles
                        this.drawMapTile(pos, val - 1, this.tempExtLayer!, 0);
                        return;
                    }
                    // Draw tile if configured
                    if (config.draw) {
                    this.drawMapTile(pos, val - 1, this.tempExtLayer!, config.collision ? 1 : 0);
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

                    
                    })});
                        
            this.tempExtLayer.redraw();

            //Debug or save your collision grid for pathfinding ai
            // works
            //console.log(JSON.stringify(this.collisionGrid));
            
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

    drawMapTile(pos: LittleJS.Vector2, i : number = 1, layer: LittleJS.TileLayer, collision : number) {
                
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
                    if (this.collisionGrid)this.collisionGrid[pos.y][pos.x] = 1;
                        
                }

              
                
                
            }
        



    destroy(): void {
        // delete all scene objects
        if (this.tempExtLayer) {
            this.tempExtLayer.destroy();
        }
        // to do:
        // (1) save overworld.map data to the globals scenes
        //Utils.saveGame(); // save the game state once exiting the overworld map

        // destroy all enemy objects
        for (const enemy of window.globals.enemies){

            enemy.destroy();
        }

        //destroy all player objects
        for (const players of window.globals.players){
            players.destroy();
        }
        

        if (this.levelObjects){ // destroy all instanced level objects
            for (const i of this.levelObjects!){
                i.destroy();
                
            }}
            this.levelObjects = null;

        LittleJS.engineObjects.length = 0;        // clear existing objects

        
    }
}

