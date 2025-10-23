import * as LittleJS from 'littlejsengine';

//const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;
import { PhysicsObject } from '../../singletons/Utils';
import { Items } from '../../singletons/Utils';

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
    private fireAnimation : Array<number> =[34,35,36,37,38,39]; // fire animation
    constructor(){
        super()
        
        //trigger the shake anmatoin
    }

    update(){
        // play the fire animation
        this.playAnim(this.fireAnimation);

        // trigger the camera shake
        window.player.shakeCameraV1(0.5,1);

        // despawn any enemy objects overlapping

        //if isOverlapping()

    }
}   