const mongoose = require('mongoose');

const connectDB = () => {
  mongoose.connect(process.env.MONGO_URI)
    .then((conn) => console.log(`MongoDB connected successfully: ${conn.connection.host}`))
    .catch((error) => console.error(`Error connecting to MongoDB: ${error.message}`));
};

module.exports = connectDB;
