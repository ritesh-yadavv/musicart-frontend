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