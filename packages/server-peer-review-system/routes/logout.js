// Logout route for users
const express = require("express");
const router = express.Router();
//const app = express();



router.use(express.json());
// Get the login homepage when logout is clicked and clear cookie
router.get('/', function(req, res, next){
    console.log("logged out from server");
    res.clearCookie("user");
    res.json({message: "Goodbye"});
});

module.exports = router;