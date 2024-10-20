const db = require("../config/database");

const Event = {
  init: (eventId) => {
    return db
      .promise()
      .execute(
        "INSERT INTO events (eventId) VALUES (?)",
        [eventId]
      );
  },
  get: (eventId) => {
    return db.promise().query("SELECT * FROM events WHERE eventId = ?", [eventId]);
  },
  getAll: () => {
    return db.promise().query("SELECT * FROM events");
  },
  update: (eventId, newInfo) => {
  //newSettings in string format 
    return db
      .promise()
      .execute(
        "UPDATE events SET " + newInfo + " WHERE eventId = ?",
        [eventId]
      );
  }
};

module.exports = Event;
