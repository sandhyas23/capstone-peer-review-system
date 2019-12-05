// Login route
const express = require("express");
const router = express.Router();
const cookieParser = require('cookie-parser');
const app = express();

router.use(express.json());
app.use(cookieParser);


const userDb = require("../models/userModel");

router.use(function(req, res, next) {
    // let cookieName = req.cookies.cookieName;
    // if(!cookieName) {
    //   let newCookie = Math.random().toString();
    //   res.cookie('cookieName', newCookie);
    // }
    // // console.log("cooke: " + cookieName);
    next();
});


// Validate login for teacher and students
router.post('/', (req, res, next) => {
    userDb.findOne({netId: req.body.netId
    })
        .then(user =>  {
        let userJson;
        if (user.password !== req.body.password || user === null) {
            res.status(401).json({ message: 'Invalid netId/password!' })
        } else {
            // set cookie for user
            userJson = {"netId" : user.netId,"role" : user.role,
                "email" : user.email,"firstName" : user.firstName,"lastName" : user.lastName};
           // // console.log("logged in as: ",(userJson));
            // console.log("req cookie",req.cookies.user);
            // if cookie already exists, cookie not set, else set a cookie
            if(typeof req.cookies.user === "undefined"){
                const cookieOpts = {
                    // domain: "blah",  // defaults to domain name
                    // expires: new Date() + 1000, // defaults to session cookie
                    httpOnly: false, // Browser JavaScript can't see it
                    maxAge: 900000, // Time from when it is set in ms, defaults to session cookie
                    path: "/", // default
                    //secure: false, // Require HTTPS
                    signed: false, //
                   // sameSite: "Lax"
                };
                res.cookie("user", JSON.stringify(userJson),cookieOpts);
                res.status(201).json(userJson);
            }
            else if(req.cookies.user === JSON.stringify(userJson)){
                res.status(201).json(userJson);

            }
            else{
                res.status(201).json({message: `Another session for netId ${JSON.parse(req.cookies.user).netId} already loggedin. Logout first!`})
            }

        }

    }) .catch(function(err) {
        res.status(500).json({ error: err });
    });
});


module.exports = router;