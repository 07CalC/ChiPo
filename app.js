require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');

const eventRoutes = require('./src/routes/Event');
const userRoutes = require('./src/routes/User');

const bodyParser = require('body-parser');

const db = require('./src/config/database');
const cookieParser = require('cookie-parser');
const initBackup = require('./backup');

const port = process.env.PORT || 3000;

//middleware
// app.set("view engine", "ejs");
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser())
app.use(bodyParser.json({limit:"50mb"}));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

app.use(express.static('./frontend/build'));

//routes
app.use('/api/user/', userRoutes);
app.use('/api/event/', eventRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

db.execute(`
  CREATE TABLE IF NOT EXISTS 
    users (
      hashedpassword TEXT,
      admin BOOLEAN DEFAULT 0,
      
      id VARCHAR(36) NOT NULL,
      name LONGTEXT DEFAULT NULL,
      email VARCHAR(500) DEFAULT NULL,
      location VARCHAR(100) DEFAULT '000000',
      creator BOOLEAN DEFAULT 0,
      
      phone INT,
      address VARCHAR(50) DEFAULT '',

      PRIMARY KEY (id)
    ) ENGINE=INNODB;
`);

db.execute(`
  CREATE TABLE IF NOT EXISTS events (
    eventId VARCHAR(36) NOT NULL,
    createdBy VARCHAR(36),
    createTime bigint(20) DEFAULT 0,
    
    entryFee INT DEFAULT 0,
    category VARCHAR(50) DEFAULT '',
    title VARCHAR(50) DEFAULT '',
    description LONGTEXT DEFAULT NULL,
    hasDate BOOLEAN DEFAULT 0,
    startDate VARCHAR(50),
    endDate VARCHAR(50),
    location VARCHAR(100) DEFAULT '000000',
    photos LONGTEXT DEFAULT '[]',
    
    comments LONGTEXT DEFAULT '[]',
    artists LONGTEXT DEFAULT '[]',

    PRIMARY KEY (eventId)
  ) ENGINE=INNODB;
`);

// initBackup();
