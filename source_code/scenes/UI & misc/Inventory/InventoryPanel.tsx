import React, { useState, useEffect } from "react";
//import "../../../styles/inventory-react.css";


//import {BombExplosion} from "../../../scenes/items/Bomb";
//import {Bullet} from "../../../scenes/items/Arrow";
import { useItem } from "../../../singletons/Inventory";


// ------------------------------------
// Types
// ------------------------------------
type InventoryItems = Record<string, number>;

interface InventoryPanelProps {
  initialItems?: InventoryItems;
}

// ------------------------------------
// Component
// ------------------------------------
export const InventoryPanel: React.FC<InventoryPanelProps> = ({
  initialItems = {},
}) => {
  const [items, setItems] = useState<InventoryItems>(initialItems);

  // ------------------------------------
  // Sync from window.inventory continuously
  // ------------------------------------
  useEffect(() => {
    // Initial load
    if (window.inventory?.getAllItems) {
      setItems(window.inventory.getAllItems());
    }

    // Poll for changes every 100ms to keep UI in sync
    const syncInterval = setInterval(() => {
      if (window.inventory?.getAllItems) {
        setItems(window.inventory.getAllItems());
      }
    }, 100);

    return () => clearInterval(syncInterval);
  }, []);

  // ------------------------------------
  // Handle Item Use - Call global useItem
  // ------------------------------------
  const handleUseItem = (name: string) => {
    console.log("Button clicked for item:", name);
    
    useItem(name,1);
    // Check if global useItem exists
    //if (typeof window.useItem === 'function') {
    //  console.log("Calling window.useItem");
     // window.useItem(name, 1);
    //} 

    /**
    if (window.inventory) {
      console.log("Calling inventory method directly");
      // Fallback: call the inventory methods directly
      const player = window.player;
      const local_inv = window.inventory;
      
      if (player && local_inv.has(name)) {
        window.music?.item_use_sfx?.play();
        
        const t = window.ui?.t;
        const health_potion = t?.("Health Potion") ?? "Health Potion";
        const generic_item = t?.("Generic Item") ?? "Generic Item";
        const magic_sword = t?.("Magic Sword") ?? "Magic Sword";
        const bomb = t?.("Bomb") ?? "Bomb";
        const arrow = t?.("Arrow") ?? "Arrow";
        const bow = t?.("Bow") ?? "Bow";
        
        // Apply effects
        if (name === health_potion) {
          player.hitpoints += 1;
          window.globals.hp += 1;
        } else if (name === generic_item) {
          player.WALK_SPEED += 500;
          player.ROLL_SPEED += 400;
          player.ATTACK = 2;
        } else if (name === magic_sword) {
          player.pushback = 8000;
        } else if (name === bomb) {
          // You'll need to import BombExplosion if this doesn't work
          if (BombExplosion) {
            new BombExplosion(player.pos.copy());
          }
        } else if (name === arrow && local_inv.has(bow)) {
          // You'll need to import Bullet if this doesn't work
          if (Bullet) {
            new Bullet(player.pos.copy(), player.facingPos);
          }
        }
        
        // Remove item from inventory
        let old_amt = local_inv.get(name);
        let new_amt = old_amt - 1;
        local_inv.set(name, new_amt);
      }
    }
       */

    // Force immediate UI update
    if (window.inventory?.getAllItems) {
      setItems(window.inventory.getAllItems());
    }
  };

  // ------------------------------------
  // Render
  // ------------------------------------
  return (
    <div className="inventory-panel">
      <h2>{window.ui?.t?.("Inventory") ?? "Inventory"}</h2>
      {Object.keys(items).length === 0 && (
        <p className="inventory-empty">
          {window.ui?.t?.("Empty") ?? "Empty"}
        </p>
      )}
      <div className="inventory-list">
        {Object.entries(items).map(([name, count]) => (
          <button
            key={name}
            className="inventory-item"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("onClick triggered for:", name);
              handleUseItem(name);
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("onPointerDown triggered for:", name);
              handleUseItem(name);
            }}
          >
            {name} × {count}
          </button>
        ))}
      </div>
    </div>
  );
};