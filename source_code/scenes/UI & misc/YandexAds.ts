/**
 * Yandex ads
 * 
 * Yandex ads implementation in one script
 * 
 * Docs : https://yandex.ru/dev/games/doc/en/
 * 
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
      const sdk = await (window as any).YaGames.init();
      window.ysdk = sdk;
      this.initialized = true;
      console.log("✅ Yandex SDK initialized");
      sdk.features.LoadingAPI?.ready();
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
