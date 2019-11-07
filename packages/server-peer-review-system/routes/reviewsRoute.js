/*
    Submission related routes
 */

const express = require("express");
const router = express.Router();
router.use(express.json());

const reviewsDb = require("../models/reviewsModel");
// We need the task database to validate reviews.
const reviewTaskDb = require("../models/reviewTaskModel");
//const reviewTaskDb = require("../models/submissionTaskModel");
// We need the user database to validate reviews.
const userDb = require("../models/userModel");


function validateSubmission(subInfo) {
    const allowedFields = ["assignment-name", "reviewer-id", "submitter-id","review"];
    let error = false;
    let message = "";
    return reviewTaskDb
        .findOne({ "peer-review-for": subInfo["assignment-name"] })
        .then(function(task) {
            if (task) {
                // is the task open
                if (task.status !== "open") {
                    error = true;
                    message += `Task ${task["peer-review-for"]} is not open. \n`;
                }
                // More synchronous checks on submission here if desired
                return [error, message];
            } else {
                error = true;
                message += `Task ${subInfo["peer-review-for"]} Not Found; \n`;
                return [error, message];
            }
        })
        .then(function(errMessage) {
            let [error, message] = errMessage;
            // Check student data base here
            return userDb.findOne({"netId": subInfo["submitter-id"]})
                .then(function(user) {
                    if (user) {
                        return [error, message];
                    } else {
                        error = true;
                        message += `Student ${subInfo["submitter-id"]} Not Found.`;
                        return [error, message];
                    }
                })

        })
        .then(function(errMessage) {
            let [error, message] = errMessage;
            // Check student data base here
            return userDb.findOne({"netId": subInfo["reviewer-id"]})
                .then(function(user) {
                    if (user) {
                        return [error, message];
                    } else {
                        error = true;
                        message += `Student ${subInfo["reviewer-id"]} Not Found.`;
                        return [error, message];
                    }
                })

        })
        .catch(function(err) {
            error = true;
            message += `Internal issue task database: ${err}`;
            return [error, message];
        });
}

// Teacher interface get reviews for a particular task from all students
router.get("/:taskName", function(req, res) {
    const taskName = req.params.taskName;
    reviewsDb
        .find({ "assignment-name": taskName })
        .then(function(docs) {
            let curDate = new Date();
            res.json({ reviews: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Student interface get all reviews for a particular student
// Access control: a student can only see their own work
router.get("/reviewer/:reviewerId", function(req, res) {
    const reviewerId = req.params.reviewerId;
    reviewsDb
        .find({ "reviewer-id": reviewerId })
        .then(function(docs) {
            res.status(200).json({ reviews: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Get reviews posted by a student
// Access control: a student can only see their own work
router.get("/:taskName/reviewer/:reviewerId", function(req, res) {
    const taskName = req.params.taskName;
    const reviewerId = req.params.reviewerId;
    reviewsDb
        .find({ "assignment-name": req.params.taskName, "reviewer-id": reviewerId })
        .then(function(doc) {
            if (doc) {
                res.status(200).json({ reviews: doc });
            } else {
                res.status(404).json({ error: "Not Found;" });
            }
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Get reviews that a particular student has received
// Access control: a student can only see their own work
router.get("/:taskName/submitter/:submitterId", function(req, res) {
    const taskName = req.params.taskName;
    const submitterId = req.params.submitterId;
    reviewsDb
        .find({ "assignment-name": req.params.taskName, "submitter-id": submitterId })
        .then(function(doc) {
            if (doc) {
                res.status(200).json({ reviews: doc });
            } else {
                res.status(404).json({ error: "Not Found;" });
            }
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Delete a particular students particular review. Used by teacher to delete
// inappropriate reviews.
// Access Control: teacher
router.delete("/:taskName/reviewer/:reviewerId/submitter/:submitterId", function(req, res) {
    const taskName = req.params.taskName;
    const reviewerId = req.params.reviewerId;
    const submitterId = req.params.submitterId
    // console.log(taskName);
    reviewsDb
        .remove({ "assignment-name": taskName, "reviewer-id": reviewerId ,"submitter-id":submitterId})
        .then(function(num) {
            if (num > 0) {
                res.status(200).json({ success: true });
            } else {
                res.status(404).json({ error: "not found" });
            }
        })
        .catch(function(err) {
            res.status(500).json({ error: err });
        });
});

// Put a specific task submission for a particular student
// Access control: 1. student's ID must match their logon student ID.
//                 2. can only update an "open" assignment.
//
router.put("/:taskName/reviewer/:reviewerId/submitter/:submitterId", function(req, res) {
    const taskName = req.params.taskName;
    const reviewerId = req.params.reviewerId;
    const submitterId = req.params.submitterId;
    let reviewInfo = req.body;
    reviewInfo["assignment-name"] = taskName;
    reviewInfo["reviewer-id"] = reviewerId;
    reviewInfo["submitter-id"] = submitterId;
    //submissionInfo.submittedOn = new Date().toJSON();

    validateSubmission(reviewInfo).then(function(errMessage) {
        let [error, message] = errMessage;
        if (error) {
            res.status(400).json({ error: message });
            return;
        }
        if (taskName !== reviewInfo["assignment-name"]) {
            res.status(400).json({ error: "task-name and path don't match" });
            return;
        }
        // Uses an "upsert", i.e., allows both update and insert.
        reviewsDb
            .update(
                { "assignment-name": taskName,"reviewer-id": reviewerId,"submitter-id":submitterId },
                reviewInfo,
                { returnUpdatedDocs: true, upsert: true }
            )
            .then(function(doc) {
                if (doc) {
                    // console.log(doc);
                    res.status(200).json(doc);
                } else {
                    res.status(404).json({ error: "Task not found" });
                }
            });
    });
});

module.exports = router;
