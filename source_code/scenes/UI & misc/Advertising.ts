// Import necessary SDK module types.
//import type { SDK, Player } from 'ysdk';
import { GameMonetizeAds } from "./GameMonetizeAds";
// to do: 
// (1) Lock yandex ads sdk into a typescript code 
// (2) test yandex ads implemenetation 
import { YandexAds } from "./YandexAds"; //requires testing on yandex
import { GoogleAnalytics } from "./GoogleAnalytics";
 
//import { FB } from './facebook-sdk';

// note: facebook app id is : 1271967600833599

export class Advertising {
    /**
     * Games Ads implementation
     * 
     * Features:
     * (1) show advertising on title screen
     * (2) integrate shop with yandex games shop impl (1/5)
     * (3) implement yandex ads also
     * (4) integrate with games monetize sdk https://gamemonetize.com (done)
     * 
     * Facebook Games Integrations
     * (1) Integrates intersitial ads and rewarded videoa ds into the game 
     */

    constructor(platform: string){
        console.log("Creating Advertising Singleton");
        
        if (platform==="gamemonetize"){
            const ads = new GameMonetizeAds(); //works
            ads.showBanner(); //works
        }
        if (platform ==="yandex")
            {
            // Get the singleton instance
            const yads = YandexAds.getInstance();

            // Show fullscreen ad
            yads.showFullscreenAd();
            
            // Show rewarded ad (for shop/reward system)
            //yads.showRewardedAd();


        }


        // Create instance (only runs in production, skips on localhost/dev)
        const ga = GoogleAnalytics.getInstance("G-4XTFM74YY1");

        // Send custom events
        // to do:
        // (1) check documentation
        // (2) test implementation : docs : https://developers.google.com/analytics/devguides/collection/ga4/events?utm_source=chatgpt.com
        // docs : https://developers.google.com/tag-platform/gtagjs/reference?utm_source=chatgpt.com
        // docs3 : https://developers.google.com/tag-platform/gtagjs/reference/events?utm_source=chatgpt.com
        // docs4 : https://developers.google.com/analytics/devguides/collection/ga4/event-parameters?utm_source=chatgpt.com
        // docs5: https://support.google.com/analytics/answer/9322688?hl=en&utm_source=chatgpt.com
        //ga.sendEvent("level_start", { level: 1 });
        //ga.sendEvent("purchase", { item: "Health Potion", price: 50 });

    }

    


}


