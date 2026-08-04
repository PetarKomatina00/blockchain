import { useState } from "react";
import { Link, useParams } from "react-router";
import {formatEther,parseEther,type Address,} from "viem";
import {useReadContract,useWaitForTransactionReceipt,useWriteContract} from "wagmi";
import { sepolia } from "viem/chains";

import { Navbar } from "../components/layout/Navbar";
import {campaignFactoryAbi} from "../contracts/campaignFactory";

export function DonatePage() {
  const { address } = useParams();
  const campaignAddress = address as Address;

  const [amount, setAmount] = useState("");
  const transaction = useWriteContract();

  const minimumContribution = useReadContract({
    address: campaignAddress,
    abi: campaignFactoryAbi,
    functionName: "minimumContribution",
    chainId: sepolia.id,
  });

  const receipt = useWaitForTransactionReceipt({
    hash: transaction.data,
  });

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <Link to="/">← Sve kampanje</Link>

        <div className="card shadow-sm mt-4">
          <div className="card-body">
            <h1 className="h4">Kampanja</h1>

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
                  abi: campaignFactoryAbi,
                  functionName: "contribute",
                  value: parseEther(amount),
                  chainId: sepolia.id,
                });
              }}
            >
              <div className="input-group">
                <input
                  className="form-control"
                  type="number"
                  step="any"
                  placeholder="Iznos donacije"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                  required
                />

                <span className="input-group-text">ETH</span>

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