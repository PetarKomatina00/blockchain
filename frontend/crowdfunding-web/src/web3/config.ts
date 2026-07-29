import {defineChain} from "viem";
import { createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";

const rpcUrl = "http://127.0.0.1:8545";
export const anvilChain = defineChain({
  id: 31337,
  name: "Anvil Local",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [rpcUrl],
    },
  },
});

export const wagmiConfig = createConfig({
  chains: [anvilChain],
  connectors: [injected()],
  transports: {
    [anvilChain.id]: http(rpcUrl),
  },
});