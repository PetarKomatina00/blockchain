// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Campaign} from "../Campaign.sol";

contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public{
        Campaign newCampaign = new Campaign(minContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));
    }

    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaigns;
    }
}