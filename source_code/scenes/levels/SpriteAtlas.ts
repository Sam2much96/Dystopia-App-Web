/**
 * 
 * Working Sprite Atlas
 * 
 * Features:
 * (1) locks all sprite behavious an objects into 1 script
 * (2) reduces rendering code boilder plate for 2d levels
 * 
 * To DO:
 * (1) Add player and enemy sprite to the tile atlas (done)
 * (2) Implement Sprite atlas in all 2d levels (1/2)
 * 
 */

import * as LittleJS from 'littlejsengine';
import {Bomb} from "../items/Bomb";
import {Coins} from "../items/Coins";
import { HealthPotion } from '../items/Extralife';
import { Bow} from "../items/Bow";
import { Arrow } from '../items/Arrow';
import { GenericItem } from '../items/GenericItem';
import {Ring} from "../items/Ring";
import {SideScrollerPlayerBox, TopDownPlayer} from "../Characters/player";
import {Enemy} from "../Characters/enemy";
import {Merchant, OldWoman, Shaman} from "../Characters/NPC";
import {EnemySpawner} from "../UI & misc/Enemyspawner";
//import {Utils} from "../../singletons/Utils";
import { Signpost } from '../items/Signpost';
import {Hole, House1, House2, TempleDoor, Spaceship1, Spaceship2, Stairs} from "../UI & misc/Exit";

//tile obeject functions using box 2d physics
import { createLeftTriangle,createBoxStatic,createRightTriangle,createBoxDynamic } from './OverworldSideScrolling';

// Tile type definitions
type TileConfig = {
  collision: boolean;
  spawn?: (pos: LittleJS.Vector2, context: any) => any | any[];
  draw?: boolean;
};



// Configuration map for all tiles
export const TILE_CONFIG: Record<number, TileConfig> = {
  // Desert dune textures
  1: { collision: false, draw: true },
  
  // Skull head
  2: { collision: true, draw: true },
  
  // Signpost object
  3: { 
    collision: false,
    spawn: (pos) => new Signpost(pos)
  },
  
  // Hole object
  4: { 
    collision: false,
    spawn: (pos) => new Hole(pos)
  },
  // to do: (1) grass and flower objects are unimplemented in web build
  
  // Boulder
  8: { collision: true, draw: true },
  
  // small tree
  9:{collision : false, draw : true}, 
  // group of Trees
  10: { collision: true, draw: true },
  
  // Mushroom big
  11: { collision: true, draw: true },
  
  // Mushroom small
  12: { collision: true, draw: true },
  
  //tall grass
  13:{collision : false, draw: true},

  // smoke tile, should spawn a modified version of smoke fx
  14: { 
    collision: false,
    draw : true,
  },
  
  // Temple exterior tiles (15-20)
  15: { collision: true, draw: true },
  16: { collision: true, draw: true },
  17: { collision: true, draw: true },
  18: { collision: true, draw: true },
  19: { collision: true, draw: true },
  20: { collision: true, draw: true },
  
  // Bomb
  21: { 
    collision: false,
    spawn: (pos) => new Bomb(pos)
  },
  
  // Health potion
  22: { 
    collision: false,
    spawn: (pos) => new HealthPotion(pos)
  },
  
  // Coins
  23: { 
    collision: false,
    spawn: (pos) => new Coins(pos)
  },
  
  // Arrow
  24: { 
    collision: false,
    spawn: (pos) => new Arrow(pos)
  },
  
  // Bow
  25: { 
    collision: false,
    spawn: (pos) => new Bow(pos)
  },
  
  // Blood Splatter fx
  26: { 
    collision: false,
    draw: false
  },
  // 27- water bottle item (to do)
  
  // Ring
  28: { 
    collision: false,
    spawn: (pos) => new Ring(pos)
  },
  
  // Temple exterior tiles (29-34)
  29: { collision: true, draw: true },
  30: { collision: true, draw: true },
  31: { collision: true, draw: true },
  32: { collision: true, draw: true },
  33: { collision: true, draw: true },
  34: { collision: false, draw: true },
  
  // Enemy spawner
  35: { 
    collision: false,
    spawn: (pos) => new EnemySpawner(pos, true)
  },
  // sidescrolling player
  41: {
    collision : false,
    spawn : (pos, context) => {
      const player = new SideScrollerPlayerBox(pos);
      window.player = player;
      return [player];
    }
  },

  // Shaman NPC
  42: {
    collision : false,
    spawn : (pos) => new Shaman(pos)
  },
  
  // Temple tiles (43-48)
  43: { collision: false, draw: true },
  44: { collision: false, draw: true },
  
  // Temple door
  45: { 
    collision: false,
    spawn: (pos) => new TempleDoor(pos.add(LittleJS.vec2(0.45, 0.5)))
  },
  
  46: { collision: false, draw: true },
  47: { collision: false, draw: true },
  48: { collision: false, draw: true },
  
  // House 1
  49: { 
    collision: false,
    spawn: (pos) => new House1(pos)
  },
  
  // House 2
  50: { 
    collision: false,
    spawn: (pos) => new House2(pos)
  },
  
  // Generic item
  51: { 
    collision: false,
    spawn: (pos) => new GenericItem(pos)
  },
  // player spawner
  52: {
    collision : false,
    spawn: (pos, context) => {
      const player = new TopDownPlayer(pos);
      window.player = player;
      //const npc = new OldWoman(pos.add(LittleJS.vec2(8, 6)));
      return [player];
    }
  },
  // enemy spawner
  53: {
    collision : false,
    spawn : (pos) => new Enemy(pos)
  },
  // NPC Merchant
  54: {
    collision : false,
    spawn : (pos) => new Merchant(pos)
  },
  // old woman NPC
  55: {
    collision : false,
    spawn :  (pos) => new OldWoman(pos)
  },

  // Stairs
  56: { collision: false, 
    spawn : (pos) => new Stairs(pos)
  },
  
  // More temple tiles
  57: { collision: true, draw: true },
  58: { collision: false, draw: true },
  59: { collision: false, draw: true },
  60: { collision: true, draw: true },
  61: { collision: true, draw: true },
  62: { collision: true, draw: true },

  //sidescrolling corner tiles
  63: {collision : false,
      spawn : (pos, context) => {
        const h = createLeftTriangle(pos);
        return h
      }
  },

  //side scrolling box tiles
  64: {
    collision : false,
    spawn : (pos, context) => {
      const k = createBoxStatic(pos);
      return k;
    }
  },
  // right angle triangle
  65:{
    collision : false,
    spawn : (pos, context ) =>{
      const l = createRightTriangle(pos);
      return l;
    }
  },

  // sidescrolling black tiles
  66: {
    collision : false,
    spawn : (pos, context ) => {
      const m = createBoxDynamic(pos, 66);
      return m;
    }
  },
  //sidescrolling corner black tiles 1
  67 : {
    collision : false,
    spawn : (pos, context) => {
      const n = createBoxDynamic(pos,67);
      return n;
    }
  },
  // sidescrolling corner black tiles 2
  68 : {
    collision : false,
    spawn : (pos, context) => {
      const o = createBoxDynamic(pos,68);
      return 0;
    }
  },

  // Temple Interior Tiles
  69: {collision : false, draw: true},

  //Temple interior walls
  70: {collision : true, draw : true},

  
  // Temple edges (no collision)
  71: { collision: false, draw: true },
  72: { collision: false, draw: true },
  
  // More temple tiles
  73: { collision: true, draw: true },
  75: { collision: true, draw: true },
  76: { collision: true, draw: true },
  85: { collision: true, draw: true },
  86: { collision: true, draw: true },
  87: { collision: true, draw: true },
  88: { collision: true, draw: true },
  89: { collision: true, draw: true },
  90: { collision: true, draw: true },
  
  // Spaceship exits
  97: { 
    collision: false,
    spawn: (pos) => new Spaceship1(pos)
  },
  
  98: { 
    collision: false,
    spawn: (pos) => new Spaceship2(pos)
  },
};


// Helper function to create tile ranges
export function createTileRange(start: number, end: number, config: TileConfig): Record<number, TileConfig> {
  const range: Record<number, TileConfig> = {};
  for (let i = start; i <= end; i++) {
    range[i] = config;
  }
  return range;
}
