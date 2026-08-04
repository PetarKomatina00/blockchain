import type { Abi } from "viem";
import campaignArtifact from "./Campaign.json";

export const campaignAbi = campaignArtifact.abi as Abi;