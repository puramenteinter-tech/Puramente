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
    if (product.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${product.cloudinaryId}`;
    }
    if (product.imageurl && product.imageurl.startsWith("http")) {
      return product.imageurl;
    }
    return "/default-placeholder.jpg";
  };

  return (
    <div
      data-aos="fade-down"
      data-aos-duration="600"
      className="py-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 min-h-screen"
    >
      <div className="w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-cyan-600 tracking-tight">
          Our Latest Collection
        </h1>
        <p className="text-lg font-medium text-cyan-800 mt-2 italic max-w-2xl mx-auto">
          “Exquisite craftsmanship meets timeless elegance from the best jewellery manufacturers in India.”
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-12 h-12 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {products.slice(0, visibleProducts).map((product) => (
            <div
              key={product._id}
              className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 relative overflow-hidden"
              data-aos="zoom-in"
              data-aos-duration="500"
            >
              <div className="relative w-full h-36">
                <Link to={`/singleproduct/${product._id}`}>
                 <img
  src={getImageSrc(product)}
  alt={`${product.name} – ${product.category} by Puramente | fashion jewellery wholesale suppliers in India`}
  className="w-full h-full object-contain rounded-lg transform hover:scale-105 transition-all duration-500"
/>

                </Link>
                <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                  New
                </span>
              </div>

              <div className="mt-6 text-center">
                <Link to={`/singleproduct/${product._id}`}>
                  <h3 className="text-lg line-clamp-1 font-bold text-cyan-800 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-cyan-600 mt-1">
                    {product.category}
                  </p>
                  <p className="text-xs text-cyan-500 mt-2 font-medium">
                    Design Code: {product.code}
                  </p>
                </Link>

                {addedProducts.includes(product._id) ? (
                  <>
                    <div className="mt-4 flex justify-center items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(product._id)}
                        className="bg-cyan-600 text-white px-3 py-1 rounded-full shadow hover:bg-cyan-700"
                      >
                        -
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
                        className="w-16 text-center py-1 px-2 border border-cyan-600 rounded-md"
                      />
                      <button
                        onClick={() => incrementQuantity(product._id)}
                        className="bg-cyan-600 text-white px-3 py-1 rounded-full shadow hover:bg-cyan-700"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(product._id)}
                      className="mt-2 w-full bg-cyan-500 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Remove Item
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="mt-4 w-full bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Add To List
                  </button>
                )}
              </div>

              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-100 rounded-full -mr-12 -mt-12 opacity-50" />
            </div>
          ))}
        </div>
      )}

      {products.length > visibleProducts && (
        <div className="text-center mt-8">
          <Link
            to="/shopall"
            className="bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
          >
            Explore More
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
