/**
 * Google Analytics
 * 
 * All Google Analytics logic in a single class
 * 
 * Features:
 * (1) Tags player counts
 * (2) Tags events e.g. ga.sendEvent("level_start", { level: 1 }) or ga.sendEvent("purchase", { item: "Health Potion", price: 50 });
 * 
 * Bugs:
 * (1) does not work in production (fixed)
 */

// old version 1.0
//depreciated
//
//  <!-- Google tag (gtag.js) for google analytics on my private hosting --> 
//  <script async src="https://www.googletagmanager.com/gtag/js?id=G-4XTFM74YY1"></script> 
//  <script>
//        window.dataLayer = window.dataLayer || [];
//        function gtag() { dataLayer.push(arguments); }
//        gtag('js', new Date());
//        gtag('config', 'G-4XTFM74YY1');    
//  </script>



declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export class GoogleAnalytics {
  private static instance: GoogleAnalytics;
  private initialized = false;
  private trackingId: string;

  private constructor(trackingId = "G-4XTFM74YY1") {
    this.trackingId = trackingId; // Fixed: use the parameter
    
    if (this.isProduction()) {
      this.loadScript(`https://www.googletagmanager.com/gtag/js?id=${trackingId}`) // Fixed: added opening (
        .then(() => this.init())
        .catch(err => console.error("⚠️ Failed to load Google Analytics:", err));
    } else {
      console.warn("⏩ Skipping Google Analytics init (not production)");
    }
  }

  public static getInstance(trackingId = "G-4XTFM74YY1"): GoogleAnalytics {
    if (!GoogleAnalytics.instance) {
      GoogleAnalytics.instance = new GoogleAnalytics(trackingId);
    }
    return GoogleAnalytics.instance;
  }

  private isProduction(): boolean {
    // Only enable GA on real hosting, not localhost or dev builds
    return typeof window !== "undefined" &&
      !window.location.hostname.includes("localhost") &&
      !window.location.hostname.includes("127.0.0.1");
  }

  private async loadScript(src: string): Promise<void> {
    if (document.getElementById("google-analytics")) return;

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.id = "google-analytics";
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load GA script"));
      document.head.appendChild(script);
    });
  }

  private init(): void {
    window.dataLayer = window.dataLayer || [];
    
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments); // Fixed: use 'arguments' object, not 'args'
    }
    
    (window as any).gtag = gtag;
    gtag("js", new Date());
    gtag("config", this.trackingId);
    
    this.initialized = true;
    console.log("✅ Google Analytics initialized with ID:", this.trackingId);
  }

  // === Public API ===
  public sendEvent(action: string, params: Record<string, any> = {}): void {
    if (!this.initialized) {
      console.warn("⚠️ Google Analytics not initialized (local mode?)");
      return;
    }
    (window as any).gtag("event", action, params);
  }
}