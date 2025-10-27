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
     * (2) second enemy collision detection doesn't work
     */
    public ENABLE: boolean;
    private COUNTER: number;
    //public color: any | null;
    private fire : Array<number> =[34,35,36,37,38,39]; // fire animation
    //spawn an enemy count at specific posisitons
    public enemy1 : Enemy | undefined;
    public enemy2 : Enemy | undefined;

    constructor(pos: LittleJS.Vector2, ENABLE = true) {
        super(34,[34,35,36,37,38,39],2);
        this.tileInfo = tile(2,128,2,0);
        this.pos = pos;
        //this.pos = pos;
        this.ENABLE = ENABLE;
        // set the fire tiles
        this.setCollision(false,false,false,false);
         
        //this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        this.COUNTER = 0; // counter for calculatin how much enemies been spawned
        //console.log("Enemy Spawner Instanced: ", this.ENABLE);

                // spawn 2 new enemies if the enemy pool is 0
        if (window.globals.enemies.length < 1 && this.ENABLE) {
            this.enemy1 = new Enemy(this.pos);
            // to do:
            // (1) implement enemy movment logic with kinematic body object + velocity
            //this.enemy2 = new Enemy(vec2(this.pos.x + 5, this.pos.y)); 
            
            
            window.globals.enemies.push(this.enemy1);
            //window.globals.enemies.push(this.enemy2);
 
            // set the player position
            //this.enemy1.setPlayer(window.player)
            //this.enemy2.setPlayer(window.player)
            
            
            this.COUNTER += 1;
        

        }

        // ensure item is marked for deletion
        //window.map.levelObjects?.push(this);
    }

    update(): void {
        this.playAnim(this.fire); 
    }

}
