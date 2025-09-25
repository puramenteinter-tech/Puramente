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
    if (product?.imageUrl) return product.imageUrl;
    if (product?.imageurl) return product.imageurl;
    if (product?.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_600,h_600,q_auto:best,f_auto,dpr_2.0/${product.cloudinaryId}`;
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 min-h-screen">
      <Helmet>
        <title>{`${category} Jewelry | Puramente Jewel`}</title>
        <meta name="description" content={`Shop ${category} jewelry from Puramente Jewel International. Handcrafted elegance shipped worldwide.`} />
        <meta name="keywords" content={`${category} jewelry, ${category} pendants, ${category} rings`} />
      </Helmet>

      <div className="w-full text-center mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-600 tracking-tight capitalize">
          {category} Collection
        </h1>
        <p className="text-md font-medium text-cyan-800 mt-2 italic max-w-2xl mx-auto">
          "Exquisite {category} collection from the best jewellery manufacturers in India."
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-1 bg-cyan-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
              activeTab === "all" 
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow" 
                : "text-cyan-700 hover:bg-cyan-200"
            }`}
          >
            All {category}
          </button>
          <button
            onClick={() => setActiveTab("with")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
              activeTab === "with" 
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow" 
                : "text-cyan-700 hover:bg-cyan-200"
            }`}
          >
            With Gemstone
          </button>
          <button
            onClick={() => setActiveTab("without")}
            className={`px-4 py-2 text-sm font-bold rounded-lg transition-all duration-300 ${
              activeTab === "without" 
                ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow" 
                : "text-cyan-700 hover:bg-cyan-200"
            }`}
          >
            Without Gemstone
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : currentProducts.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center text-gray-500">
            <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
            <p className="text-sm">
              We couldn't find any products in this category.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col h-full border border-cyan-100"
              >
                {/* Image Section - Further Increased Height */}
                <div className="relative w-full h-90 p-0 bg-gradient-to-br from-cyan-50 to-white">
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

                {/* Content Section - Further Compressed */}
                <div className="flex flex-col flex-grow p-2">
                  <Link to={`/singleproduct/${product._id}`} className="flex-grow mb-1">
                    <h3 className="text-xs font-bold text-cyan-900 tracking-tight leading-tight line-clamp-2 min-h-[1.8rem]">
                      {product.name}
                    </h3>
                    
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-[10px] font-semibold text-cyan-700 bg-cyan-50 px-1.5 py-0.5 rounded">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-cyan-600 font-mono bg-white px-1 py-0.5 rounded border">
                        SKU: {product.code || "N/A"}
                      </span>
                    </div>
                  </Link>

                  {/* Cart Actions - Further Compressed */}
                  <div className="mt-auto pt-1 border-t border-cyan-100">
                    {addedProducts.includes(product._id) ? (
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-semibold text-cyan-700">Qty:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => decrementQuantity(product._id)}
                              className="bg-cyan-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow hover:bg-cyan-700 transition-all"
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
                              className="w-8 text-center py-0 border border-cyan-200 rounded text-xs font-bold text-cyan-800"
                            />
                            <button
                              onClick={() => incrementQuantity(product._id)}
                              className="bg-cyan-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shadow hover:bg-cyan-700 transition-all"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(product._id)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] font-bold py-1 rounded shadow hover:from-red-600 hover:to-red-700 transition-all"
                        >
                          Remove from List
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-[10px] font-bold py-1 rounded shadow hover:from-cyan-600 hover:to-teal-600 transition-all"
                      >
                        Add To Enquiry List
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg shadow font-bold hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 rounded-lg shadow font-bold transition-all ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white"
                      : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg shadow font-bold hover:from-cyan-600 hover:to-teal-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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