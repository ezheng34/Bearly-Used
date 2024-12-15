import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./web pages/HomePage";
import UserProfile from "./web pages/UserProfile";
import SellerProfile from "./web pages/SellerProfile";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductPage from "./web pages/ProductPage";
import "./styles/App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav className="navbar navbar-expand-lg navbar-custom">
          <div className="container-fluid navbar-container">
            <a className="navbar-brand" href="/">
              Bearly Used &#128059;
            </a>
            <div className="user-profile-section">
              <a href="/user" className="user-name">
                user123
              </a>
              <a href="/user">
                <img alt="Profile" className="profile-picture" />
              </a>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/" element={<UserProfile />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
