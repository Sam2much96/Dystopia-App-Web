import * as LittleJS from 'littlejsengine';
/**
 * 
 * Enemy Spawner
 * 
 * Features:
 * (1) spawns 2 enemies into the map
 * 
 * Bug:
 * (1) breaks on enemy respawn
 * 
 */

const {EngineObject, Vector2,vec2, drawTile, tile, isOverlapping} = LittleJS;

import { Enemy } from '../Characters/enemy';
import { PhysicsObject } from '../../singletons/Utils';

export class EnemySpawner extends PhysicsObject {
    /**
     * 
     * to do:
     * (1) fix enemy respawn bug
     */
    public ENABLE: boolean;
    private COUNTER: number;
    //public color: any | null;
    private fire : Array<number> =[34,35,36,37,38,39]; // fire animation
    //spawn an enemy count at specific posisitons
    public enemy1 : Enemy | undefined;
    public enemy2 : Enemy | undefined;

    constructor(pos: LittleJS.Vector2, ENABLE = true) {
        super();
        this.tileInfo = tile(2,128,2,0);
        this.pos = pos;
        //this.pos = pos;
        this.ENABLE = ENABLE;
        // set the fire tiles
        this.setCollision(false,false,false,false);
        this.playAnim(this.fire);  
        //this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        this.COUNTER = 0; // counter for calculatin how much enemies been spawned
        //console.log("Enemy Spawner Instanced: ", this.ENABLE);

                // spawn 2 new enemies if the enemy pool is 0
        if (window.globals.enemies.length < 1 && this.ENABLE) {
            this.enemy1 = new Enemy(this.pos);
            // to do:
            // (1) implement enemy movment logic with kinematic body object + velocity
            this.enemy2 = new Enemy(vec2(this.pos.x + 5, this.pos.y)); 
 
            // set the player position
            //this.enemy1.setPlayer(window.player)
            //this.enemy2.setPlayer(window.player)
            
            
            this.COUNTER += 1;
        //if (this.COUNTER === 2) {
        //    this.ENABLE = false
        //}

            //return

        }

        // update all enemy objects
        //for (const enemy of window.globals.enemies) {
        //    enemy.update();
        //}
    }

    //render(){
        //;
        // draw the enemy tiles
        //console.log(this.currentFrame); // frame positioning doesnt start from 0
        //down : 17,18,19,20
        // bug: enemy tileset cuts off the last frame row
        //drawTile(this.pos, this.size, tile(this.currentFrame, 128, 2, 0), this.color, 0, this.mirror);

    //}
    

}
