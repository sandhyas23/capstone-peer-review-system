/* We extract the userDb to this module to allow for sharing without
   trying to make NEDB fight itself by trying to create the same datastore multiple times
   with the same file.
   We just need one!

 */
const path = require("path");
const Datastore = require("nedb-promises");
const dbFile = path.join(__dirname, '../', 'userDB')

const taskDb = Datastore.create({
    filename: dbFile,
    autoload: true
});
taskDb.ensureIndex({ fieldName: "netId", unique: true });

module.exports = taskDb;
