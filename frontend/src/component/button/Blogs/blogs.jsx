import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import BaseURL from "../../../baseurl";
import { Helmet } from "react-helmet-async";

const ShowBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${BaseURL}/api/blogs`);
        if (res.data && res.data.blogs) {
          setBlogs(res.data.blogs);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Failed to load blogs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const stripHtml = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ");
    return text.replace(/\s+/g, " ").trim();
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 8);
  };

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading blogs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Latest Blogs | Your Site Name</title>
        <meta
          name="description"
          content="Browse our collection of latest blog posts"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-center text-[#004f6e] mb-10">
          Latest Blogs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {blogs.slice(0, visibleCount).map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col"
            >
              <img
                src={blog.image ? `${BaseURL}${blog.image}` : "/journey.webp"}
                alt={blog.title}
                className="w-full h-40 object-cover rounded-md mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/journey.webp";
                }}
              />
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-[#004f6e]">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-700 mt-2">
                  {blog.excerpt && blog.excerpt.length > 0
                    ? blog.excerpt
                    : (() => {
                        const text = stripHtml(blog.content);
                        return text.length > 80 ? text.substring(0, 80) + "..." : text;
                      })()}
                </p>
              </div>
              <Link
                to={`/blogs/${blog.slug}`}
                className="inline-block mt-3 bg-[#004f6e] text-white px-4 py-2 rounded hover:bg-[#006d94] transition-colors text-sm text-center"
              >
                Read More
              </Link>
            </div>
          ))}
        </div>

        {visibleCount < blogs.length && (
          <div className="text-center mt-10">
            <button
              onClick={handleViewMore}
              className="bg-[#004f6e] text-white px-6 py-2 rounded-full hover:bg-[#006d94] transition-colors"
            >
              View More
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ShowBlogs;
