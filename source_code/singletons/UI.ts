/**
 * Game UI
 * 
 * Features:
 * (1) Renders all game UI and huds
 * (2) Uses stats.css and dialog.css for UI object styling
 * 
 * 
 * To Do:
 * (1) // to do: implement mouse pos for minimap drawing ui
 * (2) Connect Wallet tab and wallet render function to Wallet singleton to display token data
 * (3) implement renderMinimap function from simulation singleton
 * (4) implement status text UI
 * (5) implement runtime ui translations and not only creation ui translations 
 * (6) add button press animation for ui buttons into css
 * (7) polish UI styling for 1 month
 * (8) fix mandarin translation bug
 * 
 * 
 * Bugs:
 * (1) Menu Button icon doesn't render in production
 * (2) Screen D-Pad controls is laggy, consider debugging enemy A.I. if the cause pf lag is from simulations delta
 * (3) Status HUD buttons aren't working on mobile browsers, duplicate press initialisation from menu UI
 * (4) Fix Yandex moderation issues for IOS & android tv examples : https://github.com/Sam2much96/Dystopia-App-Web/issues/6
 * (5) Fix translation language logic with regex code for different language locales2 (done)
 * (6) Status HUD only updates oncec the tab buttons are pressed, but it should be update once the status HUD is visible
 * (7) Continue game logic is buggy and needs a structured way of saving the map name data into memory
 *      - the current implementaiton is very hacky
 * (8) fix status ui translations for yandex moderation
 * (9) hide the quit button for yandex moderation
 * (10) remove the address and Suds keywords from the game ui
 * (11) fix translation bugs i.e. hindi translations showing in chinese dialogue oprions
 */
import { Music } from "./Music";
//import {Simulation} from "./Simulation";
import { DialogBox } from "./Dialogs";
import {Utils} from "./Utils";

import { OverWorld } from "../scenes/levels/OverworldTopDown";//'../levels/OverworldTopDown';
import { OverworldSideScrolling } from '../scenes/levels/OverworldSideScrolling';
//import { Marketplace } from '../scenes/levels/Marketplace';
import { TempleInterior } from '../scenes/levels/TempleInterior';


import * as LittleJS from 'littlejsengine';




export class UI  {
    /* 
    Game UI System
    
    creates all game UI using html and css to create all UI elements

    Features:
    (1) in-game menu (done)
    (3) Game HUD 
        -inventory ui (2/3)
        -quest ui (done)
        -mini-map ui (1/3)
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


    //HUD Texture Buttons
    public statsButton: HTMLButtonElement | null = null; // button triggered from input via stats() method
    public dialogButton: HTMLButtonElement | null = null;
    public comicsButton: HTMLButtonElement | null = null;
    
    //public menuButton: HTMLButtonElement | null = null; // old menu button
    public menuButton : MenuButton | null = null;
    public itemButton: HTMLButtonElement | null = null;
    public SHOW_DIALOGUE: boolean = true;
    
    // safe pointer to the music global singleton
    public local_music_singleton : Music = window.music;
    

    private language : string = window.dialogs.language!!; // fetch language from dialog singleton // bug : breaks
    public HeartBoxHUD : HeartBox | undefined;
    public StatusTabs : StatsTabs | undefined ;
    public StatsHUD : StatsHUD | undefined;
    public GameMenu : IngameMenu | undefined;
    public Dialog : DialogBox | undefined; 
    public Controls : Controls | undefined;

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

        
        
        this.HeartBoxHUD = new HeartBox();
        // create a div for each of these new UI elements
        this.UI_MENU = createPanel("ui-menu"); // create a ui panel div and attach it to the ui root div

        this.UI_ROOT!!.append(
                    this.UI_MENU
                );

        //this.inventoryContainer?.append(this.UI_STATS);

        //console.log("Menu Debug 1: ", this.menuContainer);
        //create the dialog box object
        this.Dialog = new DialogBox()

        // creates the status hud
        this.StatusTabs = new StatsTabs();

        
        //this.Controls = new Controls();

        

        }
   
    menu(){
        //works
        //console.log("creating the menu button");
        //render the menu button
        this.menuButton = new MenuButton();
        //console.log("menu button debug: ",this.menu);
    }
    stats(){
        console.log("creating the stats hud 1");
        //create the inventory hud
        this.StatsHUD = new StatsHUD();

    }

    gameMenu(){
        //console.log("creating the game menu 1");
        //create the game menu
        this.GameMenu = new IngameMenu();

    }

    gameHUD() {
        /*  
        * Spawns The Game HUD Buttons & Connects 
        * Their SIgnals on start of the game 
        * 
        * To do:
        * (1) lock game hud designs into html and css class (done)
        * (2) include logic to hide the game hud once game menu is visible to prevent UI overlap (1/2)
        * (3) separate game hud into separate class (0/2)
        */


        
        // console.log("Creating Game HUD Buttons");
        // 
        // create texture buttons and bind their actions
        this.statsButton = createTextureButton("./btn-stats.png","ui-button", () =>{
            //
            //console.log("stats button pressed");
            //
            
            this.StatsHUD!!.InventoryVisible = !this.StatsHUD!!.InventoryVisible; // toggle ui visible / invisible
            window.music.ui_sfx[1].play();
        });
        // to do:
        // (1) lock gameHUD layout into separated css and html files and separte each ui into seprate css object
        // depreciate wallet button into hud renders
        this.itemButton = createTextureButton("./btn-hands.png","ui-button", () => {

           // console.log("wallet button pressed");
           // features:
            // to do:
            // (1) show the currently held item
            // (2) an implementation of the item holding ui
            //window.music.ui_sfx[0].play(); 
            window.player.holdingAttack = true; // trigger the player attac

            
        
        });

        this.dialogButton = createTextureButton("./btn-interact.png", "ui-button", ()=>{
            //
            // show placeholder dialog
            //
            window.dialogs.show_dialog("...", "Aarin: ...");
        });
        
  

        // left buttons on the ui
        this.leftButtons!.append( this.statsButton,this.itemButton, this.dialogButton);
        

    }


  /**
 * Translates all HTML elements at runtime by using their data-i18n keys.
 * 
 * Works for:
 * - HTMLAnchorElement (links, buttons)
 * - HTMLElement (divs, spans, etc.)
 *
 * Usage:
 *   1. Add data-i18n="translation_key" to any HTML element
 *   2. Call translateUI(runtimeLanguage)
 */
async translateUIElements(language: string) {
  if (!window.dialogs || !window.dialogs.t) {
    console.warn("Translation system not ready yet.");
    return;
  }

  //// Wait until translations file is loaded
  await waitForTranslations();

  // Select all elements marked for translation
  const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");

  elements.forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;

    // Translate text content using your existing system
    const translatedText = window.dialogs.t(key, language);
    if (translatedText) {
      // Handles <a>, <button>, <div>, <span> etc.
      el.textContent = translatedText;
    }
  });

  console.log(`✅ UI translated to ${language}`);


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
        // (8) implement item status text hud
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
     * Bug:
     * (1) this ui renders before the translations file is finished loading
     * (2) translaton UI functions are unimplented for wallet and stats renderer
     *  - (a) debug stats ui renderer in yandex platform for compliance
     *  - (b) set up a tiralogue translate timer to test all ui translations locally
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

    // ui translations
    // UI translations
    private stsdiag?: string;
    private kcdiag?: string;
    private dcdiag?: string;

    constructor(){
        console.log("creating status hud");

        
        
        // inventory tab logic
        this.inventoryContainer = document.getElementById("hud");
        this.statsUI = document.querySelector('.v11_5');

        //mark this element for translations
        this.statsUI!.dataset.i18n = "Stats";

        
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
                // to do:
                // (1) implement translations for wallet render
                window.wallet.renderWallet();

            },
            2: () =>{ 
                //console.log("Quest state tringgered");
                // trigger quest render function
                window.quest.renderQuests();
       
            },
            3: () =>{
                console.log("Stats state triggered");
                // trigger stats render function
                // to do:
                // (1) implement translatoins for stats render
                this.renderStats();
            }
        }
    }

    // render player stats fetched from the player object and the globals singleton
    // to do:
    // (1) test render function
    // (2) connect render function to stats hud
    // (3) fix translations
    private renderStats(): void {
        //const container = document.getElementById("inventory-items");
        //if (!container) return;
        
        if (!this.statsUI) return console.warn("debug Inventory UI");
        
        this.statsUI.innerHTML = ""; // clear UI

        // translate the ui
        this.stsdiag = window.dialogs.t('Stats');
        this.kcdiag = window.dialogs.t('kills');
        this.dcdiag = window.dialogs.t('deaths');

        // serialise global info to the stats ui
        let hp : number = window.globals.hp;
        let kc : number = window.globals.kill_count;
        let dc : number = window.globals.death_count;

       
        //let lvl : String = window.globals.current_level;
        // todo:
        // (5) fix coin collect subsystem & ui
        // (6) translate all status ui

        this.statsUI.innerHTML = `
            <div class="stats-tab">
                <h2>${this.stsdiag}</h2>
                <p> ${this.kcdiag}: ${kc}</p>
                <p>${this.dcdiag}: ${dc}</p>
                <p>HP: ${hp}</p>
                
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
        this.menuButton = createTextureButton("./kenny ui-pack/grey_crossGrey.png", "menu-btn",() => {
            window.music.ui_sfx[2].play();
            window.ui.GameMenu!!.MenuVisible = !window.ui.GameMenu!!.MenuVisible;
            //console.log("menu pressed");
        });

        //window.ui.leftButtons?.append(this.menuButton);
        window.ui.TopRightUI?.append(this.menuButton);
    }
    
}

export class IngameMenu{
    
    public SHOW_MENU: boolean = true;

    // menu buttons
    //
    public menuContainer: HTMLElement | null;
    public newGame: HTMLAnchorElement | null = null;
    public contGame: HTMLAnchorElement | null = null;
    public Comics: HTMLAnchorElement | null = null;
    public Controls: HTMLAnchorElement | null = null;
    public Wallet: HTMLAnchorElement | null = null;
    public Quit: HTMLAnchorElement | null = null;

    //public translations : Translations  = {};

    //private language : string = window.dialogs.language!!; // fetch language from dialog singleton


    constructor(){
        //debug ingame menu
        //console.log("creating ingame menu");

        // game menu logic
        this.menuContainer = document.getElementById("menu-container");    
        this.MenuVisible = true; // make menu initially invisible    
        
        this.ingameMenu();
        
        
    }
    


    ingameMenu() {
        /*
        * Creates the Ingame Menu UI Object
        *
        * 
        */

        if (this.newGame) return; // guard clause
            console.log("Creating Ingame Menu");
        
            // note : 
            // (1) ingame menu translations is buggy
            this.newGame = this.createMenuOption(window.dialogs.t("new game"), "#", () => {
                window.music.sound_start.play();
                
                //console.log('creating new game simulation');
                //window.simulation = new Simulation();
                window.globals.GAME_START = true; // trigger the start sequence on the overworld title map
                // save fresh game data to memory
                Utils.saveGame();

                //hide menu
                window.ui.GameMenu!!.MenuVisible = false; // hide the menu ui

                //show game monetize ads
                if (window.ads){
                    window.ads.initialize();
                    window.ads.showAds();
                }
        });

        // mark element for translations
        //this.newGame.dataset.i18n = "new_game";


        this.contGame = this.createMenuOption(window.dialogs.t("continue"), "#", () => {
                    window.music.sound_start.play();
                    //window.ads.showAds();
                    // logic
                    // (1) should fetch save game .save and load the current level in the global singleton
                    // to do:
                    // (1) implement load game funcitionality (1/3)
                    // (2) simulation object to collect the load game object parameter to load last player scene from memory (done)
                    // bugs:
                    // (1) load scene logic is buggy because current level save is not properly done
                    Utils.loadGame();
                    if (window.map){
                        //destroy the overworld scene and player
                        window.map.destroy();
                    }
                    let curr_lvl = window.globals.current_level;
                    window.globals.GAME_START = true;
                    if (window.THREE_RENDER){

                        //window.THREE_RENDER.deleteCube();
                        window.THREE_RENDER.hideThreeLayer();

                    }
                    

                    //to do:
                    //(1) implement a hide layer on map objects
                    if (curr_lvl !== ""){
                        
                        
                        if (curr_lvl === "Overworld"){
                            console.log("Loading Overworld level");
                            window.map = new OverWorld();
                            
                        }
                        else if(curr_lvl ==="Overworld 2"){
                            console.log("Loading Overworld 2");
                            window.map = new OverworldSideScrolling();
                        }
                        else if (curr_lvl === "Temple"){
                            console.log("Loading Temple Level")
                             
                            
                            // spawn the new overworld scene 
                                            
                            console.log("Loading Temple Interior");
                            window.map = new TempleInterior()
                        }
                        else return
                        // you cannot load into the shop level unfortunately so no functionality for that
                    }

                     window.ui.GameMenu!!.MenuVisible = false; // hide the menu ui
                });

        // disable for yyandex updates
                 
        this.Comics = this.createMenuOption(window.dialogs.t("comics"), "#", () => {
            window.open("https://dystopia-app.site", "_blank");
        });
        
       
        // to do: 
        // (1) create controls UI (done)
        // (2) fix controls renderer
        //this.Controls = this.createMenuOption(window.dialogs.t("controls"), "#", () => {
        //    window.music.sound_start.play();

            // logic: 
            // hide the menu ui
            // show the controls menu
        //    window.ui.Controls!!.ControlsVisible = true;
        //});

        // hiding the quit button for yandex platform moderation
        // it triggers a non compliance of game stutering
        //
        //this.Quit = this.createMenuOption(window.dialogs.t("quit"), "#", () => {
        //    window.music.sound_start.play();
        //    window.location.href = "about:blank";   // leaves your game, disable in yandex build
            //window.close();

        //});

        // append buttons to menu container
        
        this.menuContainer!.append(
                this.newGame,
                this.contGame,
                this.Comics,
                //this.Controls,
                //this.Quit
            );
        
        
    }




    private createMenuOption(text: string, href: string, onPress: () => void): HTMLAnchorElement { // creates menu buttons
        const option = document.createElement("a");
        option.href = href;
        option.className = "menu-option";
        option.innerText = text;
        // mark element for translations
        //this.newGame.dataset.i18n = "new_game";
        
        //mark element for translations
        option.dataset.i18n = text;

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
    /**
     * Bugs:
     * (1) heart box tretches the camera bounds on mobile and does not tretch into 2 separate lines
     *  - include css + bondary box to account for multiline heartbox
     * 
     */
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


export class Controls{
    // to do :
    // (1) duplicate of ingame menu button structure
    // (2) expose all singleton  and core engine internals via script
    // bugs:
    // (1) doesn't work
        public SHOW_CONTROLS: boolean = true;

    // menu buttons
    //
    public controlsContainer: HTMLElement | null;
    public music: HTMLAnchorElement | null = null;
    public language: HTMLAnchorElement | null = null;
    public shuffle_music: HTMLAnchorElement | null = null;
    //public help: HTMLAnchorElement | null = null;
    public vibrations: HTMLAnchorElement | null = null;
    public multiplayer: HTMLAnchorElement | null = null;
    public deleteSave: HTMLAnchorElement | null = null;
    public back: HTMLAnchorElement | null = null;

    constructor(){

         // game menu logic
        this.controlsContainer = document.getElementById("controls-container");    
        this.ControlsVisible = true; // make menu initially invisible 
        //window.ui.Controls.ControlsVisible = false;
    }

    /**
     * UI visibility Toggles
     * 
     * Features:
     * (1) external methods to toggle UI states as setter & getter functions
     */

    get ControlsVisible() : boolean {
        return this.SHOW_CONTROLS;
    };

    /**
     *  In Game Menu Visibility controls & settings
     * 
     */
    set ControlsVisible(visible_: boolean) {
        // Toggles Menu Visibility
        this.SHOW_CONTROLS = visible_;

        // play toggle sfx
        if (window.music) {
            window.music.ui_sfx[2].play(); // play robotic sfx
        }

        // game menu visibility
        if (visible_ == false) {
            this.controlsContainer!.classList.add("hidden");

        }
        else if (visible_ == true) {

            this.controlsContainer!.classList.remove("hidden");
        }


    };

    private createMenuOption(text: string, href: string, onPress: () => void): HTMLAnchorElement { // creates menu buttons
        /**
         * Features:
         * (1) duplicated menu option creation button
         * 
         * To do:
         * (1) Modify function to use a specific controls css
         * 
         */
        const option = document.createElement("a");
        option.href = href;
        option.className = "menu-option";
        option.innerText = text;
        // mark element for translations
        //this.newGame.dataset.i18n = "new_game";
        
        //mark element for translations
        option.dataset.i18n = text;

        // to do: use event handler architecture for stats UI buttons
        const handler = (event: Event) => {
            event.preventDefault(); // Prevent navigation
            if (this.controlsContainer!.style.display !== "none") {
             onPress();
            }
        };
        

        // Use pointerdown for broad device compatibility
        option.addEventListener("pointerdown", handler);

        // Optionally add click as a fallback
        option.addEventListener("click", handler);
        
        return option;
    }


    Controls() {
        /*
        * Creates the Ingame Controls UI Object
        *
        * 
        */

        if (this.back) return; // guard clause
            console.log("Creating Controls Menu");
        
            // note : 
            // (1) ingame menu translations is buggy
            this.back = this.createMenuOption(window.dialogs.t("back"), "#", () => {
                window.music.sound_start.play();
                
             
                // save the game's configuration to memory
                Utils.saveGame();

                //hide menu
                this.ControlsVisible = false;
                //window.ui.GameMenu!!.MenuVisible = false; // hide the menu ui
        });

        // mark element for translations
        //this.newGame.dataset.i18n = "new_game";


        this.music = this.createMenuOption(window.dialogs.t("music"), "#", () => {
                    window.music.sound_start.play();
                    window.music.enable = !window.music.enable; // disable / enable the music player
        });

        // manually set the language
        this.language = this.createMenuOption(window.dialogs.t("languague"), "#", () => {
            // logic: 
            // (1) show an menu option for all the supported languages
            // (2) set the dialogue language to the user selected language
            // (3) trigger the ui translation functions
        });
        
       
        // hiding the quit button for yandex platform moderation
        // it triggers a non compliance of game stutering
        //
        this.shuffle_music = this.createMenuOption(window.dialogs.t("shuffle"), "#", () => {
            // to do:
            // (1) expand on the music singleton

            // logic
            // (1) stop the current music player
            // (2) run the randomization music algorithm
            // (3) play the currently selected music

        });

         this.vibrations = this.createMenuOption(window.dialogs.t("vibration"), "#", () => {
                    window.music.sound_start.play();
                    //window.music.enable = !window.music.enable; // disable / enable the little js engine vibrations
        });

        // append buttons to menu container
        
        this.controlsContainer!.append(
                this.back,
                this.music,
                this.language,
                this.shuffle_music,
                this.vibrations
            );
        
        
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

async function waitForTranslations(): Promise<void> {
    // Wait until window.dialogs.loadedTranslations is true
        return new Promise((resolve) => {
            const check = () => {
            if (window.dialogs.loadedTranslations) {
                console.log("translations check 6: ", window.dialogs.translations["Stats"]["ru_RU"]); // works
                
                resolve();
            } else {
            requestAnimationFrame(check);
            }
        };
        check();
        });
  }

