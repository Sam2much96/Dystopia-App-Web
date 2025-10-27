/**
 * Enemy
 * 
 * Features:
 * (1) Detects enemy object in the update function
 * (2) Uses AStart Navigation algorithm for pathfinding
 * (3) 
 * 
 * 
 * To DO :
 * (1) Randomize enemy speed
 * (2) Velocity logic for enemy movement in mob state
 * (3) Enemy State Machine (done)
 * (4) Implement Enemy idle state with animations
 * (5) Implement Enemy idle to Enemy mob to Enemy Idle animation states
 * (6) Synchronize enemy and player state machine enumerations
 * (7) update documentation (2/3)
 * (8) implement enemy path finding (done)
 * (9) implement enemy velocity movements (1/3)
 * (10) implement despawn timer
 * (11) implement attack logic
 * (12) implement despawn and attack particles
 * (13) implement camera shake on attacks
 * (14) implment collision data on all overworld scenes for enemy pathfinding (done)
 * (15) fix path finding ignoring tile collision by a few pixels
 * (16) put a visibility timer for turning enemy invisible after a certain range or time
 * (17) implement walk animation on enemy navigation state (done)
 * (18) Implement enemy item drops
 * (19) organinze monolith code bloc into separate individual classes
 */



import * as LittleJS from 'littlejsengine';
import { Player, SideScrollerPlayerBox, TopDownPlayer} from './player';
import { Utils, PhysicsObject, worldToGrid, gridToWorld } from '../../singletons/Utils';
//import { Side } from 'three'; // what's this used for?
import {aStar, aStarV1} from "../UI & misc/Pathfinding"; // godot uses aStart for navigation server logic
import { ItemSpawner } from '../items/ItemSpawner';
//blood particle fx
import { Blood_splatter_fx, DespawnFx } from '../UI & misc/Blood_Splatter_FX';

const {vec2, drawTile, drawLine, isOverlapping, Timer,tile} = LittleJS;




export class Enemy extends PhysicsObject {

    public hitpoints: number = 1;
    public speed: number = 1.5;
    public detectionRange: number;
    public minDistance: number;
    public wanderCooldown: number;
    private targetPos: LittleJS.Vector2;

    
    
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

    // use these variables to vary the enemy movement speed + randomizatoin
    // Match Frame Rate to Both Enemy TIme And Engine FPS
    private IDIOT_FRAME_RATE: number = 60;
    private SLOW_FRAME_RATE: number = 30;
    private AVERAGE_FRAME_RATE: number = 15;
    private FAST_FRAME_RATE: number = 5;
    private despawn_timer: LittleJS.Timer = new Timer();

    //Animation variables
    //public currentFrame : number = 0;
    //private tileSize : number = 128;
    
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
    public local_player_object : TopDownPlayer | SideScrollerPlayerBox | null = null;
    public direction : LittleJS.Vector2 = vec2(0);
    public length : number = 0;
    //private delta : number = 0;
    private random_walk_direction : LittleJS.Vector2 = vec2(100);

    // unused important boolean
    //private isDead : boolean = false;
    private isStunned : boolean = false;


    // Enemy Despawn and Attack FX
    // todo:
    //public despawn_particles : ParticleFX| null = null; 
    //private lifetime: number = 1; // seconds before destruction
    private lifetime :number = 0.15;
    private Alive : boolean = true;
    // path finding variables
    //path finding checker
    private isPath : boolean = false;
    private isMoved : boolean = false;
    private playerVisible : boolean = false; // triggers on player and enemy first collision
    private visibilitiyTimer : LittleJS.Timer = new Timer(); // triggers player visible boolean off after a time
    private path: [number, number][] = [];
    private currentPathIndex : number = 0;

    
    private segmentProgress: number = 0;   // progress along current segment (0 → 1)

    private PathTimer : LittleJS.Timer = new Timer(); //path finding update path timmer
    private PathTimeOut : number = 30;
    private DebugPath : boolean = false; // for printing out the movement path with a red line


    private item_spawner : ItemSpawner | null = new ItemSpawner() ;

    constructor(pos: LittleJS.Vector2) {
        super();
        //(1) set the Enemy object's position (done)
        //(2) set the Enemy object's type which determines the logic (1/3)

        console.log("creating enemy object");

        this.size = vec2(0.8);

        // set enemy position from the initialisation script
        this.pos = pos.copy();

        // store object to global pointer for object pooling
        window.globals.enemies.push(this);

        // create the facing and the state as global class variables
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



        this.detectionRange = 200; // Range to detect the player
        this.minDistance = 30; // Minimum distance from player to stop following
        this.targetPos = vec2(0, 0); // Random wandering target
        this.wanderCooldown = 0; // Time before choosing a new wandering target


        // Object timers
        // (1) Despawn timer
        // (2) Detection Timer

        // blood fx
        //this.blood_fx = null
        // Timer to destroy the ParticleFX object after 5 seconds
        //this.despawn_timer = new Timer;    // creates a timer that is not set
        this.kick_back_distance = Utils.calcRandNumber();

        // add item spawner as child
        if (this.item_spawner) this.addChild(this.item_spawner);
     

    }
    render(){


        // draw the enemy tiles
        //console.log(this.currentFrame); 
        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 1, 0), this.color, 0, this.mirror);

    }
    update() {

        
        // detect player
        this.stateMachine[8]();
        
        // Despawn logic
        if (this.hitpoints <= 0 ) {
            //spawn a random item
            this.item_spawner?.spawn();
            
            this.despawn(); // trigger despawn timer
            this.Alive = false; // in alive
            
            //stop a despawn spammer

             // call the destruction function after a time lag
            // destroy when time runs out
            this.lifetime -= LittleJS.timeDelta;
                
            if (this.lifetime <= 0) {
                    this.destroy();
            }
                  
        }
        
        //trigger mob logic

        // trigger Navigation logic when player and enemey havent collided yet
        // 
        if (!this.playerVisible && this.Alive) {this.stateMachine[10]();}


        //trigger the mob state once the player is visible
        if (this.playerVisible && this.Alive) {this.stateMachine[6]();}
        




            
 

        // collision logic when player is not visible, it triggers the enemy mob a.i
        if (isOverlapping(this.pos, this.size, this.local_player_object?.pos, this.local_player_object?.size)) {
                this.playerVisible = true; // trigger the mob logic
            }

        // collision logic when the player is visible, it triggers the enemy attack state
         if (isOverlapping(this.pos, this.size, this.local_player_object?.pos, this.local_player_object?.size) && this.playerVisible) {
                this.stateMachine[2]() // trigger the attack state
     
            }



        // TO DO: 
        // (1) Trigger Kickback Logic
        // (2) Add Raycast for detection


        // to do:
        // (1) implement Djiskra logic for enemy movement when idle
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

    // v1 might be the cause of a movement glitch in moveAlongPath V3
    // v1 only calculates once
    // no the glicthc is causes because of collsisions and position movement logic, enemy movement should use velocity implementation for movements
    // bug:
    // (1) path finding logic only works once on scene start, after which it breaks
    // (2) path logic updater boolean doesn't work because of bug (1)
    updatePathV1() : boolean{ //path finding movement logic 1 : works
        // logic completely ignores start and goal
        // using aStar Pathfinding algorithm
        // world to grid does not work, depreciate those functions
        
        // convert tile based vector to 32 array grid based vectors for the pathfinding algorithm
        let start: [number, number] = [this.pos.x, this.pos.y]; //worldToGrid(this.pos,this.tileSize );
        let goal: [number, number] = [window.player.pos.x, window.player.pos.y]; //worldToGrid(window.player.pos, this.tileSize);
        

    
        // the purpose of using astar is to test trigger the enemy object env collisions and pathfinding logic
        // new astar function is buggy
        //let path = aStar(window.map.collisionGrid, start, goal);  
        let path = aStarV1(window.map.collisionGrid,start,goal);
        //console.log(path); // fro debugging path data only // works
        if (path) {
            this.path = path;
            //this.currentPathIndex = 0; 
            let x = this.path[0][0];
            let y = this.path[0][1];     
            return true;
        }
        else {
            return false
        }

    }



    // Move along the path over 60 seconds
    // works
    // bug: 
    // (1) uses position for movement logic not object velocity
    // (2) glitches when moveing along path
    // to do:
    // (1) Isolate function into separate state machine alongside the enemy mob ai
    // (2) Implement animation and directional facing functionality into this code bloc
    // (3) Implement update path timer to update the path overtime
    // (4) Implement Djisktra algorimth and expand movement logic to NPC objects
    // (5) Implement player animation along path
    moveAlongPathV3(delta: number = LittleJS.timeDelta) {
        if (!this.path || this.path.length < 2) return;

        // Ensure we don't go past the last segment
        if (this.currentPathIndex >= this.path.length - 1) return;

        // Get start and end points of the current segment
        const start = vec2(...this.path[this.currentPathIndex]);
        const end = vec2(...this.path[this.currentPathIndex + 1]);

        // Calculate segment length
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);

        if (segmentLength === 0) {
            this.currentPathIndex++;
            this.segmentProgress = 0;
            return;
        }

        // Speed to traverse the full path in 60 seconds
        const totalPathLength = this.path
            .slice(0, this.path.length - 1)
            .reduce((sum, p, i) => {
                const next = this.path[i + 1];
                const ddx = next[0] - p[0];
                const ddy = next[1] - p[1];
                return sum + Math.sqrt(ddx * ddx + ddy * ddy);
            }, 0);
        const pathSpeed = totalPathLength / this.PathTimeOut; // units per second

        // Increment progress along this segment
        this.segmentProgress += (pathSpeed * delta) / segmentLength;
        
        //test the animation
        //this.update_facing(this.pos.x, this.pos.y);
        
        // to do: (1) update the class direction from the pathfinder in this state
        //console.log(this.direction);

        if (this.segmentProgress >= 1) {
            // Move to next segment
            this.currentPathIndex++;
            this.segmentProgress = 0;

            // If we reached the end of the path
            if (this.currentPathIndex >= this.path.length - 1) {
                this.pos.x = end.x;
                this.pos.y = end.y;
                return;
            }
        }


        // Interpolate position along current segment
        this.pos.x = start.x + dx * this.segmentProgress;
        this.pos.y = start.y + dy * this.segmentProgress;

        //log the position
        //console.log(dy,dx); // direction
        //
        // cheat sheet:
        // up:
        // down: 
        // left:
        // right:
        //
        // create a v2 update_facing logic that works with this code bloc
        this.update_facing_V2(dy, dx);


        // Draw path for debugging
        if (this.DebugPath){
            for (let i = 0; i < this.path.length - 1; i++) {
                drawLine(vec2(...this.path[i]), vec2(...this.path[i + 1]), 0.05, LittleJS.RED);
            }
        }
    }


    setPlayer(obj : TopDownPlayer ){
        this.local_player_object = obj

    }

    getPlayer() : TopDownPlayer | SideScrollerPlayerBox {

        //(1) Gets the Player Object in the Scene Tree if Player unavailable, get him from the global pointer 
        return this.local_player_object!!;
    }

    hitCollisionDetected(){ // resolves the enemy hit collision detection
        this.hitpoints -= 1;
        //hit register
        //sfx
        window.music.hit_sfx[2].play();
        //create a blood splatter fx
        new Blood_splatter_fx(this.pos, 2);
        this.kickback();
        
        //console.log("enemy hitpoints debug: ", this.hitpoints);

        // to do: 
        // (1) play a despawn animation
        // (2) use a despawn timer to finish playing the animation and trigger the object destruction
    }

    kickback() {
        //console.log("kickback called / hp: ", this.hitpoints);
          // Prevent kickback if enemy is already stunned or dead
        if (this.Alive || this.isStunned) return 0;

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
        
        return ; //1;
    }

    despawn() {
        console.log("Enemy Despawn Logic Triggered");
        
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
        

        

        
    }
    _on_enemy_eyesight_body_entered() {
        // player detection with a raycast
        return 0;
    }

    _on_enemy_eyesight_body_exited() {
        // player leaves enemy detection raycast
        return 0;
    }

    // enemy mob state update facing function
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

    // enemy navigation ai state update facing function
    update_facing_V2(X : number, Y : number){
        // Updates the enemy object's facing parameter for animation
        //
        //console.log("Updating facing");
        
        if (X == 0 && Y == 1){
            //console.log("facing right"); // up
            
            const y = this.facing_enum.get("right")!;
            this.facing[y]();
            

            
        }

        if (X == 1 && Y == 0){
            //console.log("facing up");

            const x = this.facing_enum.get("up")!;
            this.facing[x]();
            
        }
        if (X == -1 && Y == 0){
            //console.log("facing left");
            const a = this.facing_enum.get("down")!;
            this.facing[a]();
            
        }
        if (X == 0 && Y == -1){
            //console.log("facing down"); //down
            const b = this.facing_enum.get("left")!;
            this.facing[b]();
            
        }
        }

    attack_logic(X : number, Y: number){
        //play attack animation
                // serialise the facing logic to play the correct animation
               if (X == 0 && Y == 1){
                //console.log("facing right"); // up
                
                    this.playAnim(this.AttackRight);
                
                }

                if (X == 1 && Y == 0){
                 //console.log("facing up");

                    this.playAnim(this.AttackUp);
                }

                if (X == -1 && Y == 0){
                    //console.log("facing left");
                    this.playAnim(this.AttackLeft);
                }

                if (X == 0 && Y == -1){
                    //console.log("facing down"); //down
                    this.playAnim(this.AttackDown);
                    
                }
    }

    // State Machines
    // 
    // Features :
    // (1) enemy state machine
    // (2) describes each states and is assigned to a class variable in the consstructor
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
            1: () =>{},
            2: () =>{ // attack state
                //console.log("attacking player: ", this.X, "/", this.Y);
                // trigger the attack state logic with the facing variables from the mob state
                this.attack_logic(this.X, this.Y);
                
                // trigger the hit collision detection on the player objec
                this.local_player_object?.hit_collision_detected(vec2(this.X, this.Y));
                
                // exit the state to the mob state
                this.stateMachine[6]();
               
                //this.playAnim(this.AttackDown);

                // Enemy hit collision detection
                // todo : 
                // (1) connect both player and enemy state machines to simulation collision detection
                // (2) implement raycast into enemy detection logic
                // (3) implement hurt and attack states into enemy collision logic (1/2)
   

            },
            3: () => {},
            
            4: () =>{ // die state
                //this.local_player_object = null;
                // player is stuck in the mob and attack state  loop
                this.playAnim(this.Despawn);
                this.Alive =false;
                console.log("Destroying This Enemy");
                new DespawnFx(this.pos.copy(), 0.5); // create a despawn fx
                
                // remove object from global object pool
                // remove object from global array
                //const index = window.globals.enemies.indexOf(this);
                //if (index !== -1) {
                //    window.globals.enemies.splice(index, 1);
                //}
                window.globals.enemies = window.globals.enemies.filter(e => !e.Alive);

       
               
         


                //this.destroy();

                // debug the enemy object
                //console.log("enemy despawn debug: ",window.globals.enemies.indexOf(this));
                
            },
            5: () => {},

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

                this.X = Math.round(this.direction.x);
                this.Y = Math.round(this.direction.y);


                //console.log("x: ",this.X, " y: ",this.Y);
                //update the facing for animation calculation
            
                // temporarily disabled for path finding refactoring
                this.update_facing(this.X, this.Y);
                
                // update the parent class to save the physics
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
                    // to do: 
                    //(1) use velocity logic for positional movement to implement collisions
                    //(2) note that animationTime is the engine's delta time saved from the parent class
                    this.pos.x += this.direction.x * this.speed //* this.animationTime;
                    this.pos.y += this.direction.y * this.speed //* this.animationTime;
                

            },

            7 : () => {  // projectile
            },
            8 : () => { // player sighted
                // detecting player
                // only triggers once , when the player is not instanced
                if (!this.local_player_object && window.player){ 

                    //enemy AI variables
                    this.local_player_object = window.player;
                    //console.log("enemy player debug: ", this.local_player_object);

                }

            },
            9 : () => { // player hidden
                this.local_player_object = null;
                console.log("hiding player");

            },
            10 : () => { // navigation ai aStar
                // pathfinding ai trigger
                // bug : 
                // (1) only works once
                if (!this.isPath && this.local_player_object){
                    console.log("updating enemy path 2");
                    this.isPath = this.updatePathV1(); // works, generates a 45 step path to do: implement a name + timer based path update trigger 
                    //this.isPath = true;
                    
                    
                }
                if (this.isPath){
                    //create a timer with the same TimeOut time as the movement speed time
                    this.PathTimer.set(this.PathTimeOut);
                    
                    // move along the path
                    this.moveAlongPathV3(); // works fully
                }

                // reset the path finder to get the updated player paths
                if (this.PathTimer.elapsed()){
                    //reset the update path checker
                    this.isPath = false;
                }


                



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
    //
    //movement animation + facing animation in one state
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