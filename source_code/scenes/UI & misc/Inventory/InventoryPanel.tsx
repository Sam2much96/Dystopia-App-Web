import React, { useState, useEffect } from "react";

import { BombExplosion } from "../../items/Bomb";
import { Bullet } from "../../items/Arrow";

import "../../../styles/inventory-react.css"; // optional

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
  // Sync from global inventory (optional)
  // ------------------------------------

  useEffect(() => {
    if (window.inventory?.getAllItems) {
      setItems(window.inventory.getAllItems());
    }
  }, []);

  // ------------------------------------
  // Use Item Logic (React Version)
  // ------------------------------------

  const useItem = (type: string) => {
    if (!window.player) return;

    setItems((prev) => {
      const count = prev[type];

      if (!count || count <= 0) return prev;

      const updated = { ...prev };

      // Reduce item
      updated[type] = count - 1;

      if (updated[type] <= 0) {
        delete updated[type];
      }

      applyItemEffect(type);

      return updated;
    });
  };

  // ------------------------------------
  // Item Effects
  // ------------------------------------

  const applyItemEffect = (type: string) => {
    const player = window.player;

    window.music?.item_use_sfx?.play();

    const t = window.ui?.t;

    const healthPotion = t?.("Health Potion") ?? "Health Potion";
    const genericItem = t?.("Generic Item") ?? "Generic Item";
    const magicSword = t?.("Magic Sword") ?? "Magic Sword";
    const bomb = t?.("Bomb") ?? "Bomb";
    const arrow = t?.("Arrow") ?? "Arrow";
    const bow = t?.("Bow") ?? "Bow";

    // ---------------- Health Potion ----------------
    if (type === healthPotion) {
      player.hitpoints += 1;
      window.globals.hp += 1;
      return;
    }

    // ---------------- Generic Item ----------------
    if (type === genericItem) {
      player.WALK_SPEED += 200;
      player.ROLL_SPEED += 150;
      player.ATTACK += 1;
      return;
    }

    // ---------------- Magic Sword ----------------
    if (type === magicSword) {
      player.pushback += 2000;
      return;
    }

    // ---------------- Bomb ----------------
    if (type === bomb) {
      new BombExplosion(player.pos.copy());
      return;
    }

    // ---------------- Arrow ----------------
    if (type === arrow && items[bow]) {
      new Bullet(player.pos.copy(), player.facingPos);
      return;
    }
  };

  // ------------------------------------
  // Render
  // ------------------------------------

  return (
    <div className="inventory-panel">
      <h2>{window.ui?.t("Inventory") ?? "Inventory"}</h2>

      {Object.keys(items).length === 0 && (
        <p className="inventory-empty">{window.ui.t("Empty")}</p>
      )}

      <div className="inventory-list">
        {Object.entries(items).map(([name, count]) => (
          <button
            key={name}
            className="inventory-item"
            onClick={() => useItem(name)}
          >
            {name} × {count}
          </button>
        ))}
      </div>
    </div>
  );
};
