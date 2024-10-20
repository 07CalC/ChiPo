const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const Event = require("../models/Event");
const { objectToQueryString } = require("../Utils");

const EventController = {
  create: async (req, res) => {
    try {
      // Validate the event input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const data = matchedData(req);
      console.log(data);

      data.createdBy = data.userId;
      delete data.userId;
      data.createTime = Date.now();

      const eventId = Math.random().toString(36).substring(2, 8);

      const result1 = await Event.init(eventId);
      
      const result = await Event.update(eventId, objectToQueryString(data));
      if (result1[0].affectedRows == 0 || result[0].affectedRows == 0) {
        return res.status(404).json({ message: "Failed to register event", eventId, data });
      }

      res.status(201).json({ message: "Registered event successfully" , eventId});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "UpdateInfo failed check console for error" });
    }
  },

  get: async (req, res) => {
    try {
      // Validate the event input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const { eventId } = matchedData(req);

      const result = (await Event.get(eventId))[0];
      if (result.length == 0) {
        return res.status(404).json({message: "Event's Data does not exist", eventId});
      }
      res.status(200).json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "GetStats failed check console for error" });
    }
  },

  getAll: async (req, res) => {
    try {
      // Validate the event input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const result = (await Event.getAll())[0];
      for(const val of result){
        val.photos = JSON.parse(val.photos);
      }
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "GetStats failed check console for error" });
    }
  },

  update: async (req, res) => {
    try {
      // Validate the event input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const data = matchedData(req);
      const eventId = data.eventId;
      delete data.eventId;

      const result = await Event.update(eventId, objectToQueryString(data));
      if (result[0].affectedRows == 0) {
        return res.status(404).json({ message: "Failed to update event", eventId: data.eventId, data: tmp });
      }
      res.status(201).json({ message: "Updated Event successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "update Event failed. Check console for error" });
    }
  },

};

module.exports = EventController;
