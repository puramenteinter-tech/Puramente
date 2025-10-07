import { useState, useEffect } from "react";
import axios from "axios";
import { useCart } from "./cartcontext";
import BaseURL from "../../baseurl";
import { useNavigate } from "react-router-dom";
import { Isauthanticate } from "../authantication/isauthanticat";
import Select from "react-select";
import { FlagIcon } from "react-flag-kit";

const countryOptions = [
  { value: "US", label: "United States", flag: "US" },
  { value: "IN", label: "India", flag: "IN" },
  { value: "GB", label: "United Kingdom", flag: "GB" },
  { value: "CA", label: "Canada", flag: "CA" },
  { value: "AU", label: "Australia", flag: "AU" },
  { value: "DE", label: "Germany", flag: "DE" },
  { value: "FR", label: "France", flag: "FR" },
  { value: "IT", label: "Italy", flag: "IT" },
  { value: "ES", label: "Spain", flag: "ES" },
  { value: "JP", label: "Japan", flag: "JP" },
  { value: "BR", label: "Brazil", flag: "BR" },
  { value: "CN", label: "China", flag: "CN" },
  { value: "RU", label: "Russia", flag: "RU" },
  { value: "ZA", label: "South Africa", flag: "ZA" },
  { value: "MX", label: "Mexico", flag: "MX" },
  { value: "KR", label: "South Korea", flag: "KR" },
  { value: "SG", label: "Singapore", flag: "SG" },
  { value: "CH", label: "Switzerland", flag: "CH" },
  { value: "AT", label: "Austria", flag: "AT" },
  { value: "PT", label: "Portugal", flag: "PT" },
  { value: "DK", label: "Denmark", flag: "DK" },
  { value: "SE", label: "Sweden", flag: "SE" },
  { value: "AR", label: "Argentina", flag: "AR" },
  { value: "NO", label: "Norway", flag: "NO" },
  { value: "NZ", label: "New Zealand", flag: "NZ" },
  { value: "NL", label: "Netherlands", flag: "NL" },
  { value: "TR", label: "Turkey", flag: "TR" },
  { value: "IL", label: "Israel", flag: "IL" },
  { value: "PL", label: "Poland", flag: "PL" },
  { value: "RO", label: "Romania", flag: "RO" },
  { value: "GR", label: "Greece", flag: "GR" },
  { value: "HU", label: "Hungary", flag: "HU" },
  { value: "IE", label: "Ireland", flag: "IE" },
  { value: "LT", label: "Lithuania", flag: "LT" },
  { value: "LU", label: "Luxembourg", flag: "LU" },
  { value: "MC", label: "Monaco", flag: "MC" },
];

const Checkout = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const [showPopup, setShowPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    email: "",
    contactNumber: "",
    message: "",
    companyName: "",
    country: "",
    companyWebsite: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!Isauthanticate()) {
      navigate("/login", { replace: false, state: { from: "/cart" } });
    }
  }, []);

  // Form field handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryChange = (selectedOption) => {
    setFormData(prev => ({
      ...prev,
      country: selectedOption ? selectedOption.value : ""
    }));
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: "" }));
    }
  };

  // Cart item handlers
const handleQuantityChange = (id, value) => {
  const quantity = Math.max(0, value); // allow 0
  if (quantity === 0) {
    removeFromCart(id); // ✅ remove when reaches 0
    return;
  }
  updateQuantity(id, quantity);
};


  const handleRemoveItem = (id) => {
    removeFromCart(id);
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

 // Image handling
 const getImageSrc = (product) => {
  if (product?.imageUrl) return product.imageUrl;
  if (product?.imageurl) return product.imageurl;
  if (product?.cloudinaryId) {
    return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_400,h_400,q_auto:good,f_auto/${product.cloudinaryId}`;
  }
  return "/default-placeholder.jpg"; // fallback
};

  // Form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true); // Start submission
  
  console.log("--- SUBMITTING ORDER ---");
  console.log("Form Data:", formData);
  console.log("Cart Items:", cartItems);

  try {
    // Enforce login before placing order
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: false, state: { from: "/cart" } });
      setIsSubmitting(false);
      return;
    }

    const payload = {
      ...formData,
      orderDetails: cartItems.map(item => ({
        productId: item._id,
        name: item.name,
        sku: item.code,
        quantity: item.quantity,
        imageUrl: item.imageUrl || null,
        cloudinaryId: item.cloudinaryId || null
      }))
    };

    console.log("Full Request Payload:", payload);

   const response = await axios.post(
      `${BaseURL}/api/orders/submit-order`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Server Response:", response.data);
      // Clear cart and show success
       clearCart();
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
      navigate("/");
    }, 3000);
    
  } catch (error) {
    console.error("!!! REQUEST FAILED !!!", error);
    if (error?.response?.status === 401) {
      alert("Please login to place your order.");
      navigate("/login", { replace: false, state: { from: "/cart" } });
    } else {
      alert("Failed to submit order. Please try again.");
    }
    
  } finally {
    setIsSubmitting(false); // Always reset submission state
  }

    
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-cyan-50 to-cyan-100 py-12 px-4 sm:px-6 lg:px-12">
      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold text-center text-green-600">
              Your price request form has been submitted successfully.! 🎉
            </h2>
            <p className="mt-4 text-center">
             We'll update you soon with shipping details. Thank you for shopping with us!.
            </p>
            <button
              onClick={() => {
                setShowPopup(false);
                navigate("/");
              }}
              className="mt-6 w-full bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 shadow-2xl rounded-3xl overflow-hidden bg-white">
        {/* Cart Items Section */}
        <div className="lg:w-1/2 p-6 bg-gradient-to-br from-white to-cyan-50">
          <h2 className="text-2xl font-bold text-cyan-600 mb-6">Your Cart</h2>
          
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Your cart is empty</p>
              <button
                onClick={() => navigate("/")}
                className="mt-4 text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Browse Products
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
                  <img
                    src={getImageSrc(item)} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500">SKU: {item.code}</p>
                  </div>
             <div className="flex items-center gap-2">
  <button
    onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
    className="w-8 h-8 flex items-center justify-center bg-cyan-100 text-cyan-600 rounded-full"
  >
    -
  </button>
  <input
    type="number"
    min="0" // ✅ allow 0
    value={item.quantity}
    onChange={(e) =>
      handleQuantityChange(item._id, parseInt(e.target.value) || 0)
    }
    className="w-12 text-center border border-gray-300 rounded py-1"
  />
  <button
    onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
    className="w-8 h-8 flex items-center justify-center bg-cyan-100 text-cyan-600 rounded-full"
  >
    +
  </button>
</div>

                  <button
                    onClick={() => handleRemoveItem(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Form Section */}
        <div className="lg:w-1/2 p-6 bg-white">
          <h2 className="text-2xl font-bold text-cyan-600 mb-6">Price Request Form</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number *
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg ${errors.contactNumber ? 'border-red-500' : 'border-gray-300'}`}
                required
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Country *
  </label>
  <Select
    options={countryOptions}
    onChange={handleCountryChange}
    value={countryOptions.find(opt => opt.value === formData.country)}
    placeholder="Select Country"
    className={`border rounded-lg ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
    styles={{
      control: (base) => ({
        ...base,
        minHeight: '42px',
        borderColor: errors.country ? '#ef4444' : '#d1d5db',
        '&:hover': {
          borderColor: errors.country ? '#ef4444' : '#9ca3af'
        }
      }),
      option: (styles) => ({
        ...styles,
        display: 'flex',
        alignItems: 'center'
      }),
      singleValue: (styles) => ({
        ...styles,
        display: 'flex',
        alignItems: 'center'
      })
    }}
    formatOptionLabel={(option) => (
      <div className="flex items-center">
        <FlagIcon 
          code={option.flag} 
          size={16} 
          className="mr-2"
        />
        <span>{option.label}</span>
      </div>
    )}
    required
  />
  {errors.country && (
    <p className="mt-1 text-sm text-red-500">{errors.country}</p>
  )}
</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Website
              </label>
              <input
                type="url"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              ></textarea>
            </div>

          <button
  type="submit"
  disabled={isSubmitting || cartItems.length === 0}
  className={`w-full py-3 px-4 bg-cyan-500 text-white font-medium rounded-lg hover:bg-cyan-600 transition ${
    (isSubmitting || cartItems.length === 0) ? 'opacity-50 cursor-not-allowed' : ''
  }`}
>
  {isSubmitting ? (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Submitting...
    </span>
  ) : (
    'Place Order'
  )}
</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout;