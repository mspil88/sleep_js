const Mood = require("../models/Mood");
const {StatusCodes} = require("http-status-codes");
const {BadRequestError, NotFoundError} = require("../errors");

const getAllMoods = async(req, res) => {
    console.log("get moods");

}

const getMood = async(req, res) => {
    console.log("get mood");
}

const postMood = async(req, res) => {
    console.log("update mood")
}

const updateMood = async(req, res) => {
    console.log("update mood")
}

const deleteMood = async(req, res) => {
    console.log("delete mood")
}

module.exports = {
    getAllMoods,
    getMood,
    postMood,
    updateMood,
    deleteMood
}