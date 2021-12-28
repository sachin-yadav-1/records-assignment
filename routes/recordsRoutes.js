const express = require('express');
const RecordController = require('./../controllers/recordsController');

const router = express.Router();

router
  .route('/')
  .post(RecordController.createEntries)
  .get(RecordController.getAllEntries);

router.route('/managed-entries').get(RecordController.getManagedRecords)

module.exports = router;
