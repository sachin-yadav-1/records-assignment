const express = require('express');
const RecordController = require('./../controllers/recordsController');

const router = express.Router();

router
  .route('/')
  .post(RecordController.createRecords)
  .get(RecordController.getAllRecords);

router.route('/managed-records').get(RecordController.getManagedRecords)

module.exports = router;
