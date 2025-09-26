import React, { useState } from "react";
import axios from "axios";
import Dashboard from "../dashboard";
import BaseURL from "../../../baseurl";

export default function ExcelUploader() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setFileName(selectedFile.name);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file before uploading.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(`${BaseURL}/api/products/admin/uploadexcel`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
      });

      if (response.status === 200) {
        alert(`Success! ${response.data.count} products uploaded.`);
      } else {
        alert("Upload failed.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading.");
    } finally {
      setLoading(false);
      setFile(null);
      setFileName("");
    }
  };

  return (
    <div className="bg-cyan-100 min-h-screen  w-full  items-center">
      <Dashboard />
      <div className="flex flex-col items-center justify-center h-[50vh] lg:h-[70vh] p-8 gap-6">
        <h1 className="font-extrabold text-3xl text-cyan-700">
          Upload Products via Excel Sheet
        </h1>
        <div className="bg-cyan-50 p-6 rounded-lg shadow-lg w-full max-w-md border border-cyan-300 flex flex-col items-center">
          <img src="/excel.png" alt="Excel Logo" className="w-16 h-16 mb-4" />
          <h2 className="text-2xl font-bold mb-4 text-center text-cyan-700">Excel File Upload</h2>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full p-2 border border-cyan-400 rounded mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          {fileName && <p className="text-sm text-cyan-600 mb-2">{fileName}</p>}
          <button
            onClick={handleUpload}
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded transition-all"
          >
            {loading ? "Uploading..." : "Upload File"}
          </button>
        </div>
      </div>
    </div>
  );
}
