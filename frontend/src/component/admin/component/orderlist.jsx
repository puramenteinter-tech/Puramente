import React, { useState, useEffect } from "react";
import axios from "axios";
import Dashboard from "../dashboard";
import BaseURL from "../../../baseurl";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/orders/orders`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      order._id?.toLowerCase().includes(term) ||
      order.firstName?.toLowerCase().includes(term) ||
      order.email?.toLowerCase().includes(term) ||
      order.companyName?.toLowerCase().includes(term) ||
      order.country?.toLowerCase().includes(term) ||
      (Array.isArray(order.orderDetails) &&
        order.orderDetails.some((item) =>
          item.name?.toLowerCase().includes(term)
        ))
    );
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (page) => setCurrentPage(page);

  // Delete order
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
await axios.delete(`${BaseURL}/api/orders/orders/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setOrders(orders.filter((o) => o._id !== id));
      } catch (err) {
        alert("Failed to delete order.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Dashboard />
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 text-center sm:text-left">
            Recent Orders
          </h2>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full sm:w-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstOrder + 1}-
              {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
              {filteredOrders.length} orders
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading orders...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto mt-4">
                <table className="w-full border-collapse min-w-[45rem]">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700">
                      {[
                        "Order ID",
                        "Customer",
                        "Email",
                        "Company",
                        "Country",
                        "Order Details",
                        "Created At",
                        "Download Excel",
                        "Delete",
                      ].map((header) => (
                        <th
                          key={header}
                          className="p-3 text-left border-b border-gray-300"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrders.length > 0 ? (
                      currentOrders.map((order, i) => (
                        <tr
                          key={order._id}
                          className={`${
                            i % 2 === 0 ? "bg-gray-50" : "bg-white"
                          } hover:bg-gray-100 transition-all`}
                        >
                          <td className="p-3 border-b border-gray-200 font-medium text-gray-700">
                            {order.orderId}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-gray-600">
                            {order.firstName}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-gray-700">
                            {order.email}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-gray-700">
                            {order.companyName || "-"}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-gray-700">
                            {order.country}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-gray-700">
                            {Array.isArray(order.orderDetails)
                              ? order.orderDetails.map((item, j) => (
                                  <div key={j} className="text-sm">
                                    {item.name} (x{item.quantity})
                                  </div>
                                ))
                              : "-"}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-gray-700">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 border-b border-gray-200 text-blue-600">
                            {order.excelFilePath ? (
                              <a
                                href={`${BaseURL}/api/orders${order.excelFilePath.replace(
                                  "/uploads",
                                  "/download"
                                )}`}
                                download
                                className="hover:underline"
                              >
                                Download
                              </a>
                            ) : (
                              "No File"
                            )}
                          </td>
                          <td className="p-3 border-b border-gray-200">
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition cursor-pointer"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="9"
                          className="p-4 text-gray-500 text-center"
                        >
                          No orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredOrders.length > ordersPerPage && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center gap-1">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (num) => (
                        <button
                          key={num}
                          onClick={() => paginate(num)}
                          className={`px-3 py-1 border rounded-md ${
                            currentPage === num
                              ? "bg-blue-500 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {num}
                        </button>
                      )
                    )}
                    <button
                      onClick={() =>
                        paginate(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderList;
