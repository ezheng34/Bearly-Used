import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListItemPopup from "./ListItemPopup";
import { Modal } from "bootstrap";
import "../styles/HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import ProductPage from "./ProductPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// backend types - might be wrong
interface ListingItem {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
}

const HomePage: React.FC = () => {
  // Mock data??
  const mockListings: ListingItem[] = [
    {
      id: 1,
      title: "iPhone 12",
      price: 400,
      category: "Electronics",
      description: "Good condition iPhone",
    },
    {
      id: 2,
      title: "Desk Lamp",
      price: 15,
      category: "Furniture",
      description: "LED desk lamp",
    },
    {
      id: 3,
      title: "cs320 Textbook",
      price: 25,
      category: "Books",
      description: "never used. readings hwo",
    },
    {
      id: 4,
      title: "NEW shiny sexy nike shoes",
      price: 45,
      category: "Clothing & Accessories",
      description: "Size 10",
    },
    {
      id: 5,
      title: "ur mom",
      price: 0,
      category: "Clothing & Accessories",
      description: "FREE 99",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [filteredListings, setFilteredListings] =
    useState<ListingItem[]>(mockListings);

  const categories = [
    "Electronics",
    "Furniture",
    "Appliances",
    "Clothing & Accessories",
    "Books",
    "Decor",
    "Tickets & Event Passes",
    "Miscellaneous",
  ];

  const priceRanges = [
    { label: "Free", min: 0, max: 0 },
    { label: "Less than $5", min: 0.01, max: 5 },
    { label: "$5 - $10", min: 5, max: 10 },
    { label: "$10 - $20", min: 10, max: 20 },
    { label: "$20 - $30", min: 20, max: 30 },
    { label: "$30+", min: 30, max: null },
  ];

  // filter listings based on selected category and price range
  useEffect(() => {
    let filtered = [...mockListings];

    if (selectedCategory) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter((item) => {
          if (range.max === null) return item.price >= range.min;
          return item.price >= range.min && item.price <= range.max;
        });
      }
    }

    setFilteredListings(filtered);
  }, [selectedCategory, selectedPriceRange]);

  // Initialize modal
  useEffect(() => {
    const modalElement = document.getElementById("addListingModal");
    if (modalElement) {
      new Modal(modalElement);
    }
  }, []);

  const closeModal = () => {
    // Get the modal element
    const modalElement = document.getElementById("addListingModal");
    if (modalElement) {
      // Hide the modal using Bootstrap's Modal instance . bc wtf
      const modal = Modal.getInstance(modalElement);
      modal?.hide();

      // Remove all modal-related effects
      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      modalElement.setAttribute("aria-hidden", "true");
      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("height");
    }
  };


  const navigate = useNavigate();
  //redirects user to product page via different url based on id of product
  const handleProductClick = (id: number) => {
    navigate(`/product/${id}`);
  };


  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-info">
        <div className="container-fluid">
          <ul className="navbar-nav">
            {/* Prices Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                id="DropdownPrice"
                aria-expanded="false"
              >
                {selectedPriceRange || "Prices"}
              </button>
              <ul className="dropdown-menu" aria-labelledby="DropdownPrice">
                {priceRanges.map((range) => (
                  <li key={range.label}>
                    <button
                      className="dropdown-item"
                      onClick={() => setSelectedPriceRange(range.label)}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
                {selectedPriceRange && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setSelectedPriceRange("")}
                      >
                        Clear Price Filter
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>

            {/* Categories Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                data-bs-toggle="dropdown"
                id="DropdownCategory"
                aria-expanded="false"
              >
                {selectedCategory || "Categories"}
              </button>
              <ul className="dropdown-menu" aria-labelledby="DropdownCategory">
                {categories.map((category) => (
                  <li key={category}>
                    <button
                      className="dropdown-item"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </button>
                  </li>
                ))}
                {selectedCategory && (
                  <>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => setSelectedCategory("")}
                      >
                        Clear Category Filter
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </li>

            {/* Clear All Filters */}
            {(selectedCategory || selectedPriceRange) && (
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedPriceRange("");
                  }}
                >
                  Clear All Filters
                </button>
              </li>
            )}
          </ul>

          {/* Create Listing Button */}
          <button
            type="button"
            className="btn btn-light"
            data-bs-toggle="modal"
            data-bs-target="#addListingModal"
          >
            Create Listing
          </button>
        </div>
      </nav>

      {/* Display filtered listings */}
      <div className="homepage-listings">
        <div className="homepage-listings-grid">
          {filteredListings.map((item) => (
            <div key={item.id} className="homepage-listing">
              <div className="homepage-listing-image"></div>

              {/* button for product title, upon click will redirects user to the specific product's page*/}
              <button
                type="button"
                className="btn btn-light"
                onClick={() => handleProductClick(item.id)}
              >
                <div className="homepage-listing-title">{item.title}</div>
              </button>

              <div className="homepage-listing-price">${item.price}</div>
              <div className="homepage-listing-category">{item.category}</div>
              <div className="homepage-listing-description">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="addListingModal"
        tabIndex={-1}
        aria-labelledby="addListingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header border-0">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <ListItemPopup onSubmit={closeModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
