const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    tasks: {
        type:String,  
    },
    scheduledTasks: {
        type:String
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true]
    }
}, {timestamps: true})

module.exports = mongoose.model("Tasks", TaskSchema);