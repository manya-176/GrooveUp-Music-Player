const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/User");
const Playlist = require("../models/Playlist");
const Song = require("../models/Song");
  
router.post("/create", passport.authenticate("jwt", {session: false}), async (req, res) => {

    const currUser = req.user; 
    const {name, thumbnail, songs} = req.body;

    if(!name || !thumbnail || !songs ){
        return res.status(301).json({err: "insufficient data to create a playlist"});
    }

    // step2 : combine all the playlist data and create a playlist with all that
    const playlistData = {name, thumbnail, owner:currUser._id, songs, collaborators:[]}; 
    
    const playlist = await Playlist.create(playlistData);  // error

    // console.log("reached line 27");

    return res.status(200).json(playlist);
     
});


router.get("/get/playlist/:playlistId", passport.authenticate("jwt", {session: false}), async (req,res) => {

    // step1 : we discussed earlier then we should not take any thing from req.body in a .get() API coz it is not a good practice, thats why we used the `:` symbol using which we can fetch the playlist id from the route itself (given by user)
    const playlistId = req.params.playlistId; // fetched data from the route (without using req.body)

    // step2 : search for this playlist with given playlist id, if we found a playlist then inside that playlist's obj songs key send the complete song object for each song, and inside the each song obj send the complete json of artist as well
    // so we are here applying populate artist inside populate songs of playlist
    const playlist = await Playlist.findOne({_id: playlistId}).populate({
        path:"songs", // inside songs array for each song return complete obj of each one song
        populate:{
            path:"artist" // inside each song return complete artist obj of each song 
        }
    });

    if(!playlist){ // no such playlist exists 
        return res.status(301).json({err: "invalid playlist id"})
    }

    return res.status(200).json(playlist);
      
}) 

//  /playlist/get/me   get route to get all the playlist created current logged in user  (get all my Playlist )
router.get("/get/me", passport.authenticate("jwt", {session: false}), async (req,res) =>{

    // since we have used passport.authenticate so we will reach here ones the jwt has verified the token of current user
    // step 1 : get the current logged in users id 
    const artistId = req.user._id;

    // step2 : so fetch all its playlists of artist (on basis of 'artistId') 
    //playlist can be more then 1, note that in the Playlist model we have owner type: mongoose.Types.ObjectId, 
    const playlists = await Playlist.find({owner: artistId}).populate("owner"); // .populate("owner") means whenever we find playlists with given owner then make sure to return that owners complete json object
    
    // return the fetched playlist 
    return res.status(200).json({data: playlists});

}) 


//  /playlist/get/artist/:artistId   get route to get all the playlist created by an artist (artist id)
router.get("/get/artist/:artistId", passport.authenticate("jwt", {session: false}), async (req,res) =>{

    // step 1 : get the artist id (not from req.body) but  from route parameters
    const artistId = req.params.artistId;
    
    // step2 : check if such artist exists or not
    // if(undefined) is false
    // if(null) is false
    // if(empty array) is true   i.e if([]) is true
    const artist = await User.findOne({_id: artistId});  // note : _id is a unique id assigned by mongoDb to any schema object
    if(!artist){
        return res.status(304).json({err: "invalid artist id"});// no such artist exists
    }

    // step3 : reached here means artist exists, so fetch all its playlists 
    const playlists = await Playlist.find({owner: artistId}); //playlist can be more then 1, note that in the Playlist model we have owner type: mongoose.Types.ObjectId, 
    return res.status(200).json({data: playlists});

}) 


//   /playlist/add/song   - API to add song to a playlist via a user
router.post("/add/song", passport.authenticate("jwt", {session: false}), async (req,res) => {

    // step1 : fetch the song id and playlist id 
    const currentUser = req.user;
    const {songId, playlistId} = req.body;

    // step 2 : check if such playlist and song both are valid or not 
    const playlist = await Playlist.findOne({_id: playlistId});
    const song = await Song.findOne({_id: songId}); // since all songs get unique song id, so use findOne() it returns null if not found, on the other hand .find() returns empty array when something is not found and if([]) is true, and if(null) is false 
    
    if(!playlist){
        return res.status(404).json({err: "playlist doesnt exist"});
    }
    if(!song){
        return res.status(404).json({err: "song doesnt exists"});
    }

    // reached here means playlist and song both exists, lets now check if user has access to this playlist or not
    // step1 : to add a song we need to check if the user adding a song has access to add it or not ? (to add a song to playlist user must be a 'collaborator' or 'owner of the playlist') 
    // if(playlist.owner != currentUser._id && !playlist.collaborators.includes(currentUser._id)){ // if curr user is neighter the owner nor the collaborator of this playlist   // ERROR ⚠️
    if(!playlist.owner.equals(currentUser._id) && !playlist.collaborators.includes(currentUser._id)){ // if curr user is neighter the owner nor the collaborator of this playlist 
        // will fix this soon in next vid
        // console.log("playlist owner : ", playlist.owner);
        // console.log("current user : ", currentUser._id);
        // console.log("is user the playlist owner ? ", playlist.owner.equals(currentUser._id));
        // console.log("is currUser a collaborator ? ", playlist.collaborators.includes(currentUser._id));
        return res.status(400).json({err: "not allowed"});
    }

    // reached here means user has access to add songs in playlist, so add the song in to playlist
    playlist.songs.push(songId);  // inside the songs array of playlist, each song is stored by its mongoseid
    await playlist.save(); // saving changes to the db

    return res.status(200).json(playlist);
})

module.exports = router;