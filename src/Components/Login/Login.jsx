import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../api';
import './login.css';
import image5 from "../../assets/image 4.png";
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('Demo@gmail.com');
    const [password, setPassword] = useState('Demo@123456');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false); 
    const navigate =useNavigate();

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSignin = async () => {
        if (!email || !password) {
            setError("All fields are required");
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`${baseUrl}/user/login`, {
                email,
                password
            });
            // console.log(response.data.data.user._id)
            const {token}=response.data.data;
            const {fullName,_id}=response.data.data.user;
            
            if (token) {
                localStorage.setItem('token',token);
                localStorage.setItem('name',fullName);
                localStorage.setItem('userId',_id);
                navigate("/home")
            } else {
                setError("Login failed");
            }
        } catch (error) {
            // console.error('Error signing in:', error.response.data.message);
            setError(error.response.data.message);
        }
        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className='login-heading'>
                <img src={image5} alt="Icon" />
                <h3>Musicart</h3>
            </div>

            <div className="wrapper">
                <h1>Sign in</h1>
                <div className="form-group">
                    <label htmlFor="email">Enter your email or mobile number</label>
                    <input
                        type="text"
                        placeholder="Enter your email or mobile number"
                        value={email}
                        onChange={handleEmailChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>

                {error && <p className='error'>{error}</p>}

                <button onClick={handleSignin}>{loading ? 'Loading...' : "Continue"}</button>
                <div className="form-group">
                    <p>By continuing, you agree to Musicart privacy notice and conditions of use.</p>
                </div>
            </div>

            <div className='login-lower-box'>
                <div className="para">
                    <hr />  
                    <p>New to Musicart? </p>
                    <hr />
                </div>
                <Link to="/signup">Create your Musicart account</Link>
            </div>
            
        </div>
    );
};

export default Login;
