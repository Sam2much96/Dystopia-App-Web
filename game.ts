/*

Main Game Logic

(1) Using LittleJS As A Module for 3d Logic, 2d rendering, 2d logic
(2) Using Threejs for 3d geometry rendering
(3) Using ZzFx for Sound Fx
(4) Using HowlerJS for Audio Playback -depreciated
(5) Using ZzFxM for Music instead of howlerjs


Bugs

(1) Overworld load times on mobile browsers is long
(2) Buttons aren't interractive, add sfx
(3) Input is terrible on mobile browsers


To Do:
(1) import only the modules you need for faster load time
(2) Implement yandex ads services
(3) Create global sprite atlas for each tileset in game init

*/

"use strict"

import * as LittleJS from 'littlejsengine';



const { tile, vec2, hsl, drawTile, setFontDefault, drawTextOverlay, glCreateTexture,  WHITE, PI, EngineObject, Timer, TileLayer,TileLayerData, Sound, ParticleEmitter, timeDelta, Color, touchGamepadEnable, isTouchDevice, setTouchGamepadSize,setShowSplashScreen, setTouchGamepadEnable,// do not use pixelated rendering
setTouchGamepadAlpha,initTileCollision,setTouchGamepadAnalog,setSoundVolume,setSoundEnable, vibrate,setCanvasPixelated, setTileCollisionData, setTilesPixelated, setGravity,setCameraPos, setCameraScale, engineInit } = LittleJS;



import {Music} from "./source_code/singletons/Music";
import {OverWorld} from "./source_code/scenes/levels/Overworld";
import {Wallet} from "./source_code/scenes/Wallet/Wallet";
import {Simulation} from "./source_code/singletons/Simulation";
import {ThreeRender} from "./source_code/singletons/3d";
import {Inventory} from "./source_code/singletons/Inventory";
//import {Inputs} from "./source_code/singletons/Inputs";
import {UI} from "./source_code/singletons/UI";
import {Utils} from "./source_code/singletons/Utils";

import {Player} from "./source_code/scenes/Characters/player";
import {Enemy} from "./source_code/scenes/Characters/enemy";



'use strict';


// import module

// show the LittleJS splash screen
setShowSplashScreen(true);


// Game Pad on Mobile Devices Settings
setTouchGamepadEnable(true);
setTouchGamepadSize(256);
setTouchGamepadAlpha(0.3);

// set dpad configuration on mobile browsers 
setTouchGamepadAnalog(false);

//Audio Control settings
// to do : map to a control ui / control class
setSoundVolume(0.3);
setSoundEnable(true);





class Quest {

}




class GameObject extends EngineObject {
    /**
     * Base Class for All Game Objects
     * 
     * Features
     * (1) Animation functions
     * (2) Destroy functions
     * 
     */
    // 
    
    constructor() {
        super();
        //console.log("Loading Utils Singleton");

    }



 


}


class EnemySpawner extends GameObject {
    public ENABLE: boolean;
    private COUNTER: number;
    public color: any | null;

    //spawn an enemy count at specific posisitons
    constructor() {
        super();

        this.ENABLE = true;
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        this.COUNTER = 0; // counter for calculatin how much enemies been spawned
        console.log("Enemy Spawner Instanced: ", this.ENABLE);

    }

    update() {

        // spawn 2 new enemies if the enemy pool is 0
        if (window.globals.enemies.length < 1 && this.ENABLE) {
            const enemy1 = new Enemy(vec2(5, 10));

            this.COUNTER += 1;

            return

        }

        // stop spawning if enemy spawn count is 15
        if (window.globals.enemies.length == 15) {
            this.ENABLE = false
        }
    }
}



class Networking {

    /* 
    Should Handle All Multiplayer Logic 
    alongside simulation and utils singleton classes
    
    */
}








/**
 * Particle FX
 * 
 * (1) Blood_splatter_fx
 * (2) DespawnFx
 */


class ParticleFX extends EngineObject {
    /**
     * Particle Effects Logic in a single class 
     * 
     * TO DO : (1) Make A Sub function within Player Class 
     
     * Extends LittleJS Particle FX mapped to an enumerator
     * attach a trail effect
     * 
     * @param {*} pos 
     * @param {*} size 
     */


    public color: any;
    public trailEffect: any;

    /** */
    constructor(pos: Vector2, size: Vector2) {
        super();
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        this.trailEffect = new LittleJS.ParticleEmitter(
            this.pos, 0,                          // pos, angle
            this.size, 0, 80, LittleJS.PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(0, 16),                          // tileIndex, tileSize
            color__, color__,                         // colorStartA, colorStartB
            color__.scale(0), color__.scale(0),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, true, true        // fade, randomness, collide, additive
        );


    }
}

class Blood_splatter_fx extends ParticleFX {
     public color: any;
    //private trailEffect: any;

    constructor(pos: Vector2, size: Vector2) {
        super(vec2(),vec2());
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        this.trailEffect = new ParticleEmitter(
            this.pos, 0,                          // pos, angle
            this.size, 0, 8, PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(25, 128, 2, 0),                          // tileIndex, tileSize
            color__.scale(1), color__.scale(10),                         // colorStartA, colorStartB
            color__.scale(5), color__.scale(10),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, false, false        // fade, randomness, collide, additive
        );

    }


}

class DespawnFx extends ParticleFX {

}

class Bombexplosion extends ParticleFX{

}

class RainFX extends ParticleFX {

}

class SmokeFX extends ParticleFX {

}

/*
*Globals Singleton
*
*Features: 
*(1) Holds All Global Variants in one scrupt
*(2) Can Only Store Data, Cannot Manipulate Data
*
*
*
*/

class Globals {

    // All Global Variables
    public health: number;
    public players: Array<Player>; // Update the type to a specific Player class if available
    public enemies: Array<Enemy>; // Update the type to a specific Enemy class if available
    public scenes: Record<string, any>; // Update the value type if you have a specific Scene type
    public score: number;
    public kill_count: number;
    public GAME_START: boolean;

    

    constructor() {

        // All Global Variables 

        this.health = 3;
        this.players = []; // internal array to hold all playe objects
        this.enemies = []; // internal global array to hold all enemy types
        this.scenes = {};// holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
        this.kill_count = 0; //enemy kill count

        this.GAME_START = false;// for triggering the main game loop logic in other scenes
    }
}


/**
 * Debug Class
 *  
 * For properly debugging elements in littlejs
 * by attaching debug variables to the ljs inengine debugger
 * 
 * Currently unimplemented
 * Would require refactoring each singleton to reference this class
 * would require syncing with mobile build syntax per object
 * Should replace console.log debugging
 * 
 */

class Debug {

}





/* Declare Global Singletons

 So Typescript is aware of new properties that aren't a default in windows
*/
declare global {
    interface Window {
        inventory: Inventory,
        ui: UI,
        THREE_RENDER: ThreeRender,
        globals: Globals,
        utils: Utils,
        music: Music,
        //input: Inputs,
        player: Player,
        enemy: Enemy,
        wallet: Wallet;
        map: OverWorld;
        simulation: Simulation;

        useItem: any; 

    }

    interface Vector2 {
        x: number;
        y: number;
        copy(): Vector2;
        add(arg0: Vector2): Vector2;
        multiply(arg0: Vector2): Vector2;
        //directionTo(arg0: Vector2, arg1: Vector2): Vector2;


    }

    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }

    interface player_info { 0 :{ //server peer id
        posi:Vector2, // position
        vel:Vector2, // velocity
        fr:number, // frame data
        in:number, // input buffer from input singleton
        hp:number,
        st:number, // roll back networking state predictions
        rd:Vector2, // roll direction
        dx:number,
        up:number, //persistent update id across client peers
        wa:string, //Wallet address
        ai:number, //Asset ID
        sc:number, //Dapp ID
        kc:number, //Client Kill Count
        inv:string, // Client inventory items
        rt:number, // respawn timer
        hash:string, //hash splice for data integrity

    }

    

}
}



/**
 * Global UI Functions
 * 
 * Features:
 * (1) Exported as a global window function called from the Inventory UI renderer
 * (2) The function is saved to the DOM's global scope for the UI
 * 
 * 
 * There's 4 Inventory Items implemented :
 * (1) health potion
 * (2) Generic Item
 * (3) Magic Sword
 * (4) Bomb
 * (5) Arrow
 * (6) Bow
 */

export function useItem(type :string, amount : number ) : boolean {
    console.log("Use item function called :", type);
    

    window.music.item_use_sfx.play();

    const player = window.player;
    const local_inv = window.inventory;

    if (local_inv.has(type)){
        let old_amt : number = local_inv.get(type);
        let new_amt = old_amt = amount;
        local_inv.set(type, new_amt); 
        
        if (type== "health potion"){
            player.hitpoints += 1;
            window.globals.health += 1;

            // update heart box hud
            player.update_heart_box();
        }
        
        if (type == "Generic Item"){
            player.WALK_SPEED += 3; // double the player's speed variable
            player.ROLL_SPEED += 400;
            player.ATTACK = 2;

        }

        if (type == "Magic Sword"){
            //increase pushback impact, increases chances of double attack
            player.pushback = 8000;
        }

        if (type == "Bomb"){
            const bomb = new Bombexplosion(player.pos, vec2());

            console.log("bomb debug: ", bomb);
        }

        if (type == "Arrow" && local_inv.has("Bow")){
            //const bullet = new Bullet(); // arrow instance

            //console.log("arrow debug 1: ", bullet);
            console.log("to do: finish item use implementation");
        }
    
    }

    

    // to do:
    // (1) each item use should either spawn the object or alter the player's state
    // (2) port item use logic from inventory code for bombs, potions, bow & arrow, generic item and rings
    // (3) connect wallet use logic to test wallet ui 

    return true;
}



/*
* LittleJS Main Loop
* 
*/



function gameInit() {
    // called once after the engine starts up
    // setup the game
    console.log("Game Started!");


    // use pixelated rendering
    setCanvasPixelated(true);
    setTilesPixelated(false);



    //3d Camera Distance Constants
    const CAMERA_DISTANCE = 16;

    /* Create 3D Scenes And Objects*/
    window.THREE_RENDER = new ThreeRender();


    // UI Setup
    // creates the ui singleton, scenes and global functions
    window.ui = new UI();
    window.useItem = useItem;


    // Create & hide Ingame Menu
    window.ui.ingameMenu();
    window.ui.gameHUD();


    /* Create Global Singletons*/
    //window.input = new Inputs();
    window.inventory = new Inventory;
    window.globals = new Globals;
    window.utils = new Utils;
    window.music = new Music;


  

    window.wallet = new Wallet(false);

    //get device browser type/ platform
    window.utils.detectBrowser();





    // Add  Inventory Items
    // to do : feed inventory globals to inventroy ui
    window.inventory.set("Generic Item", 5);
    window.inventory.set("Bomb", 3);
    window.inventory.set("Magic Sword", 2);
    window.inventory.set("Arrow", 13);
    window.inventory.set("Bow", 3);
    window.inventory.set("health potion", 3);
    
    

    //Initialise 3d scene render
    // It can set 2 cubes but only animate 1 cuz of this.cube pointer limitations

    // Bug:
    // (1) there's a bug, if model is not loaded, game startup logic is broken 
    window.THREE_RENDER.LoadModel();
    //window.THREE_RENDER.Cube();



    //window.THREE_RENDER.addToScene(c1);
    // window.THREE_RENDER.addToScene(c2);
    window.THREE_RENDER.setCamera(CAMERA_DISTANCE);

    window.THREE_RENDER.animate();

    //Ads
    // to do: 
    // (1) port ads mediator to yandex
    //buggy & performance hog
    //const ads = new Adsense();
    //ads.loadAdSense();



    //draw title screen
    // TO DO :
    // (1) draw dystopia logo with css




}

function gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state


}

function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render

}

function gameRender() {
    // Temporary Game Manger + simulations
    // triggers the LittleJS renderer
    // called before objects are rendered
    // draw any background effects that appear behind objects
    // handles what gets rendered and what doesn't get rendered
    // triggers srart of game loop from simulation singleton
    // The third tile parameter constrols which tile object to draw
    // draw tile allows for better object scalling
    if (window.globals.GAME_START) {

        if (!window.map){
            // preload overworld
            window.map = new OverWorld();
            console.log("map debug: ", window.map);
        }

        // formerly screen class
        if (window.player){
            // Track player
            // set camera position to player position
            setCameraPos(window.player.pos);
            setCameraScale(128);  // zoom camera to 128 pixels per world unit
        }
   
        //create global player object
        if (!window.player) {
            window.player = new Player();
            
            
            window.enemy = new Enemy(vec2(5, 10));
            
            
            // generic item missing?

            
            //blood fx testing
            //const q = new Blood_splatter_fx(vec2(0),vec2(5));
            
            
            // setup the screen and camera
            //const y = new Screen();

            //turn game menu invisibke
            window.ui.MenuVisible = false;




            //create overworld map
            // overworld tile renderer breaks on mobile?
        
            window.music.play(); //works
            
            
        

        }



    }
}



function gameRenderPost() {
    // depreciated in favor of UI class
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // draw to overlay canvas for hud rendering

}


// Startup LittleJS Engine
// I can pass in the tilemap and sprite sheet directly to the engine as arrays
// i can also convert tile data to json from tiled editor and parse that instead
// tiles.png is a placeholder until proper file name management is donew for game init
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ["source_code/resources/Aarin/player_tileset_128x128.webp", "/source_code/resources/pj/enemy_tileset_128x128.webp", "/source_code/resources/Environment Tilesets & Tilemaps/godot_128x_dungeon_tileset.webp"]);



