import { DINO_REWARD_CONTRACT_ADDRESS, DINO_REWARD_CONTRACT_ABI } from '@/lib/contracts';

console.log('Contract Address loaded in frontend/src/index.ts:', DINO_REWARD_CONTRACT_ADDRESS);
console.log('Contract ABI loaded status in frontend/src/index.ts:', DINO_REWARD_CONTRACT_ABI && DINO_REWARD_CONTRACT_ABI.length > 0 ? "ABI Loaded" : "ABI not loaded or empty");

// หากไฟล์นี้มีโค้ดอื่นๆ ที่ใช้เริ่มต้นการทำงานของส่วน frontend
// หรือมีการ import CSS, เรียกใช้งาน React components หลัก ฯลฯ
// ให้คงโค้ดเหล่านั้นไว้ หรือเพิ่มเติมเข้ามาตามความจำเป็น

export {};