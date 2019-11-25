// Mocha test example
const request = require("supertest");
const assert = require("chai").assert;
const resetSubmissions = require("../testHelpers/initSubmissionsHW");
const express = require("express");
const app = express();
const submissionRoutes = require("../routes/submissions");

app.use("/submissions", submissionRoutes);

describe("Submission Routes", function() {
    before(function(done) {
        // Note use of done to deal with async tasks.
        let q = resetSubmissions();
        // console.log(`q is a promise? ${q instanceof Promise}`);
        // console.log(`q is ${JSON.stringify(q)}`);
        q.then(function() {
            done();
        }).catch(done);
    });

    describe("Teacher Get /submissions", function() {
        it("Getting  submissions for all tasks and students with json", function(done) {
            request(app)
                .get("/submissions")
                .set("Accept", "application/json")
                // .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `Number of HW1.1 submissions: ${res.body.submissions.length} \n`
                    // );
                    assert.lengthOf(
                        res.body.submissions,
                        12,
                        "There should be 12 submissions "
                    );
                })
                .expect(200, done);
        });

        it("Getting submissions for a task that doesn't exist, HW1.13 json", function(done) {
            request(app)
                .get("/submissions/HW1.13")
                .set("Accept", "application/json")
                // .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(`Number of HW1.1 subs: ${res.body.submissions.length}`);
                    assert.lengthOf(
                        res.body.submissions,
                        0,
                        "There should be 0 submissions for HW1.13"
                    );
                })
                .expect(200, done);
        });
    });

    describe("Student Get /submissions", function() {
        it("Getting a all the submissions for a single student, jy1945", function(done) {
            request(app)
                .get("/submissions/student/jy1945")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `# of subs for cw3337: ${res.body.submissions.length} \n`
                    // );
                    assert.lengthOf(
                        res.body.submissions,
                        3,
                        "There should be 3 submissions for jy1945"
                    );
                })
                .expect(200, done);
        });

        it("Try to submissions for a non-existant student, xyz337", function(done) {
            request(app)
                .get("/submissions/student/xyz337")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(`# of subs for xyz337: ${res.body.submissions.length}`);
                    assert.lengthOf(
                        res.body.submissions,
                        0,
                        "There should be 0 submissions for xyz337"
                    );
                })
                .expect(200, done);
        });

        it("Getting a single submission HW2 for a single student, jy1945", function(done) {
            request(app)
                .get("/submissions/HW2/student/jy1945")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `HW1.1 of for cw3337: ${JSON.stringify(res.body.submission)}\n`
                    // );
                    assert.equal(res.body.submission["assignment-name"], "HW2");
                })
                .expect(200, done);
        });

        it("Try getting a non-existant sub HW1.13 for a single student, jy1945", function(done) {
            request(app)
                .get("/submissions/HW1.13/student/jy1945")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    assert.notExists(res.body.submission, "Should be null");
                })
                .expect(404, done);
        });
    });

    describe("Student Put", function() {
        it("updating a single submission HW5 for a single student, jy1945", function(done) {
            request(app)
                .put("/submissions/HW5/student/jy1945")
                .set("Accept", "application/json")
                .send({
                    "assignment-name":"HW5",
                    "netId":"jy1945",
                    "fileName":"aaareacttest.md",
                    "submittedOn":"2019-11-22T06:31:01.481Z",
                    content: "It is used in `redirects`."
                })
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `Updated HW1.3 of for cw3337: ${JSON.stringify(res.body)}`
                    // );
                    assert.equal(res.body["assignment-name"], "HW5");
                })
                .expect(200, done);
        });

        it("brand new submission for ih1407 for HW5", function(done) {
            request(app)
                .put("/submissions/HW5/student/ih1407")
                .set("Accept", "application/json")
                .send({
                    "assignment-name":"HW5",
                    "netId":"ih1407",
                    "fileName":"aaareacttest.md",
                    "submittedOn":"2019-11-21T06:31:01.481Z",
                    "content":"What is the HTTP *Location* header used for?\r\n Its used in `redirects`."
                })
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    // console.log(
                    //   `Created HW1.3 for bl6738: ${JSON.stringify(res.body)}`
                    // );
                    assert.equal(res.body["assignment-name"], "HW5");
                })
                .expect(200, done);
        });


    });

    describe("Delete /submissions", function() {
        it("Delete submissions for a task that exists: HW2", function(done) {
            request(app)
                .delete("/submissions/HW2/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.success);
                })
                .expect(200, done);
        });

        it("Try to delete submissions for a task that exists anymore: HW3.1", function(done) {
            request(app)
                .delete("/submissions/HW3.1/")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.error);
                })
                .expect(404, done);
        });

        it("Try to delete a submission for task HW1 for student py9469", function(done) {
            request(app)
                .delete("/submissions/HW1/student/py9469")
                .set("Accept", "application/json")
                .expect("Content-Type", /json/)
                .expect(function(res) {
                    //console.log(res.body);
                    assert.exists(res.body.success);
                })
                .expect(200, done);
        });
    });
});
