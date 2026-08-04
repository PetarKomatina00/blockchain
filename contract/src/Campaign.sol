// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {CampaignRequest} from "./models/CampaignTypes.sol";


contract Campaign{

    CampaignRequest[] public requests;
    address public manager;
    uint public minimumContribution;
    uint256 public fundingGoal;
    mapping(address => uint256) public donatorTotalContribution;
    mapping(address => bool) public donators;
    uint256 public donatorsCount;

    modifier restricted(){
        require(msg.sender == manager, "Only manager can perform this action");
        _;
    }
    constructor(uint minContribution, uint256 goal, address campaignManager){
        manager = campaignManager;
        minimumContribution = minContribution;
        fundingGoal = goal;
    }

    function contribute() public payable{
        require(msg.value >= minimumContribution, "Donation is below minimum");
        
        if(!donators[msg.sender]){
            donators[msg.sender] = true;
            donatorsCount++;
        }
        donatorTotalContribution[msg.sender] += msg.value;
    }
    function createRequest(string memory description, uint value, address recipient) public restricted(){
        require(bytes(description).length > 0, "Description is required");
        require(value > 0, "Value must be greater than zero");
        require(recipient != address(0), "Invalid recipient");
        requests.push();

        CampaignRequest storage newRequest = requests[requests.length - 1];
        newRequest.description = description;
        newRequest.value = value;
        newRequest.recipient = recipient;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
    }
    function approveRequest(uint index) public{
        require(donators[msg.sender], "Only donators can approve");
        require(!requests[index].approvedBy[msg.sender], "Request already approved");

        requests[index].approvedBy[msg.sender] = true;
        requests[index].approvalCount++;
    }
    function finalizeRequest(uint index) public{
        require(index < requests.length, "Request does not exist");

        CampaignRequest storage request = requests[index];
        require(!request.complete, "Request is already complete");
        require(request.approvalCount > donatorsCount / 2, "Not enought approvals");
        require(address(this).balance >= request.value, "Insufficient campaign balance");

        request.complete = true;

        (bool sucesses, ) = request.recipient.call{
            value: request.value
        }("");

        require(sucesses, "Transfer failed");

        //Potreban event
    }
}