// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface IADDRToken {
    function burn(address account, uint256 amount) external;
    function mint(address account, uint256 amount) external;
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title DeliveryAddressSBT
 * @dev Soulbound Token with Dynamic Pricing, Deflationary Mechanics & Ad Revenue
 */
contract DeliveryAddressSBT is ERC721, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId = 1;

    enum LocationTier { BASIC, PREMIUM, LANDMARK, EXCLUSIVE }
    
    struct LocationMetadata {
        string street;
        string city;
        string state;
        string country;
        string postalCode;
        int256 latitude;
        int256 longitude;
        uint256 mintedAt;
        string additionalInfo;
        uint8 tier;
        uint256 elevation;
        uint256 populationDensity;
    }

    struct Advertisement {
        string content;
        string businessName;
        string imageUrl;
        uint256 expiresAt;
        address advertiser;
    }

    mapping(uint256 => LocationMetadata) public tokenMetadata;
    mapping(address => uint256[]) public userTokens;
    mapping(uint256 => Advertisement) public tokenAdvertisements;
    mapping(address => uint256) public ownerAdRevenue;
    
    uint256 public totalPlatformRevenue;
    uint256 public totalAdvertisingRevenue;
    
    IADDRToken public addrToken;
    
    mapping(uint8 => uint256) public tierPrices;
    uint256 public constant AD_FEE = 0.001 ether;
    uint256 public constant UPDATE_BURN_AMOUNT = 10 ether;
    uint256 public constant MINT_REWARD = 100 ether;
    
    event AddressMinted(uint256 indexed tokenId, address indexed owner, string city, string country, uint8 tier);
    event MetadataUpdated(uint256 indexed tokenId);
    event AdvertisementPlaced(uint256 indexed tokenId, address advertiser, uint256 amount);
    event AdRevenueWithdrawn(address indexed owner, uint256 amount);

    constructor(address _addrToken) ERC721("Delivery Address SBT", "DASBT") Ownable(msg.sender) {
        addrToken = IADDRToken(_addrToken);
        
        tierPrices[uint8(LocationTier.BASIC)] = 0.005 ether;
        tierPrices[uint8(LocationTier.PREMIUM)] = 0.01 ether;
        tierPrices[uint8(LocationTier.LANDMARK)] = 0.05 ether;
        tierPrices[uint8(LocationTier.EXCLUSIVE)] = 0.1 ether;
    }

    function _determineTier(LocationMetadata memory metadata) internal pure returns (uint8) {
        if (metadata.elevation > 5000) {
            return uint8(LocationTier.EXCLUSIVE);
        }
        
        bytes32 cityHash = keccak256(bytes(metadata.city));
        if (cityHash == keccak256(bytes("Paris")) ||
            cityHash == keccak256(bytes("New York")) ||
            cityHash == keccak256(bytes("Tokyo")) ||
            cityHash == keccak256(bytes("London")) ||
            metadata.elevation > 3000) {
            return uint8(LocationTier.LANDMARK);
        }
        
        if (metadata.populationDensity > 10000) {
            return uint8(LocationTier.PREMIUM);
        }
        
        return uint8(LocationTier.BASIC);
    }

    function mintAddress(LocationMetadata memory metadata) external payable nonReentrant returns (uint256) {
        uint8 tier = _determineTier(metadata);
        uint256 price = tierPrices[tier];
        
        require(msg.value >= price, "Insufficient minting fee");
        
        metadata.tier = tier;
        metadata.mintedAt = block.timestamp;
        
        uint256 newTokenId = _nextTokenId++;
        
        _safeMint(msg.sender, newTokenId);
        
        tokenMetadata[newTokenId] = metadata;
        userTokens[msg.sender].push(newTokenId);

        totalPlatformRevenue += msg.value;
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Payment to owner failed");

        addrToken.mint(msg.sender, MINT_REWARD);

        emit AddressMinted(newTokenId, msg.sender, metadata.city, metadata.country, tier);

        return newTokenId;
    }

    function updateMetadata(uint256 tokenId, LocationMetadata memory metadata) external {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        require(addrToken.balanceOf(msg.sender) >= UPDATE_BURN_AMOUNT, "Insufficient ADDR tokens");
        
        addrToken.burn(msg.sender, UPDATE_BURN_AMOUNT);
        
        metadata.tier = tokenMetadata[tokenId].tier;
        metadata.mintedAt = tokenMetadata[tokenId].mintedAt;
        
        tokenMetadata[tokenId] = metadata;
        emit MetadataUpdated(tokenId);
    }

    function placeAdvertisement(
        uint256 tokenId, 
        string memory content,
        string memory businessName,
        string memory imageUrl,
        uint256 durationDays
    ) external payable nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(msg.value >= AD_FEE, "Insufficient ad fee");
        require(durationDays > 0 && durationDays <= 365, "Invalid duration");
        
        address tokenOwner = ownerOf(tokenId);
        
        uint256 ownerShare = (msg.value * 70) / 100;
        uint256 platformShare = msg.value - ownerShare;
        
        ownerAdRevenue[tokenOwner] += ownerShare;
        totalAdvertisingRevenue += msg.value;
        totalPlatformRevenue += platformShare;
        
        tokenAdvertisements[tokenId] = Advertisement({
            content: content,
            businessName: businessName,
            imageUrl: imageUrl,
            expiresAt: block.timestamp + (durationDays * 1 days),
            advertiser: msg.sender
        });
        
        (bool success, ) = owner().call{value: platformShare}("");
        require(success, "Platform payment failed");
        
        emit AdvertisementPlaced(tokenId, msg.sender, msg.value);
    }

    function withdrawAdRevenue() external nonReentrant {
        uint256 amount = ownerAdRevenue[msg.sender];
        require(amount > 0, "No revenue to withdraw");
        
        ownerAdRevenue[msg.sender] = 0;
        
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");
        
        emit AdRevenueWithdrawn(msg.sender, amount);
    }

    function getAdvertisement(uint256 tokenId) external view returns (Advertisement memory) {
        Advertisement memory ad = tokenAdvertisements[tokenId];
        
        if (ad.expiresAt < block.timestamp) {
            return Advertisement("", "", "", 0, address(0));
        }
        
        return ad;
    }

    function getTokensByOwner(address owner) external view returns (uint256[] memory) {
        return userTokens[owner];
    }

    function getTokenMetadata(uint256 tokenId) external view returns (LocationMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenMetadata[tokenId];
    }

    function updateTierPrice(uint8 tier, uint256 newPrice) external onlyOwner {
        tierPrices[tier] = newPrice;
    }

    function setADDRToken(address _addrToken) external onlyOwner {
        addrToken = IADDRToken(_addrToken);
    }

    function totalSupply() external view returns (uint256) {
        return _nextTokenId - 1;
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Soulbound: transfers disabled");
        return super._update(to, tokenId, auth);
    }

    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    receive() external payable {}
}
