/**
 * The Game's Top Down Overworld Map
 * 
 * Bugs:
 * (1) Breaks on mobile browsers when changing scenes (not sure why it breaks, i've tried resizing the level into 2, and it didn't work)
 * (2) Takes too long to load the entire overmap level in mobile browser
 */
import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer,TileLayerData, initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;



// all items used in this level
import overMap from "./overworld.json";



import {Bomb} from "../items/Bomb";
import {Coins} from "../items/Coins";
import { HealthPotion } from '../items/Extralife';
import { Bow} from "../items/Bow";
import { Arrow } from '../items/Arrow';
import { GenericItem } from '../items/GenericItem';
import {Ring} from "../items/Ring";
import {TopDownPlayer} from "../Characters/player";
import {OldWoman} from "../Characters/NPC";
import {EnemySpawner} from "../UI & misc/Enemyspawner";
import {Utils} from "../../singletons/Utils";
import {Hole, House1, House2, TempleDoor, Spaceship1, Spaceship2} from "../UI & misc/Exit";
import { Signpost } from '../items/Signpost';


//test the fire fx
import {Firefx1} from "../UI & misc/Blood_Splatter_FX";

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
    tempExtLayer: LittleJS.TileLayer | undefined;
    ground_layer: number[][] = []; // matrix data type
    
    levelObjects : any[] | null = []; // for storing all the spawned object
    collisionGrid: number[][] = []; // for enemy navigation logic

    constructor() {
        super();
        //save current level to globals
        window.globals.current_level ="Overworld";

        console.log('Level load triggered');
        console.log('Number of gameObjects:', LittleJS.engineObjects.length);
        console.log('Globals:', window.globals);

        Utils.saveGame();

        //load the game map
        (async () => {
            this.loadMap();
        })();
        
        
        
        //testing runtime ui transalations
        //delete later
        // works (1/2)
        //window.ui.translateUIElements(window.dialogs.normalizeLocale("ru_RU"));


    }

    async loadMap(){
        // loading the map data using fetch requests instead of imports
        // the purpose is to remove the resolve url function in the final build binary
        //all assets are also preloaded        
        try {

            this.LevelSize = vec2(overMap.width, overMap.height);
            
            // drawing more than one tile bugs out on mobile browsers
            this.tempExtLayer = new TileLayer(vec2(0,0), this.LevelSize, tile(2, 128, 2, 0), vec2(1));
            
           // console.log("Map width: %d", overMap.width, "/ Map Height:", overMap.height);


            
            initTileCollision(vec2(overMap.width,overMap.height));
            
            //initialise an empty collision grid for enemy nav logic
            this.collisionGrid = Array(overMap.height)
                .fill(null)
                .map(() => Array(overMap.width).fill(0));

            
            
            this.ground_layer = this.chunkArray(overMap.layers[0].data, overMap.layers[0].width).reverse();
            
            
            this.ground_layer.forEach((row, y) => {
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
                        if (val === 2){ // skull head
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }

                        if (val ===3 ){ // signpost
                            // signpost object 
                            //
                            // to do: 
                            // (1) use global current level and map data to trigger differnt signpost dialogue
                            const p = new Signpost(vec2(x,y));
                            //p.dialogue = ; // overworld top down signpost dialogue
                            this.levelObjects?.push(p);
                            return;
                        }

                        if (val ===4){ // hole object
                            const l = new Hole(vec2(x,y));

                            this.levelObjects?.push(l);
                            return

                        }

                        if (val === 8 ){ // boulder
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 10){ // trees
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 11){ // mushroom big
                            // tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 12){ // mushroom small
                            // mushroom small tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                            
                            //console.log("player spawn tile debug :", val, "/", x,",", y);
                            window.player = new TopDownPlayer(vec2(x,y));

                            //test the fire fx
                            // doesnt work
                            // to do:
                            // (1) fix fx implementation from example testing
                            //const u = new Firefx1(vec2(x,y),2);
                            
                            // old woman npc
                            const m = new OldWoman(vec2((x + 8), (y +6)));

                            this.levelObjects?.push(window.player);
                            this.levelObjects?.push(m);
                            return
                        }

                        

                        if (val === 15){ // temp ext tile
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 16){ // temp ext tile
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 17){ // temp ext tile
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 18){ // temp ext
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 19){ // temp ext
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 20){ // temp ext
                            // trees tile draws with collision
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        //21 is bomb
                        if (val ===21){ // bomb object

                            // works
                            const u = new Bomb(vec2(x, y));

                            this.levelObjects?.push(u);
                            return

                        }
                        if (val === 22){ // 22 is health potion

                            const o = new HealthPotion(vec2(x,y));
                            this.levelObjects?.push(o);
                            return
                        }

                        //23 is coins
                        if (val === 23){ // coins
                            // coins object
                            const t = new Coins( vec2(x, y)); 
                            this.levelObjects?.push(t);
                            return

                        }
                        if (val === 24){ // arrow
                            // arrow object
                            const p = new Arrow(vec2(x,y));
                            this.levelObjects?.push(p);
                            return
                        }
                        
                        if (val === 25){
                            // bow object
                            const i = new Bow(vec2(x, y));
                            this.levelObjects?.push(i);
                            return
                        }
                        if (val === 28){
                            const r = new Ring(vec2(x,y));
                            this.levelObjects?.push(r);
                            return
                        }
                        if (val === 29){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 30){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 31){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 32){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 33){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }

                        if (val === 34){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }

                        if (val === 35){ // first fire tile as enemy spawner placeholder
                        // // supposed to be enemy spawner object but instead it's a single enemy spawner
                            //const y = new Enemy(vec2(5, 10));   
                            //window.globals.enemies.push(y);
                            const i = new EnemySpawner(vec2(x, y));
                            this.levelObjects?.push(i);
                            return
                        }

                        if (val === 43){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 44){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 45){ // temple doors
                            // notes: the 0.45, and 0.5 pixel offsets are needed for this tile objedt
                            // to do:
                            // (1) make door collsion the one above this tile
                            const g = new TempleDoor(vec2(x + 0.45,y+0.5));
                            this.levelObjects?.push(g);
                            //this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                            return
                        }
                        if (val === 46){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 47){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 48){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }

                        if (val === 49){ // house 1 tile
                            const a = new House1(vec2(x,y));
                            this.levelObjects?.push(a);
                            return
                            //this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                            // to do: create an exit object to Temple Interior scene
                        }

                        if (val === 50){ // house 2 tile
                            const b = new House2(vec2(x,y));
                            this.levelObjects?.push(b);
                            //this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                            // to do : create an Empty object to Temple Interior Scene
                            return
                        }

                        if (val === 51){ // generic item object
                            const j = new GenericItem(vec2(x,y));
                            this.levelObjects?.push(j);
                            return
                        }

                        if (val === 57){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 58){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 59){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 60){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 61){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 62){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 71){ // temple exterior no collision edges
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 72){ // temple exterior no collision edges
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0);
                        }
                        if (val === 73){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 75){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 76){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 85){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 86){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 87){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 88){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 89){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 90){ // temple exterior
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 1);
                        }
                        if (val === 97){ // overworld 3d exit collision 1 works
                            const c = new Spaceship1(vec2(x,y));
                            this.levelObjects?.push(c);
                            return

                        }
                        if (val === 98){ // overworld 3d exit collision 2 works
                            const z = new Spaceship2(vec2(x,y));
                            this.levelObjects?.push(z);
                            return
                        }

                        // to do:
                        // (1) Cityscape map collisions
                        // (2) city scape tiles

                        else {
                            //console.log("tile debug: ", val);
                            this.drawMapTile(vec2(x, y), val - 1, this.tempExtLayer!, 0); // 0 is for no collision, 1 is for collision
                        }
                        }})});
                        
            this.tempExtLayer.redraw();

            //Debug or save your collision grid for pathfinding ai
            // works
            //console.log(JSON.stringify(this.collisionGrid));

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }



        
        //const objectChunks = overMap.layers[1].chunks.slice(0, 5);
        //this.drawChunks(objectChunks, overMap.width, this.tempExtLayer,false); // collision works

        // bug: mobiles can only draw 1 tile layer
        // Extract and draw temple exterior (1 chunk)
        //const templeChunk = overMap.layers[2].chunks[0];
        //this.drawChunks([templeChunk], templeChunk.width, this.tempExtLayer,false);
        


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

                // ✅ Record in grid
            if (this.collisionGrid)
            {this.collisionGrid[pos.y][pos.x] = 1;}
                
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

