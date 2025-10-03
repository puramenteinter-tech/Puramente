import React, { useState, useEffect } from "react";
import Dashboard from "../dashboard";
import axios from "axios";
import BaseURL from "../../../baseurl";
import { FlagIcon } from "react-flag-kit";

export default function AdminUserView() {
  const [users, setUsers] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BaseURL}/api/users/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div>
      <Dashboard />
      <div className="container mx-auto p-6 bg-gray-100 min-h-screen flex flex-col items-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">User List</h2>

        <input
          type="text"
          placeholder="Search by Email"
          className="mb-4 p-2 border border-gray-400 rounded-lg w-full max-w-md"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />

        <div className="w-full max-w-4xl overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          {loading ? (
            <p className="text-gray-500 text-center py-4">Loading users...</p>
          ) : error ? (
            <p className="text-red-500 text-center py-4">{error}</p>
          ) : (
            <>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="py-3 px-6 text-left border border-gray-300">
                      Username
                    </th>
                    <th className="py-3 px-6 text-left border border-gray-300">
                      Email
                    </th>
                    <th className="py-3 px-6 text-left border border-gray-300">
                      Phone
                    </th>
                    <th className="py-3 px-6 text-left border border-gray-300">
                      Country
                    </th>
                    <th className="py-3 px-6 text-left border border-gray-300">
                      Company Name
                    </th>
                    <th className="py-3 px-6 text-left border border-gray-300">
                      Company Website
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => {
                    return (
                      <tr
                        key={user._id}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-gray-200 transition-all`}
                      >
                        <td className="py-3 px-6 border border-gray-300 font-medium text-gray-700">
                          {user.name}
                        </td>
                        <td className="py-3 px-6 border border-gray-300 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-3 px-6 border border-gray-300 text-gray-600">
                          {user.contactNumber || "N/A"}
                        </td>
                        <td className="py-3 px-6 border border-gray-300 text-gray-600 flex items-center gap-2">
                          {user.country ? (
                            <FlagIcon
                              code={user.country.toUpperCase()}
                              size={24}
                            />
                          ) : (
                            <span className="text-gray-400">🌍</span>
                          )}
                          {user.country || "N/A"}
                        </td>
                        <td className="py-3 px-6 border border-gray-300 text-gray-600">
                          {user.companyName || "N/A"}
                        </td>
                        <td className="py-3 px-6 border border-gray-300 text-gray-600">
                          {user.companyWebsite ? (
                            <a
                              href={user.companyWebsite}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              {user.companyWebsite}
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <p className="text-gray-500 text-center py-4">No users found</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
