import { DINO_REWARD_CONTRACT_ADDRESS, DINO_REWARD_CONTRACT_ABI } from '@/lib/contracts';

console.log('frontend/src/index.ts: Contract Address loaded:', DINO_REWARD_CONTRACT_ADDRESS);
console.log('frontend/src/index.ts: Contract ABI loaded status:', DINO_REWARD_CONTRACT_ABI && DINO_REWARD_CONTRACT_ABI.length > 0 ? "ABI Loaded" : "ABI not loaded or empty");

if (typeof DINO_REWARD_CONTRACT_ADDRESS === 'undefined' || !DINO_REWARD_CONTRACT_ABI || DINO_REWARD_CONTRACT_ABI.length === 0) {
    console.error("CRITICAL ERROR in frontend/src/index.ts: Imported Contract Address or ABI is undefined or empty!");
}

// โค้ดอื่นๆ ที่จำเป็นสำหรับ frontend/src/index.ts (ถ้ามี)
// เช่น การ khởi tạo React, Vue, หรือ logic เริ่มต้นอื่นๆ

export {};