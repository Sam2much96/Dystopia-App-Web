// pathfinding algorithms in typescript
// features:
// (1) computationally expensive
// (2) generally untested
// to do:
// (1) optimise for mobile preformance. i.e. don't call every frame and replace open.sort() with a priority queue
// (2) generate visual display for path if necessary to debug
// (3) connect a* movement logic to player character and Dijsktra movement logic to NPC characters
// note:
// (1) godot's navigation layer uses astar pathfinding for navigation, audit both code logics in the mobile and web build for similar behaviours
// (2) implement enemy collision for better movement behaviour in environment

import * as LittleJS from 'littlejsengine';

const {vec2, TileLayerData, EngineObject, drawTile, tile,setTileCollisionData} = LittleJS;

type Node = {
  x: number;
  y: number;
  cost: number; // movement cost from start
  heuristic: number; // estimated cost to goal
  total: number; // cost + heuristic
  parent?: Node;
};

type Grid = number[][]; // 0 = walkable, 1 = obstacle

// Utility: Manhattan distance (good for 4-direction grids)
function heuristic(a: Node, b: Node): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

// Get neighbors (up, down, left, right)
// works
function getNeighborsV1(node: Node, grid: Grid): Node[] {
  const dirs = [
    [0, -1], [0, 1], [-1, 0], [1, 0],
  ];
  const neighbors: Node[] = [];

  for (const [dx, dy] of dirs) {
    const x = node.x + dx;
    const y = node.y + dy;
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length && grid[y][x] === 0) {
      neighbors.push({ x, y, cost: 0, heuristic: 0, total: 0 });
    }
  }
  return neighbors;
}

/** 
 * Get neighbors spaced by tileSize in world coordinates.
 * Example: if tileSize = 128, neighbors are 128 px apart.
 */
//depreciated
// buggy
function getWorldNeighbors(node: Node, grid: Grid, tileSize: number = 128): Node[] {
  const dirs = [
    [0, -1], [0, 1], [-1, 0], [1, 0]
  ];
  const neighbors: Node[] = [];

  for (const [dx, dy] of dirs) {
    const x = node.x + dx * tileSize;
    const y = node.y + dy * tileSize;

    // Check bounds and collision grid
    const gx = Math.floor(x / tileSize);
    const gy = Math.floor(y / tileSize);

    if (
      gy >= 0 && gy < grid.length &&
      gx >= 0 && gx < grid[0].length &&
      grid[gy][gx] === 0
    ) {
      neighbors.push({ x, y, cost: 0, heuristic: 0, total: 0 });
    }
  }
  return neighbors;
}


// Reconstruct path after reaching goal
function reconstructPath(node: Node): [number, number][] {
  const path: [number, number][] = [];
  let current: Node | undefined = node;
  while (current) {
    path.unshift([current.x, current.y]);
    current = current.parent;
  }
  return path;
}

/** A star pathfinding algorithm */
// Non-LJS Implementation
// to do:
// (1) Code only runs once and cannot run multiple tiles
// (2) implement djiskra pathfinding

export function aStarV1(grid: Grid, 
  start: [number, number], 
  goal: [number, number]): [number, number][] | null {
  
  //console.log("astar v1 path finding triggered"); //works
  //console.log("start: ",start," goal: ", goal)
  const open: Node[] = [];
  const closed = new Set<string>();

  const startNode: Node = { x: start[0], y: start[1], cost: 0, heuristic: 0, total: 0 };
  open.push(startNode);

  while (open.length > 0) {
   // console.log("length debug: ",length); // the length is 2

    // Sort by total cost (like priority queue)
    open.sort((a, b) => a.total - b.total);
    const current = open.shift()!;
    const key = `${current.x},${current.y}`;
    closed.add(key);

    // Goal check
    if (current.x === goal[0] && current.y === goal[1]) {
      //console.log("goal check debug: ", goal); // works
      return reconstructPath(current);
    }

    for (const neighbor of getNeighborsV1(current, grid)) {
     // console.log("neigbour check debug"); // triggers
      const nKey = `${neighbor.x},${neighbor.y}`;
      if (closed.has(nKey)) continue;

      //console.log("neighbour check 2 debug"); //triggers
      const g = current.cost + 1;
      const h = heuristic(neighbor, { x: goal[0], y: goal[1], cost: 0, heuristic: 0, total: 0 });
      const total = g + h;

      // works
      // calculated different totals
      //console.log("total debug: ", total);
      const existing = open.find(n => n.x === neighbor.x && n.y === neighbor.y);
      if (!existing || g < existing.cost) {
        //console.log("neighbour check 3 debug "); // works
        neighbor.cost = g;
        neighbor.heuristic = h;
        neighbor.total = total;
        neighbor.parent = current;
        if (!existing) {
          open.push(neighbor)
          
          //console.log("neighbour debug 4"); // works
        };
      }
    }
    //console.log("loop endend");
  }
  console.log("No path found from", start, "to", goal);

  return null; // no path found, return null.
}

/** A* in world-space coordinates */
//does not work
// astar implementation, littlejs fork
export function aStar(
  grid: Grid,
  start: LittleJS.Vector2,
  goal: LittleJS.Vector2,
  tileSize: number = 128
): [number, number][] | null {

  const open: Node[] = [];
  const closed = new Set<string>();

  const startNode: Node = { x: start.x, y: start.y, cost: 0, heuristic: 0, total: 0 };
  open.push(startNode);

  while (open.length > 0) {
    open.sort((a, b) => a.total - b.total);
    const current = open.shift()!;
    const key = `${current.x},${current.y}`;
    closed.add(key);

    // Goal check (close enough in world distance)
    if (heuristic(current, { x: goal.x, y: goal.y, cost: 0, heuristic: 0, total: 0 }) < tileSize * 0.5) {
      return reconstructPath(current);
    }

    for (const neighbor of getWorldNeighbors(current, grid, tileSize)) {
      const nKey = `${neighbor.x},${neighbor.y}`;
      if (closed.has(nKey)) continue;

      const g = current.cost + tileSize;
      const h = heuristic(neighbor, { x: goal.x, y: goal.y, cost: 0, heuristic: 0, total: 0 });
      const total = g + h;

      const existing = open.find(n => n.x === neighbor.x && n.y === neighbor.y);
      if (!existing || g < existing.cost) {
        neighbor.cost = g;
        neighbor.heuristic = h;
        neighbor.total = total;
        neighbor.parent = current;
        if (!existing) open.push(neighbor);
      }
    }
  }

  return null;
}

/** Dijkstra Pathfinding algorithm  v1*/
export function dijkstra(grid: Grid, start: [number, number], goal: [number, number]) {
  // Dijkstra is just A* with heuristic = 0
  const heuristicBackup = heuristic;
  (globalThis as any).heuristic = () => 0;
  const path = aStarV1(grid, start, goal);
  (globalThis as any).heuristic = heuristicBackup;
  return path;
}



/**
 * Usage Example:
 * 
 const grid = [
  [0, 0, 0, 1, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0],
];

const start: [number, number] = [0, 0];
const goal: [number, number] = [4, 2];

console.log("A* Path:", aStar(grid, start, goal));
console.log("Dijkstra Path:", dijkstra(grid, start, goal));
 * 
 * 
 */