/*
    Submission related routes
 */

const express = require("express");
const router = express.Router();
router.use(express.json());

const submissionsHwDb = require("../models/submissionsHwModel");
// We need the task database to validate submissions.
const submissionTaskDb = require("../models/submissionTaskModel");
//const submissionTaskDb = require("../models/submissionTaskModel");
// We need the user database to validate submissions.
const userDb = require("../models/userModel");


function validateSubmission(subInfo) {
    const allowedFields = ["assignment-name", "netId", "content","fileName"];
    let error = false;
    let message = "";
    return submissionTaskDb
        .findOne({ "task-name": subInfo["assignment-name"] })
        .then(function(task) {
            if (task) {
                // is the task open
                if (task.status !== "open") {
                    error = true;
                    message += `Task ${task["task-name"]} is not open. \n`;
                }
                // More synchronous checks on submission here if desired
                return [error, message];
            } else {
                error = true;
                message += `Task ${subInfo["task-name"]} Not Found; \n`;
                return [error, message];
            }
        })
        .then(function(errMessage) {
            let [error, message] = errMessage;
            // Check student data base here
            return userDb.findOne({"netId": subInfo["netId"]})
                .then(function(user) {
                    if (user) {
                        return [error, message];
                    } else {
                        error = true;
                        message += `Student ${subInfo["netId"]} Not Found.`;
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

// Teacher interface get submissions for a particular task from all students
router.get("/:taskName", function(req, res) {
    const taskName = req.params.taskName;
    submissionsHwDb
        .find({ "assignment-name": taskName })
        .then(function(docs) {
            let curDate = new Date();
            res.json({ submissions: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});
// Teacher interface get submissions for all tasks from all students
router.get("/", function(req, res) {
    submissionsHwDb
        .find({})
        .then(function(docs) {
            let curDate = new Date();
            res.json({ submissions: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Student interface get all submissions for a particular student
// Access control: a student can only see their own work
router.get("/student/:netId", function(req, res) {
    const netId = req.params.netId;
    submissionsHwDb
        .find({ "netId": netId })
        .then(function(docs) {
            res.status(200).json({ submissions: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Get a specific task for a specific student
// Access control: a student can only see their own work
router.get("/:taskName/student/:netId", function(req, res) {
    const taskName = req.params.taskName;
    const netId = req.params.netId;
    submissionsHwDb
        .findOne({ "assignment-name": req.params.taskName, "netId": netId })
        .then(function(doc) {
            if (doc) {
                res.status(200).json({ submission: doc });
            } else {
                res.status(404).json({ error: "Not Found;" });
            }
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Delete a particular students particular submission. Used by teacher to delete
// inappropriate submissions.
// Access Control: teacher
router.delete("/:taskName/student/:netId", function(req, res) {
    const taskName = req.params.taskName;
    const netId = req.params.netId;
    // console.log(taskName);
    submissionsHwDb
        .remove({ "assignment-name": taskName, "netId": netId })
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

router.delete("/:taskName/", function(req, res) {
    const taskName = req.params.taskName;
    // console.log(taskName);
    submissionsHwDb
        .remove({ "assignment-name": taskName})
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
router.put("/:taskName/student/:netId", function(req, res) {
    const taskName = req.params.taskName;
    const netId = req.params.netId;
    let submissionInfo = req.body;
    submissionInfo["assignment-name"] = taskName;
    submissionInfo["netId"] = netId;
    //submissionInfo.submittedOn = new Date().toJSON();

    // validateSubmission(submissionInfo).then(function(errMessage) {
    //     let [error, message] = errMessage;
    //     if (error) {
    //         res.status(400).json({ error: message });
    //         return;
    //     }
    //     if (taskName !== submissionInfo["assignment-name"]) {
    //         res.status(400).json({ error: "task-name and path don't match" });
    //         return;
    //     }
        // Uses an "upsert", i.e., allows both update and insert.
        submissionsHwDb
            .update(
                { "assignment-name": taskName, "netId": netId },
                submissionInfo,
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
// });

module.exports = router;
