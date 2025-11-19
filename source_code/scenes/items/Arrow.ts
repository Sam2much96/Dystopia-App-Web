import * as LittleJS from 'littlejsengine';

const {EngineObject, Timer, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items, PhysicsObject } from '../../singletons/Utils';

import {
  Box2dObject,
  box2dCreateFixtureDef,
  box2dCreatePolygonShape,
  box2dBodyTypeDynamic,
  box2dBodyTypeStatic,
  box2dBodyTypeKinematic,
  box2d
} from "../../singletons/box2d"; 

export class Arrow extends Items{
    /**
     * 
     * Game Arrow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * (3) implement bullet object for implementing the arrow item's item use
     * (4) implement translated item collect dialogue
     * (5) implement an item base class for ease of update
     * 
     * 
     */
    constructor(pos : LittleJS.Vector2,tileIndex = 23){
        super(pos,tileIndex, "Arrow");
    }
  
}


export class Bullet extends Box2dObject{
    /**
     * Projectile Object
     * 
     * Bullet class object shared by all projectile objects
     * 
     * Features :
     *  
     *(1) implements the arrow item use
     * (2) spawns a projectile that moves in a straight line and despawns all enemy objects in it's path
     *
     * logic:
     * (0) set bullet item to the arrow item tile
     * (1) rotate bullet item to face the player's facing position
     * (2) translate bullet object position in a straight line
     * (3) despawn object once it's out the camera render / a despawn timer has passed
     * (4) despawn enemy object if colliding with them
     * 
     * Bug:
     * (1) arrow object rotation does not work
     * (2) arrow object flies too fast
     */
    private despawnTimer = new Timer();
    private TimeOut : number = 4;
    public speed : number = 15;

    
    constructor(pos : LittleJS.Vector2, facingPos : number = 0){
        super(pos,vec2(0.8), tile(23,128,2), rotateToDirection(facingPos),LittleJS.WHITE,box2dBodyTypeDynamic);
        
        this.pos = pos;
        
        //console.log("facing pos debug: ", facingPos); // debug the player facing position
        
        this.despawnTimer.set(this.TimeOut);
        
    }

    update(){
        // apply physics + velocity motion motion
        //this.velocity
           // Set forward velocity based on facing angle
        //super.update();
        //const speed = 10; // bullet speed, adjust as needed
        
        //this.velocity.add(vec2(1,0));//vec2(Math.sin(this.angle), -Math.cos(this.angle)).scale(speed);

                 // 🔥 Set linear velocity for kinematic arrow
        

         // Convert: worldAngle = this.angle - 90°
        const worldAngle = this.angle - Math.PI / 2;
           const velocity = vec2(
        Math.cos(worldAngle) * this.speed,
        -Math.sin(worldAngle) * this.speed
    );
        
        //const velocity = vec2(Math.cos(this.angle), Math.sin(this.angle)).scale(speed);
        //console.log("velocity debug: ", velocity);
        this.setLinearVelocity(velocity);
        super.update();

        // collision logic 
        // bug:
        // (1) breaks in temple interior scene
        for (const enemy of window.globals.enemies){ // checks for all enemy objects
            if (isOverlapping(this.pos, vec2(1),enemy.pos, enemy.size)){
                enemy.despawn();
                break;
            }
        }

        // desapwn logic
        if (this.despawnTimer.elapsed()){
            
            // despawn the object
            this.destroy();
            
        }
    }

}

    // Rotate helper
    function rotateToDirection(direction : number) : number {

        const DIRECTION_ANGLES: Record<number, number> = {
        0: 0,                // up
        3: Math.PI / 2,      // right
        1: Math.PI,          // down
        2: -Math.PI / 2,     // left
        };
        let angle = DIRECTION_ANGLES[direction];
        if (angle !== undefined) {
            return angle
        }
        else {
            return 0;
        }
    }