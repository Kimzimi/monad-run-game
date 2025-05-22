// frontend/src/lib/contracts/index.ts
import DinoRewardContractArtifact from './DinoRewardContract.json'; // ตรวจสอบชื่อไฟล์ให้ตรง
import DinoRewardContractAddressInfo from './DinoRewardContract-address.json'; // ตรวจสอบชื่อไฟล์ให้ตรง

export const DINO_REWARD_CONTRACT_ADDRESS = DinoRewardContractAddressInfo.address as `0x${string}`;
export const DINO_REWARD_CONTRACT_ABI = DinoRewardContractArtifact.abi;

console.log("DinoRewardContract Address Loaded:", DINO_REWARD_CONTRACT_ADDRESS);
// console.log("DinoRewardContract ABI Loaded:", DINO_REWARD_CONTRACT_ABI);