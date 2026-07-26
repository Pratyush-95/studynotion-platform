const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");

const connectDB = require("./config/database");
const { connectRedis } = require("./config/redis");
const { cloudinaryConnect } = require("./config/cloudinary");

const PORT = process.env.PORT || 4000;

connectDB();
connectRedis();
cloudinaryConnect();

app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});