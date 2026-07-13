// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {Campaign} from "../Campaign.sol";
import {CampaignRequest} from "../models/CampaignTypes.sol";


contract CampaignTest is Test{
    Campaign private campaign;
    address private manager;
    address private donorOne;
    address private donorTwo;
    address private nonDonor;
    address private recipient;

    uint256 private constant MINIMUM_CONTRIBUTION = 0.001 ether;
    uint256 private constant VALID_CONTRIBUTION = MINIMUM_CONTRIBUTION + 1 wei;
    string private constant DUMMY_DESCRIPTION = "Concreting the surface";
    
    //Sets initial state
    //Forge calls setUp before every test. 
    function setUp() public{

        //Sets up default addresses
        manager = makeAddr("manager");
        donorOne = makeAddr("donorOne");
        donorTwo = makeAddr("donorTwo");
        nonDonor = makeAddr("nonDonor");
        recipient = makeAddr("recipient");

        campaign = new Campaign(MINIMUM_CONTRIBUTION, manager);

        //Sets balance to specific user
        vm.deal(donorOne, 10 ether); 
        vm.deal(donorTwo, 10 ether);
        vm.deal(nonDonor, 10 ether);
    }
    function test_ConstructorSetsManager() public view{
        assertEq(campaign.manager(), manager);
    }
    function test_ConstructorSetsMinimumContribution() public view{
        assertEq(campaign.minimumContribution(), MINIMUM_CONTRIBUTION);
    }
    function test_ContributionBelowMinimumReverts() public{
        uint256 invalidContribution = MINIMUM_CONTRIBUTION - 1 wei;


        //Next call must fail
        vm.expectRevert("Donation is below minimum");
        //Sets msg.sender == donorOne
        vm.prank(donorOne);
        campaign.contribute{
            value : invalidContribution
        }();
    }
    function test_ValidContributionSucceedes() public{
        vm.prank(donorOne);
        campaign.contribute{
            value: VALID_CONTRIBUTION
        }();

        assertTrue(campaign.donators(donorOne));

        assertEq(campaign.donatorTotalContribution(donorOne), VALID_CONTRIBUTION);

        assertEq(address(campaign).balance, VALID_CONTRIBUTION);
    
    }

    function test_ManagerCanCreateRequest() public {
        vm.prank(manager);

        campaign.createRequest(
            DUMMY_DESCRIPTION,
            VALID_CONTRIBUTION,
            recipient
        );

        (string memory description,
        uint256 value,
        address requestRecipient,
        bool complete,
        uint256 approvalCount ) = campaign.requests(0);

        assertEq(description, DUMMY_DESCRIPTION);
        assertEq(value, VALID_CONTRIBUTION);
        assertEq(requestRecipient, recipient);
        assertFalse(complete);
        assertEq(approvalCount, 0);
    }
    function test_NonManagerCannotCreateRequest() public{
        vm.expectRevert();

        vm.prank(donorOne);

        campaign.createRequest("Cannot succeed", VALID_CONTRIBUTION, donorOne);
    }
    function test_DonorCanApproveRequest() public{
        vm.prank(donorOne);
        campaign.contribute{
            value: VALID_CONTRIBUTION
        }();
        vm.prank(manager);
        campaign.createRequest(DUMMY_DESCRIPTION, VALID_CONTRIBUTION, recipient);

        vm.prank(donorOne);
        campaign.approveRequest(0);
        (
            ,
            ,
            ,
            ,
            uint256 approvalCount
        ) = campaign.requests(0);

        assertEq(approvalCount, 1);
    }

    function test_DonorCannotApproveSameRequestTwice() public{
        vm.prank(donorOne);
        campaign.contribute{
            value: VALID_CONTRIBUTION
        }();

        vm.prank(manager);
        campaign.createRequest(DUMMY_DESCRIPTION, VALID_CONTRIBUTION, recipient);

        vm.prank(donorOne);
        campaign.approveRequest(0);
        vm.expectRevert();
        vm.prank(donorOne);
        campaign.approveRequest(0);
    }
    function test_TwoDonorsCanApproveRequest() public{
        vm.prank(donorOne);
        campaign.contribute{
            value: VALID_CONTRIBUTION
        }();

        vm.prank(donorTwo);
        campaign.contribute{
            value: VALID_CONTRIBUTION
        }();

        vm.prank(manager);
        campaign.createRequest(
            "Kupovina klupa",
            1 ether,
            recipient
        );

        vm.prank(donorOne);
        campaign.approveRequest(0);

        vm.prank(donorTwo);
        campaign.approveRequest(0);

        (
            ,
            ,
            ,
            ,
            uint256 approvalCount
        ) = campaign.requests(0);

        assertEq(approvalCount, 2);
    }




}