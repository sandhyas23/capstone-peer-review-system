const reviewAssignment = require('../testHelpers/peerAlgorithm');
const assert = require('chai').assert;

describe('Peer Assignment Algorithm Tests', function () {
    let numStudents = 15,
        numReviews = 5,
        randomize = true,
        assignments, reviews;
    beforeEach(function(){
        [assignments, reviews] = reviewAssignment(numStudents, numReviews, randomize);
    });

    describe('Array and Set Checks', function(){
        it('Length reviews and assignments', function(){
            assert.isArray(reviews);
            assert.isArray(assignments);
            assert.lengthOf(reviews, numStudents, 'Every student reviews');
            assert.lengthOf(assignments, numStudents, 'Every assignment is reviewed');
        });
        it('Reviewers and Reviewees', function(){
            reviews.forEach(function(r){
                assert.lengthOf(r.reviewees, numReviews, 'Each student must perform M reviews');
            });
            assignments.forEach(function(a){
                assert.lengthOf(a.reviewers, numReviews, 'Each assignment must have M reviewers');
            });
        });
    });

    describe('Cannot review yourself checks', function(){
        it('Assignment cannot be reviewed by author', function(){
            assignments.forEach(function(a){
                assert(!a.reviewers.has(a.student));
            })
        });
        it('Reviewer cannot review themself', function(){
            reviews.forEach(function(r){
                assert(!r.reviewees.has(r.student));
            })
        });
    });

    describe('Bad Input Checks', function(){
        it('Zero or negative parameters', function(){
            assert.throws(reviewAssignment.bind(null, 0, numReviews, randomize));
            assert.throws(reviewAssignment.bind(null, numStudents, 0, randomize));
            assert.throws(reviewAssignment.bind(null, -3, -5, randomize));
        });
        it('numReviews > numStudents', function(){
            assert.throws(reviewAssignment.bind(null, 10, 15));
        });
    });

});
