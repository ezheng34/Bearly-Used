import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/UserProfile.css"; // Can reuse the same styles
import { useUser } from "@clerk/clerk-react";
import { getUserListings, getUserProfile } from "../api";

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

type SellerProfile = {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
  phone_number: string;
  school: string;
  tags: string[];
};

const SellerProfile: React.FC = () => {
  const { user } = useUser();
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [listingsPage, setListingsPage] = useState(0);
  const [listings, setListings] = useState<Listing[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(
    null
  );
  const ITEMS_PER_PAGE = 4;

  const fetchUserData = async (userId: string) => {
    try {
      const userData = await getUserProfile(userId);
      console.log("User data received:", userData);
      setSellerProfile(userData.user_data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchUserListings = async (userId: string) => {
    try {
      const listingsData = await getUserListings(userId);
      console.log("listing data", listingsData);
      setListings(listingsData.listings ? listingsData.listings : []);
    } catch (error) {
      console.error("Failed to fetch user listings:", error);
    }
  };

  useEffect(() => {
    const userId = sellerId || "";
    fetchUserData(userId);
    fetchUserListings(userId);
  }, []);

  // // TODO placeholder seller data - replace with actual API call
  // const [seller, setSeller] = useState<SellerProfile>({
  //   id: 1,
  //   name: "Bob Smith",
  //   school: "Brown University",
  //   rating: 4.5,
  //   email: "bob_smith@brown.edu",
  //   soldListings: [
  //     {
  //       id: 101,
  //       title: "old textbook",
  //       price: 25,
  //     },
  //     {
  //       id: 102,
  //       title: "broken lamp",
  //       price: 5,
  //     },
  //     // ... more sold items
  //   ],
  //   // replace with actual sold listings
  // });

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

  const visibleListings = paginate(listings, listingsPage);

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
            <h2 className="name">{sellerProfile?.name}</h2>
            <p className="school">School: {sellerProfile?.school} 🏫 </p>
            <p className="email">Email: {sellerProfile?.email} 💌 </p>
            <p className="phone number">
              Phone Number: {sellerProfile?.phone_number} 📞
            </p>
          </div>
        </div>
      </div>

      <h2>Listings</h2>
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
              {!listing.available && <div className="sold-badge">SOLD</div>}
              <img src={listing.image_url} className="listing-image" />
              <p className="listing-price">${listing.price.toFixed(2)}</p>
              <p className="listing-name">{listing.title}</p>
            </div>
          ))}
        </div>
        <button
          className="arrow-btn"
          onClick={() =>
            handleNextPage(listingsPage, setListingsPage, listings)
          }
          disabled={(listingsPage + 1) * ITEMS_PER_PAGE >= listings.length}
        >
          &#8594;
        </button>
      </div>
    </div>
  );
};

export default SellerProfile;
