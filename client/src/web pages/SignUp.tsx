import React from "react";
import "../styles/SetupProfile.css"; // Make sure you reuse this for the styles
import { SignInButton } from "@clerk/clerk-react";

// TODO: MAKE THIS CUTE
const SignUp = () => {
  return (
    <div className="sign-up-container">
      <h2>Bearly Used 🐻</h2>
      <p>Sign in with your Brown/RISD email to access Bearly Used!</p>
      <SignInButton>
        <button className="btn btn-primary">Sign In</button>
      </SignInButton>
    </div>
  );
};

export default SignUp;
