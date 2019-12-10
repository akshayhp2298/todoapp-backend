const express = require('express');
const app = express();
const route = require('./Routes')
app.use(route);
app.listen(3000);