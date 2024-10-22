import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const Add = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(""); // New state for stock
  const [file, setFile] = useState(""); 
  const [imagePreview, setImagePreview] = useState("");

  const addProduct = async (e) => {
    e.preventDefault();

    const productData = {
      title,
      description,
      price,
      category,
      stock, // Include stock in product data
      image: file, // Send the base64 string as "image"
    };

    try {
      const result = await axios.post(
        "http://localhost:5000/api/v2/createProduct",
        productData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
        }
      );

      // Display success message from backend
      toast.success(result.data.message || "Product added successfully!");
    } catch (error) {
      // Check if error has a response and display the error message from backend
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred while adding the product.");
      }
    }
  };

  const handleFile = (e) => {
    const selectedFile = e.target.files[0];

    const reader = new FileReader();
    reader.onloadend = function () {
      const base64String = reader.result;
      setImagePreview(base64String); // Preview the image as base64
      setFile(base64String); // Set the base64 string as the file
    };

    // Read the file as Data URL (base64 string)
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="bg-[#f9fafb] min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#10b981]">Add Product</h1>
        <form onSubmit={addProduct} className="space-y-6">
          <div>
            <label className="block text-gray-700">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              placeholder="Enter product title"
            />
          </div>

          <div>
            <label className="block text-gray-700">Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              placeholder="Enter product description"
            />
          </div>

          <div>
            <label className="block text-gray-700">Price:</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              placeholder="Enter product price"
            />
          </div>

          <div>
            <label className="block text-gray-700">Category:</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              placeholder="Enter product category"
            />
          </div>

          {/* Stock field */}
          <div>
            <label className="block text-gray-700">Stock:</label>
            <input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
              placeholder="Enter stock quantity"
            />
          </div>

          <div>
            <label className="block text-gray-700">Image:</label>
            <input
              type="file"
              onChange={handleFile}
              className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981]"
            />
          </div>

          {/* Image preview */}
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Preview" className="w-48 mx-auto rounded-md" />
            </div>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#10b981] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#0e9a6d] transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
