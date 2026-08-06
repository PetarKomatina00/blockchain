import { useState } from "react";
import { Link } from "react-router";
import { parseEther } from "viem";
import {
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { sepolia } from "viem/chains";

import { Navbar } from "../components/layout/Navbar";
import {campaignFactoryAbi, campaignFactoryAddress} from "../contracts/campaignFactory";

export function CreateCampaignPage() {
  const [minimumContribution, setMinimumContribution] =
    useState("");

  const [fundingGoal, setFundingGoal] = useState("");

  const transaction = useWriteContract();

  const receipt = useWaitForTransactionReceipt({
    hash: transaction.data,
    chainId: sepolia.id,
  });

  function createCampaign() {
    transaction.mutate({
      address: campaignFactoryAddress,
      abi: campaignFactoryAbi,
      functionName: "createCampaign",
      args: [
        parseEther(minimumContribution),
        parseEther(fundingGoal),
      ],
      chainId: sepolia.id,
    });
  }

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <Link to="/" className="text-decoration-none">
          ← Home Page
        </Link>

        <div className="card shadow-sm mt-4">
          <div className="card-body p-4">
            <h1 className="h3 mb-4">
              Create Campaign
            </h1>

            <div className="mb-3">
              <label className="form-label">
                Minimum contribution
              </label>

              <div className="input-group">
                <input
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  placeholder="0.001"
                  value={minimumContribution}
                  onChange={(event) =>
                    setMinimumContribution(
                      event.target.value,
                    )
                  }
                />

                <span className="input-group-text">
                  ETH
                </span>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">
                Funding Goal
              </label>

              <div className="input-group">
                <input
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  placeholder="1"
                  value={fundingGoal}
                  onChange={(event) =>
                    setFundingGoal(event.target.value)
                  }
                />

                <span className="input-group-text">
                  ETH
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={createCampaign}
              disabled={transaction.isPending}
            >
              {transaction.isPending
                ? "Confirm in metamask..."
                : "Create Campaign"}
            </button>

            {(transaction.error || receipt.error) && (
              <div className="alert alert-danger mt-3">
                {transaction.error?.message ??
                  receipt.error?.message}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}