// // //chatgpt code
// // const express = require("express");
// // const router = express.Router();
// // const User = require("../models/User");
// // const bcrypt = require("bcryptjs");
// // const { getToken } = require("../utils/helpers");
// // const speakeasy = require("speakeasy");
// // const nodemailer = require("nodemailer");

// // // Email setup for sending 2FA codes
// // const transporter = nodemailer.createTransport({
// //     service: 'gmail',
// //     auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //     },
// // });

// // // Helper function to send email
// // const sendEmail = (email, subject, text) => {
// //     return transporter.sendMail({
// //         from: process.env.EMAIL_USER,
// //         to: email,
// //         subject: subject,
// //         text: text,
// //     });
// // };

// // // /auth/register route (modified for 2FA)
// // // /auth/register route (modified for 2FA)
// // router.post("/register", async (req, res) => {
// //     const { email, password, firstName, lastName, username } = req.body;

// //     const user = await User.findOne({ email });

// //     if (user) {
// //         return res.status(403).json({ err: "A user with this email already exists." });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const newUserData = { email, password: hashedPassword, firstName, lastName, username };

// //     const newUser = await User.create(newUserData);

// //     // Generate 2FA secret for the user
// //     const secret = speakeasy.generateSecret({ length: 20 });

// //     // Store the 2FA secret in the user model
// //     newUser.twoFactorSecret = secret.base32;
// //     newUser.twoFactorEnabled = true; // Enable 2FA for this user
// //     await newUser.save();

// //     // Generate the 2FA code (TOTP)
// //     const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

// //     // Send the 2FA code via email to the user
// //     await sendEmail(newUser.email, 'Your 2FA Code', `Your 2FA code is: ${token}`);

// //     // Generate JWT Token for the user
// //     const jwtToken = await getToken(email, newUser);
// //     const userToReturn = { ...newUser.toJSON(), token: jwtToken };

// //     return res.status(200).json(userToReturn);
// // });



// // // /auth/login route (modified for 2FA)
// // // /auth/login route (modified for 2FA)
// // router.post("/login", async (req, res) => {
// //     const { email, password, twoFactorCode } = req.body;

// //     const user = await User.findOne({ email });

// //     if (!user) {
// //         return res.status(403).json({ err: "Invalid Credentials" });
// //     }

// //     const isPasswordValid = await bcrypt.compare(password, user.password);

// //     if (!isPasswordValid) {
// //         return res.status(403).json({ err: "Invalid Credentials" });
// //     }

// //     // Check if 2FA is enabled
// //     if (user.twoFactorEnabled) {
// //         // Verify the 2FA code
// //         const verified = speakeasy.totp.verify({
// //             secret: user.twoFactorSecret,
// //             encoding: 'base32',
// //             token: twoFactorCode,
// //         });

// //         if (!verified) {
// //             return res.status(403).json({ err: "Invalid 2FA code" });
// //         }
// //     }

// //     // Generate JWT Token
// //     const token = await getToken(user.email, user);
// //     const userToReturn = { ...user.toJSON(), token };

// //     return res.status(202).json(userToReturn);
// // });



// // module.exports = router;


// //gpt
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const { getToken } = require("../utils/helpers");
// const speakeasy = require("speakeasy");
// const nodemailer = require("nodemailer");
// const verifyToken = require("../middleware/auth"); // Import the JWT verification middleware

// const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
// const verifyToken = (req, res, next) => {
//     const token = req.header('Authorization') && req.header('Authorization').split(' ')[1]; // Get the token from the Authorization header

//     if (!token) {
//         return res.status(401).json({ err: 'Access denied, no token provided' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token using the secret key
//         req.user = decoded; // Attach the decoded user data to the request object
//         next(); // Continue to the next middleware or route handler
//     } catch (error) {
//         return res.status(400).json({ err: 'Invalid token' });
//     }
// };

// module.exports = verifyToken;

// // Email setup for sending 2FA codes
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//     },
// });

// // Helper function to send email
// const sendEmail = (email, subject, text) => {
//     return transporter.sendMail({
//         from: process.env.EMAIL_USER,
//         to: email,
//         subject: subject,
//         text: text,
//     });
// };

// // /auth/register route (modified for 2FA)
// router.post("/register", async (req, res) => {
//     const { email, password, firstName, lastName, username } = req.body;

//     const user = await User.findOne({ email });

//     if (user) {
//         return res.status(403).json({ err: "A user with this email already exists." });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUserData = { email, password: hashedPassword, firstName, lastName, username };

//     const newUser = await User.create(newUserData);

//     // Generate 2FA secret for the user
//     const secret = speakeasy.generateSecret({ length: 20 });

//     // Store the 2FA secret in the user model
//     newUser.twoFactorSecret = secret.base32;
//     newUser.twoFactorEnabled = true; // Enable 2FA for this user
//     await newUser.save();

//     // Generate the 2FA code (TOTP)
//     const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

//     // Send the 2FA code via email to the user
//     await sendEmail(newUser.email, 'Your 2FA Code', Your 2FA code is: ${token});

//     // Generate JWT Token for the user
//     const jwtToken = await getToken(email, newUser);
//     const userToReturn = { ...newUser.toJSON(), token: jwtToken };

//     return res.status(200).json(userToReturn);
// });

// // /auth/login route (modified for 2FA)
// router.post("/login", async (req, res) => {
//     const { email, password, twoFactorCode } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//         return res.status(403).json({ err: "Invalid Credentials" });
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);

//     if (!isPasswordValid) {
//         return res.status(403).json({ err: "Invalid Credentials" });
//     }

//     // Check if 2FA is enabled
//     if (user.twoFactorEnabled) {
//         // Verify the 2FA code
//         const verified = speakeasy.totp.verify({
//             secret: user.twoFactorSecret,
//             encoding: 'base32',
//             token: twoFactorCode,
//         });

//         if (!verified) {
//             return res.status(403).json({ err: "Invalid 2FA code" });
//         }
//     }

//     // Generate JWT Token
//     const token = await getToken(user.email, user);
//     const userToReturn = { ...user.toJSON(), token };

//     return res.status(202).json(userToReturn);
// });

// router.get("/home", verifyToken, (req, res) => {
//     res.status(200).json({ message: "Welcome to the Home Page!" });
// });

// // Example of a protected route
// router.get("/profile", verifyToken, async (req, res) => {
//     try {
//         // Here, you can access the authenticated user's data via req.user (from the JWT)
//         const user = await User.findOne({ email: req.user.email });
//         if (!user) {
//             return res.status(404).json({ err: "User not found" });
//         }

//         // Return user profile details
//         return res.status(200).json({ firstName: user.firstName, lastName: user.lastName, username: user.username });
//     } catch (error) {
//         return res.status(500).json({ err: "Server error" });
//     }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { getToken } = require("../utils/helpers");
const speakeasy = require("speakeasy");
const nodemailer = require("nodemailer");
const verifyToken = require("../middleware/auth"); // Import the JWT verification middleware

// Email setup for sending 2FA codes
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Helper function to send email
const sendEmail = (email, subject, text) => {
    return transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        text: text,
    });
};

// /auth/register route (modified for 2FA)
router.post("/register", async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body;

    const user = await User.findOne({ email });

    if (user) {
        return res.status(403).json({ err: "A user with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user data
    const newUserData = { email, password: hashedPassword, firstName, lastName, username };
    const newUser = await User.create(newUserData);

    // Generate a 2FA secret for the user
    const secret = speakeasy.generateSecret({ length: 20 });

    // Store the 2FA secret in the user model
    newUser.twoFactorSecret = secret.base32;
    newUser.twoFactorEnabled = true; // Enable 2FA for this user
    await newUser.save();

    // Generate the 2FA code (TOTP)
    const token = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

    // Send the 2FA code via email to the user
    await sendEmail(newUser.email, 'Your 2FA Code', `Your 2FA code is: ${token}`);

    // Generate JWT Token for the user
    const jwtToken = await getToken(email, newUser);
    const userToReturn = { ...newUser.toJSON(), token: jwtToken };

    return res.status(200).json(userToReturn);
});


router.post("/login", async (req, res) => {
    const { email, password, twoFactorCode } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(403).json({ err: "Invalid Credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        return res.status(403).json({ err: "Invalid Credentials" });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
        // Verify the 2FA code
        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret,
            encoding: 'base32',
            token: twoFactorCode,
        });

        if (!verified) {
            return res.status(403).json({ err: "Invalid 2FA code" });
        }
    }

    // Generate JWT Token
    const token = await getToken(user.email, user);
    const userToReturn = { ...user.toJSON(), token };

    return res.status(202).json(userToReturn);
});

router.get("/home", verifyToken, (req, res) => {
    res.status(200).json({ message: "Welcome to the Home Page!" });
});


router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        if (!user) {
            return res.status(404).json({ err: "User not found" });
        }
        return res.status(200).json({ firstName: user.firstName, lastName: user.lastName, username: user.username });
    } catch (error) {
        return res.status(500).json({ err: "Server error" });
    }
});

module.exports = router;
