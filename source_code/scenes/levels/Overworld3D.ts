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
 * 
 */

//3d Camera Distance Constants
export const CAMERA_DISTANCE = 16; // to do: (1) lock 3d initialisation variants and logic into the script with proper optimization

export class OverWorld3D{

    public local_3d = window.THREE_RENDER; // safe pointer to threejs

    constructor(){
        // logic :
        //(1) load the threejs dom and the the ljs dom as class objects
        // (2) hide the littlejs dom rendering
        // (3) show the threejs dom rendering with camera at the dimensions of the littlejs arcade camera
        // (4) show 3d world with proper lighting and hdr
        // (5) implement 3d kinematic body and static body physics
        // (6) implement scene transition form littlejs engine to threejs engine renderer
        // (7) a despawn timer throws the player back into the overworld map on timer timeout
        console.log("creating the 3d overworld level");
        
        this.local_3d.showThreeLayer();

        //load the 3d model coloured 3d model with hdr in blender
        // to do: 
        // (1) export the overworld 3d scene as a .glb file with all textures preloaded
        // (2) turn off animate on loaded models
        this.local_3d.addLDR();
        window.THREE_RENDER.LoadModel();
        
        //window.THREE_RENDER.Cube();



        //window.THREE_RENDER.addToScene(c1);
        // window.THREE_RENDER.addToScene(c2);
        window.THREE_RENDER.setCamera(CAMERA_DISTANCE);

    }

    destroy(){
        // to do: 
        //(1) implement a destroy function for the map
        this.local_3d.hideThreeLayer();
    }

}