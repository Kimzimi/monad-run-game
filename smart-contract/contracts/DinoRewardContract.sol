// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DinoRewardContract {
    address public owner;
    uint256 public constant MIN_SCORE_FOR_REWARD = 100;
    uint256 public constant REWARD_AMOUNT = 0.1 ether; // 0.1 MON (ใช้ ether keyword สำหรับ 18 decimals)
    uint256 public constant CLAIM_COOLDOWN = 4 hours;

    mapping(uint256 => uint256) public lastClaimTimestampByFid; // Farcaster ID to last claim time

    event RewardClaimed(uint256 indexed fid, address indexed recipient, uint256 amount, uint256 timestamp);

    constructor() {
        owner = msg.sender;
    }

    function claimReward(uint256 _fid, uint256 _score) external {
        require(_score >= MIN_SCORE_FOR_REWARD, "DinoReward: Score not high enough.");
        uint256 lastClaim = lastClaimTimestampByFid[_fid];
        require(block.timestamp >= lastClaim + CLAIM_COOLDOWN, "DinoReward: Claim cooldown not yet over.");

        require(address(this).balance >= REWARD_AMOUNT, "DinoReward: Contract out of funds for rewards.");

        lastClaimTimestampByFid[_fid] = block.timestamp;

        (bool success, ) = msg.sender.call{value: REWARD_AMOUNT}("");
        require(success, "DinoReward: Failed to send MON reward.");

        emit RewardClaimed(_fid, msg.sender, REWARD_AMOUNT, block.timestamp);
    }

    function canUserClaim(uint256 _fid) external view returns (bool) {
        return block.timestamp >= lastClaimTimestampByFid[_fid] + CLAIM_COOLDOWN;
    }

    function deposit() external payable {
        // Anyone can deposit MON into this contract to fund rewards
        // Or restrict to owner: require(msg.sender == owner, "Only owner can deposit");
    }

    function withdrawFunds(uint256 _amount) external {
        require(msg.sender == owner, "DinoReward: Only owner can withdraw.");
        require(address(this).balance >= _amount, "DinoReward: Insufficient balance.");
        payable(owner).transfer(_amount);
    }

    // Allow contract to receive Ether/Native MON directly
    receive() external payable {}
    fallback() external payable {}
}