const express = require("express")
const router = express.Router();

const {getAllSleep, getSleep, createSleep, updateSleep, deleteSleep} = require("../controllers/sleep_data");

router.route("/").post(createSleep).get(getAllSleep);
router.route("/:id").get(getSleep).delete(deleteSleep).patch(updateSleep);

module.exports = router;