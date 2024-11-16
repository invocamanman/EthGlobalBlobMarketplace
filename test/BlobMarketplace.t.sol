// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "lib/forge-std/Test.sol";
import "../contracts/BlobMarketPlace.sol";

contract BlobMarketplaceTest is Test {
    BlobMarketplace marketplace;

    address proposer = address(0x123);
    address prover = address(0x456);

    bytes32 validBlockHash = blockhash(block.number - 1); // Use a recent valid block hash
    bytes32 invalidBlockHash = bytes32(0); // Invalid block hash
    uint256 blobIndex = 0;
    uint256 bounty = 1 ether;

    function setUp() public {
        marketplace = new BlobMarketplace();
        vm.deal(proposer, 10 ether); // Fund proposer for testing
        vm.deal(prover, 10 ether); // Fund prover for testing
    }

    function testProposeBlob() public {
        vm.startPrank(proposer);
        vm.expectRevert("Invalid block hash");
        marketplace.proposeBlob(invalidBlockHash, blobIndex);

        vm.expectRevert("Bounty must be greater than 0");
        marketplace.proposeBlob(validBlockHash, blobIndex);

        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);
        (
            bytes32 blockHash,
            uint256 index,
            uint256 storedBounty,
            address storedProposer,
            bool fulfilled
        ) = marketplace.getBlobRequest(validBlockHash, blobIndex);
        assertEq(blockHash, validBlockHash);
        assertEq(index, blobIndex);
        assertEq(storedBounty, bounty);
        assertEq(storedProposer, proposer);
        assertFalse(fulfilled);
    }

    function testProposeBlobRevertsIfAlreadyExists() public {
        vm.startPrank(proposer);
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);
        vm.expectRevert("Proposal already exists");
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);
    }

    function testSubmitBlobProof() public {
        vm.startPrank(proposer);
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);

        vm.stopPrank();
        vm.startPrank(prover);

        vm.expectRevert("Proposal does not exist or already fulfilled");
        marketplace.submitBlobProof(invalidBlockHash, blobIndex, "");

        vm.expectRevert("Proposal does not exist or already fulfilled");
        marketplace.submitBlobProof(validBlockHash, blobIndex + 1, "");

        marketplace.submitBlobProof(validBlockHash, blobIndex, "valid proof");
        (, , , , bool fulfilled) = marketplace.getBlobRequest(
            validBlockHash,
            blobIndex
        );
        assertTrue(fulfilled);
        assertEq(prover.balance, 10 ether + bounty);
    }

    function testSubmitBlobProofRevertsIfAlreadyFulfilled() public {
        vm.startPrank(proposer);
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);

        vm.stopPrank();
        vm.startPrank(prover);
        marketplace.submitBlobProof(validBlockHash, blobIndex, "valid proof");

        vm.expectRevert("Blob already fulfilled");
        marketplace.submitBlobProof(validBlockHash, blobIndex, "valid proof");
    }

    function testRemoveProposal() public {
        vm.startPrank(proposer);
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);

        marketplace.removeProposal(validBlockHash, blobIndex);
        (, , uint256 storedBounty, , ) = marketplace.getBlobRequest(
            validBlockHash,
            blobIndex
        );
        assertEq(storedBounty, 0);
        assertEq(proposer.balance, 10 ether);
    }

    function testRemoveProposalRevertsIfNotProposer() public {
        vm.startPrank(proposer);
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);

        vm.stopPrank();
        vm.startPrank(prover);
        vm.expectRevert("Not the proposer");
        marketplace.removeProposal(validBlockHash, blobIndex);
    }

    function testRemoveProposalRevertsIfFulfilled() public {
        vm.startPrank(proposer);
        marketplace.proposeBlob{value: bounty}(validBlockHash, blobIndex);

        vm.stopPrank();
        vm.startPrank(prover);
        marketplace.submitBlobProof(validBlockHash, blobIndex, "valid proof");

        vm.stopPrank();
        vm.startPrank(proposer);
        vm.expectRevert("Cannot remove fulfilled proposal");
        marketplace.removeProposal(validBlockHash, blobIndex);
    }
}
