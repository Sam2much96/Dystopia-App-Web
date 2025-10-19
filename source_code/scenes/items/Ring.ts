import * as LittleJS from 'littlejsengine';

const {EngineObject, vec2, drawTile, tile, isOverlapping} = LittleJS;

export class Ring extends EngineObject {
    /**
     * 
     * Ring Item (collect)
     * 
     * Features:
     * (1) A collectible ring item
     * 
     * TO DO:
     * (1) parse item collect to status queue ui
     * (2) port status queue ui from godot to typescript
     * 
     */
    public collect_diag : String ;
    private amount : number = 1;
    constructor(posi : LittleJS.Vector2){

        super()
        this.pos = posi;
        this.size = vec2(0.5);  
        // tranlated item collected dialogue
        this.collect_diag = window.dialogs.t("Ring", window.dialogs.language) + " " + window.dialogs.t("obtained", window.dialogs.language) + " x " + this.amount.toString();


    }

    render(){
        drawTile(this.pos, this.size, tile(27, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){

        if (window.player){

            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                // to do:
                // (1) implement status text hud
                // (2) parse all item use implementations through status use hud (done)
                // (3) add ring translation to translation csv (done)
                //window.dialogs.show_dialog("Ring collected", "");
                window.dialogs.show_dialog("",this.collect_diag.toString());
                //console.log("Generic item collected");
                this.destroy();

                // update ring count in inventory
                let y : number = window.inventory.get("Ring");
                let z : number = y + this.amount;
                window.inventory.set("Ring", z);
                window.music.item_pickup.play();
                
            }
        }
    }
}
