// Mocha test example
const request = require("supertest");
const assert = require("chai").assert;
const resetSubmissions = require("../testHelpers/initReviewsDB");
const express = require("express");
const app = express();
const reviewsRoute = require("../routes/reviewsRoute");

app.use("/reviews", reviewsRoute);

describe("Reviews Routes", function() {
    before(function(done) {
        // Note use of done to deal with async tasks.
        let q = resetSubmissions();
        // console.log(`q is a promise? ${q instanceof Promise}`);
        // console.log(`q is ${JSON.stringify(q)}`);
        q.then(function() {
            done();
        }).catch(done);
    });

    describe("Teacher Get /reviews", function() {
        it("Getting  reviews for all tasks and students with json", function(done) {
            request(app)
                .get("/reviews")
                .set("Accept", "application/json")
                // .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `Number of HW1.1 reviews: ${res.body.reviews.length} \n`
                    // );
                    assert.lengthOf(
                        res.body.reviews,
                        8,
                        "There should be 8 reviews "
                    );
                })
                .expect(200, done);
        });

        it("Getting reviews for a task that doesn't exist, HW1.13 json", function(done) {
            request(app)
                .get("/reviews/HW1.13")
                .set("Accept", "application/json")
                // .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(`Number of HW1.1 subs: ${res.body.reviews.length}`);
                    assert.lengthOf(
                        res.body.reviews,
                        0,
                        "There should be 0 reviews for HW1.13"
                    );
                })
                .expect(200, done);
        });
    });

    describe("Student Get /reviews", function() {
        it("Getting all the reviews for a single reviewer, ih1407", function(done) {
            request(app)
                .get("/reviews/reviewer/ih1407")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `# of subs for cw3337: ${res.body.reviews.length} \n`
                    // );
                    assert.lengthOf(
                        res.body.reviews,
                        2,
                        "There should be 2 reviews for ih1407"
                    );
                })
                .expect(200, done);
        });

        it("Try to reviews for a non-existant student, xyz337", function(done) {
            request(app)
                .get("/reviews/reviewer/xyz337")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(`# of subs for xyz337: ${res.body.reviews.length}`);
                    assert.lengthOf(
                        res.body.reviews,
                        0,
                        "There should be 0 reviews for xyz337"
                    );
                })
                .expect(200, done);
        });


        it("Try getting a non-existant sub HW1.13 for a single reviewer, ih1407", function(done) {
            request(app)
                .get("/reviews/HW1.13/reviewer/ih1407")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert.lengthOf(
                        res.body.reviews,
                        0,
                        "There should be 0 reviews for HW1.13"
                    );
                })
                .expect(200, done);
        });
    });

    describe("Student Put", function() {
        it("updating a single review HW2 for a single reviewer, ih1407 and submitter py9469", function(done) {
            request(app)
                .put("/reviews/HW2/reviewer/ih1407/submitter/py9469")
                .set("Accept", "application/json")
                .send({"reviewer-id":"ih1407",
                "submitter-id":"py9469",
                "assignment-name":"HW2",
                "review":{"general-comments":"edited",
                "rubric":[{"rubric-name":"test","possible-points":"2","points-given":"1","comments":"kkk edited"},
                {"rubric-name":"ques2","possible-points":"2","points-given":"0","comments":"wrong edited"},
                    {"rubric-name":"ques3","possible-points":"3","points-given":"0","comments":"wrong edited"}],
                "total-points":4}
                })
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `Updated HW1.3 of for cw3337: ${JSON.stringify(res.body)}`
                    // );
                    console.log(res.body);
                    assert.equal(res.body["assignment-name"], "HW2");
                })
                .expect(200, done);
        });

        // it("brand new review for reviewer jy1945 and submitter py9469  for HW1", function(done) {
        //     request(app)
        //         .put("/reviews/HW5/student/ih1407")
        //         .set("Accept", "application/json")
        //         .send({"reviewerId":"jy1945",
        //         "submitter-id":"py9469",
        //         "assignment-name":"HW1",
        //         "review":{"general-comments":"",
        //         "rubric":[{"rubric-name":"ques1edited","possible-points":"1","points-given":"1","comments":"nice"},
        //         {"rubric-name":"ques2","possible-points":"2","points-given":"1","comments":"done!"}],
        //         "total-points":5},
        //         "reviewer-id":"jy1945",
        //         "submittedOn":"2019-11-24T22:51:27.783Z"
        //         })
        //         .expect("Content-Type", /json/)
        //         .expect(function(res) {
        //             // console.log(
        //             //   `Created HW1.3 for bl6738: ${JSON.stringify(res.body)}`
        //             // );
        //             console.log(res.body);
        //             assert.equal(res.body["assignment-name"], "HW1");
        //         })
        //         .expect(200, done);
        // });


    });

    describe("Delete /reviews", function() {
        it("Delete reviews for a task that exists: HW1", function(done) {
            request(app)
                .delete("/reviews/HW1/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.success);
                })
                .expect(200, done);
        });

        it("Try to delete reviews for a task that exists anymore: HW3.1", function(done) {
            request(app)
                .delete("/reviews/HW3.1/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.error);
                })
                .expect(404, done);
        });

    });
});
