import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "../styles/SetupProfile.css"; // Can reuse the same styles
import { useUser } from "@clerk/clerk-react";

interface SetupProfileProps {
  setFirstLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

const SetupProfile = ({ setFirstLogin }: SetupProfileProps) => {
  const [name, setName] = useState("");
  const [school, setSchool] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  // const [interests, setInterests] = useState("");
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !school || !phoneNumber) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3232/add-user?clerk_id=${user?.id}&email=${user?.emailAddresses}&name=${name}&phone_number=${phoneNumber}&school=${school}`
      );

      const data = await response.json();

      if (data.response_type === "success") {
        setFirstLogin(false);
      } else {
        console.log(data);
        setError("Error creating profile.");
      }
    } catch (err) {
      console.error("Error creating profile:", err);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="setup-profile-container">
      <h2>Configure Your Information</h2>
      <form onSubmit={handleSubmit} className="setup-profile-form">
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            id="phoneNumber"
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="123-456-7890"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="school">School:</label>
          <select
            id="school"
            value={school}
            onChange={(e) => setSchool(e.target.value)}
            required
          >
            <option value="" disabled>
              Select your school
            </option>
            <option value="Brown">Brown</option>
            <option value="RISD">RISD</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Save and Continue
        </button>
      </form>
    </div>
  );
};

export default SetupProfile;
