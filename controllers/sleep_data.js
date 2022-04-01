const Sleep = require("../models/Sleep");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");

const getAllSleep = async(req, res) => {
    const sleep = await Sleep.find({createdBy: req.user.userId}).sort("createdOn");
    res.status(StatusCodes.OK).json({sleep, count: sleep.length});

}

const getSleep = async(req, res) => {
    const {user:{userId}, params:{id:sleepId}} = req;
    const sleep = await Sleep.findOne({
        _id: sleepId, createdBy: userId
    })
    if(!sleep) {
        throw new NotFoundError(`Have no found ${sleepId}`);
    }
    res.status(StatusCodes.OK).json({sleep});
}

const createSleep = async(req, res) => {
    req.body.createdBy = req.user.userId;
    req.body.createdOn = new Date(Date.now());
    const sleep = await Sleep.create(req.body);
    res.status(400).json({sleep});
}

const updateSleep = async(req, res) => {
    console.log("update sleep");
    const {
        body: {bedTime, timeToFallAsleep, numberTimesAwake, amountTimeAwake, timeGotOutBed, timeToGetOutBed, qualityOfSleep, nextDayFeeling, hoursSpentInBed, hoursSpentAsleep, sleepEfficiencyScore},
        user:{userId}, 
        params:{id:sleepId}} = req;

    if(bedTime === "" || timeToFallAsleep === ""|| numberTimesAwake === ""|| amountTimeAwake === ""|| timeGotOutBed === ""|| timeToGetOutBed === ""|| qualityOfSleep === ""||
        nextDayFeeling === ""|| hoursSpentInBed === ""||hoursSpentAsleep === ""||sleepEfficiencyScore === "") {
            throw new BadRequestError("Insufficient parameters passed")
        }
    const sleep = await Sleep.findByIdAndUpdate({_id: sleepId, createdBy: userId}, req.body, {new:true, runValidators: true})
    console.log(sleep);
    if(!sleep) {
        throw new NotFoundError(`Have no found ${sleepId}`);
    }

    res.status(StatusCodes.OK).json({sleep});
    }

const deleteSleep = async(req, res) => {
    console.log("delete sleep");
    const {user:{userId}, params:{id:sleepId}} = req;

    const sleep = await Sleep.findOneAndRemove({
        _id: sleepId,
        createdBy: userId
    })
    if(!sleep) {
        throw new NotFoundError(`Have no found ${sleepId}`);
    }
    res.status(StatusCodes.OK).send();
}


module.exports = {
    getAllSleep,
    getSleep,
    createSleep,
    updateSleep,
    deleteSleep
}

