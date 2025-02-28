import "./Navbar.css";
import { useAuth } from "./assets/context/AuthContext";
import { Link } from "react-router-dom";
import { useTranslation } from "./TranslationContext"; // Import the context

function Navbar() {
  const { user, logout } = useAuth();
  const { language, toggleLanguage, translations } = useTranslation(); // Use the context

  const handleLanguageToggle = () => {
    toggleLanguage(); // Toggle the language using context
  };

  return (
    <div className="container-fluid setNavBg">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-lg">
          <h2>
            <a
              className="text-white"
              href="http://localhost:5173/"
              style={{ textDecoration: "none" }}
            >
              Latest 100 IPO Companies
            </a>
          </h2>

          <div className="d-flex justify-content-between align-items-center">
            {/* User Login/Profile Button */}
            {user ? (
              <Link
                to="/profile"
                style={{ textDecoration: "none", color: "black" }}
              >
                <button
                  className="btn setNavLoginBtn"
                  style={{ backgroundColor: "white" }}
                >
                  {user.username}
                </button>
              </Link>
            ) : (
              <Link
                to="/login"
                style={{ textDecoration: "none", color: "black" }}
              >
                <button
                  className="btn setNavLoginBtn"
                  style={{ backgroundColor: "white" }}
                >
                  {translations["login"]}
                </button>
              </Link>
            )}

            {/* Language Toggle Button */}
            <button onClick={handleLanguageToggle} className="langBtn ms-3">
              {language === "en" ? (
                <span
                  className=""
                  style={{
                    justifyItems: "center", display: "flex"
                  }}
                >
                  日本
                </span>
              ) : (
                <span
                  className=""
                  style={{
                    justifyItems: "center",
                  }}
                >
                  EN
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
