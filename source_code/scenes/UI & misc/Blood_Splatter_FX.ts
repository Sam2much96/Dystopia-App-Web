
/**
 * Particle FX
 * 
 * (1) Blood_splatter_fx
 * (2) DespawnFx
 * (3) Wind Particle fx
 * 
 * To do:
 * (1) lock particle fx despawn logic in a parent class
 * (2) Organise particle fx code
 */


import * as LittleJS from 'littlejsengine';

const {EngineObject,ParticleEmitter, Timer, Color,vec2, tile,hsl,rgb, PI} = LittleJS;


class ParticleFX extends ParticleEmitter {
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
        // unused

    //public color: any ;
    public trailEffect: any;
    public TimerOut : number = 2; // timer timeout to despawn the particle fx
    private particleTimer : LittleJS.Timer = new Timer();

    /** */

}

export class Blood_splatter_fx extends LittleJS.ParticleEmitter {
    // to do:
    // (1) lock core particlefx emitter into a core class
    // (2) expand core class by using different frames for the blood splatter and the despawn particlefx
     //public color: any;
    private trailEffect: any;
    public TimerOut : number = 0.5; // timer timeout to despawn the particle fx
    private particleTimer : LittleJS.Timer = new Timer();

    constructor(pos: LittleJS.Vector2, size: number) {
        super(pos,size);
        //console.log("creating blood splatter fx", this.color);
        //this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        this.setCollision(false,false,false,false);
        this.particleTimer.set(this.TimerOut);
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
    update(): void {
                // self despawn
        if (this.particleTimer.elapsed()){
            //console.log("particle timer elapsed");
            this.trailEffect.destroy();
            this.trailEffect = null;
            this.destroy(); // delete the object
            return;
        }     
    }


}

// to do: (1) Implement each individual partilcle fx

export class DespawnFx extends LittleJS.ParticleEmitter {
    // to do:
    // (1) test particle fx (works)
    private trailEffect: any;
    public TimerOut : number = 0.5; // timer timeout to despawn the particle fx
    private particleTimer : LittleJS.Timer = new Timer();

    constructor(pos: LittleJS.Vector2, size: number) {
        super(pos,size);
        //console.log("creating blood splatter fx", this.color);
        //this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        this.setCollision(false,false,false,false);
        this.particleTimer.set(this.TimerOut);
        const color__ = hsl(0, 0, .2);
        this.trailEffect = new ParticleEmitter(
            this.pos, 0,                          // pos, angle
            this.size, 0, 8, PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(13, 128, 2, 0),                          // tileIndex, tileSize
            color__.scale(1), color__.scale(10),                         // colorStartA, colorStartB
            color__.scale(5), color__.scale(10),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, false, false        // fade, randomness, collide, additive
        );

        
    }
    update(): void {
                // self despawn
        if (this.particleTimer.elapsed()){
            //console.log("despawn particle timer elapsed");
            this.trailEffect.destroy();
            this.destroy(); // delete the object
        }     
    }


}

// duplicate despawn fx for bomb explosion fx
export class Bombexplosion extends DespawnFx {}

// uncreated rain fx class
// to do: modify this impact fx to fall down straight
export class RainFX extends LittleJS.ParticleEmitter{}

export class ImpactFX extends LittleJS.ParticleEmitter {
    //was supposed to be rain fx, but is looking line an impact instead
    private particleTimer : LittleJS.Timer = new Timer();

    private trailEffect: any;
    public TimerOut : number = 100; // timer timeout to despawn the particle fx
    //private particleTimer : LittleJS.Timer = new Timer();

    constructor(pos : LittleJS.Vector2, size : number){
        super(pos,size);

          this.trailEffect = new ParticleEmitter(
            vec2(), 0, 3, 0, 0, .5, // pos, angle, emitSize, emitTime, emitRate, emiteCone
            tile(13, 128, 2, 0),   // tileIndex, tileSize
            new LittleJS.Color(1,1,1,.8), new LittleJS.Color(1,1,1,.2), // colorStartA, colorStartB
            new LittleJS.Color(1,1,1,.8), new LittleJS.Color(1,1,1,.2), // colorEndA, colorEndB
            3, .1, .1, .3, .01,  // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
            .98, 1, .2, LittleJS.PI, .2,  // damping, angleDamping, gravityScale, particleCone, fadeRate, 
            .5, false                // randomness, collide
        );

    }

       
    
 
}

class SmokeFX extends ParticleFX {

}

export class Firefx1 extends LittleJS.ParticleEmitter{
    // to do:
    // (1) fix fx render, it's needed for bomb explosion fx
    // realistic fire particle fx
    private trailEffect : any;
    public TimerOut : number = 5.5; // timer timeout to despawn the particle fx
    private particleTimer : LittleJS.Timer = new Timer();

    constructor(pos: LittleJS.Vector2, size: number){
        super(pos,size);
        console.log("creating fire particle fx");
        this.particleTimer.set(this.TimerOut);
        // fire
       this.trailEffect = new ParticleEmitter(
            vec2(-5,-2), 0,                // pos, angle
            2, 0, 200, PI,                 // emitSize, emitTime, rate, cone
            tile(35, 128, 2, 0),                      // tileInfo
            rgb(1,.5,.1), rgb(1,.1,.1),    // colorStartA, colorStartB
            rgb(1,.5,.1,0), rgb(1,.1,.1,0),// colorEndA, colorEndB
            .7, 2, 0, .2, .05, // time, sizeStart, sizeEnd, speed, angleSpeed
            .9, 1, -1, PI, .05,// damp, angleDamp, gravity, particleCone, fade
            .5, false, false, false        // randomness, collide, additive, colorLinear
        );
    }

    update(): void {
        // self despawn
        if (this.particleTimer.elapsed()){
            console.log("despawn particle timer elapsed");
            this.trailEffect.destroy();
            this.destroy(); // delete the object
        }     
    }

}