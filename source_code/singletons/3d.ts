import { EngineObject } from 'littlejsengine';
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const { Scene, PerspectiveCamera, WebGLRenderer,BufferAttribute, BufferGeometry, MeshBasicMaterial, Mesh, TextureLoader } = THREE;
/*

3d Rendering Engine

Features
(0) Maps to the background layer
(1) Uses WebGL and Maths for 3d rendering
(2) Overlays 3d rendering to The viewport via css-style sheet ID canvas
(3) TO DO: Load GLTF Models (1/2)

Bugs:
(0) loads the 3d model too slow and is a latency bottleneck for the whole game
(1) The 3d Renderer should ideally be in a separate class
(2) This codebase runs littlejs as a module to allow importing Threejs
(3) Is a performance hog, should be used sparingly/ optimised for mobilw

to do:
(1) implement simple 3d overworld scene (2/5)
(2) fix all 3d rendering loading performance hogs
(3) implement 3d overworld loading scene via spaceship objects (1/2)
(4) implement 3d level collisions (0/5)
(5) expand 3d object functionality
*/

 export const CAMERA_DISTANCE = 16;

export class ThreeRender {

    
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public cube: any | null;
    public gltf: any | undefined;
    public threejsLayer : HTMLElement | null = document.getElementById("threejs-layer"); // get the renderer's DOM element 
    constructor() {
  
        //super();
        //console.log("Three JS Debug 1: ", this.THREE); // works



        // Initialize scene, camera, and renderer
        //make  scene and camera globally accessible
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();


        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer's DOM element to your target layer

        if (this.threejsLayer) {
            this.threejsLayer.appendChild(this.renderer.domElement);
        } else {
            console.error("Three.js layer element not found.");
        }
        // A placeholder for the cube mesh
        this.cube = null;

    };
    renderAnimation(): void {

        // class wide animation function
        this.renderer.render(this.scene, this.camera);

    }


    renderStill(): void {
        // renders a still image with no animmation
        this.renderer.render(this.scene, this.camera);

    }
    createScene() : void {
        // creates a 3d scene ready for render
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();


        this.renderer.setSize(window.innerWidth, window.innerHeight);


    }
    addLDR(path : string = "./550px-TLoZTWW_Vr_boxcloud1.png"): void { // load the default ldr
        // adds the enviroment hdr background
        const loaderTex = new TextureLoader(); // for loading the LDR
        loaderTex.load(path, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        //texture.encoding = THREE.sRGBEncoding; // important for correct colors

        this.scene.background = texture;
        this.scene.environment = texture; // still usable for reflections, though LDR
    });


    }

    LoadModelV1(path = "./overworld_map.glb"): Promise<boolean> {
        console.log(`Loading 3D model from ${path}`);

        const loader = new GLTFLoader();
        const DEBUG = true;

        return new Promise((resolve) => {
            loader.load(
            path,
            (gltf) => {
                if (DEBUG) {
                console.log('Loaded GLTF:', gltf.scene);
                console.log('Animations:', gltf.animations);
                console.log('Nodes:', gltf.scene.children);
                }

                // Save scene as global pointer
                this.cube = gltf.scene;
                this.scene.add(gltf.scene);

                console.log("Finished loading model:", this.cube);
                resolve(true); // ✅ return true if load succeeded
            },
            undefined,
            (error) => {
                console.error('Error occurred loading the 3D model:', error);
                resolve(false); // ✅ return false if load failed
            }
            );
        });
        }


    Cube(): void {

        /**
        AN OPtimised way of drawing a Cube in Threejs using Webgl directly 
        
         Features:
         (1)Fast Loading Of 3d geometry using Webgl directly and optimised

         To DO:
         (1) Add Positional Parameters CUbe Objects
        
        */


        console.log("Creating 3D Cube Object");

        // Load required Libraries from Global THreejs class
        //const {  } = this.THREE;


        // Geometry and wireframe
        //

        // Create a rotating cube
        //const geometry = new BoxGeometry();

        //optimization:
        //using buffer geometry instead of box geometry
        // Define BufferGeometry manually
        const geometry = new BufferGeometry();

        // Define the vertices of a cube (12 triangles, 36 vertices, 3 per face)
        const vertices = new Float32Array([
            // Front face
            -1, -1, 1,  // Bottom left
            1, -1, 1,  // Bottom right
            1, 1, 1,  // Top right
            -1, 1, 1,  // Top left

            // Back face
            -1, -1, -1,  // Bottom left
            -1, 1, -1,  // Top left
            1, 1, -1,  // Top right
            1, -1, -1,  // Bottom right
        ]);

        // Define the indices for the cube (triangles)
        const indices = [
            // Front face
            0, 1, 2, 0, 2, 3,
            // Back face
            4, 5, 6, 4, 6, 7,
            // Top face
            3, 2, 6, 3, 6, 5,
            // Bottom face
            0, 7, 1, 0, 4, 7,
            // Right face
            1, 7, 6, 1, 6, 2,
            // Left face
            0, 3, 5, 0, 5, 4
        ];

        // Create the normal vectors for each face
        const normals = new Float32Array([
            // Front
            0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
            // Back
            0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
            // Top
            0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
            // Bottom
            0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
            // Right
            1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
            // Left
            -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        ]);

        // Set geometry attributes
        geometry.setAttribute('position', new BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new BufferAttribute(normals, 3));
        geometry.setIndex(indices); // Use indices for efficiency



        // Green 0x00ff00
        //White 0xffffff

        // Basic material

        const material = new MeshBasicMaterial({
            color: this.getRandomColor(),
            wireframe: false,
            transparent: false,
            opacity: 1.0,
        });


        // set mesh geometry and material
        this.cube = new Mesh(geometry, material);

        //return this.cube;
        this.scene.add(this.cube)


    }


    getRandomColor(): number {
        return Math.random() * 0xffffff;
    }

    setCubePosition(x: number, y: number, z: number) {

        // type parameters


        if (this.cube) {
            this.cube.position.set(x, y, z);
        } else {
            console.warn("Cube has not been created yet.");
        }
    }

    hasCube(): boolean {
        // Exported safe function to check if there is a cube instance
        if (this.cube) return true
        else return false
       // return !!this.cube;

    }

    getCubePosition(): { x: number; y: number; z: number } | null {
        // sets a cube instance's 3d position
        if (this.cube) {
            return {
                x: this.cube.position.x,
                y: this.cube.position.y,
                z: this.cube.position.z,
            };
        } else {
            console.warn("Cube has not been created yet.");
            return null;
        }
    }

    deleteCube(): void {
        if (this.cube) {
            // Remove the cube from the scene
            this.scene.remove(this.cube);

            // Dispose of the cube's geometry and material to free up memory
            if (this.cube.geometry) {
                this.cube.geometry.dispose();
            }
            if (this.cube.material) {


                this.cube.material.dispose();

            }

            // Set the cube reference to null
            this.cube = null;

            console.log("Cube deleted successfully.");
        } else {
            console.warn("No cube to delete.");
        }
    }

    hideThreeLayer() : void {
        //hides the threejs css render layer
        const layer = document.getElementById("threejs-layer");
        if (layer) {
            layer.style.visibility = "hidden";
        }

        
        return;
    }

    showThreeLayer() {
        //shows the threejs css render layer
        const layer = document.getElementById("threejs-layer");
        if (layer) {
            layer.style.visibility = "visible";
        }
    }


    setCamera(Int_Distance: number): void {

        if (this.camera){
            // Sets the camera at a specific distance
            this.camera.position.z = Int_Distance;
        }
    }
    rotate(){
        // Rotate the cube
        if (this.cube) {
            //this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.006; // temporarily disabling x-axis animation for 3d scene
        }

    }

    animate(rotate: boolean = true): void {
        /*
        
        Custom 3Js animation method

        depreciated in favour of littlejs object expansion
        TO DO:
        (1) Add Animation parameters (Done) Animation is done via a simulation class
        (2) Add Keyframe object
        (3) Expand functionalite
            -Horizontal loop
            -Vertical Loop
            -Vertical Loop Until

        Bug:
        (1) is the entire scene renderer so does not account for no model animation and player item objects
        (2) i need to decouple this code bind contexts into a funcition and a render state

        
        */
        // Bind `this` to preserve context in animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            
                       // Rotate the cube
            if (this.cube && rotate) {
                //this.cube.rotation.x += 0.01;
                this.cube.rotation.y += 0.006; // temporarily disabling x-axis animation for 3d scene
            }

            // Render the scene
            this.renderer.render(this.scene, this.camera);
        };

        animate();
    }

    render(){
        
        if (this.renderer && this.scene && this.camera){
          // expands littlejs render function to bind the  render context
            this.renderer.render(this.scene, this.camera);
        }
        else{
            console.warn(`Debug 3d scene, camera or renderer ${this.renderer} / ${this.camera} / ${this.scene}`);
            return;
            
        }
    }

    //update(): void {

        // triggers the rotate animation function
        //this.rotate();
    //}

    
    destroy() : void {

        // delete the cube
        console.log("deleting the loaded model");
        //this.deleteCube();
        //return;
     
        // delete all threejs loaded layers and models
        this.scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();

            if (Array.isArray(object.material)) {
            object.material.forEach((mat) => {
                if (mat.map) mat.map.dispose();
                mat.dispose();
            });
            } else if (object.material) {
            if (object.material.map) object.material.map.dispose();
            object.material.dispose();
            }
        }
        });

        while (this.scene.children.length > 0) {
            const child = this.scene.children[0];
            this.scene.remove(child);
            }                                                           

        // dispose of renderers and buffers
        //this.renderer.dispose();
        //this.renderer.forceContextLoss();
        //(this.renderer.domElement as any) = null;
        this.renderer.dispose();
        if (this.renderer.domElement.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }
        this.renderer = null!;


        //dispose of environment maps (hdr/ldr)
        if (this.scene.environment) {
        (this.scene.environment as THREE.Texture).dispose();
        }
        if (this.scene.background && this.scene.background instanceof THREE.Texture) {
        this.scene.background.dispose();
        }

        //nullify major references

        this.scene = null!;
        this.camera = null!;
        this.renderer = null!;
        this.cube = null;
        this.gltf = undefined;

        //destroy this engine object
        //this.destroy()
    }

}
