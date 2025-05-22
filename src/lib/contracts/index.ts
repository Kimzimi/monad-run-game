// src/lib/contracts/index.ts

// พยายาม import ไฟล์ JSON โดยตรง
// ตรวจสอบให้แน่ใจว่าชื่อไฟล์เหล่านี้ถูกต้อง และไฟล์มีอยู่จริงในโฟลเดอร์เดียวกันกับไฟล์ index.ts นี้
import DinoRewardContractAddressInfo from './DinoRewardContract-address.json';
import DinoRewardContractArtifact from './DinoRewardContract.json';

// ตรวจสอบว่า object ที่ import มามี property ที่เราต้องการหรือไม่
// และป้องกัน error ถ้าไฟล์ JSON ไม่มีโครงสร้างตามที่คาดหวัง
const contractAddress = (DinoRewardContractAddressInfo && typeof DinoRewardContractAddressInfo.address === 'string')
    ? DinoRewardContractAddressInfo.address as `0x${string}`
    : "0x0000000000000000000000000000000000000000"; // Fallback address

const contractAbi = (DinoRewardContractArtifact && Array.isArray(DinoRewardContractArtifact.abi))
    ? DinoRewardContractArtifact.abi
    : []; // Fallback empty ABI

if (contractAddress === "0x0000000000000000000000000000000000000000") {
    console.warn("DinoRewardContract Address could not be loaded correctly from DinoRewardContract-address.json. Using fallback address.");
}
if (contractAbi.length === 0 && DinoRewardContractArtifact && DinoRewardContractArtifact.abi) {
    // This case means ABI was present but not an array, which is unlikely for valid artifacts.
    // More likely, DinoRewardContractArtifact itself or its .abi property was undefined/null.
    console.warn("DinoRewardContract ABI could not be loaded correctly from DinoRewardContract.json or is empty.");
} else if (!DinoRewardContractArtifact || !DinoRewardContractArtifact.abi) {
    console.warn("DinoRewardContractArtifact or its ABI property is missing from DinoRewardContract.json.");
}


export const DINO_REWARD_CONTRACT_ADDRESS = contractAddress;
export const DINO_REWARD_CONTRACT_ABI = contractAbi;

// Log เพื่อช่วย Debug ตอนที่ module นี้ถูก import ครั้งแรก
console.log("Attempting to load contract info from src/lib/contracts/index.ts");
console.log("Loaded DINO_REWARD_CONTRACT_ADDRESS:", DINO_REWARD_CONTRACT_ADDRESS);
// console.log("Loaded DINO_REWARD_CONTRACT_ABI (first 3 items):", DINO_REWARD_CONTRACT_ABI.slice(0, 3));

// ตรวจสอบว่ามีการ export จริงหรือไม่
if (typeof DINO_REWARD_CONTRACT_ADDRESS === 'undefined' || typeof DINO_REWARD_CONTRACT_ABI === 'undefined') {
    console.error("CRITICAL ERROR: DINO_REWARD_CONTRACT_ADDRESS or DINO_REWARD_CONTRACT_ABI is undefined before export in index.ts!");
}
