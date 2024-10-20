const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/AuthMiddleware");

const EventController = require("../controllers/EventController");
const { eventIdValidationRules, eventUpdateValidationRules, eventCreateValidationRules } = require("../validations/EventValidation");
const { userIdValidationRules } = require("../validations/UserValidation");


router.get("/all", authMiddleware(0), userIdValidationRules(), EventController.getAll);

router.get("/:eventId", authMiddleware(0), eventIdValidationRules(), EventController.get);

router.post("/:eventId/update", authMiddleware(1), eventUpdateValidationRules(), EventController.update);

router.post("/create", authMiddleware(1), eventCreateValidationRules(), EventController.create);

module.exports = router;