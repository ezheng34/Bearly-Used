import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import mockProducts from "../data/product";
import "../styles/ProductPage.css";
// Update the interface to include seller information
interface Seller {
  id: number;
  name: string;
  rating: number;
  school: string;
  email: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  images: string[];
  seller: Seller;
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.mockProducts.find((p) => p.id === Number(id));
  const [mainImage, setMainImage] = useState(product?.images[0]);

  const handleViewProfile = (sellerId: number) => {
    navigate(`/seller/${sellerId}`);
  };

  const handleBack = () => {
    navigate(-1); // Goes back to previous page
  };

  const copyEmail = () => {
    if (product?.seller?.email) {
      navigator.clipboard.writeText(product.seller.email).then(() => {
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

            <div className="thumbnail-container">
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
            </div>
          </div>

          {/* Product Info */}
          <div className="col-md-6 product-info">
            <h1 className="product-title">{product?.title}</h1>
            <div className="product-price">${product?.price}</div>
            <p className="product-description">{product?.description}</p>

            {/* Seller Information Section */}
            <div className="seller-info-section">
              <h3>Seller Information</h3>
              <div className="seller-details">
                <div className="seller-detail">
                  <i className="bi bi-person"></i>
                  <span>{product?.seller?.name || "Anonymous"}</span>
                </div>
                <div className="seller-detail">
                  <i className="bi bi-building"></i>
                  <span>{product?.seller?.school || "Unknown School"}</span>
                </div>
                <div className="seller-detail">
                  <i className="bi bi-envelope"></i>
                  <span>{product?.seller?.email || "No email provided"}</span>
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
                    product?.seller?.id && handleViewProfile(product.seller.id)
                  }
                >
                  View Full Profile
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn btn-primary" onClick={copyEmailTemplate}>
                <i className="bi bi-clipboard"></i> Copy Email Template
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

