const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express ()
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const userRouter = require('./controllers/user')

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/test-jwt', testJWTRouter);
app.use('/user', userRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});