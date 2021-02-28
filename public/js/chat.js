const socket = io();

socket.on('message', (message) => {
  document.querySelector('#message-1').textContent = message;
});

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message);
});

document.querySelector('#send-location').addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation is not supported by your browser');

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', `${position.coords.latitude},${position.coords.longitude}`);
  });
});

socket.on('sendLocation', (location) => {
  document.querySelector('#message-2').textContent = location;
});
