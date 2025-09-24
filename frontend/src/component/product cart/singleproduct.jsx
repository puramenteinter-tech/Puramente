import { useEffect, useState, useRef } from "react";
import { Phone, Share2, ZoomIn, ZoomOut } from "lucide-react";
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
  const [quantity, setQuantity] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });

  // For panning:
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const { id } = useParams();
  const { addToCart, cartItems, removeFromCart } = useCart();

  const isInCart = cartItems.some(item => item._id === id);

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
    if (product.cloudinaryId) {
      // Higher quality image with better resolution
      return `https://res.cloudinary.com/ddtharbsi/image/upload/c_fill,w_1100,h_1100,q_auto:best,f_auto,dpr_auto/${product.cloudinaryId}`;
    }
    if (product.imageurl && product.imageurl.startsWith("http")) {
      return product.imageurl;
    }
    return "/default-placeholder.jpg";
  };

  const handleAddToCart = () => {
    const productWithQty = { ...product, quantity };
    addToCart(productWithQty);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product._id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Your browser does not support the Share API. Please copy the URL manually.');
    }
  };

  // Zoom control
  const increaseZoom = () => {
    setZoomLevel(prev => {
      const next = Math.min(prev + 0.25, 3); // Increased max zoom to 3x
      if (next === 1) setOffset({ x: 0, y: 0 });
      else clampOffset(offset, next);
      return next;
    });
  };
  
  const decreaseZoom = () => {
    setZoomLevel(prev => {
      const next = Math.max(prev - 0.25, 1);
      if (next === 1) setOffset({ x: 0, y: 0 });
      else clampOffset(offset, next);
      return next;
    });
  };

  const clampOffset = (offset, zoom) => {
    const containerSize = 500; // Increased container size
    const imageSize = containerSize * zoom;

    const maxOffset = (imageSize - containerSize) / 2;

    let x = offset.x;
    let y = offset.y;

    if (x > maxOffset) x = maxOffset;
    if (x < -maxOffset) x = -maxOffset;
    if (y > maxOffset) y = maxOffset;
    if (y < -maxOffset) y = -maxOffset;

    setOffset({ x, y });
  };

  const onDragStart = (e) => {
    e.preventDefault();
    dragging.current = true;
    lastPos.current = {
      x: e.clientX || (e.touches && e.touches[0].clientX),
      y: e.clientY || (e.touches && e.touches[0].clientY),
    };
  };

  const onDragMove = (e) => {
    if (!dragging.current || zoomLevel === 1) return;

    const currentX = e.clientX || (e.touches && e.touches[0].clientX);
    const currentY = e.clientY || (e.touches && e.touches[0].clientY);
    if (currentX == null || currentY == null) return;

    const deltaX = currentX - lastPos.current.x;
    const deltaY = currentY - lastPos.current.y;

    lastPos.current = { x: currentX, y: currentY };

    setOffset(prev => {
      const newOffset = { x: prev.x + deltaX, y: prev.y + deltaY };
      const containerSize = 500;
      const imageSize = containerSize * zoomLevel;
      const maxOffset = (imageSize - containerSize) / 2;

      let x = newOffset.x;
      let y = newOffset.y;
      if (x > maxOffset) x = maxOffset;
      if (x < -maxOffset) x = -maxOffset;
      if (y > maxOffset) y = maxOffset;
      if (y < -maxOffset) y = -maxOffset;

      return { x, y };
    });
  };

  const onDragEnd = () => {
    dragging.current = false;
  };

  // Hover magnifier (Flipkart-style)
  const imageRef = useRef(null);
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({ x, y });
    setShowLens(true);
  };
  const handleMouseLeave = () => setShowLens(false);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <>
      {product && (
        <Helmet>
          <title>{product.name} | Puramente Jewel</title>
          <meta name="description" content={product.description || `Discover ${product.name} from Puramente Jewel International`} />
          <meta name="keywords" content={`${product.name}, ${product.category}, jewelry, Puramente Jewel`} />
          <link rel="canonical" href={`https://puramentejewel.com/singleproduct/${product._id}`} />
        </Helmet>
      )}

      <div className="container mx-auto px-4 py-10">
        {product && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Image Section - Larger for emphasis */}
            <div className="w-full flex flex-col items-center gap-4">
              <div
                className="overflow-hidden rounded-xl shadow-lg border p-2 relative"
                style={{ 
                  width: '100%', 
                  maxWidth: '640px', 
                  height: '640px',
                  touchAction: "none", 
                  cursor: zoomLevel > 1 ? "grab" : "default" 
                }}
                onMouseDown={onDragStart}
                onMouseMove={onDragMove}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                onTouchStart={onDragStart}
                onTouchMove={onDragMove}
                onTouchEnd={onDragEnd}
                onTouchCancel={onDragEnd}
              >
                <img
                  ref={imageRef}
                  src={getImageSrc(product)}
                  alt={product.name}
                  onError={(e) => (e.target.src = "/default-placeholder.png")}
                  className="object-contain select-none w-full h-full"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${offset.x / zoomLevel}px, ${offset.y / zoomLevel}px)`,
                    transition: dragging.current ? "none" : "transform 0.3s ease",
                    userSelect: "none",
                  }}
                  draggable={false}
                  onMouseMove={handleMouseMove}
                  onMouseEnter={() => setShowLens(true)}
                  onMouseLeave={handleMouseLeave}
                />
                {showLens && (
                  <div
                    className="hidden lg:block absolute top-0 right-[-700px] w-[680px] h-[680px] bg-white border rounded-xl shadow-xl overflow-hidden"
                  >
                    <img
                      src={getImageSrc(product)}
                      alt="zoom"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `translate(${-Math.max(lensPos.x * 2 - 340, 0)}px, ${-Math.max(lensPos.y * 2 - 340, 0)}px) scale(2)`,
                        transformOrigin: "top left",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={decreaseZoom}
                  className="bg-cyan-600 text-white px-3 py-2 rounded-full hover:bg-cyan-500 transition"
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut size={18} />
                </button>
                <span className="font-semibold text-cyan-800">Zoom: {zoomLevel.toFixed(2)}x</span>
                <button
                  onClick={increaseZoom}
                  className="bg-cyan-600 text-white px-3 py-2 rounded-full hover:bg-cyan-500 transition"
                  disabled={zoomLevel >= 3} // Updated max zoom
                >
                  <ZoomIn size={18} />
                </button>
              </div>
            </div>

            {/* Details Section (compact) */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-800 line-clamp-2">{product.name}</h1>
              <p className="text-cyan-700 font-medium">
                Design Code: <span className="font-semibold">{product.code}</span>
              </p>

              {/* Compact Description */}
              {product.description && (
                <div className="mt-4">
                  <p className="text-cyan-900 font-bold text-lg">Description:</p>
                  <p className="text-gray-700 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 mt-6">
                <button
                  className="bg-cyan-600 text-white px-3 py-1 rounded-full"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >-</button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) setQuantity(val);
                  }}
                  className="w-16 text-center border border-cyan-300 rounded-md text-cyan-800 font-semibold"
                />
                <button
                  className="bg-cyan-600 text-white px-3 py-1 rounded-full"
                  onClick={() => setQuantity(q => q + 1)}
                >+</button>
              </div>

              {/* Cart Buttons */}
              <div className="mt-6">
                {isInCart ? (
                  <button
                    onClick={handleRemoveFromCart}
                    className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg shadow hover:bg-red-600 transition"
                  >
                    Remove from List
                  </button>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-cyan-500 text-white font-semibold py-2 rounded-lg shadow hover:bg-cyan-600 transition"
                  >
                    Add to List
                  </button>
                )}
              </div>

              {/* Share & Contact */}
              <div className="flex items-center gap-4 mt-6">
                <a
                  href={`tel:+919314346148`}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-400"
                >
                  <Phone className="w-4 h-4" /> Call Us
                </a>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg shadow hover:bg-cyan-400"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-20">
          <WhoWeAre />
        </div>
      </div>
    </>
  );
}