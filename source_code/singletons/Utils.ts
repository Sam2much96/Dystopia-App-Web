
import * as LittleJS from 'littlejsengine';

const {vec2, TileLayerData, EngineObject, drawTile, tile, isOverlapping} = LittleJS; //setTileCollisionData,


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

    static drawChunks(chunks: any[], width: number, tileLayer : LittleJS.TileCollisionLayer, collision: number) {
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
    
        // depreciated draw tile function
        static drawMapTile(pos: LittleJS.Vector2, i = 1, layer: LittleJS.TileCollisionLayer | LittleJS.TileLayer, collision : number) {
            
            // docs:
            // (1) tile index is the current tile to draw on the tile layer
            //   it is mapped to e the environment layer's tilesheet
    

            const tileIndex = i;
            
            const data = new TileLayerData(tileIndex);
            layer.setData(pos, data);
           
            if (Boolean(collision) && layer instanceof LittleJS.TileCollisionLayer) {
                layer.setCollisionData(pos, collision);
            
            }
             //console.log("tileset debug: ", tileIndex); //, "/ data: ", data
            

        }



    
    static saveGame(){

        // save game state to a session token
        // serialises game state from each autoload singleton
        // To do:
        // (1) save quests and level data
        // (2) load level data with continue button
        
        let data : { [key: string]: any } = {};
        let safe_Globals = window.globals;
        let safe_Diag = window.dialogs;
        let safe_Music = window.music;
        let safe_Quest = window.quest;
        let safe_Wallet = window.wallet ;
        let safe_Inventory = window.inventory;
        
        data["suds"] = safe_Wallet.suds;
        data["kill_count"] = safe_Globals.kill_count;
        data["hp"] = safe_Globals.hp;
        data["language"] = safe_Diag.language;
        data["death_count"] = safe_Globals.death_count;
        data["current_level"] = safe_Globals.current_level; // to do: shorten current level acronym to save data byte transfered in multiplayer gameplay matches
        data["inventory"] = safe_Inventory.getAllItems();
        data["quest"] = safe_Quest.get_quest_list();
        data.music = Number(safe_Music.enable);
        
        sessionStorage.setItem('savegame', JSON.stringify(data));
        console.log(`save game successfull`);
        

    }

    static loadGame(){
        // to do:
        // (1) finish load game implementation
        // (2) connect load game function to ingame menu
        //
        // load game state function
        //
        // Features:
        // (1) load function fetches the game data from memory and loads them into the individual singletons
        // (2) fetches the last player level before quiting the game and should load it

        let saveDict = sessionStorage.getItem('savegame');
        if (saveDict){
            //;
            // to do: 
            // (1) serialise session json data back into the globals singleton
            let cleanJson = JSON.parse(saveDict)
            console.log(`load game data successfull: `, cleanJson);
            
            let safe_Globals = window.globals;
            let safe_Diag = window.dialogs;
            let safe_Music = window.music;
            let safe_Quest = window.quest ;
            let safe_Wallet = window.wallet;
            let safe_Inventory = window.inventory;

            //load inventory items into inventory memory
            //window.inventory.items = saveDict["inventory"] ?? 0;
            
            // load last level played into  memory
            safe_Globals.current_level = cleanJson["current_level"];

            /// to do:
            // (1) laod suds, inventory and quest data into memory
            
      
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
*/

public mirror: boolean = false;
public currentFrame: number ; //= 0;
public animationSpeed: number = 7; // how many times per second the frame changes
public animationSequence: number[];// = [0]; // default animation sequence
public textureIndex : number = 0; // which tile to use, default is player tile

constructor(currentFrame : number = 0,animationSequence: number [] = [0], textureIndex : number = 0) {
    super();
    this.setCollision(true, true, true, true); // make object collide
    this.mass = 0; // make object static by default
    this.animationSequence = animationSequence ; //set the default animation and frame
    this.currentFrame = currentFrame;
    this.textureIndex = textureIndex;
}

/**
 * Update the animation frame based on global LittleJS time
 * @param {number[]} sequence - list of tile frame indices, e.g. [3,4,5]
 * @param {number} speed - how many times per second the animation should loop through frames
 */
playAnim(sequence: number[], speed: number = this.animationSpeed) {
    this.animationSequence = sequence;
    this.animationSpeed = speed;

    // Compute which frame index to use based on time
    const frameIndex = (LittleJS.time * speed) % sequence.length | 0;
    this.currentFrame = sequence[frameIndex];
}

render() {
    drawTile(this.pos, this.size, tile(this.currentFrame, 128, this.textureIndex, 0), this.color, 0, this.mirror);
}




}

/** Pathfinding Helper functions */
export function worldToGrid(pos: LittleJS.Vector2, tileSize: number): LittleJS.Vector2 {
    // grid logic debug
    let x = Math.floor(pos.x /tileSize);
    let y = Math.floor(pos.y /tileSize);
  
    //console.log(x,y);
    return vec2(x,y);
}

export function gridToWorld(cell: [number, number], tileSize: number): LittleJS.Vector2 {
  return new LittleJS.Vector2(
    cell[0] * tileSize + tileSize / 2,
    cell[1] * tileSize + tileSize / 2
  );
}



export class Items extends EngineObject {
    /**
     * 
     * Core Items Class, Expanded by All Game Items
     * 
     * to do:
     * (1) lock all core item behaviour into this class object
     * (2) replace all the items boilerplate script with this code base class
     */
    name  : string ;
    amount : number = 1;
    tileIndx : number;
    collect_diag : string;
    despawn : boolean = false;
    constructor(posi : LittleJS.Vector2, tileIndx : number = 50, name : string = "Generic Item"){

        super()
        this.tileInfo = tile(tileIndx, 128, 2, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  
        this.name = window.dialogs.t(name);
        this.tileIndx = tileIndx; // set the tile index (frame number) to render
        // tranlated item collected dialogue
        this.collect_diag = (this.name) + " " + window.dialogs.t("obtained", window.dialogs.language) + " x " + this.amount.toString();


    }

    render(){
    
        drawTile(this.pos, this.size, tile(this.tileIndx, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){
        // add an idle animation to the item object
        //this.pos =  vec2(-5, 2*Math.abs(Math.sin(LittleJS.time*2*LittleJS.PI)));

        if (window.player && !this.despawn){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                // to do:
                // (1) implement diag translation functionality (done)
                
                window.dialogs.show_dialog("",`${this.collect_diag}`); // to do: should ideally be item hud, requires implement stats hud for item collect
                
                // add the item to the inventory
                //window.music.item_pickup.play();
                window.music.item_collected.play();

                // update item count in inventory
                let y : number = window.inventory.get(this.name);
                let z : number = y + this.amount;
                window.inventory.set(this.name, z);
                

                //console.log("coin collected, creating atc txn");
                this.destroy();
                this.despawn = true;
                return


                // to do : 
                // (1) implement game coin render
                // (2) implement game coin price statistics calculation
                
            }
        }
        else return
    }
}

