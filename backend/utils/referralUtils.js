const ReferralCode = require('../models/referralCodeModel');

/**
 * Generates a unique 8-character alphanumeric referral code
 * The code is readable, avoids ambiguous characters, and is checked for uniqueness
 */
const generateReferralCode = async () => {
  // Define characters to use (avoiding ambiguous ones like 0/O, 1/I/l, etc.)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code;
  let isUnique = false;

  // Keep generating until we find a unique code
  while (!isUnique) {
    // Generate an 8-character code
    code = '';
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }

    // Format as XXXX-XXXX for better readability
    code = `${code.substring(0, 4)}-${code.substring(4)}`;

    // Check if this code already exists in the database
    const existingCode = await ReferralCode.findOne({ code });

    if (!existingCode) {
      isUnique = true;
    }
  }

  return code;
};

/**
 * Calculate commission amount based on order subtotal
 * @param {Number} subtotal - Order subtotal before tax and delivery
 * @param {Number} commissionRate - Commission rate as a percentage (default: 15%)
 * @returns {Number} Commission amount
 */
const calculateCommission = (subtotal, commissionRate = 15) => {
  return (subtotal * (commissionRate / 100)).toFixed(2) * 1; // Multiply by 1 to convert back to number
};

/**
 * Calculate discount amount based on order subtotal
 * @param {Number} subtotal - Order subtotal before tax and delivery
 * @param {Number} discountRate - Discount rate as a percentage (default: 10%)
 * @returns {Number} Discount amount
 */
const calculateDiscount = (subtotal, discountRate = 10) => {
  return (subtotal * (discountRate / 100)).toFixed(2) * 1; // Multiply by 1 to convert back to number
};

/**
 * Update host referral earnings when their code is used
 * @param {Object} order - The order object
 * @param {Object} user - The host user object
 * @param {Number} commissionAmount - The commission amount
 */
const updateHostEarnings = async (user, commissionAmount, order) => {
  // Update total earned and pending payout
  user.referralEarnings.totalEarned += commissionAmount;
  user.referralEarnings.pendingPayout += commissionAmount;

  // Add transaction record
  user.referralEarnings.transactions.push({
    type: 'earning',
    amount: commissionAmount,
    orderId: order._id,
    referralCode: order.referral.code,
    status: 'completed',
    notes: `Commission from order #${order._id}`,
  });

  await user.save();
};

module.exports = {
  generateReferralCode,
  calculateCommission,
  calculateDiscount,
  updateHostEarnings,
};