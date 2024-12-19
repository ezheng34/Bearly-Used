import React, { useState, useEffect } from "react";

type UserProfile = {
  id: number;
  clerk_id: string;
  name: string;
  email: string;
  phone_number: string;
  school: string;
  tags: string[];
};

interface EditProfileProps {
  initialData: UserProfile | null;
  onSubmit: (updatedProfile: UserProfile) => void;
}

/**
 * Renders a modal to allow the user to edit their personal information (name, school, phone number).
 * 
 * @returns {JSX.Element} A JSX element representing an Edit User Profile modal.
 */
const EditProfilePopup: React.FC<EditProfileProps> = ({
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<UserProfile | null>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [name, setName] = useState(formData?.name || "");
  const [school, setSchool] = useState(formData?.school || "");
  const [phone_number, setPhoneNumber] = useState(formData?.phone_number || "");

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  //handles edits made
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    formData
      ? setFormData({
          ...formData,
          [name]: value,
        })
      : null;

    if (name === "school") {
      setSchool(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "phone_number") {
      setPhoneNumber(value);
    }
  };

  //handles submission of edits made 
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    formData ? onSubmit(formData) : null;
    setIsSubmitting(false);
  };

  return (
    <div>
      <h2 className="text-center mb-4">Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Editing Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={handleInputChange}
            className="form-control"
            required
          />
        </div>

        {/* Editing School */}
        <div className="mb-3">
          <label htmlFor="school" className="form-label">
            School
          </label>
          <select
            id="school"
            name="school"
            value={school}
            onChange={(e) => handleInputChange(e)}
            className="form-control"
            required
          >
            <option value="">Select a school</option>
            <option value="Brown">Brown</option>
            <option value="RISD">RISD</option>
          </select>
        </div>

        {/* Editing Phone Number */}
        <div className="mb-3">
          <label htmlFor="phone_number" className="form-label">
            Phone Number
          </label>
          <input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={phone_number}
            onChange={handleInputChange}
            className="form-control"
            placeholder="123-456-7890"
            pattern="^\d{3}-\d{3}-\d{4}$"
            required
          />
        </div>

        {/* Submit Changes */}
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProfilePopup;
