import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import router components
import HomePage from "./web pages/HomePage";
import ListingPage from "./web pages/[delete] ListingPage";
import UserProfile from "./web pages/UserProfile";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductPage from "./web pages/ProductPage";

const App: React.FC = () => {
  return (
    <Router>
      {" "}
      {/* Wrap app with Router */}
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark text-white">
          <div className="container-fluid align-items-center">
            <a className="navbar-brand mx-auto" href="#">
              Bearly Used
            </a>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/product" element={<ListingPage />} /> */}
          <Route path="/user" element={<UserProfile />} />
          <Route path="/product/:id" element={<ProductPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
