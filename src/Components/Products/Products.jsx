import React, { useEffect, useState } from "react";
import { faShoppingCart, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import bannerImage from "../../assets/bannerimg.png";
import listButton from "../../assets/listButton.png";
import gridButtonActive from "../../assets/gridButton1.png";
import listButtonActive from "../../assets/listButton1.png";
import logoImage from "../../assets/image 4.png";
import gridButton from "../../assets/gridButton.png";
import searchIcon from "../../assets/search.png";
import "./product.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import baseUrl from "../../../api";
import toast, { Toaster } from "react-hot-toast";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [headPhoneType, setHeadPhoneType] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [colorType, setColorType] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [layout, setLayout] = useState("grid");
  const [profileVisible, setProfileVisible] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackType, setFeedbackType] = useState("");
  const [message, setMessage] = useState("");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let name = localStorage.getItem("name");

  if (name) {
    name = name.toUpperCase();
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/product/getall?name=${search}&color=${colorType}&company=${companyType}&headphone_type=${headPhoneType}&sortBy=${sortBy}`
        );
        setProducts(res.data.products || []);
      } catch (err) {
        console.error("Products fetch error:", err);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [search, colorType, companyType, headPhoneType, sortBy]);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        if (!token) {
          setCartItemCount(0);
          return;
        }

        const response = await axios.get(`${baseUrl}/cart/count`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItemCount(response.data.count || 0);
      } catch (error) {
        console.error("Cart count error:", error);
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [token]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleNavigate = (id) => {
    navigate(`/product/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    navigate("/home");
  };

  const handleFeedbackSubmit = async () => {
    if (!feedbackType || !message) {
      setError("Please fill all the fields");
      return;
    }

    try {
      await axios.post(
        `${baseUrl}/feedback/create`,
        { type: feedbackType, message },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Feedback saved successfully");
      setShowFeedbackForm(false);
      setFeedbackType("");
      setMessage("");
      setError("");
    } catch (error) {
      console.error("Feedback error:", error);
    }
  };

  const addToCart = async (id) => {
    try {
      if (!token) {
        navigate("/login");
        return;
      }

      await axios.post(
        `${baseUrl}/cart/add`,
        {
          productId: id,
          quantity: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCartItemCount((prev) => prev + 1);
      toast.success("Item added to cart");
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={false} />

      <section className="section-head">
        <div className="Head">
          <div className="Head-content">
            <div>
              <img src={logoImage} alt="Musicart" />
            </div>
            <div>Musicart</div>

            <div className="curentPath">
              <Link to="/home">Home</Link>
              {token ? <Link to="/invoice">invoice</Link> : null}
            </div>
          </div>

          {token && name ? (
            <div className="rightHead">
              <div className="cart-box">
                <Link to="/cart">
                  <FontAwesomeIcon icon={faShoppingCart} />
                  View Cart {cartItemCount}
                </Link>
              </div>

              <div
                className={`profile ${profileVisible ? "active" : ""}`}
                onClick={() => setProfileVisible(!profileVisible)}
              >
                {name.charAt(0)}
                {name.split(" ").length > 1
                  ? name.split(" ")[name.split(" ").length - 1].charAt(0)
                  : ""}

                <div className="hoverbox">
                  <div className="content">
                    <div>{name}</div>
                    <div onClick={handleLogout}>Logout</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <div className="above-banner search-box">
        <img src={searchIcon} alt="Search" />
        <input
          type="text"
          placeholder="Search by Product Name"
          onChange={handleSearch}
        />
      </div>

      <section>
        <div className="banner">
          <div className="banner-content">
            <p>Grab upto 50% off on Selected headphones</p>
            <img className="banner-image" src={bannerImage} alt="Banner" />
          </div>
        </div>
      </section>

      <section>
        <div className="section-2">
          <div className="search-box">
            <img src={searchIcon} alt="Search" />
            <input
              type="text"
              placeholder="Search by Product Name"
              onChange={handleSearch}
            />
          </div>

          <div className="all-buttons">
            <div className="button-box grid-box" onClick={() => setLayout("grid")}>
              {layout === "grid" ? <img src={gridButtonActive} alt="Grid" /> : <img src={gridButton} alt="Grid" />}
            </div>

            <div className="button-box list-box" onClick={() => setLayout("list")}>
              {layout === "list" ? <img src={listButtonActive} alt="List" /> : <img src={listButton} alt="List" />}
            </div>

            <div className="button-box headphone">
              <select onChange={(e) => setHeadPhoneType(e.target.value)}>
                <option value="">Headphone type</option>
                <option value="in-Ear">In-ear headphone</option>
                <option value="On-ear">On-ear headphone</option>
                <option value="Over-ear">Over-ear headphone</option>
              </select>
            </div>

            <div className="button-box comapny">
              <select onChange={(e) => setCompanyType(e.target.value)}>
                <option value="">Company</option>
                <option value="JBL">JBL</option>
                <option value="Apple">Apple</option>
                <option value="Sony">Sony</option>
                <option value="others">Others</option>
                <option value="boult">Boult</option>
                <option value="lg">Lg</option>
              </select>
            </div>

            <div className="button-box color">
              <select onChange={(e) => setColorType(e.target.value)}>
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

            <div className="button-box sorting">
              <select onChange={(e) => setSortBy(e.target.value)}>
                <option value="">Sort by : Featured</option>
                <option value="lowestPrice">Price : Lowest</option>
                <option value="highestPrice">Price : Highest</option>
                <option value="aToZ">Name : (A-Z)</option>
                <option value="zToA">Name : (Z-A)</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {products.length === 0 ? (
        <div className="loading"></div>
      ) : (
        <section>
          <div className={layout === "grid" ? "grid-view" : "list-view"}>
            {products.map((product) => (
              <div
                className={layout === "grid" ? "grid-item" : "list-item"}
                key={product._id}
              >
                <div className="listimage">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onClick={() => handleNavigate(product._id)}
                  />
                  <div
                    className="cart-icon-image"
                    onClick={() => addToCart(product._id)}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                  </div>
                </div>

                <div
                  className={
                    layout === "grid" ? "grid-description" : "list-description"
                  }
                >
                  <p className="list-title">
                    <strong>
                      {product.company} {product.name}
                    </strong>
                  </p>

                  {layout === "list" ? <p>{product.description}</p> : null}

                  <span className="list-price">Price - {product.price}</span>
                  <p className="list-category">
                    {product.color} | {product.headphoneType}
                  </p>

                  {layout === "list" ? (
                    <div
                      className="view-button"
                      onClick={() => handleNavigate(product._id)}
                    >
                      Details
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {token ? (
        <div className="feedback-container">
          <div
            className="feedback-icon"
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
          >
            <FontAwesomeIcon icon={faQuestionCircle} size="3x" />
          </div>

          {showFeedbackForm && (
            <div className="feedback-form">
              <h1>Type of feedback</h1>

              <div className="select-option">
                <select
                  defaultValue="choose"
                  onChange={(e) => setFeedbackType(e.target.value)}
                >
                  <option disabled value="choose">
                    Choose the type
                  </option>
                  <option value="bugs">Bugs</option>
                  <option value="feedback">Feedback</option>
                  <option value="query">Query</option>
                </select>
              </div>

              <div>
                <textarea
                  placeholder="Enter your feedback..."
                  rows="4"
                  cols="50"
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div className="btn">
                {error && <div className="error">{error}</div>}
                <button onClick={handleFeedbackSubmit}>Submit</button>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  );
};

export default Products;