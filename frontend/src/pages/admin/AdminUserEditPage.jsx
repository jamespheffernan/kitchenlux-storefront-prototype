import React from 'react';
import { useParams } from 'react-router-dom';

const AdminUserEditPage = () => {
  const { id } = useParams();

  return (
    <div className="admin-container">
      <h1>Edit User</h1>
      <p>Edit user details for user ID: {id}</p>
    </div>
  );
};

export default AdminUserEditPage;