import React, { useEffect, useState } from "react";
import axios from "axios";
import BaseURL from "../../../baseurl";
import { useNavigate } from "react-router-dom";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BaseURL}/api/blogs`);
      setBlogs(res.data.blogs);
    } catch (err) {
      console.error("Error loading blogs:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this blog?")) {
      await axios.delete(`${BaseURL}/api/blogs/${id}`);
      fetchBlogs(); // Refresh list
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#004f6e]">All Blogs</h2>

      <table className="min-w-full bg-white rounded-xl shadow">
        <thead className="bg-[#004f6e] text-white">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Content</th>
            <th className="py-3 px-4 text-left">Date</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id} className="border-t">
              <td className="py-3 px-4">{blog.title}</td>
              <td className="py-3 px-4">
                {blog.content.slice(0, 50)}...
              </td>
              <td className="py-3 px-4">
                {new Date(blog.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => navigate(`/admin/edit-blog/${blog._id}`)}
                  className="text-blue-600 hover:underline mr-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(blog._id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminBlogList;
