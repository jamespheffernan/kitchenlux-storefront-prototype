import React from 'react';
import { useParams } from 'react-router-dom';

const AdminProductEditPage = () => {
  const { id } = useParams();

  return (
    <div className="admin-container">
      <h1>Edit Product</h1>
      <p>Edit product details for product ID: {id}</p>
    </div>
  );
};

export default AdminProductEditPage;