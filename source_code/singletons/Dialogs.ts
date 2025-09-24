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

    // this need proper regex to account for multiple sub-region languages
    // locale lists: https://docs.godotengine.org/en/3.5/tutorials/i18n/locales.html#doc-locales
    public language : string = (navigator.language || 'en-US').replace('-', '_'); //set this from user settings or browser language

    constructor(){
        console.log("language debug: ", this.language);
    }

    show_dialog(text: string, speaker: string){

    }

    hide_dialogue(){}

    translate_to(_language: string, locale : string){}


}
