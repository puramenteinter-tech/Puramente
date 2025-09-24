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

  const handleToggleCart = (product) => {
    const isAlreadyAdded = addedProducts.includes(product._id);

    if (isAlreadyAdded) {
      removeFromCart(product._id);
      setAddedProducts((prev) => prev.filter((id) => id !== product._id));
      const updated = { ...quantities };
      delete updated[product._id];
      setQuantities(updated);
    } else {
      const quantity = quantities[product._id] || 1;
      addToCart({ ...product, quantity });
      setAddedProducts((prev) => [...prev, product._id]);
      setQuantities((prev) => ({ ...prev, [product._id]: quantity }));
    }
  };

  const handleIncrease = (product) => {
    setQuantities((prev) => {
      const newQuantity = (prev[product._id] || 1) + 1;
      updateQuantity(product._id, newQuantity);
      return {
        ...prev,
        [product._id]: newQuantity,
      };
    });
  };

  const handleDecrease = (product) => {
    setQuantities((prev) => {
      const newQuantity = Math.max(1, (prev[product._id] || 1) - 1);
      updateQuantity(product._id, newQuantity);
      return {
        ...prev,
        [product._id]: newQuantity,
      };
    });
  };

  const handleManualQuantityChange = (e, product) => {
    const value = Math.max(1, Number(e.target.value));
    setQuantities((prev) => ({
      ...prev,
      [product._id]: value,
    }));
    updateQuantity(product._id, value);
  };
  const getImageSrc = (product) => {
  if (product?.imageUrl) return product.imageUrl;
  if (product?.imageurl) return product.imageurl;
  if (product?.cloudinaryId) {
    return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_800,h_800,q_auto:good,f_auto,dpr_auto/${product.cloudinaryId}`;
  }
  return "/default-placeholder.jpg"; // 🔄 Optional fallback
};

  return (
    <section className="py-16 bg-gradient-to-br from-cyan-50 via-white to-cyan-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div data-aos="zoom-in" className="text-center p-7 mb-12 relative">
          <h2 className="text-3xl p-4 sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-600 via-cyan-700 to-cyan-800 bg-clip-text text-transparent relative z-10">
            Most Loved  Fashion Jewellery
          </h2>
          <div className="w-32 h-1 bg-cyan-600 mx-auto mt-4 rounded-full" />
        </div>

        <div className="relative flex items-center">
          <button
            onClick={scrollLeft}
            disabled={startIndex === 0}
            className={`absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 bg-cyan-600 text-white p-3 rounded-full shadow-lg z-10 transition ${
              startIndex === 0 ? " hidden opacity-50 cursor-not-allowed" : "hover:bg-cyan-700"
            }`}
          >
            ◀
          </button>

          <div className="flex space-x-4 md:space-x-6 overflow-hidden w-full justify-center p-4">
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
                    className="w-1/2 sm:w-64 bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-cyan-100"
                  >
                    <Link to={`/singleproduct/${product._id}`}>
                      <div className="relative flex justify-between items-center h-56 sm:h-72 overflow-hidden">
                        <img
                          src={getImageSrc(product)} 
                        alt={`${product.name} – ${product.category || "jewellery"} by Puramente | costume jewellery manufacturers in India, indian jewellery wholesale suppliers`}
                          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/singleproduct/${product._id}`}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs sm:text-sm text-cyan-600 font-medium bg-cyan-50 px-2 py-1 rounded-full capitalize">
                            {product.name}
                          </span>
                          <span className="text-xs text-cyan-500 font-mono bg-cyan-50 px-2 py-1 rounded-full">
                            {product.code}
                          </span>
                        </div>
                      </Link>
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-800 mb-2">
                        {product.title}
                      </h3>
                      <Link to={`/singleproduct/${product._id}`}>
                        <p className="text-xs line-clamp-2 sm:text-sm text-gray-600 mb-2">
                          {product.description}
                        </p>
                      </Link>

                      {isAdded && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                          <button
                            onClick={() => handleDecrease(product)}
                            className="bg-cyan-600 text-white px-2 py-1 rounded-md hover:bg-cyan-700"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => handleManualQuantityChange(e, product)}
                            className="w-16 text-center border border-cyan-600 rounded-md py-1 px-2"
                          />
                          <button
                            onClick={() => handleIncrease(product)}
                            className="bg-cyan-600 text-white px-2 py-1 rounded-md hover:bg-cyan-700"
                          >
                            +
                          </button>
                        </div>
                      )}

                      <button
                        onClick={() => handleToggleCart(product)}
                        className={`mt-4 w-full ${
                          isAdded ? "bg-cyan-700 hover:bg-cyan-800" : "bg-cyan-500 hover:bg-cyan-600"
                        } text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105`}
                      >
                        {isAdded ? "Remove Item" : "Add To List"}
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>

          <button
            onClick={scrollRight}
            disabled={startIndex >= products.length - itemsPerPage}
            className={`absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 bg-cyan-600 text-white p-3 rounded-full shadow-lg z-10 transition ${
              startIndex >= products.length - itemsPerPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-cyan-700"
            }`}
          >
            ▶
          </button>
        </div>
      </div>
    </section>
  );
}
