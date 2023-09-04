const mongoose = require("mongoose")

const Donate = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    mobilenumber:{
        type:Number,
        required:true,
    },
    address:{
        type:String,
        required:true,
    },
    bloodtype:{
        type:String,
        required:true,
    },
})
const User = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
})
// module.exports = mongoose.model('User',User)
// module.exports = mongoose.model('Donate',Donate)
module.exports = {
    User: mongoose.model('User', User),
    Donate: mongoose.model('Donate', Donate)
};
