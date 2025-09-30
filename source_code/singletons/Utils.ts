
import * as LittleJS from 'littlejsengine';

const {vec2, TileLayerData, EngineObject, drawTile, tile,setTileCollisionData} = LittleJS


export class Utils {

    /*
    
    Utils.js
    
    Features: 
    (1)  Contains All Game Math Logic in One Script
    (2) Extends Static Functions to Other Scenes For Handing Maths, and Logical Caculations asides Simulation Logic
    (3) Detects which type of device the game is running on for platform specific optimization

    To do:
    (1) implement abstract save and load class that serialises player data to json
    (2) connect abstract save functions to yandex games to pass game moderation : docs : https://yandex.com/dev/games/doc/en/sdk/sdk-player
    (3) use save data implementation from Dystopia site implementation to store data to cookies as well
    (4) implement save and load players inventory items to yandex server, json , and on-chain
    */

    public browser : string = "unknown";
    public platform : string = "unknown";

    public  screenOrientation : number | undefined;
    public viewport_size : LittleJS.Vector2 | undefined;


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

    /**
     * Simulation A.I. Behaviour Logic for Enemies
     */

    static proximity_attack_simulation(
        hitpoints : number, 
        player : any,//Player, 
        player_pos : LittleJS.Vector2, 
        _position : LittleJS.Vector2,
        _enemy : any,//Enemy,
        enemy_type : String,
        state : string, // the enemy state machine in typesript is string based
        enemy_distance_to_player: number,
        center : LittleJS.Vector2
    
    ): string {

        

        if (hitpoints < 0){
            state = "STATE_DIE" ;
        }

        if (player == null){
            state = "STATE_WALKING";
        }

        if (enemy_distance_to_player < 81){
            //state = 0; // set the enemy to attack state
            state = "STATE_ATTACK"
        }

        if (enemy_distance_to_player > 81){
            if (enemy_type == "Hard"){
                state = "STATE_ROLL"
            }
            if (enemy_type == "Intermediate"){
                state = "STATE_ROLL"
            }
            if (enemy_type == "Easy"){
                state = "STATE_ROLL"
            }
        }

        return state
    }

    // To Do:
    // (1) rework player and enemy state machine to use global enumerated numbers

    static hit_collision_detected(
        state : number,
        hitpoints : number,
        pushback_directoin : LittleJS.Vector2,
        _body : any,//Enemy,
        _global_position : LittleJS.Vector2,
        kick_back_distance : number
    ){

        /**
         * Features:
         * 
         * (1) Hit detection
         * (2) Hit registration
         * (3) RPC calls for multiplayer mesh (to do)
         */

        
        // play hit sfx
        window.music.hit_sfx[2].play();


    }


    
        // Math functions
    static directionTo(from: LittleJS.Vector2, to: LittleJS.Vector2): LittleJS.Vector2 {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const length = Math.sqrt(dx * dx + dy * dy);
     return length === 0 ? vec2(0, 0) : vec2(dx / length, dy / length);
    }

    static restaVectores(v1 : LittleJS.Vector2, v2 : LittleJS.Vector2) : LittleJS.Vector2{ //vector substraction
        return vec2(v1.x - v2.x, v1.y - v2.y)
    }

    static sumaVectores(v1 : LittleJS.Vector2, v2 : LittleJS.Vector2) : LittleJS.Vector2 { //vector sum
        return vec2(v1.x + v2.x, v1.y + v2.y)
    }
    
    static round(value : number, precision :number) { // round up numbers
         var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
    

    static calcRandNumber(): number {
        const rando: number = Math.floor(Math.random() * (10000 - 2000 + 1)) + 2000;
        return rando;
    }

    static drawChunks(chunks: any[], width: number, tileLayer : LittleJS.TileLayer, collision: number) {
                chunks.forEach(chunk => {
                    
                    // breaks here
                    const data = this.chunkArray(chunk, width).reverse();
                    
                    data.forEach((row: any, y: any) => {
                        row.forEach((val: any, x: any) => {
                            //console.log("x and y debug: ",x,"/",y);
                            val = parseInt(val, 10); // convert numbers to base 10
                            if (val) {
    
                                //console.log("val debug: ",val);
                                this.drawMapTile(vec2(x, y), val - 1, tileLayer, collision);
                            }
                        });
                    });
                });
            console.log("finished drawing chunk"); // works
        }
    
        static chunkArray(array: number[], chunkSize: number) {
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
    
        static drawMapTile(pos: LittleJS.Vector2, i = 1, layer: LittleJS.TileLayer, collision : number) {
            
            // docs:
            // (1) tile index is the current tile to draw on the tile layer
            //   it is mapped to e the environment layer's tilesheet
    
            // bugs:
            // (1) does not draw 4 tiles after the temple tile
            const tileIndex = i;
            
            const data = new TileLayerData(tileIndex);
            
            //console.log("tileset debug: ", tileIndex); //, "/ data: ", data
            layer.setData(pos, data);
    
            if (collision) {
                setTileCollisionData(pos,1);
            
            }
        }



    
    static saveGame(){

        // save game state to a session token
        // serialises game state from each autoload singleton
        // To do:
        // (1) Quest and dialog subsystems are unwritten as at the time of writing this on Sept 20, 2025
        let data : { [key: string]: any } = {};
        let safe_Globals = window.globals;
        let safe_Diag = window.dialogs;
        let safe_Music = window.music;
        //let safe_Quest ;
        //let safe_Wallet ;
        let safe_Inventory = window.inventory;
        
        data["suds"] = safe_Globals.suds;
        data["kill_count"] = safe_Globals.kill_count;
        data["hp"] = safe_Globals.hp;
        data["language"] = safe_Diag.language;
        data["death_count"] = safe_Globals.death_count;
        data["inventory"] = safe_Inventory.getAllItems();
        data.music = Number(safe_Music.enable);
        sessionStorage.setItem('savegame', JSON.stringify(data));
        console.log(`✅ save game successfull`);
        //ddddd
        // (1) get all required global singletons
        //

    }

    static loadGame(){
        // load game state function
        // load function
        let saveDict = sessionStorage.getItem('savegame');
        if (saveDict){
            console.log("save game debug: ", saveDict);
            let safe_Globals = window.globals;
            //let safe_Diag;
            let safe_Music = window.music;
            //let safe_Quest ;
            //let safe_Wallet ;
            let safe_Inventory = window.inventory;

            //load inventory items into inventory memory
            //window.inventory.items = saveDict["inventory"] ?? 0;

            console.log(`✅ load game successfull`);
        }
        else {
            console.warn("save file is not detected")
        }
        // (2)
    }
}




export class PhysicsObject extends EngineObject {
    /**
     * LittleJS physics object for player and enemy physics & collisions
     * 
 
     */

    public animationTime: number = 0; // for timing frame changes to 1 sec or less
    public mirror: boolean = false; //false
    public animationInterval : number = 0.1 // 0.1 seconds for each animation
    public currentFrame : number = 0;
    

    constructor()
    {
        super();
        this.setCollision(true,true,true,true); // make object collide
        this.mass = 0; // make object have static physics


        
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

        * Bugs :
        * (1) Doesn't work with enemy run up animation frames 
        */
       
        //const index = sequence.indexOf(currentFrame); // Find the current position in the sequence
        //return sequence[(index + 1) % sequence.length]; // Move to the next frame, looping back if needed
        let index = sequence.indexOf(currentFrame);
        
        if (index === -1) {
            // Not found in the sequence — maybe default to the first frame or throw an error
            //  console.warn(`Frame ${currentFrame} not in sequence`, sequence);
            //console.trace("Trace of who called me");
            //return sequence[0]; // or throw new Error("Invalid currentFrame")
            index = sequence[0];
        }

        return sequence[(index + 1) % sequence.length];
        
    }

    playAnim(anim: Array<number>){
        
        // update animation time with the game's delta
        // play the animation for 0.1 seconds
        this.animationTime += LittleJS.timeDelta;
        

        if (this.animationTime >= this.animationInterval) {
            //console.log("animation debug: ", this.frameCounter, "/", this.animationCounter);    
        
            //loop animation function
            this.currentFrame = this.animate(this.currentFrame, anim);
            //console.log(this.currentFrame);
            
            // subtract interval to handle lag gracefully
            this.animationTime -= this.animationInterval; // Reset timer
                    
        }
    }

    render() {

        // bug:
        // (1) player animation frame is iffy

        //// set player's sprite from tile info and animation frames
        //console.log("frame debug: ",this.currentFrame);
        //this.currentFrame
        //console.log("pos debug: ", this.pos);

        drawTile(this.pos, this.size, tile(this.currentFrame, 128, 0, 0), this.color, 0, this.mirror);
    }
    
}

