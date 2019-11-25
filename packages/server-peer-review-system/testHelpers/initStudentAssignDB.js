/*  Create a NeDB datastore for tasks created by a *teacher*
    for use in testing.
*/

const db = require("../models/studentAssignModel");
const studentAssignment = require("./studentAssignment.json");

function resetTasks() {
    return db
        .remove({}, { multi: true })
        .then(function(numRemoved) {
            // console.log(`Removed ${numRemoved} tasks`);
            let p = db.insert(studentAssignment); // We let NeDB create _id property for us.
            // console.log(p instanceof Promise);
            return p;
        })
        .catch(function(err) {
            console.log(`Some kind of problem: ${err}`);
            return err;
        });
}

module.exports = resetTasks;
