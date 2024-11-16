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
    <div>
      <h2>Remove Proposal</h2>
      <input
        type="text"
        placeholder="Block Number"
        value={blockNumber}
        onChange={(e) => setBlockNumber(e.target.value)}
      />
      <input
        type="number"
        placeholder="Blob Index"
        value={blobIndex}
        onChange={(e) => setBlobIndex(e.target.value)}
      />
      <button onClick={removeProposal}>Remove Proposal</button>
    </div>
  );
};
