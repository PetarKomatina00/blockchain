import { Route, Routes } from "react-router";

import { CreateCampaignPage } from "./pages/CreateCampaignPage";
import { HomePage } from "./pages/HomePage";
import { DonatePage } from "./pages/DonatePage";
import { CampaignDetails } from "./pages/CampaignDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/campaigns/new" element={<CreateCampaignPage />}/>
      <Route path="/campaigns/:address" element={<DonatePage />}/>
      <Route path="/campaigns/:address" element={<CampaignDetails />}/>
      <Route
        path="*"
        element={
          <main className="container py-5 text-center">
            <h1 className="display-5 fw-bold">
              Page not found 404
            </h1>

            <a href="/" className="btn btn-primary mt-3">
              HomePage
            </a>
          </main>
        }
      />
    </Routes>
  );
}

export default App;