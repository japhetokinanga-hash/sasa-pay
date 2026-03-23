const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv').config();

const ussdRoutes = require('./routes/ussd');
const mpesaRoutes = require('./routes/mpesa');
const adminRoutes = require('./routes/admin');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/ussd', ussdRoutes);
app.use('/mpesa', mpesaRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'Sasa Pay server running', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Sasa Pay server running on port ${PORT}`);
});

module.exports = app;
