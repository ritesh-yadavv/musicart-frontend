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
