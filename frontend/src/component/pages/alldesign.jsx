import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import BaseURL from "../../baseurl";
import { useCart } from "../newcomponent/cartcontext";
import { Isauthanticate } from "../authantication/isauthanticat";

AOS.init();

const AllDesigns = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart, updateQuantity, removeFromCart } = useCart();
  const [addedProducts, setAddedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 16;

  useEffect(() => {
    let retryCount = 0;
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/products`);
        setProducts(response.data);
        setError(null);
      } catch (err) {
        retryCount++;
        if (retryCount < 3) setTimeout(fetchProducts, 1000);
        else setError("Failed to load products. Please try again.");
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
  setQuantities((prev) => ({ ...prev, [product._id]: 0 })); // start at 0
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
  const newQty = Math.max((quantities[_id] || 0) - 1, 0);
  setQuantities((prev) => ({ ...prev, [_id]: newQty }));
  updateQuantity(_id, newQty);
  if (newQty === 0) handleRemoveFromCart(_id);
};


  const getImageSrc = (product) => {
    if (product?.cloudinaryId)
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_500,h_600,q_auto:best,f_auto,dpr_2.0/${product.cloudinaryId}`;
    if (product?.imageUrl) return product.imageUrl;
    if (product?.imageurl?.startsWith("http")) return product.imageurl;
    return "/default-placeholder.jpg";
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const pagesPerGroup = 5;
  const startPage = Math.floor((currentPage - 1) / pagesPerGroup) * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) visiblePages.push(i);

  const goToPage = (pageNumber) => {
    if (pageNumber > 1 && !Isauthanticate()) {
      navigate("/login", { replace: true, state: { from: window.location.pathname } });
      return;
    }
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      data-aos="fade-down"
      data-aos-duration="600"
      className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 min-h-screen"
    >
      <div className="w-full text-center mb-10">
        <h1 className="text-3xl font-extrabold text-cyan-600 tracking-tight">
          All Jewellery Designs
        </h1>
        <p className="text-md font-medium text-cyan-800 mt-2 italic max-w-2xl mx-auto">
          Browse our complete jewellery collection crafted with precision and passion.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="w-10 h-10 border-4 border-cyan-600 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <>
          {/* ✅ Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {currentProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col h-full border border-cyan-100 overflow-hidden"
                data-aos="zoom-in"
              >
                <div
                  className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-cyan-50 to-white"
                  style={{ height: 360 }}
                >
                  <Link
                    to={`/singleproduct/${product._id}`}
                    className="block w-full h-full overflow-hidden rounded-xl flex items-center justify-center"
                  >
                    <img
                      src={getImageSrc(product)}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => (e.target.src = "/default-placeholder.jpg")}
                      loading="lazy"
                    />
                  </Link>

                  <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    New
                  </span>
                </div>

                <div className="flex flex-col flex-grow p-4">
                  <Link to={`/singleproduct/${product._id}`} className="flex-grow mb-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm sm:text-base font-bold text-cyan-900 leading-tight line-clamp-2 pr-2">
                        {product.name}
                      </h3>
                      <span className="text-[10px] sm:text-xs text-cyan-600 font-mono bg-white px-1.5 py-0.5 rounded border">
                        {product.code || "N/A"}
                      </span>
                    </div>
                  </Link>

                  {/* Enquiry Section */}
                  <div className="mt-auto pt-2 border-t border-cyan-100">
                    {addedProducts.includes(product._id) ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-semibold text-cyan-700">Qty:</span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => decrementQuantity(product._id)}
                              className="bg-cyan-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold shadow hover:bg-cyan-700 transition-all cursor-pointer"
                            >
                              −
                            </button>
 <input
  type="number"
  value={quantities[product._id] || 0}
  min="0"
  onChange={(e) => {
    const newQty = Math.max(0, Number(e.target.value));
    setQuantities((prev) => ({ ...prev, [product._id]: newQty }));
    updateQuantity(product._id, newQty);
    if (newQty === 0) handleRemoveFromCart(product._id);
  }}
  className="w-8 sm:w-10 text-center py-0 border border-cyan-200 rounded text-xs font-bold text-cyan-800"
/>


                            <button
                              onClick={() => incrementQuantity(product._id)}
                              className="bg-cyan-600 text-white w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold shadow hover:bg-cyan-700 transition-all cursor-pointer"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveFromCart(product._id)}
                          className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white text-[10px] sm:text-xs font-bold py-2 rounded shadow hover:from-red-600 hover:to-red-700 transition-all cursor-pointer"
                        >
                          Remove from List
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-gradient-to-r from-cyan-500 to-teal-500 text-white text-[10px] sm:text-xs font-bold py-2 rounded shadow hover:from-cyan-600 hover:to-teal-600 transition-all cursor-pointer"
                      >
                        Add To Enquiry List
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Pagination */}
          <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg disabled:opacity-50 font-bold shadow hover:from-cyan-600 hover:to-teal-600 transition-all"
            >
              Prev
            </button>

            {visiblePages.map((num) => (
              <button
                key={num}
                onClick={() => goToPage(num)}
                className={`px-4 py-2 rounded-lg font-bold shadow transition-all ${
                  currentPage === num
                    ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white"
                    : "bg-gradient-to-r from-cyan-200 to-teal-200 text-cyan-800 hover:from-cyan-300 hover:to-teal-300"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg disabled:opacity-50 font-bold shadow hover:from-cyan-600 hover:to-teal-600 transition-all"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AllDesigns;
