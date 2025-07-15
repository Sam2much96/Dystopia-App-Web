import * as LittleJS from 'littlejsengine';

const {vibrate} = LittleJS


//depreciated input buffer

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
