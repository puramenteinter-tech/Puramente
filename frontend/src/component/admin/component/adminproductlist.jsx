
import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../../../baseurl";
import { useNavigate } from "react-router-dom";

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${BaseURL}/api/products/admin/paginated?page=${page}&limit=10&search=${search}`
      );
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this product?")) {
      await axios.delete(`${BaseURL}/api/products/admin/${id}`);
      fetchProducts();
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#004f6e]">All Products</h2>

      <input
        type="text"
        placeholder="Search by name, code, category..."
        value={search}
        onChange={handleSearchChange}
        className="mb-4 w-full p-2 border border-gray-300 rounded"
      />

      <table className="min-w-full bg-white rounded-xl shadow">
        <thead className="bg-[#004f6e] text-white">
          <tr>
            <th className="py-3 px-4 text-left">Name</th>
            <th className="py-3 px-4 text-left">Code</th>
            <th className="py-3 px-4 text-left">Category</th>
            <th className="py-3 px-4 text-left">Subcategory</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-t">
              <td className="py-3 px-4">{product.name}</td>
              <td className="py-3 px-4">{product.code}</td>
              <td className="py-3 px-4">{product.category}</td>
              <td className="py-3 px-4">{product.subcategory}</td>
              <td className="py-3 px-4">
                <button
                  onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      {/* Pagination controls */}
<div className="mt-4 flex justify-center items-center space-x-4">
  <button
    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
    disabled={page === 1}
    className={`px-3 py-1 rounded ${
      page === 1
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#004f6e] text-white hover:bg-[#003f57]"
    }`}
  >
    Previous
  </button>

  <span className="px-4 py-1 font-semibold text-[#004f6e]">
    Page {page} of {totalPages}
  </span>

  <button
    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={page === totalPages}
    className={`px-3 py-1 rounded ${
      page === totalPages
        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
        : "bg-[#004f6e] text-white hover:bg-[#003f57]"
    }`}
  >
    Next
  </button>
</div>

    </div>
  );
};

export default AdminProductList;
