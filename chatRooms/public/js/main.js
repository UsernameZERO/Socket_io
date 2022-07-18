const chatForm = document.getElementById('chat-form');
const chatContainer = document.querySelector('.chat-messages');

//Get username and room from url
const {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);


const socket = io();

//join chatroom
socket.emit('joinRoom', {
    username,
    room
});

//Message from server
socket.on('messageL', (message) => {
    console.log(message);
    let position = 'Left';
    outputMessage(message, position);

    chatContainer.scrollTop = chatContainer.scrollHeight;
})

socket.on('messageR', (message) => {
    console.log("RRRR", message);
    let position = 'Right';
    outputMessage(message, position);
})

//submit msg
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get msg from text
    const msg = e.target.elements.msg.value;
    // console.log(msg);

    //emit msg to server
    let pos = "Right";
    socket.emit('chatMsg', msg);
    append1(msg, pos);
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
})

const append1 = (message, postion) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('messages');
    messageElement.classList.add(postion);
    const showMsg = document.createElement('p');
    showMsg.innerText = message;
    showMsg.classList.add('show-msg');
    messageElement.append(showMsg);
    chatContainer.append(messageElement);
}

const append = (message, postion) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('messages');
    messageElement.classList.add(postion);
    // const showMsg = document.createElement('p');
    // showMsg.innerText = message;
    // showMsg.classList.add('show-msg');
    // messageElement.append(showMsg);
    // chatContainer.append(messageElement);
    messageElement.innerHTML = ` <p class="usrr">${message.username} <span class="usrr">${message.time}</span></p>
    <p class="show-msg">${message.text}</p>`
    document.querySelector('.chat-messages').appendChild(messageElement);

}
//output msg from dom
function outputMessage(msg, position) {
    append(msg, position);
}