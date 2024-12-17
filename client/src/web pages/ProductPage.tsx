import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import mockProducts from "../data/product";
import ListItemPopup from "./ListItemPopup";
import "../styles/ProductPage.css";
import { Modal } from "bootstrap";
import { getUserListings, getUserProfile, updateUserProfile } from "../api";
import { useUser } from "@clerk/clerk-react";
import { supabase } from "../utils/supabaseClient";

type UserProfile = {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
  phone_number: string;
  school: string;
  tags: string[];
};

type Listing = {
  id: number;
  seller_id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  condition: string;
  image_url: string;
  tags: string[];
  available: boolean;
};

interface Seller {
  clerk_id: string;
  id: number;
  name: string;
  email: string;
  phone_number: string;
  school: string;
}

const ProductPage: React.FC = () => {
  const { user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();
  // -------------------------USED FOR MOCK DATA------------------------------------
  // const product = mockProducts.mockProducts.find((p) => p.id === Number(id));
  // const [mainImage, setMainImage] = useState(product?.images[0]);
  // -------------------------USED FOR MOCK DATA------------------------------------

  const [product, setProduct] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [mainImage, setMainImage] = useState<string>("");

  const handleViewProfile = (sellerId: string) => {
    navigate(`/seller/${sellerId}`);
  };

  const handleBack = () => {
    navigate(-1); // Goes back to previous page
  };

  const copyEmail = () => {
    if (seller?.email) {
      navigator.clipboard.writeText(seller.email).then(() => {
        alert("Email copied to clipboard!"); // Could be replaced with a nicer toast notification
      });
    }
  };

  const copyEmailTemplate = () => {
    const template = `Hi,
  
  I'm interested in buying your item: ${product?.title} for $${product?.price}.
  
  Best regards,
  [Your Name]`;

    navigator.clipboard.writeText(template).then(() => {
      // Show success message
      alert("Email template copied to clipboard!");
    });
  };

  // Fetch the product data based on the ID
  useEffect(() => {
    console.log("Listing ID:", id);
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3232/get-listing-by-id?listing_id=${id}`
        );
        const data = await response.json();
        console.log("Fetched listing data:", data);

        if (data.response_type === "success") {
          const fetchedProduct = data.listing;
          setProduct({ ...fetchedProduct });
          setMainImage(fetchedProduct.image_url);
        } else {
          console.error("Error fetching product data");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetches the seller
  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(
          `http://localhost:3232/get-user?clerk_id=${product?.seller_id}`
        );
        const data = await response.json();
        console.log("Fetched user:", data);
        setSeller({ ...data.user_data });
        console.log("new seller", seller);
        if (data.response_type === "success") {
        } else {
          console.error("Error fetching seller data");
        }
      } catch (err) {
        console.error("Error fetching seller:", err);
      }
    };
    if (product) {
      fetchSeller();
    }
  }, [product]);

  // delete listing
  const handleDeleteListing = async () => {
    try {
      // delete the image from storage first
      if (product?.image_url) {
        const { error } = await supabase.storage
          .from("images")
          .remove([product.image_url]);
        if (error) {
          console.error("Error removing image from storage", error.message);
          return;
        }
      }

      const response = await fetch(
        `http://localhost:3232/delete-listing?listing_id=${id}`
      );
      const data = await response.json();
      if (data.response_type === "success") {
        alert("Listing successfully deleted.");
        navigate("/");
      } else {
        alert("Failed to delete the listing.");
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      alert("An error occurred while trying to delete the listing.");
    }
  };

  const [editingListing, setEditingListing] = useState<Listing | null>(null);

  const handleEditListing = (listing: Listing | null) => {
    const initialData = {
      title: listing?.title,
      available: listing?.available,
      description: listing?.description,
      price: listing?.price,
      category: listing?.category,
      condition: listing?.condition,
      imageUrl: listing?.image_url,
      tags: listing?.tags,
      images: [], // TODO figure out how to handle existing images
    };
    setEditingListing(listing);
  };

  const handleMarkAsSold = async () => {
    try {
      const response = await fetch(
        `http://localhost:3232/update-listing?listing_id=${id}&available=false`
      );
      const data = await response.json();
      console.log("bbbb", data);
      if (data.response_type === "success") {
        alert("Listing successfully marked as unavailable.");
        navigate("/");
      } else {
        alert("Failed to mark as sold.");
      }
    } catch (error) {
      console.error("Error marking as sold:", error);
      alert("An error occurred while trying to mark the listing as sold");
    }
  };

  useEffect(() => {
    const modalElement = document.getElementById("editListingModal");
    if (modalElement) {
      new Modal(modalElement);
    }
  }, []);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  return (
    <div className="product-page">
      <div className="header">
        <button onClick={handleBack} className="back-link">
          <svg
            className="back-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>

      <div className="product-container">
        <div className="row">
          {/* Product Images */}
          <div className="col-md-6">
            <div className="main-image-container">
              <img
                src={mainImage}
                alt={product?.title}
                className="product-image"
              />
            </div>
            {/* DONT DELETE the commented out stuff pls! Will eventually integrate this back in */}
            {/* <div className="thumbnail-container">
              <div className="d-flex gap-3">
                {product?.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product?.title} view ${index + 1}`}
                    className={`thumbnail ${
                      mainImage === image ? "active" : ""
                    }`}
                    onClick={() => setMainImage(image)}
                  />
                ))}
              </div>
            </div> */}
          </div>

          {/* Product Info */}
          <div className="col-md-6 product-info">
            <h1 className="product-title">{product?.title}</h1>
            <div className="product-price">${product?.price}</div>
            <div className="tag-container">
              {product?.tags.map((tag, index) => (
                <span key="tag" className="badge bg-secondary me-2">
                  {tag}
                </span>
              ))}
            </div>
            <p className="product-description">{product?.description}</p>

            {/* Seller Information Section */}
            <div className="seller-info-section">
              <h3>Seller Information</h3>
              <div className="seller-details">
                <div className="seller-detail">
                  <i className="bi bi-person"></i>
                  <span>{seller?.name || "Anonymous"}</span>
                </div>
                <div className="seller-detail">
                  <i className="bi bi-building"></i>
                  <span>{seller?.school || "Unknown School"}</span>
                </div>
                <div className="seller-detail">
                  <i className="bi bi-envelope"></i>
                  <span>{seller?.email || "No email provided"}</span>
                  <button
                    className="copy-email-btn"
                    onClick={copyEmail}
                    title="Copy email address"
                  >
                    <i className="bi bi-clipboard"></i>
                  </button>
                </div>
                <button
                  className="view-profile-btn"
                  onClick={() =>
                    seller?.clerk_id && handleViewProfile(seller.clerk_id)
                  }
                >
                  View Full Profile
                </button>
              </div>
            </div>

            {seller?.clerk_id === user?.id ? (
              <div className="action-buttons">
                <button
                  className="btn btn-danger"
                  onClick={handleDeleteListing}
                >
                  Delete listing
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleMarkAsSold()}
                >
                  Mark as sold
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEditListing(product)}
                >
                  Edit
                </button>
              </div>
            ) : (
              <div className="action-buttons">
                <button className="btn btn-primary" onClick={copyEmailTemplate}>
                  <i className="bi bi-clipboard"></i> Copy Email Template
                </button>
              </div>
            )}
          </div>

          {/* ListItemPopup to Edit Listing */}
          {editingListing && (
            <div
              className="modal fade show"
              style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">
                  <button
                    type="button"
                    className="btn-close"
                    style={{
                      fontSize: "0.75rem",
                      padding: "0.25rem",
                    }}
                    onClick={() => {
                      setEditingListing(null);
                      document.body.style.overflow = "auto";
                    }}
                  ></button>
                  <div className="modal-body">
                    <ListItemPopup
                      isEditing={true}
                      initialData={{
                        sellerId: userProfile?.id || 1,
                        title: product?.title || "Product title",
                        available: product?.available || true,
                        description: product?.description || "desciption",
                        price: product?.price || 0,
                        category: product?.category || "category",
                        condition: product?.condition || "condition",
                        imageUrl: product?.image_url || "",
                        tags: product?.tags || [],
                        images: [],
                      }}
                      editId={product?.id}
                      onSubmit={() => {
                        setEditingListing(null);
                        getUserListings(userProfile?.clerk_id || "1");
                        document.body.style.overflow = "auto";
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
