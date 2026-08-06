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
import { CampaignRequests } from "./CampaignRequest";

export function CampaignDetails() {
  const { address } = useParams();
  const campaignAddress = address as Address;

  const [amount, setAmount] = useState("");
  const [localError, setLocalError] = useState("");

  const connection = useConnection();

  const donationTransaction = useWriteContract();

  const donationReceipt = useWaitForTransactionReceipt({
    hash: donationTransaction.data,
    chainId: sepolia.id,
  });

  const completeTransaction = useWriteContract();

  const completeReceipt = useWaitForTransactionReceipt({
    hash: completeTransaction.data,
    chainId: sepolia.id,
  });

  const manager = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "manager",
    chainId: sepolia.id,
  });

  const fundingGoal = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "fundingGoal",
    chainId: sepolia.id,
  });

  const minimumContribution = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "minimumContribution",
    chainId: sepolia.id,
  });

  const completed = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "completed",
    chainId: sepolia.id,
  });

  const balance = useBalance({
    address: campaignAddress,
    chainId: sepolia.id,
  });

  const managerAddress = manager.data as Address | undefined;
  const isCompleted = completed.data === true;

  const isManager =
    connection.isConnected &&
    connection.address !== undefined &&
    managerAddress !== undefined &&
    connection.address.toLowerCase() ===
      managerAddress.toLowerCase();

  const campaignBalance = balance.data?.value;

  const canComplete =
    isManager &&
    campaignBalance === 0n &&
    !isCompleted;

  const isCompleting =
    completeTransaction.isPending ||
    (Boolean(completeTransaction.data) &&
      completeReceipt.isPending);

  useEffect(() => {
    if (donationReceipt.isSuccess) {
      setAmount("");
      void balance.refetch();
    }
  }, [donationReceipt.isSuccess]);

  useEffect(() => {
    if (completeReceipt.isSuccess) {
      void completed.refetch();
      void balance.refetch();
    }
  }, [completeReceipt.isSuccess]);

  function donate() {
    setLocalError("");

    const normalizedAmount = amount
      .trim()
      .replace(",", ".");

    if (!normalizedAmount) {
      setLocalError("Enter a donation amount.");
      return;
    }

    try {
      donationTransaction.mutate({
        address: campaignAddress,
        abi: campaignAbi,
        functionName: "contribute",
        value: parseEther(normalizedAmount),
        chainId: sepolia.id,
      });
    } catch {
      setLocalError("Invalid donation amount.");
    }
  }

  function completeCampaign() {
    completeTransaction.mutate({
      address: campaignAddress,
      abi: campaignAbi,
      functionName: "completeCampaign",
      chainId: sepolia.id,
    });
  }

  return (
    <>
      <Navbar />

      <main className="container py-5">
        <Link to="/" className="text-decoration-none">
          ← Home
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
              <strong>Status:</strong>{" "}
              <span
                className={`badge ${
                  isCompleted
                    ? "bg-secondary"
                    : "bg-success"
                }`}
              >
                {isCompleted
                  ? "Completed"
                  : "Active"}
              </span>
            </p>

            <p>
              <strong>Funding goal:</strong>{" "}
              {fundingGoal.data !== undefined
                ? `${formatEther(
                    fundingGoal.data as bigint,
                  )} ETH`
                : "Loading..."}
            </p>

            <p>
              <strong>Minimum contribution:</strong>{" "}
              {minimumContribution.data !== undefined
                ? formatEther(
                    minimumContribution.data as bigint,
                  )
                : "Loading..."}{" "}
              ETH
            </p>

            <p>
              <strong>Balance:</strong>{" "}
              {balance.data
                ? formatEther(balance.data.value)
                : "Loading..."}{" "}
              ETH
            </p>

            {!connection.isConnected && (
              <div className="alert alert-warning">
                MetaMask is not connected.
              </div>
            )}

            {!isCompleted && (
              <div className="input-group">
                <input
                  type="text"
                  inputMode="decimal"
                  className="form-control"
                  placeholder="For example 0.001"
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                />

                <span className="input-group-text">
                  ETH
                </span>

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={donate}
                >
                  Donate
                </button>
              </div>
            )}

            {isCompleted && (
              <div className="alert alert-secondary">
                This campaign is completed. New donations
                are not allowed.
              </div>
            )}

            <CampaignRequests
              campaignAddress={campaignAddress}
              onChanged={() => {
                void balance.refetch();
              }}
            />

            <hr className="my-4" />

            <h2 className="h5">
              Complete campaign
            </h2>

            {!isManager && connection.isConnected && (
              <p className="text-muted">
                Only the campaign manager can complete the
                campaign.
              </p>
            )}

            {isManager &&
              campaignBalance !== undefined &&
              campaignBalance > 0n && (
                <p className="text-muted">
                  Withdraw all campaign funds before
                  completing the campaign.
                </p>
              )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={completeCampaign}
              disabled={!canComplete || isCompleting}
            >
              {isCompleting
                ? "Confirming..."
                : isCompleted
                  ? "Campaign completed"
                  : "Complete campaign"}
            </button>

            {donationTransaction.isPending && (
              <div className="alert alert-info mt-3">
                Confirm the donation in MetaMask.
              </div>
            )}

            {donationReceipt.isSuccess && (
              <div className="alert alert-success mt-3">
                Donation completed successfully.
              </div>
            )}

            {completeReceipt.isSuccess && (
              <div className="alert alert-success mt-3">
                Campaign completed successfully.
              </div>
            )}

            {localError && (
              <div className="alert alert-danger mt-3">
                {localError}
              </div>
            )}

            {(donationTransaction.error ||
              donationReceipt.error) && (
              <div className="alert alert-danger mt-3">
                {donationTransaction.error?.message ??
                  donationReceipt.error?.message}
              </div>
            )}

            {(completeTransaction.error ||
              completeReceipt.error) && (
              <div className="alert alert-danger mt-3">
                {completeTransaction.error?.message ??
                  completeReceipt.error?.message}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}