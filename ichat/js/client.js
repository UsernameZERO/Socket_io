const socket = io("http://localhost:8000");

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector('.container');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = messageInput.value;
    append(`You: ${msg}`, 'Right');
    socket.emit("send", msg);
    messageInput.value = "";
})

const userName = prompt("enter your name to join");
console.log("lin 8");
socket.emit("new-user-joined", userName);
socket.on("user-joined", username => {
    append(`${username} joined the chat`, 'Right');
})

socket.on("recieve", data => {
    append(`${data.name}: ${data.message}`, 'Left');
})