import React, { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../../api';
import "./checkout.css";
import image1 from "../../assets/Vector.png";
import { useNavigate, useLocation } from 'react-router-dom';

const CheckOut = () => {
    const [cartItems, setCartItems] = useState([]);
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const userId = localStorage.getItem('userId');
    const location = useLocation();
    const { totalAmount = 0 } = location.state || {};
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const name = localStorage.getItem("name");

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }

                const response = await axios.get(`${baseUrl}/cart/all/${userId}`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                setCartItems(response.data.cartItems);
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [userId]);

    const handlePlaceOrder = async () => {
        try {
            if (!address || !paymentMethod) {
                setError('Address or payment method is empty');
                return;
            }
            if (cartItems.length === 0) {
                setError('Cart is empty');
                return;
            }
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('Token not found');
                return;
            }

            const checkoutData = {
                items: cartItems.map(item => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                })),
                totalPrice: totalAmount,
                customerName: name,
                shippingAddress: address,
                paymentMethod: paymentMethod,
                status: 'Pending'
            };

            const response = await axios.post(`${baseUrl}/checkout/create`, checkoutData, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            const order = response.data;
            console.log('Order created successfully:', order);

            if (paymentMethod === 'credit_card' || paymentMethod === 'upi') {
                const options = {
                    key: "rzp_test_RVuOPmBoI6A3ZI", // Use the environment variable here
                    amount: order.amount, // Amount is in currency subunits (e.g., paise)
                    currency: order.currency,
                    name: "Music Cart",
                    description: "Pay Your Amount",
                    image: image1,
                    order_id: order.order_id, // This is the order ID created in your backend
                    handler: async function (response) {
                        try {
                            const verifyResponse = await axios.post(`${baseUrl}/checkout/verify`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                checkoutData: checkoutData // Include checkoutData in verification request
                            }, {
                                headers: {
                                    Authorization: `${token}`,
                                },
                            });

                            console.log('Payment verified successfully:', verifyResponse.data);
                            setCartItems([]);
                            navigate("/success");
                        } catch (error) {
                            console.error('Error verifying payment:', error);
                        }
                    },
                    prefill: {
                        name: name,
                        email: "Test@gmail.com",
                        contact: "9999999999"
                    },
                    notes: {
                        address: "Music Cart Office"
                    },
                    theme: {
                        color: "#3399cc"
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            } else {
                setCartItems([]);
                navigate("/success");
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const backToCart = () => {
        navigate("/cart");
    };

    return (
        <div className="checkout-page">
            <div className="back-to-cart">
                <button onClick={backToCart}>Back to cart</button>
            </div>

            <div className='checkout-heading'>Checkout</div>

            <div className="checkout-container">
                <div className="left-container">
                    <div className="address-container">
                        <h3>1. Delivery address</h3>
                        <div>
                            <p>{name.toUpperCase()}</p>
                            <textarea
                                className="address-input"
                                placeholder="Enter your address..."
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="payment-container">
                        <h3>2. Payment method</h3>
                        <select
                            className="payment-method-select"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="">Select Payment Method</option>
                            <option value="credit_card">Card</option>
                            <option value="upi">Upi</option>
                            <option value="cash">Cash on Delivery</option>
                        </select>
                    </div>
                    <div className="cart-items-container">
                        <div className="cart-header">
                            <h3>3. Review items and delivery</h3>
                        </div>

                        <div className="cart-image-body">
                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="product-image-container"
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img src={item.productId.imageUrl} alt="Product" />
                                </div>
                            ))}

                            {cartItems.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <div className="product-info">
                                        {selectedImageIndex === index && (
                                            <div className="product-info-data">
                                                <p>{item.productId.company} {item.productId.name}</p>
                                                <p>Colour {item.productId.color}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="left-order-button">
                        <div className="order-content">
                            <div className="btn">
                                <button className="place-order-button" onClick={handlePlaceOrder}>Place Your Order</button>
                            </div>
                            <div>
                                <p>Order Total: ₹{totalAmount}</p>
                                <p>By placing your order, you agree to Musicart privacy notice and conditions of use.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right-container">
                    <button className="place-order-button" onClick={handlePlaceOrder}>Place Your Order</button>
                    {error && <p className="error-message">{error}</p>}
                    <p>By placing your order, you agree to Musicart privacy notice and conditions of use.</p>
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <p>Total Items: {cartItems.length}</p>
                        <p>Total Amount: ₹{totalAmount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
