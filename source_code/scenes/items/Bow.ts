import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile} = LittleJS;


export class Bow extends EngineObject{
    /**
     * 
     * Game Bow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(24, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        // set player collision to coin object
        // set coin idle animation
        if (LittleJS.isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
            
            console.log("Bow item collected");
            this.destroy();

            // update bomb count in inventory
            let y : number = window.inventory.get("Bow");
            let z : number = y + 1;
            window.inventory.set("Bow", z);
            
        }

    }


}
