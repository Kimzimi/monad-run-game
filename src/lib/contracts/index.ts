import DinoRewardContractAddressInfo from './DinoRewardContract-address.json';
import DinoRewardContractArtifact from './DinoRewardContract.json';

const contractAddress = (DinoRewardContractAddressInfo && typeof DinoRewardContractAddressInfo.address === 'string')
    ? DinoRewardContractAddressInfo.address as `0x${string}`
    : "0x0000000000000000000000000000000000000000";

const contractAbi = (DinoRewardContractArtifact && Array.isArray(DinoRewardContractArtifact.abi))
    ? DinoRewardContractArtifact.abi
    : [];

if (contractAddress === "0x0000000000000000000000000000000000000000") {
    console.warn("src/lib/contracts/index.ts: DinoRewardContract Address could not be loaded correctly. Using fallback address.");
}
if (contractAbi.length === 0 && DinoRewardContractArtifact && DinoRewardContractArtifact.abi) {
    console.warn("src/lib/contracts/index.ts: DinoRewardContract ABI could not be loaded correctly or is empty.");
} else if (!DinoRewardContractArtifact || !DinoRewardContractArtifact.abi) {
    console.warn("src/lib/contracts/index.ts: DinoRewardContractArtifact or its ABI property is missing.");
}

export const DINO_REWARD_CONTRACT_ADDRESS = contractAddress;
export const DINO_REWARD_CONTRACT_ABI = contractAbi;

console.log("src/lib/contracts/index.ts: Attempting to load contract info.");
console.log("src/lib/contracts/index.ts: Loaded DINO_REWARD_CONTRACT_ADDRESS:", DINO_REWARD_CONTRACT_ADDRESS);

if (typeof DINO_REWARD_CONTRACT_ADDRESS === 'undefined' || typeof DINO_REWARD_CONTRACT_ABI === 'undefined') {
    console.error("src/lib/contracts/index.ts: CRITICAL ERROR: DINO_REWARD_CONTRACT_ADDRESS or DINO_REWARD_CONTRACT_ABI is undefined before export!");
}