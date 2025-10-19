/**
 * Yandex ads
 * 
 * Yandex ads implementation in one script
 * 
 * Docs : https://yandex.ru/dev/games/doc/en/
 * Docs 2:  https://yandex.com/dev/games/doc/en/sdk/sdk-game-events#gameready.
 * 
 * To do:
 * (1) Test on yandex platform
 * (2) Implement full yandex platform api's
 * (3) implement yandex typescript sdk functionality into this class
 * (4) implement ie8N yandex automatic language detection
 * (5) render highquality videos of 30 seconds with each supported language for the game's promotional videos
 */


// Version 1.0 Implementation
// depreciated

//<!-- Yandex Games SDK --> 
//<script>
    // temporarily disabled for itch io maintenance build
    // Load the Yandex Games SDK dynamically
    ///*
//    const sdkScript = document.createElement('script');
//    sdkScript.src = '/sdk.js';
//    sdkScript.async = true;

//    sdkScript.onload = () => {
//      if (typeof YaGames !== 'undefined') {
//        YaGames.init().then(sdk => {
//          console.log('Yandex SDK initialized');
//          window.ysdk = sdk;


                  // yandex games logic
        // documentation : https://yandex.com/dev/games/doc/en/sdk/sdk-game-events#gameready.
        
            // to do:
            // (1) implement yandex ads properly with a global singleton class that handles error
            // (2) improper yandex ads implementation might be what crashes iphone browsers
        

          // Informing the platform that the game has loaded and is ready to play.
//          sdk.features.LoadingAPI?.ready()

          // works:
          // (1) port initialisation logic to typescript with proper error handling / debugging
          // (2) implement ads into gameplay via shop 
          // (3) implement rewarded ads ligic

          // ad call 
//          sdk.adv.showFullscreenAdv({
//            callbacks: {
//              onOpen: () => console.log('Ad opened'),
//              onClose: wasShown => console.log('Ad closed:', wasShown),
//              onError: err => console.error('Ad error:', err)
//            }
//          });

//        }).catch(err => {
//          console.warn('YaGames.init() failed:', err);
//        });
//      } else {
//        console.warn('YaGames is not defined after script loaded');
//      }
//    };

//    sdkScript.onerror = () => {
//      console.warn('⚠️ Yandex SDK failed to load: sdk.js not found or blocked.');
//    };

//    document.head.appendChild(sdkScript);

    //*/
//</script>
//
// Version 2.0 Implementation

// YandexAds.ts

// Declare the global YaGames from the SDK
declare global {
  interface Window {
    ysdk: any;
  }

 // const YaGames: {
 //   init: () => Promise<any>;
 // };
}
// yandex typescript sdk
// to do:
// (1) implement all ysdk functionality and expose it in this class

import type { SDK, Player } from 'ysdk';

export class YandexAds {
  private static instance: YandexAds;
  private initialized = false;

  private constructor() {
    if (this.isYandexPlatform()) {
      this.loadScript("/sdk.js", "yandex-sdk")
        .then(() => this.initSDK())
        .catch(err => console.error("⚠️ Failed to load Yandex SDK:", err));
    } else {
      console.warn("⏩ Skipping Yandex SDK init (not running on Yandex)");
    }
  }

  public static getInstance(): YandexAds {
    if (!YandexAds.instance) {
      YandexAds.instance = new YandexAds();
    }
    return YandexAds.instance;
  }

  private isYandexPlatform(): boolean {
    return typeof window !== "undefined" &&
           window.location.hostname.includes("yandex");
  }

  private async loadScript(src: string, id: string): Promise<void> {
    if (document.getElementById(id)) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = id;
      script.src = src;
      script.async = true;

      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Yandex SDK"));

      document.head.appendChild(script);
    });
  }

  private async initSDK(): Promise<void> {
    try {
      // initialises yandex sdk
      const sdk = await (window as any).YaGames.init();
      window.ysdk = sdk;
      this.initialized = true;
      console.log("✅ Yandex SDK initialized");
      sdk.features.LoadingAPI?.ready(); // call the ready api

      //automatically detect the user language
      const env = sdk.environment();
      const detectedLang = env?.i18n?.lang || "en";
      console.log(`🌐 Yandex SDK initialized | Language detected: ${detectedLang}`);

      // save the language detected to the dialog singleton
      // supported languages include : ["en", "ru", "tr", "es", "fr"]
      // to do:
      // (1) implement regex for converting these into the localisation files (done)
      window.dialogs.language = window.dialogs.normalizeLocale(detectedLang);

      
    } catch (err) {
      console.error("❌ Yandex SDK init failed:", err);
    }
  }

  // Example ad call
  public async showFullscreenAd(): Promise<void> {
    if (!this.initialized || !window.ysdk) {
      console.warn("⚠️ Yandex SDK not initialized (local mode?)");
      return;
    }
    await window.ysdk.adv.showFullscreenAdv();
  }


}
