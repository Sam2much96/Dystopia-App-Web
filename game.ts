/*

Main Game Logic

(1) Using LittleJS As A Module for 3d Logic, 2d rendering, 2d logic
(2) Using Threejs for 3d geometry rendering
(3) Using ZzFx for Sound Fx
(4) Using HowlerJS for Audio Playback -depreciated
(5) Using ZzFxM for Music instead of howlerjs


Bugs


(1) Input is terrible on mobile browsers (1/2)
(2) Game menu UI button is image path broken in production
(3) overworld level render is buggy on mobile, consider reducing map side


To Do:

(3) Create global sprite atlas for each tileset in game init
(4) create Particle fx for hit and bomb explosion (1/3)
(7) implement dialogue trigger and dialog box for signpost and NPC merchant (2/3)
(8) Implement auto tile procedural levels
(9) Audit music tracks 
(10) implement Rain particle fx

*/

"use strict"

import * as LittleJS from 'littlejsengine';



const {setShowSplashScreen,setCanvasPixelated, setTilesPixelated, setCameraPos, setCameraScale, engineInit , setTouchGamepadAlpha, setTouchGamepadAnalog,setTouchGamepadSize, setTouchGamepadEnable} = LittleJS;



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

import {Player} from "./source_code/scenes/Characters/player";
import { SideScrollerPlayerBox } from './source_code/scenes/Characters/player';
//import {Enemy} from "./source_code/scenes/Characters/enemy";

import { Controls } from './source_code/scenes/UI & misc/Controls';

import {OverWorld} from "./source_code/scenes/levels/OverworldTopDown";
import {OverworldSideScrolling} from "./source_code/scenes/levels/OverworldSideScrolling";
import { Marketplace } from './source_code/scenes/levels/Marketplace';
import { TempleInterior } from './source_code/scenes/levels/TempleInterior';

// post processing
import { initPostProcess } from './source_code/singletons/postProcess';

// advertising
import { Advertising } from './source_code/scenes/UI & misc/Advertising';




//import * as Box2D from './source_code/singletons/box2d';
//const {Box2dObject, box2dEngineInit} = Box2D;
import { box2dEngineInit, Box2dObject} from './source_code/singletons/box2d';
//import {Ads} from "./source_code/scenes/UI & misc/Advertising";
'use strict';




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
        dialogs : Diaglogs,
        quest : Quest,
        player: Player | SideScrollerPlayerBox,
        //enemy: Array<Enemy>,
        wallet: Wallet;
        map: OverWorld | OverworldSideScrolling | Marketplace | TempleInterior; // all implemented map levels
        simulation: Simulation;
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


    LittleJS.setShowSplashScreen(false);

    // Game Pad on Mobile Devices Settings
    LittleJS.setTouchGamepadEnable(true);
    LittleJS.setTouchGamepadSize(150); // game pad is too big on some mobile browsers
    LittleJS.setTouchGamepadAlpha(0.3);

    // set dpad configuration on mobile browsers 
    LittleJS.setTouchGamepadAnalog(false);
    
function gameInit() {
    // called once after the engine starts up
    // setup the game
    //console.log("Game Started!");
    

    // use pixelated rendering
    setCanvasPixelated(true);
    setTilesPixelated(false);



    //3d Camera Distance Constants
    const CAMERA_DISTANCE = 16;

    /* 
    * Create 3D Scenes And Objects
    */
    // Game Advertising singleton for gamemonetize & Yandex
    // 
    // 
    window.dialogs = new Diaglogs();
    window.ads = new Advertising("gamemonetize");
    window.THREE_RENDER = new ThreeRender();
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







  

    //window.wallet = new Wallet(false);

    //get device browser type/ platform
    window.utils.detectBrowser();


    
    

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

  

    // Create & hide Ingame Menu
    window.ui.GameMenu!!.ingameMenu();
    window.ui.menu();

    //draw title screen
    // TO DO :
    // (1) draw dystopia logo with css
    //window.dialogs.show_dialog("Game Started","");

}

function gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state


}

function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render

}



// tv shader post processing
function setupPostProcess()
{
    const televisionShader = `
    // Simple TV Shader Code
    float hash(vec2 p)
    {
        p=fract(p*.3197);
        return fract(1.+sin(51.*p.x+73.*p.y)*13753.3);
    }
    float noise(vec2 p)
    {
        vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+1.),u.x),u.y);
    }
    void mainImage(out vec4 c, vec2 p)
    {
        // put uv in texture pixel space
        p /= iResolution.xy;

        // apply fuzz as horizontal offset
        const float fuzz = .0005;
        const float fuzzScale = 800.;
        const float fuzzSpeed = 9.;
        p.x += fuzz*(noise(vec2(p.y*fuzzScale, iTime*fuzzSpeed))*2.-1.);

        // init output color
        c = texture(iChannel0, p);

        // chromatic aberration
        const float chromatic = .002;
        c.r = texture(iChannel0, p - vec2(chromatic,0)).r;
        c.b = texture(iChannel0, p + vec2(chromatic,0)).b;

        // tv static noise
        const float staticNoise = .1;
        c += staticNoise * hash(p + mod(iTime, 1e3));

        // scan lines
        const float scanlineScale = 1e3;
        const float scanlineAlpha = .1;
        c *= 1. + scanlineAlpha*sin(p.y*scanlineScale);

        // black vignette around edges
        const float vignette = 2.;
        const float vignettePow = 6.;
        float dx = 2.*p.x-1., dy = 2.*p.y-1.;
        c *= 1.-pow((dx*dx + dy*dy)/vignette, vignettePow);
    }`;

    const includeOverlay = true;
    initPostProcess(televisionShader, includeOverlay);
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

    // start game logic
    if (window.globals.GAME_START) {
        


        if (!window.map){
            // to do: (1) create exit scene
            //window.ads.showAds(); // activate when shipping to game monetize
            
            // overworld map 1 
            window.map = new OverWorld();
           
            window.ui.gameHUD(); //render the game hud
            
            window.music.play(); //play zzfxm music
            //setupPostProcess(); // setup tv shader post processing
            return;
        }

        // formerly screen class
        if (window.player){

            //console.log("window player exists debug");
            // Track player
            // set camera position to player position
            setCameraPos(window.player.pos);
            setCameraScale(128);  // zoom camera to 128 pixels per world unit
                            // 1. draw background image
            
        }

        //yandex sdk game start logic
   
        //create global player object
        if (!window.player) {
            
            

            
            //blood fx testing
            // bug : (1) doesn't render now, not sure why yet
            //const q = new Blood_splatter_fx(vec2(10,10),vec2(5));
            
            
            // setup the screen and camera
            //const y = new Screen();

            //turn game menu invisibke
            //window.ui.MenuVisible = false;
        
            
            
            
        

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



