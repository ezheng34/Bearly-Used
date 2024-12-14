import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/UserProfile.css"; // Can reuse the same styles

type Listing = {
  id: number;
  title: string;
  price: number;
};

type SellerProfile = {
  id: number;
  name: string;
  school: string;
  rating: number;
  email: string;
  soldListings: Listing[];
};

const SellerProfile: React.FC = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [listingsPage, setListingsPage] = useState(0);
  const ITEMS_PER_PAGE = 4;

  // TODO placeholder seller data - replace with actual API call
  const [seller, setSeller] = useState<SellerProfile>({
    id: 1,
    name: "Bob Smith",
    school: "Brown University",
    rating: 4.5,
    email: "bob_smith@brown.edu",
    soldListings: [
      {
        id: 101,
        title: "old textbook",
        price: 25,
      },
      {
        id: 102,
        title: "broken lamp",
        price: 5,
      },
      // ... more sold items
    ],
    // replace with actual sold listings
  });

  // same pagination logic as UserProfile
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

  const visibleListings = paginate(seller.soldListings, listingsPage);

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
      </div>

      <div className="profile-container">
        <div className="profile">
          <div className="profile-picture"></div>
          <div className="profile-info">
            <h2 className="name">{seller.name}</h2>
            <p className="school">School: {seller.school}</p>
            <p className="email">Email: {seller.email} 💌 </p>

            <p className="rating">Rating: {seller.rating} ⭐</p>
            {/*TODO ADD OTHER INFO HERE!!! INTEGRATE!!*/}
          </div>
        </div>
      </div>

      <h2>Previously Sold Items</h2>
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
              <p className="listing-price">${listing.price.toFixed(2)}</p>
              <p className="listing-name">{listing.title}</p>
            </div>
          ))}
        </div>
        <button
          className="arrow-btn"
          onClick={() =>
            handleNextPage(listingsPage, setListingsPage, seller.soldListings)
          }
          disabled={
            (listingsPage + 1) * ITEMS_PER_PAGE >= seller.soldListings.length
          }
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default SellerProfile;
