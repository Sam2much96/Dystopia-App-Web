import { apiGet } from "../../../singletons/Networking";
import API from "./API.json";

/* Types */

export interface AssetPrice {
  asset_id: number;
  price: number;
  denominating_asset_id: number;
  network_id: number;
  total_lockup: number;
}

/* Get Vestige config */

function getVestigeConfig() {
  return API.apis.find((api) => api.name === "Vestige");
}

/* Build URL */

function buildVestigePriceUrl() {
  const vestige = getVestigeConfig();

  if (!vestige) {
    throw new Error("Vestige API not found in API.json");
  }

  return vestige.base_url + vestige.endpoints.price;
}

/* Fetch price */

export async function fetchSudPrice(): Promise<AssetPrice[]> {
  const url = buildVestigePriceUrl();

  return apiGet<AssetPrice[]>(url);
}
