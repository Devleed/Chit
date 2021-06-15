const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const cloudinary = require('cloudinary');

// * environment variables setup
const dotenv = require('dotenv');
dotenv.config();

// * configuring app
const app = express();

// * enabling cors
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, auth-token',
  );
  next();
});

// * port declaration
const port = process.env.PORT || 5000;

// * server startup
const server = app.listen(port, () => console.log(`listening on port ${port}`));

// * setting up socket io
const io = socketio(server);
require('./helpers/socketio/socketManager')(io);

// * middlewares
app.use(express.json());

// * setting routes
app.use('/auth', require('./routes/auth'));
app.use('/message', require('./routes/message'));
app.use('/user', require('./routes/user'));
app.use('/assets', require('./routes/assets'));

// * cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// * mongodb setup
mongoose
  .connect(process.env.MONGO_CONNECTION_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('database connected'))
  .catch(e => console.log(`error => ${e}`));

// ! checking the environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// * test route
app.get('/', (req, res) => {
  res.json('workin');
});
