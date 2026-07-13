// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CampaignRequest} from "./models/CampaignTypes.sol";

contract Campaign{
    CampaignRequest public request;
    address public _manager;
    uint public _minimumContribution;
    mapping(address => bool) public isApprover;
    mapping(address => uint256) public approverContribution;
    address[] public approvers;

    constructor(uint minimumContribution){
        _manager = msg.sender;
        _minimumContribution = minimumContribution;
    }

    function contribute() public payable{
        require(msg.value >_minimumContribution, "Donation is below minimum");
        
        approverContribution[msg.sender] += msg.value;
        if(!isApprover[msg.sender]){
            isApprover[msg.sender] = true;
            approvers.push(msg.sender);
        }
    }
}