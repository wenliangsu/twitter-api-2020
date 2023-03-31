if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const methodOverride = require('method-override');

// const cors = require('cors');
const http = require('http');

// const { Server } = require('socket.io');
const passport = require('./config/passport');
const routes = require('./routes');
const helpers = require('./_helpers');
const socketio = require('./utils/socketio');

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// const io = new Server(server);
// 限定網域設定
// const corsOptions = {
//   origin: 'https://pure-scrubland-51482.herokuapp.com/',
// };

socketio.init(server);
socketio.connect();
// app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(passport.initialize());

app.use(methodOverride('_method'));

app.use('/upload', express.static(path.join(__dirname, 'upload')));

app.use('/api', routes);

// app.get('/', (req, res) => res.send(`You did not pass the authentication`));

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

module.exports = app;
