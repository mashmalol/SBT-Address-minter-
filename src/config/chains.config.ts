
import { mainnet, sepolia, polygon, polygonMumbai, base, arbitrum, optimism } from 'wagmi/chains';

export const SUPPORTED_CHAINS = {
  mainnet: {
    ...mainnet,
    iconUrl: '/chains/ethereum.svg',
    blockExplorer: 'https://etherscan.io',
  },
  sepolia: {
    ...sepolia,
    iconUrl: '/chains/ethereum.svg',
    blockExplorer: 'https://sepolia.etherscan.io',
  },
  polygon: {
    ...polygon,
    iconUrl: '/chains/polygon.svg',
    blockExplorer: 'https://polygonscan.com',
  },
  mumbai: {
    ...polygonMumbai,
    iconUrl: '/chains/polygon.svg',
    blockExplorer: 'https://mumbai.polygonscan.com',
  },
  base: {
    ...base,
    iconUrl: '/chains/base.svg',
    blockExplorer: 'https://basescan.org',
  },
  arbitrum: {
    ...arbitrum,
    iconUrl: '/chains/arbitrum.svg',
    blockExplorer: 'https://arbiscan.io',
  },
  optimism: {
    ...optimism,
    iconUrl: '/chains/optimism.svg',
    blockExplorer: 'https://optimistic.etherscan.io',
  },
} as const;

export const PRODUCTION_CHAINS = [
  SUPPORTED_CHAINS.mainnet,
  SUPPORTED_CHAINS.polygon,
  SUPPORTED_CHAINS.base,
  SUPPORTED_CHAINS.arbitrum,
  SUPPORTED_CHAINS.optimism,
] as const;

export const TESTNET_CHAINS = [
  SUPPORTED_CHAINS.sepolia,
  SUPPORTED_CHAINS.mumbai,
] as const;

export const ALL_CHAINS = [...PRODUCTION_CHAINS, ...TESTNET_CHAINS] as const;

export type SupportedChainId = keyof typeof SUPPORTED_CHAINS;

// Contract addresses per chain
export const CONTRACT_ADDRESSES: Record<SupportedChainId, {
  sbt: `0x${string}`;
  addrToken: `0x${string}`;
  liquidityMining: `0x${string}`;
}> = {
  mainnet: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
  sepolia: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
  polygon: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
  mumbai: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
  base: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
  arbitrum: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
  optimism: {
    sbt: '0x0000000000000000000000000000000000000000',
    addrToken: '0x0000000000000000000000000000000000000000',
    liquidityMining: '0x0000000000000000000000000000000000000000',
  },
};

export const RPC_URLS: Record<SupportedChainId, string> = {
  mainnet: 'https://eth-mainnet.g.alchemy.com/v2/demo',
  sepolia: 'https://eth-sepolia.g.alchemy.com/v2/demo',
  polygon: 'https://polygon-rpc.com',
  mumbai: 'https://rpc-mumbai.maticvigil.com',
  base: 'https://mainnet.base.org',
  arbitrum: 'https://arb1.arbitrum.io/rpc',
  optimism: 'https://mainnet.optimism.io',
};
