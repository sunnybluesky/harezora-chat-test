console.log('script.js setup');

const messages = [];
let userCount = 0;
const settings = {
  audio: false,
  notice: false,
};
const notice = new Audio('../audio/notice.mp3');
function playSound() {
  notice.play();
}

const socket = io();
socket.emit('requestMessagesCount');
socket.on('receiveMessagesCount', (n) => {
  socket.emit('receivePastMessage', n);
});

let room = 'room1';
let user = {
  id: null,
  ip: null,
  name: 'anonymous',
};
socket.emit('joinRoom', room);

const sendForm = {
  message: document.querySelector('.input-message'),
  name: document.querySelector('.input-name'),
};

//メッセージの送信
function sendMessage(body = '', name = '') {
  var data = {
    body: body,
    name: name,
    id: user.id,
  };
  socket.emit('sendMessage', room, data);
  console.log('You send a message.', data);
}
sendForm.message.addEventListener('keydown', (e) => {
  if (sendForm.message.value != '') {
    if (e.key == 'Enter') {
      var text = sendForm.message.value;
      var name = sendForm.name.value;
      if (name == '') {
        name = 'anonymous';
      }
      sendForm.message.value = '';
      sendMessage(text, name);
    }
  }
});

//メッセージの受信
socket.on('receiveMessage', (data) => {
  messages.push(data);
  console.log('You received a message.', data);
  showMessages(data);
  if (true) {
    //通知御
    playSound();
  }
  if (true) {
    new Notification(`${data.name}:${data.body}`);
  }
});
socket.on('receivePastMessage', (data) => {
  console.log(data);
  for (var i = 0; i <= data.length - 1; i++) {
    var arr = data[i];
    messages.push(arr);
    showMessages(arr);
  }
  setTimeout(() => {
    messageList.scrollBy(0, ls.search('scrollTop'));
  }, 100);
});
socket.on('receiveUserCount', (data) => {
  userCount = data;
});
function initUserInfo() {
  if (ls.search('name') == null) {
    user.name = 'anonymous';
  } else {
    user.name = ls.search('name');
    console.log(`username:${user.name}`);
  }
  sendForm.name.value = user.name;
  if (ls.search('userId') == null) {
    var loop = setInterval(() => {
      if (ip !== null) {
        user.id = ipToRgb(ip) + '-' + Math.floor(Math.random() * 1000000);
        user.ip = ip;
        ls.add('userId', user.id);
        ls.add('userIp', user.ip);
        clearInterval(loop);
      }
    }, 1000 / 60);
  } else {
    user.id = ls.search('userId');
    user.ip = ls.search('userIp');
  }

  setInterval(() => {
    ls.add('name', sendForm.name.value);
    socket.emit('requestUserCount');
  }, 500);
}
initUserInfo();
function notification() {
  switch (Notification.permission) {
    case 'default':
      Notification.requestPermission();
      break;
    case 'granted':
      break;
    case 'denied':
      alert('通知が拒否されています');
      break;
  }
}
notification();
