// API service for interacting with the KitchenLux backend
// For production deployment, we use the backend on Render.com
// For development, we use the local dev server
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

// Function to get the JWT token from local storage
const getToken = () => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? JSON.parse(userInfo).token : null;
};

// Product API calls
export const getProducts = async (keyword = '', pageNumber = '', category = '') => {
  try {
    let url = `${API_URL}/products?`;
    if (keyword) url += `keyword=${keyword}&`;
    if (pageNumber) url += `pageNumber=${pageNumber}&`;
    if (category) url += `category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductDetails = async (id) => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/products/slug/${slug}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    throw error;
  }
};

export const fetchTopProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/top`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching top products:', error);
    throw error;
  }
};

// Product review
export const createProductReview = async (productId, review) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(review),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error creating product review:', error);
    throw error;
  }
};

// User API calls
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await handleResponse(response);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const register = async (name, email, password, phone, address) => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password, phone, address }),
    });

    const data = await handleResponse(response);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    const data = await handleResponse(response);

    // Update localStorage with new user data if token is included
    if (data.token) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

export const becomeHost = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users/profile/become-host`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await handleResponse(response);

    // Update localStorage with new user data and host status
    if (data.token) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    }

    return data;
  } catch (error) {
    console.error('Error becoming a host:', error);
    throw error;
  }
};

// Order API calls
export const createOrder = async (orderData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrderDetails = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

export const payOrder = async (orderId, paymentMethodId) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders/${orderId}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentMethodId }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const getMyOrders = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders/myorders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching my orders:', error);
    throw error;
  }
};

// Admin API calls
export const getUsers = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/users/${user._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getOrders = async (pageNumber = '') => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders?pageNumber=${pageNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const deliverOrder = async (orderId) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders/${orderId}/deliver`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error marking order as delivered:', error);
    throw error;
  }
};

export const pickupOrder = async (orderId) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders/${orderId}/pickup`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error marking order as picked up:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (product) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/products/${product._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Newsletter subscription
export const subscribeToNewsletter = async (email, source = 'exit-popup') => {
  try {
    const response = await fetch(`${API_URL}/newsletter/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source,
        discount: source === 'exit-popup' ? '10' : null
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    throw error;
  }
};

// Referral API calls
export const generateReferralCode = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/referral/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error generating referral code:', error);
    throw error;
  }
};

// Custom Kit API calls
export const getKitEligibleProducts = async (keyword = '', pageNumber = '', category = '') => {
  try {
    let url = `${API_URL}/products/kit-eligible?`;
    if (keyword) url += `keyword=${keyword}&`;
    if (pageNumber) url += `pageNumber=${pageNumber}&`;
    if (category) url += `category=${category}`;

    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching kit-eligible products:', error);
    throw error;
  }
};

export const createCustomKit = async (kitData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kitData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error creating custom kit:', error);
    throw error;
  }
};

export const getMyKits = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/my-kits`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching my kits:', error);
    throw error;
  }
};

export const getKitById = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching kit details:', error);
    throw error;
  }
};

export const updateKit = async (id, kitData) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(kitData),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error updating kit:', error);
    throw error;
  }
};

export const deleteKit = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error deleting kit:', error);
    throw error;
  }
};

export const addKitToCart = async (id) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/${id}/add-to-cart`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error adding kit to cart:', error);
    throw error;
  }
};

export const getKitTemplates = async () => {
  try {
    const response = await fetch(`${API_URL}/kits/templates`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching kit templates:', error);
    throw error;
  }
};

export const generateKitFromTemplate = async (templateId) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/kits/from-template`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ templateId }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error generating kit from template:', error);
    throw error;
  }
};

export const getMyReferralCode = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/referral/mycode`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching referral code:', error);
    throw error;
  }
};

export const getReferralStats = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/referral/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    throw error;
  }
};

export const requestReferralPayout = async (paymentMethod) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/referral/payout-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ paymentMethod }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error requesting payout:', error);
    throw error;
  }
};

export const validateReferralCode = async (code) => {
  try {
    const response = await fetch(`${API_URL}/referral/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error validating referral code:', error);
    throw error;
  }
};

// Admin referral API calls
export const getAllReferralCodes = async (pageNumber = 1) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/referral/admin/referrals?pageNumber=${pageNumber}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching all referral codes:', error);
    throw error;
  }
};

export const processReferralPayout = async (payoutId, data) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Authentication required');

    const response = await fetch(`${API_URL}/referral/admin/process-payout/${payoutId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error processing payout:', error);
    throw error;
  }
};
