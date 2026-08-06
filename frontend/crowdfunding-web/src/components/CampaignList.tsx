import type { Address } from "viem";
import { useReadContract } from "wagmi";
import { Link } from "react-router";
import {campaignFactoryAbi,campaignFactoryAddress} from "../contracts/campaignFactory";
import { sepolia } from "viem/chains";

function shortenAddress(address: Address): string {
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

export function CampaignList() {

  const completed = useReadContract({
  address: campaignFactoryAddress,
    abi: campaignFactoryAbi,
    functionName: "completed",
    chainId: sepolia.id,
  });
  const campaignsQuery = useReadContract({
      address: campaignFactoryAddress,
      abi: campaignFactoryAbi,
      functionName: "getDeployedCampaigns",
      chainId: sepolia.id,
  });

  if (campaignsQuery.isPending) {
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border text-primary"
          role="status"
        />

        <p className="text-secondary mt-3">
          Učitavanje kampanja...
        </p>
      </div>
    );
  }

  if (campaignsQuery.isError) {
    return (
      <div className="alert alert-danger">
        <h3 className="h6">No contracts</h3>

        <button
          type="button"
          className="btn btn-outline-danger btn-sm"
          onClick={() => campaignsQuery.refetch()}
        >
          Try again
        </button>
      </div>
    );
  }

  const campaigns =
    (campaignsQuery.data ?? []) as readonly Address[];

  if (campaigns.length === 0) {
    return (
      <div className="border rounded-4 bg-light text-center py-5 px-3">
        <i className="bi bi-inboxes display-5 text-secondary" />

        <h3 className="h5 mt-3">
          No campaigns :(
        </h3>

        <p className="text-secondary mb-0">
          Create Campaign
        </p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {campaigns.map((address, index) => (
        <div
          className="col-12 col-md-6 col-xl-4"
          key={address}
        >
          <article className="card h-100 border-0 shadow-sm">
            <div className="card-body p-4">
              <span
                className={`badge ${
                  completed.data ? "bg-secondary" : "bg-success"
                }`}
              >
                {completed.data ? "Completed" : "Active"}
              </span>

              <h3 className="h5">
                Campaign {index + 1}
              </h3>

              <p className="small text-secondary text-break">
                {shortenAddress(address)}
              </p>

              <Link
                to={`/campaigns/${address}`}
                className="btn btn-outline-primary w-100">
                View Campaign
              </Link>
            </div>
          </article>
        </div>
      ))}
    </div>
  );
}