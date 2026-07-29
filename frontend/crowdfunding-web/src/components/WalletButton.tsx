import {useConnect,useConnection,useConnectors,useDisconnect} from "wagmi";

function shortenAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function WalletButton() {
  const connection = useConnection();
  const connectors = useConnectors();
  const connect = useConnect();
  const disconnect = useDisconnect();

  if (connection.isConnected && connection.address) {
    return (
      <div className="d-flex align-items-center gap-2">
        <span className="badge text-bg-light border py-2 px-3">
          <i className="bi bi-wallet2 me-2" />

          {shortenAddress(connection.address)}
        </span>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={() => disconnect.mutate()}
          disabled={disconnect.isPending}
        >
          Odjavi
        </button>
      </div>
    );
  }

  const connector = connectors[0];

  return (
    <button
      type="button"
      className="btn btn-primary"
      disabled={!connector || connect.isPending}
      onClick={() => {
        if (connector) {
          connect.mutate({ connector });
        }
      }}
    >
      <i className="bi bi-wallet2 me-2" />

      {connect.isPending
        ? "Povezivanje..."
        : "Poveži wallet"}
    </button>
  );
}