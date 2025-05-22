// src/lib/wagmiConfig.ts
import { http, createConfig } from 'wagmi';
import { defineChain } from 'viem';

const MONAD_TESTNET_CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_MONAD_TESTNET_CHAIN_ID || "10143");
const MONAD_TESTNET_RPC_URL = process.env.NEXT_PUBLIC_MONAD_TESTNET_RPC_URL || "https://testnet-rpc.monad.xyz";

export const monadTestnet = defineChain({
  id: MONAD_TESTNET_CHAIN_ID,
  name: 'Monad Testnet',
  nativeCurrency: { decimals: 18, name: 'MON', symbol: 'MON' },
  rpcUrls: {
    default: { http: [MONAD_TESTNET_RPC_URL] },
  },
  blockExplorers: {
    default: { name: 'Monad Testnet Explorer', url: 'https://testnet.monadexplorer.com' },
  },
  testnet: true,
});

export const wagmiConfig = createConfig({
  chains: [monadTestnet],
  transports: {
    [monadTestnet.id]: http(),
  },
});