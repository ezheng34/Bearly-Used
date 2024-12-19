import "../styles/Signup.css"; // Make sure you reuse this for the styles
import { SignInButton } from "@clerk/clerk-react";
import logo from "../assets/logo.png";

/**
 * Renders a Sign Up Page. Prompts the user to log in. 
 * 
 * Only users signing in with a Brown or RISD email can proceed forward to the website.
 * 
 * @returns {JSX.Element} A JSX element representing a Sign Up Page. 
 */
const SignUp = () => {
  return (
    <div className="sign-up-container">
      <img src={logo} style={{ height: "150px" }} />
      <h2>Bearly Used </h2>
      <p>Sign in with your Brown/RISD email to access Bearly Used!</p>
      <SignInButton>
        <button className="btn btn-primary">Sign In</button>
      </SignInButton>
    </div>
  );
};

export default SignUp;
