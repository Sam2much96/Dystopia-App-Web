// to do: (1) update documentation
// (2) rewrite all collision classes to use static type checks instead of global singletons , this would fix the enemy mob and the 
// buggy hit collision problem

import * as LittleJS from 'littlejsengine';
import { Player} from './player';
import { Utils, PhysicsObject } from '../../singletons/Utils';

const {Vector2,vec2, drawTile, isOverlapping, Timer,tile} = LittleJS;




export class Enemy extends PhysicsObject {
    // To DO :
    // (1) Enemy spawner
    // (2) Enemy Mob logic using Utils functions (done)
    // (3) Enemy State Machine (1/2)
    // (4) Enemy Collisions
    // (5) Enemy Animations (2/3)
    // (6) Synchronize enemy and player state machine enumerations
    // (7) Connect to Utils hit collision detection system (done)

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
    private RunRight : Array<number> =[...this.RunLeft];
    private AttackUp : Array<number> = [6,7,8];
    private AttackDown : Array<number> = [0,1,2];
    private AttackLeft : Array<number> = [3,4,5];
    private AttackRight : Array<number> = [...this.AttackLeft];
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
    //public despawn_particles : ParticleFX| null = null; 

    constructor(pos: LittleJS.Vector2) {
        super();
        //(1) set the Enemy object's position
        //(2) set the Enemy object's type which determines the logic

        console.log("creating enemy object");

        //this.size = vec2(0.8);

        // set enemy position from the initialisation script
        this.pos = pos.copy();

        // store object to global pointer for object pooling
        window.globals.enemies.push(this);


        // store player object in global array when instanced
       // window.globals.enemies.push(this);


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
        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 1, 0), this.color, 0, this.mirror);

    }
    update() {
        // to do:
        // (1) logic is ported to simulation singleton

        // Despawn logic
        if (this.hitpoints <= 0) {
            this.despawn(); // trigger despawn timer

        }


        
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
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
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

    hitCollisionDetected(){ // resolves the enemy hit collision detection
        this.hitpoints -= 1;
        //hit register
        //sfx
        window.music.hit_sfx[2].play();
        this.kickback();
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

        this.velocity.x += knockbackX;
        this.velocity.y += knockbackY;

        this.playAnim(this.Despawn);
        
        return 1;
    }

    despawn() {
        //console.log("Enemy Despawn Logic Triggered");
        
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
        

  
        //this.destroy();
        

        
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
                
                // remove object from global object pool
                // remove object from global array
                const index = window.globals.enemies.indexOf(this);
                if (index !== -1) {
                    window.globals.enemies.splice(index, 1);
                }

                this.destroy();

                // debug the enemy object
                //console.log("enemy despawn debug: ",window.globals.enemies.indexOf(this));
                
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