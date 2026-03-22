import React, { useState, useEffect } from 'react';
import Nav from '../Nav/Nav';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../api';
import "./productdetails.css";
import Header from '../Header/Header';
import { faShoppingCart, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import toast, { Toaster } from 'react-hot-toast';
import image5 from "../../assets/image 4.png";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [cartItemCount, setCartItemCount] = useState(0);
    let currentPath = window.location.pathname.split('/')[1];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseUrl}/product/getone/${id}`);
                setProduct(response.data.product);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (token) {
            axios.get(`${baseUrl}/cart/count`, {
                headers: {
                    Authorization: `${token}`,
                },
            }).then((response) => {
                setCartItemCount(response.data.count);
            }).catch((error) => {
                console.error('Error fetching cart count:', error);
            });
        }
    }, [token]);

    const addToCart = async () => {
        try {
            if (!token) {
                navigate("/login");
                console.error('Token not found');
                return;
            }

            // Make API call to add item to cart
            const response = await axios.post(`${baseUrl}/cart/add`, {
                productId: id,
                quantity: 1,
            }, {
                headers: {
                    Authorization: `${token}`,
                },
            });

            // Update cart count
            setCartItemCount(prevCount => prevCount + 1);

            toast.success('Item added to cart:')

        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };

    const buyNow = async () => {
        if (!token) {
            navigate("/login");
        } else {
            await addToCart();
            toast.success('Item added to cart:')
            navigate("/cart");

        }
    }

    return (
        <>
            <Toaster />
            <Nav className="Navbar" />
            <div className='header'>
                <section>
                    <div className='Head'>
                        <div className='Head-content'>
                            <div>
                                <img src={image5} alt="" />
                            </div>
                            <div>Musicart </div>

                            <div className='curentPath'>{`${currentPath}`}

                                {(token && currentPath == "home") ? <Link to={"/invoice"}>invoice</Link> : null}
                            </div>


                        </div>

                        <div className="rightHead">
                            <div className='cart-box'>
                                <Link to={"/cart"}> <FontAwesomeIcon icon={faShoppingCart} />View Cart {cartItemCount}</Link>
                            </div>


                        </div>
                    </div>

                </section>
            </div>

            <section className='product-deatils'>

                <Link to={"/home"} className='back-button'>Back to products</Link>

                <div className="product-details-container">

                    <div className="product-images-container">
                        <div className="product-img">

                            {product && (
                                <img src={product.imageUrl} />
                            )}
                        </div>

                    </div>

                    <div className="product-description">
                        {product && (
                            <>
                                <p className="product-title">{product.company} {product.name}</p>
                                <div className="product-rating">
                                    <div className="star-rating">
                                        {[...Array(product.rating)].map((star, index) => (
                                            <span key={index}>★</span>
                                        ))}
                                    </div>
                                </div>

                                <p className="product-price">Price: {product.price}</p>
                                <p className="product-price">{product.color} | {product.headphone_type}</p>
                                <p>{product.description}</p>
                                <p> Available - In stock</p>
                                <p> Brand- {product.company}</p>
                                <div className="action-buttons">
                                    <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
                                    <button className="buy-now-btn" onClick={buyNow}>Buy Now</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductDetails;
