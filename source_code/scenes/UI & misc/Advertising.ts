// Import necessary SDK module types.
import type { SDK, Player } from 'ysdk';



//import { FB } from './facebook-sdk';

// note: facebook app id is : 1271967600833599
// note: fix version has no source for yandex games submission
//  - check the docs for uploading a valid build
// new error:  Service storage URL detected
export class Ads {
    /**
     * Yandex Games Ads implementation
     * 
     * Features:
     * (1) show advertising on title screen
     * (2) integrate shop with yandex games shop impl (1/5)
     * (3) integrate with facebook instant games & facebook sdk (1/3)
     * 
     * 
     * Facebook Games Integrations
     * (1) Integrates intersitial ads and rewarded videoa ds into the game 
     */
    private ysdk : SDK | undefined ; //= await YaGames.init();
    

    constructor(){}

    async initSDK() : Promise<void>  {
      
    if (typeof window.YaGames !== 'undefined') {
        this.ysdk = await window.YaGames.init();
        // Proceed with SDK usage
    } else {
        console.warn("YaGames SDK is not available. Are you running locally?");
    }
    }



    


}


