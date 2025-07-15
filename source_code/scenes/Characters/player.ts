import * as LittleJS from 'littlejsengine';

const {EngineObject, drawTile, Timer,tile} = LittleJS;


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
        //this.currentFrame
        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 0, 0), this.color, 0, this.mirror);
    }
}



export class Player extends PhysicsObject {
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
    public mass: number = 1; //window.simulation.gravity;//this.GRAVITY;
    public gravityScale: number = 0;
    
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

        // create a pointer to the Particle fx class

        // store player object in global array
        window.globals.players.push(this);

        
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

    // to do:
    // rewrite logic to fit current input implementation
    matchInputss(): Record<number, () => void>  {
        /**
         * Maps input singleton states to the player's state machine
         * 
         *
         */
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

        // velocity logic
        // move input is the key direction serialised in to vector 2 positions
        
        const moveInput = LittleJS.keyDirection().clampLength(1).scale(.1); // clamp and scale input
        
        this.velocity = moveInput;//this.velocity.add(moveInput); // apply movement
        
        console.log("move input debug: ", moveInput, "/",this.velocity);
        super.update();
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
