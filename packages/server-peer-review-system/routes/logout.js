// Logout route for users
const express = require("express");
const router = express.Router();
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(express.json());
// Get the login homepage when logout is clicked and clear cookie
router.get('/', function(req, res, next){
    console.log("logged out from server");
    res.clearCookie("user");
    res.json({message: "Goodbye"});
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

module.exports = router;