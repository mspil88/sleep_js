const mongoose = require("mongoose");

const MoodSchema = new mongoose.Schema({
    depression: {
        type: Number,
        required: [true]
    },
    anxiety: {
        type: Number,
        required: [true]
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true]
    }
}, {timestamps: true}) 

module.exports = mongoose.model("mood", MoodSchema);
