import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Product = () => {
  const location = useLocation();
  const { product } = location.state || {}; // Access product from state

  if (!product) {
    return <p>No product selected</p>;
  }

  return (
    <div>
      <h2>Product Details</h2>
      <p>{product.name}</p>
      <p>{product.description}</p>
      <a href="/">Back</a>
    </div>
  );
};

export default Product;
