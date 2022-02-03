import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const cors = require('cors');
const app = express();//приложение

app.options('*', cors())

const httpServer = createServer(app);//сервер
const socket = new Server(httpServer, {
    cors: {
        origin: "https://dimix-international.github.io/my-first-chat/",
        methods: 'GET,POST,PUT,DELETE',
        credentials: true
    }
});//socket


const messages: any[] = []

//будем хранить пользователя для каждого socketChannel
const usersState = new Map();


app.get('/', (req, res) => {
    res.send('Hello it is WS server'); //создали endpoint
})

socket.on("connection", (socketChannel) => {
    // socket подписался на событие connection, и когда оно произойдет выполняется этот код

    //для каждого нового пользователя, который за конектился, запишем в users
    usersState.set(socketChannel, {
        id: new Date().getTime().toString(),
        name: 'anonym'
    })


    //socketChannel - сокет канал с конкретным пользователем
    // дальнейшие подписки идут на него
    //если видимо on - это значит подписались на событие с "другой стороны" (с фронта) сейчас
    socketChannel.on("client-message-sent", (message: string, successFn) => {
        //сделаем проверку на длину строки, если message слишком большое, мы пришлем ошибку
        // successFn - функция которая выполнится и вернет ответ с сервера ( если нужно)
        if (message.length > 100) {
            successFn('Message should be less than 100 chars!');
            return
        }

        //находим user
        const user = usersState.get(socketChannel);

        // socket подписался на событие client-message-sent, и когда оно произойдет выполняется этот код
        const messageItem = {
            message: `${message}`,
            id: new Date().getTime().toString(),
            user: {id: `${user.id}`, name: `${user.name}`}
        };

        messages.push(messageItem);

        //рассылаем сообщение новое всем пользователям - публикуем событие, на фронте должны подписаться
        socket.emit('new-message-sent', messageItem);

       successFn(null); //означает что все хорошо
    });

    //когда какой-то из сокетов присылает изменение имени
    socketChannel.on('client-name-sent', (name: string, successFn) => {
        //сделаем проверку на длину строки, если name слишком большое, мы пришлем ошибку
        if (name.length > 20) {
            successFn('Name should be less than 20 chars!');
            return
        }

        const user = usersState.get(socketChannel);
        user.name = name;

      successFn(null); //означает что все хорошо
    })

    //событие, когда пользователь набирает текст
    socketChannel.on('client-typing-message', () => {
        //сделаем рассылку всем, кроме себя (чтобы не видеть у себя что мы набираем текст)
        socketChannel.broadcast.emit('user-typing', usersState.get(socketChannel))
    })

    //пользователь connected, пришелем ему те сообщения которые у нас уже есть messages[], emit - рассылка всем
    socketChannel.emit('init-messages-published', messages, () => {
        //callback сработает когда на фронте его вызовут
        console.log('init messages received')
    });


    //когда пользователь вышел из чата, или перезагрузил страничку,
    // используем disconect
    socket.on("disconnect", () => {
        //удалим user
        usersState.delete(socketChannel)
    });
    console.log(' a user connected')
});


const PORT = process.env.PORT || 4009;

httpServer.listen(PORT, () => {
    console.log(`listening => http://localhost:${PORT}`)
});
