// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BlobMarketplace {
    struct BlobRequest {
        bytes32 blockHash;
        uint256 blobIndex;
        uint256 bounty;
        bool fulfilled;
    }

    mapping(bytes32 => BlobRequest) public blobRequests;
    mapping(bytes32 => address) public proposers; // Only for tracking who can remove proposals

    event BlobRequested(
        bytes32 indexed blockHash,
        uint256 blobIndex,
        uint256 bounty
    );
    event BlobFulfilled(
        bytes32 indexed blockHash,
        uint256 blobIndex,
        address indexed prover
    );
    event BountyClaimed(address indexed prover, uint256 amount);
    event ProposalRemoved(bytes32 indexed blockHash, uint256 blobIndex);

    modifier onlyProposer(bytes32 _blockHash, uint256 _blobIndex) {
        bytes32 proposalKey = keccak256(
            abi.encodePacked(_blockHash, _blobIndex)
        );
        require(proposers[proposalKey] == msg.sender, "Not the proposer");
        _;
    }

    modifier isValidBlockhash(bytes32 _blockHash) {
        require(
            blockhash(uint256(_blockHash)) != bytes32(0),
            "Invalid block hash"
        );
        _;
    }

    function proposeBlob(
        bytes32 _blockHash,
        uint256 _blobIndex
    ) external payable isValidBlockhash(_blockHash) {
        require(msg.value > 0, "Bounty must be greater than 0");

        bytes32 proposalKey = keccak256(
            abi.encodePacked(_blockHash, _blobIndex)
        );
        require(
            blobRequests[proposalKey].bounty == 0,
            "Proposal already exists"
        );

        blobRequests[proposalKey] = BlobRequest({
            blockHash: _blockHash,
            blobIndex: _blobIndex,
            bounty: msg.value,
            fulfilled: false
        });

        proposers[proposalKey] = msg.sender;

        emit BlobRequested(_blockHash, _blobIndex, msg.value);
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

        require(
            request.bounty > 0,
            "Proposal does not exist or already fulfilled"
        );
        require(!request.fulfilled, "Blob already fulfilled");

        // Add proof verification logic (SP1 proof verification)
        // e.g., bool validProof = verifyProof(_blockHash, _blobIndex, _proof);
        // require(validProof, "Invalid proof");

        request.fulfilled = true;

        uint256 bounty = request.bounty;
        request.bounty = 0;

        payable(msg.sender).transfer(bounty);

        emit BlobFulfilled(_blockHash, _blobIndex, msg.sender);
        emit BountyClaimed(msg.sender, bounty);
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

        uint256 bounty = request.bounty;
        request.bounty = 0;

        // Refund the proposer
        payable(msg.sender).transfer(bounty);

        delete blobRequests[proposalKey];
        delete proposers[proposalKey];

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
