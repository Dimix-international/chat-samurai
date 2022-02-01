import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const cors = require('cors');
const app = express();//приложение


const httpServer = createServer(app);//сервер
const socket = new Server(httpServer);//socket

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: 'GET,POST,PUT,DELETE',
        credential: true,
    })
)

app.get('/', (req, res) => {
    res.send('Hello it is WS server'); //создали endpoint
})

socket.on("connection", (connection) => {
    // socket подписался на событие connection, и когда оно произойдет выполняется этот код
    console.log(' a user connected')
});

const PORT = process.env.PORT || 3009;

httpServer.listen(PORT, () =>{
    console.log('listening 3009...')
});