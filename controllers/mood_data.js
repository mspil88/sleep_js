const Mood = require("../models/Mood");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");


const getAllMoods = async(req, res) => {
    const mood = await Mood.find({createdBy: req.user.userId}).sort("createdOn");
    res.status(StatusCodes.OK).json({mood, count: mood.length});
    
}

const getMood = async(req, res) => {
    console.log("get mood");
    const {user:{userId}, params:{id:moodId}} = req;
    const mood = await Mood.findOne({_id: moodId, createdBy: userId});
    
    if(!mood) {
        throw new NotFoundError(`No mood with id ${moodId}`)
    }
    res.status(StatusCodes.OK).json({mood});
}

const postMood = async(req, res) => {
    console.log("update mood");
    req.body.createdBy = req.user.userId;
    req.body.createdOn = new Date(Date.now());
    const mood = await Mood.create(req.body)
    res.status(StatusCodes.OK).json({mood});
}

const updateMood = async(req, res) => {
    console.log("update mood")
    const {user:{userId},
          params: {id:moodId},
          body: {depression, anxiety}} = req;

    if(!depression || !anxiety) {
        throw new BadRequestError("insufficient parameters passed")
    }
    const mood = await Mood.findByIdAndUpdate({_id: moodId, createdBy: userId}, req.body, {new:true, runValidators: true})
    res.status(StatusCodes.OK).json({mood});
}


const deleteMood = async(req, res) => {
    const {user: {userId}, params: {id: moodId}} = req;
    const mood = await Mood.findOneAndRemove({
        _id: moodId,
        createdBy: userId
    })

    if(!mood) {
        throw new NotFoundError(`Haven not found mood with id ${moodId}`)
    }

    res.status(StatusCodes.OK).json({mood});
}

module.exports = {
    getAllMoods,
    getMood,
    postMood,
    updateMood,
    deleteMood
}