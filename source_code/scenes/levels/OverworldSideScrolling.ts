/**
 * Overworld sidescrolling
 * 
 * Features:
 * (1) Platforming levels
 * (2) Parallax backgrounds
 * 
 * Bugs:
 * (1) Ground layer breaks on mobile browsers and doesn't render
 *      fix: make ground layer area much smaller and resize game level
 * 
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject,setGravity,TileLayer,TileLayerData, rand,hsl,initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;

import overMap from "./OverworldSideScrolling.json";
import { GenericItem } from '../items/GenericItem';
import {SideScrollPlayer} from "../Characters/player";
import { Utils } from '../../singletons/Utils';


//import { Box2dObject, box2dEngineInit } from '../../singletons/box2d';
import {
  Box2dObject,
  box2dCreateFixtureDef,
  box2dCreatePolygonShape,
  box2dBodyTypeDynamic,
} from "../../singletons/box2d"; // adjust import path to your d.ts/js location


let LevelSize = vec2(overMap.width, overMap.height); // get the level size

export class OverworldSideScrolling extends EngineObject {

    /**
     * Overworld Sidescrolling level
     * 
     * Features:
     * (1) Exit Collisions are the blank white tiles
     * (2) Sets scene gravity
     * 
     */


    //LevelSize: LittleJS.Vector2 | null = null; // get the level size
    tileLayer : LittleJS.TileLayer | null = null; // create a tile layer for drawing the lvl
    ground_layer: number[][] = []; // matrix data type

    // background elements
    sky : Sky | undefined;
    parallax_1 : SpriteParallaxLayer | undefined;
    parallax_2 : SpriteParallaxLayer | undefined;

    //spawned objects
    levelObjects : any[] | null = [];


    constructor(){
        super();
        setGravity(-.035); // apply global gravity

        //this.y = new ImageParallax(); // parallax testing
        this.loadMap();


        //this.renderOrder = 1001;
    }

    async loadMap(){
        try {

        
            console.log("Map width: %d", LevelSize.x, "/ Map Height:", LevelSize.y);


            this.tileLayer  = new TileLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0), vec2(1), 2); // create a tile layer for drawing the lvl

            initTileCollision(LevelSize);


            const drawMapTile = (pos : any, i = 80, layer : any, collision = 1) => {
                const tileIndex = i;
                const data = new TileLayerData(tileIndex);
                layer.setData(pos, data);
                if (collision) {
                setTileCollisionData(pos, collision);
                }
            }

            // load level data as chunks
            this.ground_layer = Utils.chunkArray(overMap.layers[3].data ?? [], overMap.layers[3].width ?? 64).reverse();

            this.ground_layer.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    if (val) {

                        // to do: create lookup logic for the ground layer tiles
                        // to doL create parallax background css logic for rhis layer
                        //console.log("overmap val debug : ", val);
                        
                        // temporary player spawn tile
                        if (val === 14){ // despawn fx tile as a temporary player spawner placeholder
                            window.player = new SideScrollPlayer(vec2(x,y));
                            this.levelObjects?.push(window.player);
                            return
                        }

                        if (val === 51){ // generic item object
                            const j = new GenericItem(vec2(x,y));
                            this.levelObjects?.push(j);
                            return
                        }
                        if (val === 63){ // corner tile
                            // testing box 2d implementation
                            //const w = new SlopeObject(vec2(x,y));
                            //return
                            drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                            createBox(); //box2d plugin testing // works
                            return
                        }

                        if (val === 64){ // corner tile 2
                            drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }

                        if (val === 65){ // corner tile 3
                        drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }
                        else{ // every other tile
                        drawMapTile(vec2(x, y), val - 1, this.tileLayer, 1);
                        }

                        //exit tile


                }})});
            
            // Draw the background elements    
            this.sky = new Sky();
            // texture index should either be 4,5 or 6
            //const o = new SpriteParallaxLayer(1, 6,vec2(5)); // tile 6 needs resizing
            this.parallax_1 = new SpriteParallaxLayer(1, 5,vec2(2));
            this.parallax_2 = new SpriteParallaxLayer(2, 4,vec2(4));
            this.tileLayer.redraw();

            // box 2d initialisation is buggy
            //const y = new SlopeObject();
            
        
        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

    }

    destroy(): void {
        // destroy all level objects and items 
        if (this.tileLayer) {
            this.tileLayer.destroy();
            this.sky?.destroy();
            this.parallax_1?.destroy();
            this.parallax_2?.destroy();
        }
        if (this.levelObjects){
            for (const i of this.levelObjects){
                i.destroy();
                
            }
            this.levelObjects = null;
        }


        setGravity(0);// reset gravity
    }

}



let skyColor : LittleJS.Color;
let levelColor = LittleJS.WHITE; //LittleJS.randColor(hsl(0,0,.5), hsl(0,0,.9));
class Sky extends EngineObject
{   // works
    seed : any;

    horizonColor;

    constructor() 
    {
        super();

        this.renderOrder = -1e4;
        this.seed = LittleJS.randInt(1e9);
        skyColor = hsl(0,0,.6);//LittleJS.GRAY//randColor(hsl(0,0,.5), hsl(0,0,.9));
        this.horizonColor = LittleJS.WHITE; //skyColor.subtract(hsl(0,0,.05,0)).mutate(.3);
    }


    render()
    {
        // fill background with a gradient
        const gradient = LittleJS.mainContext.createLinearGradient(0, 0, 0, LittleJS.mainCanvas.height);
        gradient.addColorStop(0, skyColor.toString());
        gradient.addColorStop(1, this.horizonColor.toString());
        LittleJS.mainContext.save();
        LittleJS.mainContext.fillStyle = gradient;
        LittleJS.mainContext.fillRect(0, 0, LittleJS.mainCanvas.width, LittleJS.mainCanvas.height);
        LittleJS.mainContext.globalCompositeOperation = 'lighter';
        
        // draw stars
        const random = new LittleJS.RandomGenerator(this.seed);
        for (let i=1e3; i--;)
        {
            const size = random.float(.5,2)**2;
            const speed = random.float() < .9 ? random.float(5) : random.float(9,99);
            const color = hsl(random.float(-.3,.2), random.float(), random.float());
            const extraSpace = 50;
            const w = LittleJS.mainCanvas.width+2*extraSpace, h = LittleJS.mainCanvas.height+2*extraSpace;
            const screenPos = vec2(
                (random.float(w)+LittleJS.time*speed)%w-extraSpace,
                (random.float(h)+LittleJS.time*speed*random.float())%h-extraSpace);
            LittleJS.mainContext.fillStyle = color.toString();
            LittleJS.mainContext.fillRect(screenPos.x, screenPos.y, size, size);
        }
       LittleJS. mainContext.restore();
    }
}

class ParallaxLayer extends EngineObject
// procedurally draws mountain range in the background
// little js example code
{
    index;
    canvas;
    context;

    constructor(index : number) 
    {
        super();

        const size = vec2(1024,512);
        this.size = size;
        this.index = index;
        this.renderOrder = -3e3 + index;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = size.x;
        this.canvas.height = size.y;

        // create a gradient
        const o1 = 40-20*index;
        const o2 = 100-30*index;
        const gradient = this.context!.createLinearGradient(0,size.y/2-o1,0,size.y/2+o2);
        const layerColor = levelColor.mutate(.1).lerp(skyColor,1-index*.15);
        gradient.addColorStop(0,layerColor.toString());
        gradient.addColorStop(1,layerColor.mutate(.5).scale(.1,1).toString());
        this.context!.fillStyle = gradient;

        // draw procedural mountains ranges
        let groundLevel = size.y/2, groundSlope = rand(-1,1);
        for (let i=size.x; i--;)
            this.context!.fillRect(i, groundLevel += groundSlope = rand() < .3 ? rand(1,-1) :
                groundSlope + (size.y/2 - groundLevel)/300, 1, size.y);
    }

    render()
    {
        // position layer based on camera distance from center of level
        const parallax = vec2(1e3,-100).scale(this.index**2);
        const cameraDeltaFromCenter = LittleJS.cameraPos
            .subtract(LevelSize.scale(.5))
            .divide(LevelSize.divide(parallax));
        const scale = this.size.scale(2+2*this.index);
        const pos = LittleJS.mainCanvasSize.scale(.5)         // center screen
           .add(vec2(-scale.x/2,-scale.y/2))         // center layer 
           .add(cameraDeltaFromCenter.scale(-.5))    // apply parallax
           .add(vec2(0,(this.index*.1)*this.size.y)); // separate layers
        
        // draw the parallax layer onto the main canvas
        LittleJS.mainContext.drawImage(this.canvas, pos.x, pos.y, scale.x, scale.y);
    }
}


class SpriteParallaxLayer extends EngineObject { // works
    /**
     * Features:
     * (1) draws a sprite based parallax background
     * (2) set the parallax effect using the index number
     * 
     */
    index: number;
    tileInfo: LittleJS.TileInfo;

    constructor(index: number, textureIndex: number, spriteSize: LittleJS.Vector2) {
        super();
        this.index = index;
        this.renderOrder = -3e3 + index;  // furthest back draws first

        // Store tile info for the sprite
        this.tileInfo = tile(0, vec2(256,242),textureIndex, 0); // texture index should either be 4,5 or 6
        this.size = vec2(1024,512); // sprite’s native size (in world units, we’ll scale later)
    }

    render() {
        // Position layer based on camera
        const parallax = vec2(1000, -100).scale(this.index ** 2);
        const cameraDeltaFromCenter = LittleJS.cameraPos
            .subtract(LevelSize.scale(0.5))
            .divide(LevelSize.divide(parallax));

        // Scale sprite for this layer
        const scale = this.size.scale(2 + 2 * this.index);

        // Calculate screen position
        const pos = LittleJS.mainCanvasSize.scale(0.5)             // center screen
            .add(vec2(-scale.x / 2, -scale.y / 2))        // center sprite
            .add(cameraDeltaFromCenter.scale(-0.5))       // parallax shift
            .add(vec2(0, (this.index * 0.1) * this.size.y)); // vertical separation


        const texInfo = LittleJS.textureInfos[this.tileInfo.textureIndex];
        // Draw the sprite texture
        LittleJS.mainContext.drawImage(
            texInfo.image,
            pos.x, pos.y,
            scale.x, scale.y
        );
    }
}



class SlopeObject extends EngineObject{
    // box2d object documentation
    //documentation : https://github.com/KilledByAPixel/LittleJS/blob/main/examples/box2d/gameObjects.js#L320

    constructor(pos : LittleJS.Vector2){
        //box2dEngineInit()
        super();
        this.size = vec2(5); // where 5 is diameter
        this.pos = pos; //vec2 (5,3.5);
        //box2dEngineInit();
        const o = new Box2dObject(this.pos, this.size, tile(64,128,2) , 0, LittleJS.RED, 1);
        //o.addCircle(5);
        o.addBox(this.size, vec2(),0,0,1, .5,.2);
        //return o;
    }
}


// Example: create a dynamic box
// works
function createBox() {
    console.log("creating box object")
  // position and size
  const pos = vec2(5);
  const size = vec2(5);

  // Create a new Box2dObject
  const box = new Box2dObject(
    pos,          // position
    size,         // size
    null,         // tileInfo (can be null if not using tiles)
    0,            // angle in radians
    "blue",       // color
    box2dBodyTypeDynamic // body type: static, kinematic, or dynamic
  );

  // Define a fixture for collisions
  const shape = box2dCreatePolygonShape([
    vec2(-1,-1),
    vec2(1,-1),
    vec2(1,1),
   vec2(-1,1),
  ]);
  const fixtureDef = box2dCreateFixtureDef(shape, 1.0, 0.5, 0.2, false);

  // Attach fixture to the box body
  box.addFixture(fixtureDef);

  return box;
}