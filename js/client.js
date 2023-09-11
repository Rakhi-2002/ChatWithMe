const socket = io('http://localhost:8000'); //it connects frontend - backend with each other


//get DOM elements into respective JS variables at runtime
const form = document.getElementById('send-container');
const messageInput = document.getElementById('inputmessage');
const messageContainer = document.querySelector(".container");


// const audio = new Audio('messageTune.mp3');

//Function which will append event info to the container
const append = (message, position) => {  
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);

    // audio.play();
}


//1. Code for new user joining to chat
//line 17: will accept the user name who is joining
//line 18:  will emit or broadcast the msg to all remaining users regarding new user
//ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit('new-user-joined', name);


//call of the new-user-joined function fron index.js/server, meaning when the new user joins, receive his/her name via the event defined in the server
socket.on('user-joined', name =>{
    append(`${name} joined the chat`, 'right')
})



//2. Code for receiving of msg from sender
//whenever sender sends new message, receive event will get called, meaning if server sends a msg, receive it
socket.on('receive', data =>{   //data is an object with message and user name as its properties
    append(`${data.name}: ${data.message}`, 'left')
})


//4. If a user leaves the chat, append the info to the container
socket.on('left', data => {
    append(`${data.name} left the chat`, 'right')
})


//if the form gets submitted(or simply sending/submitting the msg), send it to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send', message);
    messageInput.value = ''
})