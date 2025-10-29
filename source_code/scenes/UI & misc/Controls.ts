/**
 * 
 * Controls 
 * 
 * All Game Engine control settings in a single class
 * 
 * Features :
 * (1) Maps the game engine controls to a game hud UI
 * 
 * To Do:
 * (1) Implement kenny UI stylesheet
 * (2) Map engine settings via Controls class to UI.ts
 * 
 */

import * as LittleJS from 'littlejsengine';



//const {setTouchGamepadAlpha, setTouchGamepadAnalog,setTouchGamepadSize, setTouchGamepadEnable} = LittleJS;



export class Controls {


    constructor(){
    // hide the engine splash screen
    LittleJS.setShowSplashScreen(true);

    // Game Pad on Mobile Devices Settings
    LittleJS.setTouchGamepadEnable(true);
    LittleJS.setTouchGamepadSize(150); // game pad is too big on some mobile browsers
    LittleJS.setTouchGamepadAlpha(0.3);

    // set dpad configuration on mobile browsers 
    LittleJS.setTouchGamepadAnalog(false);
    }

    
}


/**
 * 
 * Drop down element to trigger translations
 * 
 * const languageSelector = document.getElementById("lang-select");
languageSelector?.addEventListener("change", async (e) => {
  const lang = (e.target as HTMLSelectElement).value;
  window.dialogs.language = lang;
  await translateUIElements(lang);
});

 * 
 */