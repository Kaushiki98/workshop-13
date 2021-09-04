var express = require('express');
var router = express.Router();
const user = require('../controller/controller')

router.post("/userRegistration", user.createUser);

router.post("/userLogin", user.loginUser);

module.exports = router ;