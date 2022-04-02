const express = require("express");
const router = express.Router();

const {getAllMoods, getMood, postMood, updateMood, deleteMood} = require("../controllers/mood_data");

router.route("/").post(postMood).get(getAllMoods);
router.route("/:id").get(getMood).delete(deleteMood).patch(updateMood);

module.exports = router;