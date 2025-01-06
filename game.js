"use strict";
/*

Main Game Logic

(1) Using LittleJS As A Module for 3d Logic, 2d rendering, 2d logic
(2) Using Threejs for 3d geometry rendering
(3) Using ZzFx for Sound Fx
(4) Using HowlerJS for Audio Playback

*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
//teplorarily disabling for ads testing -"use strict"
// TO DO: import only the modules you need for faster load time
var THREE = require("https://cdn.skypack.dev/three@0.133.0/build/three.module.js"); //'/node_modules/three/src/Three.js';
var GLTFLoader_js_1 = require("https://cdn.skypack.dev/three@0.133.0/examples/jsm/loaders/GLTFLoader.js");
var LittleJS = require("https://littlejs-static.vercel.app/js/littlejs.js");
var tile = LittleJS.tile, vec2 = LittleJS.vec2, hsl = LittleJS.hsl, drawTile = LittleJS.drawTile, Timer = LittleJS.Timer, timeDelta = LittleJS.timeDelta;
var howler_min_js_1 = require("https://cdn.jsdelivr.net/npm/howler@2.2.3/dist/howler.min.js"); // Ensure you have Howler installed and imported
// import module
// show the LittleJS splash screen
LittleJS.setShowSplashScreen(true);
// Show Game Pad on Mobile Devices
LittleJS.touchGamepadEnable = true;
'use strict';
var Music = /** @class */ (function () {
    function Music() {
        console.log("Creating Music Node");
        // Initialize the LittleJS Sound System
        this.ENABLE = true; // turning off music singleton for bandwidth saving
        this.lastPlayedTrack = null; // Variable for keeping track of the music shuffler & prevents repeating tracks
        this.sound_shoot = new LittleJS.Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        this.zelda_powerup = new LittleJS.Sound([1.5, , 214, .05, .19, .3, 1, .1, , , 167, .05, .09, , , , .11, .8, .15, .22]); // Powerup 9// Powerup 9
        // sound effects
        this.sound_start = new LittleJS.Sound([, 0, 500, , .04, .3, 1, 2, , , 570, .02, .02, , , , .04]);
        this.sound_break = new LittleJS.Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        this.sound_bounce = new LittleJS.Sound([, , 1e3, , .03, .02, 1, 2, , , 940, .03, , , , , .2, .6, , .06]);
        this.sound_mosquito_flys = new LittleJS.Sound([, , 269, .36, .01, .01, 2, 2.6, , 4, , , .07, , , , , .62]); // Random 30
        this.souund_mosquito_dies = new LittleJS.Sound([1.3, , 328, .03, .34, .02, 2, 1.3, , , -27, .14, , , .6, , .01, .54, .19]); // Random 31
        this.sound_zapp = new LittleJS.Sound([1.2, , 678, .19, .49, .02, 1, 4.1, -75, 9, -263, .43, , .3, 3, , .09, .66, .41, .06, 381]); // Random 24
        this.sound_call = new LittleJS.Sound([1.9, , 66, .05, .48, .009, , 3.1, -38, 20, , , .13, , .5, .7, .1, .58, .19, .14, -1495]); // Random 26
        this.sound_boing = new LittleJS.Sound([1.4, , 286, , .19, .009, , 2.7, , -9, 363, .33, , , 61, , .22, .96, .14, .18, -1176]); // Random 29
        this.sound_tv_static = new LittleJS.Sound([.7, , 187, .01, , .01, 4, 4.8, 2, 72, , , , .1, , , , , .41, , 102]); // Random 32
        this.sound_metal_gong = new LittleJS.Sound([.7, , 286, .08, , .46, 3, 3.9, , , -76, .57, , , 15, , .07, .65, .08, , 204]); // Random 33
        this.zelda = null;
        this.current_track = null; //"track placeholder";
        this.next_track = null;
        this.counter = 0;
        this.randomTrack = null;
        // Map sounds to different sound effects and play them via an enumerator/global script
        //required for a music shuffler
        this.sfx_playlist = new Map([
            [0, this.zelda_powerup],
        ]);
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
    Music.prototype.shuffle = function () {
        var _this = this;
        var track = this.default_playlist;
        // Filter out the last played track and pick a random one from the remaining tracks
        var availableTracks = this.default_playlist.filter(function (track) { return track !== _this.lastPlayedTrack; });
        this.randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
        // Log the selected track
        console.log("Selected Track: ", this.randomTrack, "/", this.counter);
    };
    Music.prototype.play_track = function () {
        if (this.ENABLE) {
            this.shuffle();
            var sound = new howler_min_js_1.Howl({
                src: [this.randomTrack],
                format: ['ogg'], // Specify the format(s) of your audio file
                volume: 0.5,
                autoplay: true, // Whether to autoplay (optional)
                loop: true, // Loop playback (optional)
                preload: true, // Preload the audio (default is true)
                onend: function () {
                    console.log("Finished Playing Music");
                    // play randomised track again
                    // should stop current track, delete the sound object and create a new one
                    //window.music.play_track();
                }
            });
            // Update the last played track
            this.lastPlayedTrack = this.randomTrack;
            sound.play();
            // counter for logging how many loops the Music singleton has player through
            this.counter += 1;
        }
        if (!this.ENABLE) {
            return 1;
        }
    };
    return Music;
}());
/*
Inventory Singleton


Functions
(1) Handles All Player Inventory
(2)

*/
var Inventory = /** @class */ (function () {
    function Inventory() {
        console.log("Loading Inventory Singleton");
        this.items = {};
    }
    /**
     * Add or update an item in the inventory.
     * If the quantity is less than or equal to zero, the item is removed.
     * @param itemName - The name of the item.
     * @param quantity - The quantity to add (can be negative for removal).
     */
    Inventory.prototype.set = function (itemName, quantity) {
        if (quantity <= 0) {
            delete this.items[itemName]; // Remove item if quantity is zero or less
        }
        else {
            this.items[itemName] = (this.items[itemName] || 0) + quantity;
        }
    };
    /**
     * Retrieve the quantity of an item.
     * @param itemName - The name of the item.
     * @returns The quantity of the item, or 0 if it doesn't exist.
     */
    Inventory.prototype.get = function (itemName) {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        return this.items[itemName] || 0;
    };
    /**
     * Check if an item exists in the inventory.
     * @param itemName - The name of the item.
     * @returns `true` if the item exists, otherwise `false`.
     */
    Inventory.prototype.has = function (itemName) {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        return itemName in this.items;
    };
    /**
     * Remove an item completely from the inventory.
     * @param itemName - The name of the item.
     */
    Inventory.prototype.remove = function (itemName) {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        delete this.items[itemName];
    };
    /**
     * Get a list of all items in the inventory.
     * @returns A copy of the inventory dictionary.
     */
    Inventory.prototype.getAllItems = function () {
        return __assign({}, this.items);
    };
    /**
     * Count the total number of unique items in the inventory.
     * @returns The number of unique items.
     */
    Inventory.prototype.getItemCount = function () {
        return Object.keys(this.items).length;
    };
    /**
     * Count the total quantity of all items in the inventory.
     * @returns The total quantity of all items.
     */
    Inventory.prototype.getTotalQuantity = function () {
        return Object.values(this.items).reduce(function (sum, quantity) { return sum + quantity; }, 0);
    };
    return Inventory;
}());
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
var ThreeRender = /** @class */ (function () {
    function ThreeRender() {
        //super();
        // create a global threejs object
        this.THREE = THREE;
        console.log("Three JS Debug 1: ", this.THREE);
        var _a = this.THREE, Scene = _a.Scene, PerspectiveCamera = _a.PerspectiveCamera, WebGLRenderer = _a.WebGLRenderer;
        // Initialize scene, camera, and renderer
        //make  scene and camera globally accessible
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        // Append the renderer's DOM element to your target layer
        var threejsLayer = document.getElementById("threejs-layer");
        if (threejsLayer) {
            threejsLayer.appendChild(this.renderer.domElement);
        }
        else {
            console.error("Three.js layer element not found.");
        }
        // A placeholder for the cube mesh
        this.cube = null;
    }
    ;
    ThreeRender.prototype.renderAnimation = function () {
        // class wide animation function
        this.renderer.render(this.scene, this.camera);
    };
    ThreeRender.prototype.renderStill = function () {
        // renders a still image with no animmation
        this.renderer.render(this.scene, this.camera);
    };
    ThreeRender.prototype.LoadModel = function () {
        var _this = this;
        /**
         * Loads A 3D Gltf model via script
         * Works
         */
        console.log("Loading 3d model");
        //const { GLTFLoader } = this.GLTF;
        var loader = new GLTFLoader_js_1.GLTFLoader;
        var DEBUG = false;
        loader.load('overworld_map.glb', function (gltf) {
            if (DEBUG) {
                console.log('Loaded GLTF:', gltf.scene);
                console.log("pointer debug: ", _this.cube);
                // Access and log key details
                console.log('Scene:', gltf.scene); // The root scene object
                console.log('Animations:', gltf.animations); // Animation clips
                console.log('Nodes:', gltf.scene.children); // All child nodes
                console.log('Materials:', gltf.scene.children.map(function (obj) { return obj.material; })); // Materials
                console.log('Meshes:', gltf.scene.children.filter(function (obj) { return obj.isMesh; })); // Meshes
            }
            _this.cube = gltf.scene; // save scene as global pointer
            _this.scene.add(gltf.scene); // Ensure 'this' is bound properly
        }, undefined, function (error) {
            console.error('error occurred loading the 3d model:', error);
        });
        console.log("Finished loading model", this.cube);
    };
    ThreeRender.prototype.Cube = function () {
        /**
        AN OPtimised way of drawing a Cube in Threejs using Webgl directly
        
         Features:
         (1)Fast Loading Of 3d geometry using Webgl directly and optimised

         To DO:
         (1) Add Positional Parameters CUbe Objects
        
        */
        console.log("Creating 3D Cube Object");
        // Load required Libraries from Global THreejs class
        var _a = this.THREE, BufferAttribute = _a.BufferAttribute, BufferGeometry = _a.BufferGeometry, MeshBasicMaterial = _a.MeshBasicMaterial, Mesh = _a.Mesh;
        // Geometry and wireframe
        //
        // Create a rotating cube
        //const geometry = new BoxGeometry();
        //optimization:
        //using buffer geometry instead of box geometry
        // Define BufferGeometry manually
        var geometry = new BufferGeometry();
        // Define the vertices of a cube (12 triangles, 36 vertices, 3 per face)
        var vertices = new Float32Array([
            // Front face
            -1, -1, 1, // Bottom left
            1, -1, 1, // Bottom right
            1, 1, 1, // Top right
            -1, 1, 1, // Top left
            // Back face
            -1, -1, -1, // Bottom left
            -1, 1, -1, // Top left
            1, 1, -1, // Top right
            1, -1, -1, // Bottom right
        ]);
        // Define the indices for the cube (triangles)
        var indices = [
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
        var normals = new Float32Array([
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
        var material = new MeshBasicMaterial({
            color: this.getRandomColor(),
            wireframe: false,
            transparent: false,
            opacity: 1.0,
        });
        // set mesh geometry and material
        this.cube = new Mesh(geometry, material);
        //return this.cube;
        this.scene.add(this.cube);
    };
    ThreeRender.prototype.getRandomColor = function () {
        return Math.random() * 0xffffff;
    };
    ThreeRender.prototype.setCubePosition = function (x, y, z) {
        // type parameters
        if (this.cube) {
            this.cube.position.set(x, y, z);
        }
        else {
            console.warn("Cube has not been created yet.");
        }
    };
    ThreeRender.prototype.hasCube = function () {
        // Exported safe function to check if there is a cube instance
        return !!this.cube;
    };
    ThreeRender.prototype.getCubePosition = function () {
        // sets a cube instance's 3d position
        if (this.cube) {
            return {
                x: this.cube.position.x,
                y: this.cube.position.y,
                z: this.cube.position.z,
            };
        }
        else {
            console.warn("Cube has not been created yet.");
            return null;
        }
    };
    ThreeRender.prototype.deleteCube = function () {
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
        }
        else {
            console.warn("No cube to delete.");
        }
    };
    ThreeRender.prototype.hideThreeLayer = function () {
        //hides the threejs css render layer
        var layer = document.getElementById("threejs-layer");
        if (layer) {
            layer.style.visibility = "hidden";
        }
    };
    ThreeRender.prototype.showThreeLayer = function () {
        //shows the threejs css render layer
        var layer = document.getElementById("threejs-layer");
        if (layer) {
            layer.style.visibility = "visible";
        }
    };
    ThreeRender.prototype.setCamera = function (Int_Distance) {
        // Sets the camera at a specific distance
        this.camera.position.z = Int_Distance;
    };
    ThreeRender.prototype.animate = function () {
        var _this = this;
        /*
        
        Custom 3Js animation method

        TO DO:
        (1) Add Animation parameters (Done) Animation is done via a simulation class
        (2) Add Keyframe object
        (3) Expand functionalite
            -Horizontal loop
            -Vertical Loop
            -Vertical Loop Until

        
        */
        // Bind `this` to preserve context in animation loop
        var animate = function () {
            requestAnimationFrame(animate);
            // Rotate the cube
            if (_this.cube) {
                //this.cube.rotation.x += 0.01;
                _this.cube.rotation.y += 0.006; // temporarily disabling x-axis animation for 3d scene
            }
            // Render the scene
            _this.renderer.render(_this.scene, _this.camera);
        };
        animate();
    };
    return ThreeRender;
}());
var Utils = /** @class */ (function () {
    function Utils() {
    }
    /*
    
    Utils.js
    
    Features:
    (1)  Contains All Game Math Logic in One Script
    (2) Extends Static Functions to Other Scenes For Handing Maths, and Logical Caculations asides Simulation Logic
    */
    Utils.prototype.enemyMob = function () {
        //enemy mob logic in pure javascript
        return 0;
    };
    Utils.prototype.enemyPathFinding = function () {
        return 0;
    };
    Utils.prototype.detectBrowser = function () {
        var userAgent = navigator.userAgent.toLowerCase();
        var browser = 'unknown';
        var platform = 'unknown';
        // Detect browser
        if (userAgent.includes('chrome')) {
            browser = 'Chrome';
        }
        else if (userAgent.includes('firefox')) {
            browser = 'Firefox';
        }
        else if (userAgent.includes('safari')) {
            browser = 'Safari';
        }
        else if (userAgent.includes('edge')) {
            browser = 'Edge';
        }
        else if (userAgent.includes('opera') || userAgent.includes('opr')) {
            browser = 'Opera';
        }
        // Detect platform
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
            platform = 'Mobile';
        }
        else {
            platform = 'Desktop';
        }
        console.log("Browser: ".concat(browser, ", Platform: ").concat(platform));
        return { browser: browser, platform: platform };
    };
    return Utils;
}());
var GameObject = /** @class */ (function (_super) {
    __extends(GameObject, _super);
    // Base Class for All Game Objects
    function GameObject() {
        var _this = _super.call(this) || this;
        console.log("Loading Utils Singleton");
        return _this;
    }
    GameObject.prototype.destroy = function () {
        //this.destroy();
        // Logic for general object destruction
        console.log("GameObject destroyed");
    };
    return GameObject;
}(LittleJS.EngineObject));
var Inputs = /** @class */ (function (_super) {
    __extends(Inputs, _super);
    function Inputs() {
        var _this = _super.call(this) || this;
        _this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        // Input Buffer
        _this.input_buffer = [];
        //Input State Machine Enumeration
        _this.input_state = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
            ['ATTACK', 4],
            ['ROLL', 5],
        ]);
        _this.WALKING = 0.06;
        return _this;
        // Testing Input Enumeration
        //console.log("Input Debug 1: ", this.input_state.get("UP"));
        //console.log("Input Debug 2: ",input_state.get("ATTACK");
    }
    // Returns The Input Buffer as An Array
    Inputs.prototype.get_Buffer = function () {
        return this.input_buffer;
    };
    Inputs.prototype.update = function () {
        // mouse and TouchScreen Input
        //this.pos = mousePos;
        // Maps Key Presses To Input States And Appends Them to The input buffer
        //
        // Move UP
        //console.log("Testing Input Singleton");
        if (LittleJS.keyIsDown('ArrowUp')) {
            this.up();
        }
        // Move Down
        if (LittleJS.keyIsDown('ArrowDown')) {
            this.down();
        }
        // Move Left
        if (LittleJS.keyIsDown('ArrowLeft')) {
            this.left();
        }
        // Move Right
        if (LittleJS.keyIsDown('ArrowRight')) {
            this.right();
        }
        // Attack
        if (LittleJS.keyIsDown('KeyX')) {
            this.attack();
        }
        // Dash
        if (LittleJS.keyIsDown('Space')) {
            console.log("Space pressed, Player Dash");
        }
        // Debug Input Buffer
        if (LittleJS.keyWasPressed('KeyL')) {
            console.log("key L as pressed! ");
            console.log("Input Buffer: ", this.get_Buffer());
        }
        // Inventory Debug
        if (LittleJS.keyWasPressed('KeyI') && window.inventory) {
            //Debug Inventory
            // TO DO :
            // (1) Inventory UI
            console.log("key I was pressed: ", window.inventory.getAllItems());
        }
        // show/hide menu
        if (LittleJS.keyWasPressed('Enter') && window.ui) {
            var menuVisible = window.ui.MenuVisible;
            console.log("Escape was Pressed, Menu toggle: ", menuVisible);
            window.ui.MenuVisible = !menuVisible;
        }
        //show / hide dialogue
        if (LittleJS.keyWasPressed('KeyE') && window.ui) {
            var diagVisible = window.ui.DialogVisible;
            console.log("Key E was Pressed, Dialog toggle: ", diagVisible);
            window.ui.DialogVisible = !diagVisible;
            // Run a 3-second timer
            // To DO :
            // (1) Use GLobal Input Timer as 
            //new Timer(3, () => {
            //    window.ui.DialogVisible = false;
            //   console.log("Dialog hidden after 3 seconds.");
            //});
        }
        // show / hide dialogue box
        // show / hide menu with mouse input once game hasnt started
        if (!(window.player) && window.ui && LittleJS.mouseWasPressed(0) && !window.globals.GAME_START) {
            var menuVisible2 = window.ui.MenuVisible;
            console.log("Mouse was Pressed, Menu toggle: ", menuVisible2);
            window.ui.MenuVisible = !menuVisible2;
        }
        // GamePad Input
        var stk = LittleJS.gamepadStick(0, 0); // capture gamestik
        if (stk.x < 0) {
            // move left
            this.left();
        }
        if (stk.x > 0) {
            // move right
            this.right();
        }
        if (stk.y < 0) {
            // move down
            this.down();
        }
        if (stk.y > 0) {
            // move up
            this.up();
        }
        if (LittleJS.gamepadIsDown(1)) {
            console.log("Game Pad Was Pressed, Test Successfull: ");
            //return 0;
            this.dash();
        }
        if (LittleJS.gamepadIsDown(2)) {
            console.log("Game Pad Was Pressed, Test Successfull 2");
            this.attack();
        }
        if (LittleJS.gamepadIsDown(3)) {
            console.log("Game Pad Was Pressed, Test Successfull 3");
            return 0;
        }
        if (LittleJS.gamepadIsDown(0)) {
            console.log("Game Pad Was Pressed, Test Successfull 4");
            return 0;
        }
        // Prevents Buffer/ Mem Overflow for Input Buffer
        if (this.input_buffer.length > 12) {
            this.input_buffer.length = 0; // Clears the array
        }
        //this.pos.scale(timeDelta);//hmm
    };
    Inputs.prototype.attack = function () {
        var _a;
        // Attack State
        // for debug purposes only
        console.log(" Attack Pressed");
        //update input buffer
        this.input_buffer.push((_a = this.input_state.get("ATTACK")) !== null && _a !== void 0 ? _a : 4);
        // update current state
        this.state = this.input_state.get("ATTACK");
    };
    Inputs.prototype.dash = function () {
        // dash state
        console.log(" Dash Pressed");
    };
    Inputs.prototype.up = function () {
        //console.log("key W as pressed! ");
        var _a;
        // update input buffer
        this.input_buffer.push((_a = this.input_state.get("UP")) !== null && _a !== void 0 ? _a : 0);
        // update current state
        this.state = this.input_state.get("UP");
        // move up
        this.pos.y += this.WALKING;
        //console.log("Position debug 1: ", this.pos.x);
    };
    Inputs.prototype.down = function () {
        //console.log("key S as pressed! ");
        var _a;
        // update input buffer
        this.input_buffer.push((_a = this.input_state.get("DOWN")) !== null && _a !== void 0 ? _a : 1);
        // update current state
        this.state = this.input_state.get("DOWN");
        // move down
        this.pos.y -= this.WALKING;
    };
    Inputs.prototype.right = function () {
        //move right
        //console.log("key D as pressed! ");
        var _a;
        //update input buffer
        this.input_buffer.push((_a = this.input_state.get("RIGHT")) !== null && _a !== void 0 ? _a : 3);
        // update current state
        this.state = this.input_state.get("RIGHT");
        // move right
        this.pos.x += this.WALKING;
    };
    Inputs.prototype.left = function () {
        // move left
        //console.log("key A as pressed! ");
        var _a;
        //update input buffer
        this.input_buffer.push((_a = this.input_state.get("LEFT")) !== null && _a !== void 0 ? _a : 2);
        // update current state
        this.state = this.input_state.get("LEFT");
        // move left
        this.pos.x -= this.WALKING;
    };
    return Inputs;
}(GameObject));
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player() {
        var _this = _super.call(this) || this;
        /*
        PLAYER CLASS
        
        Features:
        (1) Base Class for all plyer types, 3d, platformer, and top down
    
    
        You can use the isOverlapping function to check the object against the camera. For culling you maybe want to enlarge th…
        if (!isOverlapping(this.pos, this.size, cameraPos, renderWindowSize))
        */
        // Constants
        _this.WALK_SPEED = 500; // pixels per second
        _this.ROLL_SPEED = 1000; // pixels per second
        _this.GRAVITY = 0; // For Platforming Levels
        _this.ATTACK = 1; // For Item Equip
        _this.pushback = 5000;
        _this.linear_vel = LittleJS.vec2(0, 0);
        _this.roll_direction = LittleJS.vec2(0, 1);
        _this.StateBuffer = [];
        _this.item_equip = ""; // Unused Item Equip Variant
        _this.blood = null;
        _this.despawn_particles = null;
        _this.die_sfx = null;
        _this.hurt_sfx = null;
        _this.music_singleton_ = null;
        // Player attributes
        _this.mass = _this.GRAVITY;
        console.log("Creating Player Sprite");
        // Fetch Player Health From Globals Singleton
        // Update Globals With Player Pointer
        _this.input = window.input; // global input singleton
        // create a pointer to the Particle fx class
        // store player object in global array
        window.globals.players.push(_this);
        //this.color = randColor();//RED; // make random colour
        // Player Logic Variables 
        _this.WALK_SPEED = 500; // pixels per second 
        _this.ROLL_SPEED = 1000; // pixels per second
        _this.GRAVITY = 0; // For Platforming Levels
        _this.ATTACK = 1; // For Item Equip
        _this.hitpoints = window.globals.health; // global hp singleton 
        _this.pushback = 5000;
        _this.linear_vel = LittleJS.vec2(0, 0);
        _this.roll_direction = LittleJS.vec2(0, 1); //Vector2.DOWN
        _this.StateBuffer = [];
        _this.item_equip = ""; //Unused Item Equip Variant
        // player signal class
        // signal class implementation is buggy
        //this.health_signal = //new Signal();
        // player GUI
        _this.local_heart_box = window.ui.HEART_BOX; // Pointer To Heart Box HUD from the UI Class
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
        //if (!this.local_heart_box) {
        // connect health changed method to global class signal
        //this.health_signal.connect(health_changed);
        //this.health_signal.connect(healthDebug);
        //}
        // Set initial player health
        health_changed(_this.hitpoints);
        // player state machine
        _this.state_machine = new Map([
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
        _this.facing_state_machine = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
        ]);
        // set initial player's default state
        _this.state = _this.state_machine.get("STATE_IDLE");
        _this.facing = _this.facing_state_machine.get("DOWN");
        //TO DO: player's camera pointer (1) Camer should follow/ track the player's position
        //TO DO: player's animation node pointer
        //disconnect extra signal
        //this.health_signal.disconnect(healthDebug);
        //PLAYER'S PARTICLE AND SOUND FX POINTERS
        _this.blood = null;
        _this.despawn_particles = null;
        _this.die_sfx = null;
        _this.hurt_sfx = null;
        // Music Singleton Pointer
        // this would be kinda drepreciated as each Zzfx can play its own sould 
        // this not needing the music singleton pointer to actually play sfx
        _this.music_singleton_ = null;
        // player collision & mass
        _this.mass = _this.GRAVITY; // make object have static physics
        // player sprite
        // use tileInfo frame function to play animations
        _this.tileInfo = tile(0, 32, 1, 0); // set player's sprite from tile info
        return _this;
        //this.color = new Color(1, 0, 0, 0); // transparent white
    }
    Player.prototype.hurt = function () {
        //use a timer to flash the player object colour from orig  -> white -> orig
        //(1) Play Hurt Animation
        //(2) Trigger kickback
        //(3) Update Player health
        this.hitpoints -= 1;
        console.log("Player hit: ", this.hitpoints);
    };
    Player.prototype.update = function () {
        if (this.input) {
            // for debugging
            // update sprite position to input singleton position
            this.pos = this.input.pos; //mousePos; //player movement logic, should ideally lerp btw 2 positions
            //-this.pos.scale(timeDelta);//hmm
        }
        // player hit collision detection
        // detects collision between any enemy in the global enemies pool
        for (var i = 0; i < window.globals.enemies.length; i++) {
            if (LittleJS.isOverlapping(this.pos, this.size, window.globals.enemies[i].pos, window.globals.enemies[i].size) && this.input.state == 4) { // if hit collission and attack state
                console.log("Player Hit Collision Detection Triggered");
                // Attack
                // reduce enemy health
                window.globals.enemies[i].hitpoints -= 1;
                window.globals.enemies[i].kickback();
                //hit register
                //sfx
                window.music.sound_metal_gong.play();
            }
        }
    };
    Player.prototype.despawn = function () {
        // (1) Play Despawn Animation
        if (this.hitpoints <= 0) {
            // delete player object
            this.destroy();
            // set the global player to null
            window.player = null;
        }
    };
    Player.prototype.respawn = function () {
        return 0;
    };
    Player.prototype.shake = function () {
        // shaky cam fx
        return 0;
    };
    return Player;
}(GameObject));
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(pos) {
        var _this = _super.call(this) || this;
        //(1) set the Enemy object's position
        //(2) set the Enemy object's type which determines the logic
        //this.color = RED; // make red colour
        _this.tileInfo = tile(0, 32, 2, 0); // set player's sprite from tile info
        // set enemy position from the initialisation script
        _this.pos = pos;
        // store object to global pointer for object pooling
        window.globals.enemies.push(_this);
        _this.hitpoints = 1; //set a default enemy hp
        // store player object in global array
        //window.globals.enemies.push(this);
        // Enemy Type Enum
        _this.enemy_type = new Map([
            ['EASY', 0],
            ['INTERMEDIATE', 1],
            ['HARD', 2]
        ]);
        // Match Frame Rate to Both Enemy TIme And Engine FPS
        _this.IDIOT_FRAME_RATE = 60;
        _this.SLOW_FRAME_RATE = 30;
        _this.AVERAGE_FRAME_RATE = 15;
        _this.FAST_FRAME_RATE = 5;
        //Input State Machine Enumeration
        _this.state_machine = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
            ['ATTACK', 4],
            ['ROLL', 5],
            ['MOB', 6],
        ]);
        // Enemy Movement Logic
        //this.velocity = vec2(0, 0); // default temp velocity
        // Testing Enemy Type Enumeration
        console.log("Input Debug 1: ", _this.enemy_type.get("EASY"));
        // Enemy collision & mass
        //this.setCollision(true, true); // make object collide
        //this.mass = 0; // make object have static physics
        //enemy AI variables
        _this.speed = 1.5; // Movement speed
        //this.size = 20; // Enemy size for collision
        _this.detectionRange = 200; // Range to detect the player
        _this.minDistance = 30; // Minimum distance from player to stop following
        _this.targetPos = vec2(0, 0); // Random wandering target
        _this.wanderCooldown = 0; // Time before choosing a new wandering target
        // blood fx
        //this.blood_fx = null
        // Timer to destroy the ParticleFX object after 5 seconds
        _this.despawn_timer = new Timer; // creates a timer that is not set
        return _this;
    }
    Enemy.prototype.update = function () {
        if (window.player) {
            // enemy AI
            //calculate enemy distance to player
            var dx = window.player.pos.x - this.pos.x;
            var dy = window.player.pos.y - this.pos.y;
            var distanceToPlayer = Math.sqrt(dx * dx + dy * dy);
            var MOB = true;
            if (MOB) {
                // Follow the player
                // Follow the player
                //console.log("following the player");
                this.pos.x += (dx / distanceToPlayer) * this.speed * timeDelta;
                this.pos.y += (dy / distanceToPlayer) * this.speed * timeDelta;
            }
            // Enemy hit collision detection
            if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                //console.log("ENemy Hit Collision Detection Triggered: ", distanceToPlayer);
                // this.hitpoints -= 1;
                //this.pos = window.player.pos
                // TO DO: 
                // (1) Trigger Kickback Logic
                // (2) Add Raycast for detection
            }
        }
        // Despawn logic
        if (this.hitpoints <= 0) {
            this.despawn(); // trigger despawn timer
        }
        // exit tree
        // if (this.despawn_timer.elapsed() && this.hitpoints <= 0) {
        //this.blood_fx.destroy();
        // destroy block when hitpoints is at zero or less and despawn animation finished playing
        /////    this.destroy();
        //}
    };
    Enemy.prototype._get_player = function () {
        //(1) Gets the Player Object in the Scene Tree if Player unavailable, get him from the global pointer 
        return 0;
    };
    Enemy.prototype.kickback = function () {
        return 0;
    };
    Enemy.prototype.despawn = function () {
        // The Enemy Despawn animation
        console.log("Destroying Enemy");
        //create particle fx
        //let blood_fx = new ParticleFX(this.pos, this.size);
        this.despawn_timer.set(3);
        // remove object from global object pool
        // remove object from global array
        var index = window.globals.enemies.indexOf(this);
        if (index !== -1) {
            window.globals.enemies.splice(index, 1);
        }
        //blood_fx.destroy();
        this.destroy();
    };
    Enemy.prototype._on_enemy_eyesight_body_entered = function () {
        // player detection with a raycast
        return 0;
    };
    Enemy.prototype._on_enemy_eyesight_body_exited = function () {
        // player leaves enemy detection raycast
        return 0;
    };
    return Enemy;
}(GameObject));
var EnemySpawner = /** @class */ (function (_super) {
    __extends(EnemySpawner, _super);
    //spawn an enemy count at specific posisitons
    function EnemySpawner() {
        var _this = _super.call(this) || this;
        console.log("Enemy Spawner Instanced");
        _this.ENABLE = true;
        _this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        _this.COUNTER = 0; // counter for calculatin how much enemies been spawned
        return _this;
    }
    EnemySpawner.prototype.update = function () {
        // spawn 2 new enemies if the enemy pool is 0
        if (window.globals.enemies.length < 1 && this.ENABLE) {
            var enemy1 = new Enemy(vec2(5, 10));
            this.COUNTER += 1;
            return;
        }
        // stop spawning if enemy spawn count is 15
        if (window.globals.enemies.length == 15) {
            this.ENABLE = false;
        }
    };
    return EnemySpawner;
}(GameObject));
var Simulation = /** @class */ (function (_super) {
    __extends(Simulation, _super);
    function Simulation() {
        var _this = _super.call(this) || this;
        console.log("Simulation Singleton Created");
        //this.cubePosition = null; // for storing the cube geometry 3d position 
        _this.groundLevel = -4; // ground position for stopping Gravity on Cube 
        _this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        _this.timer = new Timer(); //timer necessary for running the simulation timer loop
        return _this;
        //return 0;
    }
    ;
    Simulation.prototype.update = function () {
        // fetching mouse position ever loop is a performance hag, instead, fetch mouse position from 
        // input singleton and interpolate positional data
        // sets Player Sprite Position to Mouse Position
        //this.pos = mousePos;
        // update cube 3d position
        //if (window.THREE_RENDER.cube) {
        this.cubePosition = window.THREE_RENDER.getCubePosition();
        if (this.cubePosition) {
            // add gravity to cube
            if (this.cubePosition.y > this.groundLevel) {
                window.THREE_RENDER.setCubePosition(this.cubePosition.x, this.cubePosition.y -= 0.03, this.cubePosition.z);
            }
            // hide threejs layer once game starts
            if (this.cubePosition.y < this.groundLevel) {
                window.THREE_RENDER.hideThreeLayer();
                // save to global conditional for rendering game backgrounds and starting core game loop
                window.globals.GAME_START = true;
            }
        }
    };
    return Simulation;
}(GameObject));
var Networking = /** @class */ (function () {
    function Networking() {
    }
    return Networking;
}());
var Items = /** @class */ (function (_super) {
    __extends(Items, _super);
    /**
     * All Player Interactable Objects.
     * They increase the player's inventory count per item and only collide with
     * Player objects' collision.
     *
     * @param item The type of item to create.
     */
    function Items(item) {
        var _this = _super.call(this) || this; // Call the parent class constructor.
        switch (item) {
            case "Generic Item":
                // Logic to increase player speed.
                console.log("Generic Item picked up: Increase player speed.");
                break;
            case "Bomb":
                // Logic to instantiate a bomb sprite with animations.
                console.log("Bomb picked up: Instance a bomb sprite with animations.");
                break;
            case "Health Potion":
                // Logic to increase player's health.
                console.log("Health Potion picked up: Increase player health.");
                break;
            case "Magic Potion":
                // Logic to increase player's magic meter.
                console.log("Magic Potion picked up: Increase player magic meter.");
                break;
            case "Coin":
                // Logic to increase player's coin count.
                console.log("Coin picked up: Increase player coin count.");
                break;
            default:
                console.log("Unknown item type.");
        }
        return _this;
    }
    return Items;
}(GameObject));
var ParticleFX = /** @class */ (function (_super) {
    __extends(ParticleFX, _super);
    function ParticleFX(pos, size) {
        var _this = _super.call(this) || this;
        _this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        var color__ = hsl(0, 0, .2);
        _this.trailEffect = new LittleJS.ParticleEmitter(pos, 0, // pos, angle
        size, 0, 80, LittleJS.PI, // emitSize, emitTime, emitRate, emiteCone
        tile(0, 16), // tileIndex, tileSize
        color__, color__, // colorStartA, colorStartB
        color__.scale(0), color__.scale(0), // colorEndA, colorEndB
        2, .4, 1, .001, .05, // time, sizeStart, sizeEnd, speed, angleSpeed
        .99, .95, 0, LittleJS.PI, // damp, angleDamp, gravity, cone
        .1, .5, 0, 1 // fade, randomness, collide, additive
        );
        return _this;
    }
    return ParticleFX;
}(LittleJS.EngineObject));
/*
Globals Singleton

Features:
(1) Holds All Global Variants in one scrupt
(2) Can Only Store Data, Cannot Manipulate Data



*/
var Globals = /** @class */ (function () {
    function Globals() {
        // All Global Variables 
        this.health = 3;
        this.players = []; // internal array to hold all playe objects
        this.enemies = []; // internal global array to hold all enemy types
        this.scenes = {}; // holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
        this.kill_count = 0; //enemy kill count
        this.GAME_START = false; // for triggering the main game loop logic in other scenes
    }
    return Globals;
}());
var UI = /** @class */ (function (_super) {
    __extends(UI, _super);
    function UI() {
        var _this = _super.call(this) || this;
        //initialise the UI Plugin system
        LittleJS.initUISystem();
        // Create UI objects For All UI Scenes
        // set root to attach all ui elements to
        _this.UI_ROOT = new LittleJS.UIObject();
        _this.UI_MENU = new LittleJS.UIObject();
        _this.UI_GAME_HUD = new LittleJS.UIObject(); // contains all game hud buttons
        //this.UI_HEARTBOX = [this.UI_HEART_1]
        //this.UI_HEARTBOX.addChild(this.UI_HEART_1);
        //this.UI_HEARTBOX.addChild(this.UI_HEART_2);
        //this.UI_HEARTBOX.addChild(this.UI_HEART_3);
        //this.UI_HEARTBOX.visible = true;
        _this.HEART_BOX = null; //created with the heartbox function
        _this.UI_STATS = new LittleJS.UIObject();
        _this.UI_CONTROLS = new LittleJS.UIObject();
        //this.
        _this.DIALOG_BOX = new LittleJS.UIObject(vec2(0, 0), vec2(200, 400));
        //parent & child
        _this.UI_ROOT.addChild(_this.UI_MENU);
        _this.UI_ROOT.addChild(_this.DIALOG_BOX);
        //this.UI_ROOT.addChild(this.UI_HEARTBOX);
        //center UI root
        _this.UI_ROOT.pos.x = LittleJS.mainCanvasSize.x / 2;
        // example horizontal scrollbar
        //const scrollbar = new UIScrollbar(vec2(0, 60), vec2(350, 50));
        //this.UI_MENU.addChild(scrollbar);
        //can be used for title screen/ stroy intro
        var uiInfo = new LittleJS.UIText(vec2(0, 50), vec2(1e3, 70), 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sed ultricies orci.\nAliquam tincidunt eros tempus');
        uiInfo.textColor = LittleJS.WHITE;
        uiInfo.lineWidth = 8;
        _this.DIALOG_BOX.addChild(uiInfo);
        //hide dialog box temporarily
        // until dialog box ui has been fully setup
        _this.DIALOG_BOX.visible = false;
        //hide game menu temporarily
        //trigger it with button click if there's no player instance
        _this.UI_MENU.visible = false;
        // example background
        //const uiBackground = new UIObject(vec2(0, 0), vec2(450, 580));
        //this.UI_MENU.addChild(uiBackground);
        // Create Ingame Menu
        // 
        var newGame = new LittleJS.UIButton(vec2(0, 50), vec2(250, 50), 'New Game');
        var contGame = new LittleJS.UIButton(vec2(0, 120), vec2(250, 50), 'Continue');
        var Comics = new LittleJS.UIButton(vec2(0, 190), vec2(250, 50), 'Comics');
        var Controls = new LittleJS.UIButton(vec2(0, 260), vec2(250, 50), 'Controls');
        var Quit = new LittleJS.UIButton(vec2(0, 330), vec2(250, 50), 'Quit');
        // parent button objects        
        _this.UI_MENU.addChild(newGame);
        _this.UI_MENU.addChild(contGame);
        _this.UI_MENU.addChild(Comics);
        _this.UI_MENU.addChild(Controls);
        _this.UI_MENU.addChild(Quit);
        // button signals
        newGame.onPress = function () {
            console.log('New Game Pressed');
            window.music.sound_start.play();
            //this.UI_MENU.visible = false;
            // turn menu invisible
            _this.UI_MENU.visible = false;
            // apply gravity to 3d model to trigger game start
            var anim = new Simulation();
        };
        contGame.onPress = function () {
            console.log('Continue Pressed');
            window.music.sound_start.play();
        };
        Comics.onPress = function () {
            // open comics website in new tab
            console.log('Comics Pressed');
            //this.sound_ui.play();
            window.open('https://dystopia-app-manga.vercel.app/manga.html', '_blank');
        };
        Controls.onPress = function () {
            console.log('Controls Pressed');
            window.music.sound_start.play();
        };
        Quit.onPress = function () {
            // (1) delete player
            // (2) show 3d layer
            console.log('Quit Pressed');
            window.music.sound_start.play();
            window.THREE_RENDER.showThreeLayer();
        };
        return _this;
    }
    Object.defineProperty(UI.prototype, "MenuVisible", {
        //external methods to toggle UI states as setter & getter functions
        get: function () {
            return this.UI_MENU.visible;
        },
        set: function (visible) {
            //window.music.sound_start.play(); // play sfx
            this.UI_MENU.visible = visible;
        },
        enumerable: false,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(UI.prototype, "DialogVisible", {
        get: function () {
            return this.DIALOG_BOX.visible;
        },
        set: function (visible) {
            this.DIALOG_BOX.visible = visible;
        },
        enumerable: false,
        configurable: true
    });
    UI.prototype.heartbox = function (heartCount) {
        /* Creates A HeartBox UI Object */
        this.HEART_BOX = []; // Reset or initialize the heartbox array
        for (var i = 0; i < heartCount; i++) {
            // Position each heartbox horizontally spaced by 50px, starting at x = 50
            var position = vec2(50 + i * 50, 30);
            // Create a new heartbox UI tile and add it to the HEART_BOX array
            var heartTile = LittleJS.UIObject.drawUITile(position, vec2(50, 50), tile(0, 32, 0, 0));
            this.HEART_BOX.push(heartTile);
        }
    };
    return UI;
}(LittleJS.UIObject));
var OverWorld = /** @class */ (function (_super) {
    __extends(OverWorld, _super);
    /*
        The Overworld Scene + Objects as children
    */
    function OverWorld() {
        var _this = _super.call(this) || this;
        // create temple object from tempple object layer png's using draw tile method
        var TEMPLE = drawTile(vec2(0, 0), vec2(17, 17), tile(3, 17)); // size : 896 * 720 for temple sprites
        console.log("Creating Temple sprite: ", TEMPLE);
        return _this;
    }
    return OverWorld;
}(GameObject));
/* LittleJS Main Loop*/
function gameInit() {
    // called once after the engine starts up
    // setup the game
    console.log("Game Started!");
    // UI Setup
    window.ui = new UI();
    //Camera Distance Constants
    var CAMERA_DISTANCE = 16;
    /* Create 3D Scenes And Objects*/
    window.THREE_RENDER = new ThreeRender();
    /* Create Global Singletons & Run System Tests */
    window.inventory = new Inventory;
    window.globals = new Globals;
    window.utils = new Utils;
    window.music = new Music;
    //get device browser type/ platform
    window.utils.detectBrowser();
    // Play Randomised Playlist With howler JS
    window.music.play_track(); //works, disabled to save bandwidth
    //make global
    //window.music = music;
    window.input = new Inputs(); //Global Input Class extends gameObject
    // Add  Inventory Items
    // to do : feed inventory globals to inventroy ui
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
    window.THREE_RENDER.LoadModel();
    //window.THREE_RENDER.Cube();
    //window.THREE_RENDER.addToScene(c1);
    // window.THREE_RENDER.addToScene(c2);
    window.THREE_RENDER.setCamera(CAMERA_DISTANCE);
    window.THREE_RENDER.animate();
    //Ads
    //buggy & performance hog
    //const ads = new Adsense();
    //ads.loadAdSense();
    //draw title screen
    // TO DO :
    // convert dystopia logo to a font file
    //drawTile(vec2(21, 5), vec2(4.5), tile(3, 128));
    //const title = drawUITile(vec2(150, 30), vec2(50, 50), tile(0, 32, 3, 0))
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
        LittleJS.setCameraPos(window.player.pos);
        LittleJS.setCameraScale(64); // zoom camera to 64 pixels per world unit
    }
}
function gameRender() {
    // triggers the LittleJS renderer
    // called before objects are rendered
    // draw any background effects that appear behind objects
    //const y = new glContext;
    //drawRect(cameraPos, vec2(100), new Color(.5, .5, .5)); // draw background
    //The third tile parameter constrols which tile object to draw
    //draw tile allows for better object scalling
    if (window.globals.GAME_START) {
        //turn menu invisible
        //window.ui.MenuVisible = false;
        // triggers srart of game loop from simulation singleton
        var TEMPLE_EXTERIOR = LittleJS.drawTile(vec2(0, 0), vec2(15, 15), tile(0, 64, 3, 0), LittleJS.WHITE);
        var TREE_1 = LittleJS.drawTile(vec2(13, 0), vec2(10, 10), tile(0, 64, 4, 0)); //64X64 pixels
        var TREE_2 = LittleJS.drawTile(vec2(13, 10), vec2(10, 10), tile(0, 64, 4, 0)); //64X64 pixels
        //create global player object
        if (!window.player) {
            window.player = new Player();
            //const overworld_ = new OverWorld();
        }
        //Spawn Enemy Object
        if (!window.enemyspawner) {
            window.enemyspawner = new EnemySpawner();
            //window.enemy2 = new Enemy(vec2(5, 10), vec2(2, 2));
            //window.enemy3 = new Enemy(vec2(5, 5), vec2(2, 2));
        }
    }
}
function gameRenderPost() {
    // depreciated in favor of UI class
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // draw to overlay canvas for hud rendering
    // docs: https://killedbyapixel.github.io/LittleJS/docs/Draw.html#.drawTile
    // docs 2 : https://github.com/KilledByAPixel/LittleJS/blob/e967368c21147235ad8d216243fea32b834bed58/FAQ.md#L9
    //
    // To DO: 
    // (1) Draw hud to overlay canvas/ offset it from the camera in world space, or use screen coords
    /**
        const heart1 = drawTile(
            vec2(5, 5),
            vec2(1),
            tile(-5, 32, 0, 0.2),
            RED,
            0,
            false
    
        ); // draws a heartbox 32x32 sprite
        const heart2 = drawTile(vec2(4, 5), vec2(1), tile(-5, 32, 0, 0.2)); // draws a heartbox 32x32 sprite
        const heart3 = drawTile(vec2(3, 5), vec2(1), tile(-5, 32, 0, 0.2)); // draws a heartbox 32x32 sprite
    
        const heartbox = [heart1, heart2, heart3];
    
        */
    //const heart4 = drawUITile(vec2(100, 100), vec2(50, 50), tile(0, 32, 0, 0));
    //draw heartbox ui
    window.ui.heartbox(window.globals.health);
}
// Startup LittleJS Engine
// I can pass in the tilemap and sprite sheet directly to the engine as arrays
// i can also convert tile data to json from tiled editor and parse that instead
LittleJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png', "player.png", "pj.png", "temple.png", "trees.png"]);
