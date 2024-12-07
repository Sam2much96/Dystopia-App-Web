/*

Main Game Logic

(1) Using LittleJS As A Module for 3d Logic, 2d rendering, 2d logic
(2) Using Threejs for 3d geometry rendering
(3) Using ZzFx for Sound Fx
(4) Using HowlerJS for Audio Playback

*/

//teplorarily disabling for ads testing -"use strict"


// TO DO: import only the modules you need for faster load time
import * as THREE from 'https://unpkg.com/three@0.170.0/build/three.module.js';//'/node_modules/three/src/Three.js';


// show the LittleJS splash screen
setShowSplashScreen(true);

// Show Game Pad on Mobile Devices
touchGamepadEnable = true;



'use strict';





class Music {


    /*
    All Music Logic In One Script
    
    Functions:
    (1) Plays Music Tracks
    (2) Shuffles Between A Playlist Using Maths module(3) Stores All Music To A Playlist
    (4) Stores All SFX
    (5) Play is called on the sfx track directly
    (6) Music Synthesizer Docs: https://keithclark.github.io/ZzFXM/
    
    Notes:
    (1) The SFX and Music Use 2 Different Systems, SFX USes ZzFX a js midi engine
        whereas Music Uses Audio Tags written into the index.html file and called by Element ID
    (2) Most Browsers Refuse Audio music play by default unless the player / user enters an input gesture
    */



    constructor() {

        console.log("Creating Music Node");
        // Initialize the LittleJS Sound System

        this.ENABLE = false; // turning off music singleton for bandwidth saving
        this.lastPlayedTrack = null; // Variable for keeping track of the music shuffler & prevents repeating tracks
        this.sound_shoot = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);


        this.zelda_powerup = new Sound([1.5, , 214, .05, .19, .3, 1, .1, , , 167, .05, .09, , , , .11, .8, .15, .22]); // Powerup 9// Powerup 9

        // sound effects
        this.sound_start = new Sound([, 0, 500, , .04, .3, 1, 2, , , 570, .02, .02, , , , .04]);
        this.sound_break = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        this.sound_bounce = new Sound([, , 1e3, , .03, .02, 1, 2, , , 940, .03, , , , , .2, .6, , .06]);
        this.sound_mosquito_flys = new Sound([, , 269, .36, .01, .01, 2, 2.6, , 4, , , .07, , , , , .62]); // Random 30
        this.souund_mosquito_dies = new Sound([1.3, , 328, .03, .34, .02, 2, 1.3, , , -27, .14, , , .6, , .01, .54, .19]); // Random 31
        this.sound_zapp = new Sound([1.2, , 678, .19, .49, .02, 1, 4.1, -75, 9, -263, .43, , .3, 3, , .09, .66, .41, .06, 381]); // Random 24
        this.sound_call = new Sound([1.9, , 66, .05, .48, .009, , 3.1, -38, 20, , , .13, , .5, .7, .1, .58, .19, .14, -1495]); // Random 26
        this.sound_boing = new Sound([1.4, , 286, , .19, .009, , 2.7, , -9, 363, .33, , , 61, , .22, .96, .14, .18, -1176]); // Random 29
        this.sound_tv_static = new Sound([.7, , 187, .01, , .01, 4, 4.8, 2, 72, , , , .1, , , , , .41, , 102]); // Random 32
        this.sound_metal_gong = new Sound([.7, , 286, .08, , .46, 3, 3.9, , , -76, .57, , , 15, , .07, .65, .08, , 204]); // Random 33
        this.zelda = null;

        this.current_track = null;//"track placeholder";
        this.next_track = null;
        //this.timer = new Timer();
        this.counter = 0;
        // Map sounds to different sound effects and play them via an enumerator/global script
        //required for a music shuffler
        this.sfx_playlist = new Map([
            [0, this.zelda_powerup],
        ])

        // Music tracks Url's
        this.default_playlist = [
            "https://music-files.vercel.app/music/fairy-fountain.ogg",
            "https://music-files.vercel.app/music/310-world-map-loop.ogg",
            "https://music-files.vercel.app/music/Astrolife chike san.ogg",
            "https://music-files.vercel.app/music/captured_land.ogg",
            "https://music-files.vercel.app/music/chike san afro 1.ogg",
            "https://music-files.vercel.app/music/chike san afro 2.ogg",
            "https://music-files.vercel.app/music/chike san afro 3.ogg",
            "https://music-files.vercel.app/music/Gregorian-Chant(chosic.com).ogg",
            "https://music-files.vercel.app/music/hard_won_nobility.ogg",
            "https://music-files.vercel.app/music/here_comes_trouble.ogg",
            "https://music-files.vercel.app/music/here_comes_trouble.ogg",
            "https://music-files.vercel.app/music/Inhumanity Game Track 3.ogg",
            "https://music-files.vercel.app/music/Marble Tower 4.ogg",
            "https://music-files.vercel.app/music/paranoia.ogg",
            "https://music-files.vercel.app/music/Spooky-Chike-san song.ogg",
            "https://music-files.vercel.app/music/The Road Warrior.ogg",
            "https://music-files.vercel.app/music/Track 1-1.ogg",
            "https://music-files.vercel.app/music/zelda2.ogg"
        ];

    }
    /* 
    playZeldaOpeningLittleJS() {
        console.log("Playing A Zelda Theme Song");
        this.zelda = new Sound()
        // Notes and their corresponding frequencies (in Hz)


    }
    */


    play_track() {

        if (this.ENABLE) {

            var track = this.default_playlist;

            // Static variable to keep track of the last played track
            //if (!this.lastPlayedTrack) {
            //    this.lastPlayedTrack = null;
            //}

            // Filter out the last played track and pick a random one from the remaining tracks
            const availableTracks = this.default_playlist.filter(track => track !== this.lastPlayedTrack);
            const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];


            // Log the selected track
            console.log("Selected Track: ", randomTrack, "/", this.counter);

            var sound = new Howl({
                src: [randomTrack],
                format: ['ogg'], // Specify the format(s) of your audio file
                volume: 0.5,
                autoplay: true, // Whether to autoplay (optional)
                loop: true,     // Loop playback (optional)
                preload: true,   // Preload the audio (default is true)

                onend: function () {
                    console.log("Finished Playing Music");//alert("Finished!");
                }
            });

            // Update the last played track
            this.lastPlayedTrack = randomTrack;

            sound.play();

            // counter for logging how many loops the Music singleton has player through
            this.counter += 1;
        }

        if (!this.ENABLE) {
            return 1;
        }
    }


}


/*
Inventory Singleton


Functions
(1) Handles All Player Inventory
(2) 

*/

class Inventory {


    constructor() {
        //super();
        console.log("Loading Inventory Singleton")
        this.items = {}; // Internal dictionary to store inventory items
    }

    // Add or update an item in the inventory
    set(itemName, quantity) {
        if (quantity <= 0) {
            delete this.items[itemName]; // Remove item if quantity is zero or less
        } else {
            this.items[itemName] = (this.items[itemName] || 0) + quantity;
        }
    }

    // Retrieve the quantity of an item
    get(itemName) {
        return this.items[itemName] || 0; // Return 0 if the item doesn't exist
    }

    // Check if an item exists in the inventory
    has(itemName) {
        return itemName in this.items;
    }

    // Remove an item completely from the inventory
    remove(itemName) {
        delete this.items[itemName];
    }

    // Get a list of all items
    getAllItems() {
        return { ...this.items }; // Return a copy of the inventory
    }

    // Count total unique items
    getItemCount() {
        return Object.keys(this.items).length;
    }

    // Count total quantity of all items
    getTotalQuantity() {
        return Object.values(this.items).reduce((sum, quantity) => sum + quantity, 0);
    }
}


/*

3d Rendering Engine

Features
(0) Maps to the background layer
(1) Uses WebGL and Maths for 3d rendering
(2) Overlays 3d rendering to The viewport via css-style sheet ID canvas
(3) TO DO: Load GLTF Models

Bugs
(1) The 3d Renderer should ideally be in a separate class
(2) This codebase runs littlejs as a module to allow importing Threejs
(3) Is a performance hog, should be used sparingly/ optimised for mobi
*/



class ThreeRender {


    constructor() {
        //super();
        // create a global threejs object
        this.THREE = THREE;

        console.log("Three JS Debug 1: ", this.THREE);

        const { Scene, PerspectiveCamera, WebGLRenderer } = this.THREE;

        //make  scene and camera globally accessible
        // Create the scene, camera, and renderer
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();


        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer's DOM element to your target layer
        var threejsLayer = document.getElementById("threejs-layer");
        threejsLayer.appendChild(this.renderer.domElement);

        // A placeholder for the cube mesh
        this.cube = null;

    };
    renderAnimation() {

        // class wide animation function
        this.renderer.render(this.scene, this.camera);
        //requestAnimationFrame(animate);

    }


    renderStill() {
        // renders a still image with no animmation
        this.renderer.render(this.scene, this.camera);

    }

    Cube() {

        /**
        AN OPtimised way of drawing a Cube in Threejs using Webgl directly 
        
         Features:
         (1)Fast Loading Of 3d geometry using Webgl directly and optimised

         To DO:
         (1) Add Positional Parameters CUbe Objects
        
        */


        console.log("Creating 3D Cube Object");

        // Load required Libraries from Global THreejs class
        const { BufferAttribute, BufferGeometry, MeshBasicMaterial, Mesh } = this.THREE;


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


    getRandomColor() {
        return Math.random() * 0xffffff;
    }

    setCubePosition(x, y, z) {
        if (this.cube) {
            this.cube.position.set(x, y, z);
        } else {
            console.warn("Cube has not been created yet.");
        }
    }

    hasCube() {
        // Exported safe function to check if there is a cube instance
        if (this.cube) {
            return true;
        }
        else {
            return false;
        }

    }

    getCubePosition() {
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

    deleteCube() {
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

    hideThreeLayer() {
        //hides the threejs css render layer
        document.getElementById("threejs-layer").style.visibility = "hidden";
    }

    showThreeLayer() {
        //shows the threejs css render layer
        document.getElementById("threejs-layer").style.visibility = "visible";
    }


    setCamera(Int_Distance) {
        // Sets the camera at a specific distance
        this.camera.position.z = Int_Distance;

    }

    animate() {
        // Bind `this` to preserve context in animation loop
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the cube
            if (this.cube) {
                this.cube.rotation.x += 0.01;
                this.cube.rotation.y += 0.01;
            }

            // Render the scene
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}


class Utils {

    /*
    
    Utils.js
    
    Features: 
    (1)  Contains All Game Math Logic in One Script
    (2) Extends Static Functions to Other Scenes For Handing Maths, and Logical Caculations asides Simulation Logic
    */


    enemyMob() {
        //enemy mob logic in pure javascript
        return 0;
    }
    enemyPathFinding() {
        return 0;
    }
}

class Signal {
    /** Event Driven Signal Class in  Javascript
     * 
     */
    constructor() {
        this.listeners = [];
    }

    connect(listener) {
        // connect functions to the signal class
        this.listeners.push(listener);
    }

    disconnect(listener) {
        // disconnect functions from the signal class
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    emit(...args) {
        // emit the signal which triggers all methods connected to this
        this.listeners.forEach(listener => listener(...args));
    }
}


class GameObject extends EngineObject {
    // Base Class for All Game Objects
    constructor() {
        super();
        console.log("Loading Utils Singleton");

    }

}


class Inputs extends GameObject {

    /*
    Functions:
    
    (1) Handles And Porpagates all Input In the Game
    (2) Stores Input to An Input Buffer
    (3) Handles creation and Destruction of Game HUD as a child
    (4) Maps Player Input Action To A Global Enum
    
    TO DO:
    (1) Map and Test Gamepad implementation in the wild
    */



    constructor() {
        super();
        this.color = new Color(0, 0, 0, 0); // make object invisible
        // Input Buffer
        this.input_buffer = [];

        //Input State Machine Enumeration
        this.input_state = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
            ['ATTACK', 4],
            ['ROLL', 5],
        ]);

        this.state = null; // holds the current input state asides the input buffer

        // Testing Input Enumeration
        //console.log("Input Debug 1: ", this.input_state.get("UP"));
        //console.log("Input Debug 2: ",input_state.get("ATTACK");
    }

    // Returns The Input Buffer as An Array
    get_Buffer() {
        return this.input_buffer
    }

    update() {
        const WALKING = 1.0;
        // mouse and TouchScreen Input
        //this.pos = mousePos;

        // Maps Key Presses To Input States And Appends Them to The input buffer
        //
        // Move UP
        //console.log("Testing Input Singleton");
        if (keyWasPressed('KeyW')) {
            //console.log("key W as pressed! ");

            // update input buffer
            this.input_buffer.push(this.input_state.get("UP"));

            // update current state
            this.state = this.input_state.get("UP");

            // move up
            this.pos.y += WALKING;
            //console.log("Position debug 1: ", this.pos.x);
        }

        // Move Down
        if (keyWasPressed('KeyS')) {
            //console.log("key S as pressed! ");

            // update input buffer
            this.input_buffer.push(this.input_state.get("DOWN"));

            // update current state
            this.state = this.input_state.get("DOWN");

            // move up
            this.pos.y -= WALKING;
        }

        // Move Left
        if (keyWasPressed('KeyA')) {

            // move left
            //console.log("key A as pressed! ");

            //update input buffer
            this.input_buffer.push(this.input_state.get("LEFT"));


            // update current state
            this.state = this.input_state.get("LEFT");

            // move left
            this.pos.x -= WALKING;
        }

        // Move Right
        if (keyWasPressed('KeyD')) {

            //move right
            //console.log("key D as pressed! ");

            //update input buffer
            this.input_buffer.push(this.input_state.get("RIGHT"));

            // update current state
            this.state = this.input_state.get("RIGHT");

            // move right
            this.pos.x += WALKING;


        }

        // Attack
        // does not work yet
        if (keyWasPressed('KeyX')) {
            // for debug purposes only
            console.log(" Key X Pressed");

            //update input buffer
            this.input_buffer.push(this.input_state.get("ATTACK"));

            // update current state
            this.state = this.input_state.get("ATTACK");

        }

        // Debug Input Buffer
        if (keyWasPressed('KeyL')) {
            console.log("key L as pressed! ");
            console.log("Input Buffer: ", this.get_Buffer());
        }



        // Inventory Debug
        if (keyWasPressed('KeyI') && window.inventory) {

            //Debug Inventory

            console.log("key I was pressed: ", window.inventory.getAllItems());
        }

        // show/hide menu
        if (keyWasPressed('KeyP') && window.ui) {
            var menuVisible = window.ui.getMenuVisible();
            console.log("Key P was Pressed, Menu toggle: ", menuVisible);
            window.ui.setMenuVisible(!menuVisible);

        }

        // show / hide menu 2
        if (!(window.player) && window.ui && mouseWasPressed(0)) {

            var menuVisible = window.ui.getMenuVisible();
            console.log("Mouse was Pressed, Menu toggle: ", menuVisible);
            window.ui.setMenuVisible(!menuVisible);
        }

        // GamePad Input
        if (gamepadWasPressed(1)) {
            console.log("Game Pad Was Pressed, Test Successfull");
            return 0;
        }

        if (gamepadWasPressed(2)) {
            console.log("Game Pad Was Pressed, Test Successfull 2");
            return 0;
        }

        // Prevents Buffer/ Mem Overflow for Input Buffer
        if (this.input_buffer.length > 12) {
            this.input_buffer.length = 0; // Clears the array
        }
    }
}


class Player extends GameObject {
    /*
    PLAYER CLASS
    
    Features:
    (1) Base Class for all plyer types, 3d, platformer, and top down


    You can use the isOverlapping function to check the object against the camera. For culling you maybe want to enlarge th…
    if (!isOverlapping(this.pos, this.size, cameraPos, renderWindowSize)) 
    */

    constructor() {

        super();
        console.log("Creating Player Sprite");

        // Fetch Player Health From Globals Singleton
        // Update Globals With Player Pointer

        this.input = window.input; // global input singleton

        // create a pointer to the Particle fx class

        // store player object in global array
        window.globals.players.push(this);

        this.color = randColor();//RED; // make random colour

        // Player Logic Variables 
        this.WALK_SPEED = 500; // pixels per second 
        this.ROLL_SPEED = 1000; // pixels per second
        this.GRAVITY = 0; // For Platforming Levels
        this.ATTACK = 1; // For Item Equip
        this.hitpoints = window.globals.health; // global hp singleton 
        this.pushback = 5000;
        this.linear_vel = vec2(0, 0);
        this.roll_direction = vec2(0, 1);//Vector2.DOWN

        this.StateBuffer = [];
        this.item_equip = ""; //Unused Item Equip Variant

        // player signal class
        // signal class implementation is buggy
        this.health_signal = new Signal();

        // player GUI
        this.local_heart_box = null // Pointer To Heart Box HUD from the UI Class


        function health_changed(new_hp) {
            console.log("Health Changed Debug: ", 3); //this.hitpoints
            //this.health_signal.emit(new_hp)
            return 0;
        }

        function healthDebug(hp) {
            //placeholder helath debug method for testing signAL CLASS
            // remove later
            console.log("Health Debug 2: ", hp);
        }

        // TO DO:
        // (1) Connect to Mini Map UI
        // (2)

        // Connect Heart box signals
        // check if signal is connected
        // temporarily debugging signal implementation
        if (!this.local_heart_box) {

            // connect health changed method to global class signal
            this.health_signal.connect(health_changed);
            this.health_signal.connect(healthDebug);
        }

        // Set initial player health
        health_changed(this.hitpoints);

        // player state machine
        this.state_machine = new Map([
            ['STATE_BLOCKED', 0],
            ['STATE_IDLE', 1],
            ['STATE_WALKING', 2],
            ['STATE_ATTACK', 3],
            ['STATE_ROLL', 4],
            ['STATE_DIE', 5],
            ['STATE_HURT', 6],
            ['STATE_DANCE', 7]
        ]);

        // PLAYER'S FACING
        this.facing_state_machine = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
        ]);

        // set initial player's default state
        this.state = this.state_machine.get("STATE_IDLE");
        this.facing = this.facing_state_machine.get("DOWN");

        //TO DO: player's camera pointer (1) Camer should follow/ track the player's position
        //TO DO: player's animation node pointer

        //disconnect extra signal
        this.health_signal.disconnect(healthDebug);

        //PLAYER'S PARTICLE AND SOUND FX POINTERS
        this.blood = null;
        this.despawn_particles = null;
        this.die_sfx = null;
        this.hurt_sfx = null;

        // Music Singleton Pointer
        // this would be kinda drepreciated as each Zzfx can play its own sould 
        // this not needing the music singleton pointer to actually play sfx
        this.music_singleton_ = null;

        // player collision & mass
        this.mass = this.GRAVITY; // make object have static physics
    }



    hurt() {

        //use a timer to flash the player object colour from orig  -> white -> orig
        //(1) Play Hurt Animation
        //(2) Trigger kickback
        //(3) Update Player health
        this.hitpoints -= 1
    }

    update() {

        if (this.input) {
            // for debugging
            // update sprite position to input singleton position
            this.pos = this.input.pos; //mousePos; //player movement logic, should ideally lerp btw 2 positions

        }

        // player hit collision detection
        // TO DO:
        // (1) Adjust for multiple enemies using a collision radius / enemy object pool pointers
        // (1) Enemy Template
        if (isOverlapping(this.pos, this.size, window.enemy1.pos, window.enemy1.size) && this.input.state == 4) { // if hit collission and attack state
            console.log("Player Hit Collision Detection Triggered");

            // reduce enemy health
            window.enemy1.hitpoints -= 1
        }
    }

    despawn() {
        // (1) Play Despawn Animation
        if (this.hitpoints <= 0) {
            // delete player object
            this.destroy();

            // set the global player to null
            window.player = null;
        }
    }

    respawn() {
        return 0;
    }

    shake() {
        // shaky cam fx
        return 0;
    }

}

class Enemy extends GameObject {
    // To DO :
    // (1) Enemy spawner
    // (2) Enemy Mob logic using Utils functions
    // (3) Enemy State Machine
    // (4) Enemy Collisions
    // (5) Enemy Animations

    constructor(pos, size) {
        super(pos, size);
        //(1) set the Enemy object's position
        //(2) set the Enemy object's type which determines the logic

        this.color = RED; // make red colour

        // set enemy position from the initialisation script
        this.pos = pos;

        this.hitpoints = 1; //set a default enemy hp

        // store player object in global array
        window.globals.enemies.push(this);

        // Enemy Type Enum
        this.enemy_type = new Map([
            ['EASY', 0],
            ['INTERMEDIATE', 1],
            ['HARD', 2]
        ])

        // Match Frame Rate to Both Enemy TIme And Engine FPS
        this.IDIOT_FRAME_RATE = 60
        this.SLOW_FRAME_RATE = 30
        this.AVERAGE_FRAME_RATE = 15
        this.FAST_FRAME_RATE = 5


        //Input State Machine Enumeration
        this.state_machine = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
            ['ATTACK', 4],
            ['ROLL', 5],
            ['MOB', 6],
        ]);

        // Enemy Movement Logic
        this.velocity = vec2(0, 0); // default temp velocity

        // Testing Enemy Type Enumeration
        console.log("Input Debug 1: ", this.enemy_type.get("EASY"));

        // Enemy collision & mass
        //this.setCollision(true, true); // make object collide
        //this.mass = 0; // make object have static physics

    }
    update() {
        // Enemy hit collision detection
        if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
            console.log("ENemy Hit Collision Detection Triggered");

            // this.hitpoints -= 1;

            // TO DO: (1) Trigger Kickback Logic
        }

        // Despawn logic
        if (this.hitpoints <= 0) {
            this.despawn();
        }

    }

    _get_player() {

        //(1) Gets the Player Object in the Scene Tree if Player unavailable, get him from the global pointer 
        return 0;
    }

    despawn() {
        if (this.hitpoints <= 0) {
            // destroy block when hitpoints is at zero or less
            this.destroy();
        }
    }
    _on_enemy_eyesight_body_entered() {
        // player detection with a raycast
        return 0;
    }

    _on_enemy_eyesight_body_exited() {
        // player leaves enemy detection raycast
        return 0;
    }

}
class EnemySpawner extends GameObject {
    //spawn an enemy count at specific posisitons
}


class Simulation extends GameObject {
    /*
    
    Simulation Singleton In One Class
    Handles all simulation logic

    3d Cube Logic handled by littlejs

    Features:
    (1) Add Gravity TO Cube Object
    (2) Adds A ground Level To Scene

     */
    // To DO : Add Player And Cube Collissions Where The Cube Collision tracks the Cube Object



    constructor() {
        super();
        this.cubePosition = null; // for storing the cube geometry 3d position 
        this.groundLevel = -13; // ground position for stopping Gravity on Cube 

        this.timer = new Timer(); //timer necessary for running the simulation timer loop

        return 0;
    };


    update() {

        // fetching mouse position ever loop is a performance hag, instead, fetch mouse position from 
        // input singleton and interpolate positional data
        // sets Player Sprite Position to Mouse Position
        //this.pos = mousePos;

        // update cube 3d position
        //if (window.THREE_RENDER.cube) {
        this.cubePosition = window.THREE_RENDER.getCubePosition();

        // add gravity to cube
        if (this.cubePosition.y > this.groundLevel) {
            window.THREE_RENDER.setCubePosition(this.cubePosition.x, this.cubePosition.y -= 0.03, this.cubePosition.z);
        }

    }



}


class Networking {

    /* 
    Should Handle All Multiplayer Logic 
    alongside simulation and utils singleton classes
    
    */
}



class Items extends GameObject {
    /**
     * 
     * All Player Interactible Objects
     * They increase the player's inventory count per item and only collide with
     * Player objects' collission
     * 
     * @param {*} item 
     * @returns 
     */
    constructor(item) {
        if (item == "Generic Item") {
            // Should Increase Player Speed

            return 0;
        }
        if (item == "Bomb") {
            // Should Instance A Bomb sprite with Animations

            return 0;
        }

        if (item == "Health Potion") {
            // Should Increase Players Health

            return 0;
        }
        if (item == "Magic Potion") {
            // Should Increase Player Magic Meter

            return 0;
        }

        if (item == "Coin") {
            // Should Increase Player Coin Count

            return 0;
        }
    }
}

class ParticleFX extends GameObject {
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
    constructor(pos, size) {
        super();
        this.color = new Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        const trailEffect = new ParticleEmitter(
            pos, 0,                          // pos, angle
            size, 0, 80, PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(0, 16),                          // tileIndex, tileSize
            color__, color__,                         // colorStartA, colorStartB
            color__.scale(0), color__.scale(0),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, 0, 1        // fade, randomness, collide, additive
        );

        // play some sfx
        window.music.sound_start.play();
    }

}

/*
Globals Singleton

Features: 
(1) Holds All Global Variants in one scrupt
(2) Can Only Store Data, Cannot Manipulate Data



*/

class Globals {
    constructor() {

        // All Global Variables 

        this.health = 3;
        this.players = []; // internal array to hold all playe objects
        this.enemies = []; // internal global array to hold all enemy types
        this.scenes = {};// holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
        this.kill_count = 0; //enemy kill count
    }
}




class UI extends UIObject {
    /* 
    Game UI System
    
    Docs: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/uiSystem/game.js 

    To DO:
    (1) in-game menu
    (2) Controls Menu
    (3) Game HUD 
        -inventory ui
        -quest ui
        -mini-map ui
    (4) Dialogs Box
        -map dialogue text to dialog box boundaries
        
    (5) Heartbox
    (6) Should Play UI sounds from singleton class
    */

    constructor() {

        super();

        //initialise the UI Plugin system
        initUISystem();


        // sound effects
        const sound_ui = new Sound([1, 0]);

        // Create UI objects For All UI Scenes
        // set root to attach all ui elements to
        this.UI_ROOT = new UIObject();
        this.UI_MENU = new UIObject();
        this.UI_GAME_HUD = new UIObject(); // contains all game hud buttons
        this.UI_HEARTBOX = new UIObject();
        this.UI_STATS = new UIObject();
        this.UI_CONTROLS = new UIObject();
        //this.
        this.DIALOG_BOX = new UIObject(vec2(0, 0), vec2(200, 400));


        //parent & child
        this.UI_ROOT.addChild(this.UI_MENU);
        this.UI_ROOT.addChild(this.DIALOG_BOX);


        //center UI root
        this.UI_ROOT.pos.x = mainCanvasSize.x / 2;

        // example horizontal scrollbar
        //const scrollbar = new UIScrollbar(vec2(0, 60), vec2(350, 50));

        //this.UI_MENU.addChild(scrollbar);
        //can be used for title screen/ stroy intro
        const uiInfo = new UIText(vec2(0, 50), vec2(1e3, 70),
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed ultricies orci.\nAliquam tincidunt eros tempus');

        uiInfo.textColor = WHITE;
        uiInfo.lineWidth = 8;

        this.DIALOG_BOX.addChild(uiInfo);

        //hide dialog box temporarily
        // until dialog box ui has been fully setup
        this.DIALOG_BOX.visible = false;

        //hide game menu temporarily
        //trigger it with button click if there's no player instance
        this.UI_MENU.visible = false;

        // example background
        //const uiBackground = new UIObject(vec2(0, 0), vec2(450, 580));

        //this.UI_MENU.addChild(uiBackground);

        // Create Ingame Menu
        // 
        const newGame = new UIButton(vec2(0, 50), vec2(250, 50), 'New Game');
        const contGame = new UIButton(vec2(0, 120), vec2(250, 50), 'Continue');
        const Comics = new UIButton(vec2(0, 190), vec2(250, 50), 'Comics');
        const Controls = new UIButton(vec2(0, 260), vec2(250, 50), 'Controls');
        const Quit = new UIButton(vec2(0, 330), vec2(250, 50), 'Quit');

        // parent button objects        
        this.UI_MENU.addChild(newGame);
        this.UI_MENU.addChild(contGame);
        this.UI_MENU.addChild(Comics);
        this.UI_MENU.addChild(Controls);
        this.UI_MENU.addChild(Quit);

        // button signals

        newGame.onPress = () => {
            console.log('New Game Pressed');
            sound_ui.play();
            // (1) Instance player
            // (2) Hide Menu
            // (3) kill 3d cube
            this.UI_MENU.visible = false;

            //create global player object
            if (!window.player) {
                window.player = new Player();
            }

            //create template Enemy Object
            if (!window.enemy1) {
                window.enemy1 = new Enemy(vec2(5, 5), vec2(2, 2));

            }
            //delete title screen 3d screen
            //temporarily disabled
            if (window.THREE_RENDER.hasCube()) {
                //window.THREE_RENDER.deleteCube();
                window.THREE_RENDER.hideThreeLayer();
                //window.THREE_RENDER = null;

                //return 0;

            }
        }

        contGame.onPress = () => {
            console.log('Continue Pressed');
            sound_ui.play();
        }
        Comics.onPress = () => {
            // open comics website in new tab
            console.log('Comics Pressed');
            sound_ui.play();
            window.open('https://dystopia-app-manga.vercel.app/manga.html', '_blank');
        }
        Controls.onPress = () => {
            console.log('Controls Pressed');
            sound_ui.play();
        }

        Quit.onPress = () => {
            // (1) delete player
            // (2) show 3d layer
            console.log('Quit Pressed');
            sound_ui.play();

            window.THREE_RENDER.showThreeLayer()
        }

    }

    getMenuVisible() {
        return this.UI_MENU.visible
    };

    setMenuVisible(visible) {
        //external method to toggle menu visibility
        this.UI_MENU.visible = visible
    };



}

class Adsense {
    //Buggy:
    //(1) Content Security Violation Policies
    //(2) Doesn't work in serverless environments out the box
    //(3) CORS restrictions
    //(4) Ad Blockers

    constructor() {
        return 0;
    }

    loadAdSense() {

        const script = document.createElement('script');
        script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3900377589557710";
        script.crossOrigin = "anonymous";
        script.async = true;

        script.onload = () => {
            // Initialize AdSense after the script loads
            (adsbygoogle = window.adsbygoogle || []).push({});
            console.log("Loaded ads script :", window.adsbygoogle);
        };

        script.onerror = () => {
            console.error("AdSense script failed to load.");
        };
        document.cookie = "TESTCOOKIESENABLED=true; SameSite=None; Secure";
        document.head.appendChild(script);

    }
    /*
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3900377589557710"
        crossorigin="anonymous"></script>
    <!-- Dystopia App 1 -->
    <ins class="adsbygoogle" style="display:block; min-width:300px; min-height:250px;"
        data-ad-client="ca-pub-3900377589557710" data-ad-slot="3917381126" data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    <script>
        (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
    
    
    */



}

/* LittleJS Main Loop*/



function gameInit() {
    // called once after the engine starts up
    // setup the game
    console.log("Game Started!");

    // UI Setup
    window.ui = new UI();

    //Camera Distance Constants
    const CAMERA_DISTANCE = 16;

    /* Create 3D Scenes And Objects*/
    window.THREE_RENDER = new ThreeRender();


    /* Create Global Singletons & Run System Tests */


    window.inventory = new Inventory;
    window.globals = new Globals;

    window.music = new Music;

    // Play Music Loop WIth howler JS
    window.music.play_track(); //work

    //make global
    //window.music = music;

    window.input = new Inputs(); //Global Input Class extends gameObject



    // Add  Inventory Items
    window.inventory.set("apple", 5);
    window.inventory.set("banana", 3);


    //const TwoDCanvas = document.getElementById('littlejs-2d-layer')


    //Debug music fx
    //works


    //console.log("Music Debug 2: ", window.music.zelda_powerup);
    //console.log("Music Debug 2: ", window.music.current_track);

    //Initialise 3d scene render
    // (1) Create 2 Cubes

    // It can set 2 cubes but only animate 1 cuz of this.cube pointer limitations
    window.THREE_RENDER.Cube();
    //window.THREE_RENDER.Cube();



    //window.THREE_RENDER.addToScene(c1);
    // window.THREE_RENDER.addToScene(c2);
    window.THREE_RENDER.setCamera(CAMERA_DISTANCE);

    window.THREE_RENDER.animate();

    //Ads
    //buggy & performance hog
    //const ads = new Adsense();
    //ads.loadAdSense();
}

function gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state

}

function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render
    if (window.player) {

        // Track player
        // set camera position to player position
        setCameraPos(window.player.pos);
    }

}

function gameRender() {
    // triggers the LittleJS renderer
    // called before objects are rendered
    // draw any background effects that appear behind objects
    //const y = new glContext;

    //drawRect(cameraPos, vec2(100), new Color(.5, .5, .5)); // draw background
}



function gameRenderPost() {
    // depreciated in favor of UI class
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // draw to overlay canvas for hud rendering
    // docs: https://killedbyapixel.github.io/LittleJS/docs/Draw.html#.drawTile
    // docs 2 : https://github.com/KilledByAPixel/LittleJS/blob/e967368c21147235ad8d216243fea32b834bed58/FAQ.md#L9

    const heartbox1 = drawTile(vec2(5, 5), vec2(1), tile(-5, 32, 0, 0.5)); // draws a heartbox 32x32 sprite
    const heartbox2 = drawTile(vec2(4, 5), vec2(1), tile(-5, 32, 0, 0.5)); // draws a heartbox 32x32 sprite
    const heartbox3 = drawTile(vec2(3, 5), vec2(1), tile(-5, 32, 0, 0.5)); // draws a heartbox 32x32 sprite
}



// Startup LittleJS Engine
// I can pass in the tilemap and sprite sheet directly to the engine as arrays
// i can also convert tile data to json from tiled editor and parse that instead
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png']);


