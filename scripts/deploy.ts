import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying Delivery Address SBT Contract...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  const DeliveryAddressSBT = await ethers.getContractFactory("DeliveryAddressSBT");
  const contract = await DeliveryAddressSBT.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  console.log("✅ Contract deployed successfully!\n");
  console.log("📍 Contract Address:", address);
  console.log("💰 Mint Fee: 5 tokens (equivalent to $5 USD)");
  console.log("🔒 Soulbound: Transfers are disabled");
  console.log("👤 Owner:", deployer.address);
  
  console.log("\n📝 Next Steps:");
  console.log("1. Copy the contract address above");
  console.log("2. Update src/config/contract.config.ts with:");
  console.log(`   export const CONTRACT_ADDRESS = '${address}';`);
  console.log("\n3. Verify the contract (optional):");
  console.log(`   npx hardhat verify --network <network> ${address}`);
  
  // Save deployment info
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    mintFee: "5 tokens",
  };
  
  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
