const express = require('express');
const { errors } = require('celebrate');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(require('./routes'));
app.use(errors());

module.exports = app;