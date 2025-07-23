// Import necessary SDK module types.
import type { SDK, Player } from 'ysdk';

import { FB } from './facebook-sdk';


export class Ads {
    /**
     * Yandex Games Ads implementation
     * 
     * Features:
     * (1) show advertising on title screen
     * (2) integrate shop with yandex games shop impl (1/5)
     * (3) integrate with facebook instant games & facebook sdk (1/3)
     */
    private ysdk : any;
    

    constructor(){}

    async initSDK() : Promise<void>  {
      
        // Example of using the SDK with types.
        this.ysdk = await YaGames.init();
        
        this.ysdk.adv.showFullscreenAdv({
            callbacks: {
                onClose : () => {
                    console.info("First close Debug");
                }
            }
        });
        
        //const player: Player = await ysdk.getPlayer();
    }


    async FacebookInit() {
        await FB.initializeAsync();
        FB.setLoadingProgress(100);
        await FB.startGameAsync();

        console.log('Player ID:', FB.player.getID());
    }

    async showRewardedAd() {
        const ad = await FB.getRewardedVideoAsync('YOUR_PLACEMENT_ID');
        await ad.loadAsync();
        await ad.showAsync();
    }

    async postScore() {
        const leaderboard = await FB.getLeaderboardAsync('global');
        await leaderboard.setScoreAsync(1234);
    }

    async buyItem(productID: string) {
        await FB.payments.purchaseAsync({ productID });
    }


}
