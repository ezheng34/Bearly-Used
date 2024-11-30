import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-info text-white">
        <div className="container-fluid">
          <div className="navbar-nav d-flex flex-row">
            {/* Dropdown for Prices */}
            <li className="dropdown me-5">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="DropdownPrice"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Prices
              </a>
              <ul className="dropdown-menu" aria-labelledby="DropdownPrice">
                <li>
                  <a className="dropdown-item" href="#">
                    Free
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    less than $5
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    $5 - $10
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    $10 - $20
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    $20 - $30
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    $30+
                  </a>
                </li>
              </ul>
            </li>

            {/* Dropdown for Categories */}
            <li className="dropdown me-5">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="DropdownCategory"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu" aria-labelledby="DropdownCategory">
                <li>
                  <a className="dropdown-item" href="#">
                    Electronics
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Furniture
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Appliances
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Clothing & Accessories
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Books
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Decor
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Tickets & Event Passes
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Miscellaneous
                  </a>
                </li>
              </ul>
            </li>
          </div>
        </div>
      </nav>

      <h1>Home Page</h1>
      <p>Welcome to the home page!</p>

      {/* placeholder */}
      <Link className="nav-link" to="/listing">
        Go to Listing Page
      </Link>

      
    </div>
  );
};

export default HomePage;
