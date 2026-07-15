// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Campaign} from "../Campaign.sol";

contract CampaignFactory{
    address[] public deployedCampaigns;

    function createCampaign(uint minContribution) public returns(address){
        require(minContribution > 0, "Minimum contribution must be greater than zero");
        Campaign newCampaign = new Campaign(minContribution, msg.sender);
        deployedCampaigns.push(address(newCampaign));

        return address(newCampaign);
    }

    function getDeployedCampaigns() public view returns (address[] memory){
        return deployedCampaigns;
    }
}