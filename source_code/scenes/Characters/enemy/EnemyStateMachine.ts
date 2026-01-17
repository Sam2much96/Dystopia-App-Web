/**
 * EnemyStateMachine
 * 
 * Manages enemy AI states and transitions
 * Decouples state logic from the main Enemy class
 */

import * as LittleJS from 'littlejsengine';
import { Utils } from '../../../singletons/Utils';

const { vec2 } = LittleJS;

export enum EnemyState {
    IDLE = 0,
    WALKING = 1,
    ATTACK = 2,
    ROLL = 3,
    DIE = 4,
    HURT = 5,
    MOB = 6,
    PROJECTILE = 7,
    PLAYER_SIGHTED = 8,
    PLAYER_HIDDEN = 9,
    NAVIGATION_AI = 10
}

export enum FacingDirection {
    UP = 0,
    DOWN = 1,
    LEFT = 2,
    RIGHT = 3
}

export interface EnemyStateContext {
    pos: LittleJS.Vector2;
    speed: number;
    player: any;
    playAnimation: (frames: number[]) => void;
    setMirror: (mirrored: boolean) => void;
    onPlayerHit: (direction: LittleJS.Vector2) => void;
    onDeath: () => void;
}

export class EnemyStateMachine {
    private currentState: EnemyState = EnemyState.IDLE;
    private context: EnemyStateContext;
    private direction: LittleJS.Vector2 = vec2(0);
    private facingDirection: FacingDirection = FacingDirection.DOWN;

    // Animation frames
    private animations = {
        runUp: [28, 29, 30, 31],
        runDown: [20, 21, 22, 23],
        runLeft: [24, 25, 26, 27],
        runRight: [24, 25, 26, 27],
        attackUp: [6, 7, 8],
        attackDown: [0, 1, 2],
        attackLeft: [3, 4, 5],
        attackRight: [3, 4, 5],
        despawn: [9, 11, 13, 9, 11, 13]
    };

    constructor(context: EnemyStateContext) {
        this.context = context;
    }

    public getCurrentState(): EnemyState {
        return this.currentState;
    }

    public changeState(newState: EnemyState): void {
        this.currentState = newState;
    }

    public getDirection(): LittleJS.Vector2 {
        return this.direction;
    }

    public getFacingDirection(): FacingDirection {
        return this.facingDirection;
    }

    /**
     * Execute current state logic
     */
    public update(): void {
        switch (this.currentState) {
            case EnemyState.IDLE:
                this.handleIdle();
                break;
            case EnemyState.MOB:
                this.handleMob();
                break;
            case EnemyState.ATTACK:
                this.handleAttack();
                break;
            case EnemyState.DIE:
                this.handleDie();
                break;
            case EnemyState.PLAYER_SIGHTED:
                this.handlePlayerSighted();
                break;
            case EnemyState.PLAYER_HIDDEN:
                this.handlePlayerHidden();
                break;
            case EnemyState.NAVIGATION_AI:
                // Handled externally by pathfinding
                break;
        }
    }

    /**
     * Update facing direction based on movement
     */
    public updateFacing(dx: number, dy: number): void {
        const absX = Math.abs(dx);
        const absY = Math.abs(dy);

        // Determine primary direction
        if (absX > absY) {
            // Horizontal movement dominant
            this.facingDirection = dx > 0 ? FacingDirection.RIGHT : FacingDirection.LEFT;
        } else if (absY > 0) {
            // Vertical movement dominant
            this.facingDirection = dy > 0 ? FacingDirection.UP : FacingDirection.DOWN;
        }

        this.applyFacingAnimation();
    }

    /**
     * Update facing for navigation (different coordinate mapping)
     */
    public updateFacingForNavigation(dx: number, dy: number): void {
        if (dx === 0 && dy === 1) {
            this.facingDirection = FacingDirection.RIGHT;
        } else if (dx === 1 && dy === 0) {
            this.facingDirection = FacingDirection.UP;
        } else if (dx === -1 && dy === 0) {
            this.facingDirection = FacingDirection.DOWN;
        } else if (dx === 0 && dy === -1) {
            this.facingDirection = FacingDirection.LEFT;
        }

        this.applyFacingAnimation();
    }

    private handleIdle(): void {
        // Idle behavior - could add idle animations here
    }

    private handleMob(): void {
        if (!this.context.player) return;

        // Calculate direction to player
        this.direction = Utils.restaVectores(
            this.context.player.pos,
            this.context.pos
        );

        const length = Math.hypot(this.direction.x, this.direction.y);

        if (length > 10.0) {
            // Normalize direction
            this.direction.x /= length;
            this.direction.y /= length;

            // Update facing
            const roundedX = Math.round(this.direction.x);
            const roundedY = Math.round(this.direction.y);
            this.updateFacing(roundedX, roundedY);

            // Move towards player
            this.context.pos.x += this.direction.x * this.context.speed;
            this.context.pos.y += this.direction.y * this.context.speed;
        }
    }

    private handleAttack(): void {
        // Play attack animation based on facing
        this.playAttackAnimation();

        // Trigger player hit
        const attackDir = vec2(
            Math.round(this.direction.x),
            Math.round(this.direction.y)
        );
        this.context.onPlayerHit(attackDir);

        // Return to mob state
        this.currentState = EnemyState.MOB;
    }

    private handleDie(): void {
        this.context.playAnimation(this.animations.despawn);
        this.context.onDeath();
    }

    private handlePlayerSighted(): void {
        // Player detection logic handled in Enemy class
    }

    private handlePlayerHidden(): void {
        // Reset player reference
    }

    private applyFacingAnimation(): void {
        switch (this.facingDirection) {
            case FacingDirection.UP:
                this.context.setMirror(false);
                this.context.playAnimation(this.animations.runUp);
                break;
            case FacingDirection.DOWN:
                this.context.setMirror(false);
                this.context.playAnimation(this.animations.runDown);
                break;
            case FacingDirection.LEFT:
                this.context.setMirror(true);
                this.context.playAnimation(this.animations.runLeft);
                break;
            case FacingDirection.RIGHT:
                this.context.setMirror(false);
                this.context.playAnimation(this.animations.runRight);
                break;
        }
    }

    private playAttackAnimation(): void {
        switch (this.facingDirection) {
            case FacingDirection.UP:
                this.context.playAnimation(this.animations.attackUp);
                break;
            case FacingDirection.DOWN:
                this.context.playAnimation(this.animations.attackDown);
                break;
            case FacingDirection.LEFT:
                this.context.setMirror(true);
                this.context.playAnimation(this.animations.attackLeft);
                break;
            case FacingDirection.RIGHT:
                this.context.setMirror(false);
                this.context.playAnimation(this.animations.attackRight);
                break;
        }
    }
}