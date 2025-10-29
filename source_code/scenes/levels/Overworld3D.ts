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
 * (7) implement camera look around for the 3d levels
 * 
 * bugs:
 * (1) fix the 3d player movement physics
 */
import * as LittleJS from 'littlejsengine';

const { EngineObject ,Color, Timer, vec2,gamepadIsDown, gamepadStick, keyDirection, mouseIsDown, keyIsDown,isTouchDevice} = LittleJS; 
import {ThreeRender} from "../../singletons/3d";
import { OverWorld } from "./OverworldTopDown";
import { Vector3 } from "three";

//3d Camera Distance Constants
export const CAMERA_DISTANCE = 16; // to do: (1) lock 3d initialisation variants and logic into the script with proper optimization
export const THIRD_PERSON_DISTANCE = 7;


export class OverWorld3D extends EngineObject{

   //public local_3d = window.THREE_RENDER; // safe pointer to threejs

    private THREE_RENDER : any;
    private local_3d_engine : any;
    private despawnTimer : LittleJS.Timer = new Timer();
    private Timeout : number = 3;
    private local_Player : any;
    
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
                //let t = null;
                this.THREE_RENDER.addLDR();
                (async () => {
                        await this.THREE_RENDER.LoadMapV2();
                        //console.log("Loaded model: ", t); // asynchronous method

                        // to do:
                        // (1) move player instancing to separate player class (done)
                        //await this.THREE_RENDER.LoadPlayer(this.local_Player);
                        //this.local_Player = new Player3D(this.THREE_RENDER);
                })();
                
                
                // to do:
                // (1) set albedo model (done)
                // (2) load player3d model (done)
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
            //this.local_Player.destroy();
            //this.local_Player = null;
            //    window.map = new OverWorld(); // Overworld3D();
                window.globals.current_level = "Overworld"; //"Overworld 3";

            // go to the overworld map
            window.map = new OverWorld();
            

            this.destroy();
        }

        
        
        
    }


}


class Player3D extends EngineObject{
    // 3d player object class
    // to do:
    // (1) implement physics
    // (2) fix movement physics

      // input controlls
        public moveInput : Vector2 = vec2(0);
        public holdingRoll : boolean = false;
        public holdingAttack : boolean = false;
        private THREE_RENDER : any;//pointer to the 3d renderer
        public player : any; // pointer to 3d player model
    constructor(THREE_RENDER : any){
        super();
        this.THREE_RENDER = THREE_RENDER;
        console.log("creating 3d player object");

        (async () => {
                        

                        // to do:
                        // (1) move player instancing to separate player class (done)
                        await this.THREE_RENDER.LoadPlayer(this.player);
                })();

    }


    update(){
        if (!this.player) return;

        // capture button inputs
        if (isTouchDevice){ // touchscreen dpad bindings
            this.moveInput = gamepadStick(0,0).clampLength(1).scale(.1) ;
            this.holdingRoll = gamepadIsDown(1); 
            this.holdingAttack  = gamepadIsDown(2) ; //|| mouseIsDown(0);     
            
            // for debugging player input on mobile
            //logToScreen(this.moveInput);
        }

        else if (!isTouchDevice){ // keyboard and mouse bindings
            //works
            this.moveInput = keyDirection().clampLength(1).scale(.1);
            this.holdingRoll = keyIsDown('Space') || mouseIsDown(1);
            this.holdingAttack = keyIsDown('KeyX') || mouseIsDown(0) ;
        }


        //player third person camera controls and movment physics
        //if (this.player){

            const speed = 5;
            const direction = new Vector3();

            // to do : use littlejs imput vector for this
            //if (input.forward) direction.z -= 1;
            if (this.moveInput.x ===1){
                direction.z -= 1
            }
            if (this.moveInput.x === -1){
                direction.z += 1;
            }
            //if (input.backward) direction.z += 1;
            //if (input.left) direction.x -= 1;
            //if (input.right) direction.x += 1;

            direction.normalize();
            this.player.position.addScaledVector(direction, speed * LittleJS.timeDelta);

            // Gravity (basic)
            this.player.position.y = Math.max(0, this.player.position.y - 9.8 * LittleJS.timeDelta);


            // 3rd person camera
            const offset = new Vector3(0, 2, 5); // adjust height/distance
            const playerPos = this.player.position.clone();

            const cameraPos = playerPos.clone().add(offset);
            this.THREE_RENDER.camera.position.lerp(cameraPos, 0.1); // smooth follow
            this.THREE_RENDER.camera.lookAt(playerPos);

            // debug the camera position
            console.log(`3d player camera debug: ${this.THREE_RENDER.camera.position}`);
        //}
    }

}