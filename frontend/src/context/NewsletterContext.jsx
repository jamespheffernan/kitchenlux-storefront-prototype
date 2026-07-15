import React, { createContext, useState, useEffect } from 'react';

export const NewsletterContext = createContext();

export const NewsletterProvider = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [hasClosedPopup, setHasClosedPopup] = useState(false);
  const [exitIntent, setExitIntent] = useState(false);

  useEffect(() => {
    // Check localStorage to see if user already subscribed or dismissed
    const subscriptionStatus = localStorage.getItem('newsletterSubscribed');
    const popupClosed = localStorage.getItem('newsletterPopupClosed');

    if (subscriptionStatus === 'true') {
      setIsSubscribed(true);
    }

    if (popupClosed === 'true') {
      setHasClosedPopup(true);
    }

    // Newsletter popup is currently disabled
    // Exit intent and timed popups are both turned off

    /*
    // Set a minimum delay before exit intent can trigger (prevent immediate firing)
    const minDelay = setTimeout(() => {
      // Add exit intent detection
      const handleMouseLeave = (e) => {
        // For testing purposes in development mode, trigger even on low mouse movements
        if (import.meta.env.MODE === 'development') {
          // Less strict detection for development testing
          if (e.clientY <= 50 && !isSubscribed && !hasClosedPopup && !showPopup) {
            console.log('Exit intent detected (dev mode)');
            setExitIntent(true);
            setShowPopup(true);
          }
        } else {
          // Production behavior: only trigger when mouse leaves through the top of the page
          if (e.clientY <= 0 && !isSubscribed && !hasClosedPopup && !showPopup) {
            console.log('Exit intent detected');
            setExitIntent(true);
            setShowPopup(true);
          }
        }
      };

      // Add event listeners
      document.addEventListener('mouseleave', handleMouseLeave);

      // Cleanup for this inner effect
      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, 2000); // Wait 2 seconds before enabling exit intent

    // Set a timer for 30 seconds to show popup if still on page
    const timer = setTimeout(() => {
      if (!isSubscribed && !hasClosedPopup && !showPopup) {
        setShowPopup(true);
      }
    }, 30000);

    // Cleanup
    return () => {
      clearTimeout(minDelay);
      clearTimeout(timer);
    };
    */

    // No active event listeners or timers while disabled
    return () => {};
  }, [isSubscribed, hasClosedPopup, showPopup]);

  // Function to mark as subscribed
  const markAsSubscribed = () => {
    setIsSubscribed(true);
    setShowPopup(false);
    localStorage.setItem('newsletterSubscribed', 'true');
  };

  // Function to close popup
  const closePopup = () => {
    setShowPopup(false);
    setHasClosedPopup(true);
    localStorage.setItem('newsletterPopupClosed', 'true');
  };

  // Function to reset popup for testing
  const resetPopupState = () => {
    localStorage.removeItem('newsletterSubscribed');
    localStorage.removeItem('newsletterPopupClosed');
    setIsSubscribed(false);
    setHasClosedPopup(false);
    setShowPopup(false);
  };

  return (
    <NewsletterContext.Provider
      value={{
        showPopup,
        setShowPopup,
        isSubscribed,
        hasClosedPopup,
        exitIntent,
        markAsSubscribed,
        closePopup,
        resetPopupState
      }}
    >
      {children}
    </NewsletterContext.Provider>
  );
};

export default NewsletterProvider;