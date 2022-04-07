const mongoose = require("mongoose");

const SleepSchema = new mongoose.Schema({
    bedTime: {
        type:String,
        required:[true, 'Please provide bed time'],
        maxLength: 7
    },
    timeToFallAsleep: {
        type:String,
        required:[true],
        maxLength: 30
    },
    numberTimesAwake: {
        type:String,
        required:[true],
        maxLength: 30
    },
    amountTimeAwake: {
        type:String,
        required:[true],
        maxLength: 30
    },
    timeGotOutBed: {
        type:String,
        required:[true],
        maxLength: 7
    },
    timeToGetOutBed: {
        type:String,
        required:[true],
        maxLength: 30
    },
    qualityOfSleep: {
        type:String,
        required:[true],
        maxLength: 8
    },
    nextDayFeeling: {
        type:String,
        required:[true],
        maxLength: 30
    },
    hoursSpentInBed: {
        type:mongoose.Types.Decimal128,
        required:[true],
    },
    hoursSpentAsleep: {
        type:mongoose.Types.Decimal128,
        required:[true],
    },
    sleepEfficiencyScore: {
        type:mongoose.Types.Decimal128,
        required:[true],
    },
    createdBy: {
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true]
    },
    diaryDate: {
        type:String,
        required:[true]
    }
}, {timestamps: true})

module.exports = mongoose.model("Sleep", SleepSchema);