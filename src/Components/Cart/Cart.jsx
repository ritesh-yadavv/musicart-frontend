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
