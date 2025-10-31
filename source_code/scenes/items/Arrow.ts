import * as LittleJS from 'littlejsengine';

const {EngineObject, Timer, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { Items, PhysicsObject } from '../../singletons/Utils';

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


export class Bullet extends PhysicsObject{
    // Bullet class object shared by all projectile objects
    // implements the arrow item use
    // spawns a projectile that moves in a straight line and despawns all enemy objects in it's path
    // to do:
    // (1) finish item implementation

    // logic:
    // (0) set bullet item to the arrow item tile
    // (1) rotate bullet item to face the player's facing position
    // (2) translate bullet object position in a straight line
    // (3) despawn object once it's out the camera render / a despawn timer has passed
    private despawnTimer = new Timer();
    private TimeOut : number = 4;
    private DIRECTION_ANGLES: Record<number, number> = {
        0: 0,                // up
        3: Math.PI / 2,      // right
        1: Math.PI,          // down
        2: -Math.PI / 2,     // left
    };

    
    constructor(pos : LittleJS.Vector2, facingPos : number = 0){
        super(23,[23],2);
        // Logic:
        // (1) use a facing logic for setting this objects's rotation
        // (2) set the arrow object tile image
        // (3) trigger a forward motion physics
        // (4) trigger despawn mechanics if it cokkides with any enemy object
        // (5) despawn after a timer or a length/ distance moved
        this.pos = pos;
        this.tileInfo = tile(23,128,2); // arrow tile
        this.setCollision(true, true, true, true); // make object collide
        this.despawnTimer.set(this.TimeOut);

        // bug: rotation does not work
        this.rotateToDirection(3); // totate the arrow object to the player's facing positoin

     
    }

    update(){
        // apply physics + velocity motion motion
        //this.velocity
           // Set forward velocity based on facing angle
        super.update();
        const speed = 10; // bullet speed, adjust as needed
        this.velocity.add(vec2(1,0));//vec2(Math.sin(this.angle), -Math.cos(this.angle)).scale(speed);

        // collision logic \
        for (const enemy of window.globals.enemies){ // checks for all enemy objects
            if (isOverlapping(this.pos, this.size,enemy.pos, enemy.size)){
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

    

    // Rotate helper
    rotateToDirection(direction : number) {
        const angle = this.DIRECTION_ANGLES[direction];
        if (angle !== undefined) {
            this.angle = angle;
        }
    }

}