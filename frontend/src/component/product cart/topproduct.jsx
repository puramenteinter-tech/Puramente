import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BaseURL from "../../baseurl";
import { useCart } from "../newcomponent/cartcontext";

const TopProduct = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const [addedProducts, setAddedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/products`);
        const top = response.data.slice(0, 4);
        setTopProducts(top);

        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setAddedProducts(savedCart.map((item) => item._id));

        const initialQty = {};
        savedCart.forEach((item) => {
          initialQty[item._id] = item.quantity || 1;
        });
        setQuantities(initialQty);
      } catch (err) {
        console.error("Error fetching top products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
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
    const newQty = (quantities[_id] || 0) + 1;
    setQuantities((prev) => ({ ...prev, [_id]: newQty }));
    updateQuantity(_id, newQty);
  };

  const decrementQuantity = (_id) => {
    const newQty = Math.max((quantities[_id] || 1) - 1, 0);
    setQuantities((prev) => ({ ...prev, [_id]: newQty }));
    updateQuantity(_id, newQty);
  };

  const getImageSrc = (product) => {
    if (product.imageUrl) return product.imageUrl;
    if (product.imageurl) return product.imageurl;
    if (product.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_600,h_600,q_auto:best,f_auto,dpr_2.0/${product.cloudinaryId}`;
    }
    return "/default-placeholder.jpg";
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-40">
        <div className="w-10 h-10 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
      </div>
    );

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-cyan-50 to-cyan-100">
      <h2 className="text-3xl font-bold text-center text-cyan-700 mb-8">
        Top Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {topProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-cyan-100 flex flex-col"
          >
            <Link to={`/singleproduct/${product._id}`}>
              <img
                src={getImageSrc(product)}
                alt={product.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
            </Link>

            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-bold text-cyan-900 mb-2">
                {product.name}
              </h3>
              <span className="text-sm text-cyan-700 mb-4">
                {product.category}
              </span>

              {addedProducts.includes(product._id) ? (
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-cyan-700">
                      Qty:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(product._id)}
                        className="bg-cyan-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shadow hover:bg-cyan-700 transition-all"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantities[product._id] || 0}
                        min="0"
                        onChange={(e) => {
                          const newQty = Math.max(Number(e.target.value), 0);
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
                  className="mt-auto bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-xs font-bold py-2 rounded shadow hover:from-cyan-600 hover:to-teal-600 transition-all"
                >
                  Add To Enquiry List
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProduct;
