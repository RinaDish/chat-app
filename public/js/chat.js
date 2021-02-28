/* eslint-disable no-undef */
const socket = io();

const $messageForm = document.querySelector('#message-form');
const $messageFormInput = document.querySelector('input');
const $messageFormButton = document.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');

const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;

socket.on('message', (message) => {
//   document.querySelector('#message-1').textContent = message;
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // disable form
  $messageFormButton.setAttribute('disabled', 'disabled');

  const message = e.target.elements.message.value;

  socket.emit('sendMessage', message, (error) => {
    // enable form
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = '';
    $messageFormInput.focus(); // cursor

    if (error) return console.log(error);
    return console.log('Delivered!');
  });
});

$sendLocationButton.addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation is not supported by your browser');

  $sendLocationButton.setAttribute('disabled', 'disabled');

  return navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', `${position.coords.latitude},${position.coords.longitude}`, (error) => {
      $sendLocationButton.removeAttribute('disabled');

      if (error) return console.log(error);
      return console.log('Location Shared!');
    });
  });
});

socket.on('sendLocation', (message) => {
  const html = Mustache.render(locationTemplate, {
    locationUrl: message.url,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
//   document.querySelector('#message-2').textContent = location;
});
