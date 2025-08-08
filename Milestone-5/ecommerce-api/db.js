const mongoose = require('mongoose');

let conn = null;

async function connectToDatabase(uri) {
  if (conn == null) {
    conn = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    }).then(() => mongoose);
    await conn;
  }
  return conn;
}

module.exports = connectToDatabase;
