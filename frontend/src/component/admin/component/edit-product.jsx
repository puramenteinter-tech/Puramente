import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import BaseURL from "../../../baseurl";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    subcategory: "",
    description: "",
    code: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BaseURL}/api/products/single/${id}`);
        const data = res.data;

        setProduct({
          name: data.name || "",
          category: data.category || "",
          subcategory: data.subcategory || "",
          description: data.description || "",
          code: data.code || "",
        });

        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Submitting form...");
  
  try {
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("subcategory", product.subcategory);
    formData.append("description", product.description);
    formData.append("code", product.code);
    
    if (imageFile) {
      console.log("Updating with image...");
      formData.append("image", imageFile);
    } else {
      console.log("Updating without image...");
    }

    const res = await axios.put(`${BaseURL}/api/products/admin/${id}`, formData, {
      headers: { 
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
    });
    
    console.log("Response:", res.data);
    alert("Product updated.");
    navigate("/");
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    alert("Failed to update product.");
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow mt-6">
      <h2 className="text-2xl font-bold mb-6 text-[#004f6e]">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleInputChange}
          placeholder="Product Name"
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="text"
          name="code"
          value={product.code}
          onChange={handleInputChange}
          placeholder="Product Code"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <select
          name="category"
          value={product.category}
          onChange={handleInputChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Category</option>
          <option value="Rings">Rings</option>
          <option value="Bracelets">Bracelets</option>
          <option value="Earrings">Earrings</option>
          <option value="Necklaces">Necklaces</option>
          <option value="Pendants">Pendants</option>
        </select>

        <select
          name="subcategory"
          value={product.subcategory}
          onChange={handleInputChange}
          className="w-full border px-4 py-2 rounded"
          required
        >
          <option value="">Select Subcategory</option>
          <option value="withgemstone">withgemstone</option>
          <option value="withoutgemstone">withoutgemstone</option>
        </select>

        <textarea
          name="description"
          value={product.description}
          onChange={handleInputChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <div>
          <label className="block mb-2 text-gray-700 font-medium">Image</label>
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Product Preview"
              className="w-32 h-32 object-cover mb-2 rounded border"
            />
          ) : (
            <p>No image preview available</p>
          )}

          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <label
            htmlFor="imageUpload"
            className="inline-block cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Change Image
          </label>
        </div>

        <button
          type="submit"
          className="bg-[#004f6e] text-white px-6 py-2 rounded hover:bg-[#00384f]"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
