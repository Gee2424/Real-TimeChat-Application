const socket = io();

const messages = document.getElementById('messages');
const userList = document.getElementById('userList');
const form = document.querySelector('form');
const input = document.getElementById('m');
const usernameInput = document.getElementById('username');
const darkModeButton = document.getElementById('dark-mode-button'); // Dark mode button

// Dark mode toggle
darkModeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const text = input.value;
    if (text.length === 0) return;

    socket.emit('chat message', text);
    input.value = '';
});

socket.on('chat message', (data) => {
    const item = document.createElement('li');
    if (/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/.test(data.message)) {
        const img = document.createElement('img');
        img.src = data.message;
        item.appendChild(img);
    } else if (/^(ftp|http|https):\/\/[^ "]+$/.test(data.message)) {
        const link = document.createElement('a');
        link.href = data.message;
        link.textContent = data.message;
        item.appendChild(link);
    } else {
        item.textContent = `${data.user}: ${data.message}`;
    }
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('userList', (users) => {
    userList.innerHTML = '';
    users.forEach(user => {
        const item = document.createElement('li');
        item.textContent = user;
        userList.appendChild(item);
    });
});

usernameInput.addEventListener('change', () => {
    socket.emit('username', usernameInput.value);
    usernameInput.disabled = true;
});
