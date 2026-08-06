import { useState } from "react";
import {
  formatEther,
  parseEther,
  type Address,
} from "viem";
import {
  useReadContract,
  useWriteContract,
} from "wagmi";
import { sepolia } from "viem/chains";

import { campaignAbi } from "../contracts/Campaign";

type Props = {
  campaignAddress: Address;
  onChanged?: () => void
};

type RequestData = readonly [
  string,
  bigint,
  Address,
  boolean,
  bigint,
];

export function CampaignRequests({
  campaignAddress,
}: Props) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [recipient, setRecipient] = useState("");
  const [index, setIndex] = useState("0");

  const transaction = useWriteContract();

  const requestQuery = useReadContract({
    address: campaignAddress,
    abi: campaignAbi,
    functionName: "requests",
    args: [BigInt(index || "0")],
    chainId: sepolia.id,
  });

  const request = requestQuery.data as
    | RequestData
    | undefined;

  function createRequest() {
    transaction.mutate({
      address: campaignAddress,
      abi: campaignAbi,
      functionName: "createRequest",
      args: [
        description,
        parseEther(value),
        recipient as Address,
      ],
      chainId: sepolia.id,
    });
  }

  function approveRequest() {
    transaction.mutate({
      address: campaignAddress,
      abi: campaignAbi,
      functionName: "approveRequest",
      args: [BigInt(index)],
      chainId: sepolia.id,
    });
  }

  function finalizeRequest() {
    transaction.mutate({
      address: campaignAddress,
      abi: campaignAbi,
      functionName: "finalizeRequest",
      args: [BigInt(index)],
      chainId: sepolia.id,
    });
  }

  return (
    <section className="mt-5">
      <hr />

      <h2 className="h4">Payment requests

</h2>

      <div className="card mt-3">
        <div className="card-body">
          <h3 className="h5">Create request</h3>

          <input
            className="form-control mb-2"
            placeholder="Opis"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

          <input
            className="form-control mb-2"
            placeholder="Iznos u ETH"
            value={value}
            onChange={(event) =>
              setValue(event.target.value)
            }
          />

          <input
            className="form-control mb-3"
            placeholder="Adresa primaoca"
            value={recipient}
            onChange={(event) =>
              setRecipient(event.target.value)
            }
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={createRequest}
          >
            Create request
          </button>
        </div>
      </div>

      <div className="card mt-3">
        <div className="card-body">
          <h3 className="h5">Voting and payment</h3>

          <input
            type="number"
            min="0"
            className="form-control mb-3"
            value={index}
            onChange={(event) =>
              setIndex(event.target.value)
            }
          />

          {request && (
            <div className="mb-3">
              <p>Description: {request[0]}</p>
              <p>Amount: {formatEther(request[1])} ETH</p>
              <p className="text-break">
                Recipient: {request[2]}
              </p>
              <p>Finalize: {request[3] ? "Da" : "Ne"}</p>
              <p>Voting: {request[4].toString()}</p>
            </div>
          )}

          <button
            type="button"
            className="btn btn-outline-primary me-2"
            onClick={approveRequest}
          >
            Vote
          </button>

          <button
            type="button"
            className="btn btn-success"
            onClick={finalizeRequest}
          >
            Pay
          </button>
        </div>
      </div>
    </section>
  );
}