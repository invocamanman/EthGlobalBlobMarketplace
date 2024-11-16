import React from 'react';
import { ProposeBlob } from './components/ProposeBlob';
import { RemoveProposal } from './components/RemoveProposal';
import { SubmitProof } from './components/SubmitProof';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <header className="bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 py-6 shadow-md">
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-white">
          Blob Marketplace
        </h1>
        <p className="text-center text-lg mt-2 text-gray-200">
          Decentralized Marketplace for Blob Content and Proofs
        </p>
      </header>

      <main className="container mx-auto p-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ProposeBlob />
          <SubmitProof />
        </section>

        <section className="mt-12">
          <RemoveProposal />
        </section>
      </main>

      <footer className="mt-16 py-6 bg-gray-900 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Blob Marketplace | Built with Web3 and ❤️
      </footer>
    </div>
  );
}

export default App;
