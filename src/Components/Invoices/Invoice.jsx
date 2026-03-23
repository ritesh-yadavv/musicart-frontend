<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./invoices.css";
import baseUrl from "../../api";
import invoiceImage from "../../assets/invoice.png";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");
        if (!token) {
          console.error("Token not found");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${baseUrl}/checkout/getall`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setInvoices(response.data.checkouts || []);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  if (loading) {
    return <div className="invoice-empty">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return <div className="invoice-empty">No invoices found</div>;
  }

  return (
    <div className="invoice-page">
      <div className="invoice-topbar">
        <Link to="/home" className="invoice-back-btn">
          Back to Home
        </Link>
        <h2>My Orders / Invoices</h2>
      </div>

      <div className="invoice-list">
        {invoices.map((invoice) => {
          const firstProductImage =
            invoice.items?.[0]?.productId?.imageUrl || invoiceImage;

          return (
            <div key={invoice._id} className="invoice-card">
              <div className="invoice-left">
                <img src={firstProductImage} alt="Product" />
                <div className="invoice-info">
                  <h3>{invoice.customerName}</h3>
                  <p>{invoice.shippingAddress}</p>
                  <p>
                    <strong>Status:</strong> {invoice.status}
                  </p>
                  <p>
                    <strong>Payment:</strong> {invoice.paymentStatus}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{invoice.totalPrice}
                  </p>
                </div>
              </div>

              <div className="invoice-right">
                <Link to={`/invoice/${invoice._id}`} className="invoice-view-btn">
                  View Invoice
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Invoice;
=======
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./invoices.css";
import baseUrl from '../../api';
import invoiceImage from "../../assets/invoice.png";

const Invoice = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        const fetchInvoices = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.error('Token not found');
                    return;
                }

                const response = await axios.get(`${baseUrl}/checkout/getall`, {
                    headers: {
                        Authorization: token,
                    },
                });

                setInvoices(response.data);
                console.log('Invoices:', response.data);
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        };

        fetchInvoices();
    }, []);

    if (invoices.length === 0) {
        return <div className="noitem-cart-container">No items in Invoice</div>;
    }

    return (
        <>
          <div className="invoice-back-button">
          <Link to={"/home"} className='back-button'>Back to Home</Link>
            </div>  

            <div className="invoices-container">
                <h2>My Invoices</h2>
                    <div className="invoice-list">
                        {invoices.map((invoice, index) => (
                            <>
                            <div key={index} className="invoice-item">
                                <div className='left-invoice'>
                                    <img src={invoiceImage} alt="Invoice" />
                                    <div className='left-invoice-p'>
                                        <p>{invoice.customerName.toUpperCase()}</p>
                                        <p>{invoice.shippingAddress}</p>
                                    </div>
                                </div>
                                <div className='right-invoice'>
                                    <Link to={`/invoice/${invoice._id}`} className="back-button">
                                        View Invoice
                                    </Link>
                                </div>
                            </div>
                                <div className='bottom-border'></div>
                                </>
                        ))}
                    </div>
            </div>
        </>
    );
}

export default Invoice;
>>>>>>> c165d3cd08ee1bb29691bdb5547a0bcaf823b8bc
