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
 * bugs:
 * (1) fix long 3d model load time bug
 * (2) create alternative for cube not created bug when overworld model isn't loaded into memeory fast
 * 
 * to do:
 * (1) Add title screen animation (done)
 * 
 */
import * as LittleJS from 'littlejsengine';

const {EngineObject,Color, vec2} = LittleJS;

import { OverWorld } from "./OverworldTopDown";
import { PhysicsObject } from "../../../source_code/singletons/Utils";
import * as THREE from 'three';
const { Scene, PerspectiveCamera, WebGLRenderer,BufferAttribute, BufferGeometry, MeshBasicMaterial, Mesh, TextureLoader } = THREE;
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger';
import { TopDownPlayer } from "../Characters/player";

const CAMERA_DISTANCE = 16; 

export class OverworldTile extends EngineObject{


    private groundLevel: number = 5; // ground position for stopping Gravity on Cube
    private enable : boolean = true;
    private READY_ADS : boolean = false;

     //spawned objects
    levelObjects : any[] | null = [];

    // threejs
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    public cube: any | null;

    // cannon-es physics
    public physicsWorld: CANNON.World;
    public cannonDebugger: any;
    public levelBodies: CANNON.Body[] = []; // Store all level collision bodies

    // opening cinematics sprites
    public cinematic_body : PhysicsObject;
    public cinematic_cape : PhysicsObject;
 

    constructor(){
        super();
        this.color = new Color(0, 0, 0, 0); // make object invisible
        
         //make  3d scene and camera globally accessible
        const scene = new Scene();
        const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new WebGLRenderer();
        const loader = new GLTFLoader();

        // make global in class
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;

        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        renderer.setSize(window.innerWidth, window.innerHeight);

        //shows the threejs css render layer
        const layer = document.getElementById("threejs-layer");
       
        // show three js layer
        if (layer) {
            // make sure the container is visible and has layout
            layer.style.visibility = "visible";
            layer.style.position = "relative";

            // append renderer canvas into the container
            layer.appendChild(renderer.domElement);

            // style the canvas so it fills the container
            renderer.domElement.style.width = "100%";
            renderer.domElement.style.height = "100%";
            renderer.domElement.style.display = "block";
        } else {
        // fallback: add to body if element not found
        document.body.appendChild(renderer.domElement);
        }

        // create the player cinematics object
        //currentFrame : number = 0,animationSequence: number [] = [0], textureIndex : number = 0, sprite dimensions
        
        // set the camera at 256 pixels for rendering the opening cinematics sprites
        LittleJS.setCameraScale(256);
        const cinematics_body = new PhysicsObject(5,[5,6],7, 256);
        const cinematics_cape = new PhysicsObject(7,[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],7, 256);
        cinematics_body.pos = vec2(0,0);
        cinematics_cape.pos = vec2(0,0);
        
        this.cinematic_body = cinematics_body;
        this.cinematic_cape = cinematics_cape;

        LittleJS.setCameraPos(cinematics_body.pos); // normal follow

        //console.log("cinematics debug : ", cinematics);


        // set up world physics
        const physicsWorld = new CANNON.World({
                    gravity: new CANNON.Vec3(0,-9.82,0)
        });

        this.physicsWorld = physicsWorld;

        const path1 = "./HDR_3d_background_bw.webp"; //load the default ldr
        
        // adds the enviroment hdr background
        const loaderTex = new TextureLoader(); // for loading the LDR
        
        
        loaderTex.load(path1, (texture) => {
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
            scene.environment = texture; // still usable for reflections, though LDR
        });
        

        // load the 3d model
        const path2 : string = "./overworld_map.glb"; 
        (async () => {        
                    // load the world mesh
                    loader.load(
                                path2,
                                (gltf) => {
                                
                                    
                    
                                    // Save scene as global pointer
                                    this.cube = gltf.scene;
                                    scene.add(gltf.scene);
        
                                    //add cannon-es static body mesh for collision
                                    // avoid the Landscapp001 mesh as that mesh is for the toonshader lineart shader
                                    //this.addLevelCollisionMesh(gltf.scene);
                                    gltf.scene.traverse((child) => {
                                        if (child instanceof THREE.Mesh) {
                                            this.createStaticBodyFromMesh(child);


                                        }
                                    });

                    
                                    console.log("Finished loading model:", this.cube);
                                    console.log("Levels bodies debug: ", this.levelBodies);
                                },
                                undefined,
                                (error) => {
                                    console.error('Error occurred loading the 3D model:', error);
                                    
                                }
                                );
        
                        
        
        })();
        
        const cannonDebugger = CannonDebugger(scene, physicsWorld, {});

        this.camera.position.z = 7;//CAMERA_DISTANCE;
        this.camera.position.x= -2;
        let pos = 0;

        const clock = new THREE.Clock();
        //const fixedTimeStep = 1 / 60;
        const maxSubSteps = 3;
        
        let DEBUG = false;
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            physicsWorld.fixedStep(delta,maxSubSteps);
            
            if (DEBUG){ // for debugging 3d mesh with cannon debugger
                cannonDebugger.update();
            }

      
            // play the opening cinematics animation
            cinematics_body.playAnim([5,6],7);
            cinematics_cape.playAnim([7,8,9,10,11,12,13,14,15,16,17,18,19,20,21],11);


            if (this.cube && this.levelBodies.length > 0){
                
                const euler = new CANNON.Vec3();
                const body = this.levelBodies[0];
                body.quaternion.toEuler(euler);   // writes into euler.x, euler.y, euler.z

                // --- Apply rotation to physics body ---
                // Example: rotate 0.02 radians per frame around Y
                body.quaternion.setFromEuler(0, euler.y + 0.01, 0, 'XYZ');

                // set the mesh data position to the collision position
                // apply physics mesh to player
                this.cube.position.copy(body.position);

                // rotate the cube
                //
                //Quaternions are a mathematical way to represent rotation in 3D space.
                 // Convert Cannon quaternion → Three quaternion
                this.cube.quaternion.set(
                    body.quaternion.x,
                    body.quaternion.y,
                    body.quaternion.z,
                    body.quaternion.w
                );

                //start game physics trigger
                if (window.globals.GAME_START){
                    // get the level mesh
                    const body = this.levelBodies[0];
                    
                    // apply custom gravity to the mesh collision
                    body.position.y += 0.03;

                    // apply custom animaton to the sprite objects
                    cinematics_body.pos.y += 0.03;
                    cinematics_cape.pos.y += 0.03; 
                    


                }

                // show the mobile ads once
                if (window.ads && !this.READY_ADS){
                    //window.ads.showAds(); // initialize ads sdk for game monetize compiliance
                    window.ads.initialize();
                    window.ads.showAds();
                    this.READY_ADS = true;
                    return
                }

                // triggers level delete once the mesh object is below the ground levels
                if (body.position.y > this.groundLevel && this.enable) {
              
                
                    // delete the cube
                    console.log("deleting the loaded model");
                    
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
                            
                                    // delete the cinematic scenes
                                    this.cinematic_body.destroy();
                                    this.cinematic_cape.destroy();

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
                //clean up physics bodies
                this.cleanupPhysicsBodies();

                
                window.globals.current_level = "Overworld"; //"Overworld 3";

                window.ui.gameHUD(); //render the game hud
      
                 //shows the threejs css render layer
        const layer = document.getElementById("threejs-layer");
       
        // show three js layer
        if (layer) {
            // make sure the container is visible and has layout
            layer.style.visibility = "hidden";
        }
                
                window.map = new OverWorld(); // Overworld3D();
                window.globals.current_level = "Overworld"; //"Overworld 3";

                //this.THREE_RENDER = null;
                this.enable = false;
                if (window.music) window.music.play_v2(); // play the current sound track
                //this.destroy()
                
                }

            }

            renderer.render(scene, camera);

        };

        // simulate the 3d physics
        animate();

  
    }


  


    /**
         * Create a Cannon-es static body from a Three.js mesh
         * @param mesh - Three.js mesh to convert to collision body
         */
        private createStaticBodyFromMesh(mesh: THREE.Mesh): void {
            // ignore Landscape001 mesh, that is for the toonshader
            //if (mesh.name === "Landscape001"){
            //    return
            //}
            
            const geometry = mesh.geometry;
            
            // Check if geometry has valid attributes
            if (!geometry.attributes.position) {
                console.warn('Mesh has no position attributes, skipping collision body');
                return;
            }
    
            // Get world position and rotation
            const worldPosition = new THREE.Vector3();
            const worldQuaternion = new THREE.Quaternion();
            const worldScale = new THREE.Vector3();
            
            mesh.updateWorldMatrix(true, false);
            mesh.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale);
    
            // Create collision shape based on geometry type
            let shape: CANNON.Shape;
            
            if (geometry instanceof THREE.BoxGeometry) {
                // For box geometry, use Box shape
                const size = new THREE.Vector3();
                geometry.computeBoundingBox();
                geometry.boundingBox!.getSize(size);
                size.multiply(worldScale);
                
                shape = new CANNON.Box(new CANNON.Vec3(
                    size.x / 2,
                    size.y / 2, 
                    size.z / 2
                ));
            } else if (geometry instanceof THREE.SphereGeometry) {
                // For sphere geometry, use Sphere shape
                const radius = geometry.parameters.radius * Math.max(worldScale.x, worldScale.y, worldScale.z);
                shape = new CANNON.Sphere(radius);
            } else if (geometry instanceof THREE.CylinderGeometry) {
                // For cylinder geometry, use Cylinder shape
                const params = geometry.parameters;
                shape = new CANNON.Cylinder(
                    params.radiusTop * worldScale.x,
                    params.radiusBottom * worldScale.x,
                    params.height * worldScale.y,
                    params.radialSegments
                );
            } else {
                // For complex geometry, use Trimesh (convex polyhedron)
                // Note: Trimesh is less performant but works for arbitrary shapes
                const vertices = geometry.attributes.position.array as Float32Array;
                const indices = geometry.index ? geometry.index.array as Uint32Array : undefined;
                
                if (indices && indices.length > 0) {
                    // Use Trimesh for indexed geometry
                    const cannonVertices = [];
                    for (let i = 0; i < vertices.length; i += 3) {
                        cannonVertices.push(
                            vertices[i] * worldScale.x,
                            vertices[i + 1] * worldScale.y, 
                            vertices[i + 2] * worldScale.z
                        );
                    }
                    
                    shape = new CANNON.Trimesh(cannonVertices, Array.from(indices));
                } else {
                    console.warn('Complex mesh without indices, using simplified collision');
                    // Fallback to bounding box
                    geometry.computeBoundingBox();
                    const box = geometry.boundingBox!;
                    const size = new THREE.Vector3();
                    box.getSize(size);
                    size.multiply(worldScale);
                    
                    shape = new CANNON.Box(new CANNON.Vec3(
                        size.x / 2,
                        size.y / 2,
                        size.z / 2
                    ));
                }
            }
    
            // Create static body
            const body = new CANNON.Body({
                type: CANNON.Body.STATIC,
                shape: shape,
                position: new CANNON.Vec3(
                    worldPosition.x,
                    worldPosition.y,
                    worldPosition.z
                ),
                quaternion: new CANNON.Quaternion(
                    worldQuaternion.x,
                    worldQuaternion.y, 
                    worldQuaternion.z,
                    worldQuaternion.w
                )
            });
    
            // Add body to physics world and store reference
            this.physicsWorld.addBody(body);
            this.levelBodies.push(body);
            
            console.log(`Added static collision body for mesh: ${mesh.name || 'unnamed'}`);
        }
    


    /**
     * Clean up physics bodies when level is destroyed
     */
    private cleanupPhysicsBodies(): void {
        this.levelBodies.forEach(body => {
            this.physicsWorld.removeBody(body);
        });
        this.levelBodies = [];
    }

    

}