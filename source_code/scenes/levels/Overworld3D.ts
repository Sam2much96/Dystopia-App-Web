/**
 * 
 * Overworld 3d scene 
 * 
 * to do:
 * (1) implement the level mesh, hdr and cameras
 * (2) implement the level collision
 * (3) implement the level creation and destruction logic 
 * (4) implement 3d player mesh with proper movement
 * (5) connect level with overworld 2d spaceship exit object
 * (6) separate 3d render  binder for 3d animate function into two separate functions
 * 
 */

import { EngineObject ,Color, Timer} from "littlejsengine";
import {ThreeRender} from "../../singletons/3d";
import { OverWorld } from "./OverworldTopDown";

//3d Camera Distance Constants
export const CAMERA_DISTANCE = 16; // to do: (1) lock 3d initialisation variants and logic into the script with proper optimization
export const THIRD_PERSON_DISTANCE = 5;


export class OverWorld3D extends EngineObject{

   //public local_3d = window.THREE_RENDER; // safe pointer to threejs

     private THREE_RENDER : any;
    private local_3d_engine : any;
    private despawnTimer : Timer = new Timer();
    private Timeout : number = 6;
    constructor(){
        super();
        // logic :
        //(1) load the threejs dom and the the ljs dom as class objects
        // (2) hide the littlejs dom rendering
        // (3) show the threejs dom rendering with camera at the dimensions of the littlejs arcade camera
        // (4) show 3d world with proper lighting and hdr
        // (5) implement 3d kinematic body and static body physics
        // (6) implement scene transition form littlejs engine to threejs engine renderer
        // (7) a despawn timer throws the player back into the overworld map on timer timeout
        console.log("creating the 3d overworld level");

        // bug: (1) the old three layer renderer isn't properly cleared out (fixed)
        
        this.color = new Color(0, 0, 0, 0); // make object invisible
            this.THREE_RENDER = new ThreeRender();
            this.THREE_RENDER.showThreeLayer();
            this.local_3d_engine = this.THREE_RENDER;
                //window.simulation.local_3d_engine = this.THREE_RENDER;
                // load the 3d model
                //load the game 3d map
                let t = null;
                this.THREE_RENDER.addLDR();
                (async () => {
                        t = await this.THREE_RENDER.LoadModelV2();
                        console.log("Loaded model: ", t); // asynchronous method
                })();
                
                
                // to do:
                // (1) set albedo model
                // (2) load player3d model
                // (3) implement simple floaty movement physics
                // (4) 
                
                
        
        
        
                //window.THREE_RENDER.addToScene(c1);
                // window.THREE_RENDER.addToScene(c2);
                this.THREE_RENDER.setCamera(THIRD_PERSON_DISTANCE); // to do: (1) camera distance topdown
                this.THREE_RENDER.animate(false); // works

        // trigger the despawn timer
        this.despawnTimer.set(this.Timeout);
        
        //debug the model
        // bug : the render binds to the context,
        // consider using a state machine for the 3d render state?
        //this.local_3d.animate(false); // render
        
        //window.THREE_RENDER.Cube();

        // to do:
        // (1) load the player models and animations
        // (2) implement kinematic body physics on player object
        // (3) apply player model texture
        // (4) create 3d player class object with simple state machine




        //window.THREE_RENDER.addToScene(c1);
        // window.THREE_RENDER.addToScene(c2);
        //window.THREE_RENDER.setCamera(CAMERA_DISTANCE);

        

    }

   

    update() : void{

        // Map destruction logic
        if (this.despawnTimer.elapsed()){

            // delete this map and restore the overworld map
            //this.destroy();

            this.THREE_RENDER.hideThreeLayer();

            this.THREE_RENDER.destroy();
            this.THREE_RENDER = null;
            this.local_3d_engine = null;
            //    window.map = new OverWorld(); // Overworld3D();
                window.globals.current_level = "Overworld"; //"Overworld 3";

            // go to the overworld map
            window.map = new OverWorld();

            this.destroy();
        }
        
        
    }


}


class Player3D {
    // 3d player object class
    // to do:
    // (1) implement physics

}