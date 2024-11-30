import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import router components
import HomePage from "./web pages/HomePage";
import ListingPage from "./web pages/ListingPage";

const App: React.FC = () => {
  return (
    <Router>
      {" "}
      {/* Wrap your app with Router */}
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-white">
          <div className="container-fluid align-items-center">
            {/* Use a flexbox utility to center the navbar-brand */}
            <a className="navbar-brand mx-auto" href="#">
              Bearly Used
            </a>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product" element={<ListingPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
