import React, { useState } from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../data/product";
import "../styles/ProductPage.css";

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const product = mockProducts.mockProducts.find((p) => p.id === Number(id));
  const [mainImage, setMainImage] = useState(product?.images[0]);

  return (
    <div className="product-page">
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
                    className={`thumbnail ${mainImage === image ? 'active' : ''}`}
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
            
            <div className="action-buttons">
              <button className="btn btn-primary">
                Buy Now
              </button>
              <button className="btn btn-secondary">
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
