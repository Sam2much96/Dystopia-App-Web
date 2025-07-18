import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;

export class Coins extends EngineObject {
    /**
     * 
     * Game Coin Object
     * 
     * to do:
     * (1) Add coins animation sprites
     * (2) Add ATC Transaction to coin collision 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        this.tileInfo = tile(22, 128, 2, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(22, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {

                console.log("coin collected, creating atc txn");
                this.destroy();
                
            }
        }
    }
}

