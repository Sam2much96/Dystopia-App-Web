    /* 
    Handles all Dialog logic
    
    Features:
    (1) Dialog box extents UI class

    Required:
    (1) Diaglog box UI + CSS (1/5)
    (2) Quest giver NPC
    (3) Signpost Object + collision trigger
    (4) lock dialog box design into css and html
    (5)

    To Do:
    (1) Move translation logic to the dialogs singleton
    (2) Implement translation dialogues
    (3) Implement Merchant NPC dialogues
    (4) Implement decision dialog box
    (5) Implement decision tree backend
    */
import { createPanel } from "./UI";
type Translations = Record<string, Record<string, string>>;

export class Diaglogs {

    public dialogBox : DialogBox = new DialogBox();
    dialog_started : boolean = false;
    dialog_ended : boolean = false;
    //language : string = "";

    // this need proper regex to account for multiple sub-region languages
    // locale lists: https://docs.godotengine.org/en/3.5/tutorials/i18n/locales.html#doc-locales
    public language : string = (navigator.language || 'en-US').replace('-', '_'); //set this from user settings or browser language
    public translations : Translations  = {};

    constructor(){
        console.log("Dialogs singleton language debug: ", this.language);
        
        //load the translation files into memory
        //(async () => {
        //    if (Object.keys(this.translations).length === 0) {
        //        console.log("loading translations");
        this.loadTranslations();
        //    }
       // })();
    }

    show_dialog(text: string, speaker: string){
        this.dialogBox.DialogVisible = true;
        this.dialogBox.dialogueBox(speaker,text);

    }

    // function not needed cus dialog box auto hides after 5 seconds
    // hide_dialogue(){}

    translate_to(_language: string, locale : string){}


    async loadTranslations() : Promise<Translations>{
        //translations[key][lang]
        //console.log("fetching translations file");
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
        return this.translations;
    }

    t(word : string, lang: string) : string { // translates the string file
        // doesn't work for other translations
        // bug: returns the key without actually translating
        // bug: function doesn't wait for finished loading translations to translate and so breaks
        // bug : breaks when translations is moved from ui clss to dialogs singleton
        //console.log("translations debug 2: ",this.translations["new game"]["fr"]); // works
        //if (!this.translations){ return word} // guard clause 
        //console.log("word debug: ", word);
        // guard clause
        if (Object.keys(this.translations).length === 0) {
            return word;
        }
        var y = this.translations[word][lang];        
        //console.log("lang debug 2: ", y, "/ key: ", lang);
        return y
        
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


export class DecisionDialogue{}