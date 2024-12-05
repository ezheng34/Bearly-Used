import React, { useState } from "react";
import { useParams } from "react-router-dom";

//probably need some sort of interface for real data maybe?
interface ProductPagePopupProps {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
}


const ProductPage: React.FC = () => {
    
    //hardcoded in images for now
    //need to replace with user uploaded images (need to make upload button for that)
    const [mainImage, setMainImage] = useState(
      "https://m.media-amazon.com/images/I/71ZOtNdaZCL.jpg"
    );
   
    const additionalImages = [
      "https://i.ytimg.com/vi/YH_DCqAmtxQ/maxresdefault.jpg",
      "https://m.media-amazon.com/images/I/71ZOtNdaZCL.jpg",
    ];

    const changeImage = (src: string) => {
        setMainImage(src); // Update main image to the clicked thumbnail's image
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
              <div className="d-flex justify-content-start">
                {additionalImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="thumbnail rounded me-2"
                    onClick={() => changeImage(image)} // Update main image when clicked
                    style={{ cursor: "pointer", width: "60px", height: "60px" }} // Styling for thumbnails
                  />
                ))}
              </div>
            </div>

            {/* Product info (subject to change) */}
            <div className="col-md-6">
              <h2 className="mb-3">iPhone 12</h2>
              <div className="mb-3">
                <span className="h4 me-2">$400.00</span>
              </div>
              <p className="mb-4">
                Hardly used, has a screen protector already, no case.
              </p>
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
