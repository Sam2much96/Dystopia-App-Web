import * as LittleJS from 'littlejsengine';

const {EngineObject,vec2, drawTile, tile, isOverlapping} = LittleJS;

export class Items extends EngineObject {
    /**
     * 
     * Core Items Class, Expanded by All Game Items
     * 
     * to do:
     * (1) lock all core item behaviour into this class object
     * (2) replace all the items boilerplate script with this code base class
     */
    name  : string ;
    amount : number = 1;
    tileIndx : number;
    collect_diag : string;
    despawn : boolean = false;
    constructor(posi : LittleJS.Vector2, tileIndx : number = 50, name : string = "Generic Item"){

        super()
        this.tileInfo = tile(tileIndx, 128, 2, 4); // set coin tile 22
        this.pos = posi;
        this.size = vec2(0.7);  
        this.name = window.dialogs.t(name);
        this.tileIndx = tileIndx; // set the tile index (frame number) to render
        // tranlated item collected dialogue
        this.collect_diag = (this.name) + " " + window.dialogs.t("obtained", window.dialogs.language) + " x " + this.amount.toString();


    }

    render(){
    
        drawTile(this.pos, this.size, tile(this.tileIndx, 128, 2, 0), this.color, 0, this.mirror);
    }

    update(){
        // add an idle animation to the item object
        //this.pos =  vec2(-5, 2*Math.abs(Math.sin(LittleJS.time*2*LittleJS.PI)));

        if (window.player && !this.despawn){
            // set player collision to coin object
            // set coin idle animation
            if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)) {
                // to do:
                // (1) implement diag translation functionality (done)
                
                window.dialogs.show_dialog("",`${this.collect_diag}`); // to do: should ideally be item hud, requires implement stats hud for item collect
                
                // add the item to the inventory
                //window.music.item_pickup.play();
                window.music.item_collected.play();

                // update item count in inventory
                let y : number = window.inventory.get(this.name);
                let z : number = y + this.amount;
                window.inventory.set(this.name, z);
                

                //console.log("coin collected, creating atc txn");
                this.destroy();
                this.despawn = true;
                return


                // to do : 
                // (1) implement game coin render
                // (2) implement game coin price statistics calculation
                
            }
        }
        else return
    }
}