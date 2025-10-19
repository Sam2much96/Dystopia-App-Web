import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;


export class Arrow extends EngineObject{
    /**
     * 
     * Game Arrow Object
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * (3) implement bullet object for implementing the arrow item's item use
     * (4) implement translated item collect dialogue
     * (5) implement an item base class for ease of update
     * 
     * 
     */
    public collect_diag : String ;
    private amount : number = 1;
    constructor(posi : LittleJS.Vector2){

        super()
        //this.tileInfo = tile(22, 128, 1, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  
        // tranlated item collected dialogue
        this.collect_diag = window.dialogs.t("Arrow") + " " + window.dialogs.t("obtained") + " x " + this.amount.toString();
    }

    render(){
        drawTile(this.pos, this.size, tile(23, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player){

            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                
                
                window.dialogs.show_dialog("",this.collect_diag.toString());
                //console.log("Arrow item collected");
                this.destroy();

                // update bomb count in inventory
                let y : number = window.inventory.get("Arrow");
                let z : number = y + 1;
                window.inventory.set("Arrow", z);
                window.music.item_pickup.play();
                
            }
        }
    }

}
