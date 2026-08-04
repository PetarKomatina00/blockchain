// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {CampaignFactory} from "../factory/CampaignFactory.sol";
import {Campaign} from "../Campaign.sol";

contract CampaignFactoryTest is Test {
    CampaignFactory private factory;

    address private creatorOne;
    address private creatorTwo;

    uint256 private constant MINIMUM_CONTRIBUTION = 0.001 ether;
    uint256 private constant FUNDING_GOAL = 0.003 ether;

    function setUp() public {
        creatorOne = makeAddr("creatorOne");
        creatorTwo = makeAddr("creatorTwo");

        factory = new CampaignFactory();
    }

    function test_FactoryStartsWithoutCampaigns() public view {
        assertEq(factory.getDeployedCampaigns().length,0);
    }
    function test_UserCanCreateCampaign() public {
        vm.prank(creatorOne);

        address campaignAddress = factory.createCampaign(MINIMUM_CONTRIBUTION, FUNDING_GOAL);

        assertNotEq(campaignAddress, address(0));
    }
    function test_CampaignCreatorBecomesManager() public {
        vm.prank(creatorOne);

        address campaignAddress = factory.createCampaign(MINIMUM_CONTRIBUTION, FUNDING_GOAL);

        Campaign createdCampaign = Campaign(campaignAddress);

        assertEq(createdCampaign.manager(),creatorOne);
    }
    function test_MinimumContributionIsPassedToCampaign() public
    {
        vm.prank(creatorOne);

        address campaignAddress =factory.createCampaign(MINIMUM_CONTRIBUTION, FUNDING_GOAL);

        Campaign createdCampaign = Campaign(campaignAddress);

        assertEq(createdCampaign.minimumContribution(),MINIMUM_CONTRIBUTION);
    }
    function test_FactoryStoresCreatedCampaignAddress()public
    {
        vm.prank(creatorOne);

        address campaignAddress = factory.createCampaign(MINIMUM_CONTRIBUTION, FUNDING_GOAL);

        assertEq(factory.deployedCampaigns(0),campaignAddress);

        assertEq(factory.getDeployedCampaigns().length,1);
    }
    function test_MultipleUsersCanCreateCampaigns() public {
        vm.prank(creatorOne);

        address firstCampaignAddress = factory.createCampaign(0.001 ether, FUNDING_GOAL);

        vm.prank(creatorTwo);

        address secondCampaignAddress = factory.createCampaign(0.01 ether, FUNDING_GOAL);

        assertNotEq(firstCampaignAddress,secondCampaignAddress);

        assertEq(factory.getDeployedCampaigns().length,2);

        assertEq(factory.deployedCampaigns(0),firstCampaignAddress);

        assertEq(factory.deployedCampaigns(1),secondCampaignAddress);
    }
    function test_CampaignsHaveDifferentManagers() public {
        vm.prank(creatorOne);

        address firstCampaignAddress = factory.createCampaign(0.001 ether, FUNDING_GOAL);

        vm.prank(creatorTwo);

        address secondCampaignAddress = factory.createCampaign(0.01 ether, FUNDING_GOAL);

        Campaign firstCampaign = Campaign(firstCampaignAddress);

        Campaign secondCampaign = Campaign(secondCampaignAddress);

        assertEq(firstCampaign.manager(),creatorOne);

        assertEq(secondCampaign.manager(),creatorTwo);
    }
    function test_CampaignsCanHaveDifferentMinimums()
    public
    {
        uint256 firstMinimum = 0.001 ether;
        uint256 secondMinimum = 0.05 ether;

        vm.prank(creatorOne);
        address firstCampaignAddress = factory.createCampaign(firstMinimum, FUNDING_GOAL);

        vm.prank(creatorTwo);
        address secondCampaignAddress = factory.createCampaign(secondMinimum, FUNDING_GOAL);

        Campaign firstCampaign = Campaign(firstCampaignAddress);

        Campaign secondCampaign = Campaign(secondCampaignAddress);

        assertEq(firstCampaign.minimumContribution(),firstMinimum);

        assertEq(secondCampaign.minimumContribution(),secondMinimum);
    }
    function test_DonorCanContributeToFactoryCreatedCampaign() public{
        vm.prank(creatorOne);

        address campaignAddress = factory.createCampaign(MINIMUM_CONTRIBUTION, FUNDING_GOAL);

        Campaign createdCampaign = Campaign(campaignAddress);

        address donor = makeAddr("donor");

        vm.deal(donor, 10 ether);

        uint256 donation = MINIMUM_CONTRIBUTION + 1 wei;

        vm.prank(donor);

        createdCampaign.contribute{
            value: donation
        }();

        assertTrue(createdCampaign.donators(donor));

        assertEq(createdCampaign.donatorTotalContribution(donor),donation);

        assertEq(address(createdCampaign).balance,donation);
    }


}