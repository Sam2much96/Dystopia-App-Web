/**
 * Game UI
 * 
 * Features:
 * (1) Renders all game UI and huds
 * (2) Uses stats.css and dialog.css for UI object styling
 * 
 * To Do:
 * (1) // to do: implement mouse pos for minimap drawing ui
 * (2) Connect Wallet tab and wallet render function to Wallet singleton to display token data
 * 
 * Bugs:
 * (1) Menu Button icon doesn't render in production
 * (2) Screen D-Pad controls is laggy, consider debugging enemy A.I. if the cause pf lag is from simulations delta
 * (3) Status HUD buttons aren't working on mobile browsers, duplicate press initialisation from menu UI
 * (4) Fix Yandex moderation issues for IOS & android tv examples : https://github.com/Sam2much96/Dystopia-App-Web/issues/6
 */
import { Music } from "./Music";
import {Simulation} from "./Simulation";

import {Utils} from "./Utils";
import * as LittleJS from 'littlejsengine';


type Translations = Record<string, Record<string, string>>;

export class UI  {
    /* 
    Game UI System
    
    Docs: https://github.com/KilledByAPixel/LittleJS/blob/main/examples/uiSystem/game.js 

    The UI uses html objects, html elements and WebGL objects to 
    render the games different UI elements

    Each UI setup is sepatated into diffferent functions

    Features:
    (1) in-game menu (1/2)
    (3) Game HUD 
        -inventory ui (1/3)
        -quest ui
        -mini-map ui
    (4) Dialogs Box (1/3)
        -map dialogue text to dialog box boundaries
        
    (5) Heartbox (1/2)
    (6) All UI elements Play UI sounds from singleton class (2/2)

    To DO:
    (2) Controls Menu

    (10) Separate each Ui element type into different classes with global pointers
        - game menu, game hud, 
    (11) organise heartbox into 64x UI tileset
    (12) rewrite UI using only html and css (done)
    (13) Fix broken Inventory Ui logic
    (14) Implement Kenny UI textures into CSS code for graphical consistency (1/2)
    (15) Each UI item should be in separate classes/ scripts
    (16) Map UI language controls to a controller UI
    
    */


    // UI components
    public UI_ROOT: HTMLDivElement;
    public UI_MENU: HTMLDivElement;
    public leftButtons : HTMLElement | null;
    public TopRightUI : HTMLElement | null;
    //public UI_GAMEHUD: HTMLDivElement;
    public HEART_BOX: Array<HTMLDivElement>;
    public UI_STATS: HTMLDivElement;
    //public UI_CONTROLS: HTMLDivElement;
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

    // tab button elements
    public statsTab : HTMLButtonElement | null = null;
    public walletTab : HTMLButtonElement | null = null;
    public inventoryTab : HTMLButtonElement | null = null;
    public questTab : HTMLButtonElement | null = null;


    //timer: LittleJS.Timer = new Timer();

    public SHOW_DIALOGUE: boolean = true;
    public SHOW_MENU: boolean = true;
    public SHOW_INVENTORY : boolean = true;

    // safe pointer to the music global singleton
    public local_music_singleton : Music = window.music;
    

    //public browserLang = navigator.language;
    //csv translations settings
    private translations : Translations  = {};

    private language : string = window.dialogs.language; // fetch language from dialog singleton
    constructor() {
        // testing other languages
        // doesn't work
        console.log("language debug:", this.language);

        

        // Create UI objects For All UI Scenes
        // set root to attach all ui elements to
        this.UI_ROOT = document.createElement("div");
        this.UI_ROOT.id = "ui-root";
        document.body.appendChild(this.UI_ROOT);


        // Create UI containers
        this.leftButtons  = document.getElementById("left-buttons");
        this.TopRightUI = document.getElementById("top-right-ui"); 
        this.menuContainer = document.getElementById("menu-container");
        this.inventoryContainer = document.getElementById("hud");

        // turn off
        this.InventoryVisible = false;
        
        this.MenuVisible = true; // make menu initially invisible
        
        
        // create a div for each of these new UI elements
        this.UI_MENU = this.createPanel("ui-menu"); // create a ui panel div and attach it to the ui root div
        //this.UI_GAMEHUD = this.createPanel("ui-gamehud");// contains all game hud buttons
        this.HEART_BOX = []; //created with the heartbox function
        this.UI_STATS = this.createPanel("ui-stats");// stats and inventory
        //this.UI_CONTROLS = this.createPanel("ui-controls");
        this.DIALOG_BOX = this.createPanel("dialog-box");
        this.DialogVisible = false; //temporarily hide dialogue box for ui refactor Sept 22, 2025


        this.UI_ROOT.append(
                    this.UI_MENU,
                    //this.UI_GAMEHUD,
                    
                    //this.UI_CONTROLS,
                    this.DIALOG_BOX
                );

        this.inventoryContainer?.append(this.UI_STATS);

        //console.log("Menu Debug 1: ", this.menuContainer);
        
        // tab button for rendering different stats icons and screens
        // currently unimplemented
        // to do : 
        // (1) organise button layout
        // (2) add proper documentation and function calls (1/2)
        // (3) create class pointer objects for each tab butten and placeholder functions (done)
        // (4) add tab button sound fx
        // (5) fix stats UI items overlap
        // (6) change even handler from click to on button down (done)
        this.statsTab = document.querySelector('.v12_14');
        this.walletTab = document.querySelector('.v12_15');
        this.inventoryTab = document.querySelector('.v12_16');
        this.questTab = document.querySelector('.v12_17');
        
        // connect button click events to render functions via global singletons -> local object pointers
        // depreciate default inventory renderer
        this.statsTab?.addEventListener("pointerdown", () => { this.debugTab("v12_14 stats tab")});
        this.walletTab?.addEventListener("pointerdown", () => {this.debugTab("v12_15 wallet tab")});
        this.inventoryTab?.addEventListener("pointerdown", () => {this.debugTab("v12_16 inventory tab")});
        this.questTab?.addEventListener("pointerdown", () => {this.debugTab("v12_17 quests tab")});

        console.log("tabs debug 2: ", this.statsTab);
        
        }
    
    debugTab(log : string){
    // for debugging tab button presses
    // to do: (1) connect to different stats UI render
    window.music.ui_sfx[0].play();
    console.log(`tab button clicked x ${log}`)
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
        LittleJS.setPaused(visible_);

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
        //this.SHOW_DIALOGUE = true;
        //this.DialogVisible = true;

        this.DIALOG_BOX.innerHTML = `<!-- Dialogue Main Content Container to do: (1) add in styling -->
            <div class="v1_5">

                <!-- Decorative or Background Element -->
                <div class="v1_2"></div>

                <!-- Another Decorative Layer or Element -->
                <div class="v1_3"></div>

                <!-- Text Content -->
                <span class="v1_4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </span>

            </div>`;
    }

    gameHUD() {
        /*  
        * Spawns The Game HUD Buttons & Connects 
        * Their SIgnals on start of the game 
        * 
        * To do:
        * (1) lock game hud designs into html and css class
        * (2) include logic to hide the game hud once game menu is visible to prevent UI overlap
        */

        //create Heartboxes
        //update & draw heartbox ui every frame
        this.heartbox(window.globals.hp); //create 3 hearboxes
        console.log("Creating Game HUD Buttons");
        
        // create button icons images
        // to do :
        // (1) create a panel div for the left buttons

        // create buttons and bind their actions
        this.statsButton = this.createTextureButton("./btn-stats.png","ui-button", () =>{
            //this.stats.bind(this);
            console.log("stats button pressed");
            //this.InventoryVisible = !this.InventoryVisible;
            // Triggers stats ui
            // to do :
            // (1) on & off (done)
            // (2) game pause
            // (3) UI text fix
            // (4) Drag and Drop Items
            // (5) Status UI Buttons (dialogue, comics, menu, stats) (Done)
            // (6) Game Menu Shouldn't trigger once stats is showing
            // (8) Fetch & seriealize ASA data from wallet address(nft, memecoins,etc) 

            // to do:
            // (1) depreciate default stats render UI from stats HUD button press
            // (2) Make all global singletons directly responsible for their UI render implementation
            // fetch all inventory items
            console.log("Inventory Items", window.inventory.getAllItems());


            //button action
            //console.log("stats button pressed, Use Inventory item");
            //}
            // (1) Create / Show New UI Board
            // (2) Create UI Buttons for every inventroy item (Requires UITexture Button Implementation)
            // (3) Inventory Item Call Example is in Input under I Press
            
            this.statsHUD(); //renders the stats hud (1/2) todo: connect functionality and fix positioning
            window.inventory.render(); // old inventory render is depreciated
            this.InventoryVisible = !this.InventoryVisible; // toggle ui visible / invisible
            window.music.ui_sfx[1].play();
        });
        // to do:
        // (1) lock gameHUD layout into separated css and html files and separte each ui into seprate css object
        // depreciate wallet button into hud renders
        this.walletButton = this.createTextureButton("./btn-mask.png","ui-button", () => {

            console.log("wallet button pressed");
            // to do:
            // (1) implement better wallet singleton to UI class pointer
            // (2) create generic wallet api implementation adaptable for multiple web plaforms not just pera wallet
            window.music.ui_sfx[0].play();
            //window.wallet.__connectToPeraWallet()
        
        });

        this.dialogButton = this.createTextureButton("./btn-interact.png", "ui-button", ()=>{
            //this.dialogueBox.bind(this);
            console.log("dialog pressed");
            this.dialogueBox();
        });
        
        this.menuButton = this.createTextureButton("./kenny ui-pack/grey_button08.png", "menu-btn",() => {
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

    async ingameMenu() {
        /*
        * Creates the Ingame Menu UI Object
        *
        * To Do:
        * (1) ingame menu scaling via android singletons
        * (2) menu translations
        */


        await this.loadTranslations(); //load the translations csv
        
        if (this.newGame) return; // guard clause
        console.log("Creating Ingame Menu");
    
        // note : (1) ingame menu translations is buggy
        this.newGame = this.createMenuOption(this.t("new game", this.language), "#", () => {
            window.music.sound_start.play();
            console.log('creating new game simulation');
            window.simulation = new Simulation();
            Utils.saveGame();

            //hide menu
             window.ui.MenuVisible = false; // hide the menu ui
        });

        this.contGame = this.createMenuOption(this.t("continue", this.language), "#", () => {
                    window.music.sound_start.play();
                    // logic
                    // (1) should fetch save game .save and load the current level in the global singleton
                    Utils.loadGame();

                     window.ui.MenuVisible = false; // hide the menu ui
                });

        // temporarily disabled for yandex games implementation
        /**         
        this.Comics = this.createMenuOption("Comics", "#", () => {
            window.open("https://dystopia-app.site", "_blank");
        });
        */
       
        this.Controls = this.createMenuOption(this.t("controls", this.language), "#", () => {
            window.music.sound_start.play();

             window.ui.MenuVisible = false; // hide the menu ui
        });

        this.Quit = this.createMenuOption(this.t("quit", this.language), "#", () => {
            window.music.sound_start.play();
            window.THREE_RENDER.showThreeLayer();// doesn;t work
            
            //to do :
            // (1) implement close browser tab
        });

        // append buttons to menu container
        
        this.menuContainer!.append(
                this.newGame,
                this.contGame,
                this.Controls,
                this.Quit
            );
        
        
    }

    statsHUD(){
        console.log("stats ui debug 1: ", this.UI_STATS.innerHTML);
        if (this.UI_STATS.innerHTML.trim() === ""){
            console.log("rendering stats HUD depreciated function");

        }
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
        
        // to do: use event handler architecture for stats UI buttons
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

    async loadTranslations() : Promise<void>{
        //translations[key][lang]
        console.log("UI Translations initialised");
        const response  = await fetch ("./Translation_1.csv"); // works
        const csvText = await response.text(); // works

        // to do: 
        // (1) rework this logic so it parses the translations csv properly
        // (2) fix translations bug
        // (3) add conditional for failed async fetch
        const lines = csvText.trim().split("\n");
        const headers = lines[0].split(',');
            for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        const key = cols[0];
        this.translations[key] = {};
        for (let j = 1; j < headers.length; j++) {
                this.translations[key][headers[j]] = cols[j];
            }
        }   
        //debug language translations
        //console.log("translations debg: ", this.translations); // works
        //console.log("translations debug 2: ",this.translations["new game"]["fr"]); // works
    }

    t(word : string, lang: string) : string { // translates the string file
        // doesn't work for other translations
        // bug: returns the key without actually translating
        // bug: function doesn't wait for finished loading translations to translate and so breaks
        //console.log("translations debug 2: ",this.translations["new game"]["fr"]); // works
        if (!this.translations){ return word} // guard clause 
        //console.log("word debug: ", word);
        var y = this.translations[word][lang];        
        //console.log("lang debug 2: ", y, "/ key: ", lang);
        return y
        
    }
}


