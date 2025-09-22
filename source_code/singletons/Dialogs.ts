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
    */


export class Diaglogs {


    dialog_started : boolean = false;
    dialog_ended : boolean = false;
    //language : string = "";
    public language : string = (navigator.language || 'ru-RU').replace('-', '_'); //set this from user settings or browser language

    constructor(){
        console.log("language debug: ", this.language);
    }

    show_dialog(text: string, speaker: string){

    }

    hide_dialogue(){}

    translate_to(_language: string, locale : string){}


}
