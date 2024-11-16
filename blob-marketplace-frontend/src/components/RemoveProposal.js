import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

export const RemoveProposal = () => {
  const [blockNumber, setBlockNumber] = useState('');
  const [blobIndex, setBlobIndex] = useState('');

  const removeProposal = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is required!');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.removeProposal(blockNumber, blobIndex);
      await tx.wait();
      alert('Proposal Removed Successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 p-1 rounded-xl shadow-lg">
    <div className="bg-gray-900 text-gray-100 p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-pink-300">Remove Proposal</h2>
      <input
        type="text"
        placeholder="Block Hash"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
      />
      <input
        type="number"
        placeholder="Blob Index"
        value={blobIndex}
        onChange={(e) => setBlobIndex(e.target.value)}
        className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
      />
      <button
        onClick={removeProposal}
        className="w-full bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-lg hover:from-pink-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200"
      >
        Remove Proposal
      </button>
    </div>
  </div>
  );
};
