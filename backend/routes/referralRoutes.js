const express = require('express');
const router = express.Router();
const {
  createReferralCode,
  getMyReferralCode,
  getReferralStats,
  requestPayout,
  validateReferralCode,
  getAllReferralCodes,
  processPayoutRequest,
} = require('../controllers/referralController');
const { protect, admin } = require('../middleware/authMiddleware');
const { hostAccess } = require('../middleware/hostMiddleware');

// Host referral routes
router.route('/generate')
  .post(protect, hostAccess, createReferralCode);

router.route('/mycode')
  .get(protect, hostAccess, getMyReferralCode);

router.route('/stats')
  .get(protect, hostAccess, getReferralStats);

router.route('/payout-request')
  .post(protect, hostAccess, requestPayout);

router.route('/validate')
  .post(validateReferralCode);

// Admin routes
router.route('/admin/referrals')
  .get(protect, admin, getAllReferralCodes);

router.route('/admin/process-payout/:id')
  .put(protect, admin, processPayoutRequest);

module.exports = router;