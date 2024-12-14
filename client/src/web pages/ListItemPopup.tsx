import React, { useState, useEffect } from "react";
import "../styles/ListItemPopup.css";

interface ListingForm {
  sellerId: number;
  title: string;
  available: boolean;
  description: string;
  price: number;
  category: string;
  condition: string;
  imageUrl: string;
  tags: string[];
  images: File[];
}

interface ListItemPopupProps {
  onSubmit?: () => void;
  isEditing?: boolean;
  initialData?: ListingForm;
  editId?: number;
}

const ListItemPopup: React.FC<ListItemPopupProps> = ({
  onSubmit,
  isEditing = false,
  initialData,
  editId,
}) => {
  const [formData, setFormData] = useState<ListingForm>(
    initialData || {
      sellerId: 0,
      title: "",
      available: true,
      description: "",
      price: 0,
      category: "",
      condition: "",
      imageUrl: "",
      tags: [],
      images: [],
    }
  );

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [priceInput, setPriceInput] = useState("");

  const categories = ["Electronics", "Clothing", "Books", "Sports", "Other"];
  const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      // Also set the price input
      setPriceInput(initialData.price.toString());
    }
  }, [initialData]);

  useEffect(() => {
    const objectUrls = formData.images.map((image) =>
      URL.createObjectURL(image)
    );
    setImagePreviews(objectUrls);

    if (formData.images.length > 0) {
      const firstImageUrl = objectUrls[0];
      setFormData((prev) => ({
        ...prev,
        imageUrl: firstImageUrl,
      }));
    }
    return () => {
      objectUrls.forEach(URL.revokeObjectURL);
    };
  }, [formData.images]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.type === "number"
        ? parseFloat(e.target.value)
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim()],
        });
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: [...formData.images, ...Array.from(e.target.files)],
      });
    }
  };

  const removeImage = (index: number) => {
    // Revoke the specific object URL before removing the image
    if (imagePreviews[index]) {
      URL.revokeObjectURL(imagePreviews[index]);
    }

    // Remove image from both formData and previews
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const backendData = {
      seller_id: 1,
      title: formData.title,
      available: formData.available,
      description: formData.description,
      price: formData.price,
      category: formData.category,
      condition: formData.condition,
      imageUrl: formData.imageUrl,
      tags: formData.tags,
    };
    console.log("Ready for backend:", backendData);
    try {
      const baseUrl = isEditing
        ? `http://localhost:3232/update-listing`
        : "http://localhost:3232/add-listing";
      // Add listing_id to query params when editing
      const queryParams = new URLSearchParams({
        seller_id: "1",
        title: backendData.title,
        available: backendData.available.toString(),
        description: backendData.description,
        price: backendData.price.toString(),
        category: backendData.category,
        condition: backendData.condition,
        image_url: backendData.imageUrl,
        tags: backendData.tags.join(","),
      });

      // Add listing_id only when editing
      if (isEditing && editId) {
        queryParams.append("listing_id", editId.toString());
      }

      const response = await fetch(`${baseUrl}?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(
          isEditing ? "Failed to update listing" : "Failed to add listing"
        );
      }

      const result = await response.json();
      console.log(
        isEditing
          ? "Listing updated successfully:"
          : "Listing added successfully:",
        result
      );

      // dont think we need this
      // const modalElement = document.getElementById("addListingModal");
      // if (modalElement) {
      //   // hide modal stuff TODO this might be a duplicate
      //   modalElement.classList.remove("show");
      //   modalElement.style.display = "none";
      //   modalElement.setAttribute("aria-hidden", "true");

      //   const backdrops = document.querySelectorAll(".modal-backdrop");
      //   backdrops.forEach((backdrop) => backdrop.remove());

      //   document.body.classList.remove("modal-open");
      //   document.body.style.removeProperty("padding-right");
      //   document.body.style.removeProperty("overflow");
      //   document.body.style.removeProperty("height");
      // }

      onSubmit?.();
    } catch (error) {
      console.error(
        isEditing ? "Error updating listing:" : "Error adding listing:",
        error
      );
    }
  };

  return (
    <div>
      <h2 className="text-center mb-4">
        {isEditing ? "Edit Listing" : "Add Listing"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          {/* TODO we might need this later to edit ?? but idk prob not 
          <div className="form-check">
            <input
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="form-check-input"
              id="availableCheck"
            />
            <label className="form-check-label" htmlFor="availableCheck">
              Available for Purchase
            </label>
          </div> */}
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control"
            rows={4}
            required
          />
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Price</label>

            <input
              type="text"
              name="price"
              value={priceInput}
              onChange={(e) => {
                const value = e.target.value;
                // got regex thingy from Claude
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setPriceInput(value);
                  setFormData({
                    ...formData,
                    price: value === "" ? 0 : parseFloat(value),
                  });
                }
              }}
              className="form-control"
              placeholder="0.00"
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="form-control"
              required
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Condition</label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleInputChange}
            className="form-control"
            required
          >
            <option value="">Select condition</option>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tags</label>
          <div className="tag-container">
            {formData.tags.map((tag) => (
              <span key={tag} className="badge bg-secondary me-2">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="btn-close btn-close-white ms-2"
                  aria-label="Remove tag"
                />
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            className="form-control"
            placeholder="Type and press Enter to add tags"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="form-control"
            required
          />
          <div className="image-preview-container d-flex flex-wrap gap-2 mt-2">
            {imagePreviews.map((imageUrl, index) => (
              <div key={index} className="position-relative">
                <img
                  src={imageUrl}
                  alt={`Upload ${index + 1}`}
                  className="img-thumbnail"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="btn-close position-absolute top-0 end-0 bg-light"
                  aria-label="Remove image"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn btn-secondary w-100">
          {isEditing ? "Save changes" : "Create listing"}
        </button>
      </form>
    </div>
  );
};

export default ListItemPopup;
