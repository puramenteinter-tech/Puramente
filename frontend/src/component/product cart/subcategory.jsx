import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../../baseurl";
import { Link } from "react-router-dom";
import { useCart } from "../newcomponent/cartcontext";
import { Helmet } from "react-helmet-async";
import { Isauthanticate } from "../authantication/isauthanticat";

export default function SubCategoryPage() {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedProducts, setAddedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart, removeFromCart, updateQuantity } = useCart();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 16;

  const title = `${subcategory} Pendants | Puramente Jewel`;
  const description = `Shop ${subcategory} pendants from Puramente Jewel International. Handcrafted elegance shipped to France, UK, USA & Europe.`;
  const keywords = `${subcategory} pendants, jewelry, Puramente Jewel, pendants Europe`;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${BaseURL}/api/products/categorys/${category}/subcategory/${subcategory}/paginated?page=${currentPage}&limit=${itemsPerPage}`
        );
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (error) {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subcategory, currentPage]);

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
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_600,h_600,q_auto:good,f_auto/${product.cloudinaryId}`;
    }
    return "/default-placeholder.jpg";
  };

  const ProductImage = ({ product }) => {
    const [imgSrc, setImgSrc] = useState(getImageSrc(product));
    const [loading, setLoading] = useState(true);

    const handleError = () => {
      setImgSrc("/default-placeholder.png");
      setLoading(false);
    };

    const handleLoad = () => {
      setLoading(false);
    };

    return (
      <div className="relative w-full h-36">
        {loading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg"></div>
        )}
        <img
          src={imgSrc}
          alt={product.name}
          className={`w-full object-contain h-full rounded-lg ${
            loading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
        />
      </div>
    );
  };

  // Pagination logic
  const currentProducts = products;

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link
          rel="canonical"
          href={`https://puramentejewel.com/category/${category}/${subcategory}`}
        />
      </Helmet>

      <h1 className="text-center text-4xl font-bold text-gray-800 mt-8 mb-6 capitalize">
    
      </h1>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center capitalize mb-6">
          {category} -{" "}
          {subcategory
            .replace("withgemstone", "with gemstone")
            .replace("withoutgemstone", "without gemstone")}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-600"></div>
              <p className="mt-2 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
            <p>{error}</p>
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center text-gray-500">
              <h2 className="text-xl font-semibold mb-2">No Products Found</h2>
              <p className="text-sm">
                We couldn't find any products in this subcategory.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 relative overflow-hidden"
                >
                  <Link to={`/singleproduct/${product._id}`}>
                    <div className="relative w-full h-80">
                      <ProductImage product={product} />
                    </div>
                  </Link>

                  <div className="mt-6 text-center">
                    <h3 className="text-base font-semibold text-cyan-800 line-clamp-1 tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-sm text-cyan-600 mt-1">{product.category}</p>
                    <p className="text-xs text-cyan-500 mt-2 font-medium">
                      Design Code:{" "}
                      <span className="font-semibold">{product.code}</span>
                    </p>

                    {addedProducts.includes(product._id) ? (
                      <>
                        <div className="mt-4 flex justify-center items-center gap-2">
                          <button
                            onClick={() => decrementQuantity(product._id)}
                          className="bg-cyan-600 text-white px-2 py-1 text-sm rounded-full shadow hover:bg-cyan-700"
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
                          className="bg-cyan-600 text-white px-2 py-1 text-sm rounded-full shadow hover:bg-cyan-700"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemoveFromCart(product._id)}
                        className="mt-2 w-full bg-cyan-500 text-white text-xs font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
                        >
                          Remove Item
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                      className="mt-4 w-full bg-cyan-500 text-white text-sm font-semibold py-1 px-3 rounded-lg shadow-md hover:bg-cyan-600 transition-all duration-300 transform hover:scale-105"
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
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 text-white bg-cyan-600 hover:bg-cyan-700 rounded"
                  disabled={currentPage === 1}
                >
                  Prev
                </button>

                {[...Array(totalPages)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx + 1 > 1 && !Isauthanticate()) {
                        navigate("/login", { replace: false, state: { from: window.location.pathname } });
                        return;
                      }
                      setCurrentPage(idx + 1);
                    }}
                    className={`px-3 py-1 rounded ${
                      currentPage === idx + 1
                        ? "bg-cyan-800 text-white"
                        : "bg-cyan-200 text-cyan-800 hover:bg-cyan-300"
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => {
                    if (currentPage + 1 > 1 && !Isauthanticate()) {
                      navigate("/login", { replace: false, state: { from: window.location.pathname } });
                      return;
                    }
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className="px-3 py-1 text-white bg-cyan-600 hover:bg-cyan-700 rounded"
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
