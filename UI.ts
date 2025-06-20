import {Simulation} from "Simulation";


export class UI  {
    /* 
    Game UI System
    
    Docs: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/uiSystem/game.js 

    The UI uses html objects, html elements and WebGL objects to 
    render the games different UI elements

    Each UI setup is sepatated into diffferent functions

    To DO:
    (1) in-game menu (1/2)
    (2) Controls Menu
    (3) Game HUD 
        -inventory ui (1/3)
        -quest ui
        -mini-map ui
    (4) Dialogs Box (1/3)
        -map dialogue text to dialog box boundaries
        
    (5) Heartbox (1/2)
    (6) Should Play UI sounds from singleton class (1/2)

    (7) Separate Each Object into class extensions
    
    (8) UI upscalling for mobile browsers
    (9) Better UI graphics
    (10) Separate each Ui element type into different classes with global pointers
        - game menu, game hud, 
    (11) organise heartbox into 64x UI tileset
    (12) rewrite UI using only html and css
    */


    // UI components
    public UI_ROOT: HTMLDivElement;
    public UI_MENU: HTMLDivElement;
    public leftButtons : HTMLElement | null;
    public TopRightUI : HTMLElement | null;
    public UI_GAMEHUD: HTMLDivElement;
    public HEART_BOX: Array<HTMLDivElement>;
    public UI_STATS: HTMLDivElement;
    public UI_CONTROLS: HTMLDivElement;
    public DIALOG_BOX: HTMLDivElement;

    // UI Buttons
    // menu buttons
    public menuContainer: HTMLElement | null;
    public inventoryContainer : HTMLElement | null;

    public newGame: HTMLAnchorElement | null = null;
    public contGame: HTMLAnchorElement | null = null;
    public Comics: HTMLAnchorElement | null = null;
    public Controls: HTMLAnchorElement | null = null;
    public Wallet: HTMLAnchorElement | null = null;
    public Quit: HTMLAnchorElement | null = null;

    //HUD Texture Buttons
    public statsButton: HTMLButtonElement | null = null; // button triggered from input via stats() method
    public dialogButton: HTMLButtonElement | null = null;
    public comicsButton: HTMLButtonElement | null = null;
    public menuButton: HTMLButtonElement | null = null;
    public walletButton: HTMLButtonElement | null = null;


    //timer: LittleJS.Timer = new Timer();

    public SHOW_DIALOGUE: boolean = false;
    public SHOW_MENU: boolean = true;
    public SHOW_INVENTORY : boolean = false;

    // safe pointer to the music global singleton
    private local_music_singleton = window.music;

    constructor() {

        // Create UI objects For All UI Scenes
        // set root to attach all ui elements to
        this.UI_ROOT = document.createElement("div");
        this.UI_ROOT.id = "ui-root";
        document.body.appendChild(this.UI_ROOT);


        // Create UI containers
        this.leftButtons  = document.getElementById("left-buttons");
        //this.leftButtons.id = "left-buttons";

        this.TopRightUI = document.getElementById("top-right-ui"); //document.createElement("div");
        //this.TopRightUI.id = "top-right-ui";

                //create menu with inner html script
        // bugs
        // (1) game menu small scale on mobile
        // (2) game menu buttons doesn't click with mobile touch

        // connects to menu container div in index.html ln 59.
        // turn menu invisible by default
        // to do: create this div with code
        this.menuContainer = document.getElementById("menu-container");
        //this.menuContainer.id = "menu-container";

        this.inventoryContainer = document.getElementById("inventory-container");
        //this.inventoryContainer.id = "inventory-container";
        
        // turn off
        this.InventoryVisible = false;
        this.MenuVisible = true;
        
        this.UI_MENU = this.createPanel("ui-menu"); // create a ui panel div and attach it to the ui root div
        this.UI_GAMEHUD = this.createPanel("ui-gamehud");// contains all game hud buttons
        this.HEART_BOX = []; //created with the heartbox function
        this.UI_STATS = this.createPanel("ui-stats");// stats and inventory
        this.UI_CONTROLS = this.createPanel("ui-controls");
        this.DIALOG_BOX = this.createPanel("dialog-box");


        this.UI_ROOT.append(
                    this.UI_MENU,
                    this.UI_GAMEHUD,
                    this.UI_STATS,
                    this.UI_CONTROLS,
                    this.DIALOG_BOX
                );


        //console.log("Menu Debug 1: ", this.menuContainer);
            
        
        }

   

    /**
     * UI visibility Toggles
     * 
     * Features:
     * (1) external methods to toggle UI states as setter & getter functions
     */

    get MenuVisible() : boolean {
        return this.SHOW_MENU;
    };

    /**
     *  In Game Menu Visibility controls & settings
     * 
     */
    set MenuVisible(visible_: boolean) {
        // Toggles Menu Visibility
        this.SHOW_MENU = visible_;

        // play toggle sfx
        if (this.local_music_singleton) {
            this.local_music_singleton.ui_sfx[2].play(); // play robotic sfx
        }

        // game menu visibility
        if (visible_ == false) {
            this.menuContainer!.classList.add("hidden");

        }
        else if (visible_ == true) {

            this.menuContainer!.classList.remove("hidden");
        }


    };


    get DialogVisible() : boolean {

        return !this.DIALOG_BOX.classList.contains("hidden");
    }

    set DialogVisible(visible: boolean) {
        this.DIALOG_BOX.classList.toggle("hidden", !visible);
    }

    
    get InventoryVisible() : boolean {
        return this.SHOW_INVENTORY;
    };

    /**
     *  In Game Menu Visibility controls & settings
     * 
     */
    set InventoryVisible(visible_: boolean) {
        // Toggles Menu Visibility by editing the html element's css style
        this.SHOW_INVENTORY = visible_;

        // play toggle sfx
        if (this.local_music_singleton) {
            this.local_music_singleton.ui_sfx[2].play(); // play robotic sfx
        }

        // game menu visibility
        if (visible_ == false) {
            this.inventoryContainer!.classList.add("hidden");

        }
        else if (visible_ == true) {

            this.inventoryContainer!.classList.remove("hidden");
        }


    };


    //depreciated
    /** 
    update() {
        // dialogue box functionality
        // (1) Pop up and disappear functionality using Context manipulation and function calls
        // as opposed to creating new objects

        // called every frame


        // Dialogue Box Implementation
        // TO DO: Create as separate object with own update function calls
        //used to debug Ui Dialogue Timer

        //console.log(this.timer.get());
        if (this.timer.elapsed()) {
            //console.log("Timer Elapsed");
            this.DialogVisible = false;
            this.SHOW_DIALOGUE = false;
        }

        // Draws Dialogue Box to screen
        //dialogue box timeout
        if (!this.timer.elapsed() && this.timer.get() != 0 && this.SHOW_DIALOGUE == true) {
            this.DIALOG_BOX.innerHTML = `
                <div class="dialog-box-content">
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
            `;
            this.DialogVisible = true;
        }
    } */

    dialogueBox() {
        // Triggered by Pressing Key E; function called from the Input SIngleton 
        console.log("Creating Dialgoue Box Instance");
        //this.timer.set(5);
        this.SHOW_DIALOGUE = true;
        this.DialogVisible = true;
    }

    gameHUD() {
        /*  
        * Spawns The Game HUD Buttons & Connects 
        * Their SIgnals on start of the game 
        */

        //create Heartboxes
        //update & draw heartbox ui every frame
        this.heartbox(3); //create 3 hearboxes
        console.log("Creating Game HUD Buttons");
        
        // create button icons images
        // to do :
        // (1) create a panel div for the left buttons

        // create buttons and bind their actions
        this.statsButton = this.createTextureButton("./btn-stats.png","ui-button", () =>{
            //this.stats.bind(this);
            console.log("stats button pressed");
            this.InventoryVisible = !this.InventoryVisible;
            // Triggers stats ui
            // to do :
            // (1) on & off (done)
            // (2) game pause
            // (3) UI text fix
            // (4) Drag and Drop Items
            // (5) Status UI Buttons (dialogue, comics, menu, stats) (Done)
            // (6) Game Menu Shouldn't trigger once stats is showing
            // (8) Fetch & seriealize ASA data from wallet address(nft, memecoins,etc) 

            // fetch all inventory items
            console.log("Inventory Items", window.inventory.getAllItems());


            //button action
            //console.log("stats button pressed, Use Inventory item");
            //}
            // (1) Create / Show New UI Board
            // (2) Create UI Buttons for every inventroy item (Requires UITexture Button Implementation)
            // (3) Inventory Item Call Example is in Input under I Press
            window.inventory.render();
            window.music.ui_sfx[1].play();
        });
        this.walletButton = this.createTextureButton("./btn-mask.png","ui-button", () => {

            window.music.ui_sfx[0].play();
            window.wallet.__connectToPeraWallet()
        
        });

        this.dialogButton = this.createTextureButton("./btn-interact.png", "ui-button", ()=>{
            this.dialogueBox.bind(this);
            console.log("dialog pressed");
        });
        
        this.menuButton = this.createTextureButton("./menu white.png", "menu-btn",() => {
            window.music.ui_sfx[2].play();
            this.MenuVisible = !this.MenuVisible;
            //console.log("menu pressed");
        });

        // left buttons on the ui
        this.leftButtons!.append( this.statsButton,this.walletButton, this.dialogButton);
        
        // this is also the centerer position of the canvas
        this.TopRightUI!.append(this.menuButton);
    }

    heartbox(heartCount: number) {
        /* Creates A HeartBox UI Object */
        this.HEART_BOX.forEach(el => el.remove());
        this.HEART_BOX = [];

        for (let i = 0; i < heartCount; i++) {
            const heart = document.createElement("div");
            heart.className = "heartbox-heart";
            heart.style.left = `${5 + i * 40}px`;
            
            //this.UI_GAMEHUD.appendChild(heart);
            this.TopRightUI!.appendChild(heart);            
            this.HEART_BOX.push(heart);
        }
        
    }

    ingameMenu() {
        /*
        * Creates the Ingame Menu UI Object
        *
        * To Do:
        * (1) ingame menu scaling via android singletons
        * (2) menu translations
        */
        
        if (this.newGame) return; // guard clause
        console.log("Creating Ingame Menu");
    
        this.newGame = this.createMenuOption("New Game", "#", () => {
            window.music.sound_start.play();
            window.simulation = new Simulation();
        });

        this.contGame = this.createMenuOption("Continue", "#", () => {
                    window.music.sound_start.play();
                });

        this.Comics = this.createMenuOption("Comics", "#", () => {
            window.open("https://dystopia-app.site", "_blank");
        });

        this.Controls = this.createMenuOption("Controls", "#", () => {
            window.music.sound_start.play();
        });

        this.Quit = this.createMenuOption("Quit", "#", () => {
            window.music.sound_start.play();
            window.THREE_RENDER.showThreeLayer();// doesn;t work
        });

        // append buttons to menu container
        
        this.menuContainer!.append(
                this.newGame,
                this.contGame,
                this.Controls,
                this.Quit
            );
        
        
    }

    /**
     * Core UI Class
     * 
     * @param text 
     * @param onClick 
     * @returns 
     */
    private createTextureButton(imgSrc: string, className: string, onPress: () => void): HTMLButtonElement { // creates hud buttons. buggy
        const btn = document.createElement("button");
        
        //btn.textContent = text;
        btn.className = className;
        btn.addEventListener("pointerdown", onPress);
        const img = document.createElement("img");
        img.src = imgSrc;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.objectFit = "cover";
        img.style.pointerEvents = "auto";
        btn.appendChild(img);
        
        return btn;
    }


    private createMenuOption(text: string, href: string, onPress: () => void): HTMLAnchorElement { // creates menu buttons
        const option = document.createElement("a");
        option.href = href;
        option.className = "menu-option";
        option.innerText = text;
        
        const handler = (event: Event) => {
            event.preventDefault(); // Prevent navigation
            if (this.menuContainer!.style.display !== "none") {
             onPress();
            }
        };
        

        // Use pointerdown for broad device compatibility
        option.addEventListener("pointerdown", handler);

        // Optionally add click as a fallback
        option.addEventListener("click", handler);
        
        return option;
    }


    private createPanel(id: string): HTMLDivElement {
        const div = document.createElement("div");
        div.id = id;
        div.className = "ui-panel";
        this.UI_ROOT.appendChild(div);
        return div;
    }

}


