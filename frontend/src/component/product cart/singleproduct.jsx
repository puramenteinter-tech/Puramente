import { useEffect, useState, useRef } from "react";
import { Phone, Share2 } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BaseURL from "../../baseurl";
import WhoWeAre from "../newcomponent/woweare";
import { useCart } from "../newcomponent/cartcontext";
import { Helmet } from "react-helmet-async";

export default function SingleProduct() {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(0);

  const { id } = useParams();
  const { addToCart, cartItems, removeFromCart } = useCart();
  const isInCart = cartItems.some((item) => item._id === id);

  const imageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function fetchProduct() {
      try {
        const response = await axios.get(`${BaseURL}/api/products/single/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to fetch product details.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const getImageSrc = (product) => {
    if (product?.cloudinaryId) {
      return `https://res.cloudinary.com/ddtharbsi/image/upload/q_auto:best,f_auto/${product.cloudinaryId}`;
    }
    if (product?.imageurl && product.imageurl.startsWith("http")) {
      return product.imageurl;
    }
    return "https://placehold.co/1200x1200?text=No+Image";
  };

  const handleAddToCart = () => {
  if (!product || quantity <= 0) {
    alert("Please select at least 1 quantity");
    return;
  }
  const productWithQty = { ...product, quantity };
  addToCart(productWithQty);
};


  const handleRemoveFromCart = () => {
    if (!product) return;
    removeFromCart(product._id);
  };

  const handleShare = () => {
    if (!product) return;

    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Product link copied to clipboard!"));
    }
  };

  // 🧩 Hover Zoom Logic (smooth 1.5x internal zoom)
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    imageRef.current.style.transformOrigin = `${x}% ${y}%`;
    imageRef.current.style.transform = "scale(1.5)";
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transformOrigin = "center center";
    imageRef.current.style.transform = "scale(1)";
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found</div>;

  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name} | Puramente Jewel</title>
          <meta
            name="description"
            content={
              product.description ||
              `Discover ${product.name} from Puramente Jewel International`
            }
          />
          <meta
            name="keywords"
            content={`${product.name}, ${product.category}, jewelry, Puramente Jewel`}
          />
          <link
            rel="canonical"
            href={`https://puramentejewel.com/singleproduct/${product._id}`}
          />
        </Helmet>
      )}

      <div className="container mx-auto px-4 py-10">
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* 🖼 Image Section */}
            <div className="lg:col-span-2 w-full flex flex-col items-center gap-4">
              <div className="relative w-full overflow-hidden rounded-xl shadow-lg border p-2 bg-gray-50">
                <div className="w-full h-[700px] flex items-center justify-center">
                  <img
                    ref={imageRef}
                    src={getImageSrc(product)}
                    alt={product.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/1200x1200?text=No+Image";
                    }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    className="object-contain select-none w-full h-full transition-transform duration-300 ease-out"
                    draggable={false}
                  />
                </div>
              </div>
            </div>

            {/* 📋 Product Details */}
            <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-xl shadow-lg border h-fit sticky top-4">
              <h1 className="text-2xl font-bold text-cyan-800 leading-tight">
                {product.name}
              </h1>

              <div className="space-y-2">
                <p className="text-cyan-700 font-medium">
                  Design Code:{" "}
                  <span className="font-semibold">{product.code || "N/A"}</span>
                </p>

                {product.category && (
                  <p className="text-cyan-700 font-medium">
                    Category:{" "}
                    <span className="font-semibold">{product.category}</span>
                  </p>
                )}
              </div>

              {product.description && (
                <div className="mt-4">
                  <p className="text-cyan-900 font-bold text-lg mb-2">
                    Description:
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

            {/* Quantity Selector */}
<div className="flex items-center justify-between mt-6 p-3 bg-gray-50 rounded-lg">
  <span className="text-cyan-800 font-semibold">Quantity:</span>
  <div className="flex items-center gap-2">
    <button
      className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-cyan-500 transition"
      onClick={() => setQuantity((q) => Math.max(0, q - 1))} // 👈 min 0
    >
      -
    </button>
    <input
      type="number"
      value={quantity}
      min={0} // 👈 allow 0
      onChange={(e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val) && val >= 0) setQuantity(val); // 👈 min 0
      }}
      className="w-16 text-center border border-cyan-300 rounded-md text-cyan-800 font-semibold py-1"
    />
    <button
      className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-cyan-500 transition"
      onClick={() => setQuantity((q) => q + 1)}
    >
      +
    </button>
  </div>
</div>


              {/* Cart Buttons */}
              <div className="mt-6">
                {isInCart ? (
                  <button
                    onClick={handleRemoveFromCart}
                    className="w-full bg-red-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Remove from List
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-cyan-500 text-white font-semibold py-3 rounded-lg shadow hover:bg-cyan-600 transition"
                  >
                    Add to List
                  </button>
                )}
              </div>

              {/* Share & Contact */}
              <div className="flex flex-col gap-3 mt-6">
                <a
                  href="tel:+919314346148"
                  className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg shadow hover:bg-cyan-400 transition"
                >
                  <Phone className="w-4 h-4" /> Call Us
                </a>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 bg-cyan-600 text-white px-4 py-3 rounded-lg shadow hover:bg-cyan-400 transition"
                >
                  <Share2 className="w-4 h-4" /> Share Product
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-16">
          <WhoWeAre />
        </div>
      </div>
    </>
  );
}
