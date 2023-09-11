//Node Server to manage socket io connections

//here initializing io to use PORT no. 8000 of socket.io

//find below line 6 to 10 as it solved the cors error
const io = require('socket.io')(8000, {
    cors:{
        origin: '*',
    }
});

const users = {};

//io.on = instance of socket.io server  & it listens to following events
io.on('connection', socket => {

    //socket.on = whenever some update happens to any connection then what should happen, is handled by socket.on
    //1. whenever socket listens to user-joined event, i.e, new user joined, name is appended to users with a unique socket id &
    socket.on('new-user-joined', name =>{
        console.log(name, "joined the chat")
        users[socket.id] = name;

        //server will broadcast a msg to all existing users that a new user is joined
        socket.broadcast.emit('user-joined', name);
    });

    //2. if a message is sent by a user then, 
    socket.on('send', message => {
        //broadcast or receive the message at receiving users(receiver will be identified using socket.id)
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    });


    //3. If someone leaves the chat, let other users know by broadcasting a msg that user is left
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', {name: users[socket.id]});
        delete users[socket.id];

    });
})



// const PORT = process.env.PORT || 8000;
// io.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


