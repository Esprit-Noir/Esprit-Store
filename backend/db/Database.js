const { default: mongoose } = require('mongoose');

const connectDatabase = () => {
  // Options for the MongoDB connection
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  // Connect to the database
  mongoose
    .connect(process.env.DB_URL, options)
    .then(() => {
      console.log('Connected to the database');
      // You can start interacting with the database here
    })
    .catch((error) => {
      console.error('Error connecting to the database:', error);
    });
};

module.exports = connectDatabase;
