
/**
 * Particle FX
 * 
 * (1) Blood_splatter_fx
 * (2) DespawnFx
 */


import * as LittleJS from 'littlejsengine';

const {EngineObject,ParticleEmitter, vec2, tile,hsl, PI} = LittleJS;


class ParticleFX extends EngineObject {
    /**
     * Particle Effects Logic in a single class 
     * 
     * TO DO : (1) Make A Sub function within Player Class 
     
     * Extends LittleJS Particle FX mapped to an enumerator
     * attach a trail effect
     * 
     * @param {*} pos 
     * @param {*} size 
     */


    public color: any;
    public trailEffect: any;

    /** */
    constructor(pos: Vector2, size: Vector2) {
        super();
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        this.trailEffect = new LittleJS.ParticleEmitter(
            this.pos, 0,                          // pos, angle
            this.size, 0, 80, LittleJS.PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(0, 16),                          // tileIndex, tileSize
            color__, color__,                         // colorStartA, colorStartB
            color__.scale(0), color__.scale(0),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, true, true        // fade, randomness, collide, additive
        );


    }
}

class Blood_splatter_fx extends ParticleFX {
     public color: any;
    //private trailEffect: any;

    constructor(pos: Vector2, size: Vector2) {
        super(vec2(),vec2());
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        this.trailEffect = new ParticleEmitter(
            this.pos, 0,                          // pos, angle
            this.size, 0, 8, PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(25, 128, 2, 0),                          // tileIndex, tileSize
            color__.scale(1), color__.scale(10),                         // colorStartA, colorStartB
            color__.scale(5), color__.scale(10),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, false, false        // fade, randomness, collide, additive
        );

    }


}

// to do: (1) Implement each individual partilcle fx

class DespawnFx extends ParticleFX {

}

export class Bombexplosion extends ParticleFX{

}

class RainFX extends ParticleFX {

}

class SmokeFX extends ParticleFX {

}