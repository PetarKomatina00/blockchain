import { isAddress, type Address } from "viem";

import campaignFactoryAbiJson from "./CampaignFactory.json"

const factoryAddress =
  import.meta.env.VITE_CAMPAIGN_FACTORY_ADDRESS;

if (!factoryAddress || !isAddress(factoryAddress)) {
  throw new Error(
    "Factory address is not valid.",
  );
}
export const campaignFactoryAddress =
  factoryAddress as Address;

export const campaignFactoryAbi = campaignFactoryAbiJson;