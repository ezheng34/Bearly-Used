import React, { useEffect, useState } from "react";
import ListItemPopup from "./ListItemPopup";
import { Modal } from "bootstrap";
import "../styles/HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import mockProducts from "../data/product";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

interface ListingItem {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  image_url: string;
  available: boolean;
  tags: string[];
}

const HomePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");

  const [allListings, setAllListings] = useState<ListingItem[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingItem[]>([]);
  
  // -------------------------USED FOR MOCK DATA------------------------------------
  // const [filteredListings, setFilteredListings] =
  //   useState<ListingItem[]>(mockProducts.mockProducts);
  // -------------------------USED FOR MOCK DATA------------------------------------

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

  //fetch all listings from backend
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await fetch("http://localhost:3232/get-listings");
        const data = await response.json();
        console.log(data);
        if (data.response_type === "success") {
          setAllListings(data.result);
          setFilteredListings(data.result);
        } else {
          console.error("Error fetching listings");
        }
      } catch (err) {
        console.error("Error fetching listings");
      }
    };

    fetchListings();
  }, []);

  //filter listings based on selected category and price range
  useEffect(() => {
    let filteredListings = allListings;

    if (selectedCategory) {
      filteredListings = filteredListings.filter(
        (item) => item.category === selectedCategory
      );
    }

    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        filteredListings = filteredListings.filter((item) => {
          if (range.max === null) return item.price >= range.min;
          return item.price >= range.min && item.price <= range.max;
        });
      }
    }

    setFilteredListings(filteredListings);
  }, [selectedCategory, selectedPriceRange]);

  // -------------------------USED FOR MOCK DATA------------------------------------
  // filter listings based on selected category and price range
  // useEffect(() => {
  //   let filtered = mockProducts.mockProducts;

  //   if (selectedCategory) {
  //     filtered = filtered.filter((item) => item.category === selectedCategory);
  //   }

  //   if (selectedPriceRange) {
  //     const range = priceRanges.find((r) => r.label === selectedPriceRange);
  //     if (range) {
  //       filtered = filtered.filter((item) => {
  //         if (range.max === null) return item.price >= range.min;
  //         return item.price >= range.min && item.price <= range.max;
  //       });
  //     }
  //   }

  //   setFilteredListings(filtered);
  // }, [selectedCategory, selectedPriceRange]);
  // -------------------------USED FOR MOCK DATA------------------------------------

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
      <nav className="navbar navbar-expand-lg">
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
              <div className="homepage-listing-image">
                {/* <img
                  // src={item.images[0]} //used when mock
                  src={item.image_url}
                  className="img-fluid rounded mb-3 product-image"
                /> */}
                <img
                  src={item.image_url}
                  className="img-fluid rounded mb-3 product-image"
                  alt="Product"
                />
              </div>

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
