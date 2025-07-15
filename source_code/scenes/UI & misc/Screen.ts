
import * as LittleJS from 'littlejsengine';

const {EngineObject, Color, setCameraPos, setCameraScale} = LittleJS;

class Screen extends EngineObject {
// screen class extension



    constructor(){
    super();
    console.log("Screen Optimisation Logic run >>");
    this.color = new Color(0, 0, 0, 0); // make object invisible
}

update(){

    
    if (window.player) {

        // Track player
        // set camera position to player position
        setCameraPos(window.player.pos);
        setCameraScale(128);  // zoom camera to 128 pixels per world unit
    }

    }
}
