
import * as LittleJS from 'littlejsengine';

const {vec2, TileLayerData, TileLayer, EngineObject, drawTile, tile, isOverlapping} = LittleJS; //setTileCollisionData,
//import { TILE_CONFIG } from '../scenes/levels/SpriteAtlas';

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







