import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;

//import { OverWorld } from '../levels/OverworldTopDown';
import { OverworldSideScrolling } from '../levels/OverworldSideScrolling';

export class Hole extends EngineObject {
    /**
     * 
     * Level Exit Collision Object
     * 
     * to do:
     * (1) 
     * (2)  
     */
    ENABLE : boolean = true;
    constructor(posi : LittleJS.Vector2){

        super()
        this.tileInfo = tile(3, 128, 2, 4); // set hole tile 22
        this.pos = posi;
        this.size = vec2(1);  

    }

    render(){
        drawTile(this.pos, this.size, tile(3, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player && this.ENABLE){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("Player Entered Exit");
                

                
                //logic
                //save player stats via global function
                window.player.destroy();
                //destroy the overworld scene and player
                window.map.destroy();
                // spawn the new overworld scene 
                
                console.log("Loading the new level");
                window.map = new OverworldSideScrolling();
                this.destroy();
            }
        }
    }
}

