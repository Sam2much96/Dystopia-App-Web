import * as LittleJS from 'littlejsengine';

const {EngineObject,Timer,isUsingGamepad, gamepadStick,  touchGamepadEnable, isTouchDevice,setTouchGamepadAlpha, setTouchGamepadAnalog,setGravity,vibrate,keyDirection,setTouchGamepadSize, setTouchGamepadEnable, mouseIsDown, keyIsDown, gamepadIsDown,drawTile,tile, vec2} = LittleJS;


import { logToScreen } from '../../singletons/Debug';

export class PhysicsObject extends EngineObject {
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
        this.setCollision(true,true,true,true); // make object collide
        this.mass = 1; // make object have static physics


        // Game Pad on Mobile Devices Settings
        setTouchGamepadEnable(true);
        setTouchGamepadSize(256);
        setTouchGamepadAlpha(0.3);

        // set dpad configuration on mobile browsers 
        setTouchGamepadAnalog(false);
        
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
        if (this.frameCounter >= this.animationCounter) {
            //console.log("animation debug: ", this.frameCounter, "/", this.animationCounter);    
        
            //loop animation function
            this.currentFrame = this.animate(this.currentFrame, anim);
            //console.log(this.currentFrame);
            this.frameCounter = 0; // Reset timer
                    
        }
    }

    render() {

        // bug:
        // (1) player animation frame is iffy

        //// set player's sprite from tile info and animation frames
        //console.log("frame debug: ",this.currentFrame);
        //this.currentFrame
        //console.log("pos debug: ", this.pos);

        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 0, 0), this.color, 0, this.mirror);
    }
    
}


export class Player extends PhysicsObject{

    // core player class

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
        
    * (4) Fix attack animation bug
    * (5) Create sidescrolling player physics object
    */

    // Constants
    public WALK_SPEED: number = 1.65; // pixels per second
    public ROLL_SPEED: number = 1000; // pixels per second
    //private GRAVITY: number = 0; // For Platforming Levels
    public ATTACK: number = 1; // For Item Equip
    public pushback: number = 5000;

    // Properties
    //private input: Inputs = window.input;
    public hitpoints: number = 3;
    public linear_vel = vec2(0, 0);
    public roll_direction = vec2(0, 1);
    public StateBuffer: number[] = [];
    public item_equip: string = ""; // Unused Item Equip Variant


    // State Machines Enumerations
    public TOP_DOWN: Map<string, number> = new Map([
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
    public FACING: Map<string, number> = new Map([
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
    public local_heart_box: any; // Update type to match UI class
    public blood: any | undefined;
    public despawn_particles: any  | undefined;
    public die_sfx: any | undefined;
    public hurt_sfx: any = null;
    public music_singleton_: any = null;

    // Player attributes
    //public mass: number = 1; //window.simulation.gravity;//this.GRAVITY;
    public gravityScale: number = 1;
    
    //public size: Vector2 = vec2(1);
    //public tileInfo: LittleJS.TileInfo; // Update type to match tile info structure
    public animationTimer: LittleJS.Timer = new Timer();
    public currentFrame: number = 0;
    public previousFrame: number = 0;

    // Player Animation frame data sorted as arrays
    public RunUp : Array<number> =[3, 4, 5, 6, 7, 8];
    public RunDown : Array<number> =[9, 10, 11, 12, 13, 14, 15];
    public RunLeft : Array<number> =[17, 18, 19, 20, 21, 22];
    public RunRight : Array<number> =[17, 18, 19, 20, 21, 22];
    public IdleUp : Array<number> =[2];
    public IdleDown : Array<number> =[0];
    public IdleLeft : Array<number> =[1];
    public IdleRight : Array<number> =[1];
    public Roll : Array<number> =[0];
    public AttackUp : Array<number> =[36,37,38,39,40,41,42];
    public AttackDown : Array<number> =[23,24,25,26,27,27,28];
    public AttackLeft : Array<number> =[29,30,31,32,33,34,35]; 
    public AttackRight : Array<number> =[29,30,31,32,33,34,35]; // duplicate of right animatoin with mirror
    public Despawn : Array<number> =[43,44];
    public Dance : Array<number> = [47,48];

    public WALKING :number = 0.03; // walking speed

        // input controlls
    public moveInput : LittleJS.Vector2 = vec2(0);
    public holdingRoll : any;
    public holdingAttack : any;

    constructor(pos : LittleJS.Vector2){
        super();
        this.pos = pos;
        
        // store player object in global array
        window.globals.players.push(this);
        this.hitpoints = window.globals.health; // global hp singleton 
        // player GUI
        this.local_heart_box = window.ui.HEART_BOX; // Pointer To Heart Box HUD from the UI Class
        //this.isSolid = true;

        //touch device debug
        console.log("Touch device debug: ", isTouchDevice);

    }

    update(): void {
        
        // Capture movement control
        // gamepad breaks on itchIO because i used a redirect to dystopia.online
        // to do : (1) add redundancy code for gamepad logic on different platforms
        // bug: Game pad stick capture doesnt affect logic
        
        if (isTouchDevice){ // touchscreen dpad bindings
            this.moveInput = gamepadStick(0,0).clampLength(1).scale(.1) ;
            this.holdingRoll = gamepadIsDown(1); 
            this.holdingAttack  = gamepadIsDown(2);     
            
            // for debugging player input on mobile
            //logToScreen(this.moveInput);
        }

        if (!isTouchDevice){ // keyboard and mouse bindings
            //works
            this.moveInput = keyDirection().clampLength(1).scale(.1);
            this.holdingRoll = keyIsDown('Space') || mouseIsDown(1);
            this.holdingAttack = mouseIsDown(0) || keyIsDown('KeyX');
        }



        super.update();
    }

    

}


export class TopDownPlayer extends Player {
    
    constructor(pos : LittleJS.Vector2) {
        //console.log("player pos debug :", pos);

        super(pos);
        this.renderOrder = 1;
        //this.pos = pos; //vec2(0,0); // 7,10 for overmap 1
        this.size =vec2(0.8);
        // create a pointer to the Particle fx class

       
        
        this.ATTACK = 1; // For Item Equip
        this.pushback = 5000;
        this.linear_vel = vec2(0, 0);
        this.roll_direction = vec2(0, 1);//Vector2.DOWN

        
        this.item_equip = ""; //Unused Item Equip Variant


        // TO DO:
        // (1) Connect to Mini Map UI
        // (2) Write an Input State Machine for attack input capture

        // Connect Heart box signals


        // PLAYER'S FACING

        // set initial player's default state
        //this.state = this.matchState(); // the top down player logic //= this.TOP_DOWN.get("STATE_IDLE")!;
        //this.facing = this.matchInputs(); // the input state machine / facing logic  //= this.FACING.get("DOWN")!;
        
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

    }



    hurt() {

        //use a timer to flash the player object colour from orig  -> white -> orig
        //(1) Play Hurt Animation
        //(2) Trigger kickback
        //(3) Update Player health
        //(4) Emit blood fx particle fx
        this.hitpoints -= 1;
        console.log("Player hit: ", this.hitpoints);
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

        

        //console.log("pos debug:", this.pos);
        //Gets Delta Time calculation from Simulation singleton
        this.frameCounter += window.simulation.deltaTime!; //accumulate elasped time

        // velocity logic
        // move input is the key direction serialised in to vector 2 positions
       // apply walking physics
        this.State()["STATE_WALKING"]();
        //super.update();
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

    /**
     * Top Down Player State Machine
     * 
     * @returns 
     * 
     */
    // stores complex player states
    State(): Record<string, () => void>  {

        return {
            "STATE_BLOCKED" : () => {

            },

            "STATE_IDLE" : () => {
            },

            "STATE_WALKING" : () => {

                //const delta = window.simulation.deltaTime!;
                // walking state
                //const moveInput = keyDirection().clampLength(1).scale(.1); // clamp and scale input
        
                //if (this.moveInput){
                //console.log("movement debug: ", this.moveInput);
                this.velocity = this.moveInput;// apply movement
                //console.log("move input debug: ", this.moveInput, "/",this.velocity);
                    
                //}
                super.update();

                
            
                
                // play facing animations by normalising moveInput vec2 positions to animation directions
                if (this.velocity.x === -0.1){
                    
                    // play run left animation
                    this.mirror = true;
                    this.playAnim(this.RunLeft);

                    //save previous facing data for idle state
                    //this.facingPos = 2;
                }
                if (this.velocity.x === 0.1){
                    this.mirror =  false;
                    this.playAnim(this.RunRight);

                    //save previous facing data for idle state
                    //this.facingPos = 3;
                }
                if (this.velocity.y === 0.1){
                    // dbug the animation frames
                    //console.log("animation frames debug: ", this.RunUp);

                    // play run up animation
                    this.mirror = false;
                    this.playAnim(this.RunUp);

                    //save previous facing data for idle state
                    //this.facingPos = 0;
                }
                if (this.velocity.y === -0.1){

                    //console.log("play run down animation");
                    // play run down animation
                    this.mirror = false;
                    this.playAnim(this.RunDown);

                    //save previous facing data for idle state
                    //this.facingPos = 1;
                }

                
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



}


export class SideScrollPlayer extends Player {
    /**
     * Side scrolling player
     * 
     * Features:
     * (1) Gravity
     * 
     */

    constructor(pos : LittleJS.Vector2){
        super(pos);
        
        //this.mass = 10;
        
        //super.update();
        //setGravity(10);
        //super.update();
        
    }

    update(){
        
        // calls the input capture in the parent update class
        


        // debug movement input variables
        //console.log("movement debug :", this.moveInput);

        // top down walking state
        //this.State()["STATE_WALKING"]();

        //this.velocity.y = 10; // gravity doesnt work here

        this.velocity = this.moveInput; // top down movement logic
        super.update();


    }
}





export class Inputs  {

    /*
    Functions:
    
    (1) Handles And Porpagates all Input In the Game
    (2) Stores Input to An Input Buffer
    (3) Handles creation and Destruction of Game HUD as a child
    (4) Maps Player Input Action To A Global Enum
    (5) Contains pointers to the game hud ui, stats hud ui, status text ui, and the virtual pad touch hud
    
    TO DO:
    (1) Map and Test Gamepad implementation in the wild

    Bugs:
    (1) Input buffer spamming
    (2) Stuck idle bug - temprarily disabling idle state for input buffer spamming fix
    (3) Vibration spamming bug on mobile
    */

    //public color: LittleJS.Color;
    public input_buffer: number[];
    public input_state: Map<string, number>;
    public state: number = 0; // holds the current input state asides the input buffer
    //public WALKING: number;

    //input buffer conditional
    public saveBuffer : boolean = false;

    //private local_global_singleton = window.globals;//safe pointer to global singleton for game settings
    
    // game controls & settings
    public vibrate : boolean = false; // game vibration on mobile temporarily turned for for state machine refactor

    
    constructor() {
        //super();
        //this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        // Input Buffer
        this.input_buffer = [];

        //Input State Machine Enumeration
        this.input_state = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
            ['ATTACK', 4],
            ['ROLL', 5],
            ["IDLE", 6],
        ]);



    }

    // Returns The Input Buffer as An Array
    get_Buffer() {
        return this.input_buffer
    }

    update() {
        /**
         * 
         * Features:
         * (1) Maps Key Presses To Input States And Appends Them to The input buffer
         * 
         * To DO:
         * (1) FIx idle state stuck bug by rewriting state machine logic like the player state machine.
         *   - less ifs 
         */


        // mouse and TouchScreen Input
        // use for minimap inputs 
        //this.pos = mousePos;

        // Keyboard Input Controller

        //
        // Move UP
        //
        if (LittleJS.keyIsDown('ArrowUp')) {
            //console.log("key up pressed");
            this.up()
        }

        if (LittleJS.keyWasReleased("ArrowUp")){
                
        //this.idle();
        }

        // Move Down
        if (LittleJS.keyIsDown('ArrowDown')) {
            this.down()
        }

        if (LittleJS.keyWasReleased("ArrowDown")){
            //this.idle()
        }


        // Move Left
        if (LittleJS.keyIsDown('ArrowLeft')) {
            //console.log("key left pressed");
            this.left()
        }

        if (LittleJS.keyWasReleased("ArrowLeft")){
            //this.idle()
        }


        // Move Right
        if (LittleJS.keyIsDown('ArrowRight')) {
            this.right()

        }

        if (LittleJS.keyWasReleased("ArrowRight")){
            //this.idle()
        }

        // Attack
        if (LittleJS.keyIsDown('KeyX')) {
            this.attack()

        }
        
        if (LittleJS.keyWasReleased("KeyX")){
            //this.idle()
        }


        // Dash
        if (LittleJS.keyIsDown('Space')) {
            this.roll();

        }

        // Debug Input Buffer
        if (LittleJS.keyWasPressed('KeyL')) {
            console.log("key L as pressed! ");
            console.log("Input Buffer: ", this.get_Buffer());
        }



        // Virtual GamePad Input for mobiles
        let stk = LittleJS.gamepadStick(0, 0); // capture gamestik
        if (stk.x < 0) {
            // move left
            this.left();
        }

        if (stk.x > 0) {
            // move right
            this.right();
        }

        if (stk.y < 0) {
            // move down
            this.down();
        }
        if (stk.y > 0) {
            // move up
            this.up();
        }

        if (stk.x == 0 && stk.y == 0) {
            // idle state
            //this.idle();
        }




        // Virtual Gamepad Controller
        if (LittleJS.gamepadIsDown(1)) {
            //console.log("Game Pad Was Pressed, Test Successfull: ");
            //return 0;
            this.roll();
        }

        if (LittleJS.gamepadIsDown(2)) {
            //console.log("Game Pad Was Pressed, Test Successfull 2");
            this.attack()
        }

        if (LittleJS.gamepadIsDown(3)) {
            //console.log("Game Pad Was Pressed, Test Successfull 3");
            //return 0;
            this.attack;
        }


        if (LittleJS.gamepadIsDown(0)) {
            //console.log("Game Pad Was Pressed, Test Successfull 4");
            //return 0;
            this.roll();
        }

        /**
         * 
         * Input Buffer cache management
         * 
         */
        // Prevents Buffer/ Mem Overflow for Input Buffer
        if ( this.saveBuffer && this.input_buffer.length > 12) {
            this.input_buffer.length = 0; // Clears the array
        }

        //this.setCollision(true,true,true,true);
        //super.update();

    }

    /**
     * 
     * INPUT STATES AS FUNCTIONS
     * 
     * Features:
     * 
     * (1) Updates the Input buffer for global objects
     * Using functions
     */

    idle(){
        //console.log(" Idle State");
        
        // to do : 
        // (1) fix input buffer spammer; temporarily turning off
        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("IDLE") ?? 6);}
        
        

        // update current state
        this.state = this.input_state.get("IDLE")!;
    }

    attack() {
        // Attack State
        //console.log(" Attack Pressed");

        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("ATTACK") ?? 4);}

        // update current state
        this.state = this.input_state.get("ATTACK")!;

        if (this.vibrate == true){

        // to do : 
        // (1) fix vibrate duration on mobile with a delay timer 
        // Little JS vibrate for 100 ms
        vibrate(40);
        }
    }

    roll() {
        // to do:
        // (1) write roll logic with vector maths calculations
        // dash state
        // console.log(" Dash Pressed");

        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("ROLL") ?? 5);}

        // update current state
        this.state = this.input_state.get("ROLL")!;


        // Little JS vibrate for 100 ms
        if (this.vibrate == true){vibrate(40);}
    }

    up() {
        //console.log("key up was pressed! ");

        // update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("UP") ?? 0);}

        let y = this.input_state.get("UP")!
        //console.log("state debug 3:", y);
        
        // update current state
        this.state = y;

        //console.log("state debug 1: ", this.state);

        // move up
        //this.pos.y += this.WALKING;
        //console.log("Position debug 1: ", this.pos.x);

        // Little JS vibrate for 100 ms
        if (this.vibrate == true){vibrate(40);}
    }

    down() {
        //console.log("key down as pressed! ");

        // update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("DOWN") ?? 1);}

        // update current state
        this.state = this.input_state.get("DOWN")!;

        // move down
        //this.pos.y -= this.WALKING;

        // Little JS vibrate for 100 ms
        if (this.vibrate == true){vibrate(40);}
    }

    right() {

        //move right
        //console.log("key right was pressed! ");

        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("RIGHT") ?? 3);}

        // update current state
        this.state = this.input_state.get("RIGHT")!;

        // move right
        //this.pos.x += this.WALKING;

        // Little JS vibrate for 100 ms
        if (this.vibrate == true){vibrate(40);}
    }

    left() {

        // move left
        //console.log("key left was pressed! ");

        //update input buffer
        // to do
        // (1) fix input buffer spammer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("LEFT") ?? 2);}


        // update current state
        this.state = this.input_state.get("LEFT")!;

        // move left
        //this.pos.x -= this.WALKING;

        // Little JS vibrate for 100 ms
        if (this.vibrate == true){vibrate(40);}
    }

    getState() : number {
        return this.state;
    }

}
