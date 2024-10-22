//httpサーバーとsocket.ioのセットアップ
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

const colors = require('colors');

const fs = require('fs');
const logFilePath = 'log.txt';

let userCount = 0;

function addLog(m) {
  for (var i = 0; i <= m.length - 1; i++) {
    m[i] = encodeURIComponent(m[i]);
  }
  m.join(',');
  m += '\n';
  if (getLogLength() < 500) {
    fs.appendFile(logFilePath, m, (err) => {
      if (err) throw err;
    });
  } else {
    var text = fs.readFileSync(logFilePath, 'utf8');
    var lines = text.toString().split('¥n');
    lines.shift();
    m = lines.join('\n');
    fs.writeFile(logFilePath, m, (err) => {
      if (err) throw err;
    });
  }
}
function deleteLog(data = '\n') {
  // 書き込み

  fs.writeFile(logFilePath, data, (err) => {
    if (err) throw err;
  });
}
function getLogLength() {
  var text = fs.readFileSync(logFilePath, 'utf8');
  var lines = text.toString().split('\n');
  return lines.length - 1;
}
function getLog() {
  var text = fs.readFileSync(logFilePath, 'utf8');
  var lines = text.toString().split('\n');

  for (var i = 0; i <= lines.length - 1; i++) {
    var arr = [];
    for (var j = 0; j <= lines[i].split(',').length - 1; j++) {
      arr.push(decodeURIComponent([lines[i].split(',')[j]]));
    }
    lines[i] = arr;
  }
  lines.pop();

  return lines;
}
console.log('ログの長さ : ' + getLogLength());

//ログの長さが1以下でないならgetLog()を実行する。

const messages = getLogLength() < 1 ? [] : getLog();
//カンマで区切ってメッセージの配列をオブジェクトに変換
if (messages != []) {
  for (var i = 0; i <= getLogLength() - 1; i++) {
    messages[i] = arrToObj(messages[i]);
  }
}

console.log(messages);

app.use(express.static(__dirname + '/public'));
//3000番ポート
server.listen(3000, () => {
  console.log('');
  console.log('┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓');
  console.log('┃ ' + 'welcome to harezora-chat! '.rainbow + '┃');
  console.log('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛');
});
// ルーティングの設定。'/' にリクエストがあった場合 src/index.html を返す
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  connect(socket);
  socket.on('disconnect', () => {
    disconnect(socket);
  });
  //入室
  socket.on('joinRoom', (roomName) => {
    socket.join(roomName);
    console.log(`User joined room: ${roomName}`);
  });

  // メッセージを送信
  socket.on('sendMessage', (roomName, message) => {
    var date = ('' + new Date()).split(' ')[4];
    message.date = date;
    var body = message.body;
    var name = message.name;
    var id = message.id;
    var hoge = 'hoge';
    var arr = [body, name, id, date, roomName, hoge];
    io.to(roomName).emit('receiveMessage', arrToObj(arr));

    addLog(arr);
    messages.push(arrToObj(arr));
  });
  // 過去メッセージのリクエスト
  socket.on('receivePastMessage', (len = 10) => {
    start = messages.length - len < 0 ? 0 : messages.length - len;
    var arr = messages.slice(messages.length - len, messages.length);
    io.to(socket.id).emit('receivePastMessage', arr);
  });
  socket.on('requestUserCount', () => {
    io.to(socket.id).emit('receiveUserCount', userCount);
  });
  socket.on('requestMessagesCount', () => {
    io.to(socket.id).emit('receiveMessagesCount', messages.length);
  });
});

function connect(socket) {
  console.log(`user connected. id:${socket.id}`.blue);
  userCount++;
}
function disconnect(socket) {
  console.log(`user disconnected. id:${socket.id}`.red);
  userCount--;
}
function arrToObj(arr) {
  return {
    body: arr[0],
    name: arr[1],
    id: arr[2],
    date: arr[3],
    roomName: arr[4],
    hoge: arr[5],
  };
}

//コマンドライン
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const commands = {
  help: () => {
    console.log('Available commands: help, exit, messages');
  },
  exit: () => {
    console.log('Bye!');
    rl.close();
  },
  messages: () => {
    console.log(messages);
  },
};

rl.prompt();

rl.on('line', (line) => {
  const command = line.trim().toLowerCase();
  if (commands[command]) {
    commands[command]();
  } else {
    console.log('Unknown command');
  }
  rl.prompt();
});
