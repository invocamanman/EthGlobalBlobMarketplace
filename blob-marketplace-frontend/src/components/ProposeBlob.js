import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

export const ProposeBlob = () => {
    const [blockHash, setBlockHash] = useState('');
    const [blobIndex, setBlobIndex] = useState('');
    const [bounty, setBounty] = useState('');

    const proposeBlob = async () => {
        try {
            if (!window.ethereum) throw new Error('MetaMask is required!');
            const provider = new ethers.BrowserProvider(window.ethereum);
            const network = await provider.getNetwork();
            console.log("Network: ", network)
            const signer = await provider.getSigner();
            console.log("SIG: ", process.env.REACT_APP_CONTRACT_ADDRESS)
            const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractABI, signer);
            console.log(ethers.parseEther(bounty))
            console.log(blockHash)
            console.log(blobIndex)
            const tx = await contract.proposeBlob(blockHash, blobIndex, {
                value: ethers.parseEther(bounty),
            });
            await tx.wait();
            alert('Blob Proposed Successfully!');
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    return (
        <div>
            <h2>Propose Blob</h2>
            <input
                type="text"
                placeholder="Block Number"
                value={blockHash}
                onChange={(e) => setBlockHash(e.target.value)}
            />
            <input
                type="number"
                placeholder="Blob Index"
                value={blobIndex}
                onChange={(e) => setBlobIndex(e.target.value)}
            />
            <input
                type="text"
                placeholder="Bounty (ETH)"
                value={bounty}
                onChange={(e) => setBounty(e.target.value)}
            />
            <button onClick={proposeBlob}>Propose</button>
        </div>
    );
};
