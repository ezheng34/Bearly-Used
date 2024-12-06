import React, { useState } from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../data/product";
import "../styles/ProductPage.css";

const ProductPage: React.FC = () => {
  const { id } = useParams(); //get id from url
  const product = mockProducts.mockProducts.find((p) => p.id === Number(id));

  const [mainImage, setMainImage] = useState(product.images[0]);
  // Update main image to the clicked thumbnail's image
  const changeImage = (src: string) => {
    setMainImage(src);
  };

  return (
    <div className="product-page">
      <div className="container mt-5">
        <div className="row">
          {/* Product Images */}
          <div className="col-md-6 mb-4">
            <img
              src={mainImage}
              alt="Product Image"
              className="img-fluid rounded mb-3 product-image"
              id="mainImage"
            />

            {/* Thumbnails */}
            <div className="thumbnail-container">
              <div className="d-flex justify-content-start">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail rounded me-2"
                    onClick={() => changeImage(image)} // Update main image when clicked
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product info (subject to change) */}
          <div className="col-md-6">
            <h2 className="mb-3">{product.title}</h2>
            <div className="mb-3">
              <span className="h4 me-2">{product.price}</span>
            </div>
            <p className="mb-4">{product.description}</p>
            <button className="btn btn-primary btn-lg mb-3 me-2">
              <i className="bi bi-cart-plus"></i> Add to Cart
            </button>
            <button className="btn btn-primary btn-lg mb-3 me-2">
              <i className="bi bi-cart-plus"></i> Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
