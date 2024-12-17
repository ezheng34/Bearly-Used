import React, { useEffect, useState } from "react";
import ListItemPopup from "./ListItemPopup";
import { Modal } from "bootstrap";
import "../styles/HomePage.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { useUser } from "@clerk/clerk-react";
import mockProducts from "../data/product";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useNavigate,
} from "react-router-dom";

type Listing = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  image_url: string;
  tags: string[];
  available: boolean;
};

const ITEMS_PER_PAGE = 8; // TODO change later

type SortOrder = "" | "PRICE_ASC" | "PRICE_DESC";

//actual backend types
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

// price interface
interface Price {
  label: string | null;
  min: number | null;
  max: number | null;
}

const HomePage: React.FC = () => {
  const { user } = useUser();

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get("category") || ""
  );
  const [selectedPrice, setSelectedPrice] = useState<Price | null>(
    searchParams.get("priceLabel")
      ? {
          label: searchParams.get("priceLabel"),
          min: searchParams.get("priceMin")
            ? Number(searchParams.get("priceMin"))
            : null,
          max: searchParams.get("priceMax")
            ? Number(searchParams.get("priceMax"))
            : null,
        }
      : null
  );

  const [allListings, setAllListings] = useState<ListingItem[]>([]);
  const [filteredListings, setFilteredListings] = useState<ListingItem[]>([]);

  const [priceSort, setPriceSort] = useState<SortOrder>(
    (searchParams.get("priceSort") as SortOrder) || ""
  );
  const [currentPage, setCurrentPage] = useState(
    Number(searchParams.get("page")) || 1
  );

  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("search") || ""
  );
  const [tempSearchQuery, setTempSearchQuery] = useState<string>("");

  // Trigger the search when Enter is pressed
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      setSearchQuery(tempSearchQuery);
    }
  };

  // -------------------------USED FOR MOCK DATA------------------------------------
  // const [filteredListings, setFilteredListings] = useState<ListingItem[]>(
  //   mockProducts.mockProducts
  // );
  // -------------------------USED FOR MOCK DATA------------------------------------

  const categories = [
    "Electronics",
    "Furniture",
    "Appliances",
    "Clothing & Accessories",
    "Books",
    "Decor",
    "Tickets & Event Passes",
    "Other",
  ];

  const priceRanges = [
    { label: "Free", min: 0, max: 0 },
    { label: "Less than $5", min: 0.01, max: 5 },
    { label: "$5 - $10", min: 5, max: 10 },
    { label: "$10 - $20", min: 10, max: 20 },
    { label: "$20 - $30", min: 20, max: 30 },
    { label: "$30+", min: 30, max: null },
  ];

  // Calculate total pages
  const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);

  // Get current page items
  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    return filteredListings.slice(indexOfFirstItem, indexOfLastItem);
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top of the page
    window.scrollTo(0, 0);
  };

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

  // filter listings based on selected category and price range + search functionality
  useEffect(() => {
    const fetchAndFilterListings = async () => {
      const params = new URLSearchParams();
      let apiUrl = "http://localhost:3232/get-listings?";

      if (selectedCategory) {
        params.set("category", selectedCategory);
        apiUrl += `category=${selectedCategory}&`;
      }

      if (selectedPrice) {
        const { label, min, max } = selectedPrice;

        // Handle the "Free" case explicitly
        if (label === "Free") {
          // If it's "Free", we only want listings with price 0
          params.set("priceMin", "0");
          params.set("priceMax", "0");
          apiUrl += `minPrice=0&maxPrice=0&`;
        } else {
          params.set("priceLabel", selectedPrice.label || "");
          if (selectedPrice.min) {
            params.set("priceMin", selectedPrice.min.toString());
            apiUrl += `minPrice=${selectedPrice.min}&`;
          }
          if (selectedPrice.max) {
            params.set("priceMax", selectedPrice.max.toString());
            apiUrl += `maxPrice=${selectedPrice.max}&`;
          }
        }
      }

      if (priceSort) {
        params.set("priceSort", priceSort);
        apiUrl += `sorter=${priceSort}&`;
      }

      params.set("page", currentPage.toString());

      if (searchQuery) {
        params.set("search", searchQuery);
        apiUrl += `title=${searchQuery}&`;
      }

      setSearchParams(params);

      console.log("API URL:", apiUrl);

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        console.log(data);
        if (data.response_type === "success") {
          let filtered = data.result;
          setFilteredListings(filtered);
        } else {
          console.error("Error fetching listings");
        }
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchAndFilterListings();
  }, [selectedCategory, selectedPrice, priceSort, currentPage, searchQuery]);

  // -------------------------USED FOR MOCK DATA------------------------------------

  /* 
  // THIS IS WHAT THE OLD FILTER WAS BEFORE I CHANGED IT -JULIE 
      let filteredListings = allListings;

    if (selectedCategory) {
      filteredListings = filteredListings.filter(
        (item) => item.category === selectedCategory
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = priceRanges.find((r) => r.label === selectedPriceRange);
      if (range) {
        filteredListings = filteredListings.filter((item) => {
          if (range.max === null) return item.price >= range.min;
          return item.price >= range.min && item.price <= range.max;
        });
      }
    }

    // Price sorting
    if (priceSort !== "none") {
      filteredListings = [...filteredListings].sort((a, b) => {
        if (priceSort === "asc") {
          return a.price - b.price;
        } else {
          return b.price - a.price;
        }
      });
    }

    setFilteredListings(filteredListings);
    setCurrentPage(1); // resert to first page when filters/sort change
  */

  // useEffect(() => {
  //   let filtered = mockProducts.mockProducts;

  //   if (selectedCategory) {
  //     filtered = filtered.filter((item) => item.category === selectedCategory);
  //   }

  //   // Price range filter
  //   if (selectedPrice) {
  //     const range = priceRanges.find((r) => r === selectedPrice);
  //     if (range) {
  //       filtered = filtered.filter((item) => {
  //         if (range.max === null) return item.price >= range.min;
  //         return item.price >= range.min && item.price <= range.max;
  //       });
  //     }
  //   }

  //   // Price sorting
  //   if (priceSort !== "") {
  //     filtered = [...filtered].sort((a, b) => {
  //       if (priceSort === "PRICE_ASC") {
  //         return a.price - b.price;
  //       } else {
  //         return b.price - a.price;
  //       }
  //     });
  //   }

  //   setFilteredListings(filtered);
  //   setCurrentPage(1); // resert to first page when filters/sort change
  // }, [selectedCategory, selectedPrice, priceSort]);

  // -------------------------USED FOR MOCK DATA------------------------------------

  // prices dropdown with sorting options
  const renderPricesDropdown = () => (
    <li className="nav-item dropdown">
      <button
        className="nav-link dropdown-toggle"
        data-bs-toggle="dropdown"
        id="DropdownPrice"
        aria-expanded="false"
      >
        {selectedPrice ? `Price: ${selectedPrice.label}` : "Price"}
      </button>
      <ul className="dropdown-menu" aria-labelledby="DropdownPrice">
        <li>
          <h6 className="dropdown-header">Price Range</h6>
        </li>
        {priceRanges.map((range) => (
          <li key={range.label}>
            <button
              className="dropdown-item"
              onClick={() => {
                setCurrentPage(1), setSelectedPrice(range);
              }}
            >
              {range.label}
            </button>
          </li>
        ))}

        <li>
          <hr className="dropdown-divider" />
        </li>

        <li>
          <h6 className="dropdown-header">Sort by Price</h6>
        </li>
        <li>
          <button
            className={`dropdown-item ${
              priceSort === "PRICE_ASC" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentPage(1), setPriceSort("PRICE_ASC");
            }}
          >
            <i className="bi bi-arrow-up"></i> Low to High
          </button>
        </li>
        <li>
          <button
            className={`dropdown-item ${
              priceSort === "PRICE_DESC" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentPage(1), setPriceSort("PRICE_DESC");
            }}
          >
            <i className="bi bi-arrow-down"></i> High to Low
          </button>
        </li>

        {(selectedPrice || priceSort !== "") && (
          <>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => {
                  setSelectedPrice(null);
                  setPriceSort("");
                  setCurrentPage(1);
                }}
              >
                Clear Price Filters
              </button>
            </li>
          </>
        )}
      </ul>
    </li>
  );

  // Initialize modal
  useEffect(() => {
    const modalElement = document.getElementById("addListingModal");
    if (modalElement) {
      new Modal(modalElement);
    }
  }, []);

  const closeModal = () => {
    const modalElement = document.getElementById("addListingModal");
    if (modalElement) {
      const modalInstance = Modal.getInstance(modalElement);
      if (modalInstance) {
        modalInstance.dispose(); // erm idk if this actually is good
      }

      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
      document.body.style.overflow = "initial";

      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());
    }
  };

  //redirects user to product page via different url based on id of product
  const handleProductClick = (id: number) => {
    navigate(`/product/${id}?${searchParams.toString()}`);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <ul className="navbar-nav">
            {/* Prices Dropdown */}
            {renderPricesDropdown()}

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
            {(selectedCategory || selectedPrice) && (
              <li className="nav-item">
                <button
                  className="nav-link"
                  onClick={() => {
                    setSelectedCategory("");
                    setSelectedPrice(null);
                  }}
                >
                  Clear All Filters
                </button>
              </li>
            )}
          </ul>

          {/* Search */}
          <div className="search-bar mx-4">
            <input
              type="text"
              placeholder="Search listings..."
              value={tempSearchQuery}
              onChange={(e) => setTempSearchQuery(e.target.value)}
              className="form-control"
              onKeyDown={handleKeyDown}
            />
            <button
              type="button"
              className="search-btn"
              onClick={() => {
                setCurrentPage(1), setSearchQuery(tempSearchQuery);
              }}
            >
              🔍
            </button>
            {searchQuery && (
              <button
                type="button"
                className="nav-link"
                onClick={() => {
                  navigate("/"), setSearchQuery(""), setTempSearchQuery("");
                }}
                aria-label="Clear search"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Create Listing Button */}
          <button
            type="button"
            className="create-listing"
            data-bs-toggle="modal"
            data-bs-target="#addListingModal"
            font-family="DM Sans"
          >
            Create Listing
          </button>
        </div>
      </nav>

      {/* Display filtered listings */}
      <div className="homepage-listings">
        {filteredListings.length > 0 ? (
          <div className="homepage-listings-grid">
            {getCurrentItems().map((item) => (
              <div
                key={item.id}
                className="homepage-listing cursor-pointer"
                onClick={() => handleProductClick(item.id)}
                style={{ cursor: "pointer" }}
              >
                <div className="homepage-listing-image">
                  {/* <img
                    src={item.images[0]} //used when mock
                    className="img-fluid rounded mb-3 product-image"
                    alt={item.title}
                  /> */}
                  <img
                    src={item.image_url}
                    className="img-fluid rounded mb-3 product-image"
                    alt="Product"
                  />
                </div>
                <div className="homepage-listing-title">{item.title}</div>
                <div className="homepage-listing-price">${item.price}</div>
                <div className="homepage-listing-category">{item.category}</div>
                <div className="homepage-listing-description">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-items-found">
            <i className="bi bi-search"></i>
            <h3>No Items Found</h3>
            <p>Try adjusting your filters or search terms!</p>
          </div>
        )}
      </div>

      {/* only show pagination if there are items */}
      {filteredListings.length > 0 && (
        <nav aria-label="Product pages" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {getPageNumbers().map((number) => (
              <li
                key={number}
                className={`page-item ${
                  currentPage === number ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(number)}
                >
                  {number}
                </button>
              </li>
            ))}

            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Add Modal markup */}
      <div
        className="modal fade"
        id="addListingModal"
        tabIndex={-1}
        aria-labelledby="addListingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{
                fontSize: "0.75rem",
                margin: "0.5rem",
                padding: "0.25rem",
              }}
            ></button>

            <div className="modal-body">
              <ListItemPopup
                onSubmit={() => {
                  closeModal();
                  // Refresh listings after submission
                  const fetchListings = async () => {
                    try {
                      const response = await fetch(
                        "http://localhost:3232/get-listings"
                      );
                      const data = await response.json();
                      if (data.response_type === "success") {
                        setAllListings(data.result);
                        setFilteredListings(data.result);
                      }
                    } catch (err) {
                      console.error("Error fetching listings");
                    }
                  };
                  fetchListings();
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
