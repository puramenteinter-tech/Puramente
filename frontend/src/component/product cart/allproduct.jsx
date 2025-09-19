import { useState, useEffect, useRef } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;
  const productListRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/products`);
        setProducts(response.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const savedCart = sessionStorage.getItem("cart");
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

  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setTimeout(() => {
      productListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };
  const getImageSrc = (product) => {
  if (product.cloudinaryId) {
    return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_400,h_400,q_auto,f_auto/${product.cloudinaryId}`;
  }

  if (product.imageurl && product.imageurl.startsWith("http")) {
    return product.imageurl;
  }

  return "/default-placeholder.jpg"; // 🔄 Optional fallback
};

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-12 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 min-h-screen">
      <div className="w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-cyan-600 tracking-tight">The Latest Gems</h1>
        <p className="text-lg font-medium text-cyan-800 mt-2 italic max-w-2xl mx-auto">
          “Exquisite craftsmanship meets timeless elegance – shop our stunning jewelry collection today!”
        </p>
      </div>

      {loading && <p className="text-center text-cyan-700 font-semibold">Loading products...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Product List */}
      <div ref={productListRef} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {currentProducts.map((product) => (
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
                  alt={product.name}
                  className="w-full h-full object-contain rounded-lg transform hover:scale-105 transition-all duration-500"
                />
              </Link>
              <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                New
              </span>
            </div>

            <div className="mt-6 text-center">
              <Link to={`/singleproduct/${product._id}`}>
                <h3 className="text-xl line-clamp-1 font-bold text-cyan-800 tracking-tight">{product.name}</h3>
                <p className="text-sm text-cyan-600 mt-1">{product.category}</p>
                <p className="text-xs text-cyan-500 mt-2 font-medium">Design Code: {product.code}</p>
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
                    <span className="font-semibold text-cyan-700">
                      {quantities[product._id] || 1}
                    </span>
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
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-8">
          {currentPage > 1 && (
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-md font-semibold hover:bg-cyan-600"
            >
              Previous
            </button>
          )}
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg shadow-md font-semibold ${
                currentPage === i + 1 ? "bg-cyan-700 text-white" : "bg-cyan-500 text-white hover:bg-cyan-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
          {currentPage < totalPages && (
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow-md font-semibold hover:bg-cyan-600"
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductCard;
