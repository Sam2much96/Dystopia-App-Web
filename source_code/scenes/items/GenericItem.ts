import * as LittleJS from 'littlejsengine';

const {EngineObject,vec2, drawTile, tile, isOverlapping} = LittleJS;

import { Items } from './Items';

export class GenericItem extends Items{

    constructor(posi: LittleJS.Vector2, tileIndex = 50){
        super(posi, tileIndex);
    }
    
}
