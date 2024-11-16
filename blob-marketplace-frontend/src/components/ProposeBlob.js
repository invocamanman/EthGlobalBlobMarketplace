import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

export const ProposeBlob = () => {
    const [blockNumber, setBlockNumber] = useState('');
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
            console.log(blockNumber)
            console.log(blobIndex)
            const tx = await contract.proposeBlob(blockNumber, blobIndex, {
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
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-xl shadow-lg">
      <div className="bg-gray-900 text-gray-100 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-purple-300">Propose Blob</h2>
        <input
          type="number"
          placeholder="Block Hash"
          value={blockNumber}
          onChange={(e) => setBlockNumber(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="number"
          placeholder="Blob Index"
          value={blobIndex}
          onChange={(e) => setBlobIndex(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-purple-400"
        />
        <input
          type="text"
          placeholder="Bounty (ETH)"
          value={bounty}
          onChange={(e) => setBounty(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-purple-400"
        />
        <button
          onClick={proposeBlob}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200"
        >
          Propose Blob
        </button>
      </div>
    </div>
    );
};
