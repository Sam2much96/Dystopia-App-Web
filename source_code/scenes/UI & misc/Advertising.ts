// Import necessary SDK module types.
import type { SDK, Player } from 'ysdk';


export class Ads {
    /**
     * Yandex Games Ads implementation
     * 
     * Features:
     * (1) show advertising on title screen
     * (2) integrate shop with yandex games shop impl
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


}
