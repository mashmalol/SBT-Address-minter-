// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title DeliveryAddressSBT
 * @dev Soulbound Token (SBT) for tokenizing delivery addresses
 * - Non-transferable (Soulbound)
 * - Lazy minting support
 * - $5 minting fee goes to contract owner
 * - Stores full address and GPS coordinates
 */
contract DeliveryAddressSBT is ERC721, Ownable, ReentrancyGuard {
    uint256 private _tokenIds;

    uint256 public constant MINT_FEE = 5 ether; // $5 equivalent in native token
    
    struct LocationMetadata {
        string street;
        string city;
        string state;
        string country;
        string postalCode;
        int256 latitude;  // Stored as lat * 1e6 for precision
        int256 longitude; // Stored as lng * 1e6 for precision
        uint256 mintedAt;
        string additionalInfo;
    }

    struct LazyMintVoucher {
        uint256 tokenId;
        address minter;
        LocationMetadata metadata;
        bytes signature;
    }

    mapping(uint256 => LocationMetadata) public tokenMetadata;
    mapping(uint256 => bool) public usedVouchers;
    mapping(address => uint256[]) public userTokens;

    event AddressMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string city,
        string country
    );
    
    event MetadataUpdated(uint256 indexed tokenId);

    constructor() ERC721("Delivery Address SBT", "DASBT") Ownable(msg.sender) {}

    /**
     * @dev Lazy Minting: Mint with off-chain signed voucher
     * Allows users to prepare minting data off-chain and only pay gas when ready
     */
    function lazyMint(LazyMintVoucher calldata voucher) 
        external 
        payable 
        nonReentrant 
    {
        require(msg.value >= MINT_FEE, "Insufficient minting fee");
        require(!usedVouchers[voucher.tokenId], "Voucher already used");
        require(voucher.minter == msg.sender, "Voucher not for caller");

        // Verify signature
        bytes32 digest = _hashVoucher(voucher);
        address signer = _recover(digest, voucher.signature);
        require(signer == owner(), "Invalid signature");

        usedVouchers[voucher.tokenId] = true;
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(msg.sender, newTokenId);
        
        LocationMetadata memory metadata = voucher.metadata;
        metadata.mintedAt = block.timestamp;
        tokenMetadata[newTokenId] = metadata;
        userTokens[msg.sender].push(newTokenId);

        // Send $5 to contract owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Payment to owner failed");

        emit AddressMinted(
            newTokenId,
            msg.sender,
            voucher.metadata.city,
            voucher.metadata.country
        );
    }

    /**
     * @dev Direct minting - Standard mint function
     * User pays mint fee which goes directly to owner
     */
    function mintAddress(LocationMetadata calldata metadata) 
        external 
        payable 
        nonReentrant 
        returns (uint256) 
    {
        require(msg.value >= MINT_FEE, "Insufficient minting fee");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        _safeMint(msg.sender, newTokenId);
        
        LocationMetadata memory newMetadata = metadata;
        newMetadata.mintedAt = block.timestamp;
        tokenMetadata[newTokenId] = newMetadata;
        userTokens[msg.sender].push(newTokenId);

        // Send $5 to contract owner
        (bool success, ) = owner().call{value: msg.value}("");
        require(success, "Payment to owner failed");

        emit AddressMinted(
            newTokenId,
            msg.sender,
            metadata.city,
            metadata.country
        );

        return newTokenId;
    }

    /**
     * @dev Update metadata (only token owner can update their own token)
     * Useful for correcting address details or updating delivery instructions
     */
    function updateMetadata(uint256 tokenId, LocationMetadata calldata metadata) 
        external 
    {
        require(ownerOf(tokenId) == msg.sender, "Not token owner");
        
        LocationMetadata memory updatedMetadata = metadata;
        updatedMetadata.mintedAt = tokenMetadata[tokenId].mintedAt; // Keep original mint time
        tokenMetadata[tokenId] = updatedMetadata;
        
        emit MetadataUpdated(tokenId);
    }

    /**
     * @dev Get all tokens owned by an address
     */
    function getTokensByOwner(address owner) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userTokens[owner];
    }

    /**
     * @dev Get token metadata
     */
    function getTokenMetadata(uint256 tokenId) 
        external 
        view 
        returns (LocationMetadata memory) 
    {
        require(_exists(tokenId), "Token does not exist");
        return tokenMetadata[tokenId];
    }

    /**
     * @dev Get total number of minted tokens
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }

    /**
     * @dev Soulbound: Override _update to prevent transfers
     * Only allow minting (from == address(0)) and burning (to == address(0))
     */
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        require(from == address(0) || to == address(0), "Soulbound: transfers disabled");
        return super._update(to, tokenId, auth);
    }

    // ==================== Lazy Minting Helper Functions ====================

    /**
     * @dev Create hash of voucher for signature verification
     */
    function _hashVoucher(LazyMintVoucher calldata voucher) 
        internal 
        view 
        returns (bytes32) 
    {
        return keccak256(abi.encodePacked(
            voucher.tokenId,
            voucher.minter,
            voucher.metadata.street,
            voucher.metadata.city,
            voucher.metadata.postalCode,
            address(this)
        ));
    }

    /**
     * @dev Recover signer from signature
     */
    function _recover(bytes32 digest, bytes memory signature) 
        internal 
        pure 
        returns (address) 
    {
        bytes32 ethSignedHash = keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n32", digest)
        );
        
        (bytes32 r, bytes32 s, uint8 v) = _splitSignature(signature);
        return ecrecover(ethSignedHash, v, r, s);
    }

    /**
     * @dev Split signature into r, s, v components
     */
    function _splitSignature(bytes memory sig)
        internal
        pure
        returns (bytes32 r, bytes32 s, uint8 v)
    {
        require(sig.length == 65, "Invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }

    /**
     * @dev Check if token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    /**
     * @dev Emergency withdraw (just in case funds get stuck)
     */
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Receive function to accept ETH
     */
    receive() external payable {}
}
