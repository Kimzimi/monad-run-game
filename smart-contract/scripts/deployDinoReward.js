async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying DinoRewardContract with the account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance (wei):", balance.toString());

  const ContractFactory = await ethers.getContractFactory("DinoRewardContract");
  console.log("Deploying DinoRewardContract...");
  const contractInstance = await ContractFactory.deploy();

  console.log("Waiting for contract deployment to be mined...");
  await contractInstance.waitForDeployment();
  
  const deployedAddress = await contractInstance.getAddress();

  console.log("Contract instance target (address):", contractInstance.target);
  console.log("Contract instance getAddress():", deployedAddress);

  if (deployedAddress) {
    console.log("DinoRewardContract deployed to address:", deployedAddress);
    const contractToSave = {
        address: deployedAddress,
    };
    // ส่ง contractInstance ทั้งหมดไปให้ saveFrontendFiles เพื่อให้มันอ่าน Artifact ได้จาก context ที่ถูกต้อง
    saveFrontendFiles(contractInstance, "DinoRewardContract", deployedAddress);
  } else {
    console.error("ERROR: Contract address is undefined after deployment wait.");
    if (contractInstance.deploymentTransaction) {
        const tx = contractInstance.deploymentTransaction();
        if (tx) {
            console.error("Deployment Transaction Hash:", tx.hash);
            console.error("Try checking this transaction hash on the Monad Testnet Explorer.");
        } else {
            console.error("Deployment transaction object is also undefined.");
        }
    } else {
        console.error("contractInstance.deploymentTransaction is not available.");
    }
    process.exit(1);
  }
}

function saveFrontendFiles(contractInstance, contractName, deployedAddress) {
  const fs = require("fs");
  const path = require("path");

  // ตรวจสอบโครงสร้างโปรเจกต์ของคุณ:
  // ถ้า root ของ Next.js project คือ "monad-dino-run"
  // และ script นี้อยู่ที่ "monad-dino-run/smart-contract/scripts/"
  // Path ไปยัง "monad-dino-run/src/lib/contracts/" ควรจะเป็น:
  const frontendContractsDir = path.resolve(__dirname, "../../src/lib/contracts");
  // __dirname คือ .../smart-contract/scripts/
  // ../../ คือ .../monad-dino-run/

  console.log(`Attempting to save files to: ${frontendContractsDir}`);

  if (!fs.existsSync(frontendContractsDir)) {
    try {
      fs.mkdirSync(frontendContractsDir, { recursive: true });
      console.log(`Created directory: ${frontendContractsDir}`);
    } catch (e) {
      console.error(`Error creating directory ${frontendContractsDir}:`, e);
      return; 
    }
  }

  try {
    // บันทึก Contract Address
    const addressFilePath = path.join(frontendContractsDir, `${contractName}-address.json`);
    fs.writeFileSync(
      addressFilePath,
      JSON.stringify({ address: deployedAddress }, undefined, 2)
    );
    console.log(`Saved ${contractName} address to ${addressFilePath}`);

    // บันทึก Artifact ทั้งหมด (ซึ่งมี ABI อยู่ข้างใน)
    // "artifacts" เป็น global object ที่ Hardhat สร้างขึ้นเมื่อรัน script
    // และสามารถเข้าถึง Artifact ที่ compile แล้วได้
    const ContractArtifact = artifacts.readArtifactSync(contractName);
    const artifactFilePath = path.join(frontendContractsDir, `${contractName}.json`);
    fs.writeFileSync(
      artifactFilePath,
      JSON.stringify(ContractArtifact, null, 2)
    );
    console.log(`Saved ${contractName} artifact (ABI) to ${artifactFilePath}`);
  } catch (e) {
    console.error(`Error saving frontend files for ${contractName}:`, e)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error in main:", error);
    process.exit(1);
  });
