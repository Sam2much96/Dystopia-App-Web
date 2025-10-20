import * as LittleJS from 'littlejsengine';

const {vec2} = LittleJS;


import {Bombexplosion} from "../scenes/UI & misc/Blood_Splatter_FX";


export class Inventory {

    /*
    * Inventory Singleton
    *
    *
    * Functions
    * (1) Handles All Player Inventory
    * (2) Renders player's stats AI
    *
    * to do :
    * (1) player stats render function should renderer different pages, not categories
    * (2) Map render functions to ui buttons
    * (3) Inventory Translations
    * (4) fix item use logic so it doesn't multiply the inventory items
    * (5) fix ui render to update once status hud is visible not when the tab buttons is clicked
    * 
    * 
    */

    public items: Record<string, number>; // Dictionary to store inventory items
    public statsUI: HTMLElement | null = null;
    constructor() {
        console.log("Loading Inventory Singleton");
        this.items = {};
    }
    // version 1 inventory render with words
    renderInventory(): void {
        /**
         * Inventory Renderer
         * 
         * Features:
         * (1) renders the inventory items to a html element
         * (2) connects to the stats ui button created in the UI class object
         * (3) Renders stats ui by typescript + html + css manipulation of the dom
         * 
         * Temporarily depreciated for Game HUD refactor Aug 14/2025
         * To DO: 
         * (1) Add tabs and et al (1/2)
         * (2) Serialize wallet data to wallet tab renders
         * (3) Connect buttons manually with each rendering a different page
         * (4) Mini map?
         * (5) Quest UI & kill counts
         * (6) 
        */
         
        //console.log("rendering inventory UI database");

        // consider rewriting this to call a get class from the UI class object
        //this.inventoryUI = document.getElementById("v12_23");

        // Select the element
        this.statsUI = document.querySelector('.v11_5');

            // Change the text
            //if (statsTitle) {
            //    statsTitle.textContent = 'Updated Stats Title';
                // Or if you want HTML formatting:
                // statsTitle.innerHTML = '<b>Updated Stats Title</b>';
            //}


        if (!this.statsUI) return console.warn("debug Inventory UI");

        this.statsUI.innerHTML = ""; // clear UI

         // Inventory tab categories
         //each maps to an inventory item icon in the home and public directory
        
        //const categories = ["All", "inventory", "wallet","compass" ,"quest","stats"];
        //let activeCategory = "All";


        // Create tabs container 
        // from each of the objects in the categories array
        //const tabsHTML = `
        //    <div class="inventory-tabs">
        //        ${categories.map(cat => `
        //            <button class="inventory-tab" data-category="${cat}">
        //            <!-- Renders the Tab icons based on the category items -->
        //            <img src="${cat.toLowerCase()}.webp" class="tab-icon" alt="${cat} icon">
        //            ${cat}
         //           </button>
         //       `).join("")}
         //   </div>
         //   <div id="inventory-items" class="inventory-items-grid"></div>
        //`;

        // testing rendering all inventory items to the UI
        //this.inventoryUI.textContent = Object.entries(this.getAllItems())
        //.map(([name, count]) => `${name} x ${count}`)
        //.join('\n');

        // Clear previous inventory UI
        //this.inventoryUI.innerHTML = '';
        
        // connect UI inventory buttons to useItem function
        // Loop through items and create a button for each
        // bug : (1) increases inventory item instead of decreasing it
        Object.entries(this.getAllItems()).forEach(([name, count]) => {
            const btn = document.createElement('button');
            // translate inventory items
            let translateName = window.dialogs.t(`${name}`, window.dialogs.language)
            
            // debug inventory translations
            //console.log("translate Inv debug: ", translateName); //works
            btn.textContent = `${translateName} x ${count}`; // set the button text
            btn.classList.add('inventory-item'); // optional CSS styling

            // add use item for each button
            btn.addEventListener("pointerdown", () => {
                //console.log(`Used 1 x ${name} of ${count}`);
                
                // You can trigger item usage, show details, etc. here
                // bug: (1) triggers addition by when called from ui
                //this.use(name, 1);
                useItem(name,1)
            });

            // Add button to inventory UI container
            this.statsUI?.appendChild(btn);
        });
        


        /**
        // depreciated code bloc
        // to do:
        // (1) map UI code to UI inventory tab  buttons
        // to do: (1) connect render to tab icon buttons
        
        // Add click listeners to tabs
        const tabButtons = this.inventoryUI.querySelectorAll(".inventory-tab");
        
        // Store tab buttons in an object for manual control
        const tabButtonMap: Record<string, HTMLButtonElement> = {};

        tabButtons.forEach((tab_btn) => {
            const button = tab_btn as HTMLButtonElement;
            const category = tab_btn.getAttribute("data-category");
            if (category) {
                tabButtonMap[category] = button;
                button.addEventListener("click", () => {
                activeCategory = category;

                // Remove active class from all tabs
                tabButtons.forEach(b => (b as HTMLButtonElement).classList.remove("active-tab"));
                button.classList.add("active-tab");

                // Render different content depending on the category
                switch (category) {
                    case "All":
                case "inventory":
                    this.renderItems(category);
                    break;
                case "wallet":
                    this.renderWallet();
                    break;
                case "compass":
                    this.renderMap();
                    break;
                case "quest":
                    this.renderQuests();
                    break;
                case "stats":
                    this.renderStats();
                    break;

                }
                });
            }
                

        });
          */



        // Initial render
        //this.renderItems(activeCategory);


    }


    // Version 2 Inventory Render with items (filtered by category)
    // to do:
    // (1) fix code bloc
    // (2) test code bloc
    private renderItems(category: string) : void {
            // gets the inventory items grid created above
            const container = document.getElementById("inventory-items");
            if (!container) return; // guard clause
            container.innerHTML = ""; // Clear previous

            const items = window.inventory.getAllItems(); // Get inventory items
            Object.entries(items).forEach(([itemName, itemCount]) => {
                // sort inventory items by category
                const itemCategory = this._getItemCategory(itemName); // Custom function

                // renders the item category
                // to do:
                // (1) fetch each item count from the inventory record and update live
                if (category === "All" || itemCategory === category) {
                    container.innerHTML += `
                        <!-- Renders the Tab items based on the inventory items data -->
                        <div class="inventory-item">
                            <!-- Button clicks don't work here, you'll hv to create global functions to call within this render -->
                            <!-- Code reference : Dystopia-App-Manga Landing page code -->
                            <button class="item-button" onclick="useItem('${itemName}', 1)">
                                <img src="${itemName}.webp" alt="${itemName}, 1" class="item-image">
                                <div class="item-name">${itemName}</div>
                                <div class="item-description">Amount: ${itemCount}</div>
                            </button>
                        </div>
                    `;
                }
            });
        };



    

    // sorts items by categories to inventory ui
    // category cheat sheet:
    //"inventory", "wallet","compass" ,"quest","shield"
    // to do:
    // (1) All inventory items should be a global class for easier referencing than strings
    // (2) Depreciate this category class to render dirrerent ui elements for each tab button clicked 
    //     - and only category sort on the inventory tab
    // hacky fix: return all items from useItem to inventory
    _getItemCategory(itemName: string): string {
        if (itemName.includes("Bomb") || itemName.includes("Bow")) return "inventory";
        if (itemName.includes("Arrow") || itemName.includes("health potion")) return "inventory";
        if (itemName.includes("Generic Item") || itemName.includes("Magic Sword")) return "inventory";
        return "Misc";
    }


    set(itemName: string, quantity: number): void {
     /**
     * Add an item into the inventory.
     * If the quantity is less than or equal to zero, the item is removed.
     * @param itemName - The name of the item.
     * @param quantity - The quantity to add (can be negative for removal).
     */

        if (quantity <= 0) {
            delete this.items[itemName]; // Remove item if quantity is zero or less
        } else {
            this.items[itemName] = (this.items[itemName] || 0) + quantity;
        }
    }


    /** 
    itemUseEffect(name : string){
        if (!window.player) return;

        window.music.item_use_sfx.play(); // play item use sfx
        if (name === "Generic Item"){
            window.player.WALK_SPEED + 500;
        }
        if (name === "Bomb"){
            console.log("spawn new bomb item");
        }
        if (name === "health potion"){
            // increase player heartbox
            window.player.hitpoints += 1;
            window.ui.heartbox(window.player.hitpoints)
        }
    }
    */

    get(itemName: string): number {
    /**
     * Retrieve the quantity of an item.
     * @param itemName - The name of the item.
     * @returns The quantity of the item, or 0 if it doesn't exist.
     */

        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        return this.items[itemName] || 0;
    }

    /**
     * Check if an item exists in the inventory.
     * @param itemName - The name of the item.
     * @returns `true` if the item exists, otherwise `false`.
     */
    has(itemName: string): boolean {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        return itemName in this.items;
    }

    /**
     * Remove an item completely from the inventory.
     * @param itemName - The name of the item.
     */
    remove(itemName: string): void {
        if (typeof itemName !== 'string') {
            throw new Error('Item name must be a string.');
        }
        delete this.items[itemName];
    }

    /**
     * Get a list of all items in the inventory.
     * @returns A copy of the inventory dictionary.
     */
    getAllItems(): Record<string, number> {
        return { ...this.items };
    }

    /**
     * Count the total number of unique items in the inventory.
     * @returns The number of unique items.
     */
    getItemCount(): number {
        return Object.keys(this.items).length;
    }

    /**
     * Count the total quantity of all items in the inventory.
     * @returns The total quantity of all items.
     */
    getTotalQuantity(): number {
        return Object.values(this.items).reduce((sum, quantity) => sum + quantity, 0);
    }
}




/**
 * Global UI Functions
 * 
 * Features:
 * (1) Exported as a global window function called from the Inventory UI renderer
 * (2) The function is saved to the DOM's global scope for the UI
 * 
 * 
 * There's 4 Inventory Items implemented :
 * (1) health potion
 * (2) Generic Item
 * (3) Magic Sword
 * (4) Bomb
 * (5) Arrow
 * (6) Bow
 * 
 * To Do:
 * (1) Implement ring item
 * (2)
 * 
 * Bugs:
 * (1) item use logic is infinite and broken
 * (2) not all item use items are implemented
 */

export function useItem(type :string, amount : number ) : boolean {
    //console.log("Use item function called :", type);
    

    window.music.item_use_sfx.play();

    const player = window.player;
    const local_inv = window.inventory;

    if (player && local_inv.has(type)){
        let old_amt : number = local_inv.get(type);
        let new_amt = old_amt = amount;
        local_inv.set(type, new_amt); 
        
        if (type== "Health Potion"){
            //console.log("hp+ use debug: ", player);
            player.hitpoints += 1;
            window.globals.hp += 1;
            window.ui.HeartBoxHUD!!.heartbox(window.globals.hp)
            // update heart box hud
            //player.update_heart_box();
            //console.log("to do: implement update heartbox funcitonality on player object");
        }
        
        if (type == "Generic Item"){
            player.WALK_SPEED += 500; // double the player's speed variable
            player.ROLL_SPEED += 400;
            player.ATTACK = 2;

        }

        if (type == "Magic Sword"){
            //increase pushback impact, increases chances of double attack
            player.pushback = 8000;
        }

        if (type == "Bomb"){
            const bomb = new Bombexplosion(player.pos, vec2());

            console.log("bomb debug: ", bomb);
        }

        if (type == "Arrow" && local_inv.has("Bow")){
            //const bullet = new Bullet(); // arrow instance

            //console.log("arrow debug 1: ", bullet);
            console.log("to do: finish item use implementation");
        }
    
    }

    

    // to do:
    // (1) each item use should either spawn the object or alter the player's state
    // (2) port item use logic from inventory code for bombs, potions, bow & arrow, generic item and rings
    // (3) connect wallet use logic to test wallet ui 

    return true;
}


