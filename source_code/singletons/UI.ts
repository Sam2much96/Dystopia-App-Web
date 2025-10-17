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
 * (5) Fix translation language logic with regex code for different language locales2
 */
import { Music } from "./Music";
import {Simulation} from "./Simulation";
import { DialogBox } from "./Dialogs";
import {Utils} from "./Utils";
import * as LittleJS from 'littlejsengine';




export class UI  {
    /* 
    Game UI System
    
    creates all game UI using html and css to create all UI elements

    Features:
    (1) in-game menu (done)
    (3) Game HUD 
        -inventory ui (1/3)
        -quest ui
        -mini-map ui
    (4) Dialogs Box (1/3)
        -map dialogue text to dialog box boundaries
        
    (5) Heartbox (1/2)
    (6) All UI elements Play UI sounds from singleton class (2/2)

    To DO:
    (1) Controls Menu

    (2) organise heartbox into 64x UI tileset (not needed)
   
    (3) Fix broken Inventory Ui logic
    (4) Implement Kenny UI textures into CSS code for graphical consistency (1/2)
        -create form and control scenes with kenny ui template

    (5) Each UI item should be in separate classes/ scripts
    (6) Map UI language controls to a controller UI
    (7) Only render game hud once the game has started 
    
    */


    // UI components
    public UI_ROOT: HTMLElement | null;
    public UI_MENU: HTMLDivElement;
    public leftButtons : HTMLElement | null;
    public TopRightUI : HTMLElement | null;
    //public UI_GAMEHUD: HTMLDivElement;
    //public HEART_BOX: Array<HTMLDivElement>;
    //public UI_STATS: HTMLDivElement;
    //public UI_CONTROLS: HTMLDivElement;
    //public DIALOG_BOX: HTMLDivElement;


    //HUD Texture Buttons
    public statsButton: HTMLButtonElement | null = null; // button triggered from input via stats() method
    public dialogButton: HTMLButtonElement | null = null;
    public comicsButton: HTMLButtonElement | null = null;
    
    //public menuButton: HTMLButtonElement | null = null; // old menu button
    public menuButton : MenuButton | null = null;
    
    public walletButton: HTMLButtonElement | null = null;


    //timer: LittleJS.Timer = new Timer();

    public SHOW_DIALOGUE: boolean = true;
    //public SHOW_MENU: boolean = true;
    //public SHOW_INVENTORY : boolean = true;

    // safe pointer to the music global singleton
    public local_music_singleton : Music = window.music;
    

    //public browserLang = navigator.language;
    //csv translations settings
    //private translations : Translations  = {};

    private language : string = window.dialogs.language; // fetch language from dialog singleton // bug : breaks
    public HeartBoxHUD : HeartBox | undefined;
    public StatusTabs : StatsTabs | undefined ;
    public StatsHUD : StatsHUD | undefined;
    public GameMenu : IngameMenu | undefined;
    public Dialog : DialogBox | undefined; // dialo

    constructor() {
        // testing other languages
        // works
        console.log("UI singleton language debug:", this.language);

        
        // Create Div element for the ui
        // Create UI root object For All UI Scenes
        // set root to attach all ui elements to
        //this.UI_ROOT = document.createElement("div");
        //this.UI_ROOT.id = "ui-root";
        this.UI_ROOT = document.getElementById("ui-root");
        //document.body.appendChild(this.UI_ROOT);


        // Create UI containers
        this.leftButtons  = document.getElementById("left-buttons");
        this.TopRightUI = document.getElementById("top-right-ui"); 

        
        //create the game menu
        this.GameMenu = new IngameMenu();
        this.HeartBoxHUD = new HeartBox();
        // create a div for each of these new UI elements
        this.UI_MENU = createPanel("ui-menu"); // create a ui panel div and attach it to the ui root div
        //this.UI_GAMEHUD = this.createPanel("ui-gamehud");// contains all game hud buttons
        //this.HEART_BOX = []; //created with the heartbox function
        //this.UI_STATS = createPanel("ui-stats");// stats and inventory
        //this.UI_CONTROLS = this.createPanel("ui-controls");
        //this.DIALOG_BOX = createPanel("dialog-box");
        //this.DialogVisible = false; //temporarily hide dialogue box for ui refactor Sept 22, 2025


        this.UI_ROOT!!.append(
                    this.UI_MENU
                );

        //this.inventoryContainer?.append(this.UI_STATS);

        //console.log("Menu Debug 1: ", this.menuContainer);
        //create the dialog box object
        this.Dialog = new DialogBox()

        // creates the status hud
        this.StatusTabs = new StatsTabs();

        //create the inventory hud
        this.StatsHUD = new StatsHUD();

        

        }
   
    menu(){
        //works
        //console.log("creating the menu button");
        //render the menu button
        this.menuButton = new MenuButton();
        //console.log("menu button debug: ",this.menu);
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
        this.HeartBoxHUD!!.heartbox(window.globals.hp); //create 3 hearboxes
        
        //create dialog box object
        //works
        //this.Dialog?.dialogueBox("admin","Testing dialogue box");
        
        
        console.log("Creating Game HUD Buttons");
        
        // create button icons images
        // to do :
        // (1) organise each button configuration into ther specific classes
        // create buttons and bind their actions
        this.statsButton = createTextureButton("./btn-stats.png","ui-button", () =>{
            //
            //console.log("stats button pressed");
            //this.InventoryVisible = !this.InventoryVisible;
            // Triggers stats ui
            // to do :

            // (4) Drag and Drop Items
            // (6) Game Menu Shouldn't trigger once stats is showing


            // fetch all inventory items
            //console.log("Inventory Items", window.inventory.getAllItems());


            //button action
            //console.log("stats button pressed, Use Inventory item");
            //}
            // (1) Create / Show New UI Board
            // (2) Create UI Buttons for every inventroy item (Requires UITexture Button Implementation)
            // (3) Inventory Item Call Example is in Input under I Press
            
            this.StatsHUD!!.InventoryVisible = !this.StatsHUD!!.InventoryVisible; // toggle ui visible / invisible
            window.music.ui_sfx[1].play();
        });
        // to do:
        // (1) lock gameHUD layout into separated css and html files and separte each ui into seprate css object
        // depreciate wallet button into hud renders
        this.walletButton = createTextureButton("./btn-mask.png","ui-button", () => {

            console.log("wallet button pressed");
            // to do:
            // (1) 
            // (2) create generic wallet api implementation adaptable for multiple web plaforms not just pera wallet (1/3)
            window.music.ui_sfx[0].play(); 
            
        
        });

        this.dialogButton = createTextureButton("./btn-interact.png", "ui-button", ()=>{
            //
            //console.log("dialog pressed : to do: trigger dialogue box render function");
            //
            window.dialogs.show_dialog("...", "Aarin: ...");
        });
        
  

        // left buttons on the ui
        this.leftButtons!.append( this.statsButton,this.walletButton, this.dialogButton);
        

    }





   
}




export class StatsTabs {
    //separate GameHUD code into separate class
        // tab button elements
    public statsTab : HTMLButtonElement | null = null;
    public walletTab : HTMLButtonElement | null = null;
    public inventoryTab : HTMLButtonElement | null = null;
    public questTab : HTMLButtonElement | null = null;

    constructor(){
          //console.log("Menu Debug 1: ", this.menuContainer);
        
        // tab button for rendering different stats icons and screens
        // currently unimplemented
        // to do : 
        // (1) organise button layout
        // (2) add proper documentation and function calls (done)
        // (3) create class pointer objects for each tab butten and placeholder functions (done)
        // (4) add tab button sound fx
        // (5) fix stats UI items overlap
        // (6) change even handler from click to on button down (done)
        // (7) add a state machine for the stats hud for each tab option and connect to different singletons for data serialisation
        // (8) implement item status hud
        // (9) connect item status hud to the inventory singleton via game hud
        this.statsTab = document.querySelector('.v12_14');
        this.walletTab = document.querySelector('.v12_15');
        this.inventoryTab = document.querySelector('.v12_16');
        this.questTab = document.querySelector('.v12_17');
        
        // to do:
        // (1) connect each tab button to different statsHUD states
        // connect button click events to render functions via global singletons -> local object pointers
        // depreciate default inventory renderer
        this.statsTab?.addEventListener("pointerdown", () => { 
            window.music.ui_sfx[0].play();
            //this.debugTab("v12_14 stats tab")
            //trigger stats render state machine
            window.ui.StatsHUD?.stateMachine[3]();
        });
        this.walletTab?.addEventListener("pointerdown", () => {
            window.music.ui_sfx[0].play();
            //this.debugTab("v12_15 wallet tab")
            //trigger wallet render satate machine
            //trigger stats render state machine
            window.ui.StatsHUD?.stateMachine[1]();
        });
        this.inventoryTab?.addEventListener("pointerdown", () => {
            window.music.ui_sfx[0].play();
            //this.debugTab("v12_16 inventory tab")
            //trigger inventory render state machine
            window.ui.StatsHUD?.stateMachine[0]();
        });
        this.questTab?.addEventListener("pointerdown", () => {
            window.music.ui_sfx[0].play();
            //this.debugTab("v12_17 quests tab")
            //trigger quests render state machine
            window.ui.StatsHUD?.stateMachine[2]();

        });

        //console.log("tabs debug 2: ", this.statsTab);
    }

    debugTab(log : string){ // delete later
        // for debugging tab button presses
        // to do: (1) connect to different stats UI render
        window.music.ui_sfx[0].play();
        console.log(`tab button clicked x ${log}`)
    }
}

export class StatsHUD{
    /**
     * The game's inventory HUD
     * 
     * to do:
     * (1) create a state machine of multiple stats states (1/2)
     * (2) connect the state machine to all singletons serialising data to the player
     * (3) connect the state machine state so to their corresponting stats tab buttons
     * 
     */
    public statsUI: HTMLElement | null = null;
    public inventoryContainer : HTMLElement | null;
    public SHOW_INVENTORY : boolean = true;

    //status hud simple state machine
       public enum: Map<string, number> = new Map([
            ['STATE_INVENTORY', 0],
            ['STATE_WALLET', 1],
            ['STATE_QUEST', 2],
            ["STATE_STATS", 3]
    ]);
    // state machine variables
    public state : number = this.enum.get("STATE_INVENTORY") ?? 0;
    public stateMachine = this.StateMachine(); //make the state Machine global in class
    constructor(){
        // inventory tab logic
        this.inventoryContainer = document.getElementById("hud");
        this.statsUI = document.querySelector('.v11_5');
        
        // turn off hud visibility
        this.InventoryVisible = false;
        this.stateMachine[this.state](); // works
        
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
        //console.log("triggering stats hud"); // works
        LittleJS.setPaused(visible_);

        // play toggle sfx
        if (window.music) {
            window.music.ui_sfx[2].play(); // play robotic sfx
        }

        // game menu visibility
        if (visible_ == false) {
            this.inventoryContainer!.classList.add("hidden");

        }
        else if (visible_ == true) {

            this.inventoryContainer!.classList.remove("hidden");
        }


    };

    // State Machines
    // enemy state machine
    // describes each states and is assigned to a class variable in the consstructor
    StateMachine(): Record<number, () => void>  {

        // to do:
        // (1) populate state machine with all hud states (done)
        // (2) properly name state enums
        // (3) investigate if there's a html5 native way of rendering tab with panels
        // (4) fix each render function's code and test
        return {
            0 : () => { // inventory state
                // trigger inventory render function
                //console.log("Inventory state triggered");
                window.inventory.renderInventory(); // old inventory render is depreciated

            },
            1: () =>{
                //console.log("Wallet state triggered");
                // trigger wallet render fuction
                window.wallet.renderWallet();

            },
            2: () =>{ 
                //console.log("Quest state tringgered");
                // trigger quest render function
                window.quest.renderQuests();
       
            },
            3: () =>{
                //console.log("Stats state triggered");
                // trigger stats render function
                this.renderStats();
            }
        }
    }

    // render player stats fetched from the player object and the globals singleton
    // to do:
    // (1) test render function
    // (2) connect render function to stats hud
    private renderStats(): void {
        //const container = document.getElementById("inventory-items");
        //if (!container) return;
        
        if (!this.statsUI) return console.warn("debug Inventory UI");

        this.statsUI.innerHTML = ""; // clear UI

        // serialise global info to the stats ui
        let hp : number = window.globals.hp;
        let kc : number = window.globals.kill_count;
        this.statsUI.innerHTML = `
            <div class="stats-tab">
                <h2>Player Stats</h2>
                <p>Level: ${kc}</p>
                <p>HP: ${hp}</p>
                <p>Attack: 0</p>
                <p>Defense: 100</p>
            </div>
        `;
    }

    

}

export class MenuButton{
    /**
     * to do:
     * (1) add menu text to button object
     * 
     */

    public menuButton: HTMLButtonElement | null = null;
    constructor(){

           
        //render the menu button separately from all other ui
        this.menuButton = createTextureButton("./kenny ui-pack/grey_button08.png", "menu-btn",() => {
            window.music.ui_sfx[2].play();
            window.ui.GameMenu!!.MenuVisible = !window.ui.GameMenu!!.MenuVisible;
            //console.log("menu pressed");
        });

        //window.ui.leftButtons?.append(this.menuButton);
        window.ui.TopRightUI?.append(this.menuButton);
    }
    
}

export class IngameMenu{
    // buggy, code, does not work! October 3rd refactor
    public SHOW_MENU: boolean = true;
    // in game menu hud logic
    // in one class
        // UI Buttons
    // menu buttons
    //public menuButton: HTMLButtonElement | null = null;
    public menuContainer: HTMLElement | null;
    //public inventoryContainer : HTMLElement | null;

    public newGame: HTMLAnchorElement | null = null;
    public contGame: HTMLAnchorElement | null = null;
    public Comics: HTMLAnchorElement | null = null;
    public Controls: HTMLAnchorElement | null = null;
    public Wallet: HTMLAnchorElement | null = null;
    public Quit: HTMLAnchorElement | null = null;

    //public translations : Translations  = {};

    private language : string = window.dialogs.language; // fetch language from dialog singleton


    constructor(){
        //debug ingame menu
        //console.log("creating ingame menu");

        // game menu logic
        this.menuContainer = document.getElementById("menu-container");    
        this.MenuVisible = false; // make menu initially invisible    
        
        (async() =>{
            await this.ingameMenu();
        })
        
    }
    


    async ingameMenu() {
        /*
        * Creates the Ingame Menu UI Object
        *
        * To Do:
        * (1) ingame menu scaling via android singletons
        * (2) menu translations
        */


        // this is also the centerer position of the canvas
        //this.TopRightUI!.append(this.menuButton);


            //debug the translations csv
            //works        
            //console.log("translations debug: ",window.dialogs.translations);



        
        if (this.newGame) return; // guard clause
            console.log("Creating Ingame Menu");
        
            // note : 
            // (1) ingame menu translations is buggy
            this.newGame = this.createMenuOption(window.dialogs.t("new game", this.language), "#", () => {
                window.music.sound_start.play();
                
                //console.log('creating new game simulation');
                window.simulation = new Simulation();

                // to do :
                // (1) expand on save game and load game functionality
                Utils.saveGame();

                //hide menu
                window.ui.GameMenu!!.MenuVisible = false; // hide the menu ui
        });

        this.contGame = this.createMenuOption(window.dialogs.t("continue", this.language), "#", () => {
                    window.music.sound_start.play();
                    window.ads.showAds();
                    // logic
                    // (1) should fetch save game .save and load the current level in the global singleton
                    Utils.loadGame();

                     window.ui.GameMenu!!.MenuVisible = false; // hide the menu ui
                });

        // disable for yyandex updates
                 
        this.Comics = this.createMenuOption(window.dialogs.t("Comics",this.language), "#", () => {
            window.open("https://dystopia-app.site", "_blank");
        });
        
       
        // to do: (1) create controls UI
        //this.Controls = this.createMenuOption(window.dialogs.t("controls", this.language), "#", () => {
        //    window.music.sound_start.play();

            // window.ui.GameMenu!!.MenuVisible = false; // hide the menu ui
        //});

        this.Quit = this.createMenuOption(window.dialogs.t("quit", this.language), "#", () => {
            window.music.sound_start.play();
            window.THREE_RENDER.showThreeLayer();// doesn;t work
            
            //to do :
            // (1) implement close browser tab
            window.location.href = "about:blank";   // leaves your game

            //window.open('', '_self')?.close();  // only works if your game opened its own window

        });

        // append buttons to menu container
        
        this.menuContainer!.append(
                this.newGame,
                this.contGame,
                this.Comics,
                //this.Controls,
                this.Quit
            );
        
        
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
        if (window.music) {
            window.music.ui_sfx[2].play(); // play robotic sfx
        }

        // game menu visibility
        if (visible_ == false) {
            this.menuContainer!.classList.add("hidden");

        }
        else if (visible_ == true) {

            this.menuContainer!.classList.remove("hidden");
        }


    };


}

export class HeartBox{
    // heart box UI object
    public HEART_BOX: Array<HTMLDivElement> = [];
    constructor(){

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
            window.ui.TopRightUI!.appendChild(heart);            
            this.HEART_BOX.push(heart);
        }
        
    }

    
}



export function createPanel(id: string): HTMLDivElement {
        const div = document.createElement("div");
        div.id = id;
        div.className = "ui-panel";

        //get the ui root div element
        let UI_ROOT = document.getElementById("ui-root");
        UI_ROOT!!.appendChild(div);
        return div;
    }

    /**
     * Core UI Class
     * 
     * @param text 
     * @param onClick 
     * @returns 
     */
export function createTextureButton(imgSrc: string, className: string, onPress: () => void): HTMLButtonElement { // creates hud buttons. buggy
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