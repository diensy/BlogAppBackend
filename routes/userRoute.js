const express = require('express');
const router = express.Router();
const userController = require('../controller/userController')

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/get-all-users', userController.getAllUsers);
router.get('/get-user-by-id/:userId', userController.getUserById);
router.patch('/update-user-by-id/:userId', userController.updateUserById);


module.exports = router;