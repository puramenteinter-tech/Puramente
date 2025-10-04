import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar1 from "../navbar/navbar1";
import Navbar2 from "../navbar/navbar2";
import Footer from "../footer/footer";
import WhatsAppButton from "../newcomponent/whatsappbutton";
import Loader from "../loader/loader";
import { Helmet } from "react-helmet-async";
import BaseURL from "../../baseurl";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 12; // products per page
  const pagesPerGroup = 5; // how many page buttons to show at once

  // fetch category data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BaseURL}/api/category/${categoryName}`);
        setCategoryProducts(res.data.products || []);
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryName]);

  if (loading) return <Loader />;

  // pagination logic
  const totalPages = Math.ceil(categoryProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = categoryProducts.slice(startIndex, startIndex + itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);

  const startPage = pageGroup * pagesPerGroup + 1;
  const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

  return (
    <>
      <Helmet>
        <title>{categoryName} | Puramente Jewel</title>
      </Helmet>

      <Navbar1 />
      <Navbar2 />

      <div className="pt-10 pb-16 px-4 sm:px-6 md:px-10 bg-gradient-to-b from-cyan-50 to-teal-100 min-h-screen">
        <h2 className="text-center text-3xl sm:text-4xl font-bold text-cyan-700 mb-10 capitalize">
          {categoryName}
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
          {currentProducts.map((product) => (
            <div
              key={product._id}
              className="relative bg-white p-4 sm:p-5 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 w-full max-w-xs"
            >
              {product.newProduct && (
                <span className="absolute top-3 left-3 bg-cyan-500 text-white px-2 py-1 text-xs font-semibold rounded-full">
                  New
                </span>
              )}

              <img
                src={product.images?.[0]}
                alt={product.productName}
                className="w-full h-56 sm:h-64 object-cover rounded-xl mb-4"
              />

              <h3 className="text-gray-800 font-semibold text-base sm:text-lg mb-1 text-center">
                {product.productName}
              </h3>
              <p className="text-gray-500 text-sm text-center mb-2">
                {categoryName}
              </p>
              <p className="text-cyan-700 text-sm text-center font-medium mb-3">
                SKU: {product.sku}
              </p>

              <div className="text-center">
                <button
                  onClick={() => (window.location.href = `/singleproduct/${product._id}`)}
                  className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-cyan-600 hover:to-teal-600 transition-all"
                >
                  Add To Enquiry List
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination (5 numbers at a time) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 flex-wrap gap-2">
            {pageGroup > 0 && (
              <button
                onClick={() => setPageGroup(pageGroup - 1)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow font-bold hover:bg-cyan-600 transition-all"
              >
                Prev
              </button>
            )}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const pageNumber = startPage + i;
              return (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-4 py-2 rounded-lg shadow font-bold transition-all ${
                    currentPage === pageNumber
                      ? "bg-gradient-to-r from-cyan-700 to-teal-700 text-white"
                      : "bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:from-cyan-600 hover:to-teal-600"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {endPage < totalPages && (
              <button
                onClick={() => setPageGroup(pageGroup + 1)}
                className="px-4 py-2 bg-cyan-500 text-white rounded-lg shadow font-bold hover:bg-cyan-600 transition-all"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>

      <WhatsAppButton />
      <Footer />
    </>
  );
};

export default CategoryPage;
