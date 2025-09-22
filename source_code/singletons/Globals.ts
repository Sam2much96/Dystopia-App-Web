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
import {Player} from "../scenes/Characters/player";
import {Enemy} from "../scenes/Characters/enemy";

export class Globals {

    // All Global Variables
    public hp: number;
    public players: Array<Player>; // Update the type to a specific Player class if available
    public enemies: Array<Enemy>; // Update the type to a specific Enemy class if available
    public scenes: Record<string, any>; // Update the value type if you have a specific Scene type
    public score: number;
    public kill_count: number;
    public death_count : number;
    public GAME_START: boolean;
    public current_level : String = "";
    public suds : number = 0;

    constructor() {

        // All Global Variables 

        this.hp = 3;
        this.players = []; // internal array to hold all playe objects
        this.enemies = []; // internal global array to hold all enemy types
        this.scenes = {};// holds pointers to all scenes
        //this.PlayingMusic = false; // boolean for stopping music start loop
        this.score = 0;
        this.kill_count = 0; //enemy kill count
        this.death_count = 0;

        this.GAME_START = false;// for triggering the main game loop logic in other scenes
    }
}
