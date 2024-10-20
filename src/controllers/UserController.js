const { validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { objectToQueryString } = require("../Utils");
const jwt = require("jsonwebtoken");

const UserController = {
  register: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const data = matchedData(req);
      const userId = data.userId;
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt)

      var tmp = data;
      delete tmp.userId;
      delete tmp.password;
      tmp.hashedPassword = hashedPassword;
      
      const check1 = (await User.get(userId))[0];
      const check2 = (await User.getByEmail(data.email))[0];
      if (check1.length != 0 || check2.length != 0) {
        return res.status(401).json({message: "User with that username or email already exists", userId});
      }

      const result1 = await User.init(userId);
      
      const result = await User.update(userId, objectToQueryString(tmp));
      if (result1[0].affectedRows == 0 || result[0].affectedRows == 0) {
        return res.status(404).json({ message: "Failed to register user", userId, data: tmp });
      }
      // if (isMatch) {
        token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '30d' });
        res.cookie('token', token, {
          httpOnly: true,
          //todo https
          // secure: true ,
          // maxAge: 5 * 60
        });
      // }

      res.status(201).json({ message: "Registered user successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "UpdateInfo failed check console for error" });
    }
  },

  login: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const { email, password } = matchedData(req);

      const result = (await User.getByEmail(email))[0];
      if (result.length == 0) {
        return res.status(404).json({ message: "User does not exists", email });
      }
      
      const userId = result[0].id;
      const isMatch = await bcrypt.compare(password, result[0].hashedpassword)

      if (isMatch) {
        token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: '30d' });
        res.cookie('token', token, {
          httpOnly: true,
          //todo https
          // secure: true ,
          // maxAge: 5 * 60
        });
        res.status(200).json({ userId });
      }
      else
        res.status(401).json({ message: "Invalid or wrong password", userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "GetInfo failed check console for error" });
    }
  },

  get: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
      const { userId } = matchedData(req);

      const result = (await User.get(userId))[0];
      if (result.length == 0) {
        return res.status(404).json({message: "User's Data does not exist", userId});
      }
      delete result[0].hashedpassword;
      res.status(200).json(result[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "GetStats failed check console for error" });
    }
  },

  update: async (req, res) => {
    try {
      // Validate the user input
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }

      const data = matchedData(req);
      const userId = data.userId;
      delete data.userId;

      const result = await User.update(userId, objectToQueryString(data));
      if (result[0].affectedRows == 0) {
        return res.status(404).json({ message: "Failed to update user", userId: data.userId, data: tmp });
      }
      res.status(201).json({ message: "Updated User successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "update User failed. Check console for error" });
    }
  },

};

module.exports = UserController;
