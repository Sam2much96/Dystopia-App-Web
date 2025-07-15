import * as LittleJS from 'littlejsengine';
const {Sound } = LittleJS;
import { zzfxM } from '../audio/zzfxm';
import {zzfxP, zzfxX} from  "../audio/zzfx";


export class Music {


    /*
    All Music Logic In One Script
    
    Functions:
    (1) Plays Music Tracks
    (2) Shuffles Between A Playlist Using Maths module(3) Stores All Music To A Playlist
    (4) Stores All SFX
    (5) Play is called on the sfx track directly
    (6) Music Synthesizer Docs: https://keithclark.github.io/ZzFXM/
    
    TO DO:
    (1) All music play in this codebase, should be routed through this object via a function
    (2) separate music and sfx plays funcitionally

    Notes:
    (1) The SFX and Music Use 2 Different Systems, SFX USes ZzFX a js midi engine
        whereas Music Uses Audio Tags written into the index.html file and called by Element ID
    (2) Most Browsers Refuse Audio music play by default unless the player / user enters an input gesture
    */

    //public ENABLE: boolean; //depreciated


    public music_on : boolean = false;
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
    public item_use_sfx = new Sound([1.4,,954,.01,.01,.003,2,2.4,,-68,211,.3,,,184,,.45,.81,.02,,244]);

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
        //const drum = new Sound([,,129,.01,,.15,,,,,,,,5]); // Loaded Sound 68

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
            // bug :
            // (1) regex logic creates whitespace bug when parsing json
            str = str.replace(/\[,/g,'[null,')
            .replace(/,,\]/g,',null]')
            .replace(/,\s*(?=[,\]])/g,',null')
            .replace(/([\[,]-?)(?=\.)/g,'$10')
            .replace(/-\./g,'-0.')
            .replace(/\/\/# sourceMappingURL=.*$/gm, ''); //whitespace fixed

            //
            //console.log("song debug: ",str);

            return JSON.parse(str, (key, value) => {
            if (value === null) {
                return undefined;
            }
            return value;
            });
        };


        

          // Renders the song. ZzFXM blocks the main thread so defer execution for a few
         // ms so that any status message change can be repainted.
         // to do:
        // (1) fix audio balancing on headphones
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