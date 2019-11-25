/*
    StudentAssignment related routes
 */

const express = require("express");
const router = express.Router();
router.use(express.json());

const reviewTaskDb = require("../models/reviewTaskModel");
const studentAssignDb = require("../models/studentAssignModel");

// You can add more task validations in this function.
function validateTask(taskInfo) {
    const allowedFields = ["peer-review-for", "studentsAssignment"];
    let error = false;
    let message = "";
    if (!taskInfo["peer-review-for"]) {
        // Required field
        error = true;
        message += "missing peer-review-for \n";
    }
    if (!taskInfo["studentsAssignment"]) {
        // Required field
        error = true;
        message += "missing assignments \n";
    }

    return [error, message];
}

// Used to create new student assignments for all tasks
router.post("/",  function(req, res) {
    let reviewTaskInfo = req.body; // This should be a JS Object
    let [error, message] = validateTask(reviewTaskInfo);
    if (error) {
        res.status(400).json({ error: message });
        return;
    }
    studentAssignDb
        .find({ "peer-review-for": reviewTaskInfo["peer-review-for"] }) // task name already used?
        .then(function(docs) {
            // console.log(`docs: ${docs}`);
            if (docs.length > 0) {
                // console.log(`Task: ${taskInfo["peer-review-for"]} already in DB`);
                res.status(400); // Bad request
                return { error: "peer-review-for already used" };
            } else {
                // Not in DB so insert it
                return studentAssignDb.insert(reviewTaskInfo).then(function(newDoc) {
                    //console.log(`new doc: ${JSON.stringify(newDoc)}`);
                    res.status(201); // Created
                    return { ...newDoc };
                });
            }
        })
        .then(function(msg) {
            res.json(msg);
        })
        .catch(function(err) {
            // Really important for debugging too!
            console.log(`Something bad happened: ${err}`);
            res.json({
                status:"failed",
                reason: "internal error"
            });
        });
});

// Get all the student assignments
router.get("/", function(req, res) {
    studentAssignDb
        .find({})
        .then(function(docs) {
            res.json({ studentAssignment: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Get student assignment for a specific review task
router.get("/:taskName", function(req, res) {
    studentAssignDb
        .findOne({ "peer-review-for": req.params.taskName })
        .then(function(doc) {
            if (doc) {
                res.json({ studentAssignment: doc });
            } else {
                res.status(404).json({ error: "Not Found;" });
            }
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

//Delete student assignment for specific review task
router.delete("/:taskName", function(req, res) {
    let taskName = req.params.taskName;
    // console.log(taskName);
    studentAssignDb
        .remove({ "peer-review-for": taskName })
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


// Used to update student assignments for specific task
router.put("/:taskName/", function(req, res) {
    const taskName = req.params.taskName;
    let submissionInfo = req.body;
    submissionInfo["peer-review-for"] = taskName;
        studentAssignDb
            .update(
                { "peer-review-for": taskName},
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


module.exports = router;
