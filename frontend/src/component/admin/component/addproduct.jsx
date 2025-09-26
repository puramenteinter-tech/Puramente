import React, { useState } from "react";
import axios from "axios";
import Dashboard from "../dashboard";
import BaseURL from "../../../baseurl";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    category: "",
    code: "",
    subcategory: "",
  });

  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset previous errors
    setError(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Only image files are allowed (JPEG, PNG, etc.)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate all fields
    if (!product.name || !product.description || !product.category || 
        !product.code || !product.subcategory) {
      setError('All fields are required');
      return;
    }

    if (!image) {
      setError('Please select a product image');
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("category", product.category);
      formData.append("code", product.code);
      formData.append("subcategory", product.subcategory);

      console.log('Sending request to server...'); // Debug log
      const response = await axios.post(
        `${BaseURL}/api/products/admin/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      console.log('Server response:', response.data); // Debug log

      if (response.data && (response.data.message === "Product added" || response.data.product)) {
  alert("Product added successfully!");
  navigate("/dashboard");
} else {
  setError(response.data.error || "Failed to add product");
}

    } catch (error) {
      console.error('API Error:', error);
      
      let errorMessage = "An error occurred while adding the product";
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data.error || 
                      error.response.data.message || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response
        errorMessage = "No response from server. Please try again.";
      }

      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <Dashboard />
      <div className="max-w-lg mx-auto my-4 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">
          Add New Product
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Product Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
            {image && (
              <div className="mt-4">
                <p className="text-gray-600 text-sm">Image Preview:</p>
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-40 h-40 object-contain rounded mt-2 border"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Category</label>
            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              <option value="Rings">Rings</option>
              <option value="Bracelets">Bracelets</option>
              <option value="Earrings">Earrings</option>
              <option value="Necklaces">Necklaces</option>
              <option value="Pendants">Pendants</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Subcategory</label>
            <select
              name="subcategory"
              value={product.subcategory}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none"
              required
            >
              <option value="">Select subcategory</option>
              <option value="withgemstone">withgemstone</option>
              <option value="withoutgemstone">withoutgemstone</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Product Code</label>
            <input
              name="code"
              value={product.code}
              onChange={handleChange}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-lg transition duration-200 ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;