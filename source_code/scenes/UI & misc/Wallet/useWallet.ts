import { useEffect, useState } from "react";
import { apiGet } from "../../../singletons/Networking";
//import API from "./API.json";

// move api endpoints to a sub folder
import { fetchSudPrice } from "./vestigeAPI";


/* Types */

interface AssetPrice {
  asset_id: number;
  price: number;
  denominating_asset_id: number;
  network_id: number;
  total_lockup: number;
}

type PriceApiResponse = AssetPrice[];

export function useWallet() {
  const [suds, setSuds] = useState(0);
  const [sudsPrice, setSudsPrice] = useState("0");
  const [loading, setLoading] = useState(false);

  const coinAsaId = "2717482658";

  /* Fetch token price */

 async function fetchPrice() {
  try {
    setLoading(true);

    const result = await fetchSudPrice();

    if (result && result.length > 0) {
      setSudsPrice(result[0].price.toFixed(12));
    } else {
      console.warn("No Vestige price data returned");
    }

  } catch (err) {
    console.error("Vestige price fetch failed:", err);
  } finally {
    setLoading(false);
  }
}

  /* Example: sync from game globals */

  useEffect(() => {
    const sync = () => {
      if (window.globals?.suds != null) {
        setSuds(window.globals.suds);
      }

      requestAnimationFrame(sync);
    };

    sync();
  }, []);

  return {
    suds,
    sudsPrice,
    coinAsaId,
    loading,
    fetchPrice,
  };
}
