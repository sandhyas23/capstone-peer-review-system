// Test the "review task", i.e., assignment related routes
const request = require("supertest");
const assert = require("chai").assert;
const resetTasks = require("../testHelpers/initStudentAssignDB");
const express = require("express");
const app = express();
const studentAssignRoute = require("../routes/studentAssignRoute");

app.use("/studentAssignment", studentAssignRoute);

describe("studentAssignRoute", function() {
    before(function(done) {
        // Note use of done to deal with async tasks.
        let q = resetTasks();
        // console.log(`q is a promise? ${q instanceof Promise}`);
        // console.log(`q is ${JSON.stringify(q)}`);
        q.then(function() {
            done();
        }).catch(done);
    });

    describe("Get /studentAssignment", function() {
        it("Getting all tasks with json", function(done) {
            request(app)
                .get("/studentAssignment")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert(res.body.studentAssignment, 1, "There should be 1 tasks");
                })
                .expect(200, done);
        });

        it("Getting a single task: HW1", function(done) {
            request(app)
                .get("/studentAssignment/HW1")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200, done);
        });

        it("Trying to get a nonexistant task: HW1.13", function(done) {
            request(app)
                .get("/studentAssignment/HW1.13")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(404, done);
        });
    });

    describe("Delete /studentAssignment", function() {
        it("Delete a task that exists: HW1", function(done) {
            request(app)
                .delete("/studentAssignment/HW1")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    console.log(res.body);
                    assert.exists(res.body.success);
                })
                .expect(200, done);
        });

        it("Try to delete a task that exists anymore: HW3.1", function(done) {
            request(app)
                .delete("/studentAssignment/HW3.1/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.error);
                })
                .expect(404, done);
        });
    });

    describe("Put /studentAssignment", function() {
        it("Update a task that exists: HW2", function(done) {
            let atask = {"peer-review-for":"HW2",
                "studentsAssignment":[
                    {
                        "student":"ih1407",
                        "reviewers":["ps6501"],
                        "reviewees":["py9469"]
                    },
                    {
                        "student":"jy1945",
                        "reviewers":["py9469"],
                        "reviewees":["ps6501"]
                    },
                    {
                        "student":"ps6501",
                        "reviewers":["jy1945"],
                        "reviewees":["ih1407"]
                    },
                    {
                        "student":"py9469",
                        "reviewers":["ih1407"],
                        "reviewees":["jy1945"]
                    }
                ]
            };
            request(app)
                .put("/studentAssignment/HW2/")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(res.body);
                    assert.deepInclude(res.body, atask);
                })
                .expect(200, done);
        });
    });
});
