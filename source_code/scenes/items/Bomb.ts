import * as LittleJS from 'littlejsengine';

const {EngineObject, Timer,vec2, drawTile, tile, isOverlapping} = LittleJS;
import { PhysicsObject } from '../../singletons/Utils';
import { Items } from '../../singletons/Utils';
import { TopDownPlayer } from '../Characters/player';

export class Bomb extends Items {
    /**
     * 
     * Game Bomb Item (collect)
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * (3) implement all item use effects
     * 
     */
    
     constructor(pos : LittleJS.Vector2,tileIndex = 20){
            super(pos,tileIndex, "Bomb");
        }
}


export class BombExplosion extends PhysicsObject{
    // the implementation of the Bomb item use
    // logic
    // (1) explosion sfx
    // (2) fire animation (done)
    // (3) impact shader vfx
    // (4) destruction of all non player items in the object's collision shape
    // (5) smoke particle sfx

    // to do:
    // (1) create 2 states, a flashing and and explode state with a timer
    private fireAnimation : Array<number> =[34,35,36,37,38,39]; // fire animation
    //public animationSequence: number[] = [20];
    //private flashingAnimation : number[]= [20]
    private explosionScale : LittleJS.Vector2 = vec2(3);
    private explosionTimer : LittleJS.Timer = new Timer();
    constructor(pos :LittleJS.Vector2){
        super(20,[20]);
        this.pos = pos;
        this.tileInfo = tile(20,128,2,0);
        this.textureIndex =2;
        
        
        //trigger the timer animation for 3 seconds
        this.explosionTimer.set(3);
    }

    update(){

        // flashing state trigger
        if (!this.explosionTimer.elapsed()){
            this.State()["FLASHING"]();
        }
        // explode state trigger
        if (this.explosionTimer.elapsed()){
            this.State()["EXPLODE"]();
        }
        

       

        
    }

    // bomb explosion state machine with different state animations

    // stores complex player states
    State(): Record<string, () => void>  {

        return {
            "FLASHING" : () => {

                // to do:
                // (1) copy flashing animation from littlejs examples using sprite color manipulation
                // (2) set the tile frame to the bomb item tile
                this.currentFrame = 20;

            },

            "EXPLODE" : () => {
                // to do:
                // (1) play the fire animation
                // (2) trigger the camera shake fx
                // (3) play the smoke particle fx
                // (4) trigger hit collision detection logic on all objects its colliding with

                // play the fire animation
                this.playAnim(this.fireAnimation);

                // trigger the camera shake
                window.player.shakeCameraV1(0.5,1);

                // play the hit sfx
                window.music.punch_sfx_3.play();
                window.music.explosion_vibration_sfx.play();

                // despawn any enemy or Player objects overlapping

                for (const player of window.globals.players) { // checks for all player objects
                    if (player instanceof TopDownPlayer){
                        if (isOverlapping(this.pos, this.size, player.pos, player.size) ) { // if hit collission and attack state
                            player.hit_collision_detected(this.explosionScale); // trigger the player hit collisoin detection
                        }
                    }
                    
                    // triggers the enemy hit collision detection scales
                    for (const enemy of window.globals.enemies){ // checks for all enemy objects
                            //console.log("eneemy debug: ", enemy.pos);
                            //bug: checks for only one player and doesn't account for multiple players
                            if (isOverlapping(this.pos, this.size, enemy.pos, enemy.size) ) { // if hit collission and attack state
                                console.log("Enemy Hit Collision Detection Triggered");
                                enemy.hitCollisionDetected();
                                enemy.despawn();
                                }
                            }
                        }


                // delete self after a timer
                this.destroy();
                
            }
        }
    }
}   