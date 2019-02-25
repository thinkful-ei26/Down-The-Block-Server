'use strict';

const express = require('express');
const app = express();
const http = require('http');
const socketIO = require('socket.io');
let server = http.createServer(app);
let io = socketIO(server);

module.exports = {socketIO, server, io, app};