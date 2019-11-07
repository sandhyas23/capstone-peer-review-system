/*
    Task related routes
 */

const express = require("express");
const router = express.Router();
router.use(express.json());

const submissionTaskDb = require("../models/submissionTaskModel");

// You can add more task validations in this function.
function validateTask(taskInfo) {
    const allowedFields = ["peer-review-for", "due", "status"];
    let error = false;
    let message = "";
    if (!taskInfo["task-name"]) {
        // Required field
        error = true;
        message += "missing task-name \n";
    }
    if (!taskInfo.status) {
        // Required field
        error = true;
        message += "missing status \n";
    }

    return [error, message];
}

// Used to create new tasks
router.post("/",  function(req, res) {
    let submissionTaskInfo = req.body; // This should be a JS Object
    let [error, message] = validateTask(submissionTaskInfo);
    if (error) {
        res.status(400).json({ error: message });
        return;
    }
    submissionTaskDb
        .find({ "task-name": submissionTaskInfo["task-name"] }) // task name already used?
        .then(function(docs) {
            // console.log(`docs: ${docs}`);
            if (docs.length > 0) {
                // console.log(`Task: ${taskInfo["task-name"]} already in DB`);
                res.status(400); // Bad request
                return { error: "task-name already used" };
            } else {
                // Not in DB so insert it
                return submissionTaskDb.insert(submissionTaskInfo).then(function(newDoc) {
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

// Get all the tasks
router.get("/", function(req, res) {
    submissionTaskDb
        .find({})
        .then(function(docs) {
            res.json({ submissionTasks: docs });
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

// Get a specific task
router.get("/:taskName", function(req, res) {
    submissionTaskDb
        .findOne({ "task-name": req.params.taskName })
        .then(function(doc) {
            if (doc) {
                res.json({ submissionTask: doc });
            } else {
                res.status(404).json({ error: "Not Found;" });
            }
        })
        .catch(function(err) {
            console.log(`Something bad happened: ${err}`);
            res.status(500).json({ error: "internal error" });
        });
});

router.delete("/:taskName", function(req, res) {
    let taskName = req.params.taskName;
    // console.log(taskName);
    submissionTaskDb
        .remove({ "task-name": taskName })
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

// Used to update a task
router.put("/:taskName", function(req, res) {
    let taskName = req.params.taskName;
    let submissionTaskInfo = req.body;
    let [error, message] = validateTask(submissionTaskInfo);
    if (error) {
        res.status(400).json({ error: message });
        return;
    }
    if (taskName !== submissionTaskInfo["task-name"]) {
        res.status(400).json({ error: "task-name and path don't match" });
        return;
    }
    submissionTaskDb
        .update({ "task-name": taskName }, submissionTaskInfo, { returnUpdatedDocs: true })
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
