import React, { useEffect, useMemo, useState } from "react";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import "./header.css";
import baseUrl from "../../api";
import axios from "axios";
import image4 from "../../assets/image 4.png";

const Header = () => {
  const [cartItemCount, setCartItemCount] = useState(0);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("name") || "RY";
  const location = useLocation();

  const pageTitle = useMemo(() => {
    const path = location.pathname;

    if (path === "/home") return "Home";
    if (path === "/cart") return "Cart";
    if (path === "/checkout") return "Checkout";
    if (path === "/invoice") return "Invoice";
    if (path.startsWith("/invoice/")) return "Invoice Details";
    if (path.startsWith("/product/")) return "Product Details";
    return "";
  }, [location.pathname]);

  const initials = useMemo(() => {
    return userName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [userName]);

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
        console.error("Error fetching cart count:", error);
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [token, location.pathname]);

  return (
    <div className="mc-header-wrapper">
      <div className="mc-header">
        <div className="mc-header-left">
          <Link to="/home" className="mc-logo-box">
            <img src={image4} alt="Musicart" className="mc-logo" />
            <span className="mc-brand-name">Musicart</span>
          </Link>
        </div>

        <div className="mc-header-center">
          <h1 className="mc-page-title">{pageTitle}</h1>
        </div>

        <div className="mc-header-right">
          {token && location.pathname === "/home" && (
            <Link to="/invoice" className="mc-invoice-link">
              My Orders
            </Link>
          )}

          <Link to="/cart" className="mc-cart-btn">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>View Cart {cartItemCount}</span>
          </Link>

          {token && <div className="mc-profile">{initials}</div>}
        </div>
      </div>
    </div>
  );
};

export default Header;