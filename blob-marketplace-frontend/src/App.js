import React from 'react';
import { ProposeBlob } from './components/ProposeBlob';
import { RemoveProposal } from './components/RemoveProposal';
import { SubmitProof } from './components/SubmitProof';

function App() {
  return (
    <div className="App">
      <h1>Blob Marketplace</h1>
      <ProposeBlob />
      <SubmitProof />
      <RemoveProposal />
    </div>
  );
}

export default App;
