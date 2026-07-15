import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [rentalDates, setRentalDates] = useState({
    start: null,
    end: null,
  });
  const [damageProtection, setDamageProtection] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart data from localStorage:', error);
      }
    }

    // Load rental dates from localStorage
    const savedRentalDates = localStorage.getItem('rentalDates');
    if (savedRentalDates) {
      try {
        const parsedDates = JSON.parse(savedRentalDates);
        setRentalDates({
          start: parsedDates.start ? new Date(parsedDates.start) : null,
          end: parsedDates.end ? new Date(parsedDates.end) : null,
        });
      } catch (error) {
        console.error('Error parsing rental dates from localStorage:', error);
      }
    }

    // Load damage protection setting from localStorage
    const savedDamageProtection = localStorage.getItem('damageProtection');
    if (savedDamageProtection) {
      try {
        setDamageProtection(JSON.parse(savedDamageProtection));
      } catch (error) {
        console.error('Error parsing damage protection from localStorage:', error);
      }
    }

    setLoading(false);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Save rental dates to localStorage
  useEffect(() => {
    localStorage.setItem('rentalDates', JSON.stringify(rentalDates));
  }, [rentalDates]);

  // Save damage protection setting to localStorage
  useEffect(() => {
    localStorage.setItem('damageProtection', JSON.stringify(damageProtection));
  }, [damageProtection]);

  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find(item => item._id === product._id);

    if (existingItem) {
      // Update quantity if item already exists in cart
      setCartItems(cartItems.map(item =>
        item._id === product._id ? { ...item, qty: item.qty + quantity } : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...product, qty: quantity }]);
    }

    toast.success(`${product.name} added to cart`);
  };

  // Add a custom kit to cart
  const addCustomKitToCart = (kit) => {
    const existingItem = cartItems.find(item =>
      item.isCustomKit && item._id === kit._id
    );

    if (existingItem) {
      // Update quantity if kit already exists
      setCartItems(cartItems.map(item =>
        (item.isCustomKit && item._id === kit._id)
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      // Add new kit to cart
      setCartItems([...cartItems, { ...kit, qty: 1 }]);
    }

    toast.success(`Custom Kit "${kit.name}" added to cart`);
  };

  const removeFromCart = (id) => {
    const itemToRemove = cartItems.find(item => item._id === id);
    if (!itemToRemove) return;

    setCartItems(cartItems.filter(item => item._id !== id));
    toast.info(`${itemToRemove.name} removed from cart`);
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;

    setCartItems(cartItems.map(item =>
      item._id === id ? { ...item, qty } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
    toast.info('Cart cleared');
  };

  const setRentalPeriod = (start, end) => {
    setRentalDates({ start, end });
  };

  const toggleDamageProtection = () => {
    setDamageProtection(!damageProtection);
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  // Calculate number of days for the rental
  const rentalDays = rentalDates.start && rentalDates.end ?
    Math.ceil((rentalDates.end - rentalDates.start) / (1000 * 60 * 60 * 24)) : 0;

  // Calculate damage protection fee (10% of subtotal if enabled)
  const damageProtectionFee = damageProtection ? subtotal * 0.1 : 0;

  // Calculate delivery fee (flat rate)
  const deliveryFee = subtotal > 0 ? 15 : 0;

  // Calculate tax (8.25%)
  const tax = subtotal * 0.0825;

  // Calculate total
  const total = subtotal + damageProtectionFee + deliveryFee + tax;

  const value = {
    cartItems,
    rentalDates,
    damageProtection,
    loading,
    addToCart,
    addCustomKitToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    setRentalPeriod,
    toggleDamageProtection,
    itemCount: cartItems.reduce((acc, item) => acc + item.qty, 0),
    subtotal,
    rentalDays,
    damageProtectionFee,
    deliveryFee,
    tax,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};