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
import {Inputs} from "./source_code/singletons/Inputs";
import {UI} from "./source_code/singletons/UI";
import {Utils} from "./source_code/singletons/Utils";



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


class PhysicsObject extends EngineObject {
    /**
     * LittleJS physics object for player and enemy physics & collisions
     * 
 
     */

    public frameCounter: number = 0; // for timing frame changes to 1 sec or less
    public mirror: boolean = false; //false
    public animationCounter : number = 0.1 // 0.1 seconds for each animation
    public currentFrame : number = 0;

    constructor()
    {
        super();
        this.setCollision(); // make object collide
        this.mass = 0; // make object have static physics
    }

       animate(currentFrame: number, sequence: number[]): number {
        /** 
         * Animation Function
         * 
         * Features:
         * 
         * (1) Loops through an array sequence and return this current frame
         * (2) Plays animation loops
         *
         *  Usage Examples:
            this.currentFrame = getNextFrame(this.currentFrame, [3, 4, 5]); // Loops 3 → 4 → 5 → 3
            this.currentFrame = getNextFrame(this.currentFrame, [1, 2, 3]); // Loops 1 → 2 → 3 → 1
            this.currentFrame = getNextFrame(this.currentFrame, [6, 7, 8]); // Loops 6 → 7 → 8 → 6

        * Bugs :
        * (1) Doesn't work with enemy run up animation frames 
        */
       
        //const index = sequence.indexOf(currentFrame); // Find the current position in the sequence
        //return sequence[(index + 1) % sequence.length]; // Move to the next frame, looping back if needed
        let index = sequence.indexOf(currentFrame);
        
        if (index === -1) {
            // Not found in the sequence — maybe default to the first frame or throw an error
            //  console.warn(`Frame ${currentFrame} not in sequence`, sequence);
            //console.trace("Trace of who called me");
            //return sequence[0]; // or throw new Error("Invalid currentFrame")
            index = sequence[0];
        }

        return sequence[(index + 1) % sequence.length];
        
    }

    playAnim(anim: Array<number>){

        // play the animation for 0.1 seconds
        //if (this.frameCounter >= this.animationCounter) {
            
            //loop animation function
            this.currentFrame = this.animate(this.currentFrame, anim);
            //console.log(this.currentFrame);
        //    this.frameCounter = 0; // Reset timer
                    
        //}
    }

    render() {

        //// set player's sprite from tile info and animation frames
        //console.log(this.currentFrame);
        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 1, 0), this.color, 0, this.mirror);
    }
}



class Player extends PhysicsObject {
    /*
    * PLAYER CLASS
    *
    * THe Core Player Script
    *
    * Features
    * (1) THe world's camera
    * (2) Player hitboxes
    * (3) It's a class and stores variables to the UI, Globals singleton, PlayersSave Files, and the Debug SIngleton
    * (4) Extend input from Global Input Singleton
    * (5) Extends to Top DOwn and SideScrolling Player Scripts
    * (6) Player & Enemy SFX is handled by simulation singleton
    * (7) Connects Dialog Signals From Dialogs Singleton
    * (8) Collision detectin is done from simulation singleton
    * (9) The current frame is the sprite id that would be rendered in the render() function
    *
    * to do: 
    * (1) set player's initial state to idle down not run up
    * (2) decouple player code from input singleton to remove player position bug on item use
    *   - the input singleton is a game object which position gradually deviates from player's position causing this bug
    * (3) Port player's movement physics from it's current implementation to LittleJS implementation
    *   -docs:
    *   (1) https://gitlab.com/gcnet-uk/games/worktime/-/blob/main/src/entities/player.ts?ref_type=heads
    *   (2) https://gitlab.com/gcnet-uk/games/worktime/~/blob/main/src/entity.ts
    *   (3) https://github.com/KilledByAPixel/LittleJS/blob/main/examples/shorts/topDown.js
    *   use velocity to alter player's movement, set gravity to zero, call engine update first then increase/decrease/cap your velocity
    */

    // Constants
    public WALK_SPEED: number = 1.65; // pixels per second
    public ROLL_SPEED: number = 1000; // pixels per second
    //private GRAVITY: number = 0; // For Platforming Levels
    public ATTACK: number = 1; // For Item Equip
    public pushback: number = 5000;

    // Properties
    //private input: Inputs = window.input;
    public hitpoints: number;
    private linear_vel = LittleJS.vec2(0, 0);
    private roll_direction = LittleJS.vec2(0, 1);
    private StateBuffer: number[] = [];
    private item_equip: string = ""; // Unused Item Equip Variant


    // State Machines Enumerations
    private TOP_DOWN: Map<string, number> = new Map([
            ['STATE_BLOCKED', 0],
            ['STATE_IDLE', 1],
            ['STATE_WALKING', 2],
            ['STATE_ATTACK', 3],
            ['STATE_ROLL', 4],
            ['STATE_DIE', 5],
            ['STATE_HURT', 6],
            ['STATE_DANCE', 7]
        ]);
    ;
    private FACING: Map<string, number> = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
        ]);
    
    // State Machines Actions
    public state: Record<string, () => void> | undefined;
    public facing: Record<number, () => void> | undefined;
    public facingPos : number = 0; // for storing the current facing positoin

    // References
    private local_heart_box: any; // Update type to match UI class
    private blood: any | undefined;
    private despawn_particles: any  | undefined;
    private die_sfx: any | undefined;
    private hurt_sfx: any = null;
    private music_singleton_: any = null;

    // Player attributes
    public mass: number = window.simulation.gravity;//this.GRAVITY;
    //public size: Vector2 = vec2(1);
    //public tileInfo: LittleJS.TileInfo; // Update type to match tile info structure
    public animationTimer: LittleJS.Timer = new Timer();
    public currentFrame: number = 0;
    public previousFrame: number = 0;

    // Player Animation frame data sorted as arrays
    private RunUp : Array<number> =[3, 4, 5, 6, 7, 8];
    private RunDown : Array<number> =[9, 10, 11, 12, 13, 14, 15];
    private RunLeft : Array<number> =[17, 18, 19, 20, 21, 22];
    private RunRight : Array<number> =[17, 18, 19, 20, 21, 22];
    private IdleUp : Array<number> =[2];
    private IdleDown : Array<number> =[0];
    private IdleLeft : Array<number> =[1];
    private IdleRight : Array<number> =[1];
    private Roll : Array<number> =[0];
    private AttackUp : Array<number> =[36,37,38,39,40,41,42];
    private AttackDown : Array<number> =[23,24,25,26,27,27,28];
    private AttackLeft : Array<number> =[29,30,31,32,33,34,35]; 
    private AttackRight : Array<number> =[29,30,31,32,33,34,35]; // duplicate of right animatoin with mirror
    private Despawn : Array<number> =[43,44];
    private Dance : Array<number> = [47,48];

    public WALKING :number = 0.03; // walking speed
    constructor() {

        super();
        this.renderOrder = 1;

        //centalise player pos to tilemap
        //this.pos = vec2(16, 9);
        //this.size = vec2(0.8);

        //console.log("Creating Player Sprite /", window.map.pos, "/", this.pos);
        
        // Fetch Player Health From Globals Singleton
        // Update Globals With Player Pointer

        //this.input = window.input; // global input singleton

        // create a pointer to the Particle fx class

        // store player object in global array
        window.globals.players.push(this);


        // Player Logic Variables 
        //this.WALK_SPEED = 1.65; // pixels per second 
        //this.ROLL_SPEED = 1000; // pixels per second
        //this.GRAVITY = 0; // For Platforming Levels // used simulation gravity instead
        
        this.ATTACK = 1; // For Item Equip
        this.hitpoints = window.globals.health; // global hp singleton 
        this.pushback = 5000;
        this.linear_vel = LittleJS.vec2(0, 0);
        this.roll_direction = LittleJS.vec2(0, 1);//Vector2.DOWN

        //this.StateBuffer = [];
        
        this.item_equip = ""; //Unused Item Equip Variant

        this.isSolid = true;

        // player GUI
        this.local_heart_box = window.ui.HEART_BOX; // Pointer To Heart Box HUD from the UI Class



        // TO DO:
        // (1) Connect to Mini Map UI
        // (2)

        // Connect Heart box signals


        // PLAYER'S FACING

        // set initial player's default state
        //this.state = this.matchState(); // the top down player logic //= this.TOP_DOWN.get("STATE_IDLE")!;
        //this.facing = this.matchInputs(); // the input state machine / facing logic  //= this.FACING.get("DOWN")!;
        

        //TO DO: player's camera pointer (1) Camer should follow/ track the player's position
        //TO DO: player's animation node pointer

        //disconnect extra signal
        //this.health_signal.disconnect(healthDebug);

        //PLAYER'S PARTICLE AND SOUND FX POINTERS
        // TO DO:
        // (1) Player's particle fx
        this.blood = null;
        this.despawn_particles = null;
        this.die_sfx = null;
        this.hurt_sfx = null;

        // Music Singleton Pointer
        // this would be kinda drepreciated as each Zzfx can play its own sould 
        // this not needing the music singleton pointer to actually play sfx
        this.music_singleton_ = null;

        //this.mass = 1; // make object have dynamic physics
        // player collision & mass
        //this.mass = this.GRAVITY; // make object have static physics

        //add state machine logic

        //little js camera pointer
        //console.log("player render order debug: ", this.renderOrder);
        //this.setCollision(true,true,true,true);
        //super.update();
    }



    hurt() {

        //use a timer to flash the player object colour from orig  -> white -> orig
        //(1) Play Hurt Animation
        //(2) Trigger kickback
        //(3) Update Player health
        // (4) Emit blood fx particle fx
        this.hitpoints -= 1;
        console.log("Player hit: ", this.hitpoints);
    }

    // to do:
    // rewrite logic to fit current input implementation
    matchInputss(): Record<number, () => void>  {
            


            /**
             * Maps input singleton states to the player's state machine
             * 
             *
            */
            // to do : attack and death
        
            // match facing animation
           // ['UP', 0],
           // ['DOWN', 1],
           // ['LEFT', 2],
        //  ['RIGHT', 3],
        return {
            0 : () => {

                // apply walking physics
                //this.state!["STATE_WALKING"]()

                this.mirror = false;

                // play the animation for 0.1 seconds
                this.playAnim(this.RunUp);
                
                //save previous facing data for idle state
                this.facingPos = 0;
                

            },
            1 : () => {
                //this.state!["STATE_WALKING"]()
                this.mirror = false;
                this.playAnim(this.RunDown);

                //save previous facing data for idle state
                this.facingPos = 1;
            },
            2 : () => {
                //this.state!["STATE_WALKING"]()

                this.mirror = true;
                this.playAnim(this.RunLeft);

                //save previous facing data for idle state
                this.facingPos = 2;
            },
            3 : () => {
                //this.state!["STATE_WALKING"]()
                
                this.mirror =  false;
                this.playAnim(this.RunRight);

                //save previous facing data for idle state
                this.facingPos = 3;
            },

            4 : () =>{

                
                // attack state
                //this.state["STATE_ATTACK"]();
            },

            5 : () => {
                // roll state
                //this.state["STATE_ROLL"]();

            },

            6 : () => {

                //temporarily adding for testing
                //this.state["STATE_WALKING"]()
                // idle state
                // use the previous facing position 
                // to play the corresponding idle animation

                if (this.facingPos == 0){this.currentFrame = 2}
                else if (this.facingPos == 1){ this.currentFrame = 0}
                else if (this.facingPos == 2){ this.currentFrame = 1; this.mirror = true}
                else if (this.facingPos == 3){ this.currentFrame = 1; this.mirror = false}
            }

        };
    };


    // stores complex player states
    matchState(): Record<string, () => void>  {

        return {
            "STATE_BLOCKED" : () => {

            },

            "STATE_IDLE" : () => {

            },

            "STATE_WALKING" : () => {

                const delta = window.simulation.deltaTime!;
                // walking state
                // ice level walking stage?
                //this.pos.x += this.input.pos.x * this.WALK_SPEED * delta ;
                //this.pos.y += this.input.pos.y * this.WALK_SPEED  * delta;


                //this.pos.x = this.input.pos.x * this.WALK_SPEED  ;//* delta ;
                //this.pos.y = this.input.pos.y  * this.WALK_SPEED ;//* delta;
            },
            "STATE_ROLL" : () =>{
                // rolling state machine currently unimplemented

            },

            "STATE_ATTACK" : () => {
                //console.log("attack state triggered");

                // logic:
                // get the current facing direction
                // play the appropriate facing attack animation 
                                // match the player's facing animation to the attack animation
                if (this.facingPos == 0){
                    this.mirror = false;
                    this.playAnim(this.AttackUp)
                }
                if (this.facingPos == 1){
                    this.mirror = false;
                    this.playAnim(this.AttackDown)
                }
                if (this.facingPos == 2){
                    this.mirror = true;
                    this.playAnim(this.AttackLeft);
                }
                if (this.facingPos == 3){
                    this.mirror = false;
                    this.playAnim(this.AttackRight);
                }
            }
        }
    }


    update() {
        /**
         * Features
         * 
         * (1) Fetches the input state from the global buffer
         * (2) Maps the input state buffer to the particular player's animation
         */

        //
        // To DO:
        // (1) Idle animation
        // (2) Attack animation
        // (3) Dance animation

        /**
         * Delta Time Calculation
         */

        //Gets Delta Time calculation from Simulation singleton
        //this.frameCounter += window.simulation.deltaTime!; //accumulate elasped time

        //console.log("pos debug:", this.pos);

        //this.playAnim(this.IdleDown);
                // apply movement controls
        //this.facing[3]();

        // velocity logic
        // temporarily disabled for refactoring Jul 15th/ 2025
        //const moveInput = LittleJS.keyDirection().clampLength(1).scale(.001); // clamp and scale input
        //this.velocity = this.velocity.add(moveInput); // apply movement
        //console.log("move input debug: ", moveInput);
        //super.update(); // call parent update function
        
        //cameraPos = this.pos; // move camera with player
        //this.playAnim(this.IdleDown);
        this.tileInfo = tile(5,128,0,1);
        /**
         * Simple State Machine
         * 
         * Features:
         * 
         * (1) Plays the player animation
         * (2) Manages & Stores the Player's state
         * 
         */
        // Simple State Machine Logic
        // triggers the state machine logic
        // feeds the input state into the state machine logics
        // match inputs and match state
        // bug:
        // (1) theres a time lag between the button pressed and button released causing a stuck idle bug
        
        //let inputState : number = this.input.getState();
        
        // to do: (1) fix stuck idle state bug and input buffer spammer
        //console.log("stae debug 12: ", sstate, "/", this.input.get_Buffer());
        
        //console.log("state debug: ", inputState);
        // gets the input state from the singleton
        // passes it as a parameter to the state machine logic
        // would break with the below error if the state doesn't exist
        // error :  game.ts:2172:16 Uncaught TypeError: this.facing[inputState] is not a function
        
        
        

        // TO DO: 
        // (1) Move to simulation singleton
        // player hit collision detection
        // detects collision between any enemy in the global enemies pool
        //for (let i = 0; i < window.globals.enemies.length; i++) {
        // 
        // to do:
        // (1) recorganise code architechture to work with multiple enemies using object pooling
        // (2) i'm temporarily disabling that to quicky hack hit collision logic for one enemy
        
        /** 
        if (window.enemy){ //&& inputState == 4
            if (LittleJS.isOverlapping(this.pos, this.size, window.enemy.pos, window.enemy.size) ) { // if hit collission and attack state
                    //console.log("Player Hit Collision Detection Triggered");

                    // Attack
                    // reduce enemy health
                    window.enemy.hitpoints -= 1;

                    window.enemy.kickback();

                    //hit register


                    //sfx
                    window.music.hit_sfx[2].play();
                }

        }
                */

    }

    

    despawn() {
        // (1) Play Despawn Animation
        if (this.hitpoints <= 0) {
            // delete player object
            this.destroy();

            // set the global player to null
            //window.player = null;
        }
    }

    respawn() {
        return 0;
    }

    shake() {
        // shaky cam fx
        return 0;
    }

    update_heart_box(){
        console.log("update heart box function is unimplemented. Fix heartbox bug");
    }


}

class Enemy extends PhysicsObject {
    // To DO :
    // (1) Enemy spawner
    // (2) Enemy Mob logic using Utils functions
    // (3) Enemy State Machine (1/2)
    // (4) Enemy Collisions
    // (5) Enemy Animations (2/2)
    // (6) Synchronize enemy and player state machine enumerations
    // (7) Connect to Utils hit collision detection system

    public hitpoints: number = 5;
    public speed: number = 3;
    public detectionRange: number;
    public minDistance: number;
    public wanderCooldown: number;
    private targetPos: Vector2;
    
    private type_enum: Map<string, number> = new Map([
            ['EASY', 0],
            ['INTERMEDIATE', 1],
            ['HARD', 2]
    ]);
    
    public facing_enum : Map<string, number> = new Map([
        ["up",0],
        ["down",1],
        ["left", 2],
        ["right",3]
    ]);

    public enum: Map<string, number> = new Map([
            ['STATE_IDLE', 0],
            ['STATE_WALKING', 1],
            ['STATE_ATTACK', 2],
            ["STATE_ROLL", 3],
            ["STATE_DIE", 4],
            ["STATE_HURT", 5],
            ["STATE_MOB", 6],
            ["STATE_PROJECTILE", 7],
            ["STATE_PLAYER_SIGHTED", 8],
            ["STATE_PLAYER_HIDDEN", 9],
            ["STATE_NAVIGATION_AI", 10]
    ]);



    private kick_back_distance : number = 0;
    private facing_ : number = 1; // stores the current facing direction

    // Match Frame Rate to Both Enemy TIme And Engine FPS
    private IDIOT_FRAME_RATE: number = 60;
    private SLOW_FRAME_RATE: number = 30;
    private AVERAGE_FRAME_RATE: number = 15;
    private FAST_FRAME_RATE: number = 5;
    private despawn_timer: any;

    //Animation variables
    //public currentFrame : number = 0;
    
    // animation frames
    private RunUp : Array<number> =[28,29,30,31];
    private RunDown : Array<number> =[20,21,22,23];
    private RunLeft : Array<number> =[24,25,26,27];
    private RunRight : Array<number> =[24,25,26,27];
    private AttackUp : Array<number> = [6,7,8];
    private AttackDown : Array<number> = [0,1,2];
    private AttackLeft : Array<number> = [3,4,5];
    private AttackRight : Array<number> = [3,4,5];
    private Roll : Array<number> = [15,16,17,18,19];
    private Despawn : number[] = [9,11,13,9,11,13];

    // state machine variables
    public state : number = this.enum.get("STATE_IDLE")!;

    public stateMachine: Record<string, () => void>;
    public facing: Record<number, () => void>;
    public X : number = 0;
    public Y : number  = 0; // used for facing animation calculations

    // Enemy AI variables
    public local_player_object : Player | null = window.player;
    public direction : Vector2 = vec2(0);
    public length : number = 0;
    private delta : number = 0;
    private random_walk_direction : Vector2 = vec2(100);

    // unused important boolean
    private isDead : boolean = false;
    private isStunned : boolean = false;

    // Enemy FX
    // todo:
    public despawn_particles : ParticleFX| null = null; 

    constructor(pos: Vector2) {
        super();
        //(1) set the Enemy object's position
        //(2) set the Enemy object's type which determines the logic

        console.log("creating enemy object");

        //this.size = vec2(0.8);

        // set enemy position from the initialisation script
        //this.pos = pos.copy();

        // store object to global pointer for object pooling
        window.globals.enemies.push(this);


        // store player object in global array
        window.globals.enemies.push(this);


        // Enemy State Machine initialisation
        this.stateMachine = this.StateMachine();
        this.facing = this.Facing();


        // set enemy collision
        this.setCollision(true,true,true,true);

        // Testing Enemy Type Enumeration
        //console.log("Input Debug 1: ", this.enemy_type.get("EASY"), "/ player debug 3: ", this.local_player_object);

        // Enemy collision & mass
        //this.setCollision(true, true); // make object collide
        //this.mass = 0; // make object have static physics

        //enemy AI variables


        this.detectionRange = 200; // Range to detect the player
        this.minDistance = 30; // Minimum distance from player to stop following
        this.targetPos = vec2(0, 0); // Random wandering target
        this.wanderCooldown = 0; // Time before choosing a new wandering target


        // blood fx
        //this.blood_fx = null
        // Timer to destroy the ParticleFX object after 5 seconds
        this.despawn_timer = new Timer;    // creates a timer that is not set
        this.kick_back_distance = Utils.calcRandNumber();


    }
    render(){
        // draw the enemy tiles
        //console.log(this.currentFrame); // frame positioning doesnt start from 0
        //down : 17,18,19,20
        // bug: enemy tileset cuts off the last frame row
        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 2, 0), this.color, 0, this.mirror);

    }
    update() {
        // to do:
        // (1) logic is ported to simulation singleton

        // Despawn logic
        if (this.hitpoints <= 0) {
            this.despawn(); // trigger despawn timer

        }

   

        this.frameCounter += window.simulation.deltaTime!
        
        // if player object is valid
        if (this.local_player_object) {

            // trigger the enemy mob state
            this.state = this.enum.get("STATE_MOB")!;
            this.stateMachine[this.state]();
            
            this.X = Math.round(this.direction.x);
            this.Y = Math.round(this.direction.y);


            //console.log("x: ",this.X, " y: ",this.Y);
            //update the facing for animation calculation
            
            this.update_facing(this.X, this.Y);

            // Enemy hit collision detection
            // todo : 
            // (1) connect both player and enemy state machines to simulation collision detection
            if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                //console.log("ENemy Hit Collision Detection Triggered: ", distanceToPlayer);

                // this.hitpoints -= 1;
                //this.pos = window.player.pos


                // TO DO: 
                // (1) Trigger Kickback Logic
                // (2) Add Raycast for detection
                return 0;
            }

        }

        // if player object is null
        if (!this.local_player_object){
            // trigger the enemy idle state
            // to do:
            // (1) implement state enumeration logic for the state machine here (done)
            // (2) enemy navigation
            this.state = this.enum.get("STATE_IDLE")!;

            this.stateMachine[this.state]();
        }

        
        // exit tree

        // if (this.despawn_timer.elapsed() && this.hitpoints <= 0) {
        //this.blood_fx.destroy();

        // destroy block when hitpoints is at zero or less and despawn animation finished playing
        /////    this.destroy();
        //}

    }



    _get_player() {

        //(1) Gets the Player Object in the Scene Tree if Player unavailable, get him from the global pointer 
        return 0;
    }

    kickback() {
        //console.log("kickback called / hp: ", this.hitpoints);
          // Prevent kickback if enemy is already stunned or dead
        if (this.isDead || this.isStunned) return 0;

        // Mark as stunned temporarily
        //this.isStunned = true;
        // Calculate direction from damage source
        const dx = this.pos.x - this.local_player_object!.pos.x;
        const dy = this.pos.y - this.local_player_object!.pos.y;


        const magnitude = Math.sqrt(dx * dx + dy * dy) || 1; // avoid divide-by-zero        
        const knockbackStrength = 5; // tweak this for stronger pushback
        const knockbackX = (dx / magnitude) * knockbackStrength;
        const knockbackY = (dy / magnitude) * knockbackStrength;

        this.pos.x += knockbackX;
        this.pos.y += knockbackY;

        this.playAnim(this.Despawn);
        
        return 1;
    }

    despawn() {
        // The Enemy Despawn animation
        // bug :
        // (1) Enemy despawn logic doesn't work (done)
        // (2) No Enemy despawn animation or vfx
        
        window.globals.kill_count += 1;
        //this.local_player_object = null; // turn off mob logic

        // spawns objects non stop and the position doesn't change
        //this.despawn_particles = new Blood_splatter_fx(this.pos, this.size);

        // spawn item if able to
        // logic:
        // (1) if this enemy has the itemspawner object as a child node
        // (2) call the item spawn function

        // bug: 
        // (1) animation doesn't play

        this.state = this.enum.get("STATE_DIE")!;
        this.stateMachine[this.state](); 
        // call the destruction function after a time lag
        
        //this.despawn_timer.set(3);
        //this.despawn_particles!.destroy();
        

        // remove object from global object pool
        // remove object from global array
        const index = window.globals.enemies.indexOf(this);
        if (index !== -1) {
            window.globals.enemies.splice(index, 1);
        }

        

        
    }
    _on_enemy_eyesight_body_entered() {
        // player detection with a raycast
        return 0;
    }

    _on_enemy_eyesight_body_exited() {
        // player leaves enemy detection raycast
        return 0;
    }

    update_facing(X : number, Y : number){
        // Updates the enemy object's facing parameter for animation
        //
        //console.log("Updating facing");
        
        if (X == 0 && Y == 1){
            //console.log("facing up"); // up
            
            const y = this.facing_enum.get("up")!;
            this.facing[y]();
            

            
        }

        if (X == 1 && Y == 0){
            //console.log("facing right");

            const x = this.facing_enum.get("right")!;
            this.facing[x]();
            
        }
        if (X == -1 && Y == 0){
            //console.log("facing left");
            const a = this.facing_enum.get("left")!;
            this.facing[a]();
            
        }
        if (X == 0 && Y == -1){
            //console.log("facing down"); //down
            const b = this.facing_enum.get("down")!;
            this.facing[b]();
            
        }
        }


    // State Machines
    // enemy state machine
    // describes each states and is assigned to a class variable in the consstructor
    StateMachine(): Record<number, () => void>  {

        // cheat sheet for statemachine enum
        //['STATE_IDLE', 0],
        //['STATE_WALKING', 1],
        //['STATE_ATTACK', 2],
        //["STATE_ROLL", 3],
        //["STATE_DIE", 4],
        //["STATE_HURT", 5],
        //["STATE_MOB", 6],
        //["STATE_PROJECTILE", 7],
        //["STATE_PLAYER_SIGHTED", 8],
        //["STATE_PLAYER_HIDDEN", 9],
        //["STATE_NAVIGATION_AI", 10]


        return {
            0 : () => { // idle state
                //console.log("idle state triggered");
            },
            1: () =>{

            },
            4: () =>{ // die state
                        
                this.playAnim(this.Despawn);
                this.isDead =true;
                console.log("Destroying Enemy");
                
                this.destroy();
                
            },

            6 : () => {  // enemy mob ai

                /**
                * Enemy Mob AI
                * 
                * Features:
                * 
                * (1) Compute the direction from AI to player.
                * (2) Normalize that direction.
                * (3) Multiply by AI speed × deltaTime to get movement.
                * (4) Add that movement to the AI's position.
                *  
                */
                this.delta = window.simulation.deltaTime!;

                // get initial direction to player
                this.direction = Utils.restaVectores(this.local_player_object!.pos, this.pos);

                // get length to player
                // to do: i can use the direction to calculate the facing and play the appropriate
                this.length = Math.hypot(this.direction.x, this.direction.y);

                // if it's more than 1 pixel, normalize the direction
                // less than a pixel bugs out the calculation
                // to do:  use this logic to map out player detectoin range logic
                if (this.length > 10.0) { // bugs out if the length is too low
                        this.direction.x /= this.length;
                        this.direction.y /= this.length;
                    }

                

                
                            
                // Add movement to ai position
                this.pos.x += this.direction.x * this.speed * this.delta;
                this.pos.y += this.direction.y * this.speed * this.delta;

            },

            7 : () => {

            },
            8 : () => {

            },
            9 : () => {

            },
            10 : () => {

            },
            11 : () => {

            }
        }
    }

    //cheatsheet
    //["up",0],
    //["down",1],
    //["left", 2],
    //["right",3]

    Facing(): Record < number, () =>void>{
        return{
        0 : () => {

            // facing up
            this.mirror = false;
            //console.log("playing run up anims: ", this.RunUpp);
            this.playAnim(this.RunUp);
        },
        1 : () => {
            // facing down
            this.mirror = false;
            this.playAnim(this.RunDown);

        },
        2 : () => {
            //facing left
            this.mirror = true;
            this.playAnim(this.RunLeft);
        },
        3 : () => {
            //facing right
            this.mirror = false;
            this.playAnim(this.RunRight);
        }
     }
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

class ItemSpawner extends GameObject {
/**
 * Item Spawner Object
 * 
 * Features:
 * (1) Object to be held by enemy objects
 * (2) Randomly spawns an array of game items when enemy is despawned
 * 
 */


}

class Coins extends GameObject {
    /**
     * 
     * Game Coin Object
     * 
     * to do:
     * (1) Add coins animation sprites
     * (2) Add ATC Transaction to coin collision 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        this.tileInfo = tile(22, 128, 2, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(22, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        // set player collision to coin object
        // set coin idle animation
        if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

            console.log("coin collected, creating atc txn");
            this.destroy();
            
        }

    }
}


class Bomb extends GameObject {
    /**
     * 
     * Game Bomb Item (collect)
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        //this.tileInfo = tile(22, 128, 1, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(20, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        // set player collision to coin object
        // set coin idle animation
        if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
            
            console.log("Bomb item collected");
            this.destroy();

            // update bomb count in inventory
            let y : number = window.inventory.get("Bomb");
            let z : number = y + 1;
            window.inventory.set("Arrow", z);
            
        }

    }
}

class Bullet extends GameObject{
    /**
     * 
     * Game Arrow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */


}

class Bow extends GameObject{
    /**
     * 
     * Game Bow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(24, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        // set player collision to coin object
        // set coin idle animation
        if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
            
            console.log("Bow item collected");
            this.destroy();

            // update bomb count in inventory
            let y : number = window.inventory.get("Bow");
            let z : number = y + 1;
            window.inventory.set("Bow", z);
            
        }

    }


}

class Arrow extends GameObject{
    /**
     * 
     * Game Arrow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        //this.tileInfo = tile(22, 128, 1, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(23, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        // set player collision to coin object
        // set coin idle animation
        if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
            
            console.log("Arrow item collected");
            this.destroy();

            // update bomb count in inventory
            let y : number = window.inventory.get("Arrow");
            let z : number = y + 1;
            window.inventory.set("Arrow", z);
            
        }

    }

}

class HealthPotion extends GameObject{
        /**
     * 
     * Game Bomb Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        //this.tileInfo = tile(22, 128, 1, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(21, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        // set player collision to coin object
        // set coin idle animation
        if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
            
            console.log("Health Potion item collected");
            this.destroy();

            // update bomb count in inventory
            let y : number = window.inventory.get("Health Potion");
            let z : number = y + 1;
            window.inventory.set("Health Potion", z);
            
        }

    }

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
            const bullet = new Bullet(); // arrow instance

            console.log("arrow debug 1: ", bullet);

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
            
            
            //window.enemy = new Enemy(vec2(5, 10));
            
            /**
             * I'm testing all item implementaions before 
             * moving their spawing to a sprite atlas + overworld instance code
             */
            // coins object
            const t = new Coins( vec2(15, 0)); 
            const u = new Bomb(vec2(17, 0));
            const i = new Bow(vec2(19, 0));
            const o = new HealthPotion(vec2(21,0));
            const p = new Arrow(vec2(23,0));
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
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ["/source_code/resources/Environment Tilesets & Tilemaps/player_tileset_128x128.png", "/source_code/resources/pj/enemy_tileset_128x128.webp", "/source_code/resources/Environment Tilesets & Tilemaps/godot_128x_dungeon_tileset.webp"]);



