/*
*Globals Singleton
*
*Features: 
*(1) Holds All Global Variants in one scrupt
*(2) Can Only Store Data, Cannot Manipulate Data
* 
* To do:
* (1) save map data to scenes and implement load functionality on continue game button
* (2) serialise al globals data to the stats uui
*
*/
import {Player} from "../scenes/Characters/player";
import {Enemy} from "../scenes/Characters/enemy";

export class Globals {

    // All Global Variables
    public hp: number;
    public players: Array<Player>; // Update the type to a specific Player class if available
    public enemies: Array<Enemy>; // Update the type to a specific Enemy class if available
    //public scene: ; // Update the value type if you have a specific Scene type
    public score: number;
    public kill_count: number;
    public death_count : number;
    public GAME_START: boolean;
    public current_level : String = "";
    public suds : number;

    constructor() {

        // All Global Variables 

        this.hp = 5;
        this.players = []; // internal array to hold all playe objects
        this.enemies = []; // internal global array to hold all enemy types
        //this.scenes = {};// holds pointers to all scenes // duplicate of window.map variable
        
        this.suds = 0;
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
        this.kill_count = 0; //enemy kill count
        this.death_count = 0;

        this.GAME_START = false;// for triggering the main game loop logic in other scenes
    }
}
