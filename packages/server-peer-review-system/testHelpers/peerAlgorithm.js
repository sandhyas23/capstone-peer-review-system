function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i)
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function reviewAssignment(numStudents, numReviews, randomize=true) {
    if ((numStudents <= 0) || (numReviews <= 0)) {
        throw Error('number of students and reviews must be positive');
    }
    if (numReviews >= numStudents) {
        throw Error('number of students must be greater than number of reviews');
    }
    // Array of student order, as if students were in a circle
    let ordering = [];
    for (let i = 0; i < numStudents; i++) {
        ordering[i] = i;
    }
    if(randomize){
        shuffle(ordering);
    }

    // Keep track of who is reviewing each students assignment
    let assignments = [];
    for (let i = 0; i < numStudents; i++) {
        let assignInfo = {
            student: ordering[i],
            reviewers: new Set()
        };
        assignments.push(assignInfo);
    }
    // Keep track of the assignments each student is reviewing
    let reviews = [];
    for (let i = 0; i < numStudents; i++) {
        let reviewInfo = {
            student: ordering[i],
            reviewees: new Set()
        };
        reviews.push(reviewInfo);
    }

    // Fixed mapping of reviewers to assignments based on
    // a circular pass the papers around notion.
    for (let i = 0; i < numStudents; i++) {
        let assignment = assignments[i];
        let increment = 1;
        while (assignment.reviewers.size < numReviews) {
            let trial = (i + increment) % numStudents;
            if (reviews[trial].reviewees.size >= numReviews) continue;
            assignment.reviewers.add(ordering[trial]);
            reviews[trial].reviewees.add(ordering[i]);
            increment++;
        }
    }
    let sortFunc = (a,b)=>a.student-b.student;
    assignments.sort(sortFunc);
    reviews.sort(sortFunc);
    return [assignments, reviews];
}

module.exports = reviewAssignment;