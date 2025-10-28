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

import { EngineObject ,Color} from "littlejsengine";
import {ThreeRender} from "../../singletons/3d";

//3d Camera Distance Constants
export const CAMERA_DISTANCE = 16; // to do: (1) lock 3d initialisation variants and logic into the script with proper optimization

export class OverWorld3D extends EngineObject{

   //public local_3d = window.THREE_RENDER; // safe pointer to threejs

     private THREE_RENDER : any;
    private local_3d_engine : any;
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

        // bug: (1) the old three layer renderer isn't properly cleared out
        
        this.color = new Color(0, 0, 0, 0); // make object invisible
            this.THREE_RENDER = new ThreeRender();
            this.THREE_RENDER.showThreeLayer();
            this.local_3d_engine = this.THREE_RENDER;
                //window.simulation.local_3d_engine = this.THREE_RENDER;
                // load the 3d model
                //load the game 3d map
                let t = null;
                (async () => {
                        t = await this.THREE_RENDER.LoadModelV1();
                        console.log("Loaded model: ", t); // asynchronous method
                })();
                
                
                this.THREE_RENDER.addLDR();
                //window.THREE_RENDER.Cube();
        
        
        
                //window.THREE_RENDER.addToScene(c1);
                // window.THREE_RENDER.addToScene(c2);
                this.THREE_RENDER.setCamera(CAMERA_DISTANCE);

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

    loadV0(){

        //window.THREE_RENDER = new ThreeRender();
        window.THREE_RENDER!.showThreeLayer();
        //this.local_3d.setCubePosition(10,10,10);
        
        //console.log("simulation object debug :", window.simulation); // simulation object is overrind the 3d world
         console.log(`3d engine debug: ${window.THREE_RENDER!.render} / ${window.THREE_RENDER!.scene} / ${ window.THREE_RENDER!.camera}` );

        // change the hdr of the scene and the  model colour

        //load the 3d model coloured 3d model with hdr in blender
        // to do: 
        // (1) export the overworld 3d scene as a .glb file with all textures preloaded
        // (2) turn off animate on loaded models
        
        // bugs:
        // (1) local model function only works once and the class based cube object is null
        // to do : (1) depreciate class based cube pointers for 3d model objects
        //window.THREE_RENDER.LoadModel(); // fix model animate
        
        let t = null;
        (async () => {
                t = await window.THREE_RENDER!.LoadModelV1();
                console.log("Loaded model: ", t); // asynchronous method
        })();
        
        window.THREE_RENDER!.createScene();
        
        
        
        window.THREE_RENDER!.addLDR();
        window.THREE_RENDER!.setCamera(CAMERA_DISTANCE);
         //debug the cube object
        console.log(`cube debug: ${window.THREE_RENDER!.cube} / ${window.THREE_RENDER?.renderer}`);
    }

    update(){
        //let cubePosition = this.local_3d.getCubePosition()
        
    }

    //destroy(){
        // to do: 
        //(1) implement a destroy function for the map
        //this.local_3d!.hideThreeLayer();
    //}

}