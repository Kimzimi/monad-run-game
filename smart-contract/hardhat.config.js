// smart-contract/hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // เพื่อให้ Hardhat อ่านค่าจาก .env

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20", // <<! ตรวจสอบให้ตรงกับ pragma ใน .sol ของคุณ (เช่น 0.8.9 หรือ 0.8.20)
  networks: {
    hardhat: {
      // การตั้งค่าสำหรับ local Hardhat network (ถ้าใช้)
    },
    monadTestnet: {
      url: process.env.MONAD_TESTNET_RPC_URL || "",
      accounts: process.env.DEPLOYER_PRIVATE_KEY ? [process.env.DEPLOYER_PRIVATE_KEY] : [],
      chainId: parseInt(process.env.MONAD_TESTNET_CHAIN_ID || "0"), // แปลงเป็นตัวเลข
    },
  },
}