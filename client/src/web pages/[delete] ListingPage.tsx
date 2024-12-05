import React from "react";
import { Link } from "react-router-dom";

const ListingPage: React.FC = () => {
  return (
    <div>
      <h1>Listing Page</h1>
      <p>Details of the selected product.</p>
      <Link to="/">Back to Home</Link> {/* Link to home */}
    </div>
  );
};

export default ListingPage;
