import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import baseUrl from "../../api";
import image5 from "../../assets/image 4.png";
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 

    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!name || !email || !password || !phoneNumber) {
            setError('All fields are required');
            return;
        }

        setLoading(true); 

        try {
            const response = await axios.post(`${baseUrl}/user/signup`, {
                fullName: name,
                email,
                password,
                contactNumber: phoneNumber,
            });

            if (response.status === 200) {
                navigate('/login');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to sign up. Please try again later.');
        }

        setLoading(false); 
    };

    return (
        <>
            <div className='login-heading'>
                <img src={image5} alt="Icon" />
                <h3>Musicart</h3>
            </div>
            <div className="signup-container">
                <div className="form-group">
                    <h2>Create Account</h2>
                    <label htmlFor="name">Your name</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Mobile number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email Id</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <p>By enrolling your mobile phone number, you consent to receive automated security notifications via text message from Musicart. Message and data rates may apply.</p>
                </div>
                {error && <p className="error">{error}</p>}
                <button onClick={handleSignup} disabled={loading}>
                    {loading ? 'Loading...' : 'Continue'}
                </button>
                <div className="form-group">
                    <p>By continuing, you agree to Musicart privacy notice and conditions of use.</p>
                </div>
            </div>
            <div className="lower-box">
                <span>Already have an account?<Link to="/login">Sign in</Link> </span>
            </div>
        </>
    );
};

export default Signup;
 