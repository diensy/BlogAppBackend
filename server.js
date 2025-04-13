const express = require('express');
const connectToDatabase = require('./config/db');
const userRouter = require('./routes/userRoute');
const blogRoute = require('./routes/blogRoute');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors()); 

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Welcome to DB...');
});

app.use('/', blogRoute);
app.use('/', userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server running at port ${process.env.PORT}`);
    connectToDatabase();
});
