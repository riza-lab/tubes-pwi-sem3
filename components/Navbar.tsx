import Link from "next/link";
import { useState, useEffect } from "react";
import { auth } from "../utils/auth";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setUser(auth.getUser());
  }, []);

  const handleLogout = () => {
    auth.logout();
    setUser(null);
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link href="/" className="logo">
          GO-RENT
        </Link>
        <nav className="nav-links">
          <Link href="/browse">Browse Cars</Link>
          <Link href="/bookings">My Bookings</Link>
        </nav>
        <div className="auth-buttons">
          {user ? (
            <div className="user-menu">
              <button
                className="btn btn-outline user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.email}
              </button>
              {dropdownOpen && (
                <div className="dropdown">
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-outline">
              Login / Sign in
            </Link>
          )}
        </div>
      </div>

      <style jsx>{`
        .user-menu {
          position: relative;
        }
        .user-btn {
          cursor: pointer;
        }
        .dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 10;
          min-width: 120px;
        }
        .logout-btn {
          width: 100%;
          padding: 0.5rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          color: #374151;
        }
        .logout-btn:hover {
          background: #f9fafb;
        }
      `}</style>
    </header>
  );
};

export default Navbar;
