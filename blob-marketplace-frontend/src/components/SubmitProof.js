import React, { useState } from 'react';
import { ethers } from 'ethers';
import contractABI from '../contractABI.json';

export const SubmitProof = () => {
  const [blockHash, setBlockHash] = useState('');
  const [blobIndex, setBlobIndex] = useState('');
  const [proof, setProof] = useState('');

  const submitProof = async () => {
    try {
      if (!window.ethereum) throw new Error('MetaMask is required!');
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, contractABI, signer);

      const tx = await contract.submitBlobProof(blockHash, blobIndex, ethers.hexlify(proof));
      await tx.wait();
      alert('Proof Submitted Successfully!');
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 p-1 rounded-xl shadow-lg">
      <div className="bg-gray-900 text-gray-100 p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-teal-300">Submit Proof</h2>
        <input
          type="text"
          placeholder="Block Hash"
          value={blockHash}
          onChange={(e) => setBlockHash(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-teal-400"
        />
        <input
          type="number"
          placeholder="Blob Index"
          value={blobIndex}
          onChange={(e) => setBlobIndex(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-teal-400"
        />
        <textarea
          placeholder="Proof (hex format)"
          value={proof}
          onChange={(e) => setProof(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg mb-4 focus:ring-2 focus:ring-teal-400"
        />
        <button
          onClick={submitProof}
          className="w-full bg-gradient-to-r from-teal-500 to-green-500 text-white py-3 rounded-lg hover:from-teal-600 hover:to-green-600 transform hover:scale-105 transition-all duration-200"
        >
          Submit Proof
        </button>
      </div>
    </div>
  );
};
