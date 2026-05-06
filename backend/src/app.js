const express = require('express');
const cookieParser = require('cookie-parser');
const authroutes = require('./routes/auth.routes')

const app = express();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/api/auth',authRoutes);

module.exports = app;