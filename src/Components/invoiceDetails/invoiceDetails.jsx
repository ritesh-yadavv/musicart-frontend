<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import baseUrl from "../../api";
import "./invoiceDetails.css";

const InvoiceDetails = () => {
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token not found");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${baseUrl}/checkout/getone/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInvoice(response.data.checkout || null);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
        setInvoice(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const totalItems = useMemo(() => {
    if (!invoice?.items) return 0;
    return invoice.items.reduce((acc, item) => acc + item.quantity, 0);
  }, [invoice]);

  if (isLoading) {
    return <div className="invoice-details-empty">Loading...</div>;
  }

  if (!invoice) {
    return <div className="invoice-details-empty">Invoice not found</div>;
  }

  return (
    <div className="invoice-details-page">
      <div className="invoice-details-topbar">
        <Link to="/invoice" className="invoice-details-back-btn">
          Back to Invoice List
        </Link>
        <h2>Invoice Details</h2>
      </div>

      <div className="invoice-details-layout">
        <div className="invoice-details-left">
          <div className="invoice-section">
            <h3>1. Delivery Address</h3>
            <p className="invoice-name">{invoice.customerName}</p>
            <textarea
              className="invoice-address"
              value={invoice.shippingAddress}
              readOnly
            />
          </div>

          <div className="invoice-section">
            <h3>2. Payment Information</h3>
            <p>
              <strong>Payment Method:</strong> {invoice.paymentMethod}
            </p>
            <p>
              <strong>Payment Status:</strong> {invoice.paymentStatus}
            </p>
            <p>
              <strong>Order Status:</strong> {invoice.status}
            </p>
            <p>
              <strong>Order ID:</strong>{" "}
              {invoice.razorpayOrderId || "Cash Order / Not Applicable"}
            </p>
          </div>

          <div className="invoice-section">
            <h3>3. Ordered Items</h3>

            <div className="invoice-products">
              {invoice.items?.map((item, index) => (
                <div key={index} className="invoice-product-card">
                  <img
                    src={item.productId?.imageUrl}
                    alt={item.productId?.name}
                  />

                  <div className="invoice-product-info">
                    <h4>{item.productId?.name}</h4>
                    <p>
                      <strong>Brand:</strong> {item.productId?.company}
                    </p>
                    <p>
                      <strong>Color:</strong> {item.productId?.color}
                    </p>
                    <p>
                      <strong>Type:</strong> {item.productId?.headphoneType}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{item.productId?.price}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                    <p>
                      <strong>Total:</strong> ₹
                      {Number(item.productId?.price || 0) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="invoice-details-right">
          <div className="invoice-summary-card">
            <h3>Order Summary</h3>
            <p>
              <strong>Total Items:</strong> {totalItems}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{invoice.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {invoice.status}
            </p>
            <p>
              <strong>Payment:</strong> {invoice.paymentStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
=======
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
>>>>>>> c165d3cd08ee1bb29691bdb5547a0bcaf823b8bc
