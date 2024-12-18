const mongoose = require("mongoose"); 

const Song = new mongoose.Schema({ 

    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,  
        required: true,
    },
    track: {
        type: String, 
        required: true,
    },
    artist: {
        type: mongoose.Types.ObjectId,   
        ref: "User",  
    }, 
}) 


const SongModel = new mongoose.model("Song", Song); // create a song model named 'Song' with 'Song' schema

module.exports = SongModel;


