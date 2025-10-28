
/**
 * Android Singleton
 * 
 * Unused singleton class
 * 
 * Features:
 * (1) All optimizations for mobile browser in a single class
 * 
 * to do:
 * (1) implement overworld level optimizations for mobiles
 */

class Android {

    public _is_android : boolean = false;

    // Lifetime OPtimizations for CPU Particle FX
    public Long_lifetime : number = 6;
    public Short_lifetime : number = 3
    public MINUMUM_FPS : number = 25;


    // pointers to touch interface and gamehud objects
    // needed for UI calling on mobile browsers
    // to do : ui class should store pointers to each of these elements
    public TouchInterface = null; 
    public GameHUD_ = null; 
    public ingameMenu = null;
    
    // screen orientation storage
    public local_screen_orientation : number = 0;

    //private _simulation = window.simulation; //simulation singleton pointer

    private _globals = window.global;

    constructor(){

    // check & save if browser type is mobile
    if (window.utils.platform == "Mobile"){

        this._is_android = true;

        this.ads();

    }

    }


    //unimplemented function to run browser ads optimised for mobiles
    ads(){}
    ads_video(){}
    _no_ads(){}


    //external class function to check if platform is mobile browser
    is_android() : boolean {
        return this._is_android;
    }

    // handle rain simulation fx for shorter lifetimes on mobile in update() function

    /**
     * Screen Orientation & Scaling Algorithm
     * 
     */
    //kkkkkkk

}
