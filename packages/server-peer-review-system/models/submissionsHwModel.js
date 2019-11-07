/* We extract the submissionDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const path = require("path");
const Datastore = require("nedb-promises");
const dbFile = path.join(__dirname, '../', 'submissionsHwDB')

const submissionDb = Datastore.create({
    filename: dbFile,
    autoload: true
});
submissionDb .ensureIndex({ fieldName: "assignment-name", unique: false });
submissionDb.ensureIndex({ fieldName: "netId", unique: false });

module.exports = submissionDb;
