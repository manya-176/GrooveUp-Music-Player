
// this file will have all the methods that we will use again and again, so we are defining all of them here for anywhere use

const jwt = require("jsonwebtoken");  // install `npm i jsonwebtoken`

require('dotenv').config(); // include .env into project TO access environment variable

exports.getToken = async (email, user) => {
    const token = jwt.sign({identifier: user._id}, process.env.PASSPORT_JWT_SECRETKEY );
    return token;
};

module.exports = exports;


