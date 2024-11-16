// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BlobMarketPlace {
    struct BlobRequest {
        bytes32 blockHash;
        uint256 blobIndex;
        uint256 bounty;
        address proposer;
        bool fulfilled;
    }

    mapping(bytes32 => BlobRequest) public blobRequests;

    event BlobRequested(
        bytes32 indexed blockHash,
        uint256 blobIndex,
        uint256 bounty
    );
    event BlobFulfilled(
        bytes32 indexed blockHash,
        uint256 blobIndex,
        address indexed prover,
        uint256 amount
    );
    event ProposalRemoved(bytes32 indexed blockHash, uint256 blobIndex);

    modifier onlyProposer(bytes32 _blockHash, uint256 _blobIndex) {
        bytes32 proposalKey = keccak256(
            abi.encodePacked(_blockHash, _blobIndex)
        );
        require(
            blobRequests[proposalKey].proposer == msg.sender,
            "Not the proposer"
        );
        _;
    }

    modifier isValidBlockhash(uint256 _blockNumber) {
        require(blockhash(_blockNumber) != bytes32(0), "Invalid block hash");
        _;
    }

    function proposeBlob(
        uint256 _blockNumber,
        uint256 _blobIndex
    ) external payable isValidBlockhash(_blockNumber) {
        require(msg.value > 0, "Bounty must be greater than 0");
        bytes32 bh = blockhash(_blockNumber);
        bytes32 proposalKey = keccak256(abi.encodePacked(bh, _blobIndex));
        require(
            blobRequests[proposalKey].bounty == 0,
            "Proposal already exists"
        );

        blobRequests[proposalKey] = BlobRequest({
            blockHash: bh,
            blobIndex: _blobIndex,
            bounty: msg.value,
            proposer: msg.sender,
            fulfilled: false
        });

        emit BlobRequested(bh, _blobIndex, msg.value);
    }

    function submitBlobProof(
        bytes32 _blockHash,
        uint256 _blobIndex,
        bytes calldata _proof
    ) external {
        bytes32 proposalKey = keccak256(
            abi.encodePacked(_blockHash, _blobIndex)
        );
        BlobRequest storage request = blobRequests[proposalKey];

        require(!request.fulfilled, "Blob already fulfilled");

        // Add proof verification logic (SP1 proof verification)
        // e.g., bool validProof = verifyProof(_blockHash, _blobIndex, _proof);
        // require(validProof, "Invalid proof");

        request.fulfilled = true;
        uint256 bounty = request.bounty;
        payable(msg.sender).transfer(bounty);

        emit BlobFulfilled(_blockHash, _blobIndex, msg.sender, bounty);
    }

    function removeProposal(
        bytes32 _blockHash,
        uint256 _blobIndex
    ) external onlyProposer(_blockHash, _blobIndex) {
        bytes32 proposalKey = keccak256(
            abi.encodePacked(_blockHash, _blobIndex)
        );
        BlobRequest storage request = blobRequests[proposalKey];

        require(!request.fulfilled, "Cannot remove fulfilled proposal");

        // delete proposal
        delete blobRequests[proposalKey];

        // Refund the proposer
        payable(msg.sender).transfer(request.bounty);

        emit ProposalRemoved(_blockHash, _blobIndex);
    }

    function getBlobRequest(
        bytes32 _blockHash,
        uint256 _blobIndex
    ) external view returns (BlobRequest memory) {
        bytes32 proposalKey = keccak256(
            abi.encodePacked(_blockHash, _blobIndex)
        );
        return blobRequests[proposalKey];
    }
}
