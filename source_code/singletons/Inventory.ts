


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
    */

    private items: Record<string, number>; // Dictionary to store inventory items
    public inventoryUI: HTMLElement | null = null;
    constructor() {
        console.log("Loading Inventory Singleton");
        this.items = {};
    }

    render(): void {
        /**
         * Inventory Renderer
         * 
         * Features:
         * (1) renders the inventory items to a html element
         * (2) connects to the stats ui button created in the UI class object
         * (3) Renders stats ui by typescript + html + css manipulation of the dom
         * 
         * To DO: 
         * (1) Add tabs and et al (1/2)
         * (2) Serialize wallet data to wallet tab renders
         * (3) Connect buttons manually with each rendering a different page
         * (4) Mini map?
         * (5) Quest UI & kill counts
         */
        console.log("rendering inventory UI database");

        // consider rewriting this to call a get class from the UI class object
        this.inventoryUI = document.getElementById("inventory-container");

        if (!this.inventoryUI) return console.warn("debug Inventory UI");

        this.inventoryUI.innerHTML = ""; // clear UI

         // Inventory tab categories
         //each maps to an inventory item icon in the home and public directory
        
        const categories = ["All", "inventory", "wallet","compass" ,"quest","stats"];
        let activeCategory = "All";


        // Create tabs container 
        // from each of the objects in the categories array
        const tabsHTML = `
            <div class="inventory-tabs">
                ${categories.map(cat => `
                    <button class="inventory-tab" data-category="${cat}">
                    <!-- Renders the Tab icons based on the category items -->
                    <img src="${cat.toLowerCase()}.webp" class="tab-icon" alt="${cat} icon">
                    ${cat}
                    </button>
                `).join("")}
            </div>
            <div id="inventory-items" class="inventory-items-grid"></div>
        `;

        this.inventoryUI.innerHTML = tabsHTML;

        


        

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
        



        // Initial render
        this.renderItems(activeCategory);


    }

    private renderWallet(): void {
        // to do:
        // (1) port wallet button from game hud to here using Connected and a trigger parameter
        
        const container = document.getElementById("inventory-items");
        if (!container) return;

        container.innerHTML = `
            <div class="wallet-tab">
                <p>Wallet address: ${window.wallet.accountAddress}</p>
                <p>Token balance: ${window.wallet.accountBalance}</p>
                <!-- Add more wallet details here -->
            </div>
        `;
    }


    // Render items (filtered by category)
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

    private renderMap(): void {
        const container = document.getElementById("inventory-items");
        if (!container) return;

        container.innerHTML = `
            <div class="map-tab">
                <h2>World Map</h2>
                <!-- mini map placeholder -->
                <img src="map ui 64x64.webp" alt="Mini Map" class="map-image">
                
            </div>
        `;
    }


    private renderQuests(): void {
        const container = document.getElementById("inventory-items");
        if (!container) return;

        container.innerHTML = `
            <div class="quests-tab">
                <h2>Quest Log</h2>
                <ul>
                    <li>🗺️ Main Quest: Explore the world</li>
                    <li>📜 Side Quest: Kill some monsters</li>
                    <li>✅ Completed: None</li>
                </ul>
            </div>
        `;
    }

    private renderStats(): void {
        const container = document.getElementById("inventory-items");
        if (!container) return;

        // serialise global info to the stats ui
        let hp : number = window.globals.health;
        let kc : number = window.globals.kill_count;
        container.innerHTML = `
            <div class="stats-tab">
                <h2>Player Stats</h2>
                <p>Level: ${kc}</p>
                <p>HP: ${hp}</p>
                <p>Attack: 0</p>
                <p>Defense: 100</p>
            </div>
        `;
    }


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
     * Add or update an item in the inventory.
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

