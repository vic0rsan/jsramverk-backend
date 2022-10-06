require('dotenv').config();
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require("body-parser");

const app = express();

const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"]
    }
});

io.sockets.on('connection', function(socket) {
    //console.log(socket.id);

    socket.on('create', function(room) {
        if (room) {
            socket.join(room);
            console.log(`roomid: ${room}`);
        }
    });

    socket.on("doc", function (data) {
        //socket.broadcast.emit("doc", data);
        socket.to(data._id).emit("doc", data);
        console.log(data);
    });

    socket.on('leave', function (room) {
        socket.leave(room);
    });
});

const port = process.env.PORT || 1337;

const index = require('./routes/index');
const docs = require('./routes/docs');

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/', index);
app.use('/docs', docs);

// This is middleware called for all routes.
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});

app.use((req, res, next) => {
    var err = new Error("Not Found");

    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});

// Start up server
const server = httpServer.listen(port, () => {
    console.log(`Example API listening on port ${port}!`);
});

module.exports = server;
