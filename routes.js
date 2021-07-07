const router = require('express').Router();
const userAuth = require("./Controllers/UserAuth");

router.post('/checkemail', userAuth.checkEmail);
router.post('/register', userAuth.sigunUpUsers);
router.post('login', userAuth.loginUser);

module.exports = router;