/**
 * Top Down Marketplace/ Shop
 * 
 * requires:
 * (1) Shop Exit Object
 * (2) NPC Merchant
 * (3) Decision Dialogue box
 * (4) UI Translations
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject, TileLayer, initTileCollision, tile,vec2} = LittleJS;


import Shop from "./Marketplace.json";

import {TopDownPlayer} from "../Characters/player";
import {Merchant} from "../Characters/NPC";
import {Utils} from "../../singletons/Utils";
import { Stairs } from '../UI & misc/Exit';

// to do : (1) import merchant npc
// to do : (1) implement decision dialogue

export class Marketplace extends EngineObject{
    LevelSize: LittleJS.Vector2 | null = null;
    tileLayer: LittleJS.TileLayer | undefined;
    LevelData: number[][] = []; // matrix data type
    levelObjects : any[] | null = [];
    constructor(){
        super();
        this.loadMap();
    }

    async loadMap(){
        try{
            this.LevelSize = vec2(Shop.width, Shop.height);
            this.tileLayer = new TileLayer(vec2(0,0),this.LevelSize, tile(2, 128, 2, 0), vec2(1));
            console.log("Map width: %d", Shop.width, "/ Map Height:", Shop.height);
            initTileCollision(vec2(Shop.width,Shop.height));
            this.LevelData = Utils.chunkArray(Shop.layers[0].data, Shop.layers[0].width).reverse();
            this.LevelData.forEach((row, y) => {
                            row.forEach((val : any, x : any) => {
                                val = parseInt(val, 10);
                                if (val) {
                                    // to do:
                                    // (1) refactor from if conditionals to a recursive loop with lookup
            
                                    //console.log("val debug : ", val);
                                    /**
                                     * Tile Collision Layer Logic in badly written if conditionals
                                     * 
                                     * Features:
                                     * (1) sets tile collision for each tile on /off 
                                     * (2) creates objects spawns for object tiles
                                     * 
                                     * 
                                     */
                                    // temp player spawn tile
                                    // to do:
                                    // (1) Global sprite atlas table for parent class logic
                                    if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                                        window.player = new TopDownPlayer(vec2(x,y));
                                        this.levelObjects?.push(window.player);
                                        return
                                    }

                                    // to do:
                                    // add exit tile for the marketplace
                                    if (val ===56){ // stairs exit
                                        const o = new Stairs(vec2(x,y));
                                        this.levelObjects?.push(o);
                                        return
                                    }
            
                                    else{
                                        //console.log("tile debug: ", val);
                                        Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0); // 0 is for no collision, 1 is for collision
                                    }
                                    
                                    }})});
                                    
                        this.tileLayer.redraw();
            

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

    }

        
        destroy(): void {
            
            if (this.tileLayer) this.tileLayer.destroy();
            Utils.saveGame(); // save the game state once exiting the temple interior map
            if (this.levelObjects){ // destroy all instanced level objects
                for (const i of this.levelObjects!){
                    i.destroy();
            }
            this.levelObjects = null;
            }  
 
        }

}
