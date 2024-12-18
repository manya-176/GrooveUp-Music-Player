
// /* 3 steps to make a model
//         1. require moongose
//         2. create a moongose schema (structure of a user)
//         3. create a model

//     there are lots of  functions in 'moongose' package
//         - moongose.Schema() 
//         - moongose
// */

// // step1 
// const mongoose = require("mongoose");

// // step 2 
// const User = new mongoose.Schema({

//     firstName: {
//         type: String,
//         required: true,
//     },
//     lastName: {
//         type: String,
//         required: false, // my default is false
//     },
//     email :{
//         type: String,
//         required: true,
//     },
//     username: {
//         type: String,
//         required: true,
//     },
//     likedSongs: {
//         type: String, // will make it array later - coz lot of songs can be there d
//         default: "", // by default value of liked songs will be ""
//     },
//     likedPlaylist: {
//         type: String,
//         default: "", 
//     },
//     subscribedArtists: {
//         type: String,
//         default: "",
//     },
//     password: {  // just added
//         type: String,
//         required: true,
//         private: true
//     },
// })

// //step3
// const UserModel = mongoose.model("User", User); // create user from already defined 'userSchema'

// module.exports = UserModel; // with this step we can import this file anywhere to access 'UserModel'




//code
const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: true,
        unique: true, // To ensure no two users have the same email
    },
    username: {
        type: String,
        required: true,
    },
    likedSongs: {
        type: [String], // Change this to an array of strings to store multiple liked songs
        default: [],
    },
    likedPlaylist: {
        type: [String], 
        default: [],
    },
    subscribedArtists: {
        type: [String], 
        default: [],
    },
    password: {
        type: String,
        required: true,
    },
    twoFactorSecret: {
        type: String, // Store the 2FA secret (base32 format)
        required: null, 
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
});

// Create the model from the schema
const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;
