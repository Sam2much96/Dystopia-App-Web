/**
 * Item Spawner 
 * 
 * Features:
 * (1) spawns a random item once the spawn function is called from the enemy Parent object
 * 
 * To do:
 * (1) implement the Wallet coin functionality for Coin spawning handling
 */
import { Bomb } from "./Bomb";
import { Arrow } from "./Arrow";
import { Coins } from "./Coins";
import { HealthPotion } from "./Extralife";
import { Ring } from "./Ring";
import { GenericItem } from "./GenericItem";


import * as LittleJS from 'littlejsengine';

const {randInt,vec2, Color, EngineObject} = LittleJS;

//import { randInt } from "littlejsengine";

export class ItemSpawner extends EngineObject {

    // items to select to spawn
    private spawn1 : any = Bomb;
    private spawn2 : any = Arrow;
    private spawn3 : any = Coins;
    private spawn4 : any = HealthPotion;
    private spawn5 : any = Ring;
    private spawn6 : any = GenericItem;
    private item_scene : any | null = null; // item to spawn
    private amount : number = 1;
    private spawn_: any[] = [
                                this.spawn1,
                                this.spawn2,
                                this.spawn3,
                                this.spawn4,
                                this.spawn5,
                                this.spawn6,
                                ];
    private random_spawn: boolean = true;
    private item_spawned : boolean = false;
    private randomIndex : number;
    constructor(){
        super()

        //make item invisible
        this.color = new Color(0,0,0,0);
        // Randomize between defined spawns 
        this.randomIndex = randInt(this.spawn_.length);
    }
    
    // to do:
    // (1) depreciate positional parameter
    spawn(): void{
        if (!this.item_spawned){
            // play item picku sfx
            window.music.item_pickup.play()

            // the actual spawn function
            console.log("spawn item triggered: ", this.parent.pos); // works

            
            this.item_scene = this.spawn_[this.randomIndex];

            // Instantiate the item at the position
            // should be the parent position + 1 pixel away
            const item = new this.item_scene(this.parent.pos);

            //add to world
            //LittleJS.engineObjects.push(item);

            // save map pointer 
            window.map.levelObjects?.push(item);
            
            this.item_spawned = true;
            return

        }
        else{
        // self delete
            this.destroy();
        

        }

       

    }

}