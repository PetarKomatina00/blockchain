import { WalletButton } from "../WalletButton";

export function Navbar() {
  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom sticky-top"
      aria-label="Glavna navigacija"
    >
      <div className="container py-2">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <span className="brand-icon" aria-hidden="true">
            <i className="bi bi-boxes" />
          </span>

          CrowdFunding
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavigation"
          aria-controls="mainNavigation"
          aria-expanded="false"
          aria-label="Prikaži ili sakrij glavnu navigaciju">
          <span className="navbar-toggler-icon" />
        </button>

        <div
          id="mainNavigation"
          className="collapse navbar-collapse">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#campaigns"
                aria-current="location">
                Kampanje
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#how-it-works">
                Kako funkcioniše
              </a>
            </li>
          </ul>

          <div className="d-flex flex-column flex-lg-row gap-2">
            <button type="button" className="btn btn-outline-dark">
              <i className="bi bi-plus-lg me-2" aria-hidden="true"/>
              Kreiraj kampanju
            </button>

            <WalletButton />
          </div>
        </div>
      </div>
    </nav>
  );
}