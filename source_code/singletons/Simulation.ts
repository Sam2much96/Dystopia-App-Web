import * as LittleJS from 'littlejsengine';

const {EngineObject, Color,vec2,setGravity} = LittleJS

// to do: move to networking / simulation class
interface player_info { 0 :{ //server peer id
        posi:LittleJS.Vector2, // position
        vel:LittleJS.Vector2, // velocity
        fr:number, // frame data
        in:number, // input buffer from input singleton
        hp:number,
        st:number, // roll back networking state predictions
        rd:LittleJS.Vector2, // roll direction
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
// For Simulation singleton multiplayer logic
//type PlayerInfoDictionary = { [id: number]: player_info };

export class Simulation extends EngineObject {
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
    public deltaTime: number = LittleJS.timeDelta;

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
        this.color = new Color(0, 0, 0, 0); // make object invisible
        //this.timer = new Timer(); //timer necessary for running the simulation timer loop

        //return 0;

        // side scrolling settings
        //setGravity(0);

        //simulation singleton state machine
        this.state = new Map([
            ['SIMULATING', 0],
            ['NON_SIMULATING', 1]
        ]);

            

        
        
    }

    multiplayer(){
        // multiplayer
        // server's data serialization of current player's info
        // to do:
        // (1) disable variable instance when not in use
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
        //this.tick = window.performance.now();
        //this.deltaTime = (this.tick - this.lastTick) / 1000;
        //this.lastTick = this.tick;



        //console.log("Delta time debug:", this.deltaTime); //works

        // update cube 3d position
        // bug:
        // (1) 3d level doesn't load model fast on low latency internet
        let cubePosition = this.local_3d_engine.getCubePosition();


        //update frame counter
        this.frame_counter +=1;


        //Frame Counter Reset Logic
        if (this.frame_counter >= 1_000){
            this.frame_counter = 0;
        }



        
        // Start Game Sequence
        // It modifies the threejs positions
        // bug:
        // (1) doesn't account for if cube doesn't load

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

        // to do :
        // (1) for this logic,add a cube debug to check if the 3d model is loaded initially
        //if (cubePosition!){ // redundancy code for low latency browsers

            // save to global conditional for rendering game backgrounds and starting core game loop
        //    window.globals.GAME_START = true;

        //}


    }

    get_frame_counter(): number{
        return this.frame_counter;
    }

    // UI render code

    // to do:
    // (1) port function to simulation singleton
    // (2) implement map drawing with pointer device and map icons e.g. players and enemies 
    // (3) expose function in UI tab buttons singleton
    renderMap(): void {
        const container = document.getElementById("inventory-items");
        if (!container) return;

        container.innerHTML = `
            <div class="map-tab">
                <h2>World Map</h2>
                <!-- mini map placeholder -->
                <img src="map ui 64x64.webp" alt="Mini Map" class="map-image">
                
            </div>
        `;
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