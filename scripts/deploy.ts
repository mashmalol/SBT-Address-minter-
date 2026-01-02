import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying contracts with tokenomics...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH\n");

  // 1. Deploy ADDR Token
  console.log("1️⃣ Deploying ADDR Token...");
  const ADDRToken = await ethers.getContractFactory("ADDRToken");
  const addrToken = await ADDRToken.deploy();
  await addrToken.waitForDeployment();
  const addrTokenAddress = await addrToken.getAddress();
  console.log("✅ ADDR Token deployed to:", addrTokenAddress);

  // 2. Deploy DeliveryAddressSBT
  console.log("\n2️⃣ Deploying DeliveryAddressSBT...");
  const DeliveryAddressSBT = await ethers.getContractFactory("DeliveryAddressSBT");
  const sbtContract = await DeliveryAddressSBT.deploy(addrTokenAddress);
  await sbtContract.waitForDeployment();
  const sbtAddress = await sbtContract.getAddress();
  console.log("✅ SBT Contract deployed to:", sbtAddress);

  // 3. Add SBT contract as minter
  console.log("\n3️⃣ Setting up minter permissions...");
  await addrToken.addMinter(sbtAddress);
  console.log("✅ SBT contract added as ADDR minter");

  // 4. Deploy LiquidityMining
  console.log("\n4️⃣ Deploying LiquidityMining contract...");
  const lpTokenPlaceholder = "0x0000000000000000000000000000000000000000";
  const LiquidityMining = await ethers.getContractFactory("LiquidityMining");
  const liquidityMining = await LiquidityMining.deploy(addrTokenAddress, lpTokenPlaceholder);
  await liquidityMining.waitForDeployment();
  const liquidityMiningAddress = await liquidityMining.getAddress();
  console.log("✅ LiquidityMining deployed to:", liquidityMiningAddress);

  // Add LiquidityMining as minter
  await addrToken.addMinter(liquidityMiningAddress);
  console.log("✅ LiquidityMining added as ADDR minter");

  console.log("\n📋 Summary:");
  console.log("=".repeat(60));
  console.log(`ADDR Token:         ${addrTokenAddress}`);
  console.log(`SBT Contract:       ${sbtAddress}`);
  console.log(`Liquidity Mining:   ${liquidityMiningAddress}`);
  console.log("=".repeat(60));

  console.log("\n💡 Features Implemented:");
  console.log("✅ Dynamic Pricing (4 tiers: Basic, Premium, Landmark, Exclusive)");
  console.log("✅ Deflationary Mechanism (Burn 10 ADDR to update metadata)");
  console.log("✅ Liquidity Mining (10k ADDR/week, 2x bonus for 30 days)");
  console.log("✅ Advertising Revenue (70% to owner, 30% to platform)");

  console.log("\n📝 Next Steps:");
  console.log("1. Update src/config/contract.config.ts with addresses above");
  console.log("2. Create Uniswap V2 ADDR/ETH liquidity pool");
  console.log("3. Update LP token address in LiquidityMining");
  
  const deploymentInfo = {
    network: (await ethers.provider.getNetwork()).name,
    addrToken: addrTokenAddress,
    sbtContract: sbtAddress,
    liquidityMining: liquidityMiningAddress,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
  };
  
  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
