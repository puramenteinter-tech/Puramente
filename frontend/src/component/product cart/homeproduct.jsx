import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import BaseURL from "../../baseurl";
import { useCart } from "../newcomponent/cartcontext";

AOS.init();

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const [addedProducts, setAddedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const visibleProducts = 8;

  useEffect(() => {
    let retryCount = 0;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/products`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        retryCount++;
        if (retryCount < 3) {
          setTimeout(fetchProducts, 1000);
        } else {
          setError("Failed to load products. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const savedCart = localStorage.getItem("cart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    setAddedProducts(parsedCart.map((item) => item._id));

    const initialQuantities = {};
    parsedCart.forEach((item) => {
      initialQuantities[item._id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProducts((prev) => [...prev, product._id]);
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
  };

  const handleRemoveFromCart = (_id) => {
    removeFromCart(_id);
    setAddedProducts((prev) => prev.filter((id) => id !== _id));
    setQuantities((prev) => {
      const { [_id]: _, ...rest } = prev;
      return rest;
    });
  };

  const incrementQuantity = (_id) => {
    const newQty = (quantities[_id] || 1) + 1;
    setQuantities((prev) => ({ ...prev, [_id]: newQty }));
    updateQuantity(_id, newQty);
  };

  const decrementQuantity = (_id) => {
    const newQty = Math.max((quantities[_id] || 1) - 1, 1);
    setQuantities((prev) => ({ ...prev, [_id]: newQty }));
    updateQuantity(_id, newQty);
  };

  const getImageSrc = (product) => {
    if (product?.imageUrl) return product.imageUrl;
    if (product?.imageurl) return product.imageurl;
    if (product?.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_600,h_400,q_auto:best,f_auto,dpr_2.0/${product.cloudinaryId}`;
    }
    return "/default-placeholder.jpg";
  };

  return (
    <div
      data-aos="fade-down"
      data-aos-duration="600"
      className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 min-h-screen"
    >
      <div className="w-full text-center mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-600 tracking-tight">
          Our Latest Collection
        </h1>
        <p className="text-md font-medium text-cyan-800 mt-2 italic max-w-2xl mx-auto">
          "Exquisite craftsmanship meets timeless elegance from the best jewellery manufacturers in India."
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {products.slice(0, visibleProducts).map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col h-full border border-cyan-100"
              data-aos="zoom-in"
              data-aos-duration="500"
            >
              {/* Image Section - Full Width & Height */}
              <div className="relative w-full h-56 p-0 bg-gradient-to-br from-cyan-50 to-white">
                <Link to={`/singleproduct/${product._id}`} className="block w-full h-full">
                  <img
                    src={getImageSrc(product)}
                    alt={`${product.name} – ${product.category} by Puramente | fashion jewellery wholesale suppliers in India`}
                    className="w-full h-full object-cover rounded-t-xl transition-all duration-300 hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = "/default-placeholder.jpg";
                    }}
                  />
                </Link>
                <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  New
                </span>
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow p-4">
                <Link to={`/singleproduct/${product._id}`} className="flex-grow mb-3">
                  <h3 className="text-lg font-bold text-cyan-900 tracking-tight leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h3>
                  
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-1 rounded">
                      {product.category}
                    </span>
                    <span className="text-xs text-cyan-600 font-mono bg-white px-2 py-1 rounded border">
                      SKU: {product.code || "N/A"}
                    </span>
                  </div>
                </Link>

                {/* Cart Actions */}
                <div className="mt-auto pt-3 border-t border-cyan-100">
                  {addedProducts.includes(product._id) ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-cyan-700">Qty:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => decrementQuantity(product._id)}
                            className="bg-cyan-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow hover:bg-cyan-700 transition-all"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={quantities[product._id] || 1}
                            min="1"
                            onChange={(e) => {
                              const newQty = Math.max(Number(e.target.value), 1);
                              setQuantities((prev) => ({
                                ...prev,
                                [product._id]: newQty,
                              }));
                              updateQuantity(product._id, newQty);
                            }}
                            className="w-12 text-center py-1 border border-cyan-200 rounded text-xs font-bold text-cyan-800"
                          />
                          <button
                            onClick={() => incrementQuantity(product._id)}
                            className="bg-cyan-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow hover:bg-cyan-700 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFromCart(product._id)}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold py-2 rounded shadow hover:from-red-600 hover:to-red-700 transition-all"
                      >
                        Remove from List
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold py-2 rounded shadow hover:from-cyan-600 hover:to-teal-600 transition-all"
                    >
                      Add To Enquiry List
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {products.length > visibleProducts && (
        <div className="text-center mt-12">
          <Link
            to="/shopall"
            className="inline-block bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold py-3 px-8 rounded-lg shadow hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
          >
            View All Products ({products.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;