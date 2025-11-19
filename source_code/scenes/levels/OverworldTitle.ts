/**
 * 
 * The 3d title loading animation locked into a class
 * for easier code modularity 
 * 
 * works
 * to do:
 * (1) depreciate global three render class for proper debugging
 * (2) rewrite simulation logic to instead use local set pointers to the current 3d renderer
 * 
 * 
 */

import { EngineObject,Color } from "littlejsengine";
import {ThreeRender, CAMERA_DISTANCE} from "../../singletons/3d";
import { OverWorld } from "./OverworldTopDown";

export class OverworldTile extends EngineObject{
    private THREE_RENDER : any;
    private local_3d_engine : any;

    private groundLevel: number = -4; // ground position for stopping Gravity on Cube
    private enable : boolean = true;
    private READY_ADS : boolean = false;
    constructor(){
        super();
        this.color = new Color(0, 0, 0, 0); // make object invisible
        // bug:
        // (1) the three renderer doesn't free the class
        this.THREE_RENDER = new ThreeRender();
        this.local_3d_engine = this.THREE_RENDER;
        //window.simulation.local_3d_engine = this.THREE_RENDER;
        // load the 3d model
        //load the game 3d map
        let t = null;
        (async () => {
                t = await this.THREE_RENDER.LoadModelV1();
                console.log("Loaded model: ", t); // asynchronous method
        })();
        
        
        this.THREE_RENDER.addLDR("./HDR_3d_background_bw.webp");
        //window.THREE_RENDER.Cube();



        //window.THREE_RENDER.addToScene(c1);
        // window.THREE_RENDER.addToScene(c2);
        this.THREE_RENDER.setCamera(CAMERA_DISTANCE);
        this.THREE_RENDER.animate(); // bind the animation and renderer to this context

        
        //window.ads.showAds();
    }

    destroy(): void {
        this.THREE_RENDER = null;
    }

    update(){
                // Start Game Sequence
        // It modifies the threejs positions
        // bug:
        // (1) doesn't account for if cube doesn't load

        // update cube 3d position
        // bug:
        // (1) 3d level doesn't load model fast on low latency internet
        // (2) rework to use 
       // (3) stuck physics siulatoin bug
        // to do:
        // (1) port physics implementation to the overworld title scene
        if (this.local_3d_engine){
            let cubePosition = this.local_3d_engine!.getCubePosition();
        

        if (cubePosition && window.globals.GAME_START) {


            // add gravity to cube
            if (cubePosition.y > this.groundLevel && this.enable) {
                //console.log("Running 3d gravity simulation");
                this.local_3d_engine.setCubePositionV0(cubePosition.x, cubePosition.y -= 0.03, cubePosition.z);
            }

            // show the mobile ads once
            if (window.ads && !this.READY_ADS){
                //window.ads.showAds(); // initialize ads sdk for game monetize compiliance
                window.ads.initialize();
                window.ads.showAds();
                this.READY_ADS = true;
                return
            }

            // hide threejs layer once game starts
            // is always true once game has started
            // 
            if (cubePosition.y < this.groundLevel && this.enable) {
                this.local_3d_engine.hideThreeLayer();
                
                

                // save to global conditional for rendering game backgrounds and starting core game loop
                //window.globals.GAME_START = true;
                window.ui.gameHUD(); //render the game hud
                this.THREE_RENDER.hideThreeLayer();

                this.THREE_RENDER.destroy();
                this.THREE_RENDER = null;
                this.local_3d_engine = null;
                this.destroy()
                
                window.map = new OverWorld(); // Overworld3D();
                window.globals.current_level = "Overworld"; //"Overworld 3";

                this.THREE_RENDER = null;
                this.enable = false;
                window.music.play(); // play the current sound track

                
                
                // this is a testing ui to test ui translations locally for yandex compliance
                // disable in production build 
                // works
                //window.dialogs.language = "ru_RU";
                //window.ui.translateUIElements(window.dialogs.language);
                


                
                return;
             }}
        }
    }


}