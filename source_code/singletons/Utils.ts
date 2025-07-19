
import * as LittleJS from 'littlejsengine';

const {vec2} = LittleJS
export class Utils {

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

    /**
     * Simulation A.I. Behaviour Logic for Enemies
     */

    static proximity_attack_simulation(
        hitpoints : number, 
        player : any,//Player, 
        player_pos : Vector2, 
        _position : Vector2,
        _enemy : any,//Enemy,
        enemy_type : String,
        state : string, // the enemy state machine in typesript is string based
        enemy_distance_to_player: number,
        center : Vector2
    
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
        pushback_directoin : Vector2,
        _body : any,//Enemy,
        _global_position : Vector2,
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
        // sessionStorage.setItem('products', JSON.stringify(data));
        //console.log(`✅ Loaded Shop Database 1`);

    }

    static loadGame(){
        // load game state function
        // load function
        //var shopJson = sessionStorage.getItem('products');
        // if (shopJson){}
        // else {}
    }
}


export function logToScreen(...args: unknown[]): void {
    const debugEl = document.getElementById('debug');
    if (!debugEl) {
        console.warn('Debug element with id="debug" not found.');
        return;
    }

    const logLine = args
        .map(arg => {
            if (typeof arg === 'string') return arg;
            try {
                return JSON.stringify(arg);
            } catch {
                return String(arg);
            }
        })
        .join(' ');

    debugEl.innerHTML += logLine + '<br>';
    debugEl.scrollTop = debugEl.scrollHeight;
}