import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <main className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="p-5 bg-white border rounded-4 shadow-sm">
          <span className="badge text-bg-primary mb-3">
            Decentralized crowdfunding
          </span>

          <h1 className="display-5 fw-bold">
            Fund projects that matter
          </h1>

          <p className="lead text-secondary">
            Create campaigns, contribute ETH and approve spending requests
            through Ethereum smart contracts.
          </p>

          <div className="d-flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary btn-lg">
              <i className="bi bi-compass me-2" />
              Explore campaigns
            </button>

            <button type="button" className="btn btn-outline-dark btn-lg">
              <i className="bi bi-wallet2 me-2" />
              Connect wallet
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;