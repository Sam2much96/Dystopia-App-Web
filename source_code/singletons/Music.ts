import * as LittleJS from 'littlejsengine';
const {Sound, SoundWave , setSoundVolume,setSoundEnable} = LittleJS; //,SoundInstance
import { zzfxM } from './zzfxm';
import {zzfxP, zzfxX} from  "./zzfx";

// AUdio filepaths
import sfx from "./SoundFX.json";


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
    (0) Compost 3 new tracks for the web game
    (1) All music play in this codebase, should be routed through this object via a function
    (2) separate music and sfx plays funcitionally
    (3) Music should turn off when switching tabs is needed for yandex moderation approval
    (4) Add player death and despawn sfx
    (5) Export all sounds from an external resources file
    (6) Use json file paths for loading the music file paths

    Notes:
    (1) The SFX and Music Use 2 Different Systems, SFX USes ZzFX a js midi engine
        whereas Music Uses Audio Tags written into the index.html file and called by Element ID
    (2) Most Browsers Refuse Audio music play by default unless the player / user enters an input gesture

    Bugs:
    (1) Breaks entire game if not available
    (2) Breaks overworld scene renders if not available
    
    */

    


    public enable : boolean = false; // temporarily turning music off for music audit
    public sfx_on : boolean = true ;
    public isPlaying : boolean = false;
    
    public volume : number = 50; // todo : (1) link to zzfxm audio context class 
    public wasPlaying : boolean = false;
    
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
            2:"./audio/songs/Depp.js",
            3:"./audio/songs/Iamback.js",
            4:"./audio/songs/Jazz_Bass_line.js"

    };


    
    // Zzfx synth sounds
    public ui_sfx : Record<number, LittleJS.Sound>= {
        0: new Sound([.8,,325,.08,.24,.19,,2.7,-5,,224,.09,.06,,,,,.65,.17,,-806]),
        1: new Sound([.8,,325,.08,.24,.19,,2.7,-5,,224,.09,.06,,-1,,,.65,.17,,-806]),
        2: new Sound([1.5,.8,270,,.1,,1,1.5,,,,,,,,.1,.01])
    }

    // to do: 
    // (1) create more sfx for each array object with Zzfx
    public comic_sfx : Array<string> | undefined;
    

    public item_collected : LittleJS.Sound = (new Sound([,,1675,,.06,.24,1,1.82,,,837,.06])//new Sound("./audio/sfx/item_collected.ogg")
    );

    public blood_sfx : Record<number, LittleJS.Sound> = {
        0 : (new SoundWave("./audio/sfx/blood-spilling.ogg"))
    };
    
    
    public grass_sfx : Array<string> | undefined;


    public wind_fx = new Sound([,,174,.43,.48,.01,4,4.3,-92,57,,,,,36,,,.91,.43,.13]);
    public item_use_sfx = new Sound([1.4,,954,.01,.01,.003,2,2.4,,-68,211,.3,,,184,,.45,.81,.02,,244]);
    public item_pickup = new Sound([.8,,629,.01,.08,.06,,3.5,1,,462,.08,.08,,9.5,,,.98,.02,,-1291]); 
    

    
    // to do: (1) compress and add the wind sfx
    public wind_sfx : Array<string> | undefined;
    
    // to do:
    // (1) populate data structure with all punch and sword sfx
    // (2) connect random sfx sampler to both enemy and player script objects
    // (3) test music on / off / controls settings
    // (4) find a better way of loading audio files into the game instead of this way fgs
    public hit_sfx : Record<number, LittleJS.Sound> ={
        0: new SoundWave(sfx[1]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°9.wav")),
        1: new SoundWave(sfx[2]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°10.wav")),
        2: new SoundWave(sfx[3]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°11.wav")),
        3: new SoundWave(sfx[4]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°12.wav")),
        4: new SoundWave(sfx[5]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°13.wav")),
        5: new SoundWave(sfx[6]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°14.wav")),
        6: new SoundWave(sfx[7]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°15.wav")),
        7: new SoundWave(sfx[8]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°16.wav")),
        8: new SoundWave(sfx[9]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°17.wav")),
        9: new SoundWave(sfx[10]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°18.wav")),
        10: new SoundWave(sfx[11]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°19.wav")),
        11: new SoundWave(sfx[12]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°20.wav")),
        12: new SoundWave(sfx[13]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°21.wav")),
        13: new SoundWave(sfx[14]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°22.wav")),
        14: new SoundWave(sfx[15]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°23.wav")),
        15: new SoundWave(sfx[16]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°24.wav")),
        16: new SoundWave(sfx[17]),//(new Sound("./audio/sfx/Dragon Ball Z Punch Sound Effect N°25.wav"))
    };

    public sword_sfx : Record<number, LittleJS.Sound> ={
        0: new SoundWave(sfx[18]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword In Sound Effect n°2.wav")),
        1: new SoundWave(sfx[19]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword In Sound Effect n°4.wav")),
        2 : new SoundWave(sfx[20]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Out Sound Effect n°1.wav")),
        3 : new SoundWave(sfx[21]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Slash Sound Effect n°4.wav")),
        4: new SoundWave(sfx[22]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Slash Sound Effect n°5.wav")),
        5: new SoundWave(sfx[23]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Slash Sound Effect n°6.wav")),
        6: new SoundWave(sfx[24]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Slash Sound Effect n°7.wav")),
        7: new SoundWave(sfx[25]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Slash Sound Effect n°8.wav")),
        8: new SoundWave(sfx[26]),//(new Sound("./audio/sfx/Dragon Ball Z Trunks Sword Slash Sound Effect n°9.wav"))
    }

    // to do:
    // (1) finish nokia pack fata structure (done)
    // (2) export sound data structure to external reosurce type (done)
    public nokia_pack_sfx : Record<number, LittleJS.Sound> = {
        0: new SoundWave(sfx[27]),//(new Sound("./audio/nokia_pack/bad_melody.ogg")),
        1: new SoundWave(sfx[28]),//(new Sound("./audio/nokia_pack/blip1.ogg")),
        2: new SoundWave(sfx[29]),//(new Sound("./audio/nokia_pack/blip2.ogg")),
        3: new SoundWave(sfx[30]),//(new Sound("./audio/nokia_pack/blip3.ogg")),
        4: new SoundWave(sfx[31]),//(new Sound("./audio/nokia_pack/blip4.ogg")),
        5: new SoundWave(sfx[32]),//(new Sound("./audio/nokia_pack/blip5.ogg")),
        6: new SoundWave(sfx[33]),//(new Sound("./audio/nokia_pack/blip6.ogg")),
        7: new SoundWave(sfx[34]),//(new Sound("./audio/nokia_pack/blip7.ogg")),
        8: new SoundWave(sfx[35]),//(new Sound("./audio/nokia_pack/blip8.ogg")),
        9: new SoundWave(sfx[36]),//(new Sound("./audio/nokia_pack/blip9.ogg")),
        10: new SoundWave(sfx[37]),//(new Sound("./audio/nokia_pack/blip10.ogg")),
        11: new SoundWave(sfx[38]),//(new Sound("./audio/nokia_pack/blip11.ogg")),
        12: new SoundWave(sfx[39]),//(new Sound("./audio/nokia_pack/hit1.ogg")),
        13: new SoundWave(sfx[40]),//(new Sound("./audio/nokia_pack/hit2.ogg")),
        14: new SoundWave(sfx[41]),//(new Sound("./audio/nokia_pack/hit3.ogg")),
        15: new SoundWave(sfx[42]),//(new Sound("./audio/nokia_pack/hit4.ogg")),
        16: new SoundWave(sfx[43]),//(new Sound("./audio/nokia_pack/hit5.ogg")),
        17: new SoundWave(sfx[44]),//(new Sound("./audio/nokia_pack/hit6.ogg")),
        18: new SoundWave(sfx[45]),//(new Sound("./audio/nokia_pack/negative1.ogg")),
        

    };

    public nokia_hit : Record<number, LittleJS.Sound> = {
        0 : this.nokia_pack_sfx[12],
        1 : this.nokia_pack_sfx[13],
        2 : this.nokia_pack_sfx[14],
        3 : this.nokia_pack_sfx[15],
        4 : this.nokia_pack_sfx[16],
        5 : this.nokia_pack_sfx[17]
    }
    
    public nokia_despawn = this.nokia_pack_sfx[18]
    //public nokia

    public dungeon_sfx_1 = new Sound([.5,,103,.21,.27,.27,3,.6,,,-6,.2,,,31,,,.61,.01,,-1477]);

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
    //sound_break: LittleJS.Sound;
    //sound_bounce: LittleJS.Sound;
    //sound_mosquito_flys: LittleJS.Sound;
    //souund_mosquito_dies: LittleJS.Sound;
    //sound_zapp: LittleJS.Sound;
    //sound_call: LittleJS.Sound;
    //sound_boing: LittleJS.Sound;
    //sound_tv_static: LittleJS.Sound;
    //sound_metal_gong: LittleJS.Sound;
    hurt_Sfx : LittleJS.Sound;
    death_sfx : LittleJS.Sound;
    explosion_vibration_sfx : LittleJS.Sound;
    zelda: LittleJS.Sound | null;
    current_track: string | null;
    next_track: string | null;
    counter: number;
    randomTrack: string;
    sfx_playlist: Map<number, LittleJS.Sound>;
    

  

    constructor() {


        //Audio Control settings
        // to do : map to a control ui / control class (1/3)
        //setSoundVolume(0.3);
        setSoundEnable(true);

        console.log("Music on Settings: ", this.enable );
        
        console.log("sfx debug: ", sfx[1]);
        
        // Initialize the LittleJS Sound System

        //this.ENABLE = false; // turning off music singleton for bandwidth saving
        this.lastPlayedTrack = ""; // Variable for keeping track of the music shuffler & prevents repeating tracks
        this.sound_shoot = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);

        // to do: 
        // (1) move this code to the class object initialiser and not class constants
        //drum
        //const drum = new Sound([,,129,.01,,.15,,,,,,,,5]); // Loaded Sound 68

        this.zelda_powerup = new Sound([1.5,0,214,.05,.19,.3,3,.1,,,150,.05,.09,,,,.11,.8,.15,.22]); // Powerup 9// Powerup 9

        const extra_heart = new Sound([,,537,.02,.02,.22,1,1.59,-6.98,4.97]); // Loaded Sound 66


        const dash_sfx = new Sound([1.5,0,214,.05,.19,.3,3,.1,,,150,.05,.09,,-1,,.11,.8,.15,.22]);
        const dash_2_sfx = new Sound([,,63,.04,.19,.58,,3.9,-2,-8,,,.23,.6,,.2,,.37,.18,.27]); 
        const dash_3 = new Sound([1.4,,420,.19,.01,.21,2,.3,,,314,.18,,,7.8,,.05,.67,.01]); // Random 60
        
        // to do:
        // (1) audit all old sfx in zzfxm
        //const dungeon_sfx_1 = new Sound([.5,,103,.21,.27,.27,3,.6,,,-6,.2,,,31,,,.61,.01,,-1477]);

        const disco = new Sound([,,361,.08,.19,.3,2,2.1,3,,-120,.1,,,102,,,.72,.05]);
        const disco_2 = new Sound([.4,,39,.44,.1,.15,2,1.8,,-54,,,,,12,,,.97,.02,,325]); // Random 45

        this.hurt_Sfx = new Sound([,,377,.02,.05,.16,,3,,-13,,,,,,.1,,.72,.07]); // hurt sfx
        this.death_sfx = new Sound([,,416,.02,.07,.14,1,.6,-7,,,,.06,,,.1,,.69,.04,,220]); // Pickup 49


        const explosion_sfx_bass = new Sound([1.1,,31,.08,.21,.74,2,3.2,,,,,,.7,,.7,,.48,.13,,99]); // Explosion 22
        this.explosion_vibration_sfx = new Sound([2,0,65.40639,.03,.96,.43,1,.3,,,,,.13,.3,,.1,.04,.85,.19,.28]); 
        const explosion_3 = new Sound([,,9,,.05,.45,4,4.4,,,8,.04,,,,.4,,.52,.42,.33]); // Random 33

        const electricity = new Sound([1.1,,10,.09,,.02,3,3.6,,,,.33,.02,,,,.37,.93,.3,,-1404]); // Random 38

        // sound effects
        this.sound_start = new Sound([, 0, 500, , .04, .3, 1, 2, , , 570, .02, .02, , , , .04]);
        //this.sound_break = new Sound([, , 90, , .01, .03, 4, , , , , , , 9, 50, .2, , .2, .01]);
        //this.sound_bounce = new Sound([, , 1e3, , .03, .02, 1, 2, , , 940, .03, , , , , .2, .6, , .06]);
        //this.sound_mosquito_flys = new Sound([, , 269, .36, .01, .01, 2, 2.6, , 4, , , .07, , , , , .62]); // Random 30
        //this.souund_mosquito_dies = new Sound([1.3, , 328, .03, .34, .02, 2, 1.3, , , -27, .14, , , .6, , .01, .54, .19]); // Random 31
        //this.sound_zapp = new Sound([1.2, , 678, .19, .49, .02, 1, 4.1, -75, 9, -263, .43, , .3, 3, , .09, .66, .41, .06, 381]); // Random 24
        //this.sound_call = new Sound([1.9, , 66, .05, .48, .009, , 3.1, -38, 20, , , .13, , .5, .7, .1, .58, .19, .14, -1495]); // Random 26
        //this.sound_boing = new Sound([1.4, , 286, , .19, .009, , 2.7, , -9, 363, .33, , , 61, , .22, .96, .14, .18, -1176]); // Random 29
        //this.sound_tv_static = new Sound([.7, , 187, .01, , .01, 4, 4.8, 2, 72, , , , .1, , , , , .41, , 102]); // Random 32
        //this.sound_metal_gong = new Sound([.7, , 286, .08, , .46, 3, 3.9, , , -76, .57, , , 15, , .07, .65, .08, , 204]); // Random 33
        
        
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
        
        // ---- ADD TAB VISIBILITY HANDLER ----
        // this turns the music off if the browser tab
        // is no longer visible
        // works
        document.addEventListener("visibilitychange", async () => {
            if (document.hidden){
                if (this.stream){
                    //this.stream.stop();
                    await zzfxX.suspend();
                    this.wasPlaying = true;
                    console.log("pausing music");
                }
            }
            else{
                if (this.wasPlaying){
                    await zzfxX.resume();
                    console.log("resuming game music");
                }
            }
        });


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
    shuffle_sfx(playlist: Record<number, LittleJS.Sound>) : LittleJS.Sound{
        // to do:
        // (1) implement sfx_on boolean controller
        let sound;
        if (this.sfx_on){
            let keys =Object.keys(playlist);
            let randomKey = keys[Math.floor(Math.random() * keys.length)];
            sound = playlist[Number(randomKey)];
        }

        return sound!!;
    }
    shuffle_music_v2(playlist : Record<number, LittleJS.Sound>): LittleJS.Sound{
        let keys =Object.keys(playlist);
        let randomKey = keys[Math.floor(Math.random() * keys.length)];
        let sound = playlist[Number(randomKey)];
        return sound;
    }

    // unnecessary function
    //play_sfx(){}

    
    unsafeParse(str: string) : any {

            //console.log(str);
            // regex process the song files
            // bug :
            // (1) regex logic creates whitespace bug when parsing json
            str = str.replace(/\[,/g,'[null,')
            .replace(/,,\]/g,',null]')
            .replace(/,\s*(?=[,\]])/g,',null')
            .replace(/([\[,]-?)(?=\.)/g,'$10')
            .replace(/-\./g,'-0.')
            .replace(/\/\/# sourceMappingURL=.*$/gm, ''); //whitespace fixed


            return JSON.parse(str, (key, value) => {
            if (value === null) {
                return undefined;
            }
            return value;
            });
        };


    async play_v1(){
        /**
         * Version 1 player version uses Zzfxm to play the level's audio
         * 
         */

        //console.log("Initialising song player 2", this.counter);
        // bug:
        // (1) loops and plays song twice
        // zzfx song initialization
        //use zzfxm synthesiser for music
         
        //error catcher for double music plays
        if (this.enable && this.counter == 0){
    

            // Loads a song via a http get request
            // bugs:
            // (1) This creates a bottleneck / noticable lag at the start of the game because of the fetch request for the music track

            const load = async ()  => {
                // to do:
                // (1) testing all tracks files integrity
                // cheat sheet 
            //0:`./audio/songs/sanxion.js`,
            //1:"./audio/songs/cuddly.js",
            //2:"./audio/songs/depp.js",
            //3:"./audio/songs/iamback.js",
            //4:"./audio/songs/Jazz_Bass_line.js"
                let newTrack = this.shuffle(this.default_playlist); // get a random track

                console.log ("track debug : ", newTrack);
                const res = await fetch(newTrack);
                const src = await res.text();

                //debug if the track was fetched
                //console.log("track debug 2: ", src);
                
                // bug:
                // parsing of audio files breaks in final build
                return this.unsafeParse(src); 
                
            };

        // As we're downloading the song as a string, we need to convert it to JSON
        // before we can play it.
        //
        // This step isn't required when embedding a song directly into your
        // production.



        

          // Renders the song. ZzFXM blocks the main thread so defer execution for a few
         // ms so that any status message change can be repainted.
         // to do:
        // (1) fix audio balancing on headphones via mizing
        const render = (song : any[]) : Promise<number[][]> => {
            return new Promise(resolve => {
                setTimeout(() => resolve(zzfxM(song[0], song[1], song [2])), 50);
            });
        }

        
        //console.log("playing song: ", this.counter);
        try{
            const song = await load();
            
            
            this.buffer = await render(song);
            
            // play the tune
            this.stream = zzfxP(this.buffer[0], this.buffer[1]);
            
            this.stream.loop = false;
            this.counter ++;
            
            // auto shuffle once track ends
            this.stream.onended = async () => {

                console.log("Track finished, shuffling next ...");
                this.counter = 0; // reset the song counter
                //this.isPlaying = false;
                await this.play_v1(); // play the next random song
                //window.music.play();
            }

            await zzfxX.resume();

            //console.log("Now playing:", this.lastPlayedTrack);
            
        }
        
         catch (err){

             console.error("Error playing music:", err);
            this.isPlaying = false;
         }

    }}



    clear(){

        if (this.stream){
            // stop playing song
            this.stream.stop();
            }
        }
}