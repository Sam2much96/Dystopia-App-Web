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
import {Utils} from "../../singletons/Utils";
// to do : (1) import merchant npc
// to do : (1) implement decision dialogue

export class Marketplace extends EngineObject{
    LevelSize: LittleJS.Vector2 | null = null;
    tileLayer: LittleJS.TileLayer | undefined;
    LevelData: number[][] = []; // matrix data type

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

            
                                    
                                        //console.log("tile debug: ", val);
                                        Utils.drawMapTile(vec2(x, y), val - 1, this.tileLayer!, 0); // 0 is for no collision, 1 is for collision
                                    
                                    }})});
                                    
                        this.tileLayer.redraw();
            

        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

    }

        
        destroy(): void {
            
            if (this.tileLayer) this.tileLayer.destroy();
            
    
            
        }

}
