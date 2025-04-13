const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: String,
        required: true
    }
},
    {
        versionKey: false,
        timestamps: true
    }
);



module.exports = mongoose.model('User', userSchema);