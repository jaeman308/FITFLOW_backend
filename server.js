const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express ()
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const userRouter = require('./controllers/user');
const calorieTrackerRouter = require('./controllers/calorietracker');
const goalLogRouter = require('./controllers/goallog');
const habitTrackerRouter = require ('./controllers/habittracker');
const PostRouter = require('./controllers/post');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/test-jwt', testJWTRouter);
app.use('/user', userRouter);
app.use('/calorieTracker', calorieTrackerRouter);
app.use('/goalLog', goalLogRouter);
app.use('/habitTracker', habitTrackerRouter);
app.use('/post', PostRouter);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});