/**
 * 
 * Overworld 3d scene 
 * 
 * to do:
 * 
 * (1) implement the level mesh, hdr and cameras
 * (2) implement the level collision (1/4)
 * (3) implement the level creation and destruction logic 
 * (4) implement 3d player mesh with proper movement
 * (5) connect level with overworld 2d spaceship exit object
 * (6) separate 3d render  binder for 3d animate function into two separate functions
 * (7) implement camera look around for the 3d levels
 * (8) separate code base into separate classes for better updating
 * (9) Get a proper toonshader implementation for Threejs
 * (10) fix player collision from a sphere to a bean
 * (11) fix overworld level collison creation
 * 
 * bugs:
 * (1) fix the 3d player movement physics
 * (2) improve level toonshader render
 * (3) the level lights bug out the model's texture
 * 
 */
import * as LittleJS from 'littlejsengine';

const { EngineObject ,Color, Timer, vec2,gamepadIsDown, gamepadStick, keyDirection, mouseIsDown, keyIsDown,isTouchDevice} = LittleJS; 

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
const { Scene, PerspectiveCamera, WebGLRenderer,BufferAttribute, BufferGeometry, MeshBasicMaterial, Mesh, TextureLoader } = THREE;
import { OverWorld } from "./OverworldTopDown";
//import { Vector3 } from "three";
import * as CANNON from "cannon-es";
import CannonDebugger from 'cannon-es-debugger';



// to do: (1) lock 3d initialisation variants and logic into the script with proper optimization
//3d Camera Distance Constants
export const CAMERA_DISTANCE = 16; 
export const THIRD_PERSON_DISTANCE = 7;

// to do: fix 3d player collision any Physicsv/ implement canon es for collisions

export class OverWorld3D {


    private local_3d_engine : any;
    private despawnTimer : LittleJS.Timer = new Timer();
    private Timeout : number = 300;

    // threejs
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public renderer: THREE.WebGLRenderer;
    
    // to do:
    // (1) properly define types for these objets
    public cube: any | null;
    public gltf: any | undefined;
    public player : THREE.Object3D<THREE.Object3DEventMap>| undefined;
    public playerBody : CANNON.Body | undefined;
    public playerAnims: THREE.AnimationMixer | null = null;

    // threejs animations
    public walkAction: THREE.AnimationAction | undefined ;

    public threejsLayer : HTMLElement | null = document.getElementById("threejs-layer"); // get the renderer's DOM element 

    // cannon-es physics
    public physicsWorld: CANNON.World;
    public cannonDebugger: any;
    public levelBodies: CANNON.Body[] = []; // Store all level collision bodies


    // input controls
    public moveInput : LittleJS.Vector2 = vec2(0);
    public holdingRoll : boolean = false;
    public holdingAttack : boolean = false;

    
    //spawned objects / objects
    public levelObjects : any[] | null = [];
    
    constructor(){
        //super();
        //this.color = new Color(0, 0, 0, 0); // make object invisible
        
        //make  scene and camera globally accessible
        const scene = new Scene();
        const camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new WebGLRenderer();
        const loader = new GLTFLoader();
        const loaderTex = new TextureLoader(); // for loading the LDR


        // make global in class
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer

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
       
        

          // set up cannon-es world physics
        const physicsWorld = new CANNON.World({
            gravity: new CANNON.Vec3(0,-9.82,0)
        });

        this.physicsWorld = physicsWorld;



         const path1 = "./550px-TLoZTWW_Vr_boxcloud1.png"; //load the default ldr
        


        loaderTex.load(path1, (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
                //texture.encoding = THREE.sRGBEncoding; // important for correct colors
        
        scene.background = texture;
        scene.environment = texture; // still usable for reflections, though LDR
        });

        const path2 : string = "./overworld_map.glb"; 

        (async () => {        

            // load the world mesh
            loader.load(
                        path2,
                        (gltf) => {
                        
                            const gradientMap = new THREE.TextureLoader().load(
                            './threeTone.jpg'
                            );
                            gradientMap.minFilter = THREE.NearestFilter;
                            gradientMap.magFilter = THREE.NearestFilter;            
                            const toonShader = new THREE.ShaderMaterial({
                            uniforms: {
                                color: { value: new THREE.Color(0xF0E68C) },
                                lightDirection: { value: new THREE.Vector3(1, 1, 1).normalize() },
                            },
            
                            // toon shader material
                            vertexShader: `
                                varying vec3 vNormal;
                                void main() {
                                vNormal = normalize(normalMatrix * normal);
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                                }
                            `,
                            fragmentShader: `
                                varying vec3 vNormal;
                                uniform vec3 color;
                                uniform vec3 lightDirection;
                                void main() {
                                float light = dot(vNormal, lightDirection);
                                float intensity = step(0.5, light); // 2-tone cel shading
                                gl_FragColor = vec4(color * intensity, 1.0);
                                }
                            `,
                            });
            
            
        
                            // Apply toon material to all meshes in the model
                            gltf.scene.traverse((child) => {
                                    if (child instanceof THREE.Mesh) {
                                    child.material = toonShader;
                                    child.material.needsUpdate = true;
                                    }
                            });
            
            
                            // Save scene as global pointer
                            this.cube = gltf.scene;
                            scene.add(gltf.scene);

                            //add cannon-es static body mesh for collision
                            // avoid the Landscapp001 mesh as that mesh is for the toonshader lineart shader
                            this.addLevelCollisionMesh(gltf.scene);
            
                            console.log("Finished loading model:", this.cube);
                            console.log("Levels bodies debug: ", this.levelBodies);
                        },
                        undefined,
                        (error) => {
                            console.error('Error occurred loading the 3D model:', error);
                            
                        }
                        );

                

           })();
        // to do:
        // (1) set albedo model (done)
        // (2) load player3d model (done)
        // (3) implement simple floaty movement physics (1/2)
        // (4) implement 3rd person 3d camera controls (done)
                
        // load the player model using an animation mixer to play animations
        const path3 : string = "./player_rigged.glb"
         loader.load(
                    path3,
                    (gltf) => {
                       
                        // Save scene as global pointer
                        this.player = gltf.scene;
                        //this.player.position.set(0,5,15);
                        
                        scene.add(gltf.scene);

                        //add cannon-es kinematic body mesh for collision
                        this.addPlayerCollisionMesh(gltf.scene);
        
                        // ----------------------------------------------------
                        // ANIMATION SETUP
                        // ----------------------------------------------------
                        this.playerAnims = new THREE.AnimationMixer(gltf.scene);

                        // List animations for debugging
                        console.log("Animations inside GLB:", gltf.animations.map(a => a.name));
                        
                        const walkClip = gltf.animations.find(
                            clip => clip.name === "Armature|mixamo.com|Layer0"
                        );

                        //console.log("Walking animation debug: ", walkClip);
                        // to do: 
                        // (1) move animation logic outside the loader class if possible
                        if (walkClip) {
                            this.walkAction = this.playerAnims.clipAction(walkClip);

                            // Configure the animation action properly
                            this.walkAction.setLoop(THREE.LoopRepeat, Infinity); // Make it loop
                            this.walkAction.clampWhenFinished = false; // Don't stop at the end
                            this.walkAction.play(); // Start playing
                            
                        }

                        console.log("Walking animation debug 2: ", this.walkAction);

                        


                        console.log("Finished player loading model:", this.cube);
                        console.log("Levels bodies debug: ", this.levelBodies);
                    },
                    undefined,
                    (error) => {
                        console.error('Error occurred loading the 3D model:', error);
                        
                    }
            );
        

        // trigger the despawn timer
        this.despawnTimer.set(this.Timeout);
        const cannonDebugger = CannonDebugger(scene, physicsWorld, {});
        const clock = new THREE.Clock();
        //const fixedTimeStep = 1 / 60;
        const maxSubSteps = 3;

        //for setting initial spawn point 
        let SPAWN = false;
        let DEBUG = true;

        // The main 3d game loop runs here
        //run the physics simulation on each animation frame by binding the context
        const animate = () => {
            requestAnimationFrame(animate);
            const delta = clock.getDelta();
            physicsWorld.fixedStep(delta,maxSubSteps);
            
            if (DEBUG){ // for debugging 3d mesh with cannon debugger
                cannonDebugger.update();
            }

            //set the initial spawnpoint
            if (!SPAWN && this.playerBody){
                this.playerBody.position.set(0,20,0);
                SPAWN= true;
            }


            //apply cannon-es physics to mesh
            if (this.player && this.playerBody){

                // apply physics mesh to player
                this.player.position.copy(this.playerBody.position);
                

                // camera tracking
                // -----------------------------------------
                // THIRD-PERSON CAMERA SETUP
                // ----------------------------------
                        
                // Get world position of the player
                const playerPos = new THREE.Vector3();
                this.player.getWorldPosition(playerPos);

                // Third-person offset relative to player
                //    ↑X  ↑Y  ↑Z
                //    - Slightly above (2.5)
                //    - Slightly behind (6)
                const cameraOffset = new THREE.Vector3(0, 3.4, -4); 


                // Apply camera position
                this.camera.position.copy(playerPos.clone().add(cameraOffset));

                // Look at the player
                this.camera.lookAt(playerPos);

                // second despawn logic for falling off 3d map
                if (this.playerBody.position.y < -20){
                    this.despawn();
                    //this.destroy();
                    this.State()["STATE_DEATH"]();
                    return;
                }

            }

            // UPDATE THE ANIMATION MIXER 
            if (this.playerAnims) {
                this.playerAnims.update(delta);
            }

            
            // movement logic
            if (this.moveInput && this.playerBody){

                this.State()["STATE_WALKING"]();
            }

            renderer.render(scene, camera);

           
        }

        // simulate the 3d physics
        animate();

    }
    destroy(){ // placeholder function for destroying the 3d scene and objects
        }
   
    // to do ;
    // (1) depreciate this update function and the overworld scene to not use littlejs engine class and objects
    // (2) call this function with other intervals
    update() : void{
        // Map destruction logic
        if (this.despawnTimer.elapsed()){


            this.despawn();
            //this.destroy();
        }

    

        // add second map destruction logic for despawning if player falls through map


        // Player controls

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
        

        // to do:
        // (1) add movement simple state machine for 3d player body mesh (done)
        // (2) add mouse controls for 3d camera controls
        // (3) add toon shader material to 3d player texture material
        
        
    }


    despawn(){
          //hides the threejs css render layer
            const layer = document.getElementById("threejs-layer");
            if (layer) {
                layer.style.visibility = "hidden";
            }                                   


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

                    //clean up physics bodies
                    this.cleanupPhysicsBodies();

                    this.player = null!;
                    this.playerBody = null!;



                     window.globals.current_level = "Overworld"; //"Overworld 3";

            // go to the overworld map
            window.map = new OverWorld();
            

    }
   
       // player state machine
    State(): Record<string, () => void>  {
        return {

            "STATE_DEATH": () => {
                
                return ;
            },

            "STATE_WALKING": () => {
                if (!this.playerBody) return;

                let velocity = this.moveInput;
                const moveSpeed = 35;
                const currentVel = this.playerBody.velocity;
                
                // Convert 2D input to 3D movement (X and Z axes)
                const targetVelocity = new CANNON.Vec3(
                    velocity.x * moveSpeed,
                    currentVel.y, // Keep existing Y velocity (gravity)
                    velocity.y * moveSpeed
                );

                // Apply smooth movement using velocity instead of direct position setting
                this.playerBody.velocity.x = -targetVelocity.x;
                this.playerBody.velocity.z = targetVelocity.z;

                // Rotate player to face movement direction
                if (this.player) {
                    const angle = Math.atan2(-velocity.x, velocity.y);
                    //console.log("angle debug: ", angle);
                    this.player.rotation.y = angle;
                }

                // Play walk animation if not already playing
                if (this.walkAction && !this.walkAction.isRunning()) {
                    this.walkAction.reset().fadeIn(0.2).play();
                }
        }, 
        }
            
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

   
      /**
     * Add Cannon-es static body collision mesh for the level geometry
     * @param gltfScene - The loaded GLTF scene to extract collision from
     */
    private addLevelCollisionMesh(gltfScene: THREE.Object3D): void {
        gltfScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                this.createStaticBodyFromMesh(child);
            }
        });
    }

    /**
     * Add a single Cannon-es sphere collider for the player model.
     * @param gltfScene - The loaded GLTF player scene
     */
    private addPlayerCollisionMesh(gltfScene: THREE.Object3D): void {

        // ---- 1. Compute player world position ----
        const worldPos = new THREE.Vector3(0,0,0);

        console.log("player collision spawn pos: ", worldPos);

        gltfScene.updateWorldMatrix(true, false);
        gltfScene.getWorldPosition(worldPos);

        // ---- 2. Define your player collision sphere radius ----
        const radius = 0.75; // Adjust to fit your model height

        // ---- 3. Create the sphere shape ----
        const shape = new CANNON.Sphere(radius);

        // ---- 4. Create a single kinematic body ----
        const body = new CANNON.Body({
            mass: 10,
            type: CANNON.Body.DYNAMIC,
            shape: shape,
            position: new CANNON.Vec3(worldPos.x, worldPos.y + radius, worldPos.z),
            linearDamping: 0.1
            // ^ adds the collider centered around the player's midsection
        });

        // ---- 5. Add body to physics world ----
        this.physicsWorld.addBody(body);

        // Keep reference to this one body (do NOT push into levelBodies)
        this.playerBody = body;
        

        console.log("Added SINGLE sphere collider for player");
    }


  
}


