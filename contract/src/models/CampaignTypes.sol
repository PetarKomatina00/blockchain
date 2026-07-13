// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
struct CampaignRequest{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvedBy;
    }