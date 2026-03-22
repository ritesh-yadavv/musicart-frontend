import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import baseUrl from '../../api';

const InvoiceDetails = () => {
    const [invoice, setInvoice] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }

                const response = await axios.get(`${baseUrl}/checkout/getone/${id}`, {
                    headers: {
                        Authorization: `${token}`
                    }
                });

                if (response.status !== 200) {
                    throw new Error('Failed to fetch invoice details');
                }

                setInvoice(response.data);
                // console.log(response.data)
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                setIsLoading(false);
            }
        };

        fetchInvoice();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!invoice) {
        return <div>Invoice not found</div>;
    }

    return (
        <div className="checkout-page">
            <div className="back-to-cart">
                <Link to={"/invoice"} className='back-button'>Back to invoice</Link>
            </div>

            <div className='checkout-heading'>Checkout</div>
            <div className="checkout-container">
                <div className="left-container">
                    <div className="address-container">
                        <h3>1. Delivery address</h3>
                        <div>
                            <p>{invoice.customerName.toUpperCase()}</p>
                            <textarea
                                className="address-input"
                                value={invoice.shippingAddress}
                                readOnly
                            />
                        </div>
                    </div>

                    <div className="payment-container">
                        <h3>2. Payment method</h3>
                        <select
                            className="payment-method-select"
                            disabled

                        >
                            <option value={invoice.paymentMethod}>{invoice.paymentMethod}</option>

                        </select>
                    </div>
                    <div className="payment-container">
                        <h3>3.Order Id</h3>
                        <select
                            className="payment-method-select"
                            disabled

                        >
                            <option value={invoice.razorpayOrderId
                            }>{invoice.razorpayOrderId
                                }</option>

                        </select>
                    </div>

                    <div className="cart-items-container">
                        <div className="cart-header">
                            <h3>4. Review items and delivery</h3>
                        </div>
                        <div className="cart-image-body">
                            {invoice.items.map((item, index) => (
                                <div key={index} className="product-image-container" onClick={() => setSelectedImageIndex(index)}>
                                    <img src={item.productId.imageUrl} alt="Product" />

                                </div>
                            ))}

                            {
                                invoice.items.map((item, index) => (

                                    <div key={index}
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
                </div>

                <div className="right-container">
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <p>Items : ₹{invoice.totalPrice - 45}</p>
                        <p>Delivery  : ₹45</p>
                        <p>Order Total: ₹{invoice.totalPrice}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceDetails;
