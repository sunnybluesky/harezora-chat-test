var colors = require('colors');

//log.txtの読み取りと書き込み

const fs = require("fs");
function addLog(m){
  m=m+"\n"
  if(getLogLength() < 500){
  fs.appendFile("log.txt", m, (err) => {
    if (err) throw err;
  });
  }else{
    var text = fs.readFileSync("log.txt", 'utf8');
    var lines = text.toString().split('¥n');
    lines.shift();
    m = lines.join("\n")
    fs.writeFile("log.txt", m, (err) => {
      if (err) throw err;
    });
  }
}
function deleteLog(data = "<font color='#ff0000'>これより前のメッセージはありません。</font>𞄷Server𞄷𞄷\n"){
  // 書き込み

  fs.writeFile("log.txt", data, (err) => {
    if (err) throw err;
  });

}
function getLogLength(){
var text = fs.readFileSync("log.txt", 'utf8');
var lines = text.toString().split('¥n');
  return lines.length
}
function getLog(){
  var text = fs.readFileSync("log.txt", 'utf8');
  var lines = text.toString().split('\n');
  return lines
}
console.log("ログの長さ : "+getLogLength())

//ユーザーとか
let userTabId = []
let userTabIp = []
let temporaryUserTabName = []
let userTabName = []
let userLeaveList = []
setInterval(()=>{
  
  io.emit("visitor",temporaryUserTabName,userTabIp,userLeaveList,userTabId)
  userTabName = temporaryUserTabName
  temporaryUserTabName = []
  for(let i=0;i<userTabId.length-1;i++){
    temporaryUserTabName.push("disconnected.")
  }
  for(let i=0;i<userTabId.length;i++){
    io.to(userTabId[i]).emit("ask-name")
  }
},1000)

function addUserTabName(id,name){
  if(name === ""){
    name = "anonymous"
  }
  temporaryUserTabName[userTabId.indexOf(id)] = name
}
function addUserTab(ip,id){
  if(userTabIp.includes(ip)){}else{
    console.log(`[${getCurrentTime()}] ${ip}が入室しました。`)
  }
  userTabId.push(id)
  userTabIp.push(ip)
  io.to(id).emit("visitor",temporaryUserTabName,userTabIp)
}
function deleteUserTab(id){
  
  for(var i=0;i<userTabId.length;i++){
    if(userTabId[i] == id){
      var ip = userTabIp[i]
      userTabId.splice(i,1)
      userTabIp.splice(i,1)
      if(userTabIp.includes(ip)){}else{
        console.log(`[${getCurrentTime()}] ${ip}が退出しました。`)
      }
    }
  }
  io.emit("visitor",temporaryUserTabName,userTabIp)
}
function getUserName(id){
  var name = userTabName[userTabId.indexOf(id)]
  console.log(`[${getCurrentTime()}] ${name} : img`);
  return name
}

//httpサーバーとsocket.ioのセットアップ
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

io.on("connection" /*接続*/, (socket) => {
  socket.on("disconnect" /*切断*/, () => {
    if(userLeaveList.includes(socket.id)){
    userLeaveList.splice(userLeaveList.indexOf(socket.id),1)
    }
    deleteUserTab(socket.id)
    
  });

  socket.on("message" /*メッセージ*/, (msg,name,time,id) =>{
    if(name===""){
      name="anonymous"
    }
    console.log(`${id[0]+id[1]+id[2]} [${time}] ${name} : ${msg}`);
    var data = [msg,name,time,id]
    addLog(data.join("𞄷"));
    io.emit("message" /*メッセージ*/, data);
  })
  socket.on("request-log" /*ログの要求*/,()=>{
    var log = getLog()
    io.to(socket.id).emit("log", log);
  })
  socket.on("user-id",(userId)=>{
    addUserTab(userId,socket.id)
    
  })
  socket.on("ask-name",(name)=>{
    addUserTabName(socket.id,name)
  })
  socket.on("check",()=>{
    io.to(socket.id).emit("check")
  })
  socket.on("image",(data)=>{
    var name = getUserName(socket.id)
    console.log(`[${getCurrentTime()}] ${name} : img`);

    var data = [`<img src=${data}>`,name,getCurrentTime(),socket.id]
    addLog(data.join("𞄷"));
    io.emit("message" /*メッセージ*/, data);
  });
  socket.on("leave",(willLeave)=>{
    var data = [``,"<font color=red>server</font>",getCurrentTime(),socket.id,"@silent"]

    if(willLeave){
     data[0] = `${getUserName(socket.id)}が離席しました。`   
      userLeaveList.push(socket.id)
    }else{
      data[0] = `${getUserName(socket.id)}が在籍しました。`
      userLeaveList.splice(userLeaveList.indexOf(socket.id),1)
    }
    
    io.emit("message",data)
  })
});

server.listen(3000, () => {
  console.log("listening on *:3000");
  console.log("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━┓")
  console.log("┃   " + 'server setup complete!  '.rainbow + "┃")
  console.log("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━┛")
  setTimeout(()=>{
    io.emit("reload");
  },3000)
  
});


//　コ　ン　ソ　ー　ル　入　力
const readline = require('readline');
const inputString = prompt => {
  const readInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise(resolive => readInterface.question(prompt, inputString => {
    readInterface.close()
    resolive(inputString);
  }));
};

function input_string() {
  (async() => {
    const string = await inputString("\x1b[39m");
    switch (string) {
    case "help":
      console.log("\x1b[33m")
      console.log("コマンドの使い方は以下の通りです。")
      console.log("ーーーーーーーーーーーーーーーーーーー")
      console.log("「help」コマンドの使い方を表示します。")
      console.log("「reload」全クライアントのページを再読み込みさせます。")
      console.log("「visitor」クライアントの名前を表示します")
      console.log("「delete-log」ログを消去します。")
      console.log("ーーーーーーーーーーーーーーーーーーー\x1b[39m")
      break;
      case "visitor":
        console.log(`「${string}」コマンドが実行されました。`)
        console.log(userTabName)
        break;
    case "reload":
      console.log(`「${string}」コマンドが実行されました。`)
      io.emit("reload");
      break;
      case "delete-log":
        console.log(`「${string}」コマンドが実行されました。`)
        deleteLog();
         break;  
    default:
      console.log("\x1b[31m該当するコマンドがありません。")
    }
    input_string();
  })();
}
console.log("\x1b[33m 「help」で各コマンドの説明が表示されます。")
input_string();

//現在時刻取得
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return hours + ':' + minutes + ':' + seconds;
}
