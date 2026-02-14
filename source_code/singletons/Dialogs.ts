    /* 
    Handles all Dialog logic
    
    Features:
    (1) Dialog box extents UI class

    Required:
    (1) Diaglog box UI + CSS (3/5)
    (2) Decision dialog box
    (3) 
    (4) 
    (5)
    Note:
    (1) if the game randomly breaks on startup, check the translation function, its most likely the cause

    To Do:
    (1) Move translation logic to the dialogs singleton (done)
    (2) Implement translation dialogues
    (3) Implement Merchant NPC dialogues (done)
    (4) Implement decision dialog box
    (5) Implement decision tree backend
    (6) Implement Regex code to fix dialogue language mismatch with translations csv (done) 
    (7) Implement Yandex automatic language detection from yandex sdk (done)

    Bugs:
    (1) load translations csv doesn't read data properly and mashes different languages together

    */
import * as LittleJS from 'littlejsengine';
const { isOverlapping,EngineObject, Color} = LittleJS;
import { createPanel } from "./UI";
import Papa from "papaparse"; //for parsing a csv file properly
type Translations = Record<string, Record<string, string>>;


export class Diaglogs {

    public dialogBox : DialogBox = new DialogBox();
    private dialog_started : boolean = false;
    private dialog_ended : boolean = false;
    public loadedTranslations : boolean = false;
    
    // to do: 
    // (1) this need proper regex to account for multiple sub-region languages
    // locale lists: https://docs.godotengine.org/en/3.5/tutorials/i18n/locales.html#doc-locales
    public language : string =this.normalizeLocale(navigator.language); //set this from user settings or browser language
    public translations : Translations  = {};

    constructor(){

        //load the translation files into memory
        //
        // 
        //
        //load the game map
        //(async () => {
        //    await this.loadTranslations();
        //})();
        
        

    }

    show_dialog(text: string, speaker: string){
        this.dialogBox.DialogVisible = true;
        this.dialogBox.dialogueBox(speaker,text);

    }
 
    show_decision_dialog(text: string, speaker : string, options : { label: string; callback: () => void }[]){
        this.dialogBox.DialogVisible = true;
        this.dialogBox.decisionDialogBox(text, speaker, options)       
    }


            //bugs:
        // (1) loads the translations buggily, sometimes, other languages are triggered
        // (2) audit buggy translatoins bug
        // to do: 
        // (1) rework this logic so it parses the translations csv properly
        // (2) fix translations bug
        // (3) add conditional for failed async fetch

        // to do:
        // (1) depreciate this functionality window.ui.translateUIElements() function
        // (2) create run time translation functions not just constructor translations
        // (3) call run time translations function from yandex ads 
    async loadTranslations() : Promise<Translations>{

        console.log("fetching translations file");
        const response  = await fetch ("./Translation_1.csv"); // works
        const csvText = await response.text(); // works

        console.log("Translation files fetched");
        //const lines = csvText.trim().split("\n");
        //const headers = lines[0].split(',');
        //    for (let i = 1; i < lines.length; i++) {
        //const cols = lines[i].split(',');
        //const key = cols[0];
        //this.translations[key] = {};
        //for (let j = 1; j < headers.length; j++) {
        //        this.translations[key][headers[j]] = cols[j];
        //    }
        //}
        const result = Papa.parse(csvText, {
            header: true,
            skipEmptyLines: true
        });
        
        //this.translations = {};

        for (const row of result.data as any[]) {
            const key = row[Object.keys(row)[0]];
            this.translations[key] = row;
        }

        //console.log(this.translations);

        //debug language translations
        console.log("translations debug 0: ",this.translations["new game"]["fr"]); // works

        //temporarily disabled for refactoring
        //window.ui.translateUIElements(window.dialogs.normalizeLocale(this.language));
        

        this.loadedTranslations = true;
        return this.translations;
    }

    t(word : string, lang: string = this.language!!) : string { // translates the string file
        // doesn't work for other translations
        // bug: returns the key without actually translating
        // bug: function doesn't wait for finished loading translations to translate and so breaks
        // bug : breaks when translations is moved from ui clss to dialogs singleton
        //console.log("translations debug 2: ",this.translations["new game"]["fr"]); // works
        //if (!this.translations){ return word} // guard clause 
        //console.log("word debug: ", word);
        // guard clause
        //console.log("translations debug: ",this.translations); // works
        //console.log("translations debug 2 ", this.translations['Stats']); 
        //console.log("translatiing ", word);
        if (Object.keys(this.translations).length === 0 && !this.loadedTranslations) {
            return word;
        }
        //console.log("word debug: ", word); // for debug purposes only
        var y = this.translations[word][lang];        
        //console.log("lang debug 2: ", y, "/ key: ", lang, "/ word: ", word);
        return y
        
    }



    normalizeLocale(input: string): string {
        /**
         * Normalize locale to match translation file formats.
         *
         * Supported locales:
         * en_US, pt_BR, fr, te_IN, hi_IN, yo_NG, ha_NG, ig_NG, ja, zh_CN, ar, ru_RU
         *
         * Examples:
         *  - "en"     => "en_US"
         *  - "ru"     => "ru_RU"
         *  - "tr"     => "pt_BR"
         *  - "en_UK"  => "en_US"
         *  - "ru_UK"  => "ru_RU"
         *  - "es"     => "pt_BR"
         */
        
        // Lowercase and normalize separators
        const locale = input.trim().replace(/-/g, "_").toLowerCase();

        // Base mapping table
        // maps specialisad translations to their supported translations
        const map: Record<string, string> = {
            en: "en_US",
            en_uk: "en_US",
            en_us: "en_US",
            ru: "ru_RU",
            ru_uk: "ru_RU",
            ru_ru: "ru_RU",
            tr: "pt_BR",
            es: "pt_BR",
            fr: "fr",
            te: "te_IN",
            hi: "hi_IN",
            yo: "yo_NG",
            ha: "ha_NG",
            ig: "ig_NG",
            ja: "ja",
            zh: "zh_CN",
            ar: "ar",
        };

        // Try exact match
        if (map[locale]) return map[locale];

        // Try to match just the language code (e.g. "en" from "en_CA")
        const langMatch = locale.match(/^([a-z]{2})/);
        if (langMatch && map[langMatch[1]]) {
            return map[langMatch[1]];
        }

        // Default fallback
        return "en_US";
    }


}


export class DialogBox{
    /**
     * Dialog Box
     * 
     * Features:
     * (1) shows dialogue via global trigger
     * 
     * To Do:
     * (1) implement timeout funcitonality using LittleJS timer or typescript based timer
     * (2) Implement animation using css animation and transitions
     * (3) Add Boundary box , continue prompt
     * (4) Implement dialog translations
     * (5) Implement decision tree dialog box
     * (6) Implemeent DIalog trigger collsion object class
     * 
     * bugs:
     * (1) shows very small on mobile devices and doesnt scale up
     * (2) is not centralised on mobile, instead shows at the bottom on mobiles. Fix  alignment in css
     * 
     */
    public DIALOG_BOX: HTMLDivElement;

    constructor(){
        
        //if (!window.dialogs.dialogBox){
            // to do:
            // (1) add dialog box class to the singleton variable
            // make object global via dialog singleton
         //   window.dialogs.dialogBox = self;
        
        //}

        //depreciated dialog box creation October 33rd refactor
        this.DIALOG_BOX = createPanel("dialog-box");
        this.DialogVisible = false; 
    }

    dialogueBox(speaker: string,text: string) {

        // Triggered by Pressing Key E; function called from the Input SIngleton 
        //console.log("Creating Dialgoue Box Object");
  

        this.DIALOG_BOX.innerHTML = `
        <div class="dialog-content">
            
            <!-- Speaker Name -->
            <div class="dialog-speaker">${speaker}</div>

            <!-- Decorative or Background Element -->
            <div class="v1_2"></div>
            <div class="v1_3"></div>

            <!-- Text Content -->
            <span class="v1_4">${text}</span>

        </div>`;
    }

    decisionDialogBox(
        speaker: string,
        text: string,
        choices: { label: string; callback: () => void }[]
    ){
        /**
         * Decision dialogue box implementation
         * 
         * example usage:
         * this.decisionDialogBox(
         *   "Guard",
         *   "Do you want to enter the castle?",
         *   [
         *       { label: "Enter", callback: () => console.log("Player enters") },
         *       { label: "Leave", callback: () => console.log("Player leaves") }
         *   ]
         * );
         */


        // Build decision dialog HTML
        const html = `
        <div class="dialog-content">
            
            <!-- Speaker Name -->
            <div class="dialog-speaker">${speaker}</div>

            <div class="v1_2"></div>
            <div class="v1_3"></div>

            <!-- Text Content -->
            <span class="v1_4">${text}</span>

            <!-- Decision Buttons -->
            <div class="dialog-choices">
                ${choices
                    .map(
                        (c, i) => `
                    <button class="choice-btn" data-index="${i}">
                        ${c.label}
                    </button>`
                    )
                    .join("")}
            </div>

        </div>`;

        // Insert into dialogue box container
        this.DIALOG_BOX.innerHTML = html;

        // Activate buttons
        const btns = this.DIALOG_BOX.querySelectorAll(".choice-btn");
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.getAttribute("data-index"));
                choices[idx].callback();

                //console.log("button clicked")
            });
        });

    }

    get DialogVisible() : boolean {

        return this.DIALOG_BOX.classList.contains("show");
    }

    set DialogVisible(visible: boolean) {
        //this.DIALOG_BOX.classList.toggle("hidden", !visible);
        this.DIALOG_BOX.classList.toggle("show", visible);

        //auto hides dialogue box after 5 seconds
        if (visible) {
        // auto-hide after 5 seconds
        setTimeout(() => {
            this.DialogVisible = false;
        }, 5000);
    }
    }





}


export class DialogTrigger extends EngineObject{
    /**
     * 
     * Features:
     * (1) acts as a child of any object that triggers a dialogue event instead of adding the collision logic on the Object iteslf
     * (2) implemented as child of the NPC static object and the Signpost object
     * (3) should be added as a child of any object that wants to make a dialogue
     * 
     */

    public enabled : boolean = true;
    public dialogue : string = "Lorem Ipsum"; // the dialogue to show
    public speaker : string = "Lorem Ipsum"; // dialogue speaker to show
    constructor(pos: any, size :any){
        super();
        // make the object take it's parent's pos and size
        this.pos = pos;
        this.size = size;

        this.color = new Color(0, 0, 0, 0); // make object invisible

        // make object invisible
    }
    update(): void {
        if (window.player){

                    if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)){
            // if is colliding with player show this object's dialogue
            window.dialogs.show_dialog(this.speaker, this.dialogue);
        }
        }

    }

}


export class DecisionTrigger extends EngineObject{
    /**
     * Decision Dialogue Box:
     * 
     * (1)
     * 
     * To do:
     * (1) implement the ui in css class
     * (2) implement the ui buttons
     * 
     */

    
    public enabled : boolean = true;
    public dialogue : string = "Lorem Ipsum"; // the dialogue to show
    public speaker : string = "Lorem Ipsum"; // dialogue speaker to show
    public choices : { label: string; callback: () => void }[]

    constructor(pos : any, size : any, choices : { label: string; callback: () => void }[]){
        super();
        this.pos = pos;
        this.size = size;
        this.color = new Color(0, 0, 0, 0); // make object invisible
        this.choices = choices;
    }

    update() : void{

        if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)){
            // if is colliding with player show this object's dialogue
            //window.dialogs.show_decision_dialog();
            //console.log("Implement Decision Dialogue");

            // works
            window.dialogs.show_decision_dialog(
                this.speaker,
                this.dialogue,
                this.choices
            );

        }
    }
}