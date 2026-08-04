import { useState, type SyntheticEvent } from "react";
import { Link } from "react-router";
import { parseEther } from "viem";
import {useConnection,useWaitForTransactionReceipt,useWriteContract,} from "wagmi";
import { Navbar } from "../components/layout/Navbar";
import {campaignFactoryAbi,campaignFactoryAddress,} from "../contracts/campaignFactory";

export function CreateCampaignPage() {
  const [amount, setAmount] = useState("");
  const connection = useConnection();
  const transaction = useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    hash: transaction.data,
  });

  function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    transaction.mutate({
      address: campaignFactoryAddress,
      abi: campaignFactoryAbi,
      functionName: "createCampaign",
      args: [parseEther(amount)],
    });
  }

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <Link to="/" className="text-decoration-none">
          Go to Home Page
        </Link>

        <div className="card shadow-sm border-0 mx-auto mt-4 p-4">
          <h1 className="h3 mb-4">Create Campaign</h1>

          {!connection.isConnected && (
            <div className="alert alert-warning">
              Connect to MetaMask
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <input
                type="number"
                step="any"
                min="0"
                className="form-control"
                placeholder="Minimalni doprinos"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />

              <span className="input-group-text">ETH</span>
            </div>

            <button
              className="btn btn-primary w-100"
              disabled={!connection.isConnected || transaction.isPending}>
              {transaction.isPending
                ? "Confirm in Meta Mask"
                : "Create Campaign"}
            </button>
          </form>

          {receipt.isSuccess && (
            <div className="alert alert-success mt-3">
              Campaign has been created.
            </div>
          )}
        </div>
      </main>
    </>
  );
}