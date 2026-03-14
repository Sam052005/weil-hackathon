// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Reputation is Ownable {
    struct SupplierData {
        uint256 totalTransacts;
        uint256 disputes;
        uint256 lastScore;
    }
    
    mapping(address => SupplierData) public suppliers;
    
    event ScoreUpdated(address indexed supplier, uint256 newScore);
    
    constructor() Ownable(msg.sender) {}

    function recordTransaction(address _supplier, bool _disputed) external onlyOwner {
        SupplierData storage data = suppliers[_supplier];
        data.totalTransacts += 1;
        if (_disputed) {
            data.disputes += 1;
        }
        
        // Simple trust score out of 100
        uint256 score = 100;
        if (data.totalTransacts > 0) {
            uint256 disputeRatio = (data.disputes * 100) / data.totalTransacts;
            score = 100 - disputeRatio;
        }
        
        data.lastScore = score;
        emit ScoreUpdated(_supplier, score);
    }
    
    function getScore(address _supplier) external view returns (uint256) {
        return suppliers[_supplier].lastScore;
    }
}
