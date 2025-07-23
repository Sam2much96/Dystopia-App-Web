// facebook-sdk.ts

type FBGameContextType = 'POST' | 'THREAD' | 'GROUP' | 'SOLO';

interface FBPlayer {
    getID(): string;
    getName(): string;
    getPhoto(): string;
    getDataAsync(keys: string[]): Promise<Record<string, any>>;
    setDataAsync(data: Record<string, any>): Promise<void>;
}

interface FBContext {
    getID(): string;
    getType(): FBGameContextType;
}

interface FBAdInstance {
    loadAsync(): Promise<void>;
    showAsync(): Promise<void>;
}

interface FBLeaderboard {
    setScoreAsync(score: number, extraData?: string): Promise<void>;
    getEntriesAsync(count: number, offset?: number): Promise<FBLeaderboardEntry[]>;
    getPlayerEntryAsync(): Promise<FBLeaderboardEntry | null>;
}

interface FBLeaderboardEntry {
    getRank(): number;
    getScore(): number;
    getExtraData(): string | null;
    getPlayer(): FBPlayer;
}

interface FBProduct {
    title: string;
    productID: string;
    description: string;
    price: string;
}

interface FBPayment {
    purchaseAsync(options: {
        productID: string;
        developerPayload?: string;
    }): Promise<any>;

    getCatalogAsync(): Promise<FBProduct[]>;
}

interface FBInstantAPI {
    initializeAsync(): Promise<void>;
    startGameAsync(): Promise<void>;
    getPlatform(): string;
    getLocale(): string;
    getSDKVersion(): string;
    player: FBPlayer;
    context: FBContext;
    logEvent(eventName: string, valueToSum?: number, parameters?: Record<string, any>): void;
    setLoadingProgress(progress: number): void;
    getSupportedAPIs(): string[];
    getEntryPointData(): any;
    shareAsync(payload: {
        intent: string;
        image: string;
        text: string;
        data?: Record<string, any>;
    }): Promise<void>;

    // Ads
    getInterstitialAdAsync(placementID: string): Promise<FBAdInstance>;
    getRewardedVideoAsync(placementID: string): Promise<FBAdInstance>;

    // Leaderboards
    getLeaderboardAsync(name: string): Promise<FBLeaderboard>;

    // Payments
    payments: FBPayment;
}

// Fallback mock for local development
const mockFBInstant: FBInstantAPI = {
    initializeAsync: async () => {
        console.warn('FBInstant mock: initializeAsync');
    },
    startGameAsync: async () => {
        console.warn('FBInstant mock: startGameAsync');
    },
    getPlatform: () => 'WEB',
    getLocale: () => 'en_US',
    getSDKVersion: () => 'mock',
    player: {
        getID: () => 'mock-player-id',
        getName: () => 'Mock Player',
        getPhoto: () => 'https://placehold.co/100x100',
        getDataAsync: async () => ({}),
        setDataAsync: async () => {},
    },
    context: {
        getID: () => 'mock-context-id',
        getType: () => 'SOLO',
    },
    logEvent: (eventName, valueToSum, parameters) => {
        console.log(`FBInstant mock: logEvent "${eventName}"`, { valueToSum, parameters });
    },
    setLoadingProgress: (progress: number) => {
        console.log(`FBInstant mock: setLoadingProgress to ${progress}%`);
    },
    getSupportedAPIs: () => [
        'initializeAsync',
        'startGameAsync',
        'getInterstitialAdAsync',
        'getRewardedVideoAsync',
        'getLeaderboardAsync',
        'purchaseAsync',
    ],
    getEntryPointData: () => ({}),
    shareAsync: async (payload) => {
        console.log('FBInstant mock: shareAsync', payload);
    },

    getInterstitialAdAsync: async (placementID: string) => {
        console.log(`FBInstant mock: getInterstitialAdAsync(${placementID})`);
        return {
            loadAsync: async () => console.log('Mock interstitial ad loaded'),
            showAsync: async () => console.log('Mock interstitial ad shown'),
        };
    },

    getRewardedVideoAsync: async (placementID: string) => {
        console.log(`FBInstant mock: getRewardedVideoAsync(${placementID})`);
        return {
            loadAsync: async () => console.log('Mock rewarded video ad loaded'),
            showAsync: async () => console.log('Mock rewarded video ad shown'),
        };
    },

    getLeaderboardAsync: async (name: string) => {
        console.log(`FBInstant mock: getLeaderboardAsync(${name})`);
        return {
            setScoreAsync: async () => console.log('Mock leaderboard score set'),
            getEntriesAsync: async () => [],
            getPlayerEntryAsync: async () => null,
        };
    },

    payments: {
        purchaseAsync: async (options) => {
            console.log('Mock purchaseAsync', options);
            return {};
        },
        getCatalogAsync: async () => [],
    },
};

// Export safe FBInstant wrapper
export const FB: FBInstantAPI = typeof window !== 'undefined' && typeof (window as any).FBInstant !== 'undefined'
    ? (window as any).FBInstant
    : mockFBInstant;
