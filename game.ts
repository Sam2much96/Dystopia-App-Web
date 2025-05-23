/*

Main Game Logic

(1) Using LittleJS As A Module for 3d Logic, 2d rendering, 2d logic
(2) Using Threejs for 3d geometry rendering
(3) Using ZzFx for Sound Fx
(4) Using HowlerJS for Audio Playback -depreciated
(5) Using ZzFxM for Music instead of howlerjs


Bugs

(1) Overworld load times on mobile browsers is long
(2) Buttons aren't interractive, add sfx
(3) Input is terrible on mobile browsers
*/

//teplorarily disabling for ads testing -"use strict"
// TO DO: import only the modules you need for faster load time



import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import * as LittleJS from 'littlejsengine';

//import { drawUITile, drawUIText, drawUIRect } from './uiSystem'; //depreciated

const { tile, vec2, hsl, drawTile, setFontDefault, drawTextOverlay, glCreateTexture,  WHITE, PI, EngineObject, Timer, Sound, timeDelta, Color, touchGamepadEnable, isTouchDevice, setTouchGamepadSize,setShowSplashScreen, setTouchGamepadEnable,// do not use pixelated rendering
setTouchGamepadAlpha,setTouchGamepadAnalog,setSoundVolume,setSoundEnable, vibrate,setCanvasPixelated, setTilesPixelated, setGravity,setCameraPos, setCameraScale, engineInit } = LittleJS;


//howler js is depreciated
//import { Howl } from 'howler'; // Ensure you have Howler installed and imported



//export * from './audio/zzfx.js'; // adjust the path as needed

import { zzfxM } from './audio/zzfxm';
import {zzfxP, zzfxX} from  "./audio/zzfx";

import { PeraWalletConnect } from "@perawallet/connect"; //pera wallet connection for signing transactions
import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils' // Algokit Utils
//import * as algosdk from "algosdk"; // AlgoSDK

//import * as tiled from "@kayahr/tiled";
import overMap from "./overworld.json";

//import { styleText } from 'util';


'use strict';


// import module

// show the LittleJS splash screen
setShowSplashScreen(true);


// Game Pad on Mobile Devices Settings
setTouchGamepadEnable(true);
setTouchGamepadSize(256);
setTouchGamepadAlpha(0.3);

// set dpad configuration on mobile browsers 
setTouchGamepadAnalog(false);

//Audio Control settings
// to do : map to a control ui / control class
setSoundVolume(0.3);
setSoundEnable(true);



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

    //public ENABLE: boolean; //depreciated


    public music_on : boolean = true;
    public sfx_on : boolean = true ;
    
    public volume : number = 99; // todo : (1) link to zzfxm audio context class 

    
    //music track variables
    public play_back_position : number | undefined;
    public track_length : number | undefined;

    public music_track : string = '';

    public lastPlayedTrack: string = "";
    
    // to do:
    // (1) track the new beats in Zzfxm tools
    public default_playlist: Record<number,string> =  {
            0:`./audio/songs/sanxion.js`,
            1:"./audio/songs/cuddly.js",
            2:"./audio/songs/depp.js",
            3:"./audio/songs/iamback.js"

    };
    
    // Zzfx synth sounds
    // define each of the required sfx and organise them into dictionaries
    public ui_sfx_1 : LittleJS.Sound = new Sound([.8,,325,.08,.24,.19,,2.7,-5,,224,.09,.06,,,,,.65,.17,,-806]);
    public ui_Sfx_2 = new Sound([.8,,325,.08,.24,.19,,2.7,-5,,224,.09,.06,,-1,,,.65,.17,,-806]);
    public ui_robot_sfx = new Sound([1.5,.8,270,,.1,,1,1.5,,,,,,,,.1,.01]);

    // to do: 
    // (1) create more sfx for each array object with Zzfx
    public comic_sfx : Array<string> | undefined;
    
    
    public ui_sfx : Record<number, LittleJS.Sound> = {
        0: this.ui_sfx_1,
        1: this.ui_Sfx_2,
        2: this.ui_robot_sfx
    };

    
    public blood_sfx : Array<string> | undefined;
    
    
    public punch_Sfx = new Sound([2.8,,389,.03,.01,.21,1,2.6,,,,,,1.7,,.2,,.85,.09,,-1977]); 
    public punch_sfx_2 = new Sound([2,,166,.02,.01,.19,4,2.8,8,10,,,,1.5,7,.2,.1,.45,.08]);
    public punch_sfx_3 = new Sound([1.1,,231,.01,.04,.13,4,3.5,,,,,,1.8,8.9,.2,,.56,.05]); 


    public hit_sfx : Record <number, LittleJS.Sound> = {
        0 : this.punch_Sfx,
        1 : this.punch_sfx_2,
        2 : this.punch_sfx_3
    };
    
    public grass_sfx : Array<string> | undefined;


    public wind_fx = new Sound([,,174,.43,.48,.01,4,4.3,-92,57,,,,,36,,,.91,.43,.13]);

    public wind_sfx : Array<string> | undefined;
    public sword_sfx : Array<string> | undefined;
    public nokia_pack_sfx : Array<string> | undefined;
    

    // class debug variable for mobile browser debug
    

    // track debug variables 
    public stream : AudioBufferSourceNode | undefined;
    public stream_length : number = 0;
    public Playback_position : number = 0;
    public track : string = "";
    public buffer : number[][] | undefined;

    // sound fx placeholder
    private Fx : Record<number, string> = {
        0: "AMPLIFY",
        1: "BAND_LIMIT_FILTER"
    }



    // to do:
    // (1) sort sfx variabes into dictionaries
    sound_shoot: LittleJS.Sound;
    zelda_powerup: LittleJS.Sound;
    sound_start: LittleJS.Sound;
    sound_break: LittleJS.Sound;
    sound_bounce: LittleJS.Sound;
    sound_mosquito_flys: LittleJS.Sound;
    souund_mosquito_dies: LittleJS.Sound;
    sound_zapp: LittleJS.Sound;
    sound_call: LittleJS.Sound;
    sound_boing: LittleJS.Sound;
    sound_tv_static: LittleJS.Sound;
    sound_metal_gong: LittleJS.Sound;
    zelda: LittleJS.Sound | null;
    current_track: string | null;
    next_track: string | null;
    counter: number;
    randomTrack: string;
    sfx_playlist: Map<number, LittleJS.Sound>;
    

  

    constructor() {

        console.log("Music on Settings: ", this.music_on );

        
        // Initialize the LittleJS Sound System

        //this.ENABLE = false; // turning off music singleton for bandwidth saving
        this.lastPlayedTrack = ""; // Variable for keeping track of the music shuffler & prevents repeating tracks
        this.sound_shoot = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);

      
        //drum
        const drum = new Sound([,,129,.01,,.15,,,,,,,,5]); // Loaded Sound 68

        this.zelda_powerup = new Sound([1.5,0,214,.05,.19,.3,3,.1,,,150,.05,.09,,,,.11,.8,.15,.22]); // Powerup 9// Powerup 9

        const extra_heart = new Sound([,,537,.02,.02,.22,1,1.59,-6.98,4.97]); // Loaded Sound 66


        const dash_sfx = new Sound([1.5,0,214,.05,.19,.3,3,.1,,,150,.05,.09,,-1,,.11,.8,.15,.22]);
        const dash_2_sfx = new Sound([,,63,.04,.19,.58,,3.9,-2,-8,,,.23,.6,,.2,,.37,.18,.27]); 
        const dash_3 = new Sound([1.4,,420,.19,.01,.21,2,.3,,,314,.18,,,7.8,,.05,.67,.01]); // Random 60
        
        

        const dungeon_sfx_1 = new Sound([.5,,103,.21,.27,.27,3,.6,,,-6,.2,,,31,,,.61,.01,,-1477]);

        const disco = new Sound([,,361,.08,.19,.3,2,2.1,3,,-120,.1,,,102,,,.72,.05]);
        const disco_2 = new Sound([.4,,39,.44,.1,.15,2,1.8,,-54,,,,,12,,,.97,.02,,325]); // Random 45

        const hurt_Sfx = new Sound([,,377,.02,.05,.16,,3,,-13,,,,,,.1,,.72,.07]); // hurt sfx
        const death_sfx = new Sound([,,416,.02,.07,.14,1,.6,-7,,,,.06,,,.1,,.69,.04,,220]); // Pickup 49


        const explosion_sfx_bass = new Sound([1.1,,31,.08,.21,.74,2,3.2,,,,,,.7,,.7,,.48,.13,,99]); // Explosion 22
        const explosion_vibration_sfx = new Sound([2,0,65.40639,.03,.96,.43,1,.3,,,,,.13,.3,,.1,.04,.85,.19,.28]); 
        const explosion_3 = new Sound([,,9,,.05,.45,4,4.4,,,8,.04,,,,.4,,.52,.42,.33]); // Random 33

        const electricity = new Sound([1.1,,10,.09,,.02,3,3.6,,,,.33,.02,,,,.37,.93,.3,,-1404]); // Random 38

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
        this.counter = 0;
        this.randomTrack = "";

        // Map sounds to different sound effects and play them via an enumerator/global script
        //required for a music shuffler
        this.sfx_playlist = new Map([
            [0, this.zelda_powerup],
        ])

        // Music tracks Url's
        //this.default_playlist 



    }



    shuffle(playlist: Record<number, string>) : string {

        //var track = this.default_playlist;

        // port godot random shuffle code for this implementation
        // Filter out the last played track and pick a random one from the remaining tracks
        //var availableTracks = this.default_playlist.filter(track => track !== this.lastPlayedTrack);
        //this.randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];


        // Log the selected track
        //console.log("Selected Track: ", this.randomTrack, "/", this.counter);

        // Shuffle function ported
        const keys = Object.keys(playlist).map(Number);
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        return playlist[randomKey];

    }

    
    play_sfx(){}

    async play(){

        console.log("Initialising song player 2", this.counter);
        // bug:
        // (1) loops and plays song twice
        // zzfx song initialization
        //use zzfxm synthesiser for music
         
        //error catcher for double music plays
        if (this.counter == 0){
    

        //let buffer : number[][];
        //let node :  AudioBufferSourceNode;

        // Loads a song
        const load = async ()  => {
            this.track = this.shuffle(this.default_playlist); // get a random track

            console.log ("track debug : ", this.track);
            const res = await fetch(this.track);
            const src = await res.text();
            return parse(src);
        };

        // As we're downloading the song as a string, we need to convert it to JSON
        // before we can play it.
        //
        // This step isn't required when embedding a song directly into your
        // production.
        const parse = (str: string) => {

            // regex process the song files
            str = str.replace(/\[,/g,'[null,')
            .replace(/,,\]/g,',null]')
            .replace(/,\s*(?=[,\]])/g,',null')
            .replace(/([\[,]-?)(?=\.)/g,'$10')
            .replace(/-\./g,'-0.')
            .replace(/\/\/# sourceMappingURL=.*$/gm, ''); //whitespace fixed

            // console.log("song debug: ",str);

            return JSON.parse(str, (key, value) => {
            if (value === null) {
                return undefined;
            }
            return value;
            });
        };


        

          // Renders the song. ZzFXM blocks the main thread so defer execution for a few
         // ms so that any status message change can be repainted.
          const render = (song : any[]) : Promise<number[][]> => {
        return new Promise(resolve => {
            setTimeout(() => resolve(zzfxM(song[0], song[1], song [2])), 50);
            });
        }

        
        console.log("playing song: ", this.counter);
        const song = await load();
         
         
         this.buffer = await render(song);
         
         //zzfxM([.9, 0, 143, , , .35, 3], [], []);
         // play the tune
         this.stream = zzfxP(this.buffer[0], this.buffer[1]);
         
        this.stream.loop = true;
        this.counter += 1;
         
        await zzfxX.resume();

         // stop it
         //node.stop();
            
        }

    }


    clear(){

        if (this.stream){
            // stop playing song
            this.stream.stop();
            }
        }
}


class Wallet {
    /*
     * Implements all Wallet functionality in one class
     *
     * Docs:  https://docs.perawallet.app/references/pera-connect#methods
     * 
     * Features:
     * (1) Wallet Connect Pera
     * 
     * To Do:
     * (1) Implement Wallet Connect Defly
     * (2) Create Wallet on game start & only trigger connect with button press 
     * (3) Implement Algod Client & Smart Contract Factory
     * (4) Get Total Assets Being held by this address using algod indexer
     * (5) Get Total Apps Created By this address
     * (6) Port Digital Marketplace smartcontract & finish mapping all frontend functions
     * (7) Map Wallet Stats to Inventory & Stats UI
     * (8) Port Escrow Smart Contract to Algokit
     * (9) Test Tokenized Asset UI/UX for Bow Item
     * (10) Test Save / Load game Mechanics using local state save, web cache
     *      - Save Account Address
     */
    //public network: Map<string, number> = new Map([
    //    ["MainNet", 416001],
    //    ["TestNet", 416002],
    //    ["BetaNet", 416003],
    //    ["All Networks", 4160]
    //]) ;

    public peraWallet: PeraWalletConnect | null = null;
    public algorand: any | null = null;
    public algodClient: any | null = null;
    public indexerClient: any | null = null;
    public kmdClient: any | null = null;
    public accountAddress: string | null = null;
    public accountInfo: any | null = null;
    public Connected: boolean;

    constructor(client: boolean) {
        //turning off algod client init for performance optimization
        //console.log("Testing Wallet Integration");

        // initialise wallet connect and save player address
        this.peraWallet = new PeraWalletConnect({
            chainId: 4160, // All Net
            shouldShowSignTxnToast: true,
        });

        if (client == true) {
            this.algorand = AlgorandClient.mainNet(); //connect to mainnet

            // get algod parameters
            this.algodClient = this.algorand.client.algod;
            this.indexerClient = this.algorand.client.indexer;
            //this.kmdClient = this.algorand.client.kmd;
        }
        //check if session is connected
        this.Connected = this.peraWallet.isConnected;

        console.log("Pera Connected Session: ", this.Connected);

        //works
        /**
        const connectToPeraWallet = async () => {
            try {
                //const t = await this.peraWallet?.isConnected;
                //console.log(t);
                await this.peraWallet!.disconnect();

                const accounts = await this.peraWallet!.connect();
                this.peraWallet!.connector?.on('disconnect', this.handleDisconnectWallet);

                this.accountAddress = accounts[0];

                console.log("Account Address: ", this.accountAddress);

                // get account asset info
                const accountAssets = await this.indexerClient.lookupAccountAssets(this.accountAddress);

                console.log(accountAssets);


                // Use the accountAddress as needed
            } catch (error) {
                //if (error?.data?.type !== 'CONNECT_MODAL_CLOSED') {
                console.error('Error connecting to Pera Wallet:', error);
            }
        };


        connectToPeraWallet();
        */
    }

    async __connectToPeraWallet() { //doesn't work
        if (this.Connected == false) {

            //disconnect wallet session error catcher
            await this.peraWallet!.disconnect();

            try {
                //create new connected session
                const accounts = await this.peraWallet!.connect();

                //this.peraWallet!.connector?.on('disconnect', this.handleDisconnectWallet);

                this.accountAddress = accounts[0];

                console.log("Account Address: ", this.accountAddress);

                //fetch account info
                this.fetchAccountInfo();
                this.fetchWalletAssets();

                // Use the accountAddress as needed
            } catch (error) {
                console.error('Error connecting to Pera Wallet:', error);
            }
        }

    }

    // fetch the assets held my this address
    // doesn't produce useable information
    // can only get sud balance after successfully bonding
    async fetchWalletAssets() {
        // Fetch account Asset Info
        // Get account asset info
        const accountAssets = await this.indexerClient.lookupAccountAssets(this.accountAddress);

        console.log("Account Assets: ", accountAssets);
    }

    async fetchSudHoldings() {
        // probably using vestigefi api, check for the sud holdings of this particular address
    }

    handleDisconnectWallet(error: Error | null, payload: any): void {
        this.peraWallet!.disconnect();
        throw new Error('Function not implemented.');
    }



    // use algokit sdk to construct transactions
    // sign a transaction
    async signTransaction() {

        //let txn = {}; //placeholder transaction
        //const signedTxn = await this.peraWallet!.signTransaction([[{ txn }]]);

        //const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
        //console.log('Transaction sent with ID:', txId);
    }

    async fetchAccountInfo(accountAddress: string = this.accountAddress!) {
        try {
            const accountInfo = await this.indexerClient.lookupAccountByID(accountAddress).do();
            console.log("Account Info:", accountInfo);
        } catch (error) {
            console.error("Error fetching account info:", error);
        }
    }


    //make payment transaction
    /**
     const suggestedParams = await algodClient.getTransactionParams().do();
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: receiverAddress,
        amount: algosdk.algosToMicroalgos(1), // 1 Algo
        suggestedParams,
        }); 

     */

    // make asset payment
    // sud asset id : 2717482658

}




class Inventory {

    /*
    Inventory Singleton
    
    
    Functions
    (1) Handles All Player Inventory
    (2) 
    
    */

    private items: Record<string, number>; // Dictionary to store inventory items
    public inventoryUI: HTMLElement | null = null;
    constructor() {
        console.log("Loading Inventory Singleton");
        this.items = {};
    }

    render(): void {


        this.inventoryUI = document.getElementById("inventory-container");

        this.inventoryUI!!.innerHTML = ""; // clear UI

        const items = window.inventory.getAllItems(); // Get inventory items


        // Inner html manipulation to spawn this Inventory Items
        // map this to loop throug getItems function
        Object.entries(items).forEach(([itemName, itemCount]) => {
            this.inventoryUI!!.innerHTML += `
            <div class="inventory-item">
                <button class="item-button" onclick="useItem('${itemName}')">
                    <img src="assets/images/${itemName}.png" alt="${itemName}" class="item-image">
                    <div class="item-name">${itemName}</div>
                    <div class="item-description">Amount: ${itemCount} </div>
                </button>
            </div>
        `;


        });


    }

    /**
     * Add or update an item in the inventory.
     * If the quantity is less than or equal to zero, the item is removed.
     * @param itemName - The name of the item.
     * @param quantity - The quantity to add (can be negative for removal).
     */
    set(itemName: string, quantity: number): void {
        if (quantity <= 0) {
            delete this.items[itemName]; // Remove item if quantity is zero or less
        } else {
            this.items[itemName] = (this.items[itemName] || 0) + quantity;
        }
    }

    /**
     * Retrieve the quantity of an item.
     * @param itemName - The name of the item.
     * @returns The quantity of the item, or 0 if it doesn't exist.
     */
    get(itemName: string): number {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        return this.items[itemName] || 0;
    }

    /**
     * Check if an item exists in the inventory.
     * @param itemName - The name of the item.
     * @returns `true` if the item exists, otherwise `false`.
     */
    has(itemName: string): boolean {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        return itemName in this.items;
    }

    /**
     * Remove an item completely from the inventory.
     * @param itemName - The name of the item.
     */
    remove(itemName: string): void {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        delete this.items[itemName];
    }

    /**
     * Get a list of all items in the inventory.
     * @returns A copy of the inventory dictionary.
     */
    getAllItems(): Record<string, number> {
        return { ...this.items };
    }

    /**
     * Count the total number of unique items in the inventory.
     * @returns The number of unique items.
     */
    getItemCount(): number {
        return Object.keys(this.items).length;
    }

    /**
     * Count the total quantity of all items in the inventory.
     * @returns The total quantity of all items.
     */
    getTotalQuantity(): number {
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

    private THREE: typeof THREE;
    private scene: THREE.Scene;
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private cube: any | null;

    constructor() {
        //super();
        // create a global threejs object
        this.THREE = THREE;

        console.log("Three JS Debug 1: ", this.THREE);


        const { Scene, PerspectiveCamera, WebGLRenderer } = this.THREE;

        // Initialize scene, camera, and renderer
        //make  scene and camera globally accessible
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();


        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // Append the renderer's DOM element to your target layer
        const threejsLayer = document.getElementById("threejs-layer");

        if (threejsLayer) {
            threejsLayer.appendChild(this.renderer.domElement);
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

    LoadModel(): void {
        /**
         * Loads A 3D Gltf model via script
         * Works
         */
        console.log("Loading 3d model");

        //const { GLTFLoader } = this.GLTF;


        const loader = new GLTFLoader;
        const DEBUG = false;
        loader.load(
            'overworld_map.glb',
            (gltf) => {
                if (DEBUG) {


                    console.log('Loaded GLTF:', gltf.scene);
                    console.log("pointer debug: ", this.cube);
                    // Access and log key details
                    console.log('Scene:', gltf.scene); // The root scene object
                    console.log('Animations:', gltf.animations); // Animation clips
                    console.log('Nodes:', gltf.scene.children); // All child nodes

                    // buggy debugs
                    //console.log('Materials:', gltf.scene.children.map(obj => obj.material )); // Materials
                    //console.log('Meshes:', gltf.scene.children.filter(obj => obj.isMesh)); // Meshes
                }

                // save scene as global pointer
                if (gltf.scene instanceof THREE.Mesh) {
                    this.cube = gltf.scene;
                } else {
                    console.error("gltf.scene is not a Mesh");
                    this.cube = gltf.scene;
                }

                //this.cube = gltf.scene; // save scene as global pointer



                this.scene.add(gltf.scene); // Ensure 'this' is bound properly
            },
            undefined,
            (error) => {
                console.error('error occurred loading the 3d model:', error);
            }
        );

        console.log("Finished loading model", this.cube);

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
        return !!this.cube;

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

    hideThreeLayer() {
        //hides the threejs css render layer
        const layer = document.getElementById("threejs-layer");
        if (layer) {
            layer.style.visibility = "hidden";
        }
    }

    showThreeLayer() {
        //shows the threejs css render layer
        const layer = document.getElementById("threejs-layer");
        if (layer) {
            layer.style.visibility = "visible";
        }
    }


    setCamera(Int_Distance: number): void {

        // Sets the camera at a specific distance
        this.camera.position.z = Int_Distance;

    }

    animate(): void {
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
        const animate = () => {
            requestAnimationFrame(animate);

            // Rotate the cube
            if (this.cube) {
                //this.cube.rotation.x += 0.01;
                this.cube.rotation.y += 0.006; // temporarily disabling x-axis animation for 3d scene
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
    (3) Detects which type of device the game is running on for platform specific optimization
    */

    public browser : string = "unknown";
    public platform : string = "unknown";

    public  screenOrientation : number | undefined;
    public viewport_size : Vector2 | undefined;
    enemyMob() {
        //enemy mob logic in pure javascript
        return 0;
    }
    enemyPathFinding() {
        return 0;
    }

    detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        //let browser = 'unknown';
        //let platform = 'unknown';

        // Detect browser
        if (userAgent.includes('chrome')) {
            this.browser = 'Chrome';
        } else if (userAgent.includes('firefox')) {
            this.browser = 'Firefox';
        } else if (userAgent.includes('safari')) {
            this.browser = 'Safari';
        } else if (userAgent.includes('edge')) {
            this.browser = 'Edge';
        } else if (userAgent.includes('opera') || userAgent.includes('opr')) {
            this.browser = 'Opera';
        }

        // Detect platform
        if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent)) {
            this.platform = 'Mobile';
        } else {
            this.platform = 'Desktop';
        }

        console.log(`Browser: ${this.browser}, Platform: ${this.platform}`);
        //return { this.browser, this.platform };
    }

    
}

class Screen extends EngineObject {
// screen class extension



    constructor(){
    super();
    console.log("Screen Optimisation Logic run >>");
    this.color = new Color(0, 0, 0, 0); // make object invisible
}

update(){

    
    if (window.player) {

        // Track player
        // set camera position to player position
        setCameraPos(window.player.pos);
        setCameraScale(128);  // zoom camera to 128 pixels per world unit
    }

    }
}

class GameObject extends EngineObject {
    // Base Class for All Game Objects
    constructor() {
        super();
        console.log("Loading Utils Singleton");

    }

    destroy(): void {
        //this.destroy();
        // Logic for general object destruction
        console.log("GameObject destroyed");
    }
}


class Inputs extends GameObject {

    /*
    Functions:
    
    (1) Handles And Porpagates all Input In the Game
    (2) Stores Input to An Input Buffer
    (3) Handles creation and Destruction of Game HUD as a child
    (4) Maps Player Input Action To A Global Enum
    (5) Contains pointers to the game hud ui, stats hud ui, status text ui, and the virtual pad touch hud
    
    TO DO:
    (1) Map and Test Gamepad implementation in the wild

    Bugs:
    (1) Input buffer spamming
    (2) Stuck idle bug - temprarily disabling idle state for input buffer spamming fix
    */

    public color: LittleJS.Color;
    public input_buffer: number[];
    public input_state: Map<string, number>;
    public state: number = 0; // holds the current input state asides the input buffer
    public WALKING: number;

    //input buffer conditional
    public saveBuffer : boolean = false;

    constructor() {
        super();
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
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
            ["IDLE", 6],
        ]);


        this.WALKING = 0.03; // walking speed

    }

    // Returns The Input Buffer as An Array
    get_Buffer() {
        return this.input_buffer
    }

    update() {
        /**
         * 
         * Features:
         * (1) Maps Key Presses To Input States And Appends Them to The input buffer
         * 
         * To DO:
         * (1) FIx idle state stuck bug
         */


        // mouse and TouchScreen Input
        // use for minimap inputs 
        //this.pos = mousePos;

        // Keyboard Input Controller

        //
        // Move UP
        //
        if (LittleJS.keyIsDown('ArrowUp')) {
            //console.log("key up pressed");
            this.up()
        }

        if (LittleJS.keyWasReleased("ArrowUp")){
                
        //this.idle();
        }

        // Move Down
        if (LittleJS.keyIsDown('ArrowDown')) {
            this.down()
        }

        if (LittleJS.keyWasReleased("ArrowDown")){
            //this.idle()
        }


        // Move Left
        if (LittleJS.keyIsDown('ArrowLeft')) {
            //console.log("key left pressed");
            this.left()
        }

        if (LittleJS.keyWasReleased("ArrowLeft")){
            //this.idle()
        }


        // Move Right
        if (LittleJS.keyIsDown('ArrowRight')) {
            this.right()

        }

        if (LittleJS.keyWasReleased("ArrowRight")){
            //this.idle()
        }

        // Attack
        if (LittleJS.keyIsDown('KeyX')) {
            this.attack()

        }
        
        if (LittleJS.keyWasReleased("KeyX")){
            //this.idle()
        }


        // Dash
        if (LittleJS.keyIsDown('Space')) {
            this.roll();

        }

        // Debug Input Buffer
        if (LittleJS.keyWasPressed('KeyL')) {
            console.log("key L as pressed! ");
            console.log("Input Buffer: ", this.get_Buffer());
        }



        // Virtual GamePad Input for mobiles
        let stk = LittleJS.gamepadStick(0, 0); // capture gamestik
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

        if (stk.x == 0 && stk.y == 0) {
            // idle state
            //this.idle();
        }




        // Virtual Gamepad Controller
        if (LittleJS.gamepadIsDown(1)) {
            console.log("Game Pad Was Pressed, Test Successfull: ");
            //return 0;
            this.roll();
        }

        if (LittleJS.gamepadIsDown(2)) {
            console.log("Game Pad Was Pressed, Test Successfull 2");
            this.attack()
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
        if (this.input_buffer.length > 24) {
            this.input_buffer.length = 0; // Clears the array
        }

    }

    /**
     * 
     * INPUT STATES AS FUNCTIONS
     * 
     * Features:
     * 
     * (1) Updates the Input buffer for global objects
     * Using functions
     */

    idle(){
        //console.log(" Idle State");
        
        // to do : 
        // (1) fix input buffer spammer; temporarily turning off
        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("IDLE") ?? 6);}
        
        

        // update current state
        this.state = this.input_state.get("IDLE")!;
    }

    attack() {
        // Attack State
        //console.log(" Attack Pressed");

        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("ATTACK") ?? 4);}

        // update current state
        this.state = this.input_state.get("ATTACK")!;

        // Little JS vibrate for 100 ms
        vibrate(40);
    }

    roll() {

        // dash state
        // console.log(" Dash Pressed");

        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("ROLL") ?? 5);}

        // update current state
        this.state = this.input_state.get("ROLL")!;


        // Little JS vibrate for 100 ms
        vibrate(40);
    }

    up() {
        console.log("key up was pressed! ");

        // update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("UP") ?? 0);}

        let y = this.input_state.get("UP")!
        console.log("state debug 3:", y);
        
        // update current state
        this.state = y;

        console.log("state debug 1: ", this.state);

        // move up
        this.pos.y += this.WALKING;
        //console.log("Position debug 1: ", this.pos.x);

        // Little JS vibrate for 100 ms
        vibrate(40);
    }

    down() {
        console.log("key down as pressed! ");

        // update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("DOWN") ?? 1);}

        // update current state
        this.state = this.input_state.get("DOWN")!;

        // move down
        this.pos.y -= this.WALKING;

        // Little JS vibrate for 100 ms
        vibrate(40);
    }

    right() {

        //move right
        console.log("key right was pressed! ");

        //update input buffer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("RIGHT") ?? 3);}

        // update current state
        this.state = this.input_state.get("RIGHT")!;

        // move right
        this.pos.x += this.WALKING;

        // Little JS vibrate for 100 ms
        vibrate(40);
    }

    left() {

        // move left
        console.log("key left was pressed! ");

        //update input buffer
        // to do
        // (1) fix input buffer spammer
        if (this.saveBuffer){this.input_buffer.push(this.input_state.get("LEFT") ?? 2);}


        // update current state
        this.state = this.input_state.get("LEFT")!;

        // move left
        this.pos.x -= this.WALKING;

        // Little JS vibrate for 100 ms
        vibrate(40);
    }

    getState() : number {
        return this.state;
    }

}


class Player extends GameObject {
    /*
    PLAYER CLASS

    # THe Core Player Script
    #
    # Features
    # (1) THe world's camera
    # (2) Player hitboxes
    # (3) It's a class and stores variables to the UI, Globals singleton, PlayersSave Files, and the Debug SIngleton
    # (4) Extend input from Global Input Singleton
    # (5) Extends to Top DOwn and SideScrolling Player Scripts
    # (6) Player & Enemy SFX is handled by simulation singleton
    # (7) Connects Dialog Signals From Dialogs Singleton
    # (8) Collision detectin is done from simulation singleton
    # (9) The current frame is the sprite id that would be rendered in the render() function

    # to do: (1) set player's initial state to idle down not run up
    */

    // Constants
    private WALK_SPEED: number = 500; // pixels per second
    private ROLL_SPEED: number = 1000; // pixels per second
    //private GRAVITY: number = 0; // For Platforming Levels
    private ATTACK: number = 1; // For Item Equip
    private pushback: number = 5000;

    // Properties
    private input: Inputs;
    private hitpoints: number;
    private linear_vel = LittleJS.vec2(0, 0);
    private roll_direction = LittleJS.vec2(0, 1);
    private StateBuffer: any[] = [];
    private item_equip: string = ""; // Unused Item Equip Variant


    // State Machines Enumerations
    private TOP_DOWN: Map<string, number>;
    private FACING: Map<string, number>;
    
    // State Machines Actions
    public state: Record<string, () => void>;
    public facing: Record<number, () => void>;
    public facingPos : number = 0; // for storing the current facing positoin

    // References
    private local_heart_box: any; // Update type to match UI class
    private blood: any = null;
    private despawn_particles: any = null;
    private die_sfx: any = null;
    private hurt_sfx: any = null;
    private music_singleton_: any = null;

    // Player attributes
    public mass: number = window.simulation.gravity;//this.GRAVITY;
    //public size: Vector2 = vec2(1);
    //public tileInfo: LittleJS.TileInfo; // Update type to match tile info structure
    public animationTimer: LittleJS.Timer = new Timer();
    public currentFrame: number = 0;
    public previousFrame: number = 0;
    public frameCounter: number = 0; // for timing frame changes to 1 sec or less
    public mirror_: boolean = false; //false
    public animationCounter : number = 0.1 // 0.1 seconds for each animation

    // Player Animation frame data sorted as arrays
    private RunUp : Array<number> =[3, 4, 5, 6, 7, 8];
    private RunDown : Array<number> =[9, 10, 11, 12, 13, 14, 15];
    private RunLeft : Array<number> =[17, 18, 19, 20, 21, 22];
    private RunRight : Array<number> =[17, 18, 19, 20, 21, 22];
    private IdleUp : Array<number> =[0];
    private IdleDown : Array<number> =[0];
    private IdleLeft : Array<number> =[0];
    private IdleRight : Array<number> =[0];
    private Roll : Array<number> =[0];
    private AttackUp : Array<number> =[0];
    private AttackDown : Array<number> =[0];
    private AttackLeft : Array<number> =[0];
    private AttackRight : Array<number> =[0];
    private Despawn : Array<number> =[0];

    constructor() {

        super();

        //centalise player pos to tilemap
        this.pos = vec2(16, 9);
        this.size = vec2(0.8);

        console.log("Creating Player Sprite /", window.map.pos, "/", this.pos);
        
        // Fetch Player Health From Globals Singleton
        // Update Globals With Player Pointer

        this.input = window.input; // global input singleton

        // create a pointer to the Particle fx class

        // store player object in global array
        window.globals.players.push(this);


        // Player Logic Variables 
        this.WALK_SPEED = 500; // pixels per second 
        this.ROLL_SPEED = 1000; // pixels per second
        //this.GRAVITY = 0; // For Platforming Levels // used simulation gravity instead
        this.ATTACK = 1; // For Item Equip
        this.hitpoints = window.globals.health; // global hp singleton 
        this.pushback = 5000;
        this.linear_vel = LittleJS.vec2(0, 0);
        this.roll_direction = LittleJS.vec2(0, 1);//Vector2.DOWN

        this.StateBuffer = [];
        this.item_equip = ""; //Unused Item Equip Variant


        // player GUI
        this.local_heart_box = window.ui.HEART_BOX; // Pointer To Heart Box HUD from the UI Class





        // TO DO:
        // (1) Connect to Mini Map UI
        // (2)

        // Connect Heart box signals
        // check if signal is connected
        // temporarily debugging signal implementation

        // Set initial player health


        // player state machine
        this.TOP_DOWN = new Map([
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
        this.FACING = new Map([
            ['UP', 0],
            ['DOWN', 1],
            ['LEFT', 2],
            ['RIGHT', 3],
        ]);

        // set initial player's default state
        this.state = this.matchState(); // the top down player logic //= this.TOP_DOWN.get("STATE_IDLE")!;
        this.facing = this.matchInputs(); // the input state machine / facing logic  //= this.FACING.get("DOWN")!;
        

        //TO DO: player's camera pointer (1) Camer should follow/ track the player's position
        //TO DO: player's animation node pointer

        //disconnect extra signal
        //this.health_signal.disconnect(healthDebug);

        //PLAYER'S PARTICLE AND SOUND FX POINTERS
        // TO DO:
        // (1) Player's particle fx
        this.blood = null;
        this.despawn_particles = null;
        this.die_sfx = null;
        this.hurt_sfx = null;

        // Music Singleton Pointer
        // this would be kinda drepreciated as each Zzfx can play its own sould 
        // this not needing the music singleton pointer to actually play sfx
        this.music_singleton_ = null;

        // player collision & mass
        //this.mass = this.GRAVITY; // make object have static physics

        //add state machine logic

        //little js camera pointer

    }



    hurt() {

        //use a timer to flash the player object colour from orig  -> white -> orig
        //(1) Play Hurt Animation
        //(2) Trigger kickback
        //(3) Update Player health
        // (4) Emit blood fx particle fx
        this.hitpoints -= 1;
        console.log("Player hit: ", this.hitpoints);
    }

    matchInputs(): Record<number, () => void>  {
            


            /**
             * Maps input singleton states to the player's state machine
             * 
             *
            */
            // to do : attack and death
        
            // match facing animation
           // ['UP', 0],
           // ['DOWN', 1],
           // ['LEFT', 2],
        //  ['RIGHT', 3],
        return {
            0 : () => {

                // apply walking physics
                this.state["STATE_WALKING"]()

                this.mirror_ = false;

                // play the animation for 0.1 seconds
                this.playAnim(this.RunUp);
                
                //save previous facing data for idle state
                this.facingPos = 0;
                

            },
            1 : () => {
                this.state["STATE_WALKING"]()

                this.playAnim(this.RunDown);

                //save previous facing data for idle state
                this.facingPos = 1;
            },
            2 : () => {
                this.state["STATE_WALKING"]()

                this.mirror_ = true;
                this.playAnim(this.RunLeft);

                //save previous facing data for idle state
                this.facingPos = 2;
            },
            3 : () => {
                this.state["STATE_WALKING"]()
                
                this.mirror_ =  false;
                this.playAnim(this.RunRight);

                //save previous facing data for idle state
                this.facingPos = 3;
            },
            6 : () => {

                //temporarily adding for testing
                //this.state["STATE_WALKING"]()
                // idle state
                // use the previous facing position 
                // to play the corresponding idle animation

                if (this.facingPos == 0){this.currentFrame = 2}
                else if (this.facingPos == 1){ this.currentFrame = 0}
                else if (this.facingPos == 2){ this.currentFrame = 1; this.mirror_ = true}
                else if (this.facingPos == 3){ this.currentFrame = 1; this.mirror_ = false}
            }

        };
    };
    // input states

    //['UP', 0],
    //['DOWN', 1],
    //['LEFT', 2],
    //['RIGHT', 3],
    //['ATTACK', 4],
    //['ROLL', 5],
    //["IDLE", 6],


    // player states
    // ['STATE_BLOCKED', 0],
    // ['STATE_IDLE', 1],
    // ['STATE_WALKING', 2],
    // ['STATE_ATTACK', 3],
    // ['STATE_ROLL', 4],
    // ['STATE_DIE', 5],
    // ['STATE_HURT', 6],
    // ['STATE_DANCE', 7]

    // stores complex player states
    matchState(): Record<string, () => void>  {

        return {
            "STATE_BLOCKED" : () => {

            },

            "STATE_IDLE" : () => {

            },

            "STATE_WALKING" : () => {
                // walking state
                this.pos.x = this.input.pos.x;
                this.pos.y = this.input.pos.y;

            },
        }
    }


    update() {
        /**
         * Features
         * 
         * (1) Fetches the input state from the global buffer
         * (2) Maps the input state buffer to the particular player's animation
         */

        //
        // To DO:
        // (1) Idle animation
        // (2) Attack animation
        // (3) Dance animation

        /**
         * Delta Time Calculation
         */

        //Gets Delta Time calculation from Simulation singleton
        this.frameCounter += window.simulation.deltaTime!; //accumulate elasped time

        /**
         * Simple State Machine
         * 
         * Features:
         * 
         * (1) Plays the player animation
         * (2) Manages & Stores the Player's state
         * 
         */
        // Simple State Machine Logic
        // triggers the state machine logic
        // feeds the input state into the state machine logics
        // match inputs and match state
        // bug:
        // (1) theres a time lag between the button pressed and button released causing a stuck idle bug
        let sstate : number = this.input.getState();
        
        // to do: (1) fix stuck idle state bug and input buffer spammer
        //console.log("stae debug 12: ", sstate, "/", this.input.get_Buffer());
        
        // gets the input state from the singleton
        // passes it as a parameter to the state machine logic
        this.facing[sstate]();
        


        // TO DO: 
        // (1) Move to simulation singleton
        // player hit collision detection
        // detects collision between any enemy in the global enemies pool
        for (let i = 0; i < window.globals.enemies.length; i++) {

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

    }

    render() {

        //// set player's sprite from tile info and animation frames

        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 1, 0), this.color, 0, this.mirror_);
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

    animate(currentFrame: number, sequence: number[]): number {
        /** 
         * Animation Function
         * 
         * Features:
         * 
         * (1) Loops through an array sequence and return this current frame
         * (2) Plays animation loops
         *
         *  Usage Examples:
            this.currentFrame = getNextFrame(this.currentFrame, [3, 4, 5]); // Loops 3 → 4 → 5 → 3
            this.currentFrame = getNextFrame(this.currentFrame, [1, 2, 3]); // Loops 1 → 2 → 3 → 1
            this.currentFrame = getNextFrame(this.currentFrame, [6, 7, 8]); // Loops 6 → 7 → 8 → 6
        */
        const index = sequence.indexOf(currentFrame); // Find the current position in the sequence
        return sequence[(index + 1) % sequence.length]; // Move to the next frame, looping back if needed
    }

    playAnim(anim: Array<number>){

        // play the animation for 0.1 seconds
        if (this.frameCounter >= this.animationCounter) {

            //loop animation function
            this.currentFrame = this.animate(this.currentFrame, anim);

            this.frameCounter = 0; // Reset timer
                    
        }
    }
}

class Enemy extends GameObject {
    // To DO :
    // (1) Enemy spawner
    // (2) Enemy Mob logic using Utils functions
    // (3) Enemy State Machine
    // (4) Enemy Collisions
    // (5) Enemy Animations (1/2)

    //private pos: Vector2 = vec2();
    //public size: Vector2;
    public tileInfo: any;
    public hitpoints: number;
    public speed: number;
    public detectionRange: number;
    public minDistance: number;
    public wanderCooldown: number;
    private targetPos: Vector2;
    private enemy_type: Map<string, number>;
    private state_machine: Map<string, number>;
    private IDIOT_FRAME_RATE: number;
    private SLOW_FRAME_RATE: number;
    private AVERAGE_FRAME_RATE: number;
    private FAST_FRAME_RATE: number;
    private despawn_timer: any;

    constructor(pos: Vector2) {
        super();
        //(1) set the Enemy object's position
        //(2) set the Enemy object's type which determines the logic



        this.tileInfo = tile(0, 128, 2, 0); // set player's sprite from tile info

        // set enemy position from the initialisation script
        //this.pos = pos.copy();

        // store object to global pointer for object pooling
        window.globals.enemies.push(this);

        this.hitpoints = 1; //set a default enemy hp

        // store player object in global array
        //window.globals.enemies.push(this);

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
        //this.velocity = vec2(0, 0); // default temp velocity

        // Testing Enemy Type Enumeration
        console.log("Input Debug 1: ", this.enemy_type.get("EASY"));

        // Enemy collision & mass
        //this.setCollision(true, true); // make object collide
        //this.mass = 0; // make object have static physics

        //enemy AI variables
        this.speed = 1.5// Movement speed
        //this.size = 20; // Enemy size for collision
        this.detectionRange = 200; // Range to detect the player
        this.minDistance = 30; // Minimum distance from player to stop following
        this.targetPos = vec2(0, 0); // Random wandering target
        this.wanderCooldown = 0; // Time before choosing a new wandering target


        // blood fx
        //this.blood_fx = null
        // Timer to destroy the ParticleFX object after 5 seconds
        this.despawn_timer = new Timer;    // creates a timer that is not set


    }
    update() {

        if (window.player) {
            // enemy AI

            //calculate enemy distance to player
            const dx = window.player.pos.x - this.pos.x;
            const dy = window.player.pos.y - this.pos.y;
            const distanceToPlayer = Math.sqrt(dx * dx + dy * dy);

            const MOB = true;

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

    }

    _get_player() {

        //(1) Gets the Player Object in the Scene Tree if Player unavailable, get him from the global pointer 
        return 0;
    }

    kickback() {
        return 0;
    }

    despawn() {
        // The Enemy Despawn animation
        console.log("Destroying Enemy");
        //create particle fx
        //let blood_fx = new ParticleFX(this.pos, this.size);

        this.despawn_timer.set(3);


        // remove object from global object pool
        // remove object from global array
        const index = window.globals.enemies.indexOf(this);
        if (index !== -1) {
            window.globals.enemies.splice(index, 1);
        }

        //blood_fx.destroy();
        this.destroy();
    }
    _on_enemy_eyesight_body_entered() {
        // player detection with a raycast
        return 0;
    }

    _on_enemy_eyesight_body_exited() {
        // player leaves enemy detection raycast
        return 0;
    }

    render(){}

}
class EnemySpawner extends GameObject {
    public ENABLE: boolean;
    private COUNTER: number;
    public color: any | null;

    //spawn an enemy count at specific posisitons
    constructor() {
        super();

        this.ENABLE = true;
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        this.COUNTER = 0; // counter for calculatin how much enemies been spawned
        console.log("Enemy Spawner Instanced: ", this.ENABLE);

    }

    update() {

        // spawn 2 new enemies if the enemy pool is 0
        if (window.globals.enemies.length < 1 && this.ENABLE) {
            const enemy1 = new Enemy(vec2(5, 10));

            this.COUNTER += 1;

            return

        }

        // stop spawning if enemy spawn count is 15
        if (window.globals.enemies.length == 15) {
            this.ENABLE = false
        }
    }
}

// For Simulation singleton multiplayer logic
//type PlayerInfoDictionary = { [id: number]: player_info };

class Simulation extends GameObject {
    /*
    
    Simulation Singleton In One Class
    Handles all simulation logic

    3d Cube Logic handled by littlejs

    Features:
    (1) Add Gravity TO Cube Object
    (2) Adds A ground Level To Scene
    (3) Triggers start of game loop

     */
    // To DO : 
    // Add Player And Cube Collissions Where The Cube Collision tracks the Cube Object
    // Expantd Timer Functionality for animations via global singleton

    // get the cube object from threejs
    public cubePosition: Vector3 | null = null;
    public groundLevel: number = -4; // ground position for stopping Gravity on Cube 
    public color: any | null;
    public tick: number = 0;
    public lastTick: number = 0;
    public deltaTime: number | null = null;

    public Enabled: boolean = false;

    public state : Map<string, number>;    // state machine
    public gravity : number = 3500; // to do: connect to little js gravity config
    public frame_counter : number = 0;
    public last_update : number =  -1;


    //Multiplayer config dictionary
    public player_info : { [id: number]: player_info } = {};

    //type PlayerInfoDictionary = { [id: number]: player_info };

    // Input Buffer decoded from player info updates
    public _input_buffer_decoded: Array<number> = [];
    public _state_buffer_decoded : Array<number> = [];

    // temporarily disabling
    //public rainFX = new RainFX(vec2(), vec2()); //pointer to rain fx particle
    //public smokeFX = new SmokeFX(vec2(), vec2()); // pointer to smoke fx particle

    public local_3d_engine = window.THREE_RENDER; // safe pointer to threejs
    
    constructor() {
        super();
        console.log("Simulation Singleton Created");
        //this.cubePosition = null; // for storing the cube geometry 3d position 
        //this.groundLevel = -4; // ground position for stopping Gravity on Cube 
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible
        //this.timer = new Timer(); //timer necessary for running the simulation timer loop

        //return 0;

        // side scrolling settings
        setGravity(0);

        //simulation singleton state machine
        this.state = new Map([
            ['SIMULATING', 0],
            ['NON_SIMULATING', 1]
        ]);

            

        // multiplayer
        // server's data serialization of current player's info
        
        this.player_info[0] = {0:{            
            posi: vec2(0),
            vel:vec2(0),
            fr:0,
            in:0,
            hp:3,
            st:0,
            rd:vec2(0),
            dx:0,
            up:0,
            wa:"",
            ai:0,
            sc:0,
            kc:0,
            inv:"",
            rt:60,
            hash:""}
        };
        
    }

    


    update() {
        
        // Delta Calculation
        //needed for animation logic
        //get delta time via ticks
        this.tick = window.performance.now();
        this.deltaTime = (this.tick - this.lastTick) / 1000;
        this.lastTick = this.tick;

        //console.log("Delta time debug:", this.deltaTime); //works

        // update cube 3d position
        let cubePosition = this.local_3d_engine.getCubePosition();


        //update frame counter
        this.frame_counter +=1;


        //Frame Counter Reset Logic
        if (this.frame_counter >= 1_000){
            this.frame_counter = 0;
        }



        
        // Start Game Sequence
        // It modifies the threejs positions

        if (cubePosition) {


            // add gravity to cube
            if (cubePosition.y > this.groundLevel) {
                this.local_3d_engine.setCubePosition(cubePosition.x, cubePosition.y -= 0.03, cubePosition.z);
            }


            // hide threejs layer once game starts
            // is always true once game has started
            // todo: does code account for game quiting?
            if (cubePosition.y < this.groundLevel) {
                this.local_3d_engine.hideThreeLayer();

                // save to global conditional for rendering game backgrounds and starting core game loop
                window.globals.GAME_START = true;

            }
        }



    }

    get_frame_counter(): number{
        return this.frame_counter;
    }


    // Multiplayer Code

    /** 
    "Player Info"
    # Features: 
    # (1) should store Non-threathening Crypto and Multiplayerinfo too
    # (2) Data Integrity can be checked using hash
    # (3) Stores Data FOr Synchronizing Player Data Among Multiple Peers
    # (4) converted to poolbyte array before sent over Network
    # (5) synchronizes game states across player network mesh
    """
    REGISTERS PLAYERS INITIALLY
    """
    */
   
    async register_player(id : number){
        //return this class's registered player data
        //should ideally return an error type for html
        // player info could also be null. code should account for that
        this.player_info[id] ={0:{
            posi: vec2(0),
            vel: vec2(0),
            fr: this.get_frame_counter(),
            in: 0,
            hp: 3,
            st: 0,
            rd: vec2(0),
            dx: 0,
            up: 0,
            wa: "",
            ai: 0,
            sc: 0,
            kc: 0,
            inv: "",
            rt: 0,
            hash: ""

        }};

        // append the hash to the player data

        this.player_info[id][0].hash = await this.getPlayerHash(this.player_info[id][0])
            
    }
    
    
    async getPlayerHash(playerInfo: any): Promise<string> {
        // code for hashing the player info data 

        // Step 1: Convert the object to a stable JSON string
        const json = JSON.stringify(playerInfo);

        // Step 2: Encode it as a Uint8Array
        const encoder = new TextEncoder();
        const data = encoder.encode(json);

        // Step 3: Hash it using SHA-256
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);

        // Step 4: Convert buffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Step 5: Return first 5 characters
        return hashHex.slice(0, 5);
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
     * All Player Interactable Objects.
     * They increase the player's inventory count per item and only collide with
     * Player objects' collision.
     * 
     * @param item The type of item to create.
     */
    constructor(item: string) {
        super(); // Call the parent class constructor.

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
    }
}

/**
 * Particle FX
 * 
 * (1) Blood_splatter_fx
 * (2) DespawnFx
 */


class ParticleFX extends EngineObject {
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


    public color: any;
    private trailEffect: any;

    constructor(pos: Vector2, size: Vector2) {
        super();
        this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible

        const color__ = hsl(0, 0, .2);
        this.trailEffect = new LittleJS.ParticleEmitter(
            this.pos, 0,                          // pos, angle
            this.size, 0, 80, LittleJS.PI,                 // emitSize, emitTime, emitRate, emiteCone
            tile(0, 16),                          // tileIndex, tileSize
            color__, color__,                         // colorStartA, colorStartB
            color__.scale(0), color__.scale(0),       // colorEndA, colorEndB
            2, .4, 1, .001, .05,// time, sizeStart, sizeEnd, speed, angleSpeed
            .99, .95, 0, PI,    // damp, angleDamp, gravity, cone
            .1, .5, true, true        // fade, randomness, collide, additive
        );


    }
}

class Blood_splatter_fx extends ParticleFX {
    

}

class DespawnFx extends ParticleFX {

}

class Bombexplosion extends ParticleFX{

}

class RainFX extends ParticleFX {

}

class SmokeFX extends ParticleFX {

}

/*
*Globals Singleton
*
*Features: 
*(1) Holds All Global Variants in one scrupt
*(2) Can Only Store Data, Cannot Manipulate Data
*
*
*
*/

class Globals {

    // All Global Variables
    public health: number;
    public players: Array<Player>; // Update the type to a specific Player class if available
    public enemies: Array<Enemy>; // Update the type to a specific Enemy class if available
    public scenes: Record<string, any>; // Update the value type if you have a specific Scene type
    public score: number;
    public kill_count: number;
    public GAME_START: boolean;

    constructor() {

        // All Global Variables 

        this.health = 3;
        this.players = []; // internal array to hold all playe objects
        this.enemies = []; // internal global array to hold all enemy types
        this.scenes = {};// holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
        this.kill_count = 0; //enemy kill count

        this.GAME_START = false;// for triggering the main game loop logic in other scenes
    }
}

/**
 * Android Singleton
 * 
 * Features:
 * (1) All optimizations for mobile browser in a single class
 */

class Android {

    public _is_android : boolean = false;

    // Lifetime OPtimizations for CPU Particle FX
    public Long_lifetime : number = 6;
    public Short_lifetime : number = 3
    public MINUMUM_FPS : number = 25;


    // pointers to touch interface and gamehud objects
    // needed for UI calling on mobile browsers
    // to do : ui class should store pointers to each of these elements
    public TouchInterface = null; 
    public GameHUD_ = null; 
    public ingameMenu = null;
    
    // screen orientation storage
    public local_screen_orientation : number = 0;

    private _simulation = window.simulation; //simulation singleton pointer

    private _globals = window.global;

    constructor(){

    // check & save if browser type is mobile
    if (window.utils.platform == "Mobile"){

        this._is_android = true;

        this.ads();

    }

    }


    //unimplemented function to run browser ads optimised for mobiles
    ads(){}
    ads_video(){}
    _no_ads(){}


    //external class function to check if platform is mobile browser
    is_android() : boolean {
        return this._is_android;
    }

    // handle rain simulation fx for shorter lifetimes on mobile in update() function

    /**
     * Screen Orientation & Scaling Algorithm
     * 
     */
    //kkkkkkk

}


/**
 * Debug Class
 *  
 * For properly debugging elements in littlejs
 * by attaching debug variables to the ljs inengine debugger
 * 
 * Currently unimplemented
 * Would require refactoring each singleton to reference this class
 * would require syncing with mobile build syntax per object
 * Should replace console.log debugging
 * 
 */

class Debug {

}




// ALL UI & UI Objects Implementation
// ui defaults
// customise later
let uiDefaultColor = LittleJS.WHITE;
let uiDefaultLineColor = LittleJS.BLACK;
let uiDefaultTextColor = LittleJS.BLACK;
let uiDefaultButtonColor = hsl(0, 0, .5);
let uiDefaultHoverColor = hsl(0, 0, .7);
let uiDefaultLineWidth = 4;
let uiDefaultFont = 'arial';
let uiDefaultPosition = vec2();
let uiDefaultSize = vec2();
// ui system
let uiObjects: Array<UIObject> = [];

/**
 * Creates Temporarily UI Objects via functions that are quicky deleted
 * Helper functions for UI Object class
 * 
 * @param pos 
 * @param size 
 * @param color 
 * @param lineWidth 
 * @param lineColor 
 */

function drawUIRect(pos: LittleJS.Vector2, size: LittleJS.Vector2, color = uiDefaultColor, lineWidth = uiDefaultLineWidth, lineColor = uiDefaultLineColor) {
    let uiContext = LittleJS.overlayContext;
    uiContext.fillStyle = color.toString();
    uiContext.beginPath();
    uiContext.rect(pos.x - size.x / 2, pos.y - size.y / 2, size.x, size.y);
    uiContext.fill();
    if (lineWidth) {
        uiContext.strokeStyle = lineColor.toString();
        uiContext.lineWidth = lineWidth;
        uiContext.stroke();
    }

    //pass the context to LittlejS
    LittleJS.drawRect(pos, size, color, 0, false, true, uiContext);
}

function drawUILine(posA: LittleJS.Vector2, posB: LittleJS.Vector2, thickness = uiDefaultLineWidth, color = uiDefaultLineColor) {
    let uiContext = LittleJS.overlayContext;
    uiContext.strokeStyle = color.toString();
    uiContext.lineWidth = thickness;
    uiContext.beginPath();
    uiContext.lineTo(posA.x, posA.y);
    uiContext.lineTo(posB.x, posB.y);
    uiContext.stroke();
}

function drawUITile(pos: LittleJS.Vector2, size: LittleJS.Vector2, tileInfo: LittleJS.TileInfo, color = uiDefaultColor, angle = 0, mirror = false) {
    let uiContext = LittleJS.overlayContext;
    LittleJS.drawTile(pos, size, tileInfo, color, angle, mirror, LittleJS.BLACK, false, true, uiContext);
}

function drawUIText(
    text: string,
    pos: LittleJS.Vector2,
    size: LittleJS.Vector2,
    color = uiDefaultColor,
    lineWidth = uiDefaultLineWidth,
    lineColor = uiDefaultLineColor,
    align: CanvasTextAlign = 'center',
    font = uiDefaultFont,
) {
    let uiContext = LittleJS.overlayContext;
    LittleJS.drawTextScreen(text, pos, size.y, color, lineWidth, lineColor, align, font, size.x, uiContext);
}


class UIObject extends EngineObject {
    /**
     * Creates Permanent UI Objects
     * 
     * Every Class Extension From UI Object extends their own custom render and update scripts
     * This class constains the shared interacctivity like hover and press functions by all UI Object sub classes
     * 
     * TO DO :
     * (1) Depreciate in favour of Kenny UI elements and CSS
     */
    public localPos: LittleJS.Vector2 = vec2();
    public pos: LittleJS.Vector2 = vec2();
    public size: LittleJS.Vector2 = vec2();
    public color;
    public lineColor;
    public textColor;
    public hoverColor;
    public lineWidth;
    public font;
    public visible: boolean;
    public children: Array<UIObject>;
    public parent: any;
    mouseIsOver: boolean = false;
    mouseIsHeld: boolean = false;


    constructor(localPos: LittleJS.Vector2 | undefined = uiDefaultPosition, size: LittleJS.Vector2 | undefined) {
        super();
        this.localPos = localPos.copy();

        if (!size) {
            size = uiDefaultSize;
            this.size = size.copy();
        }

        if (size) {
            this.size = size.copy();
        }

        this.color = uiDefaultColor;
        this.lineColor = uiDefaultLineColor;
        this.textColor = uiDefaultTextColor;
        this.hoverColor = uiDefaultHoverColor;
        this.lineWidth = uiDefaultLineWidth;
        this.font = uiDefaultFont;
        this.visible = true;
        this.children = [];
        this.parent = null;
        uiObjects.push(this); // create global pointer to self
    }

    addChild(child: UIObject) {
        LittleJS.ASSERT(!child.parent && !this.children.includes(child));
        this.children.push(child);
        child.parent = this;
    }

    removeChild(child: UIObject) {
        LittleJS.ASSERT(child.parent == this && this.children.includes(child));
        this.children.splice(this.children.indexOf(child), 1);
        child.parent = 0;
    }

    update() {
        // hover & UI Interraction (Works)

        // track mouse input
        const mouseWasOver = this.mouseIsOver;
        const mouseDown = LittleJS.mouseIsDown(0);
        if (!mouseDown || isTouchDevice) {
            this.mouseIsOver = LittleJS.isOverlapping(this.pos, this.size, LittleJS.mousePosScreen);
            if (!mouseDown && isTouchDevice)
                this.mouseIsOver = false;
            if (this.mouseIsOver && !mouseWasOver)
                this.onEnter();
            if (!this.mouseIsOver && mouseWasOver)
                this.onLeave();
        }
        if (LittleJS.mouseWasPressed(0) && this.mouseIsOver) {
            this.mouseIsHeld = true;
            this.onPress();
            if (isTouchDevice)
                this.mouseIsOver = false;
        }
        else if (this.mouseIsHeld && !mouseDown) {
            this.mouseIsHeld = false;
            this.onRelease();
        }

    }

    hide() {
        this.visible = false;

        for (const child of this.children) {
            child.visible = false;
        }
    }

    show() {
        this.visible = true;

        for (const child of this.children) {
            child.visible = true;
        }
    }



    // callback functions
    onEnter() { }
    onLeave() { }
    onPress() { }
    onRelease() { }
    onChange() { }
}

///////////////////////////////////////////////////////////////////////////////

class UIText extends UIObject {
    public text;
    public textColor: any;
    public lineColor: any;

    public font;
    public lineWidth;
    public pos: LittleJS.Vector2 = vec2();
    public size: LittleJS.Vector2 = vec2();
    public align: CanvasTextAlign = "center";

    constructor(pos: LittleJS.Vector2, size: LittleJS.Vector2, text: string = '', align: CanvasTextAlign = 'center', font = LittleJS.fontDefault) {
        super(pos, size);

        this.text = text;
        this.align = align;
        this.font = font;
        this.lineWidth = 0;
    }
    render() {
        if (this.visible) {
            //console.log("Drawing UI Text debug");
            drawUIText(this.text, this.pos, this.size, this.textColor, this.lineWidth, this.lineColor, this.align, this.font);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

class UITile extends UIObject {
    public tileInfo: LittleJS.TileInfo;
    public color;
    public angle;
    public mirror;
    public pos: LittleJS.Vector2;
    public size: LittleJS.Vector2;

    constructor(pos: LittleJS.Vector2, size: LittleJS.Vector2, tileInfo: LittleJS.TileInfo, color = LittleJS.WHITE, angle = 0, mirror = false) {
        super(pos, size);
        this.pos = pos;
        this.size = size;
        this.tileInfo = tileInfo;
        this.color = color;
        this.angle = angle;
        this.mirror = mirror;
    }
    render() {

        if (this.visible) {

            drawUITile(this.pos, this.size, this.tileInfo, this.color, this.angle, this.mirror);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

class UIButton extends UIObject {
    pos: LittleJS.Vector2;
    public text: string;
    public font: any;
    public color;

    mouseIsHeld: boolean = false;
    mouseIsOver: boolean = false;
    lineColor: any;
    hoverColor: any;
    lineWidth: any;
    textColor: any;

    align: any;


    constructor(pos: LittleJS.Vector2, size: LittleJS.Vector2, text: string) {
        super(pos, size);
        this.text = text;
        this.color = uiDefaultButtonColor;
        this.pos = pos.copy();
        this.size = size.copy();
    }
    render() {

        // toggles buttons visibility on / off
        if (this.visible == true) {
            const lineColor = this.mouseIsHeld ? this.color : this.lineColor;
            const color = this.mouseIsOver ? this.hoverColor : this.color;


            drawUIRect(this.pos, this.size, color, this.lineWidth, lineColor);
            const textSize = vec2(this.size.x, this.size.y * .8);

            drawUIText(this.text, this.pos, textSize,
                this.textColor, 0, undefined, this.align, this.font);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////z

class UICheckbox extends UIObject {
    public pos: LittleJS.Vector2 = vec2();
    public size: LittleJS.Vector2 = vec2();
    public checked: boolean = false;

    constructor(pos: LittleJS.Vector2, size: LittleJS.Vector2, checked = false) {
        super(pos, size);
        this.checked = checked;
    }
    onPress() {
        this.checked = !this.checked;
        this.onChange();
    }
    render() {
        drawUIRect(this.pos, this.size, this.color, this.lineWidth, this.lineColor);
        if (this.checked) {
            // draw an X if checked
            drawUILine(this.pos.add(this.size.multiply(vec2(-.5, -.5))), this.pos.add(this.size.multiply(vec2(.5, .5))), this.lineWidth, this.lineColor);
            drawUILine(this.pos.add(this.size.multiply(vec2(-.5, .5))), this.pos.add(this.size.multiply(vec2(.5, -.5))), this.lineWidth, this.lineColor);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////

class UIScrollbar extends UIObject {
    public pos: LittleJS.Vector2;
    public value: number;
    public text: string;
    public color;
    public handleColor;

    align: any;

    constructor(pos: LittleJS.Vector2, size: LittleJS.Vector2, value: number = .5, text: string = '') {
        super(pos, size);
        this.pos = pos.copy();
        this.value = value;
        this.text = text;
        this.color = uiDefaultButtonColor;
        this.handleColor = WHITE;
    }
    update() {
        super.update();
        if (this.mouseIsHeld) {
            const handleSize = vec2(this.size.y);
            const handleWidth = this.size.x - handleSize.x;
            const p1 = this.pos.x - handleWidth / 2;
            const p2 = this.pos.x + handleWidth / 2;
            const oldValue = this.value;
            this.value = LittleJS.percent(LittleJS.mousePosScreen.x, p1, p2);
            this.value == oldValue || this.onChange();
        }
    }
    render() {
        const lineColor = this.mouseIsHeld ? this.color : this.lineColor;
        const color = this.mouseIsOver ? this.hoverColor : this.color;
        drawUIRect(this.pos, this.size, color, this.lineWidth, lineColor);

        const handleSize = vec2(this.size.y);
        const handleWidth = this.size.x - handleSize.x;
        const p1 = this.pos.x - handleWidth / 2;
        const p2 = this.pos.x + handleWidth / 2;
        const handlePos = vec2(LittleJS.lerp(this.value, p1, p2), this.pos.y);
        const barColor = this.mouseIsHeld ? this.color : this.handleColor;
        drawUIRect(handlePos, handleSize, barColor, this.lineWidth, this.lineColor);

        const textSize = vec2(this.size.x, this.size.y * .8);
        drawUIText(this.text, this.pos, textSize,
            this.textColor, 0, undefined, this.align, this.font);
    }
}

//////////////////////////////////////////////////////////////////////////////////////

class UITextureButton extends UIObject {

    public tileInfo: LittleJS.TileInfo;
    pos: LittleJS.Vector2;
    public font: any;
    public color;

    mouseIsHeld: boolean = false;
    mouseIsOver: boolean = false;
    lineColor: any;
    hoverColor: any;
    lineWidth: any;
    textColor: any;

    align: any;


    constructor(tileInfo: LittleJS.TileInfo, pos: LittleJS.Vector2, size: LittleJS.Vector2) {
        super(pos, size);
        this.tileInfo = tileInfo;
        this.color = uiDefaultButtonColor;
        this.pos = pos.copy();
        this.size = size.copy();
    }
    render() {

        // toggles buttons visibility on / off
        if (this.visible == true) {
            const lineColor = this.mouseIsHeld ? this.color : this.lineColor; // unimplemented hover function
            const color = this.mouseIsOver ? this.hoverColor : this.color; //unimplemented hover function


            drawUITile(this.pos, this.size, this.tileInfo, color, this.angle, this.mirror);

        }
    }
}


/////////////////////////////////////////////////////////////////////////////////////
// TO DO: Depreciate all this UI code for css

class UI extends UIObject {
    /* 
    Game UI System
    
    Docs: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/uiSystem/game.js 

    The UI uses html objects, html elements and WebGL objects to 
    render the games different UI elements

    Each UI setup is sepatated into diffferent functions

    To DO:
    (1) in-game menu (1/2)
    (2) Controls Menu
    (3) Game HUD 
        -inventory ui (1/3)
        -quest ui
        -mini-map ui
    (4) Dialogs Box (1/3)
        -map dialogue text to dialog box boundaries
        
    (5) Heartbox (1/2)
    (6) Should Play UI sounds from singleton class (1/2)

    (7) Separate Each Object into class extensions
    
    (8) UI upscalling for mobile browsers
    (9) Better UI graphics
    (10) Separate each Ui element type into different classes with global pointers
        - game menu, game hud, 
    (11) organise heartbox into 64x UI tileset
    */


    // UI components
    public UI_ROOT: UIObject;
    public UI_MENU: UIObject;
    public UI_GAMEHUD: UIObject;
    public HEART_BOX: Array<UIObject>;
    public UI_STATS: UIObject;
    public UI_CONTROLS: UIObject;
    public DIALOG_BOX: UIObject | null = null;

    // UI Buttons
    // menu buttons
    menuContainer: HTMLElement | null;
    newGame: HTMLAnchorElement | null = null;
    contGame: HTMLAnchorElement | null = null;
    Comics: HTMLAnchorElement | null = null;
    Controls: HTMLAnchorElement | null = null;
    Wallet: HTMLAnchorElement | null = null;
    Quit: HTMLAnchorElement | null = null;

    //HUD Texture Buttons
    statsButton: UITextureButton | null = null; // button triggered from input via stats() method
    dialogButton: UITextureButton | null = null;
    comicsButton: UITextureButton | null = null;
    menuButton: UITextureButton | null = null;
    walletButton: UITextureButton | null = null;


    DEFAULT_SIZE: Vector2 = vec2(128);
    DEFAULT_POS: Vector2 = vec2();

    // TImer Nodes
    timer: LittleJS.Timer = new Timer();
    public SHOW_DIALOGUE: boolean = false;
    public SHOW_MENU: boolean = true;


    // safe pointer to the music global singleton
    private local_music_singleton = window.music;

    constructor() {

        super(vec2(), vec2());


        // Create UI objects For All UI Scenes
        // set root to attach all ui elements to
        this.UI_ROOT = new UIObject(vec2(), vec2());
        this.UI_MENU = new UIObject(vec2(), vec2());
        this.UI_GAMEHUD = new UIObject(vec2(), vec2()); // contains all game hud buttons




        this.HEART_BOX = []; //created with the heartbox function
        this.UI_STATS = new UIObject(vec2(), vec2()); // stats and inventory
        this.UI_CONTROLS = new UIObject(vec2(), vec2());

        this.DIALOG_BOX = new UIObject(vec2(), vec2(50));

        //depreciated for css and inner html setup
        //parent & child all Ingame UI Objects
        this.UI_ROOT.addChild(this.UI_MENU);
        this.UI_ROOT.addChild(this.UI_STATS); // player status & inventory
        this.UI_ROOT.addChild(this.DIALOG_BOX);
        //this.UI_ROOT.addChild(this.UI_HEARTBOX);

        //create menu with inner html script
        // bugs
        // (1) game menu small scale on mobile
        // (2) game menu buttons doesn't click with mobile touch

        // connects to menu container div in index.html ln 59.
        // turn menu invisible by default
        this.menuContainer = document.getElementById("menu-container");


        //console.log("Menu Debug 1: ", this.menuContainer);

        //center UI root
        this.UI_ROOT.pos.x = LittleJS.mainCanvasSize.x / 2;

    }

    /**
     * UI visibility Toggles
     * 
     * Features:
     * (1) external methods to toggle UI states as setter & getter functions
     */

    get MenuVisible() {
        return this.SHOW_MENU; // Show the carousel
    };

    /**
     *  In Game Menu Visibility controls & settings
     * 
     */
    set MenuVisible(visible_: boolean) {
        // Toggles Menu Visibility
        this.SHOW_MENU = visible_;

        // play toggle sfx
        if (this.local_music_singleton) {
            this.local_music_singleton.ui_sfx[2].play(); // play robotic sfx
        }

        // game menu visibility
        if (visible_ == false) {
            this.menuContainer!.classList.add("hidden");

        }
        else if (visible_ == true) {

            this.menuContainer!.classList.remove("hidden");
        }


    };


    get DialogVisible() {

        return this.DIALOG_BOX!.visible;
    }

    set DialogVisible(visible: boolean) {
        this.DIALOG_BOX!.visible = visible;
    }

    /*
*  
* Toggles Visibility On /Off Each Dom Element
* 
* Depreciated for class function instead
*/

    setDOMObjectVisibility(object: string, isVisible: boolean) {
        // toggles the visibility of the carousel
        if (isVisible == true) {
            document.getElementById(object)?.classList.remove("hidden"); // Show the carousel
        } else {
            document.getElementById(object)?.classList.add("hidden"); // Hide the carousel
        }
    }

    //depreciated
    update() {
        // dialogue box functionality
        // (1) Pop up and disappear functionality using Context manipulation and function calls
        // as opposed to creating new objects

        // called every frame


        // Dialogue Box Implementation
        // TO DO: Create as separate object with own update function calls
        //used to debug Ui Dialogue Timer

        //console.log(this.timer.get());
        if (this.timer.elapsed()) {
            //console.log("Timer Elapsed");
            this.DIALOG_BOX!.visible = false;
            this.SHOW_DIALOGUE = false;
        }

        // Draws Dialogue Box to screen
        //dialogue box timeout
        if (!this.timer.elapsed() && this.timer.get() != 0 && this.SHOW_DIALOGUE == true) {
            //console.log(" Recursively draw rect");
            //recursively draw rect
            const p = drawUIRect(vec2(250, 50), vec2(250, 100), LittleJS.WHITE)//new UIObject(vec2(0), vec2(5));// drawUIRect(vec2(250, 50), vec2(150), LittleJS.WHITE);
            const ipsum = 'Lorem ipsum dolor sit amet, \n consectetur adipiscing elit. Phasellus sed ultricies orci.\nAliquam tincidunt eros tempus'

            const uiInfo = drawUIText(ipsum, vec2(250, 50),
                vec2(180, 40), LittleJS.WHITE, 8, LittleJS.BLACK, "center", "arial");



            this.DIALOG_BOX!.visible = true;
        }
    }

    dialogueBox() {
        // Triggered by Pressing Key E; function called from the Input SIngleton 
        console.log("Creating Dialgoue Box Instance");
        //this.DIALOG_BOX!.visible = true;

        //create permanent UI Objects with objects classese.g. //new UIObject(vec2(0), vec2(5));

        // Create a timer that runs for 5 seconds
        this.timer.set(5);
        this.SHOW_DIALOGUE = true;

        // dialogue box and text are renderered in the update function
        this.DIALOG_BOX!.visible = true;


    }

    stats() {
        // Testing
        console.log("Triggering Stats UI");
        // Triggers stats ui

        // to do :
        // (1) on & off
        // (2) game pause
        // (3) UI text fix
        // (4) Drag and Drop Items
        // (5) Status UI Buttons (dialogue, comics, menu, stats) (Done)
        // (6) Game Menu Shouldn't trigger once stats is showing
        // (8) Fetch & seriealize ASA data from wallet address(nft, memecoins,etc) 

        // fetch all inventory items
        //console.log("Inventory Items", window.inventory.getAllItems());


        //button action
        console.log("stats button pressed, Use Inventory item");
        //}
        // (1) Create / Show New UI Board
        // (2) Create UI Buttons for every inventroy item (Requires UITexture Button Implementation)
        // (3) Inventory Item Call Example is in Input under I Press
        window.inventory.render();

    }

    gameHUD() {
        /*  Spawns The Game HUD Buttons and Connects 
            Their SIgnals on start of the game 
        */

        //create Heartboxes
        //update & draw heartbox ui every frame
        this.heartbox(3); //create 3 hearboxes
        console.log("Creating Game HUD Buttons");
        // 7 is the sprite for UI 64x64 pixels
        this.statsButton = new UITextureButton(tile(1, 64, 3, 0), vec2(950, 30), vec2(50)); //works
        this.walletButton = new UITextureButton(tile(2, 64, 3, 0), vec2(950, 130), vec2(50));
        this.dialogButton = new UITextureButton(tile(0, 64, 3, 0), vec2(950, 80), vec2(50)); //works
        this.menuButton = new UITextureButton(tile(3, 64, 3, 0), vec2(80, 80), vec2(50));

        /**
         * 
         * HUD Button Signal connections
         * 
         */
        // Game HUD Signals
        // connect signals here
        this.menuButton.onPress = () => {
            // show / hide menu with mouse clicks input once game hasnt started and player isn't instanced
            //

            var menuVisible2 = this.MenuVisible;
            console.log("Mouse was Pressed, Menu 2 toggle: ", menuVisible2);

            // turn menu on/off
            this.MenuVisible = !menuVisible2;

            console.log("Menu Button Pressed")
          


        };

        // Stats Button
        this.statsButton.onPress = () => {

            // sfx
            window.music.sound_start.play();
            // Inventory & Stats
            if (window.inventory) {

                //Debug Inventory
                // TO DO :
                // (1) Inventory UI

                this.stats(); // Trigger the Stats UI

            }

        }

        // Dialogue Button
        this.dialogButton.onPress = () => {

            //sfx
            window.music.sound_start.play();



            //show / hide dialogue
            var diagVisible = this.DialogVisible;
            console.log(" Dialog toggle: ", diagVisible);
            this.dialogueBox(); //dialogue box testing




        }

        //Wallet Button
        this.walletButton.onPress = () => {

            //sfx
            window.music.sound_start.play();

            //const t = async () => {  // create wallet connect txn
            window.wallet.__connectToPeraWallet();
            //};

            //t;

            // fetch onchain info
            //window.wallet.fetchAccountInfo();
            //window.wallet.fetchWalletAssets();
        }

    }

    heartbox(heartCount: number) {
        /* Creates A HeartBox UI Object */
        // To DO:
        // (1) Create into a Separate Object extending UIObject class
        // (2) Add Animations
        // (3) Update Logic for heartbox algorithm
        // (4) Add sprite to UI sprites
        if (this.HEART_BOX.length != heartCount) {
            console.log("Drawing Heartbox", this.HEART_BOX.length, "/", heartCount);
            for (let i = 0; i < heartCount; i++) {

                // Position each heartbox horizontally spaced by 50px, starting at x = 50
                // should adjust width using heart count parameter
                const position = vec2(50 + i * 50, 30);

                // Create a new heartbox UI tile and add it to the HEART_BOX array
                const heartTile = new UITile(position, vec2(50, 50), tile(0, 32, 0, 0)); // uses UI tile function to draw hearbox
                this.HEART_BOX.push(heartTile!);
            }
            console.log("FinishedDrawing Heartbox", this.HEART_BOX.length, "/", heartCount);
        }
    }
    ingameMenu() {
        /*
        * Creates the Ingame Menu UI Object
        *
        * To Do:
        * (1) ingame menu scaling via android singletons
        * (2) menu translations
        */

        console.log("Creating Ingame Menu");
        // Create Ingame Menu
        // 
        if (!this.newGame) {


            this.newGame = this.createMenuOption("New Game", "newgame.html", () => {

                console.log('New Game Pressed');
                
                window.music.sound_start.play();

                // Play Randomised Playlist With Zzfxm optimmised for bandwidth
                window.music.play(); //works

                // apply gravity to 3d model to trigger game start
                window.simulation = new Simulation();

            });

            this.contGame = this.createMenuOption("Continue", "continue.html", () => {
                console.log("Continue Game Pressed");
                window.music.sound_start.play();
            });



            this.Comics = this.createMenuOption("Continue", "continue.html", () => {

                if (this.visible) {
                    // open comics website in new tab
                    console.log('Comics Pressed');
                    window.open('https://dystopia-app.site', '_blank');
                }
            });



            this.Controls = this.createMenuOption("Controls", "controls.html", () => {
                console.log('Controls Pressed');
                window.music.sound_start.play();
            });

            this.Quit = this.createMenuOption("Quit", "quit.html", () => {
                // (1) delete player
                // (2) show 3d layer
                console.log('Quit Pressed');
                window.music.sound_start.play();

                window.THREE_RENDER.showThreeLayer()
            });


            // Append options to menu
            this.menuContainer!.append(this.newGame, this.contGame, this.Controls, this.Quit);
        }
    }

    private createMenuOption(text: string, href: string, onPress: () => void): HTMLAnchorElement {
        const option = document.createElement("a");
        option.href = href;
        option.className = "menu-option";
        option.innerText = text;
        
        const handler = (event: Event) => {
            event.preventDefault(); // Prevent navigation
            if (this.menuContainer!.style.display !== "none") {
             onPress();
            }
        };
        

        // Use pointerdown for broad device compatibility
        option.addEventListener("pointerdown", handler);

        // Optionally add click as a fallback
        option.addEventListener("click", handler);
        
        return option;
    }


}




class OverWorld extends LittleJS.TileLayer {
    /*
        Unused 
        The Overworld Scene + Objects as children

        Example: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/platformer/gameLevel.js
        Example 2:  https://github.com/eoinmcg/gator/blob/main/src/levels/loader.js
        
        Bugs:
        (1) Doesn't account for tiled 0.11 data type with chunk layers
        (2) Needs more json debug to recursively adjust logic
        */
    //LOADED: boolean = false;
    tileLookup: any;
    tileLayer: LittleJS.TileLayer | null = null;
    LevelSize: LittleJS.Vector2 | null = null;
    layerCount: number = 0;
    //tileData: Array<any>;
    ground_layer: number[][] = []; // matrix data type
    ENABLE: boolean = true;
    constructor() {
        super();


        //this is needed for extra collision logic, drawing collision items, coins etc et al
        // this is used to create object instead of tile
        // bug : redo for godot 128x tileset 
        this.tileLookup =
        {
            coins: 0,
            bomb: 1,
            desert: 2,
            bones: 3,
            tree_1: 4,
            tree_2: 5,
            three_d_dune_1: 6,
            three_d_dune_2: 7,
            signpost: 8,
            ring: 9,
            extra_life: 10,
            grass: 11,
            flowers: 12,
            big_boulder: 13,
            small_boulder: 14,
            spaceship: 15,
            exit: 16, // doors
        }

        
        // TO DO:
        // (1) Organise debug for logic arrangement
        // (2) Recusively handle data chunks with the appropriate algorithm
        this.LevelSize = vec2(overMap.width, overMap.height);
        this.layerCount = overMap.layers.length; // would be 1 cuz only 1 leve's made
        
        console.log("Layer count:", this.layerCount);
        console.log("Map width: %d", overMap.width, "/ Map Height:", overMap.height);

        // initialise empty array for the ground layer
        //this.ground_layer = [];
        // chunk data debug
        // ground layer details
      
        // read each layer data from Overworld.json
        const groundObject = overMap.layers[0].chunks[0];
        const temple_ext_object = overMap.layers[2].chunks[0];
        const treen_n_objects = overMap.layers[1].chunks[0];
        //console.log("Data debug (ground): %s", groundObject.name);

        

        // code uses a chunk array function to load the data in chunks
        this.ground_layer =[...this.chunkArray(groundObject.data, groundObject.width).reverse()];
        const trees_and_objects = this.chunkArray(treen_n_objects.data, overMap.width).reverse();
        const temple_exterior = this.chunkArray(temple_ext_object.data, temple_ext_object.width).reverse() ; //.reverse();
      
        console.log("Ground Layer debug: ", this.ground_layer);

        //temple exterior data debug
        console.log("Temple ext Layer debug: ", temple_exterior);

        // tile data doesnt account for multiple layers
        //this.tileData = this.chunkArray(overMap.layers[0].data, overMap.width).reverse();

        this.tileLayer = new LittleJS.TileLayer(vec2(), this.LevelSize!, tile(2, 128, 4, 0));

        //this.color = new LittleJS.Color(0, 0, 0, 0); // make object invisible; //make invisible

        //this.pos = vec2(500);

        // duplicate code
        /** 
        this.tileData.forEach((row: any, y: any) => {
            row.forEach((val: any, x: any) => {
                val = parseInt(val, 10);
                if (val) {
                    //console.log("Val Debug: ", val); //works
                    this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1);

                }

            })
        })
        */
        // Functions:
        // (1) takes in a 2 dimensional array type:  number [][]
        // (2) iterates through the rows and columns
        // (3) Draws a tilemap for each layer
        this.ground_layer.forEach((row: number[], y: number, array: number[][]) => {
            row.forEach((column: number, x: number, array : number[]) => {
                //val = parseInt(val, 10); // convert any string to integer //should be depreciated if passing the correct data type
                if (column) {
                    console.log("Val Debug: ", column); //works
                    
                    //calls a class function to draw to the tilemap
                    this.drawMapTile(vec2(x, y), column - 1, this.tileLayer!, 1);

                }

            })
        });
        

        trees_and_objects.forEach((row: any, y: any) => {
            row.forEach((val: any, x: any) => {
                val = parseInt(val, 10);
                if (val) {
                    //console.log("Val Debug: ", val); //works
                    this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1);

                }

            })
        })


        
        temple_exterior.forEach((row: any, y: any) => {
            row.forEach((val: any, x: any) => {
                val = parseInt(val, 10);
                if (val) {
                    //console.log("Val Debug: ", val); //works
                    this.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 1);

                }

            })
        })
        

        this.tileLayer.redraw();

    }




    chunkArray(array: number[], chunkSize: number) {
        /*
         * The function chunkArray takes an array of numbers & 
         * splits it into smaller chunks of a specified size.
         * 
         * It separates arrays into 30 size matrices as number[][]
         * each representing a different x and y dimentsion on the tilemap 
         */

        
        // algorithm helps loading the level data array as chunks
        const numberOfChunks = Math.ceil(array.length / chunkSize)

        return [...Array(numberOfChunks)]
            .map((value, index) => {
                return array.slice(index * chunkSize, (index + 1) * chunkSize)
            })
    }

    drawMapTile(pos: LittleJS.Vector2, i = 80, layer: LittleJS.TileLayer, collision = 1) {
        const tileIndex = i;
        const data = new LittleJS.TileLayerData(tileIndex);
        layer.setData(pos, data);

        //if (collision) {
        //    LittleJS.setTileCollisionData(pos, collision);
        //}
    }

    loadlevel(level = 0) {
        // load level data from an exported Tiled js file
        // loaded as OverMap


        console.log("Finished Loading Level");

        //draw layer data




    }




}





/* Declare Global Singletons

 So Typescript is aware of new properties that aren't a default in windows
*/
declare global {
    interface Window {
        inventory: Inventory,
        ui: UI,
        THREE_RENDER: ThreeRender,
        globals: Globals,
        utils: Utils,
        music: Music,
        input: Inputs,
        player: Player | null,
        enemyspawner: EnemySpawner,
        wallet: Wallet;
        map: OverWorld;
        simulation: Simulation;

    }

    interface Vector2 {
        copy(): Vector2;
        add(arg0: any): any;
        multiply(arg0: LittleJS.Vector2): any;
        x: number;
        y: number;
    }

    interface Vector3 {
        x: number;
        y: number;
        z: number;
    }

    interface player_info { 0 :{ //server peer id
        posi:Vector2, // position
        vel:Vector2, // velocity
        fr:number, // frame data
        in:number, // input buffer from input singleton
        hp:number,
        st:number, // roll back networking state predictions
        rd:Vector2, // roll direction
        dx:number,
        up:number, //persistent update id across client peers
        wa:string, //Wallet address
        ai:number, //Asset ID
        sc:number, //Dapp ID
        kc:number, //Client Kill Count
        inv:string, // Client inventory items
        rt:number, // respawn timer
        hash:string, //hash splice for data integrity

    }

    

}
}




/*
* LittleJS Main Loop
* 
*/



function gameInit() {
    // called once after the engine starts up
    // setup the game
    console.log("Game Started!");

    // set touchpad visible
    //
    //touchGamepadEnable = true;
    //showSplashScreen = true;

    // use pixelated rendering
    setCanvasPixelated(true);
    setTilesPixelated(false);


    //3d Camera Distance Constants
    const CAMERA_DISTANCE = 16;

    /* Create 3D Scenes And Objects*/
    window.THREE_RENDER = new ThreeRender();


    // UI Setup

    window.ui = new UI();

    // Create & hide Ingame Menu
    window.ui.ingameMenu();
    window.ui.gameHUD();


    /* Create Global Singletons*/
    window.input = new Inputs();
    window.inventory = new Inventory;
    window.globals = new Globals;
    window.utils = new Utils;
    window.music = new Music;

  

    window.wallet = new Wallet(false);

    //get device browser type/ platform
    window.utils.detectBrowser();





    // Add  Inventory Items
    // to do : feed inventory globals to inventroy ui
    window.inventory.set("apple", 5);
    window.inventory.set("banana", 3);


    //Initialise 3d scene render
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
    // (1) draw dystopia logo with css




}

function gameUpdate() {
    // called every frame at 60 frames per second
    // handle input and update the game state


}

function gameUpdatePost() {
    // called after physics and objects are updated
    // setup camera and prepare for render

}

function gameRender() {
    // Temporary Game Manger + simulations
    // triggers the LittleJS renderer
    // called before objects are rendered
    // draw any background effects that appear behind objects
    // handles what gets rendered and what doesn't get rendered
    // triggers srart of game loop from simulation singleton
    // The third tile parameter constrols which tile object to draw
    // draw tile allows for better object scalling
    if (window.globals.GAME_START) {


        //create overworld map
        if (!window.map) {
            window.map = new OverWorld();
        }

        //create global player object
        if (!window.player) {
            window.player = new Player();

            // setup the screen and camera
            const y = new Screen();

            //turn game menu invisibke
            window.ui.MenuVisible = false;



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

}


// Startup LittleJS Engine
// I can pass in the tilemap and sprite sheet directly to the engine as arrays
// i can also convert tile data to json from tiled editor and parse that instead
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, ['tiles.png', "player_tileset_128x128.png", "enemy_tileset_128x128.png", "UI_1_tilemap_64x64.png", "godot_128x_dungeon_tileset.png"]);

