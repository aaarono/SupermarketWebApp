import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { BiError } from "react-icons/bi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const productsPerPage = 8;

  const dummyProducts = [
    {
      id: 1,
      name: "Premium Coffee Maker",
      price: 129.99,
      category: "appliances",
      description: "Professional-grade coffee maker with temperature control",
      image: "images.unsplash.com/photo-1495474472287-4d71bcdd2085"
    },
    {
      id: 2,
      name: "Wireless Headphones",
      price: 199.99,
      category: "electronics",
      description: "Noise-canceling wireless headphones with premium sound",
      image: "images.unsplash.com/photo-1505740420928-5e560c06d30e"
    },
    {
      id: 3,
      name: "Leather Backpack",
      price: 79.99,
      category: "accessories",
      description: "Handcrafted leather backpack with multiple compartments",
      image: "images.unsplash.com/photo-1553062407-98eeb64c6a62"
    },
    // Add more dummy products as needed
  ];

  const categories = ["all", "electronics", "appliances", "accessories"];

  useEffect(() => {
    const fetchProducts = () => {
      setLoading(true);
      try {
        setProducts(dummyProducts);
        setError(null);
      } catch (err) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(
      (product) =>
        (selectedCategory === "all" ||
          product.category === selectedCategory) &&
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-theme-color-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
        <BiError className="text-5xl mb-4" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
              aria-label="Search products"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-theme-color-primary"
            aria-label="Filter by category"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {currentProducts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:transform hover:scale-105"
            >
              <div className="relative pb-[75%] overflow-hidden">
                <img
                  src={`https://${product.image}`}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-theme-color-primary font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <button
                    className="bg-theme-color-primary text-white px-4 py-2 rounded-lg hover:bg-theme-color-primary-dark transition-colors duration-300 flex items-center gap-2"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <FiShoppingCart />
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === index + 1
                  ? "bg-theme-color-primary text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-label={`Page ${index + 1}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
