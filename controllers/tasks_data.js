const Tasks = require("../models/Tasks");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");

const getAllTasks = async(req, res) => {
    const tasks = await Tasks.find({createdBy: req.user.userId});
    res.status(StatusCodes.OK).json({tasks})
}

const postTasks = async(req, res) => {
    req.body.createdBy = req.user.userId;
    req.body.createdOn = new Date(Date.now());
    const tasks = await Tasks.create(req.body);
    res.status(StatusCodes.OK).json({tasks});
}

const updateTasks = async(req, res) => {
    console.log("update task")
    const {user:{userId},
          params: {id:tasksId},
          body: {tasks, scheduledTasks}} = req;

    const task = await Tasks.findByIdAndUpdate({_id: tasksId, createdBy: userId}, req.body, {new:true, runValidators: false});
    res.status(StatusCodes.OK).json({task});
}

const deleteTasks = async(req, res) => {
    const {user: {userId}, params: {taskId}} = req;
    const task = await Tasks.findOneAndRemove({
        _id: taskId,
        createdBy: userId
    })

    if(!task) {
        throw new NotFoundError(`Cannot find task with ID ${taskId}`)
    }
    res.status(StatusCodes.OK).json({task});
}


module.exports = {
    getAllTasks,
    postTasks,
    updateTasks,
    deleteTasks
}