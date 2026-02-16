import React, { createContext, useContext, useState, ReactNode } from "react";

// -------------------------
// Types
// -------------------------

type InventoryMap = Record<string, number>;

interface InventoryContextType {
  items: InventoryMap;
  addItem: (name: string, amount: number) => void;
  useItem: (name: string, amount: number) => void;
  getItem: (name: string) => number;
}

// -------------------------
// Context
// -------------------------

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

// -------------------------
// Provider
// -------------------------

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider: React.FC<InventoryProviderProps> = ({
  children,
}) => {
  const [items, setItems] = useState<InventoryMap>({});

  // Add item
  const addItem = (name: string, amount: number) => {
    setItems((prev) => ({
      ...prev,
      [name]: (prev[name] || 0) + amount,
    }));
  };

  // Use item
  const useItem = (name: string, amount: number) => {
    setItems((prev) => {
      const current = prev[name] || 0;
      const next = Math.max(0, current - amount);

      if (next === 0) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }

      return { ...prev, [name]: next };
    });
  };

  const getItem = (name: string) => items[name] || 0;

  return (
    <InventoryContext.Provider value={{ items, addItem, useItem, getItem }}>
      {children}
    </InventoryContext.Provider>
  );
};

// -------------------------
// Hook
// -------------------------

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) {
    throw new Error("useInventory must be used within InventoryProvider");
  }
  return ctx;
};
