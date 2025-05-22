import { DINO_REWARD_CONTRACT_ADDRESS, DINO_REWARD_CONTRACT_ABI } from '@/lib/contracts';

console.log('Contract Address loaded in frontend/src/index.ts:', DINO_REWARD_CONTRACT_ADDRESS);
console.log('Contract ABI loaded status in frontend/src/index.ts:', DINO_REWARD_CONTRACT_ABI && DINO_REWARD_CONTRACT_ABI.length > 0 ? "ABI Loaded" : "ABI not loaded or empty");

export {};