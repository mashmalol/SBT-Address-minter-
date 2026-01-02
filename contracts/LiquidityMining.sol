// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title LiquidityMining
 * @dev Stake LP tokens to earn ADDR rewards
 * Features:
 * - 10,000 ADDR per week distributed to stakers
 * - 2x bonus multiplier for first 30 days
 * - Proportional rewards based on stake
 */
contract LiquidityMining is Ownable, ReentrancyGuard {
    IERC20 public addrToken;
    IERC20 public lpToken;
    
    uint256 public constant WEEKLY_REWARDS = 10_000 ether;
    uint256 public constant EARLY_BONUS_MULTIPLIER = 2;
    uint256 public deploymentTime;
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 rewardDebt;
    }
    
    mapping(address => StakeInfo) public stakes;
    uint256 public totalStaked;
    uint256 public accRewardPerShare;
    uint256 public lastRewardTime;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);

    constructor(address _addrToken, address _lpToken) Ownable(msg.sender) {
        addrToken = IERC20(_addrToken);
        lpToken = IERC20(_lpToken);
        deploymentTime = block.timestamp;
        lastRewardTime = block.timestamp;
    }

    function stake(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot stake 0");
        
        updatePool();
        
        StakeInfo storage userStake = stakes[msg.sender];
        
        if (userStake.amount > 0) {
            uint256 pending = (userStake.amount * accRewardPerShare) / 1e12 - userStake.rewardDebt;
            if (pending > 0) {
                addrToken.transfer(msg.sender, pending);
                emit RewardsClaimed(msg.sender, pending);
            }
        }
        
        lpToken.transferFrom(msg.sender, address(this), amount);
        
        userStake.amount += amount;
        userStake.startTime = block.timestamp;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e12;
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount);
    }

    function unstake(uint256 amount) external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        require(userStake.amount >= amount, "Insufficient staked");
        
        updatePool();
        
        uint256 pending = (userStake.amount * accRewardPerShare) / 1e12 - userStake.rewardDebt;
        if (pending > 0) {
            addrToken.transfer(msg.sender, pending);
            emit RewardsClaimed(msg.sender, pending);
        }
        
        userStake.amount -= amount;
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e12;
        
        totalStaked -= amount;
        
        lpToken.transfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }

    function claimRewards() external nonReentrant {
        updatePool();
        
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 pending = (userStake.amount * accRewardPerShare) / 1e12 - userStake.rewardDebt;
        
        require(pending > 0, "No rewards");
        
        userStake.rewardDebt = (userStake.amount * accRewardPerShare) / 1e12;
        
        addrToken.transfer(msg.sender, pending);
        
        emit RewardsClaimed(msg.sender, pending);
    }

    function updatePool() public {
        if (block.timestamp <= lastRewardTime || totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }
        
        uint256 timeElapsed = block.timestamp - lastRewardTime;
        uint256 reward = (WEEKLY_REWARDS * timeElapsed) / 7 days;
        
        // Early bonus (first 30 days get 2x rewards)
        if (block.timestamp < deploymentTime + 30 days) {
            reward *= EARLY_BONUS_MULTIPLIER;
        }
        
        accRewardPerShare += (reward * 1e12) / totalStaked;
        lastRewardTime = block.timestamp;
    }

    function pendingRewards(address user) external view returns (uint256) {
        StakeInfo memory userStake = stakes[user];
        
        uint256 _accRewardPerShare = accRewardPerShare;
        
        if (block.timestamp > lastRewardTime && totalStaked > 0) {
            uint256 timeElapsed = block.timestamp - lastRewardTime;
            uint256 reward = (WEEKLY_REWARDS * timeElapsed) / 7 days;
            
            if (block.timestamp < deploymentTime + 30 days) {
                reward *= EARLY_BONUS_MULTIPLIER;
            }
            
            _accRewardPerShare += (reward * 1e12) / totalStaked;
        }
        
        return (userStake.amount * _accRewardPerShare) / 1e12 - userStake.rewardDebt;
    }

    function emergencyWithdraw() external nonReentrant {
        StakeInfo storage userStake = stakes[msg.sender];
        uint256 amount = userStake.amount;
        
        userStake.amount = 0;
        userStake.rewardDebt = 0;
        totalStaked -= amount;
        
        lpToken.transfer(msg.sender, amount);
        
        emit Unstaked(msg.sender, amount);
    }
}
