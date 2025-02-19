import "./Navbar.css";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

function Navbar() {
  const { user, login, logout } = useAuth();

  return (
    <>
      <div className="container-fluid" style={{ backgroundColor: "#2E3E8B" }}>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container-lg ">
            <h2>
              <a
                className="text-white "
                href="http://localhost:5173/"
                target=""
                style={{ textDecoration: "none" }}
              >
                Last 100 IPO Companies
              </a>
            </h2>

            {user ? (
              <>
                <button className="btn" style={{ backgroundColor: "white" }}>
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {user.username}
                  </Link>
                </button>
              </>
            ) : (
              <button className="btn" style={{ backgroundColor: "white" }}>
                <Link
                  to="/login"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  Login
                </Link>
              </button>
            )}
          </div>
        </nav>
      </div>
      <body></body>
    </>
  );
}

export default Navbar;
