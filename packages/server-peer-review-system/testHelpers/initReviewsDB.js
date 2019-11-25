/*  Create a NeDB datastore for submissions created by a *teacher*
    for use in testing.
*/

const db = require("../models/reviewsModel");
const reviews = require("./reviews.json");

function resetTasks() {
    return db
        .remove({}, { multi: true })
        .then(function(numRemoved) {
            // console.log(`Removed ${numRemoved} tasks`);
            let p = db.insert(reviews); // We let NeDB create _id property for us.
            // console.log(p instanceof Promise);
            return p;
        })
        .catch(function(err) {
            console.log(`Some kind of problem: ${err}`);
            return err;
        });
}

module.exports = resetTasks;
