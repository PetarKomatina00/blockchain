// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Campaign} from "../src/Campaign.sol"; 

contract CampaignTest is Test{
    Campaign private _campaign;

    uint256 private constant MINIMUM_CONTRIBUTION = 0.01 ether;

    address private manager = makeAddr("manager");
    address private donorOne = makeAddr("donorOne");
    address private donorTwo = makeAddr("donorTwo");
}