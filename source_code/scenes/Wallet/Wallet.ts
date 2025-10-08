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
     * (2) Create Wallet on game start & only trigger connect with button press (done)
     * (3) Implement Algod Client & Smart Contract Factory
     * (4) Get Total Assets Being held by this address using algod indexer
     * (5) Get Total Apps Created By this address
     * (6) Port Digital Marketplace smartcontract & finish mapping all frontend functions
     * (7) Map Wallet Stats to Inventory & Stats UI (1/2)
     * (8) Port Escrow Smart Contract to Algokit
     * (9) Test Tokenized Asset UI/UX for Bow Item (1/2)
     * (10) Test Save / Load game Mechanics using local state save, web cache
     * (11) Optimize pera wallet connect to serialize data to wallet class with objects accessible outside the class
     *      - Save Account Address
     * (12) Implement yandex payment api
     * (13) Implement game Monetize payment api and ads api
     * (14) Implement database for storing player wallet data and synchronizing with onchain data
     * (15) Connect with advertising singleton for ads / blockchain ads for gass fee payment
     * (16) Implement vestige token api (1/2)
     * (17) Implement Tinyman pool api
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
    admin_account: number, 
    balance: string , 
    ASA_id : string, 
    ASA_amount: number, 
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
    public Price : any | undefined;
    public statsUI: HTMLElement | null = null;
    public suds : number = 0;
    public sudsPrice : number = 0;

    constructor() {
        // Fetch Sud token price from vestige
        // works
        // to do: 
        // (1) call function once when showing wallet render in stats hud (1/2)
        // (2) serialise token price into stats wallet hud render (1/2)
        //this.fetchPrice();
        this.statsUI = document.querySelector('.v11_5');
    }



    renderWallet(): void {
        // to do:
        // (1) port wallet button from game hud to here using Connected and a trigger parameter (done)
        
        // Select the element
        //this.statsUI = document.querySelector('.v11_5');
        if (!this.statsUI) return console.warn("debug Inventory UI");

        this.statsUI.innerHTML = ""; // clear UI

        //const container = document.getElementById("inventory-items");
        //if (!container) return;
        // to do:
        // (1) data to serialise: 
        // a) admin wallet api stats
        // b) local sud
        // c) database sud
        // d) sud current prices
        this.statsUI.innerHTML = `
            <div class="wallet-tab">
                <p>Wallet address: ${"window.wallet.accountAddress"}</p>
                <p>Token balance: ${"window.wallet.accountBalance"}</p>
                <!-- Add more wallet details here -->
            </div>
        `;
    }




    // use algokit sdk to construct transactions
    // sign a transaction
    async sendAPITransaction() {
        const url = "https://dystopia-app.site/api/admin";
        console.log("pinging admin wallet for mainnet testing");
        return apiGet<WalletAPI>(url);
    }

    async walletConnect(){

    }
    fetchAdmin(){
        (async () => {

        })();
    }

    fetchPrice(){
        (async () => {
            try {
                console.log("fetching asset price >>>>");
                const result = await getAssetPrice();
                //console.log("Result:", result); //works
                
                const priceString = result[0].price;
                this.Price = priceString.toFixed(12);
                
                console.log("sud price: ", this.Price);
                // e.g. access result.data[0].price
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

