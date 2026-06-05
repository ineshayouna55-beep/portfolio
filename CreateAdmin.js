require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./Admin');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Admin.create({
  password: 'MongoPass2026'   
  });
  console.log(' Admin créé !');
  process.exit();
});