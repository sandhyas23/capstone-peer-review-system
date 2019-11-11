/* We extract the taskDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const path = require("path");
const Datastore = require("nedb-promises");
const dbFile = path.join(__dirname, '../', 'studentAssignmentDB')

const studentAssignDb = Datastore.create({
    filename: dbFile,
    autoload: true
});
studentAssignDb.ensureIndex({ fieldName: "peer-review-for", unique: true });

module.exports = studentAssignDb;
