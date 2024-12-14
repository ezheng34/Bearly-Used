import React from "react";
import { Link } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Import router components
import HomePage from "./web pages/HomePage";
import UserProfile from "./web pages/UserProfile";
import SellerProfile from "./web pages/SellerProfile";

import "bootstrap/dist/css/bootstrap.min.css";
import ProductPage from "./web pages/ProductPage";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <Router>
      {" "}
      {/* Wrap app with Router */}
      <div>
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container-fluid align-items-center">
            <a className="navbar-brand mx-auto text-white" href="/">
              Bearly Used
            </a>
            <div className="d-flex align-items-center">
              <a href="/user" className="text-white text-decoration-none me-3">
                {/* {userName} */}
                user123
              </a>
              <img
                // src={userProfilePicture}
                alt="Profile"
                className="rounded-circle"
                style={{ width: "30px", height: "30px" }}
              />
            </div>
          </div>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/" element={<UserProfile />} />
          {/* <Route path="/user/:id" element={<UserProfile />} /> */}
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
