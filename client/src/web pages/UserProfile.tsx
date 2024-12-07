import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/UserProfile.css";
import ListItemPopup from "./ListItemPopup";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

type Listing = {
  id: number;
  name: string;
  price: string;
};

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  // Dummy data for now idk the format
  const dummyListings: Listing[] = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    name: "Stand and Mirror",
    price: i % 2 === 0 ? "$19.99" : "Free",
  }));

  const [listingsPage, setListingsPage] = useState(0);
  const [boughtPage, setBoughtPage] = useState(0);

  const ITEMS_PER_PAGE = 6;

  // paginate for arrow press on listings/items bought prob have to separate later
  const paginate = (items: Listing[], page: number): Listing[] =>
    items.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const handleNextPage = (
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    items: Listing[]
  ) => {
    if ((page + 1) * ITEMS_PER_PAGE < items.length) setPage(page + 1);
  };

  const handlePrevPage = (
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (page > 0) setPage(page - 1);
  };

  const visibleListings = paginate(dummyListings, listingsPage);
  const visibleBought = paginate(dummyListings, boughtPage);

  const closeModal = () => {
    const modalElement = document.getElementById("addListingModal");
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      modal?.hide();

      modalElement.classList.remove("show");
      modalElement.style.display = "none";
      modalElement.setAttribute("aria-hidden", "true");

      const backdrops = document.querySelectorAll(".modal-backdrop");
      backdrops.forEach((backdrop) => backdrop.remove());

      document.body.classList.remove("modal-open");
      document.body.removeAttribute("style");
      document.body.style.overflow = "auto";
      document.body.style.overflowY = "auto";
    }
  };

  // Initialize modal
  useEffect(() => {
    const modalElement = document.getElementById("addListingModal");
    if (modalElement) {
      new Modal(modalElement);
    }
  }, []);

  return (
    <div className="user-profile-container">
      <div className="header">
        <Link to="/" className="back-link">
          <svg
            className="back-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <button
          className="create-listing"
          data-bs-toggle="modal"
          data-bs-target="#addListingModal"
        >
          Create Listing
        </button>
      </div>

      <div className="profile-container">
        <div className="profile">
          <div className="profile-picture"></div>
          <div className="profile-info">
            <h2 className="name">User123</h2>
            <p className="school">School: Brown</p>
            <p className="email">Email: user123@brown.edu</p>
            <p className="phone">Phone Number: (xxx) xxx-xxxx</p>
            <div className="tags">
              Interests:
              {["Tag1", "Tag2", "Tag3"].map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        <button className="edit-profile">Edit Profile</button>
      </div>

      <h2>Your Listings</h2>
      <div className="listings-navigation">
        <button
          className="arrow-btn"
          onClick={() => handlePrevPage(listingsPage, setListingsPage)}
          disabled={listingsPage === 0}
        >
          &#8592;
        </button>
        <div className="listings">
          {visibleListings.map((listing: Listing) => (
            <div key={listing.id} className="listing">
              <div className="listing-image"></div>
              <p className="listing-price">{listing.price}</p>
              <p className="listing-name">{listing.name}</p>
            </div>
          ))}
        </div>
        <button
          className="arrow-btn"
          onClick={() =>
            handleNextPage(listingsPage, setListingsPage, dummyListings)
          }
          disabled={(listingsPage + 1) * ITEMS_PER_PAGE >= dummyListings.length}
        >
          &#8594;
        </button>
      </div>

      <h2>Previously Bought</h2>
      <div className="listings-navigation">
        <button
          className="arrow-btn"
          onClick={() => handlePrevPage(boughtPage, setBoughtPage)}
          disabled={boughtPage === 0}
        >
          &#8592;
        </button>
        <div className="listings">
          {visibleBought.map((listing: Listing) => (
            <div key={listing.id + 12} className="listing">
              <div className="listing-image"></div>
              <p className="listing-price">{listing.price}</p>
              <p className="listing-name">{listing.name}</p>
            </div>
          ))}
        </div>
        <button
          className="arrow-btn"
          onClick={() =>
            handleNextPage(boughtPage, setBoughtPage, dummyListings)
          }
          disabled={(boughtPage + 1) * ITEMS_PER_PAGE >= dummyListings.length}
        >
          &#8594;
        </button>
      </div>

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

export default UserProfile;
