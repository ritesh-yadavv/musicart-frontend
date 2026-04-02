import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faShoppingCart,
  faUser,
  faFileInvoice,
} from "@fortawesome/free-solid-svg-icons";
import "./Nav.css";
import image1 from "../../assets/Vector.png";
import baseUrl from "../../../api";
import axios from "axios";

const Nav = () => {
  const token = localStorage.getItem("token");
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    navigate("/home");
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (!token) {
          setCartItemCount(0);
          return;
        }

        const response = await axios.get(`${baseUrl}/cart/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItemCount(response.data.count || 0);
      } catch (error) {
        console.error("Cart count error:", error);
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [token, location.pathname]);

  return (
    <>
      <nav>
        <div className="nav-container">
          <div className="nav-item">
            <span className="nav-img">
              <img src={image1} alt="Logo" /> 912121131313
            </span>
          </div>

          <div className="nav-item">
            Get 50% off on selected items | Shop Now
          </div>

          {token ? (
            <div className="nav-item logout" onClick={handleLogout}>
              Logout
            </div>
          ) : (
            <div className="nav-item signup-login-container">
              <Link className="nav-item login-signup" to="/login">
                Login
              </Link>
              |
              <Link className="nav-item login-signup" to="/signup">
                Signup
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="bottom-nav-icons">
        <Link to="/home" className={location.pathname === "/home" ? "active" : ""}>
          <FontAwesomeIcon icon={faHome} /> Home
        </Link>

        <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
          <FontAwesomeIcon icon={faShoppingCart} /> Cart {cartItemCount}
        </Link>

        <Link
          to="/invoice"
          className={location.pathname === "/invoice" ? "active" : ""}
        >
          <FontAwesomeIcon icon={faFileInvoice} /> Invoice
        </Link>

        {!token ? (
          <Link
            to="/login"
            className={location.pathname === "/login" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faUser} />
            Login
          </Link>
        ) : (
          <Link to="/home" onClick={handleLogout}>
            <FontAwesomeIcon icon={faUser} />
            Logout
          </Link>
        )}
      </div>
    </>
  );
};

export default Nav;