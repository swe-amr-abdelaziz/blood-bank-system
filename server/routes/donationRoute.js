const express = require('express');
const donationController = require('../controllers/donationController');
const authorizationMW = require('../core/middlewares/authorizationMW');
const donationValidator = require('../core/validators/donationValidator');

const router = express.Router();

router
  .route('/pending')
  .get(
    authorizationMW.employee,
    donationController.getAllPendingDonations,
  );

router
  .route('/accept/:id')
  .patch(
    authorizationMW.employee,
    donationValidator.validateIdParam,
    donationValidator.validateAcceptDonation,
    donationController.acceptDonation,
  );

router
  .route('/reject/:id')
  .patch(
    authorizationMW.employee,
    donationValidator.validateIdParam,
    donationValidator.validateRejectDonation,
    donationController.rejectDonation,
  );

module.exports = router;
