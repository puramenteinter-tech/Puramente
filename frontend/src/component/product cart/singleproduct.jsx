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

  // For panning and magnifier
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0, inside: false });

  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

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
    if (product?.cloudinaryId) {
      // Highest quality with no size restrictions for best quality
      return `https://res.cloudinary.com/ddtharbsi/image/upload/q_auto:best,f_auto/${product.cloudinaryId}`;
    }
    if (product?.imageurl && product.imageurl.startsWith("http")) {
      return product.imageurl;
    }
    return "https://placehold.co/1200x1200?text=No+Image";
  };

  const handleAddToCart = () => {
    if (!product) return;
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
      navigator.share({
        title: product.name,
        text: `Check out this product: ${product.name}`,
        url: window.location.href,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.error('Error sharing:', error));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Product link copied to clipboard!'))
        .catch(() => alert('Please copy the URL manually: ' + window.location.href));
    }
  };

  // Zoom control
  const increaseZoom = () => {
    setZoomLevel(prev => {
      const next = Math.min(prev + 0.25, 3);
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
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const containerWidth = rect.width;
    const containerHeight = rect.height;
    const imageWidth = containerWidth * zoom;
    const imageHeight = containerHeight * zoom;

    const maxOffsetX = Math.max(0, (imageWidth - containerWidth) / 2);
    const maxOffsetY = Math.max(0, (imageHeight - containerHeight) / 2);

    let x = Math.max(Math.min(offset.x, maxOffsetX), -maxOffsetX);
    let y = Math.max(Math.min(offset.y, maxOffsetY), -maxOffsetY);

    setOffset({ x, y });
  };

  const onDragStart = (e) => {
    e.preventDefault();
    if (zoomLevel === 1) return;
    
    dragging.current = true;
    setIsDragging(true);
    setShowMagnifier(false);
    
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    lastPos.current = { x: clientX, y: clientY };
  };

  const onDragMove = (e) => {
    if (!dragging.current || zoomLevel === 1) return;

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    if (clientX == null || clientY == null) return;

    const deltaX = clientX - lastPos.current.x;
    const deltaY = clientY - lastPos.current.y;

    lastPos.current = { x: clientX, y: clientY };

    setOffset(prev => {
      const newOffset = { x: prev.x + deltaX, y: prev.y + deltaY };
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return prev;
      
      const containerWidth = rect.width;
      const containerHeight = rect.height;
      const imageWidth = containerWidth * zoomLevel;
      const imageHeight = containerHeight * zoomLevel;

      const maxOffsetX = Math.max(0, (imageWidth - containerWidth) / 2);
      const maxOffsetY = Math.max(0, (imageHeight - containerHeight) / 2);

      let x = Math.max(Math.min(newOffset.x, maxOffsetX), -maxOffsetX);
      let y = Math.max(Math.min(newOffset.y, maxOffsetY), -maxOffsetY);

      return { x, y };
    });
  };

  const onDragEnd = () => {
    dragging.current = false;
    setIsDragging(false);
  };

  // Handle mouse move for hover magnifier effect
  const handleMouseMove = (e) => {
    if (!imageRef.current || zoomLevel !== 1 || dragging.current) {
      setShowMagnifier(false);
      return;
    }
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if mouse is inside image bounds
    const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
    
    if (inside) {
      setCursorPosition({ 
        x: (x / rect.width) * 100, 
        y: (y / rect.height) * 100, 
        inside: true 
      });
      setShowMagnifier(true);
    } else {
      setShowMagnifier(false);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
    setCursorPosition(prev => ({ ...prev, inside: false }));
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  if (!product) return <div className="text-center text-red-500 mt-10">Product not found</div>;

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Image Section - Wider (2/3 of screen) with perfect quality */}
            <div className="lg:col-span-2 w-full flex flex-col items-center gap-4">
              <div
                className="overflow-hidden rounded-xl shadow-lg border p-2 relative bg-gray-50"
                style={{ 
                  width: '100%', 
                  height: '700px', // Increased height for better display
                  touchAction: "none", 
                  cursor: isDragging ? "grabbing" : (zoomLevel > 1 ? "grab" : "crosshair") 
                }}
                ref={containerRef}
                onMouseDown={onDragStart}
                onMouseMove={(e) => {
                  onDragMove(e);
                  if (zoomLevel === 1 && !isDragging) handleMouseMove(e);
                }}
                onMouseUp={onDragEnd}
                onMouseLeave={(e) => {
                  onDragEnd();
                  handleMouseLeave();
                }}
                onTouchStart={onDragStart}
                onTouchMove={onDragMove}
                onTouchEnd={onDragEnd}
                onTouchCancel={onDragEnd}
              >
                {/* High Quality Image Container */}
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    ref={imageRef}
                    src={getImageSrc(product)}
                    alt={product.name}
                    onError={(e) => { 
                      e.currentTarget.onerror = null; 
                      e.currentTarget.src = "https://placehold.co/1200x1200?text=No+Image"; 
                    }}
                    className="object-scale-down select-none max-w-full max-h-full"
                    style={{
                      transform: `scale(${zoomLevel}) translate(${offset.x}px, ${offset.y}px)`,
                      transition: isDragging ? "none" : "transform 0.2s ease",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                      // Ensure image maintains its natural quality
                      imageRendering: zoomLevel > 1 ? "high-quality" : "auto",
                    }}
                    draggable={false}
                  />
                </div>

                {/* Magnifier for zoom level 1 */}
                {showMagnifier && zoomLevel === 1 && cursorPosition.inside && (
                  <div 
                    className="absolute hidden lg:block overflow-hidden rounded-xl shadow-lg border-2 border-cyan-500 bg-white"
                    style={{
                      width: '250px',
                      height: '250px',
                      left: 'calc(100% + 20px)',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 20,
                    }}
                  >
                    <img
                      src={getImageSrc(product)}
                      alt="Magnified view"
                      className="w-full h-full object-cover"
                      style={{
                        transform: `scale(2.5)`,
                        transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%`,
                        imageRendering: "high-quality",
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-lg">
                <button
                  onClick={decreaseZoom}
                  className="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoomLevel <= 1}
                >
                  <ZoomOut size={18} />
                </button>
                <span className="font-semibold text-cyan-800 min-w-[100px] text-center">
                  Zoom: {zoomLevel.toFixed(1)}x
                </span>
                <button
                  onClick={increaseZoom}
                  className="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={zoomLevel >= 3}
                >
                  <ZoomIn size={18} />
                </button>
              </div>
            </div>

            {/* Product Details Section - Narrower (1/3 of screen) */}
            <div className="lg:col-span-1 space-y-4 bg-white p-6 rounded-xl shadow-lg border h-fit sticky top-4">
              <h1 className="text-2xl font-bold text-cyan-800 leading-tight">{product.name}</h1>
              
              <div className="space-y-2">
                <p className="text-cyan-700 font-medium">
                  Design Code: <span className="font-semibold">{product.code || "N/A"}</span>
                </p>

                {product.category && (
                  <p className="text-cyan-700 font-medium">
                    Category: <span className="font-semibold">{product.category}</span>
                  </p>
                )}
              </div>

              {/* Description - Compact */}
              {product.description && (
                <div className="mt-4">
                  <p className="text-cyan-900 font-bold text-lg mb-2">Description:</p>
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
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    min={1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (!isNaN(val) && val > 0) setQuantity(val);
                    }}
                    className="w-16 text-center border border-cyan-300 rounded-md text-cyan-800 font-semibold py-1"
                  />
                  <button
                    className="bg-cyan-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-cyan-500 transition"
                    onClick={() => setQuantity(q => q + 1)}
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