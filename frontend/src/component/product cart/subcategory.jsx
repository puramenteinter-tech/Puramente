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
        
        // Restore cart from localStorage
        const savedCart = localStorage.getItem("cart");
        const parsedCart = savedCart ? JSON.parse(savedCart) : [];
        setAddedProducts(parsedCart.map((item) => item._id));

        const initialQuantities = {};
        parsedCart.forEach((item) => {
          initialQuantities[item._id] = item.quantity || 1;
        });
        setQuantities(initialQuantities);
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
  const newQty = (quantities[_id] || 0) + 1; // start from 0
  setQuantities((prev) => ({ ...prev, [_id]: newQty }));
  updateQuantity(_id, newQty);
};

const decrementQuantity = (_id) => {
  const currentQty = quantities[_id] || 0;
  const newQty = Math.max(0, currentQty - 1); // allow 0, not below
  setQuantities((prev) => ({ ...prev, [_id]: newQty }));
  updateQuantity(_id, newQty);
};


  const getImageSrc = (product) => {
    if (product?.imageUrl) return product.imageUrl;
    if (product?.imageurl) return product.imageurl;
    if (product?.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_800,h_990,q_auto:best,f_auto,dpr_2.0/${product.cloudinaryId}`;
    }
    return "/default-placeholder.jpg";
  };

  const ProductImage = ({ product }) => {
    const [imgSrc, setImgSrc] = useState(getImageSrc(product));
    const [imgLoading, setImgLoading] = useState(true);

    const handleError = () => {
      setImgSrc("/default-placeholder.jpg");
      setImgLoading(false);
    };

    const handleLoad = () => {
      setImgLoading(false);
    };

    return (
      <div className="relative w-full h-75 p-0 bg-gradient-to-br from-cyan-50 to-white">
        {imgLoading && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-xl"></div>
        )}
        <img
          src={imgSrc}
          alt={`${product.name} – ${product.category} by Puramente | fashion jewellery wholesale suppliers in India`}
          className={`w-full h-70 rounded-t-xl transition-all duration-300 hover:scale-105 ${
            imgLoading ? "opacity-0" : "opacity-100"
          }`}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
        />
      </div>
    );
  };

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

      <div className="py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 min-h-screen">
        <div className="w-full text-center mb-10">
          <h1 className="text-3xl font-extrabold text-cyan-600 tracking-tight capitalize">
            {category} - {subcategory.replace("withgemstone", "with gemstone").replace("withoutgemstone", "without gemstone")}
          </h1>
          <p className="text-md font-medium text-cyan-800 mt-2 italic max-w-2xl mx-auto">
            "Exquisite {subcategory} {category} collection from the best jewellery manufacturers in India."
          </p>
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
                We couldn't find any products in this subcategory.
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
                  {/* Image Section */}
                  <Link to={`/singleproduct/${product._id}`} className="block w-full">
                    <ProductImage product={product} />
                  </Link>
                  <span className="absolute top-3 left-3 bg-gradient-to-r from-cyan-600 to-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    New
                  </span>

                  {/* Content Section */}
                 <div className="flex flex-col flex-grow p-4">
  <Link to={`/singleproduct/${product._id}`} className="flex-grow mb-3">
    {/* Product name + SKU on same line */}
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-bold text-cyan-900 tracking-tight leading-tight line-clamp-2">
        {product.name}
      </h3>
      <span className="text-xs text-cyan-600 font-mono bg-white px-1 py-0.5 rounded border">
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
              className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow hover:bg-cyan-700 transition-all"
            >
              −
            </button>
            <input
              type="number"
              value={quantities[product._id] || 0}
              min="1"
              onChange={(e) => {
                const newQty = Math.max(0, Number(e.target.value), 1);
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
              className="bg-cyan-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold shadow hover:bg-cyan-700 transition-all"
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

            {/* Pagination Controls */}
          {/* Pagination Controls */}
{totalPages > 1 && (
  <div className="flex justify-center items-center space-x-2 mt-12 flex-wrap gap-2">
    <button
      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg shadow font-bold hover:from-cyan-600 hover:to-teal-600 transition-all"
      disabled={currentPage === 1}
    >
      Previous
    </button>

    {/* Show 5 pages at a time */}
    {(() => {
      const groupSize = 5;
      const startPage = Math.floor((currentPage - 1) / groupSize) * groupSize + 1;
      const endPage = Math.min(startPage + groupSize - 1, totalPages);
      const buttons = [];
      for (let i = startPage; i <= endPage; i++) {
        buttons.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`px-4 py-2 rounded-lg shadow font-bold transition-all ${
              currentPage === i
                ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white"
                : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600"
            }`}
          >
            {i}
          </button>
        );
      }
      return buttons;
    })()}

    <button
      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-lg shadow font-bold hover:from-cyan-600 hover:to-teal-600 transition-all"
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