const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema(
  {
    id: Number,
    color: String,
    disposition: { type: String, enum: ['open', 'closed'] },
  },
  { timestamps: true }
);

const RecordModel = mongoose.model('Record', RecordSchema);
module.exports = RecordModel;
