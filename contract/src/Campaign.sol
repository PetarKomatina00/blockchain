// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CampaignRequest} from "./models/CampaignTypes.sol";


contract Campaign{

    CampaignRequest[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => uint256) public approverContribution;
    mapping(address => bool) public donators;

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    constructor(uint minContribution, address campaignManager){
        manager = campaignManager;
        minimumContribution = minContribution;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution, "Donation is below minimum");
        
        approverContribution[msg.sender] += msg.value;
        donators[msg.sender] = true;
    }
    function createRequest(string memory description, uint value, address recipient) public restricted(){
        requests.push();

        CampaignRequest storage newRequest = requests[requests.length - 1];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }
    function approveRequest(uint index) public{
        require(donators[msg.sender]);
        require(!requests[index].approvedBy[msg.sender]);

        requests[index].approvedBy[msg.sender] = true;
        requests[index].approvalCount++;
    }

}