const mongoose = require('mongoose');
require('dotenv').config();



async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.DB_LIVE_URL);
        console.log('Connected to the database....');
    } catch (error) {
        console.error('Error connecting to the database:', error.message);
    }
}

module.exports = connectToDatabase;
