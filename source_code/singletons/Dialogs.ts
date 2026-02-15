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
    (8) Implement Dialogue box React Component

    Bugs:
    (1) load translations csv doesn't read data properly and mashes different languages together

    */
import * as LittleJS from 'littlejsengine';
const { isOverlapping,EngineObject, Color} = LittleJS;
//import { createPanel } from "./UI";



export class Diaglogs {

    public dialogBox : DialogBox = new DialogBox();
    private dialog_started : boolean = false;
    private dialog_ended : boolean = false;

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
    public DIALOG_BOX: HTMLDivElement | undefined;

    constructor(){
         
    }

    dialogueBox(speaker: string,text: string) {

        // Triggered by Pressing Key E; function called from the Input SIngleton 
        //console.log("Creating Dialgoue Box Object");
  

        this.DIALOG_BOX!!.innerHTML = `
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
        this.DIALOG_BOX!!.innerHTML = html;

        // Activate buttons
        const btns = this.DIALOG_BOX!!.querySelectorAll(".choice-btn");
        btns.forEach((btn) => {
            btn.addEventListener("click", () => {
                const idx = Number(btn.getAttribute("data-index"));
                choices[idx].callback();

                //console.log("button clicked")
            });
        });

    }

    get DialogVisible() : boolean {

        return this.DIALOG_BOX!!.classList.contains("show");
    }

    set DialogVisible(visible: boolean) {
        //this.DIALOG_BOX.classList.toggle("hidden", !visible);
        this.DIALOG_BOX!!.classList.toggle("show", visible);

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
        //error catchers
        if (!window.dialogs) return;
        if (!window.player) return;

        

        if (isOverlapping(this.pos, this.size, window.player.pos, window.player.size)){
            // if is colliding with player show this object's dialogue
            window.dialogs.show_dialog(this.speaker, this.dialogue);
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