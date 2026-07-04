const mongoose = require("mongoose");
const Profile = require("../models/Profile"); // path check kar lena
require("dotenv").config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    // Force sync indexes
    if(process.env.NODE_ENV !== "production"){
      await Profile.syncIndexes();
    }

    console.log("DB connection successfully");
    // console.log("Profile indexes synced");
  } catch (error) {
    console.log("Error in DB Connection");
    console.error(error.message);
    process.exit(1);
  }
};

module.exports = connect;