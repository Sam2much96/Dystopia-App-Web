/*

Main Game Logic

(1) Using LittleJS As A Module for 3d Logic, 2d rendering, 2d logic
(2) Using Threejs for 3d geometry rendering
(3) Using ZzFx for Sound Fx
(4) Using HowlerJS for Audio Playback -depreciated
(5) Using ZzFxM for Music instead of howlerjs


Bugs


(1) Input is terrible on mobile browsers (1/2)
(2) 
(3) overworld level render is buggy on mobile, consider reducing map side (1/2)
    - i used async method to load the map, i'm yet to test the fix on mobile Oct 17/ 2025
(4) gameplay hangs ever odd seconds or so on mobile devices


To Do:

(3) Create global sprite atlas for each tileset in game init
(4) create Particle fx for hit and bomb explosion (1/3)
(7) 
(8) Implement auto tile procedural levels
(9) Audit music tracks 
(10) implement Rain particle fx
(11) create grass and flower objects
(12) add grass  and flower objects to shader scene
(13)

*/

"use strict"

import * as LittleJS from 'littlejsengine';



//const {setCanvasPixelated, setTilesPixelated} = LittleJS;



import {Music} from "./source_code/singletons/Music";
import {Quest} from "./source_code/singletons/Quest";
import {Wallet} from "./source_code/scenes/Wallet/Wallet";
import {Simulation} from "./source_code/singletons/Simulation";
import {ThreeRender} from "./source_code/singletons/3d";
import {Globals} from "./source_code/singletons/Globals";
import {Inventory} from "./source_code/singletons/Inventory";
import { Diaglogs } from './source_code/singletons/Dialogs';
import {UI} from "./source_code/singletons/UI";
import {Utils} from "./source_code/singletons/Utils";

import {Player, TopDownPlayer} from "./source_code/scenes/Characters/player";
import { SideScrollerPlayerBox } from './source_code/scenes/Characters/player';
//import {Enemy} from "./source_code/scenes/Characters/enemy";

import { Controls } from './source_code/scenes/UI & misc/Controls';

import {OverWorld} from "./source_code/scenes/levels/OverworldTopDown";
import {OverworldSideScrolling} from "./source_code/scenes/levels/OverworldSideScrolling";
import { Marketplace } from './source_code/scenes/levels/Marketplace';
import { TempleInterior } from './source_code/scenes/levels/TempleInterior';
import { OverWorld3D } from './source_code/scenes/levels/Overworld3D';
import { OverworldTile } from './source_code/scenes/levels/OverworldTitle';
// post processing
//import { initPostProcess } from './source_code/singletons/postProcess';
//import {televisionShader, ImpactShader} from "./source_code/scenes/UI & misc/Shaders"

// advertising
import { Advertising } from './source_code/scenes/UI & misc/Advertising';



//import * as Box2D from './source_code/singletons/box2d';
//const {Box2dObject, box2dEngineInit} = Box2D;
import { box2dEngineInit, Box2dObject} from './source_code/singletons/box2d';


'use strict';




/* Declare Global Singletons

 So Typescript is aware of new properties that aren't a default in windows
*/
declare global {
    interface Window {
        inventory: Inventory,
        ui: UI,
        THREE_RENDER: ThreeRender | undefined, // to do: (1) decouple 3d render objects
        globals: Globals,
        utils: Utils,
        music: Music,
        dialogs : Diaglogs,
        quest : Quest,
        player: TopDownPlayer | SideScrollerPlayerBox,
        //enemy: Array<Enemy>,
        wallet: Wallet;
        map: OverworldTile | OverWorld | OverworldSideScrolling | Marketplace | TempleInterior | OverWorld3D; // all implemented map levels
        //simulation: Simulation;
        ads : Advertising;

    }

    interface Vector2 { // required for vercel build process
    x: number;
    y: number;
    set(x: number, y: number): this;
    add(v: Vector2): this;
    length(): number;
    normalize(): this;
    // … add other methods you use
    }
    
    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }

    
}





/*
* LittleJS Main Loop
* 
*/


   
    
    
function gameInit() {
    // called once after the engine starts up
    // setup the game
    //console.log("Game Started!");
    

    // use pixelated rendering
    LittleJS.setCanvasPixelated(true);
   LittleJS.setTilesPixelated(false);
    LittleJS.setShowSplashScreen(false);

    // Game Pad on Mobile Devices Settings
    LittleJS.setTouchGamepadEnable(true);
    LittleJS.setTouchGamepadSize(150); // game pad is too big on some mobile browsers
    LittleJS.setTouchGamepadAlpha(0.3);

    // set dpad configuration on mobile browsers 
    LittleJS.setTouchGamepadAnalog(false);
    //LittleJS.setCameraScale(16);

    // audio
    LittleJS.setSoundVolume(0.1);
    console.log(`sound volume: ${LittleJS.soundVolume}`);
    /* 
    * Create 3D Scenes And Objects
    */
    // Game Advertising singleton for gamemonetize & Yandex
    // 
    //
    
    //load the translation files first
    //
    window.ads = new Advertising("yandex");
    window.dialogs = new Diaglogs();
    
    window.quest = new Quest();
    window.globals = new Globals();
    window.wallet = new Wallet();
    window.inventory = new Inventory(); 
    window.utils = new Utils();
    window.music = new Music();
    window.ui = new UI();
    
    // to do:
    // (1) move controls ui to the ui singleton
    //const controls = new Controls(); // set up the engine's controls

    // initilize ads singleton for the first time
    // initilisez the ads singleton ad triggers one auto ads on chrome devices    
    //window.ads.initialize(); 


    //create all the game ui menus with translations
    window.ui.gameMenu();

    // to do:
    // (1) port the stats html into this function
    window.ui.stats(); // takes control of the stats hud and turns it invisible until the gamehud is rendered
    //window.ui.controls(); //render the game's control

    // create the overworld title scene
    // bugs:
    // (1) cube object loads slow in environment build
    window.map = new OverworldTile();
  

    //window.wallet = new Wallet(false);

    //get device browser type/ platform
    window.utils.detectBrowser();



    // Create & hide Ingame Menu
    // 
    //
    window.ui.menu();

    //draw title screen
    // TO DO :
    // (1) draw dystopia logo with css

    // buggy mouse icon selector
    // set mouse icon
    const canvas = document.querySelector("canvas")!;
    canvas.style.cursor =
    'url("./cursot_32x32.webp") 32 32, auto';

    //setupPostProcess();

  

}

function gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state


}

function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render
    //setupPostProcess(); // setup tv shader post processing

}



// tv shader post processing
// to do:
// (1) port impact shader implementation from godot engine
// (2) test impact shader performance
// (3) implement impact shader on player hit_collision detection
function setupPostProcess()
{
  
    

    const includeOverlay = true;
    //initPostProcess(televisionShader, includeOverlay);
}

function gameRender() {
    // 
    // triggers the LittleJS renderer
    // 
    // 
    // handles what gets rendered and what doesn't get rendered
    // triggers srart of game loop from simulation singleton
    // 
    // 
    // to do:
    // (1) create a game manager parent class and lock the game logic into it

    // start game logic
    if (window.globals.GAME_START) {
        

        // new game logic
        if (!window.map && window.globals.current_level === ""){

            // 
           
        
            
            
            //window.music.play(); //play zzfxm music
            //setupPostProcess(); // setup tv shader post processing

            
            return;
        }


    }
}



function gameRenderPost() {
    // depreciated in favor of UI class
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // draw to overlay canvas for hud rendering

}




// Startup LittleJS Engine with Box2d physics
// I pass in the tilemap and image data directly to the engine as arrays

box2dEngineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ["./player_tileset_128x128.webp", "./enemy_tileset_128x128.webp", "./godot_128x_dungeon_tileset.webp",  "./NPC_128x128_tileset.webp", "./Desert_background_1.png", "./Desert_background_2.png", "./Desert_background_3.png","./brickTileset.webp"]);



