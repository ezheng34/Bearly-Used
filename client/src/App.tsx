import React from "react";

const App: React.FC = () => {
  return (
    <div>
      {/* Bootstrap Header / Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            My Simple App
          </a>
        </div>
      </nav>

      {/* Main content */}
      <div className="container mt-4">
        <h1>Welcome to My Simple App</h1>
        <p>This app is styled using Bootstrap.</p>
      </div>
    </div>
  );
};

export default App;
