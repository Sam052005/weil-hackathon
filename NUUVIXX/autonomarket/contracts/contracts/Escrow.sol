// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Escrow is Ownable {
    IERC20 public wusdToken;
    
    enum EscrowStatus { PENDING, FUNDED, COMPLETED, DISPUTED, REFUNDED }
    
    struct Transaction {
        address buyer;
        address seller;
        uint256 amount;
        EscrowStatus status;
    }
    
    mapping(uint256 => Transaction) public transactions;
    uint256 public nextTxId;
    
    event EscrowFunded(uint256 indexed txId, address indexed buyer, uint256 amount);
    event EscrowCompleted(uint256 indexed txId, address indexed seller, uint256 amount);
    event EscrowDisputed(uint256 indexed txId);
    
    constructor(address _wusdToken) Ownable(msg.sender) {
        wusdToken = IERC20(_wusdToken);
    }
    
    function createTransaction(address _seller, uint256 _amount) external returns (uint256) {
        uint256 txId = nextTxId++;
        transactions[txId] = Transaction({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            status: EscrowStatus.PENDING
        });
        return txId;
    }
    
    function fundEscrow(uint256 _txId) external {
        Transaction storage txn = transactions[_txId];
        require(txn.status == EscrowStatus.PENDING, "Not pending");
        require(msg.sender == txn.buyer, "Only buyer");
        
        require(wusdToken.transferFrom(msg.sender, address(this), txn.amount), "Transfer failed");
        txn.status = EscrowStatus.FUNDED;
        
        emit EscrowFunded(_txId, msg.sender, txn.amount);
    }
    
    function releaseFunds(uint256 _txId) external {
        Transaction storage txn = transactions[_txId];
        require(txn.status == EscrowStatus.FUNDED, "Not funded");
        require(msg.sender == txn.buyer || msg.sender == owner(), "Not authorized");
        
        txn.status = EscrowStatus.COMPLETED;
        require(wusdToken.transfer(txn.seller, txn.amount), "Transfer failed");
        
        emit EscrowCompleted(_txId, txn.seller, txn.amount);
    }
    
    function dispute(uint256 _txId) external {
        Transaction storage txn = transactions[_txId];
        require(txn.status == EscrowStatus.FUNDED, "Not funded");
        require(msg.sender == txn.buyer || msg.sender == txn.seller, "Not involved");
        
        txn.status = EscrowStatus.DISPUTED;
        emit EscrowDisputed(_txId);
    }
    
    function resolveDispute(uint256 _txId, bool _refundBuyer) external onlyOwner {
        Transaction storage txn = transactions[_txId];
        require(txn.status == EscrowStatus.DISPUTED, "Not disputed");
        
        if (_refundBuyer) {
            txn.status = EscrowStatus.REFUNDED;
            require(wusdToken.transfer(txn.buyer, txn.amount), "Transfer failed");
        } else {
            txn.status = EscrowStatus.COMPLETED;
            require(wusdToken.transfer(txn.seller, txn.amount), "Transfer failed");
        }
    }
}
