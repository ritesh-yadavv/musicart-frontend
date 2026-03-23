import React from 'react';
import SuccessImage from "../../../src/assets/success.png";
import image4 from "../../../src/assets/image 4.png";
import "./success.css";
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate('/home')
  }
  const handleviewInvoice = () => {
    navigate('/invoice')
  }
  return (
    <div className='success-container'>
      <div className="container">
        <div className="image-4">
          <img src={image4} alt="#" />
        </div>
        <div className="musicart">
          Musicart
        </div>
      </div>

      <div className="container-3">
        <div className="confetti-1">
          <img src={SuccessImage} alt="Success" /> {/* Added alt attribute */}
        </div>
        <div className="order-text">
          Order is placed successfully!
        </div>
        <div className="you-will-be-receiving-a-confirmation-email-with-order-details">
          You will be receiving a confirmation email with order details
        </div>
        <div className="container-2">
          {/* <button className="go-back-to-home-page" onClick={handleGoBack}>
            Go back to Home page
          </button> */}
        
          <button className="go-back-to-home-page" onClick={handleviewInvoice}>
            View Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessPage;
