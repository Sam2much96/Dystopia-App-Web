    /*
     * Implements all Wallet functionality in one class
     *
     * Docs:  https://docs.perawallet.app/references/pera-connect#methods
     * Docs 2: https://api.vestigelabs.org/docs#/Assets/get_asset_prices_assets_price_get
     * Features:
     * (1) Wallet Connect Pera
     * 
     * To Do:
     * (1) Implement Wallet Connect Defly
     * (2) Create Wallet on game start & only trigger connect with button press (depreciated)
     * (3) Implement Algod Client & Smart Contract Factory (1/2)
     * (4) Get Total Assets Being held by this address using algod indexer (done with admin wallet hot wallet impl)
     * (5) Get Total Apps Created By this address (not needed)
     * (6) Port Digital Marketplace smartcontract & finish mapping all frontend functions (0/5)
     * (7) Map Wallet Stats to Inventory & Stats UI (2/2)
     * (8) Port Escrow Smart Contract to Algokit (0/5)
     * (9) Test Tokenized Asset UI/UX for Bow Item (0/2)
     * (10) Test Save / Load game Mechanics using local state save, web cache (1/3)
     * (11) Optimize pera wallet connect to serialize data to wallet class with objects accessible outside the class
     *      - Save Account Address
     * (12) Implement yandex payment api (1/2)
     * (13) Implement game Monetize payment api and ads api (done, duplicate)
     * (14) Implement database for storing player wallet data and synchronizing with onchain data (1/5)
     * (15) Connect with advertising singleton for ads / blockchain ads for gass fee payment (1/2)
     * (16) Implement vestige token api (1/2)
     * (17) Implement Tinyman pool api
     * 
     * Bugs:
     * (1) Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://dystopia-app.site/api/admin. (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 200.
            Failed to fetch admin wallet data TypeError: NetworkError when attempting to fetch resource.
     */



//import { PeraWalletConnect } from "@perawallet/connect"; //pera wallet connection for signing transactions
//import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils' // Algokit Utils

import {apiGet} from "../../singletons/Networking"; // Generic Get Request class abstract


// Vestige Asset Price API data structure 
interface AssetPrice {
  asset_id: number;           
  price: number;
  denominating_asset_id: number;
  network_id: number;
  total_lockup: number;
}

//admin api price structure
interface WalletAPI {
    admin_account: string, 
    balance: string , 
    ASA_id : string, 
    ASA_amount: string, 
}

// Generic API Price response with error handling
type PriceApiResponse = AssetPrice[];
type WalletAPIResponse = WalletAPI[];

export class Wallet {
    //public network: Map<string, number> = new Map([
    //    ["MainNet", 416001],
    //    ["TestNet", 416002],
    //    ["BetaNet", 416003],
    //    ["All Networks", 4160]
    //]) ;
    //public Price : string | undefined;
    public statsUI: HTMLElement | null = null;
    public suds : number = 0;
    public sudsPrice : string = "0";

    //admin hot wallet data serialised
    // to do:
    // (1) fetch admin data from api
    // (2) improve regional api performance
    public adminWalletAddress : string = "EBRLA42MWQPHHX3J5WF22ODGEDO6ZUG4DLP3FBOPBPQIMP55EFWGR55EZA";
    public adminWalletbalance : string = "2200000000000000";
    public coin_asa_id : string = "2717482658";

    // to do:
    // (1) fetch price data from the vestige to draw price line chart
    // (2) implement traslations
    // (3) fix coin price calculatoin logic
    // (4) implement Merchant UI that extends wallet api

    // ui translations
    private walletdiag? : string;
    private coinsdiag? : string;
    private Pricediag? : string;
    private IDdiag? : string;
     
    constructor() {
        // Fetch Sud token price from vestige
        // works
        // to do: 
        // (1) call function once when showing wallet render in stats hud (1/2)
        // (2) serialise token price into stats wallet hud render (1/2)
        //this.fetchPrice();
        this.statsUI = document.querySelector('.v11_5');

        //get the API data
        //this.fetchPrice();
        //this.fetchAdmin(); // buggy

        // to do:
        // (1) serialise api admin and price data into wallet ui
    


    }



    renderWallet(): void {
        // to do:
        // (1) port wallet button from game hud to here using Connected and a trigger parameter (done)
        
        // Select the element
        //this.statsUI = document.querySelector('.v11_5');
        if (!this.statsUI) return console.warn("debug Inventory UI");

        this.statsUI.innerHTML = ""; // clear UI

            // translate the ui
        this.walletdiag = window.dialogs.t('wallet');
        this.coinsdiag = window.dialogs.t('coins');
        this.Pricediag = window.dialogs.t('price');
        this.IDdiag = window.dialogs.t('ID');

        // to do:
        // (1) data to serialise: 
        // a) admin wallet api stats
        // b) local sud
        // c) database sud
        // d) sud current prices
        // e) fix price logic to use integers instead of strings
        // 
        // (2) ui translations (done)

        //fadfafa
        this.statsUI.innerHTML = `
            <div class="wallet-tab">
                <p>${this.walletdiag}: ${this.adminWalletAddress}</p>
                <p>${this.coinsdiag}: ${this.suds} Suds</p>
                <p>${this.Pricediag} : ${this.sudsPrice}</p>
                <p>${this.IDdiag}: ${this.coin_asa_id}</p>
                <!-- Add more wallet details below here -->
            </div>
        `;
    }





    async walletConnect(){

    }
    fetchAdmin(){
        (async () => {
            try{
                // fetch admin wallet data from the chain
                const result = await sendAPITransaction();
                console.log("Result:", result);
                //this.adminWalletAddress = result["admin_ account"]
                }
            catch (err){
                console.error("Failed to fetch admin wallet data", err);

                }


        })();
    }

    fetchPrice(){
        (async () => {
            try {
                //console.log("fetching asset price >>>>");
                const result = await getAssetPrice();
                //console.log("Result:", result); //works
                
                const priceString = result[0].price;
                this.sudsPrice = priceString.toFixed(12);
                
                //console.log("sud price: ", this.Price);
                // e.g. access result.data[0].price
                return this.sudsPrice;
            } catch (err) {
                console.error("Failed to fetch asset price:", err);
            }
        })();
    }
    // make asset payment
    // sud asset id : 2717482658

}

// Fetch Sud Token Asset Price from vestige
async function getAssetPrice(): Promise<PriceApiResponse> {
  const url = "https://api.vestigelabs.org/assets/price?asset_ids=2717482658&network_id=0&denominating_asset_id=0";
  return apiGet<PriceApiResponse>(url);
}

    // sendiing an api ping response to the site's hot wallet
    // use algokit sdk to construct transactions
    // sign a transaction
async function sendAPITransaction() : Promise<WalletAPIResponse> {
        const url = "https://dystopia-app.site/api/admin";
        //console.log("pinging admin wallet for mainnet testing");
        return apiGet<WalletAPIResponse>(url);
    }
