const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

const connect = async () => {
  try {
    await mongoose.connect('mongodb://localhost/db-blog-api', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('Database connection successful');
  } catch (err) {
    console.error('Error while connecting to database: ', err);
  }
};

module.exports = {
  connect
};
