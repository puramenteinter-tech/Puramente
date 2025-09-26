import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BaseURL from "../../../baseurl";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    metaTitle: "",
    metaDescription: "",
    image: null,
  });

  const [currentImage, setCurrentImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${BaseURL}/api/blogs`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        const blog = res.data.blogs.find((b) => b._id === id);
        if (blog) {
          setFormData({ 
            title: blog.title, 
            content: blog.content, 
            excerpt: blog.excerpt || "",
            metaTitle: blog.metaTitle || "",
            metaDescription: blog.metaDescription || "",
            image: null 
          });
          setCurrentImage(blog.image);
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    fetchBlog();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("excerpt", formData.excerpt);
      data.append("metaTitle", formData.metaTitle);
      data.append("metaDescription", formData.metaDescription);
      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.put(`${BaseURL}/api/blogs/${id}`, data, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setSuccessMessage("Blog updated successfully ✅");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error updating blog:", err);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Edit Blog</h2>

      {successMessage && (
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded mb-4">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <div>
          <label className="block font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded h-40"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Excerpt</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded h-24"
            maxLength={160}
          />
        </div>

        <div>
          <label className="block font-medium">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            maxLength={60}
          />
        </div>

        <div>
          <label className="block font-medium">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded h-24"
            maxLength={160}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Current Image</label>
          {currentImage && !previewImage && (
            <img
              src={`${BaseURL}${currentImage}`}
              alt="Current"
              className="h-32 mb-2 rounded"
            />
          )}

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="h-32 mb-2 rounded border"
            />
          )}

          {/* Upload Button with Icon */}
          <label className="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12v9m0 0l-3-3m3 3l3-3m3-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Change Image</span>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Update Blog
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
