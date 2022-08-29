const routes = require("./routes/index.js");
const connectClientIO = require("socket.io");
const express = require("express");
const dotenv = require("dotenv");
const http = require("http");
const cors = require("cors");


const app = express();

dotenv.config();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.use('/api', routes);
app.get('**', (req, res) => res.status(200).json({ status: 200, data: 'Welcome to Video Compressor Backend' }));

const server = http.createServer(app);
const io = connectClientIO(server);
global.io = io;

io.on('connection', (socket) => {
  socket.emit('serverMessage', 'Server waiting file to compress');
});

server.listen(port, () => { console.log(`server is running on port ${port}`); });
