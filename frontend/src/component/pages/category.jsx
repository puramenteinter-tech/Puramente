// import Collection from "../product cart/collection";
// import WhoWeAre from "../newcomponent/woweare";
// export default function Category() {
//   return (
//     <div>
//       <Collection />
//       <WhoWeAre />
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../product cart/allproduct";
import Collection from "../product cart/collection";
import WhoWeAre from "../newcomponent/woweare";

export default function Category() {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) return;
      console.log("🔗 Fetching:", `${BASE_URL}/api/products/category/${categoryName}`);

      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/products/category/${categoryName}`);
        setProducts(res.data?.products || []);
      } catch (err) {
        console.error("❌ Error fetching category products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  return (
    <div>
      <Collection />

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center capitalize">
          {categoryName}
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No products found.</p>
        )}
      </div>

      <WhoWeAre />
    </div>
  );
}
