const bcrypt = require("bcryptjs/dist/bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true,, 'Please provide name'],
        minLength: 3,
        maxLength: 20,
    },
    email: {
        type:String,
        required:[true,, 'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide valid email'
        ],
        unique: true
    },
    password: {
        type:String,
        required:[true,, 'Please provide password'],
        minLength: 3,
        
    },
    
})

UserSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model("User", UserSchema);