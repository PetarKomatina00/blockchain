import { useState } from "react";
import { Link, useParams } from "react-router";
import {
  formatEther,
  parseEther,
  type Address,
} from "viem";
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { sepolia } from "viem/chains";

import { campaignAbi } from "../contracts/Campaign";
import { Navbar } from "../components/layout/Navbar";

export function CampaignDetails() {
  const { address } = useParams();
  const campaignAddress = address as Address;

  const [amount, setAmount] = useState("");
  const transaction = useWriteContract();

  const minimumContribution = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "minimumContribution",
    chainId: sepolia.id,
  });

  const receipt = useWaitForTransactionReceipt({
    hash: transaction.data,
    chainId: sepolia.id,
  });

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <Link to="/">← Sve kampanje</Link>

        <div className="card shadow-sm mt-4">
          <div className="card-body p-4">
            <h1 className="h3">Kampanja</h1>

            <p className="small text-break">
              {campaignAddress}
            </p>

            <p>
              Minimalni doprinos:{" "}
              {minimumContribution.data !== undefined
                ? formatEther(
                    minimumContribution.data as bigint,
                  )
                : "..."}{" "}
              ETH
            </p>

            <form
              onSubmit={(event) => {
                event.preventDefault();

                transaction.mutate({
                  address: campaignAddress,
                  abi: campaignAbi,
                  functionName: "contribute",
                  value: parseEther(amount),
                  chainId: sepolia.id,
                });
              }}
            >
              <div className="input-group">
                <input
                  type="number"
                  step="any"
                  className="form-control"
                  placeholder="Iznos donacije"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  required
                />

                <span className="input-group-text">
                  ETH
                </span>

                <button
                  className="btn btn-success"
                  disabled={
                    transaction.isPending ||
                    receipt.isPending
                  }
                >
                  Doniraj
                </button>
              </div>
            </form>

            {receipt.isPending && (
              <p className="text-info mt-3">
                Transakcija se potvrđuje...
              </p>
            )}

            {receipt.isSuccess && (
              <p className="text-success mt-3">
                Donacija je uspešna.
              </p>
            )}

            {transaction.error && (
              <p className="text-danger mt-3">
                {transaction.error.message}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}