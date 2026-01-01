# 🚀 Quick Start Guide

## Step-by-Step Setup

### 1. Install Dependencies ✅
Already completed!

### 2. Setup Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example file
cp .env.example .env
```

Then edit `.env` and add:
- **PRIVATE_KEY**: Your wallet private key (for deployment)
- **VITE_WALLETCONNECT_PROJECT_ID**: Get free from https://cloud.walletconnect.com

### 3. Start Local Blockchain

In one terminal:
```bash
npm run node
```

This starts a local Hardhat network at http://127.0.0.1:8545

### 4. Deploy Smart Contract

In a **new terminal** (keep the first one running):
```bash
npm run deploy:local
```

You'll see output like:
```
✅ Contract deployed successfully!
📍 Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

### 5. Update Frontend Config

Copy the contract address from step 4 and update `src/config/contract.config.ts`:

```typescript
export const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Your address
```

### 6. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser!

### 7. Connect MetaMask to Local Network

1. Open MetaMask
2. Add Network:
   - Network Name: Localhost 8545
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency: ETH

3. Import a test account from Hardhat (check terminal from step 3 for private keys)

## 🎯 How to Use the App

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Select Location** - Click anywhere on the map
3. **Enter Address Details** - Fill in or edit the auto-detected address
4. **Mint SBT** - Pay 5 ETH (test tokens) and mint!

## 📝 Key Features

✅ **Soulbound Tokens** - Cannot be transferred  
✅ **Lazy Minting** - Signature-based vouchers  
✅ **Owner Revenue** - $5 per mint goes to contract owner  
✅ **GPS Coordinates** - Stored with address metadata  
✅ **Interactive Map** - OpenStreetMap integration  

## 🌐 Deploy to Testnet (Sepolia)

1. Get Sepolia ETH from https://sepoliafaucet.com
2. Add your private key to `.env`
3. Run: `npm run deploy`
4. Update contract address in config

## 🐛 Troubleshooting

**"User rejected transaction"** - Normal, just retry  
**"Insufficient funds"** - Make sure you have test ETH  
**Map not loading** - Check internet connection  
**Contract not found** - Verify contract address in config  

## 📚 Project Structure

```
src/
├── components/        # React components
│   ├── MapSelector.tsx
│   ├── AddressForm.tsx
│   ├── NFTMinter.tsx
│   └── MetadataPreview.tsx
├── config/           # Contract ABI and address
├── services/         # Map and lazy minting services
├── types/            # TypeScript interfaces
└── App.tsx           # Main app

contracts/
└── DeliveryAddressSBT.sol  # Smart contract

scripts/
└── deploy.ts         # Deployment script
```

## 🎨 Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Web3**: Wagmi v2 + RainbowKit + Viem
- **Maps**: React Leaflet + OpenStreetMap
- **Blockchain**: Hardhat + Solidity 0.8.20
- **Smart Contracts**: OpenZeppelin

---

Happy Minting! 🎉
