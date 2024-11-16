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
    <div>
      <h2>Submit Proof</h2>
      <input
        type="text"
        placeholder="Block Hash"
        value={blockHash}
        onChange={(e) => setBlockHash(e.target.value)}
      />
      <input
        type="number"
        placeholder="Blob Index"
        value={blobIndex}
        onChange={(e) => setBlobIndex(e.target.value)}
      />
      <textarea
        placeholder="Proof (hex format)"
        value={proof}
        onChange={(e) => setProof(e.target.value)}
      />
      <button onClick={submitProof}>Submit Proof</button>
    </div>
  );
};
