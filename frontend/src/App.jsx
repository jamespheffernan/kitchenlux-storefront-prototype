import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import NewsletterPopup from './components/newsletter/NewsletterPopup';
import TestNewsletterButton from './components/newsletter/TestNewsletterButton';

// Page Components
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import BookingPage from './pages/BookingPage';
import ConfirmationPage from './pages/ConfirmationPage';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import HostDashboardPage from './pages/HostDashboardPage';
import KitBuilderPage from './pages/KitBuilderPage';
import MyKitsPage from './pages/MyKitsPage';

// Collection Pages
import BBQCollectionPage from './pages/collections/BBQCollectionPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminOrderDetailsPage from './pages/admin/AdminOrderDetailsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminUserEditPage from './pages/admin/AdminUserEditPage';
import AdminReferralsPage from './pages/admin/AdminReferralsPage';

// Route Components
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import HostRoute from './components/routing/HostRoute';

// Import shared styles for About, FAQ, and How It Works pages
import './pages/AboutFAQ.css';

const App = () => {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<CatalogPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/confirmation/:id" element={<ConfirmationPage />} />

          {/* Host Routes */}
          <Route path="/host-dashboard" element={<HostRoute><HostDashboardPage /></HostRoute>} />

          {/* Kit Builder Routes */}
          <Route path="/build-kit" element={<PrivateRoute><KitBuilderPage /></PrivateRoute>} />
          <Route path="/build-kit/:id" element={<PrivateRoute><KitBuilderPage /></PrivateRoute>} />
          <Route path="/my-kits" element={<PrivateRoute><MyKitsPage /></PrivateRoute>} />

          {/* Information Pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Collection Routes */}
          <Route path="/collections/bbq-collection" element={<BBQCollectionPage />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProductsPage /></AdminRoute>} />
          <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductEditPage /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrdersPage /></AdminRoute>} />
          <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetailsPage /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsersPage /></AdminRoute>} />
          <Route path="/admin/users/:id/edit" element={<AdminRoute><AdminUserEditPage /></AdminRoute>} />
          <Route path="/admin/referrals" element={<AdminRoute><AdminReferralsPage /></AdminRoute>} />
        </Routes>
      </main>
      <Footer />
      {/* Temporarily disabled newsletter popup */}
      {/* <NewsletterPopup /> */}
      {/* <TestNewsletterButton /> */}
    </Router>
  );
}

export default App;
