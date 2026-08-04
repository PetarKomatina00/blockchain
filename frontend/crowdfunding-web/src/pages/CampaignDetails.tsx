import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import {
  formatEther,
  parseEther,
  type Address,
} from "viem";
import {
  useBalance,
  useConnection,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { sepolia } from "viem/chains";

import { Navbar } from "../components/layout/Navbar";
import { campaignAbi } from "../contracts/Campaign";

export function CampaignDetails() {
  const { address } = useParams();
  const campaignAddress = address as Address;

  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const connection = useConnection();
  const transaction = useWriteContract();

  const manager = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "manager",
    chainId: sepolia.id,
  });

  const minimumContribution = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "minimumContribution",
    chainId: sepolia.id,
  });

  const balance = useBalance({
    address: campaignAddress,
    chainId: sepolia.id,
  });

  const receipt = useWaitForTransactionReceipt({
    hash: transaction.data,
    chainId: sepolia.id,
  });

  useEffect(() => {
    if (receipt.isSuccess) {
      setAmount("");
      void balance.refetch();
    }
  }, [receipt.isSuccess]);

  function donate() {
    setLocalError("");

    const normalizedAmount = amount.trim().replace(",", ".");

    if (!normalizedAmount) {
      setLocalError("Unesi iznos donacije.");
      return;
    }

    try {
      transaction.mutate({
        address: campaignAddress,
        abi: campaignAbi,
        functionName: "contribute",
        value: parseEther(normalizedAmount),
        chainId: sepolia.id,
      });
    } catch {
      setLocalError("Iznos nije validan.");
    }
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
            <h1 className="h3">Campaign</h1>

            <p className="small text-break">
              {campaignAddress}
            </p>

            <p className="text-break">
              <strong>Manager:</strong>{" "}
              {String(manager.data ?? "...")}
            </p>

            <p>
              <strong>Minimum contribution</strong>{" "}
              {minimumContribution.data !== undefined
                ? formatEther(minimumContribution.data as bigint)
                : "..."}{" "}
              ETH
            </p>

            <p>
              <strong>Balans:</strong>{" "}
              {balance.data
                ? formatEther(balance.data.value)
                : "..."}{" "}
              ETH
            </p>

            {!connection.isConnected && (
              <div className="alert alert-warning">
                MetaMask nije povezan.
              </div>
            )}

            <div className="input-group">
              <input
                type="text"
                inputMode="decimal"
                className="form-control"
                placeholder="Na primer 0.001"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />

              <span className="input-group-text">ETH</span>

              <button
                type="button"
                className="btn btn-success"
                onClick={donate}
              >
                Doniraj
              </button>
            </div>

            {transaction.isPending && (
              <div className="alert alert-info mt-3">
                Potvrdi transakciju u MetaMasku.
              </div>
            )}
            {receipt.isSuccess && (
              <div className="alert alert-success mt-3">
                Donacija je uspešna.
              </div>
            )}

            {localError && (
              <div className="alert alert-danger mt-3">
                {localError}
              </div>
            )}

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