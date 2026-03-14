// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract AuditLog is Ownable {
    struct LogEntry {
        uint256 timestamp;
        string action;
        string detailsHash;
    }

    mapping(string => LogEntry[]) public threadLogs;

    event LogAppended(string indexed threadId, string action, string detailsHash);

    constructor() Ownable(msg.sender) {}

    function appendLog(string memory _threadId, string memory _action, string memory _detailsHash) external onlyOwner {
        threadLogs[_threadId].push(LogEntry({
            timestamp: block.timestamp,
            action: _action,
            detailsHash: _detailsHash
        }));
        
        emit LogAppended(_threadId, _action, _detailsHash);
    }

    function getLogsCount(string memory _threadId) external view returns (uint256) {
        return threadLogs[_threadId].length;
    }
}
