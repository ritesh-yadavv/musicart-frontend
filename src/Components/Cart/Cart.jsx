<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../api";
import "./cart.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCartItems = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${baseUrl}/cart/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.cartItems || []);
    } catch (error) {
      console.error("fetchCartItems error:", error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const handleQuantityChange = async (cartItemId, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.patch(
        `${baseUrl}/cart/update/${cartItemId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItems((prev) =>
        prev.map((item) =>
          item._id === cartItemId ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("handleQuantityChange error:", error);
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await axios.delete(`${baseUrl}/cart/delete/${cartItemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems((prev) => prev.filter((item) => item._id !== cartItemId));
    } catch (error) {
      console.error("handleRemove error:", error);
    }
  };

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.productId?.price || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  if (loading) {
    return (
      <div className="mc-cart-page">
        <div className="mc-cart-empty">Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="mc-cart-page">
        <div className="mc-cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add products to continue shopping.</p>
          <button
            className="mc-cart-secondary-btn"
            onClick={() => navigate("/home")}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mc-cart-page">
      <div className="mc-cart-top">
        <div>
          <h1 className="mc-cart-heading">My Cart</h1>
          <p className="mc-cart-subtext">{totalItems} item(s) in cart</p>
        </div>

        <button
          className="mc-cart-secondary-btn"
          onClick={() => navigate("/home")}
        >
          Continue Shopping
        </button>
      </div>

      <div className="mc-cart-layout">
        <div className="mc-cart-left">
          {cartItems.map((item) => {
            const product = item.productId || {};
            const itemTotal = Number(product.price || 0) * item.quantity;

            return (
              <div className="mc-cart-card" key={item._id}>
                <div className="mc-cart-image-wrap">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mc-cart-image"
                  />
                </div>

                <div className="mc-cart-content">
                  <div className="mc-cart-row-top">
                    <div>
                      <h2 className="mc-cart-product-name">{product.name}</h2>
                      <p className="mc-cart-type">{product.headphoneType}</p>
                    </div>

                    <div className="mc-cart-item-total">₹{itemTotal}</div>
                  </div>

                  <div className="mc-cart-meta">
                    <span>Brand: {product.company}</span>
                    <span>Color: {product.color}</span>
                    <span>Price: ₹{product.price}</span>
                  </div>

                  <div className="mc-cart-actions">
                    <div className="mc-qty-box">
                      <button
                        className="mc-qty-btn"
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>

                      <span className="mc-qty-value">{item.quantity}</span>

                      <button
                        className="mc-qty-btn"
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="mc-remove-btn"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mc-cart-right">
          <div className="mc-summary-card">
            <h3>Price Details</h3>

            <div className="mc-summary-line">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="mc-summary-line">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="mc-summary-divider"></div>

            <div className="mc-summary-line mc-summary-total">
              <span>Total Amount</span>
              <span>₹{totalPrice}</span>
            </div>

            <button
              className="mc-checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../api';
import './cart.css'; // Renamed to Cart.css
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${baseUrl}/cart/all/${userId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setCartItems(response.data.cartItems);

                // Calculate total price
                let total = 0;
                response.data.cartItems.forEach(item => {
                    total += item.productId.price * item.quantity;
                });
                setTotalPrice(total);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [userId]);

    const calculateTotalAmount = () => {
        const discount = 0;
        const convenienceFee = 45;
        let total = 0;
        cartItems.forEach(item => {
            total += item.productId.price * item.quantity;
        });
        const totalPriceWithFee = total + convenienceFee - discount;
        return totalPriceWithFee.toFixed(3); // Round to 3 decimal places
    };

    const handleQuantityChange = (index, event) => {
        const updatedCartItems = [...cartItems];
        updatedCartItems[index].quantity = parseInt(event.target.value);
        setCartItems(updatedCartItems);

        // Recalculate total price
        let total = 0;
        updatedCartItems.forEach(item => {
            total += item.productId.price * item.quantity;
        });
        setTotalPrice(total);
    };

    if (cartItems.length === 0) {
        return <div className="noitem-cart-container">No items in cart</div>;
    }

    const handlePlaceOrder = () => {
        const totalAmount = calculateTotalAmount();
        navigate('/checkout', { state: { totalAmount } });
    };

    return (
        <>
            <div className='cart-back-button'>
                <Link to={"/home"} className='back-button'>Back to products</Link>
            </div>
            <div className="cart-container">
                <div className="left-cart-container">
                    <h2 className="cart-title">Cart Items</h2>
                    <div className="left-cart">
                        <ul className="cart-list">
                            {cartItems.map((item, index) => (
                                <li key={index} className="cart-item">
                                    <div>
                                        <img src={item.productId.imageUrl} alt="" />
                                    </div>
                                    <div>
                                        <div>{item.productId.name}</div>
                                        <div>Color: {item.productId.color}</div>
                                    </div>
                                    <div>Price: ₹{item.productId.price}</div>
                                    <div className='quantity'>
                                        <div>Quantity</div>
                                        <select value={item.quantity} onChange={(event) => handleQuantityChange(index, event)}>
                                            {Array.from({ length: 8 }, (_, index) => (
                                                <option key={index + 1} value={index + 1} disabled={index + 1 > 8}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className='right-cart'>
                    <div className="cart-price">
                        <div>PRICE DETAILS</div>
                        <div>Total MRP: ₹{totalPrice.toFixed(3)}</div> {/* Display total price */}
                        <div>Discount on MRP: ₹{0}</div> {/* Display discount amount */}
                        <div>Convenience Fee: ₹{45}</div> {/* Display convenience fee */}
                        <div>Total Amount: ₹{calculateTotalAmount()}</div> {/* Display total amount */}
                        <button onClick={handlePlaceOrder}>
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
>>>>>>> c165d3cd08ee1bb29691bdb5547a0bcaf823b8bc
