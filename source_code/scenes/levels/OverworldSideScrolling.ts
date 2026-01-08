/**
 * Overworld sidescrolling
 * 
 * Features:
 * (1) Platforming levels
 * (2) Parallax backgrounds
 * 
 * 
 * To Do:
 * (1) use levelBlocks array to dynamically change block object from static to dynamic for destruction physics
 * 
 * Bugs:
 * (1) Ground layer breaks on mobile browsers and doesn't render
 *      fix: make ground layer area much smaller and resize game level
 * (2) box block saving logic is buggy, and overwrites object name
 * 
 */

import * as LittleJS from 'littlejsengine';

const {EngineObject,setGravity,TileLayer,TileLayerData, Timer, rand,hsl,initTileCollision, setTileCollisionData,tile,vec2} = LittleJS;

import overMap from "./OverworldSideScrolling.json";
import { GenericItem } from '../items/GenericItem';
import {SideScrollerPlayerBox} from "../Characters/player";
import { Utils } from '../../singletons/Utils';


//import { Box2dObject, box2dEngineInit } from '../../singletons/box2d';
import {
  Box2dObject,
  box2dCreateFixtureDef,
  box2dCreatePolygonShape,
  box2dBodyTypeDynamic,
  box2dBodyTypeStatic
} from "../../singletons/box2d"; // adjust import path to your d.ts/js location


import { TILE_CONFIG } from './SpriteAtlas';


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
    
    // box2d box objects
    // for iteratively affecting all box objects
    levelBlocks : Box2dObject[] | null = [];

    //destruction timer - 10 seconds
    destTimer = new Timer(15); 
    LEVEL_DESTROY : boolean = false;

    //pathfinding 
    collisionGrid: number[][] = []; // for enemy navigation logic
    constructor(){
        super();
        setGravity(35); // apply global gravity

        //this.y = new ImageParallax(); // parallax testing

        //save current level to globals
        window.globals.current_level ="Overworld 2";
        this.loadMap();

        


        //this.renderOrder = 1001;
    }

    async loadMap(){
        try {

        
            console.log("Map width: %d", LevelSize.x, "/ Map Height:", LevelSize.y);


            this.tileLayer  = new TileLayer(vec2(0,0), LevelSize, tile(2, 128, 2, 0), vec2(1), 2); // create a tile layer for drawing the lvl

            initTileCollision(LevelSize);

            //depreciated draw time function
            //const drawMapTile = (pos : any, i = 80, layer : any, collision = 1) => {
            //    const tileIndex = i;
            //    const data = new TileLayerData(tileIndex);
            //    layer.setData(pos, data);
            //    if (collision) {
            //    setTileCollisionData(pos, collision);
            //    }
            //}

            // load level data as chunks
            this.ground_layer = this.chunkArray(overMap.layers[3].data ?? [], overMap.layers[3].width ?? 64).reverse();

            this.ground_layer.forEach((row, y) => {
                row.forEach((val : any, x : any) => {
                    val = parseInt(val, 10);
                    const pos = LittleJS.vec2(x, y);
                                                            const config = TILE_CONFIG[val];
                                        
                                                            if (!config) {
                                                                // Default behavior for undefined tiles
                                                                //this.drawMapTile(pos, val - 1, this.tileLayer!, 0);
                                                                return;
                                                            }
                                                            // Draw tile if configured
                                                            if (config.draw) {
                                                            this.drawMapTile(pos, val - 1, this.tileLayer!, config.collision ? 1 : 0);
                                                            }
                                        
                                                            // Spawn objects if configured
                                                            if (config.spawn) {
                                                                const spawned = config.spawn(pos, this);
                                                            // Handle single or multiple spawns
                                                            if (Array.isArray(spawned)) {
                                                                this.levelObjects?.push(...spawned);
                                                            }
                                                            else if (spawned) {
                                                                this.levelObjects?.push(spawned);
                                                            }
                                                            }
                                        
            })});
            
            // Draw the background elements    
            this.sky = new Sky();
            // texture index should either be 4,5 or 6
            
            this.parallax_1 = new SpriteParallaxLayer(1, 5,vec2(2));
            this.parallax_2 = new SpriteParallaxLayer(2, 4,vec2(4));
            this.tileLayer.redraw();

            
        
        }
        catch(err){
            console.error("Failed to Load Map: ", err);
        }

    }

    update(): void {
        if (!this.LEVEL_DESTROY && this.destTimer.elapsed()){
            this.destructionPhysics();
            this.LEVEL_DESTROY = true;
            return
        }
        else{
            return
        }
    }

    destructionPhysics() : void {
        // Features: 
        // (1) triggers destruction physics in all box2d node objects
        // (2) uses a timer to destroy the scene
        // (3) triggers camera shake on player object
        
        
        if (this.levelObjects != null){
            //console.log("Triggering level destruction physics");
            for (const i of this.levelObjects!){
                if (i && i instanceof Box2dObject && i.getIsStatic()){
                    i.setBodyType(box2dBodyTypeDynamic);
                }
            }
            // trigger player effects
             window.player.shakeCameraV1(1,0.5);
             window.globals.hp -=1;
        }
        else{
            return
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
       


        LittleJS.setGravity(0);// reset gravity
        this.LEVEL_DESTROY = true;//stop all processing logic
        LittleJS.engineObjects.length = 0; // clear existing objects
        
        // this is the only level where the save game function
        // needs to be called because there's no exit object
        // for this scene, exit is calculated based on the player posiition
        //Utils.saveGame();
    }

    drawChunks(chunks: any[], width: number, tileLayer : LittleJS.TileLayer, collision: number) {
                chunks.forEach(chunk => {
                    
                    // breaks here
                    const data = this.chunkArray(chunk, width).reverse();
                    
                    data.forEach((row: any, y: any) => {
                        row.forEach((val: any, x: any) => {
                            //console.log("x and y debug: ",x,"/",y);
                            val = parseInt(val, 10); // convert numbers to base 10
                            if (val) {
    
                                //console.log("val debug: ",val);
                                this.drawMapTile(vec2(x, y), val - 1, tileLayer, collision);
                            }
                        });
                    });
                });
            console.log("finished drawing chunk"); // works
        }
    
    chunkArray(array: number[], chunkSize: number) {
            /*
             * The function chunkArray takes an array of numbers & 
             * splits it into smaller chunks of a specified size.
             * 
             * It separates arrays into 30 size matrices as number[][]
             * each representing a different x and y dimentsion on the tilemap 
             */
    
            
            // algorithm helps loading the level data array as chunks
            const numberOfChunks = Math.ceil(array.length / chunkSize)
    
            return [...Array(numberOfChunks)]
                .map((value, index) => {
                    return array.slice(index * chunkSize, (index + 1) * chunkSize)
                })
        }
    
    drawMapTile(pos: LittleJS.Vector2, i : number = 1, layer: LittleJS.TileLayer, collision : number) {
                    
                    // docs:
                    // (1) tile index is the current tile to draw on the tile layer
                    //   it is mapped to e the environment layer's tilesheet
            
                    const tileIndex = i;
                    
                    const data = new TileLayerData(tileIndex);
                    
                    //console.log("tileset debug: ", tileIndex); //, "/ data: ", data
                    layer.setData(pos, data);
            
                    if (collision ) {
                        LittleJS.setTileCollisionData(pos,1);
            
                            // Record collision data in grid for enemy ai
                            // to do: (1) implement raycast for enemy ai 
                        if (this.collisionGrid)this.collisionGrid[pos.y][pos.x] = 1;
                            
                    }
    
                  
                    
                    
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

/**
 * Box 2D tiles physics
 * 
 * 
 */


// Example: create a dynamic box
// works
export function createBoxStatic(pos_ : LittleJS.Vector2, tile_ :number = 64) {
  //  console.log("creating box object")
  // position and size
  const pos = pos_.copy();
  const size = vec2(1);
  let tiles = tile_ -1; // subtract 1 from the tileset tile val 
  // Create a new Box2dObject
  const box = new Box2dObject(
    pos,          // position
    size,         // size
    tile(tiles,128,2),         // tileInfo (can be null if not using tiles)
    0,            // angle in radians
    LittleJS.WHITE,       // color
    box2dBodyTypeStatic // body type: static, kinematic, or dynamic
  );

  // Define a fixture for collisions
  const shape = box2dCreatePolygonShape([
    vec2(-0.5,-0.5),
    vec2(0.5,-0.5),
    vec2(0.5,0.5),
   vec2(-0.5,0.5),
  ]);
  const fixtureDef = box2dCreateFixtureDef(shape, 1.0, 0.5, 0.2, false);

  // Attach fixture to the box body
  box.addFixture(fixtureDef);

  return box;
}

export function createBoxDynamic(pos_ : LittleJS.Vector2, tile_ :number) {
  //  console.log("creating box object")
  // position and size
  const pos = pos_.copy();
  const size = vec2(1);
  let tiles = tile_ -1; // subtract 1 from the tileset tile val 
  // Create a new Box2dObject
  const box = new Box2dObject(
    pos,          // position
    size,         // size
    tile(tiles,128,2),         // tileInfo (can be null if not using tiles)
    0,            // angle in radians
    LittleJS.WHITE,       // color
    box2dBodyTypeStatic // body type: static, kinematic, or dynamic
  );

  // Define a fixture for collisions
  const shape = box2dCreatePolygonShape([
    vec2(-0.5,-0.5),
    vec2(0.5,-0.5),
    vec2(0.5,0.5),
   vec2(-0.5,0.5),
  ]);
  const fixtureDef = box2dCreateFixtureDef(shape, 1.0, 0.5, 0.2, false);

  // Attach fixture to the box body
  box.addFixture(fixtureDef);

  return box;
}


export function createRightTriangle(pos_ : LittleJS.Vector2) {
  //console.log("creating right triangle slping tile object");

  // position and size
  const pos = pos_.copy();//vec2(5);
  const size = vec2(1);

  //ccc
  // Create a new Box2dObject
  const triangle = new Box2dObject(
    pos,                 // position
    size,                // size
    tile(64,128,2),                // tileInfo or null
    0,                   // angle in radians
    LittleJS.WHITE,              // color
    box2dBodyTypeStatic // body type: static, kinematic, or dynamic
  );

  // Define a fixture for collisions - 3 points = right triangle
  const shape = box2dCreatePolygonShape([
    vec2(-0.5, -0.5),  // bottom-left
    vec2( 0.5, -0.5),  // bottom-right
    vec2(-0.5,  0.5),  // top-left  (forms a right angle at (-1,-1))
  ]);

  // mass=1.0, friction=0.5, restitution=0.2, isSensor=false
  const fixtureDef = box2dCreateFixtureDef(shape, 1.0, 0.5, 0.2, false);

  // Attach fixture to the body
  triangle.addFixture(fixtureDef);

  return triangle;
}

//here's a screenshot of the collision object not marked blue. fix the function so the collision covers the white tiles : 
export function createLeftTriangle(pos_: LittleJS.Vector2) {
  //console.log("creating left triangle sloping tile object");

  // position and size
  const pos = pos_.copy();
  const size = vec2(1);

  // Create a new Box2dObject
  const triangle = new Box2dObject(
    pos,                 // position
    size,                // size
    tile(62,128,2),      // tileInfo or null
    0,                   // angle in radians
    LittleJS.WHITE,      // color
    box2dBodyTypeStatic  // body type
  );

  // Define a fixture for collisions - 3 points = left triangle
  const shape = box2dCreatePolygonShape([
    vec2(-0.5, -0.5),  // bottom-left
    vec2( 0.5, -0.5),  // top-right
    vec2(0.5,  0.5),  // top-left (forms the right angle on the left side)
  ]);

  // mass=1.0, friction=0.5, restitution=0.2, isSensor=false
  const fixtureDef = box2dCreateFixtureDef(shape, 1.0, 0.5, 0.2, false);

  // Attach fixture to the body
  triangle.addFixture(fixtureDef);

  return triangle;
}

