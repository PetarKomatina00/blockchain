// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "forge-std/Script.sol";
import {CampaignFactory} from "../src/factory/CampaignFactory.sol";

contract DeployCampaignFactory is Script {
    function run() external returns (CampaignFactory factory) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        factory = new CampaignFactory();

        vm.stopBroadcast();
    }
}