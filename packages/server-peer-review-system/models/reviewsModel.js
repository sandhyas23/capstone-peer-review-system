/* We extract the submissionDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const path = require("path");
const Datastore = require("nedb-promises");
const dbFile = path.join(__dirname, '../', 'reviewsDB')

const reviewsDb = Datastore.create({
    filename: dbFile,
    autoload: true
});
reviewsDb.ensureIndex({ fieldName: "assignment-name", unique: false });
reviewsDb.ensureIndex({ fieldName: "submitter-id", unique: false });

module.exports = reviewsDb;
