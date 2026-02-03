/**
 * EnemyPathfinding
 * 
 * Handles A* pathfinding navigation for enemy entities
 * Features:
 * - Path calculation using A* algorithm
 * - Smooth path following with interpolation
 * - Path update timing
 * - Debug visualization
 */

import * as LittleJS from 'littlejsengine';
import { aStarV1 } from "../../UI & misc/Pathfinding";
import { OverWorld } from '../../levels/OverworldTopDown';
import { TempleInterior } from '../../levels/TempleInterior';

const { vec2, drawLine, Timer } = LittleJS;

export class EnemyPathfinding {
    private path: [number, number][] = [];
    private currentPathIndex: number = 0;
    private segmentProgress: number = 0;
    private pathTimer: LittleJS.Timer = new Timer();
    private pathTimeout: number = 30;
    private debugPath: boolean = false;
    private isPathValid: boolean = false;

    constructor(pathTimeout: number = 30, debugMode: boolean = false) {
        this.pathTimeout = pathTimeout;
        this.debugPath = debugMode;
    }

    /**
     * Calculate a new path from start to goal position
     */
    public calculatePath(
        startPos: LittleJS.Vector2, 
        goalPos: LittleJS.Vector2
    ): boolean {
        // Only works on specific map types
        if (!(window.map instanceof OverWorld || window.map instanceof TempleInterior)) {
            return false;
        }

        const start: [number, number] = [startPos.x, startPos.y];
        const goal: [number, number] = [goalPos.x, goalPos.y];

        const newPath = aStarV1(window.map.collisionGrid, start, goal);

        if (newPath && newPath.length > 0) {
            this.path = newPath;
            this.currentPathIndex = 0;
            this.segmentProgress = 0;
            this.isPathValid = true;
            return true;
        }

        this.isPathValid = false;
        return false;
    }

    /**
     * Move along the calculated path
     * Returns the new position or null if path is complete/invalid
     */
    public followPath(
        currentPos: LittleJS.Vector2, 
        delta: number
    ): { position: LittleJS.Vector2; direction: { x: number; y: number } } | null {
        if (!this.path || this.path.length < 2 || !this.isPathValid) {
            return null;
        }

        // Path completed
        if (this.currentPathIndex >= this.path.length - 1) {
            return null;
        }

        // Get current segment
        const start = vec2(...this.path[this.currentPathIndex]);
        const end = vec2(...this.path[this.currentPathIndex + 1]);

        // Calculate segment properties
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);

        if (segmentLength === 0) {
            this.currentPathIndex++;
            this.segmentProgress = 0;
            return this.followPath(currentPos, delta);
        }

        // Calculate movement speed
        const totalPathLength = this.calculateTotalPathLength();
        const pathSpeed = totalPathLength / this.pathTimeout;

        // Update progress
        this.segmentProgress += (pathSpeed * delta) / segmentLength;

        if (this.segmentProgress >= 1) {
            // Move to next segment
            this.currentPathIndex++;
            this.segmentProgress = 0;

            // Check if path complete
            if (this.currentPathIndex >= this.path.length - 1) {
                return {
                    position: end.copy(),
                    direction: { x: dx, y: dy }
                };
            }
        }

        // Interpolate position
        const newPos = vec2(
            start.x + dx * this.segmentProgress,
            start.y + dy * this.segmentProgress
        );

        return {
            position: newPos,
            direction: { x: dx, y: dy }
        };
    }

    /**
     * Check if path needs updating
     */
    public needsUpdate(): boolean {
        if (!this.isPathValid) {
            return true;
        }

        if (!this.pathTimer.active()) {
            this.pathTimer.set(this.pathTimeout);
            return false;
        }

        return this.pathTimer.elapsed();
    }

    /**
     * Force path recalculation
     */
    public invalidatePath(): void {
        this.isPathValid = false;
        this.currentPathIndex = 0;
        this.segmentProgress = 0;
    }

    /**
     * Draw debug visualization
     */
    public renderDebug(): void {
        if (!this.debugPath || !this.path || this.path.length < 2) {
            return;
        }

        for (let i = 0; i < this.path.length - 1; i++) {
            drawLine(
                vec2(...this.path[i]), 
                vec2(...this.path[i + 1]), 
                0.05, 
                LittleJS.RED
            );
        }
    }

    /**
     * Get current path progress (0-1)
     */
    public getProgress(): number {
        if (!this.path || this.path.length === 0) {
            return 0;
        }

        const totalSegments = this.path.length - 1;
        if (totalSegments === 0) return 1;

        return (this.currentPathIndex + this.segmentProgress) / totalSegments;
    }

    /**
     * Check if currently following a valid path
     */
    public hasValidPath(): boolean {
        return this.isPathValid && this.path.length > 1;
    }

    /**
     * Get remaining distance on path
     */
    public getRemainingDistance(): number {
        if (!this.path || this.path.length < 2) {
            return 0;
        }

        let distance = 0;

        // Add remaining current segment
        if (this.currentPathIndex < this.path.length - 1) {
            const start = this.path[this.currentPathIndex];
            const end = this.path[this.currentPathIndex + 1];
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            const segmentLength = Math.sqrt(dx * dx + dy * dy);
            distance += segmentLength * (1 - this.segmentProgress);
        }

        // Add remaining segments
        for (let i = this.currentPathIndex + 1; i < this.path.length - 1; i++) {
            const start = this.path[i];
            const end = this.path[i + 1];
            const dx = end[0] - start[0];
            const dy = end[1] - start[1];
            distance += Math.sqrt(dx * dx + dy * dy);
        }

        return distance;
    }

    private calculateTotalPathLength(): number {
        return this.path
            .slice(0, this.path.length - 1)
            .reduce((sum, p, i) => {
                const next = this.path[i + 1];
                const dx = next[0] - p[0];
                const dy = next[1] - p[1];
                return sum + Math.sqrt(dx * dx + dy * dy);
            }, 0);
    }
}