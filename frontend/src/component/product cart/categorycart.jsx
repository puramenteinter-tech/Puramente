import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../../baseurl";
import { Link } from "react-router-dom";
import { useCart } from "../newcomponent/cartcontext";
import { Helmet } from "react-helmet-async";
import { Isauthanticate } from "../authantication/isauthanticat";

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState("all");
  const productsPerPage = 16;

  const { addToCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BaseURL}/api/products/category/${category}/paginated?filter=${activeTab}&page=${currentPage}&limit=${productsPerPage}`
        );
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    const savedCart = localStorage.getItem("cart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    setAddedProducts(parsedCart.map((item) => item._id));
    const qtyMap = {};
    parsedCart.forEach((item) => {
      qtyMap[item._id] = item.quantity || 1;
    });
    setQuantities(qtyMap);
  }, [category, activeTab, currentPage]);

  useEffect(() => {
    // Reset to first page when changing tabs or category
    setCurrentPage(1);
  }, [activeTab, category]);

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedProducts((prev) => [...prev, product._id]);
    setQuantities((prev) => ({ ...prev, [product._id]: 1 }));
  };

  const handleRemoveFromCart = (_id) => {
    removeFromCart(_id);
    setAddedProducts((prev) => prev.filter((id) => id !== _id));
    setQuantities((prev) => {
      const copy = { ...prev };
      delete copy[_id];
      return copy;
    });
  };

  const incrementQuantity = (_id) => {
    const newQty = (quantities[_id] || 1) + 1;
    setQuantities((prev) => ({ ...prev, [_id]: newQty }));
    updateQuantity(_id, newQty);
  };

  const decrementQuantity = (_id) => {
    const newQty = Math.max(1, (quantities[_id] || 1) - 1);
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

  const currentProducts = products;

  const goToPage = (pageNumber) => {
    if (pageNumber > 1 && !Isauthanticate()) {
      navigate("/login", { replace: false, state: { from: window.location.pathname } });
      return;
    }
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>{`${category} Jewelry | Puramente Jewel`}</title>
        <meta name="description" content={`Shop ${category} jewelry from Puramente Jewel International. Handcrafted elegance shipped worldwide.`} />
        <meta name="keywords" content={`${category} jewelry, ${category} pendants, ${category} rings`} />
      </Helmet>

      <h1 className="text-3xl font-bold text-center capitalize mb-6">{category}</h1>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              activeTab === "all" ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveTab("with")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              activeTab === "with" ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            With Gemstone
          </button>
          <button
            onClick={() => setActiveTab("without")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
              activeTab === "without" ? "bg-cyan-600 text-white" : "text-gray-700 hover:bg-gray-200"
            }`}
          >
            Without Gemstone
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-cyan-600 border-opacity-60"></div>
        </div>
      )}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && currentProducts.length === 0 && (
        <p className="text-center">No products found in this category.</p>
      )}

      {!loading && !error && currentProducts.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
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
                      className="w-full object-contain h-full rounded-lg transform hover:scale-105 transition-all duration-500"
                    />
                  </Link>
                  <span className="absolute top-3 left-3 bg-cyan-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse">
                    New
                  </span>
                </div>

                <div className="mt-6 text-center">
                  <h3 className="text-sm lg:text-xl font-bold text-cyan-800 line-clamp-1 tracking-tight">
                    {product.name}
                  </h3>
                  <p className="text-sm text-cyan-600 mt-1">{product.category}</p>
                  <p className="text-xs text-cyan-500 mt-2 font-medium">
                    Design Code: <span className="font-semibold">{product.code}</span>
                  </p>

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
                          min="1"
                          value={quantities[product._id] || 1}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (!isNaN(val) && val >= 1) {
                              setQuantities((prev) => ({
                                ...prev,
                                [product._id]: val,
                              }));
                              updateQuantity(product._id, val);
                            }
                          }}
                          className="w-12 text-center border border-cyan-300 rounded-md text-cyan-800 font-semibold"
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
                        className="mt-2 w-full bg-cyan-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2 flex-wrap">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-cyan-200 hover:bg-cyan-300 text-cyan-800 font-semibold rounded disabled:opacity-50"
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    currentPage === i + 1
                      ? "bg-cyan-600 text-white"
                      : "bg-cyan-100 text-cyan-800 hover:bg-cyan-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-cyan-200 hover:bg-cyan-300 text-cyan-800 font-semibold rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}