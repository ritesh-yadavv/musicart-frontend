import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShoppingCart, faUser, faFileInvoice } from '@fortawesome/free-solid-svg-icons';
import "./Nav.css";
import image1 from "../../assets/Vector.png";
import baseUrl from '../../api';
import axios from 'axios';

const Nav = () => {
  const token = localStorage.getItem("token");
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('home');

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
    navigate("/home"); // Navigating to the home page after logout
  };

  const handleItemClick = (itemName) => {
    // console.log(itemName)
    setActiveItem(itemName);
  };

  useEffect(() => {
    axios.get(`${baseUrl}/cart/count`, {
        headers: {
            Authorization: `${token}`,
        },
    }).then((response) => {
        // console.log(response)
        setCartItemCount(response.data.count);
    })
}, [cartItemCount]);


  return (
    <>
      <nav>
        <div className="nav-container">
          <div className='nav-item'>
            <span className='nav-img'> <img src={image1} alt="Logo" /> 912121131313</span>
          </div>
          <div className='nav-item'>
            Get 50% off on selected items | Shop Now
          </div>
          {token ? (
            <div className="nav-item logout" onClick={handleLogout}>Logout</div>
          ) : (
            <div className='nav-item signup-login-container'>
              <Link className=' nav-item login-signup' to={"/login"}> Login </Link>
              |
              <Link className=' nav-item login-signup' to={"/signup"}>Signup</Link>
            </div>
          )}
        </div>
      </nav>

       {/* Bottom Navigation Icons */}
    <div className="bottom-nav-icons">
      <Link to="/home" className={window.location.pathname === '/home' ? 'active' : ''}>
        <FontAwesomeIcon icon={faHome} /> Home
      </Link>
      <Link to="/cart" className={window.location.pathname === '/cart' ? 'active' : ''}>
        <FontAwesomeIcon icon={faShoppingCart} /> Cart {cartItemCount}
      </Link>
      <Link to="/invoice" className={window.location.pathname === '/invoice' ? 'active' : ''}>
        <FontAwesomeIcon icon={faFileInvoice} /> Invoice
      </Link>
      
      {!token ? 
        <Link to="/login" className={window.location.pathname === '/login' ? 'active' : ''}>
          <FontAwesomeIcon icon={faUser} />
          Login
        </Link> 
        :
        <Link to="/home" onClick={handleLogout}>
          <FontAwesomeIcon icon={faUser} />
          Logout
        </Link>
      }
    </div>
    </>
  );
};

export default Nav;
