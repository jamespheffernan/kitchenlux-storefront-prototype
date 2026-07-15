import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, getProducts, getUsers } from '../../api';
import AdminHeader from '../../components/admin/AdminHeader';
import './AdminStyles.css';

const AdminDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    topProducts: [],
    recentCustomers: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all required data in parallel
        const [ordersData, productsData, usersData] = await Promise.all([
          getOrders(),
          getProducts(),
          getUsers(),
        ]);

        setOrders(ordersData.orders || []);
        setProducts(productsData.products || []);
        setUsers(usersData || []);

        // Calculate dashboard statistics
        calculateStats(ordersData.orders || [], productsData.products || [], usersData || []);

        setLoading(false);
      } catch (error) {
        setError(error.message || 'Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateStats = (orders, products, users) => {
    // Calculate total sales
    const totalSales = orders.reduce((sum, order) => sum + (order.isPaid ? order.totalPrice : 0), 0);

    // Count pending orders
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    // Find top products (based on number of times ordered)
    const productOrderCount = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (productOrderCount[item.product]) {
          productOrderCount[item.product].count += item.qty;
          productOrderCount[item.product].revenue += item.price * item.qty;
        } else {
          productOrderCount[item.product] = {
            count: item.qty,
            revenue: item.price * item.qty,
            name: item.name
          };
        }
      });
    });

    const topProducts = Object.keys(productOrderCount)
      .map(key => ({
        id: key,
        ...productOrderCount[key],
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Find recent customers
    const recentCustomers = users
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);

    setStats({
      totalSales,
      pendingOrders,
      topProducts,
      recentCustomers,
    });
  };

  if (loading) {
    return <div className="loader"></div>;
  }

  if (error) {
    return (
      <div className="admin-page">
        <div className="container">
          <AdminHeader />
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <AdminHeader />

        <div className="admin-dashboard">
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-card-icon orders-icon">📦</div>
              <div className="stat-card-content">
                <h3>Total Orders</h3>
                <div className="stat-card-value">{orders.length}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon revenue-icon">💰</div>
              <div className="stat-card-content">
                <h3>Total Revenue</h3>
                <div className="stat-card-value">${stats.totalSales.toFixed(2)}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon products-icon">🔪</div>
              <div className="stat-card-content">
                <h3>Products</h3>
                <div className="stat-card-value">{products.length}</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-card-icon users-icon">👥</div>
              <div className="stat-card-content">
                <h3>Customers</h3>
                <div className="stat-card-value">{users.length}</div>
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card recent-orders">
              <div className="card-header">
                <h3>Recent Orders</h3>
                <Link to="/admin/orders" className="view-all">View All</Link>
              </div>

              <div className="card-content">
                {orders.slice(0, 5).map(order => (
                  <div key={order._id} className="recent-order-item">
                    <div className="order-info">
                      <div className="order-id">{order._id}</div>
                      <div className="order-date">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="order-status-price">
                      <div className={`order-status ${order.status}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </div>
                      <div className="order-price">${order.totalPrice.toFixed(2)}</div>
                    </div>
                    <Link to={`/admin/orders/${order._id}`} className="btn btn-sm">View</Link>
                  </div>
                ))}

                {orders.length === 0 && (
                  <div className="empty-message">No orders yet</div>
                )}
              </div>
            </div>

            <div className="dashboard-card top-products">
              <div className="card-header">
                <h3>Top Products</h3>
                <Link to="/admin/products" className="view-all">View All</Link>
              </div>

              <div className="card-content">
                {stats.topProducts.map(product => (
                  <div key={product.id} className="top-product-item">
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-quantity">{product.count} units sold</div>
                    </div>
                    <div className="product-revenue">${product.revenue.toFixed(2)}</div>
                  </div>
                ))}

                {stats.topProducts.length === 0 && (
                  <div className="empty-message">No product sales yet</div>
                )}
              </div>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="dashboard-card pending-orders">
              <div className="card-header">
                <h3>Pending Orders</h3>
                <span className="pending-count">{stats.pendingOrders}</span>
              </div>

              <div className="card-content">
                {orders
                  .filter(order => order.status === 'pending')
                  .slice(0, 5)
                  .map(order => (
                    <div key={order._id} className="pending-order-item">
                      <div className="order-info">
                        <div className="order-id">{order._id}</div>
                        <div className="order-date">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="order-price">${order.totalPrice.toFixed(2)}</div>
                      <Link to={`/admin/orders/${order._id}`} className="btn btn-sm">View</Link>
                    </div>
                  ))}

                {orders.filter(order => order.status === 'pending').length === 0 && (
                  <div className="empty-message">No pending orders</div>
                )}
              </div>
            </div>

            <div className="dashboard-card recent-customers">
              <div className="card-header">
                <h3>Recent Customers</h3>
                <Link to="/admin/users" className="view-all">View All</Link>
              </div>

              <div className="card-content">
                {stats.recentCustomers.map(user => (
                  <div key={user._id} className="recent-customer-item">
                    <div className="customer-info">
                      <div className="customer-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="customer-name">{user.name}</div>
                        <div className="customer-email">{user.email}</div>
                      </div>
                    </div>
                    <div className="customer-joined">
                      Joined {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}

                {stats.recentCustomers.length === 0 && (
                  <div className="empty-message">No customers yet</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;