import { motion } from "framer-motion";

const WishlistButton = ({ isWishlisted, toggleWishlist }) => {
  return (
    <motion.button
      onClick={toggleWishlist}
      whileTap={{ scale: 0.8 }} // Shrinks slightly when clicked
      whileHover={{ scale: 1.1 }} // Expands slightly on hover
      className="absolute top-2 right-2 p-2 rounded-full transition-all duration-300 bg-white border border-gray-300 hover:border-background-sky shadow-md hover:shadow-lg"
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={isWishlisted ? "var(--color-background-sky)" : "none"}
        stroke={isWishlisted ? "var(--color-background-sky)" : "gray"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 transition-all duration-300"
        animate={{ scale: isWishlisted ? 1.2 : 1 }} // Enlarges heart when wishlisted
        transition={{ type: "spring", stiffness: 300 }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </motion.svg>
    </motion.button>
  );
};

export default WishlistButton;
