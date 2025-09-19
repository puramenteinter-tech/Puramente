import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseURL from "../../../baseurl";
import { Helmet } from "react-helmet-async";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BaseURL}/api/blogs/${slug}`);

        if (!res.data?.blog) {
          throw new Error("Blog data structure invalid");
        }

        setBlog(res.data.blog);
        setRelatedBlogs(res.data.relatedBlogs || []);
      } catch (err) {
        console.error("Full error details:", {
          error: err,
          response: err.response?.data,
          slug: slug
        });
        setError("Blog not found");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="text-center mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4">Loading blog...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <button
          onClick={() => navigate("/blogs")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded text-center">
        <p>Blog not found.</p>
      </div>
    );
  }

  const createMarkup = (html) => ({ __html: html });

  return (
    <>
      <Helmet>
        <title>{blog.metaTitle || blog.title}</title>
        <meta
          name="description"
          content={blog.metaDescription || blog.excerpt}
        />
        <meta property="og:title" content={blog.metaTitle || blog.title} />
        <meta
          property="og:description"
          content={blog.metaDescription || blog.excerpt}
        />
        {blog.image && (
          <meta property="og:image" content={`${BaseURL}${blog.image}`} />
        )}
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Main Blog */}
        <article className="bg-white shadow rounded-lg overflow-hidden">
          {blog.image && (
            <img
              src={`${BaseURL}${blog.image}`}
              alt={blog.title}
              className="w-full h-96 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${BaseURL}/placeholder-blog.jpg`;
              }}
            />
          )}

          <div className="p-6 md:p-8">
            <span className="text-gray-500 text-sm">
              {new Date(blog.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>

            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {blog.title}
            </h1>

            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={createMarkup(blog.content)}
            />
          </div>
        </article>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <div
                  key={relatedBlog._id}
                  className="bg-white shadow rounded-lg overflow-hidden"
                >
                  {relatedBlog.image && (
                    <img
                      src={`${BaseURL}${relatedBlog.image}`}
                      alt={relatedBlog.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {relatedBlog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {relatedBlog.excerpt ||
                        relatedBlog.content.substring(0, 100)}
                      ...
                    </p>
                    <a
                      href={`/blogs/${relatedBlog.slug}`}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      Read More →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogDetails;
