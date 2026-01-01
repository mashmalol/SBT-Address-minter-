# Delivery Address SBT Minter

A Web3 application for minting **Soulbound Tokens (SBT)** representing delivery addresses. Built with React, Vite, Hardhat, and Solidity.

## 🌟 Features

- **🗺️ Interactive Map Selection** - Click on a map to select delivery location
- **📍 Automatic Address Detection** - Reverse geocoding from GPS coordinates
- **🔒 Soulbound Tokens** - Non-transferable NFTs for permanent address records
- **⚡ Lazy Minting** - Off-chain voucher signing for gas optimization
- **💰 Owner Revenue** - Contract owner receives $5 per mint
- **🌐 Multi-chain Support** - Deploy on Sepolia, Polygon, or local network

## 📦 Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Wagmi v2
- RainbowKit
- React Leaflet (OpenStreetMap)
- Lucide Icons

### Blockchain
- Solidity 0.8.20
- Hardhat
- OpenZeppelin Contracts
- Ethers.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env` and add:
- `PRIVATE_KEY` - Your wallet private key for deployment
- `VITE_WALLETCONNECT_PROJECT_ID` - Get from [WalletConnect Cloud](https://cloud.walletconnect.com)
- `SEPOLIA_RPC_URL` - Sepolia RPC endpoint (optional)

### Development

1. **Start local blockchain**
```bash
npm run node
```

2. **Deploy contract (in new terminal)**
```bash
npm run deploy:local
```

3. **Update contract address**

Copy the deployed contract address and update `src/config/contract.config.ts`:
```typescript
export const CONTRACT_ADDRESS = '0xYourContractAddress';
```

4. **Start development server**
```bash
npm run dev
```

Open http://localhost:5173

## 📝 Smart Contract

The `DeliveryAddressSBT` contract includes:

- ✅ ERC-721 compliant Soulbound Token
- ✅ Non-transferable (except minting/burning)
- ✅ Lazy minting with signature verification
- ✅ Metadata storage (address + GPS coordinates)
- ✅ Owner receives 5 tokens per mint
- ✅ Metadata update by token owner

### Contract Structure

```solidity
struct LocationMetadata {
    string street;
    string city;
    string state;
    string country;
    string postalCode;
    int256 latitude;   // stored as lat * 1e6
    int256 longitude;  // stored as lng * 1e6
    uint256 mintedAt;
    string additionalInfo;
}
```

## 🧪 Testing

```bash
npm run test
```

## 🌐 Deployment

### Deploy to Sepolia Testnet

1. **Get Sepolia ETH** from [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Deploy**
```bash
npm run deploy
```

3. **Update frontend config** with deployed address

### Deploy to Polygon

```bash
npm run deploy -- --network polygon
```

## 💡 Usage

### Minting an Address SBT

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Select Location** - Click on the map to choose delivery location
3. **Enter Details** - Fill in or edit address information
4. **Mint Token** - Pay 5 tokens and mint your SBT

### Metadata Updates

Token owners can update their address metadata by calling `updateMetadata()` function directly on the contract.

## 🔐 Security Features

- **Reentrancy Protection** - ReentrancyGuard on all payable functions
- **Soulbound Enforcement** - Transfers permanently disabled
- **Owner Controls** - Only owner can sign lazy mint vouchers
- **Signature Verification** - ECDSA signature validation

## 📄 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

## 📞 Support

For issues or questions, open a GitHub issue.

---

Built with ❤️ using Web3 technologies
