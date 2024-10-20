const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/AuthMiddleware");

const { userRegisterValidationRules, userIdValidationRules, userLoginValidationRules, userUpdateValidationRules } = require("../validations/UserValidation");
const UserController = require("../controllers/UserController");

router.post("/register", userRegisterValidationRules(), UserController.register);
router.post("/login", userLoginValidationRules(), UserController.login);

router.all("/logout", (req, res) => {
    res.clearCookie('token');
    res.status(200).send();
});

// router.use(authMiddleware(0));

router.get("/", authMiddleware(0), userIdValidationRules(), UserController.get);
router.post("/update", authMiddleware(0), userUpdateValidationRules(), UserController.update);

module.exports = router;