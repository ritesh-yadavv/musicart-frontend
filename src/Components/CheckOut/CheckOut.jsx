import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import baseUrl from "../../../api";
import "./checkout.css";

const CheckOut = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const customerName = localStorage.getItem("name") || "";

  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCartItems = async () => {
    try {
      setPageLoading(true);

      const res = await axios.get(`${baseUrl}/cart/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartItems(res.data.cartItems || []);
    } catch (err) {
      console.error("checkout cart fetch error:", err);
      setCartItems([]);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const totalAmount = useMemo(() => {
    return cartItems.reduce(
      (acc, item) => acc + Number(item.productId?.price || 0) * item.quantity,
      0
    );
  }, [cartItems]);

  const handlePlaceOrder = async () => {
    setError("");

    if (!shippingAddress.trim()) {
      setError("Address is required");
      return;
    }

    if (!paymentMethod) {
      setError("Payment method is required");
      return;
    }

    if (cartItems.length === 0) {
      setError("Cart is empty");
      return;
    }

    const checkoutData = {
      items: cartItems.map((item) => ({
        productId: item.productId?._id,
        quantity: item.quantity,
      })),
      totalPrice: totalAmount,
      customerName,
      shippingAddress,
      paymentMethod,
    };

    try {
      setLoading(true);

      if (paymentMethod === "cash") {
        const cashRes = await axios.post(
          `${baseUrl}/checkout/cash`,
          checkoutData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (cashRes.data.success) {
          navigate("/success");
        } else {
          setError(cashRes.data.message || "Failed to place order");
        }

        return;
      }

      const orderRes = await axios.post(
        `${baseUrl}/checkout/create`,
        {
          totalPrice: totalAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!orderRes.data.success) {
        setError(orderRes.data.message || "Unable to create order");
        return;
      }

      if (!window.Razorpay) {
        setError("Razorpay SDK not loaded");
        return;
      }

      const options = {
        key: "rzp_test_your_real_key_here",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "Musicart",
        description: "Order Payment",
        order_id: orderRes.data.order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${baseUrl}/checkout/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                checkoutData,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (verifyRes.data.success) {
              navigate("/success");
            } else {
              setError(
                verifyRes.data.message || "Payment verification failed"
              );
            }
          } catch (err) {
            console.error("verify payment error:", err);
            setError(
              err?.response?.data?.message || "Payment verification failed"
            );
          }
        },
        theme: {
          color: "#8f0594",
        },
        prefill: {
          name: customerName,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("place order error:", err);
      setError(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return <div className="mc-checkout-loading">Loading checkout...</div>;
  }

  return (
    <div className="mc-checkout-page">
      <div className="mc-checkout-top">
        <div className="mc-checkout-brand">
          <h1>Checkout</h1>
          <p>Complete your order details</p>
        </div>

        <button className="mc-back-btn" onClick={() => navigate("/cart")}>
          Back to cart
        </button>
      </div>

      <div className="mc-checkout-layout">
        <div className="mc-checkout-left">
          <div className="mc-checkout-card">
            <h2>1. Delivery Address</h2>

            <div className="mc-field-group">
              <label>Name</label>
              <input type="text" value={customerName} disabled />
            </div>

            <div className="mc-field-group">
              <label>Address</label>
              <textarea
                placeholder="Enter your address..."
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="mc-checkout-card">
            <h2>2. Payment Method</h2>

            <div className="mc-field-group">
              <label>Select payment method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="upi">UPI</option>
                <option value="credit_card">Credit Card</option>
              </select>
            </div>
          </div>

          <div className="mc-checkout-card">
            <h2>3. Review Items</h2>

            <div className="mc-review-list">
              {cartItems.map((item) => (
                <div className="mc-review-item" key={item._id}>
                  <img
                    src={item.productId?.imageUrl}
                    alt={item.productId?.name}
                  />

                  <div className="mc-review-info">
                    <h3>{item.productId?.name}</h3>
                    <p>Qty: {item.quantity}</p>
                    <p>Price: ₹{item.productId?.price}</p>
                    <p>Status: Processing</p>
                  </div>

                  <div className="mc-review-total">
                    ₹{Number(item.productId?.price || 0) * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mc-checkout-right">
          <div className="mc-summary-box">
            <h2>Order Summary</h2>

            {error && <p className="mc-checkout-error">{error}</p>}

            <div className="mc-summary-row">
              <span>Total Items</span>
              <span>{totalItems}</span>
            </div>

            <div className="mc-summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <div className="mc-summary-row">
              <span>Order Status</span>
              <span>Processing</span>
            </div>

            <div className="mc-summary-divider"></div>

            <div className="mc-summary-row mc-summary-strong">
              <span>Total Amount</span>
              <span>₹{totalAmount}</span>
            </div>

            <button
              className="mc-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Your Order"}
            </button>

            <p className="mc-checkout-note">
              By placing your order, you agree to Musicart privacy notice and
              conditions of use.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
