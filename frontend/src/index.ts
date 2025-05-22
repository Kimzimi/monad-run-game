import {
    DINO_REWARD_CONTRACT_ADDRESS as CentralContractAddress,
    DINO_REWARD_CONTRACT_ABI as CentralContractAbi
} from '@/lib/contracts';

export const DINO_REWARD_CONTRACT_ADDRESS = CentralContractAddress;
export const DINO_REWARD_CONTRACT_ABI = CentralContractAbi;

console.log("Contract data processed in frontend/src/index.ts (imported from @/lib/contracts)");
console.log("DinoRewardContract Address (via frontend/src/index.ts):", DINO_REWARD_CONTRACT_ADDRESS);

if (typeof DINO_REWARD_CONTRACT_ADDRESS === 'undefined' || !DINO_REWARD_CONTRACT_ABI || DINO_REWARD_CONTRACT_ABI.length === 0) {
    console.error("CRITICAL ERROR in frontend/src/index.ts: Imported Contract Address or ABI is undefined or empty!");
}