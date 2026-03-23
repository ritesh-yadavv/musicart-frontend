import React, { useEffect, useState } from 'react'
import { faShoppingCart, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import image1 from "../../assets/bannerimg.png"
import image2 from "../../assets/listButton.png"
import image3 from "../../assets/gridButton1.png"
import image4 from "../../assets/listButton1.png"
import image5 from "../../assets/image 4.png"
import image6 from "../../assets/gridButton.png"

import "./product.css"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import baseUrl from "../../api"
import toast, { Toaster } from 'react-hot-toast';


const Products = () => {
  const [products, setProducts] = useState([]);
  const [headPhoneType, setHeadPhoneType] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [colorType, setColorType] = useState('');
  const [price, setPrice] = useState('');
  const [sortBy, SetsortBy] = useState('');
  const [search, setSearch] = useState("")
  const [layout, setLayout] = useState('grid');
  const [profileVisible, setProfileVisible] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");


  let Name = localStorage.getItem("name");
  if (Name !== null) {
    Name = Name.toUpperCase();
  }


  useEffect(() => {
    axios.get(`${baseUrl}/product/getall?name=${search}&&color=${colorType}&&company=${companyType}&&headphone_type=${headPhoneType}&&sortBy=${sortBy}`).then((res) => {
      setProducts(res.data.products);
      // console.log(res.data);
    }).catch((err) => {
      console.log(err)
    });
  }, [search, colorType, companyType, headPhoneType, sortBy]);

  const toggleLayout = (layoutType) => {
    setLayout(layoutType);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    //  console.log(search)
  }

  const toggleProfile = () => {
    setProfileVisible(!profileVisible);
  };

  const handleNavigate = (id) => {
    console.log(id);
    navigate(`/product/${id}`)
  }
  const HandleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    navigate("/home");
    return;
  }

  const toggleFeedbackForm = () => {
    setShowFeedbackForm(!showFeedbackForm);
  };

  const handleFeedBacksubmit = async () => {
    if (feedbackType === "" || message === "") {
      setError("Please fill all the fields")
      return;
    }

    try {
      const response = await axios.post(
        `${baseUrl}/feedback/create`,
        { type: feedbackType, message: message }, // Pass data as an object
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      toast.success("Feedback saved successfully");

      setShowFeedbackForm(false)

    } catch (error) {
      console.error(error);
    }
  };




  const addToCart = async (id) => {
    try {
      const token = localStorage.getItem('token');
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

      toast.success('Item added to cart:');

    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };


  useEffect(() => {
    axios.get(`${baseUrl}/cart/count`, {
      headers: {
        Authorization: `${token}`,
      },
    }).then((response) => {
      // console.log(response)
      setCartItemCount(response.data.count);
    })
  }, [cartItemCount]);

  return (
    <>
      <Toaster position="bottom-right"
        reverseOrder={false} />

      <section className='section-head'>
        <div className='Head'>
          <div className='Head-content'>
            <div>
              <img src={image5} alt="" />
            </div>
            <div>Musicart </div>

            <div className='curentPath'>
              <Link to={"/home"}>Home</Link>
              {token ? <Link to={"/invoice"}>invoice</Link> : null}
            </div>
          </div>

          {(token && Name) ?
            <div className="rightHead">
              <div className='cart-box'>
                <Link to={"/cart"}>  <FontAwesomeIcon icon={faShoppingCart} />View Cart {cartItemCount}</Link>
              </div>
              <div className={`profile ${profileVisible ? 'active' : ''}`} onClick={toggleProfile}>
                {Name.charAt(0)}
                {Name.split(' ').length > 1 && Name.split(' ')[Name.split(' ').length - 1].charAt(0)}

                <div className="hoverbox">
                  <div className="content">
                    <div>{Name}</div>
                    <div onClick={HandleLogout}>
                      Logout
                    </div>
                  </div>
                </div>
              </div>

            </div> : null}

        </div>

      </section>

      <div className='above-banner search-box'>
        <img src="src\assets\search.png" alt="" />
        <input type="text" placeholder='Search by Product Name' onChange={handleSearch} />
      </div>

      <section>
        <div className='banner'>
          <div className='banner-content'>
            <p>Grab upto 50% off on
              Selected headphones</p>
            <img className='banner-image' src={image1} alt="" />
          </div>
        </div>

      </section>

      {/* section 2 starts here */}
      <section>

        <div className='section-2'>
          <div className='search-box'>
            <img src="src\assets\search.png" alt="" />
            <input type="text" placeholder='Search by Product Name' onChange={handleSearch} />
          </div>
          {/* all button start here */}
          <div className='all-buttons'>


            <div className='button-box grid-box' onClick={() => toggleLayout('grid')}>
              {
                layout == "grid" ? <img src={image3} /> : <img src={image6} />
              }

            </div>
            <div className='button-box list-box' onClick={() => toggleLayout('list')}>
              {
                layout == "list" ? <img src={image4} /> : <img src={image2} />
              }

            </div>


            <div className='button-box headphone'>
              <select onChange={(e) => { setHeadPhoneType(e.target.value) }}>
                <option value="">Headphone type</option>
                <option value="in-Ear">In-ear headphone</option>
                <option value="On-ear">On-ear headphone</option>
                <option value="Over-ear">Over-ear headphone</option>
              </select>
            </div>

            <div className='button-box comapny'>
              <select onChange={(e) => { setCompanyType(e.target.value) }}>
                <option value="">Company</option>
                <option value="JBL">JBL</option>
                <option value="Apple">Apple</option>
                <option value="Sony">Sony</option>
                <option value="others">Others</option>
                <option value="boult">Boult</option>
                <option value="lg">Lg</option>
              </select>
            </div>

            <div className='button-box color'>
              <select onChange={(e) => { setColorType(e.target.value) }} >
                <option value="">Colour</option>
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="black">Black</option>
                <option value="pink">Pink</option>
                <option value="yellow">Yellow</option>
                <option value="white">White</option>
                <option value="brown">Brown</option>
              </select>
            </div>

            <div className='button-box price'>
              <select onChange={(e) => { setPrice(e.target.value) }}>
                <option value="">Price</option>
                <option value="₹0 - ₹1,000">₹0 - ₹1,000</option>
                <option value="₹1,000 - ₹10,000">₹1,000 - ₹10,000</option>
                <option value="₹10,000 - ₹20,000">₹10,000 - ₹20,000</option>
              </select>
            </div>

            <div className='button-box sorting'>
              <select onChange={(e) => { SetsortBy(e.target.value) }}>
                <option value="">Sort by : Featured</option>
                <option value="lowestPrice">Price : Lowest</option>
                <option value="highestPrice">Price : Highest</option>
                <option value="aToZ">Name : (A-Z)</option>
                <option value="zToA">Name : (Z-A)</option>
              </select>
            </div>
          </div>
          {/* all button end here */}
        </div>
      </section>
      {/* section 2 Ends here */}

      {products.length === 0 ? (
        <div className="loading"></div>
      ) : (
        <section>

          <div className={` ${layout === 'grid' ? 'grid-view' : 'list-view'}`}>
            {products.map((product) => (
              <div className={`${layout === 'grid' ? 'grid-item' : 'list-item'}`} key={product._id}>
                <div className="listimage">
                  <img src={product.imageUrl} alt="#" onClick={() => handleNavigate(product._id)} />
                  <div className='cart-icon-image' onClick={() => { addToCart(product._id) }}>
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </div>
                </div>
                <div className={`${layout === 'grid' ? 'grid-description' : 'list-description'}`}>
                  <p className='list-title'> <strong>{product.company} {product.name}</strong> </p>
                  {layout === 'list' ? <p>{product.description}</p> : null}
                  <span className='list-price'>Price - {product.price}</span>
                  <p className='list-category'>{product.color} | {product.headphone_type}</p>

                  {layout === 'list' ? <div className='view-button' onClick={() => handleNavigate(product._id)}>Details</div> : null}
                </div>
              </div>
            ))}
          </div>

        </section >

      )}

      {!token ? null :
        <div className="feedback-container">
          <div className="feedback-icon" onClick={toggleFeedbackForm}>
            <FontAwesomeIcon icon={faQuestionCircle} size='3x' />
          </div>

          {showFeedbackForm && (
            <div className="feedback-form">
              <h1>Type of feedback</h1>
              <div className='select-option'>
                <select defaultValue="choose" onChange={(e) => setFeedbackType(e.target.value)}>
                  <option disabled value="choose">Choose the type</option>
                  <option value="bugs">Bugs</option>
                  <option value="feedback">Feedback</option>
                  <option value="query">Query</option>
                </select>
              </div>
              <div>
                <textarea placeholder='Enter your feedback...' rows="4" cols="50"
                  onChange={(e) => setMessage(e.target.value)}

                />
              </div>
              <div className="btn">
                {error && <div className="error">{error}</div>}
                <button onClick={handleFeedBacksubmit}>Submit</button>
              </div>
            </div>

          )}
        </div>

      }
    </>
  )
}

export default Products