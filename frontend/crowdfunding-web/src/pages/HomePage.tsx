import { Link } from "react-router";
import { CampaignList } from "../components/CampaignList";
import { Navbar } from "../components/layout/Navbar";

export function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="hero-section">
          <div className="container py-5">
            <h1 className="display-4 fm-bold mb-4">Podrži ideje koje mogu da naprave razliku</h1>
            <p className="lead text-secondary mb-4">
              Kreiraj kampanju, doniraj ETH i glasaj o načinu na koji
              menadžeri koriste prikupljena sredstva.
            </p>

            <Link
            to="/campaigns/new"
            className="btn btn-outline-dark btn-lg px-4"
            >
            <i className="bi bi-plus-circle me-2" />
            Start Campaign
            </Link>
          </div>
        </section>

        <section className="bg-light container py-5">
          <div className="container py-5">
            <span className="text-primary">Aktivne kampanje</span>
            <h2 className="display-6 mt-2 mb-0">Istraži projekte</h2>
            <CampaignList />
          </div>
        </section>
      </main>
    </>
  );
}
