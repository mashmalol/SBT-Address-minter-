// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title ADDRToken
 * @dev Utility token for the Address SBT ecosystem
 * Features:
 * - Minted as rewards for SBT minting
 * - Burned for metadata updates (deflationary)
 * - Used for governance and platform utilities
 */
contract ADDRToken is ERC20, Ownable {
    mapping(address => bool) public minters;
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 ether; // 1 billion tokens
    
    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);
    event TokensBurned(address indexed from, uint256 amount);

    constructor() ERC20("Address Token", "ADDR") Ownable(msg.sender) {
        // Mint initial supply to owner (40% for community rewards)
        _mint(msg.sender, 400_000_000 ether);
    }

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }

    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    function mint(address account, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Max supply exceeded");
        _mint(account, amount);
    }

    function burn(address account, uint256 amount) external onlyMinter {
        _burn(account, amount);
        emit TokensBurned(account, amount);
    }

    // Allow users to burn their own tokens
    function burnOwn(uint256 amount) external {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }
}
