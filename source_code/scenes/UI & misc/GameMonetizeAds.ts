/**
 * Game Monetize
 * 
 * Game Monetize Ads implementation in a single script 
 */

// Version 1.0 Implementation places the code in the index.html
// old & depreciated
//<!-- Game Monetize ads SDK + Ads testing -->
//<script src="https://html5.api.gamemonetize.com/sdk.js"></script>
//<script type="text/javascript">
//   window.SDK_OPTIONS = {
//      gameId: "2s3jqh4cymu086cf9m1kmmm9cm52hdj2",
//      onEvent: function (a) {
//         switch (a.name) {
//            case "SDK_GAME_PAUSE":
//               // pause game logic / mute audio
//               break;
//            case "SDK_GAME_START":
               // advertisement done, resume game logic and unmute audio
//               break;
//            case "SDK_READY":
               // when sdk is ready
               //console.log("game is ready");
//               console.log("Banners Ads Testing>>>>>>");
//               sdk.showBanner();
//               break;
//         }
//      }
//   };
//(function (a, b, c) {
//   var d = a.getElementsByTagName(b)[0];
//   a.getElementById(c) || (a = a.createElement(b), a.id = c, a.src = "https://api.gamemonetize.com/sdk.js", d.parentNode.insertBefore(a, d))
//})(document, "script", "gamemonetize-sdk"); 
//</script>

    // Ads testing
    // requires activation on game monetize to implement ads
    //show game monetize ads testing
   // if (typeof sdk  && sdk.showBanner ) {
   //   console.log("Showing Test Banners >>>>>>");
   //   sdk.showBanner();
 // }

  // Example for rewarded video ad:
  //if (typeof sdk !== "undefined" && sdk.showRewarded !== undefined) {
  //    sdk.showRewarded(function(success) {
  //        if (success) {
  //            console.log("Reward granted!");
              // give coins / items here
  //        } else {
  //            console.log("Reward not completed.");
  //        }
  //    });
  //}


// Version 2.0
// GameMonetizeAds.ts

// Tell TS about the global sdk variable from the external script
declare global {
  interface Window {
    SDK_OPTIONS: any;
    sdk: any;
  }
}

export class GameMonetizeAds {
  private gameId: string;

  constructor() {
    this.gameId = "2s3jqh4cymu086cf9m1kmmm9cm52hdj2";
    this.init();
  }

  private init() {
    // Configure SDK options
    window.SDK_OPTIONS = {
      gameId: this.gameId,
      onEvent: (event: any) => this.handleEvent(event),
    };

    // Dynamically load GameMonetize SDK
    this.loadScript("https://api.gamemonetize.com/sdk.js", "gamemonetize-sdk");
  }

  private loadScript(src: string, id: string) {
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    document.head.appendChild(script);
  }

  private handleEvent(event: any) {
    switch (event.name) {
      case "SDK_GAME_PAUSE":
        console.log("Game paused for ad");
        // pause game logic / mute audio here
        break;
      case "SDK_GAME_START":
        console.log("Game resumed after ad");
        // resume game logic / unmute audio here
        break;
      case "SDK_READY":
        console.log("GameMonetize SDK ready ✅");
        this.showBanner();
        break;
    }
  }

  // === API methods ===
  public showBanner() {
    if (window.sdk?.showBanner) {
      window.sdk.showBanner({
        width: "full",
        height: 90,
        position: "bottom",
      });
    }
  }

  public showFullscreenAd() {
    if (window.sdk?.showFullScreenAd) {
      window.sdk.showFullScreenAd();
    }
  }

  public showRewarded(callback: (success: boolean) => void) {
    if (window.sdk?.showRewarded) {
      window.sdk.showRewarded(callback);
    }
  }
}
