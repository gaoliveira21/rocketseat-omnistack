const express = require('express');
const mongoose = require('mongoose');
//permite que o react faça requisições ao backend sem ser bloqueado
const cors = require('cors');
//rotas do sistema
const routes = require('./routes');

//servidor express
const app = express();
//aceita requisições websocket
const server = require('http').Server(app);
//web sockets para real time
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {

    const {user} = socket.handshake.query; 

    connectedUsers[user] = socket.id;

});

//Conexão com banco de dados
mongoose.connect('mongodb+srv://gaoliveira21:admin@cluster0-6jwjt.mongodb.net/omnistack8?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

// middleware
app.use((req, res, next)=>{
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//plugins
app.use(cors());
app.use(express.urlencoded());
app.use(express.json());
app.use(routes);

server.listen(3333);