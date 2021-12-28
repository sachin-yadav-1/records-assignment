const express = require('express');
const recordRouter = require('./routes/recordsRoutes');

const app = express();
app.use(express.json());

app.use('/records', recordRouter);
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `Invalid route - ${req.originalUrl}`,
  });
});

module.exports = app;
