// Test the "review task", i.e., assignment related routes
const request = require("supertest");
const assert = require("chai").assert;
const resetTasks = require("../testHelpers/initReviewTaskDB");
const express = require("express");
const app = express();
const reviewTaskRoute = require("../routes/reviewtaskRoute");

app.use("/reviewTask", reviewTaskRoute);

describe("reviewTaskRoute", function() {
    before(function(done) {
        // Note use of done to deal with async tasks.
        let q = resetTasks();
        // console.log(`q is a promise? ${q instanceof Promise}`);
        // console.log(`q is ${JSON.stringify(q)}`);
        q.then(function() {
            done();
        }).catch(done);
    });

    describe("Get /reviewTask", function() {
        it("Getting all tasks with json", function(done) {
            request(app)
                .get("/reviewTask")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert(res.body.reviewTasks, 4, "There should be 4 tasks");
                })
                .expect(200, done);
        });

        it("Getting a single task: HW3", function(done) {
            request(app)
                .get("/reviewTask/HW3")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(200, done);
        });

        it("Trying to get a nonexistant task: HW1.13", function(done) {
            request(app)
                .get("/reviewTask/HW1.13")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(404, done);
        });
    });

    describe("Post /reviewTask", function() {
        it("Post a task that exists: HW5", function(done) {
            const atask = {"peer-review-for":"HW5",
                "due":"2019-11-21T16:41:11.118Z",
                "rubric":[
                    {"rubric-name":"test","points":"2","criteria":"trstpp"},
                    {"rubric-name":"ques2","points":"2","criteria":"hhhlll"},
                    {"rubric-name":"ques3","points":"3","criteria":"trfrfrflll"}],
                "instructions":"kjj"
            };
            request(app)
                .post("/reviewTask")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert.exists(res.body.error);
                })
                .expect(400, done);
        });

        it("Post a new task: HW2", function(done) {
            const atask = {"peer-review-for":"HW2",
                "due":"2019-11-28T16:41:11.118Z",
                "rubric": [
                    {"rubric-name":"test89","points":"2","criteria":"trstpp"},
                    {"rubric-name":"ques29","points":"2","criteria":"hhhlll"},
                    {"rubric-name":"ques30","points":"3","criteria":"trfrfrflll"}],
                "instructions":"kjjopo"
            };
            request(app)
                .post("/reviewTask")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    console.log(res.body);
                    assert.equal(res.body["peer-review-for"], "HW2");

                })
                .expect(201, done);
        });

        it("Post a new bad task: hhh", function(done) {
            const atask = {
                "due":"2019-11-28T16:41:11.118Z",
                "rubric":[
                    {"rubric-name":"test89","points":"2","criteria":"trstpp"},
                    {"rubric-name":"ques29","points":"2","criteria":"hhhlll"},
                    {"rubric-name":"ques30","points":"3","criteria":"trfrfrflll"}],
                "instructions":"no task name"
            };
            request(app)
                .post("/reviewTask")
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

    describe("Delete /reviewTask", function() {
        it("Delete a task that exists: HW1", function(done) {
            request(app)
                .delete("/reviewTask/HW1/")
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
                .delete("/reviewTask/HW3.1/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.error);
                })
                .expect(404, done);
        });
    });

    describe("Put /reviewTask", function() {
        it("Update a task that exists: HW2", function(done) {
            let atask = {"peer-review-for":"HW2",
                "due":"2019-11-27T16:41:11.118Z",
                "rubric":[{"rubric-name":"test","points":"2","criteria":"updated"},
                    {"rubric-name":"ques2","points":"2","criteria":"hhhlll"},
                    {"rubric-name":"ques3","points":"3","criteria":"trfrfrflll"}],
                "instructions":"updated new"
            };
            request(app)
                .put("/reviewTask/HW2/")
                .set("Accept", "application/json")
                .send(atask)
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(res.body);
                    assert.deepInclude(res.body, atask);
                })
                .expect(200, done);
        });

        it("Try to update a non-existant task: HW6.1", function(done) {
            let atask = {"peer-review-for":"HW6.1",
                "due":"2019-11-27T16:41:11.118Z",
                "rubric":[{"rubric-name":"test","points":"2","criteria":"updated"},
                    {"rubric-name":"ques2","points":"2","criteria":"hhhlll"},
                    {"rubric-name":"ques3","points":"3","criteria":"trfrfrflll"}],
                "instructions":"updated new"
            };
            request(app)
                .put("/reviewTask/HW6.1/")
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
