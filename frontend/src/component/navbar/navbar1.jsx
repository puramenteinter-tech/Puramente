import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BaseURL from "../../baseurl";
import { Isauthanticate, Logout, IsAdmin } from "../authantication/isauthanticat";
import { Menu, Search } from "lucide-react";
import { IoCloseSharp } from "react-icons/io5";
import { FaCartShopping, FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa6";
import { useCart } from "../newcomponent/cartcontext";
import LanguageSwitcher from "../language/languagetranslator";

export default function Navbar1() {
  const { t } = useTranslation();
  const { cartItems } = useCart();
  const [sidemenu, setsidemenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDesktopSearch, setShowDesktopSearch] = useState(false);
  const [error, setError] = useState("");

  const toggleSideMenu = () => setsidemenu(!sidemenu);

  const toggleDesktopSearch = () => {
    if (showDesktopSearch) setSearchTerm("");
    setShowDesktopSearch(!showDesktopSearch);
  };

  const fetchProducts = async (query) => {
    if (!query.trim()) {
      setFilteredProducts([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${BaseURL}/api/products/product?search=${query}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: false,
      });

      setFilteredProducts(response.data);
    } catch (err) {
      console.error("❌ Error fetching products:", err);
      setError("Failed to fetch products.");
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 400);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const getImageSrc = (product) => {
    if (product?.imageUrl) return product.imageUrl;
    if (product?.imageurl) return product.imageurl;
    if (product?.cloudinaryId)
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_400,h_400,q_auto:good,f_auto/${product.cloudinaryId}`;
    return "/default-placeholder.jpg";
  };

  const handleResultClick = () => {
    setSearchTerm("");
    setShowDesktopSearch(false);
  };

  return (
    <div>
      {/* Top certification strip */}
      <div className="w-full bg-background-sky text-white text-xs sm:text-sm font-semibold flex items-center justify-center sm:gap-2 sm:px-4 border-b h-[52px] border-white shadow-md z-50">
        <span className="hidden sm:inline text-center leading-tight">
          Certified Ethical Manufacturing by Sedex - Ensuring Sustainable Jewellery Production
        </span>
        <span className="inline sm:hidden text-center leading-tight">
          Certified Ethical Manufacturing by
        </span>
        <img
          src="/sedex.png"
          alt="Sedex Certified"
          className="h-12 sm:h-18 md:h-12 lg:h-18 w-auto object-contain"
        />
      </div>

      {/* Desktop Navbar */}
      <nav className="w-full hidden lg:flex h-20 items-center bg-background-sky px-[80px] justify-between">
        {/* Left - Social Icons */}
        <div className="flex items-center gap-8">
          <a href="https://www.instagram.com/puramenteinternational/" target="_blank" rel="noopener noreferrer">
            <FaInstagram size={24} className="text-black hover:text-gray-700" />
          </a>
          <a href="https://www.facebook.com/puramenteinternational1/" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={24} className="text-black hover:text-gray-700" />
          </a>
          <a href="https://www.linkedin.com/company/puramente-international/" target="_blank" rel="noopener noreferrer">
            <FaLinkedinIn size={24} className="text-black hover:text-gray-700" />
          </a>
          <a href="https://www.youtube.com/@puramenteinternational1982" target="_blank" rel="noopener noreferrer">
            <FaYoutube size={24} className="text-black hover:text-gray-700" />
          </a>
        </div>

        {/* Center - Logo */}
        <Link to="/">
          <img className="h-110 w-90 p-2 ml-6" src="/puralogo.png" alt="logo" />
        </Link>

        {/* Right side */}
        <div className="flex items-center justify-end gap-2 mr-[200px]">
          {/* Search */}
          <div className="relative flex justify-end mr-4">
            <button onClick={toggleDesktopSearch} className="p-2">
              <Search className="h-6 w-6 text-gray-600 hover:text-gray-800" />
            </button>
            {showDesktopSearch && (
              <div className="absolute right-0 top-full bg-white shadow-lg rounded-lg z-10 w-96 flex flex-col mt-2">
                <input
                  className="p-3 border-b w-full focus:outline-none"
                  placeholder={t("searchPlaceholder")}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                {searchTerm.trim() && (
                  <div className="max-h-60 overflow-y-auto">
                    {loading ? (
                      <div className="p-2 text-gray-500 text-center">Loading...</div>
                    ) : error ? (
                      <div className="p-2 text-red-500 text-center">{error}</div>
                    ) : filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Link
                          key={product._id}
                          to={`/singleproduct/${product._id}`}
                          className="flex items-center p-2 hover:bg-gray-100 border-b"
                          onClick={handleResultClick}
                        >
                          <img
                            src={getImageSrc(product)}
                            alt={product.name}
                            className="h-10 w-10 object-cover mr-4"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500 text-center">No product found</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="relative flex w-10 h-10 lg:mr-2">
            <img className="w-10 h-10" src="/cart2.svg" alt="cart" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full ">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* Language */}
          <LanguageSwitcher />

          {/* Login / Logout */}
          {Isauthanticate() ? (
            <button
              onClick={Logout}
              className="bg-black font-semibold rounded-sm text-white w-24 h-8 text-center gap-1.5"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-black font-semibold rounded-sm text-white w-24 h-8 text-center gap-1.5">
                Login
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="h-20 flex justify-between px-6 items-center lg:hidden bg-background-sky">
        <button onClick={toggleSideMenu}>
          <Menu className="h-8 w-10 hover:bg-cyan-600" />
        </button>
        <Link to="/">
          <img className="h-80 w-50" src="/puralogo.png" alt="jewellers" />
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative flex items-center">
            <FaCartShopping className="h-8 w-10 text-gray-800 hover:text-cyan-600" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Sidebar Menu */}
      <div
        className={`${
          sidemenu
            ? "flex fixed shadow-2xl z-30 top-0 h-screen w-[70%] bg-background-sky"
            : "hidden"
        }`}
      >
        <button className="absolute h-12 w-12 p-2 top-6 right-6" onClick={toggleSideMenu}>
          <IoCloseSharp className="w-14 h-10 font-bold" />
        </button>
        <div className="h-full flex flex-col items-start text-2xl text-button-orange gap-8 mt-32 ml-12 font-bold">
          {Isauthanticate() ? (
            <button
              onClick={() => {
                Logout();
                setsidemenu(false);
              }}
              className="bg-black text-white w-36 text-lg h-10"
            >
              Logout
            </button>
          ) : (
            <Link to="/login" onClick={toggleSideMenu}>
              <button className="bg-black text-white w-36 text-lg h-10">Login</button>
            </Link>
          )}
          <Link onClick={toggleSideMenu} to="/">
            {t("Home")}
          </Link>
          <Link onClick={toggleSideMenu} to="shopall">
            Jewellery Design
          </Link>
          <Link onClick={toggleSideMenu} to="/contactus">
            {t("Contact Us")}
          </Link>
          <Link onClick={toggleSideMenu} to="/aboutus">
            {t("About Us")}
          </Link>
          <Link onClick={toggleSideMenu} to="/faq">
            FAQ
          </Link>
          <Link onClick={toggleSideMenu} to="/privacy">
            Privacy
          </Link>
          {IsAdmin() && (
            <Link to="dashboard" onClick={toggleSideMenu}>
              <button className="bg-cyan-900 border-black text-lg w-44 h-10 text-white">
                Dashboard
              </button>
            </Link>
          )}
          <Link onClick={toggleSideMenu} to="/">
            <img
              className="absolute top-[-100px] mx-[-34px] h-80 w-74"
              src="/puralogo.png"
              alt=""
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
