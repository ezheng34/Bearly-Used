import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import mockProducts from "../data/product";
import "../styles/ProductPage.css";

const ProductPage: React.FC = () => {
  const { id } = useParams();

  // -------------------------USED FOR MOCK DATA------------------------------------
  // const product = mockProducts.mockProducts.find((p) => p.id === Number(id));
  // const [mainImage, setMainImage] = useState(product?.images[0]);
  // -------------------------USED FOR MOCK DATA------------------------------------

  const [product, setProduct] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");

  // Fetch the product data based on the ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3232/get-listing-by-id?listing_id=${id}` //NOT FUNCTIONAL YET
        );
        const data = await response.json();
        console.log("Fetched data:", data);

        if (data.response_type === "success") {
          // const fetchedProduct = data.result[0];
          const fetchedProduct = data.listing;
          console.log("Fetched product data:", fetchedProduct);
          console.log("Fetched product image_url:", fetchedProduct.image_url);
          // setProduct(fetchedProduct);
          // setMainImage(fetchedProduct.image_url);
          
          setProduct({ ...fetchedProduct });
          setMainImage(fetchedProduct.image_url);
          console.log("url", fetchedProduct.image_url);
        } else {
          console.error("Error fetching product data");
        }
      } catch (err) {
        console.error("Error fetching product data:", err);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

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

{/* DONT DELETE the commented out stuff pls! Will eventually integrate this back in */}
            {/* <div className="thumbnail-container">
              <div className="d-flex gap-3">
                {product?.images.map((image: string, index: number) => (
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
            <p className="product-description">{product?.description}</p>

            {/* <div className="tags-container">
              {product.tags && product.tags.length > 0 ? (
                product.tags.map((tag: string, index: number) => (
                  <span key={index} className="tag">
                    {tag}
                  </span>
                ))
              ) : (
                <span>No tags available</span>
              )}
            </div> */}

            <div className="action-buttons">
              <button className="btn btn-primary">Buy Now</button>
              <button className="btn btn-secondary">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
