import React from 'react';
import { useParams } from 'react-router-dom';

const AdminOrderDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="admin-container">
      <h1>Order Details</h1>
      <p>View details for order ID: {id}</p>
    </div>
  );
};

export default AdminOrderDetailsPage;