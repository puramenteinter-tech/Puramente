import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import BaseURL from "../../baseurl";
import { Link } from "react-router-dom";
import { useCart } from "../newcomponent/cartcontext";

export default function TopProduct() {
  const [products, setProducts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [addedProducts, setAddedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { addToCart, removeFromCart, updateQuantity } = useCart();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    fetchProducts();
    
    // Restore cart from localStorage
    const savedCart = localStorage.getItem("cart");
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];
    setAddedProducts(parsedCart.map((item) => item._id));

    const initialQuantities = {};
    parsedCart.forEach((item) => {
      initialQuantities[item._id] = item.quantity || 1;
    });
    setQuantities(initialQuantities);

    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${BaseURL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const updateItemsPerPage = () => {
    if (window.innerWidth < 640) setItemsPerPage(2);
    else if (window.innerWidth < 1024) setItemsPerPage(3);
    else setItemsPerPage(4);
  };

  const scrollLeft = () => {
    setStartIndex((prev) => Math.max(prev - 1, 0));
  };

  const scrollRight = () => {
    setStartIndex((prev) => Math.min(prev + 1, products.length - itemsPerPage));
  };

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

  return (
    <section className="py-16 bg-gradient-to-br from-white via-cyan-50 to-cyan-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div data-aos="zoom-in" className="text-center p-7 mb-12 relative">
          <h2 className="text-3xl p-4 sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-800 bg-clip-text text-transparent relative z-10">
            Most Loved Fashion Jewellery
          </h2>
          <div className="w-32 h-1 bg-cyan-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative flex items-center">
          <button
            onClick={scrollLeft}
            disabled={startIndex === 0}
            className={`absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-3 rounded-full shadow-lg z-10 transition ${
              startIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:from-cyan-600 hover:to-teal-600"
            }`}
          >
            ◀
          </button>

          <div className="flex space-x-6 overflow-hidden w-full justify-center p-4">
            {products
              .slice(startIndex, startIndex + itemsPerPage)
              .reverse()
              .map((product, index) => {
                const isAdded = addedProducts.includes(product._id);
                const quantity = quantities[product._id] || 1;

                return (
                  <div
                    key={product._id}
                    data-aos="fade-up"
                    data-aos-delay={index * 150}
                    className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden flex flex-col h-full border border-cyan-100 min-w-[280px] max-w-[320px]"
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
                        <h3 className="text-sm font-bold text-cyan-900 tracking-tight leading-tight mb-2 line-clamp-2 min-h-[2.5rem]">
                          {product.name}
                        </h3>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-cyan-700 bg-cyan-50 px-2 py-1 rounded">
                            {product.category}
                          </span>
                          <span className="text-xs text-cyan-600 font-mono bg-white px-1 py-0.5 rounded border">
                            SKU: {product.code || "N/A"}
                          </span>
                        </div>
                      </Link>

                      {/* Cart Actions */}
                      <div className="mt-auto pt-3 border-t border-cyan-100">
                        {isAdded ? (
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
                                  value={quantity}
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
                );
              })}
          </div>

          <button
            onClick={scrollRight}
            disabled={startIndex >= products.length - itemsPerPage}
            className={`absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-3 rounded-full shadow-lg z-10 transition ${
              startIndex >= products.length - itemsPerPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-cyan-600 hover:to-teal-600"
            }`}
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}