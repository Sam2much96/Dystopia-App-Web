import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;


export class HealthPotion extends EngineObject{
        /**
     * 
     * Game Bomb Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */

    constructor(posi : LittleJS.Vector2){

        super()
        //this.tileInfo = tile(22, 128, 1, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  

    }

    render(){
        drawTile(this.pos, this.size, tile(21, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player){

            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                
                window.dialogs.show_dialog("Health potion collected", "");
                //console.log("Health Potion item collected");
                this.destroy();

                // update bomb count in inventory
                let y : number = window.inventory.get("Health Potion");
                let z : number = y + 1;
                window.inventory.set("Health Potion", z);
                window.music.item_pickup.play();
                
            }
        }
    }

}
