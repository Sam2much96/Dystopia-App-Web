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

export class Diaglogs {

    public dialogBox : DialogBox = new DialogBox();
    dialog_started : boolean = false;
    dialog_ended : boolean = false;
    //language : string = "";

    // this need proper regex to account for multiple sub-region languages
    // locale lists: https://docs.godotengine.org/en/3.5/tutorials/i18n/locales.html#doc-locales
    public language : string = (navigator.language || 'en-US').replace('-', '_'); //set this from user settings or browser language

    constructor(){
        console.log("language debug: ", this.language);
    }

    show_dialog(text: string, speaker: string){
        this.dialogBox.DialogVisible = true;
        this.dialogBox.dialogueBox(speaker,text);

    }

    // function not needed cus dialog box auto hides after 5 seconds
    // hide_dialogue(){}

    translate_to(_language: string, locale : string){}


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