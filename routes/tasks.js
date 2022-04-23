const express = require("express");
const router = express.Router();

const {getAllTasks, postTasks, updateTasks, deleteTasks} = require("../controllers/tasks_data");

router.route("/").post(postTasks).get(getAllTasks);
router.route("/:id").delete(deleteTasks).patch(updateTasks);

module.exports = router;