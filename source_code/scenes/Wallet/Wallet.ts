//import { PeraWalletConnect } from "@perawallet/connect"; //pera wallet connection for signing transactions
//import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils' // Algokit Utils


export class Wallet {
    /*
     * Implements all Wallet functionality in one class
     *
     * Docs:  https://docs.perawallet.app/references/pera-connect#methods
     * 
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
     */
    //public network: Map<string, number> = new Map([
    //    ["MainNet", 416001],
    //    ["TestNet", 416002],
    //    ["BetaNet", 416003],
    //    ["All Networks", 4160]
    //]) ;

    public peraWallet: any | null = null;
    public algorand: any | null = null;
    public algodClient: any | null = null;
    public indexerClient: any | null = null;
    public kmdClient: any | null = null;
    public accountAddress: string | null = null;
    public accountBalance : number | null = null;
    public accountInfo: any | null = null;
    public Connected: boolean;

    constructor(client: boolean) {
        //turning off algod client init for performance optimization
        //console.log("Testing Wallet Integration");

        // initialise wallet connect and save player address
        //this.peraWallet = new PeraWalletConnect({
        //    chainId: 4160, // All Net
        //    shouldShowSignTxnToast: true,
        //});

        if (client == true) {
            this.algorand = null//AlgorandClient.mainNet(); //connect to mainnet

            // get algod parameters
            this.algodClient = this.algorand.client.algod;
            this.indexerClient = this.algorand.client.indexer;
            //this.kmdClient = this.algorand.client.kmd;
        }
        //check if session is connected
        this.Connected = this.peraWallet.isConnected;

        console.log("Pera Connected Session: ", this.Connected);
        console.log("indexer client debug: ", this.indexerClient);
        //works
        /**
        const connectToPeraWallet = async () => {
            try {
                //const t = await this.peraWallet?.isConnected;
                //console.log(t);
                await this.peraWallet!.disconnect();

                const accounts = await this.peraWallet!.connect();
                this.peraWallet!.connector?.on('disconnect', this.handleDisconnectWallet);

                this.accountAddress = accounts[0];

                console.log("Account Address: ", this.accountAddress);

                // get account asset info
                const accountAssets = await this.indexerClient.lookupAccountAssets(this.accountAddress);

                console.log(accountAssets);


                // Use the accountAddress as needed
            } catch (error) {
                //if (error?.data?.type !== 'CONNECT_MODAL_CLOSED') {
                console.error('Error connecting to Pera Wallet:', error);
            }
        };


        connectToPeraWallet();
        */
    }

    async __connectToPeraWallet() { // works slow
        if (!this.Connected) {
            // separate async functions into proper forms and hook to ui properly
            // bug: 
            // (1) wallet connect doesn't work and is very buggy

            //disconnect wallet session error catcher
            // await this.peraWallet!.disconnect();

            try {

                if (this.peraWallet!.connector?.connected) {
                    await this.peraWallet!.disconnect();
                }


                //create new connected session
                const accounts = await this.peraWallet!.connect();

                //this.peraWallet!.connector?.on('disconnect', this.handleDisconnectWallet);

                this.accountAddress = accounts[0];
                this.Connected = true;

                console.log("Pera wallet Account Address: ", this.accountAddress);

                //fetch account info in parallel for reduced latency
                await Promise.all([
                    this.fetchAccountInfo(),
                    //this.fetchWalletAssets()
                ]);


                // Optional: listen for disconnect events
                this.peraWallet!.connector?.on('disconnect', this.handleDisconnectWallet);
     
                // Use the accountAddress as needed
            } catch (error) {
                console.error('Error connecting to Pera Wallet:', error);
            }
        }

    }

    // fetch the assets held my this address
    // doesn't produce useable information
    // can only get sud balance after successfully bonding
    async fetchWalletAssets() {
        // Fetch account Asset Info
        // Get account asset info
        const accountAssets = await this.indexerClient.lookupAccountAssets(this.accountAddress);

        console.log("Account Assets: ", accountAssets);
    }

    async fetchSudHoldings() {
        // probably using vestigefi api, check for the sud holdings of this particular address
        // idea 2: get the asa holdings of the connected wallet address
    }

    handleDisconnectWallet(error: Error | null, payload: any): void {
        this.peraWallet!.disconnect();
        throw new Error('Function not implemented.');
    }



    // use algokit sdk to construct transactions
    // sign a transaction
    async signTransaction() {

        //let txn = {}; //placeholder transaction
        //const signedTxn = await this.peraWallet!.signTransaction([[{ txn }]]);

        //const { txId } = await this.algodClient.sendRawTransaction(signedTxn).do();
        //console.log('Transaction sent with ID:', txId);
    }

    async fetchAccountInfo(accountAddress: string = this.accountAddress!) {
        try {
            const accountInfo = await this.indexerClient.lookupAccountByID(accountAddress).do();
            console.log("Account Info:", accountInfo);
        } catch (error) {
            console.error("Error fetching account info:", error);
        }
    }


    //make payment transaction
    /**
     const suggestedParams = await algodClient.getTransactionParams().do();
        const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from: senderAddress,
        to: receiverAddress,
        amount: algosdk.algosToMicroalgos(1), // 1 Algo
        suggestedParams,
        }); 

     */

    // make asset payment
    // sud asset id : 2717482658

}

