const mongoose = require('mongoose');
const User = require('./models/user');
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("Database connected!");
  // Test creating a user
  User.create({ email: 'test@example.com', username: 'testuser', password: 'password123' })
    .then(user => console.log(user))
    .catch(err => console.error('Error:', err));
})
.catch(err => console.error('Connection Error:', err));
