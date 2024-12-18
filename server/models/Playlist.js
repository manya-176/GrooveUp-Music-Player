const mongoose = require("mongoose"); 

const Playlist = new mongoose.Schema({ 

    name: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    owner:{
        type: mongoose.Types.ObjectId,
        ref:"User",
    },
    songs: [  
        {
            type: mongoose.Types.ObjectId,  //imp: here again each song will have property of song model, so why to create it again, lets use its id 
            ref: "Song", 
        }
    ],
    collaborators: [ // array of collaborators i.e users
        {
            type: mongoose.Types.ObjectId,
            ref: "User", 
        }
    ]

}) 

const PlaylistModel = new mongoose.model("Playlist", Playlist); // create a Playlist model named 'Playlist' with 'Playlist' schema

module.exports = PlaylistModel;


