// Test the "task", i.e., assignment related routes
const request = require("supertest");
const assert = require("chai").assert;
const resetTasks = require("../testHelpers/initSubmissionTaskDB");
const express = require("express");
const app = express();
const submissionTaskRoute = require("../routes/submissiontaskRoute");

app.use("/submissionTask", submissionTaskRoute);

describe("submissionTaskRoute", function() {
    before(function(done) {
        // Note use of done to deal with async tasks.
        let q = resetTasks();
        // console.log(`q is a promise? ${q instanceof Promise}`);
        // console.log(`q is ${JSON.stringify(q)}`);
        q.then(function() {
            done();
        }).catch(done);
    });

    describe("Get /submissionTask", function() {
        it("Getting all tasks with json", function(done) {
            request(app)
                .get("/submissionTask")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert(res.body.submissionTasks, 6, "There should be 6 tasks");
                })
                .expect(200, done);
        });

        it("Getting a single task: HW3", function(done) {
            request(app)
                .get("/submissionTask/HW3")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200, done);
        });

        it("Trying to get a nonexistant task: HW1.13", function(done) {
            request(app)
                .get("/submissionTask/HW1.13")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(404, done);
        });
    });

    describe("Post /submissionTask", function() {
        it("Post a task that exists: HW1", function(done) {
            const atask = {
                "type": "submission",
                "task-name": "HW1",
                "due": "2019-11-15T19:00:00.000Z"
            };
            request(app)
                .post("/submissionTask")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert.exists(res.body.error);
                })
                .expect(400, done);
        });

        it("Post a new task: HW6", function(done) {
            const atask = {
                "type": "submission",
                "task-name": "HW6",
                "due": "2019-11-28T19:00:00.000Z"
            };
            request(app)
                .post("/submissionTask")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert.include(res.body, atask);
                    //console.log(res.body);
                })
                .expect(201, done);
        });

        it("Post a new bad task: HW3", function(done) {
            const atask = {
                // Missing task-name
                "type": "submission",
                "due": "2019-11-27T19:00:00.000Z"
            };
            request(app)
                .post("/submissionTask")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert.exists(res.body.error);
                    //console.log(res.body);
                })
                .expect(400, done);
        });
    });

    describe("Delete /submissionTask", function() {
        it("Delete a task that exists: hhh", function(done) {
            request(app)
                .delete("/submissionTask/hhh/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.success);
                })
                .expect(200, done);
        });

        it("Try to delete a task that exists anymore: HW3.1", function(done) {
            request(app)
                .delete("/submissionTask/HW3.1/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.error);
                })
                .expect(404, done);
        });
    });

    describe("Put /submissionTask", function() {
        it("Update a task that exists: HW5", function(done) {
            let atask = {
                "type": "submission",
                "task-name": "HW5",
                "due": "2019-11-26T19:00:00.000Z"
            };
            request(app)
                .put("/submissionTask/HW5/")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(res.body);
                    assert.include(res.body, atask);
                })
                .expect(200, done);
        });

        it("Try to update a non-existant task: HW6.1", function(done) {
            let atask = {
                "type": "submission",
                "task-name": "HW6.1",
                "due": "2019-11-25T19:00:00.000Z"
            };
            request(app)
                .put("/submissionTask/HW6.1/")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(res.body);
                    assert.exists(res.body.error);
                })
                .expect(404, done);
        });
    });
});
