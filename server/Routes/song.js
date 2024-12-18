// // here all the song related routes API will be stored 

// const express = require("express");
// const router = express.Router();
// const passport = require("passport");
// const Song = require("../models/Song");
// const User = require("../models/User");

// // /song/create
// router.post("/create", passport.authenticate("jwt", {session: false}) , async (req,res) => {   // post(route, middleware fun, callback func), note we have set the session:false because we want that every time user creates a new song, it has to be authorized using its token every time

//     // step1 : to create a song we need the name(title), thumbnail, track, artist 
//     const {name, thumbnail, track} = req.body;
//     if(!name || !thumbnail || !track){ // if any field is not complete do not create song
//         return res.status(301).json({err: "Insufficient song data"});
//     }

//     const artist = req.user._id;  // this way the id generated while creating the user will fetch the artist
//     const songDetails = {name, thumbnail, track, artist};
    
//     // reached here means everything is fine, so create a song based on 'Song' schema model
//     const createdSong = await Song.create(songDetails);
//     return res.status(200).json(createdSong);

// });

// //    /song/get/mysongs
// router.get("/get/mysongs", passport.authenticate("jwt" ,{session: false}), async (req,res) => {// post(route, middleware fun, callback func), note we have set the session:false because we want that every time user creates a new song, it has to be authorized using its token every time

//     // step1 : reached here means user is authenticated, so we need to now get all the songs whos artist=user._id
//      // .findOne() only finds single thing,   .find() will help find all the songs that matched the condition of {artist: req.user._id}
//      // .populate("artist") -> now whever we get songs with artist:req.user.id then return it, but in the artist key of that song, do not return only artist id, but return while artists object
//     const songs = await Song.find({artist: req.user._id}).populate("artist"); 
//     return res.status(200).json({data: songs});

// })


// //    /song/get/artist    - get route to get all the songs published by a certian artist 
// router.get("/get/artist/:artistId", passport.authenticate("jwt", {session: false}), async (req,res) => {

//     // step1: get the artist's id from req.body  
//     const {artistId} = req.params;  // note that we should not take input from req.body in .get() method, so we will fixed it now using req.params
    
//     // fetch the artist(user) whose id is artist id
//     const artist = await User.findOne({_id: artistId}); 
//     if(!artist){ // if such artist doesn't exists 
//         return res.status(301).json({err: "Artist doesn't exists"});
//     }

//     // step2 : fetch all the songs whole artist: artistId
//     const songs = await Song.find({artist: artistId});    // .find() is used to get all the values   .findOne() is used to get only a single value
//     return res.status(200).json({data: songs});     

// })

// //     /song/get/songname/baarish-song      - get route to get all the songs with exact title - eg. 'baarish'
// router.get("/get/songname/:songName", passport.authenticate("jwt", {session: false}), async (req, res) => {
    
//     // step1 : get the song name from user 
//     const {songName} = req.params;

//     // step2 : fetch all the songs with name: songName and return them
//     // here we can add the 'pattern matching' functionality later maybe using regx, such that when a user searched 'baar' the 'baarish' song appears 
//     const songs = await Song.find({name: songName}).populate("artist"); // populate(artist) means wheverever we find songs with desired songname, then in the artist key of that obj, return the complete obj of artist, so that we can use it at the time of ui to display song card 
//     return res.status(200).json({data: songs});
// })




// // get all songs from entire database 
// // /song/get/all
// router.get('/get/all', passport.authenticate('jwt', {session: false}), async (req,res) => {
//     const songs = await Song.find().populate("artist");
//     return res.status(200).json({data: songs});
// })


// module.exports = router;



const express = require("express");
const router = express.Router();
const passport = require("passport");
const Song = require("../models/Song");
const User = require("../models/User");

// /song/create - Create a song
router.post("/create", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { name, thumbnail, track, genre } = req.body;

    if (!name || !thumbnail || !track) {
        return res.status(400).json({ err: "Insufficient song data" });
    }

    const artist = req.user._id;  // Fetch the user (artist) ID
    const songDetails = { name, thumbnail, track, genre, artist };

    try {
        const createdSong = await Song.create(songDetails);
        return res.status(200).json(createdSong);
    } catch (err) {
        return res.status(500).json({ err: "Failed to create song" });
    }
});

// /song/get/mysongs - Get songs of the current user (artist)
router.get("/get/mysongs", passport.authenticate("jwt", { session: false }), async (req, res) => {
    try {
        const songs = await Song.find({ artist: req.user._id }).populate("artist");
        return res.status(200).json({ data: songs });
    } catch (err) {
        return res.status(500).json({ err: "Failed to fetch songs" });
    }
});

// /song/get/artist/:artistId - Get all songs by a specific artist
router.get("/get/artist/:artistId", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { artistId } = req.params;
    try {
        const artist = await User.findOne({ _id: artistId });

        if (!artist) {
            return res.status(404).json({ err: "Artist doesn't exist" });
        }

        const songs = await Song.find({ artist: artistId });
        return res.status(200).json({ data: songs });
    } catch (err) {
        return res.status(500).json({ err: "Failed to fetch songs" });
    }
});

// /song/get/songname/:songName - Case-insensitive search by song name, genre, and artist
router.get("/get/songname/:songName", passport.authenticate("jwt", { session: false }), async (req, res) => {
    const { songName } = req.params;

    const regex = new RegExp(songName, 'i');  // 'i' for case-insensitive matching

    try {
        const songs = await Song.find({
            $or: [
                { name: { $regex: regex } },           // Match song name
                { genre: { $regex: regex } },         
                { "artist.firstName": { $regex: regex } }, 
                { "artist.lastName": { $regex: regex } }    
            ]
        }).populate("artist");  // Populate artist data in the result

        if (songs.length === 0) {
            return res.status(404).json({ err: "No songs found matching the search criteria." });
        }

        return res.status(200).json({ data: songs });
    } catch (err) {
        return res.status(500).json({ err: "An error occurred while searching for songs." });
    }
});

// /song/get/all - Get all songs from the database
router.get('/get/all', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const songs = await Song.find().populate("artist");
        return res.status(200).json({ data: songs });
    } catch (err) {
        return res.status(500).json({ err: "Failed to fetch all songs" });
    }
});

module.exports = router;
