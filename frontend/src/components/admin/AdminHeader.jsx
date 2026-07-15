import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminHeader.css';

const AdminHeader = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="admin-header">
      <h1 className="admin-title">Admin Dashboard</h1>

      <nav className="admin-nav">
        <Link
          to="/admin/dashboard"
          className={`admin-nav-link ${currentPath === '/admin/dashboard' ? 'active' : ''}`}
        >
          Dashboard
        </Link>
        <Link
          to="/admin/products"
          className={`admin-nav-link ${currentPath.includes('/admin/products') ? 'active' : ''}`}
        >
          Products
        </Link>
        <Link
          to="/admin/orders"
          className={`admin-nav-link ${currentPath.includes('/admin/orders') ? 'active' : ''}`}
        >
          Orders
        </Link>
        <Link
          to="/admin/users"
          className={`admin-nav-link ${currentPath.includes('/admin/users') ? 'active' : ''}`}
        >
          Users
        </Link>
      </nav>
    </div>
  );
};

export default AdminHeader;