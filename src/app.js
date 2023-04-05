const express = require('express');
const mongoose = require('mongoose');
const hostname = "0.0.0.0";

const port = 3000;


const server = express();

mongoose.connect('mongodb://mongo/apinode');

server.use(express.urlencoded());
server.use(express.json());

const post = require('./api/routes/postRoute');
const comment = require('./api/routes/commentRoute');
const user = require('./api/routes/userRoute');
post(server);
comment(server);
user(server);

server.listen(port, hostname , () => {
    console.log(`Server running at http://${hostname}:${port}/`);
}
);

