

const notice = new Audio("../music/notice.mp3");

const socket = io();
let visitor = [];

let notExistCounter = 0;
socket.on("visitor", (name, ip,leaveList,id) => {
  if (name.includes(cookie.search("username"))){
    notExistCounter = 0
  }else{
    notExistCounter++
    if(notExistCounter > 5){
    //  location.reload()
    }
  }
  visitor = name;
  var str = "";
  var hoverStr = "";
  for (let i = 0; i < visitor.length; i++) {
    var leaveText = '<font color=green title="在籍中">●</font>'

    str += `<div class="visitor-name" width=100px id="visitor-${i}">${leaveText}<span class="visitor-body">${visitor[i]}</span></div>`;
  }
  document.querySelector(".visitor").innerHTML = str;
});
socket.on("reload", () => {
  location.reload();
});
socket.on("message", (msg) => {
  if(msg.includes("@silent")){}else{
  notice.play();
  }
  console.log(msg)
  addMessage(msg);
});
socket.on("ask-name", () => {
  socket.emit("ask-name", cookie.search("username"));
});

socket.emit("request-log");
socket.on("log", (log) => {
  // var last = log.pop()
  for (var i = 0; i < log.length - 1; i++) {
    addMessage(log[i]);
  }
  mainFrame.scrollTo({
    top: 100000000,
    left: 0,
  });
});
let willLeave = false;
const main = document.querySelector(".main");
const mainFrame = document.querySelector(".main-frame");
const sendBtn = document.querySelector(".send-btn");
mainFrame.style.height = `${window.innerHeight - 250}px`;

const leaveBtn = document.querySelector(".leave");

const messageInput = document.querySelector(".msginp");
const usernameInput = document.querySelector(".nameinp");

leaveBtn.addEventListener("click",()=>{
  if(willLeave){
    willLeave = false
    leaveBtn.value = "離席する"
  }else{
    willLeave = true
    leaveBtn.value = "在席する"
  }
  socket.emit("leave",willLeave)
})

sendBtn.addEventListener("click", () => {
  messageSend();
});
messageInput.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    messageSend();
  }
});
function messageSend() {
  if (messageInput.value !== "") {
    socket.emit(
      "message",
      messageInput.value,
      usernameInput.value,
      getCurrentTime(),
      userId,
    );
    //("message",message,username,timestamp,id)
    messageInput.value = "";
  }
}
function addMessage(msg) {
  if (typeof msg === "string") {
    msg = msg.split("𞄷");
  }
  var li = document.createElement("div");
  li.classList.add("message");
  li.innerHTML = `<span class="name" onclick=reply('${msg[1]}')>${msg[1]}</span><span class=timestamp> Id:${msg[3]} ${msg[2]}</span><br>${msg[0]}`;

  main.appendChild(li);

  document.querySelector(".main-frame").scrollBy({
    top: 47.2,
    left: 0,
    behavior: "smooth",
  });
}
function reply(name){
  var check = confirm(`${name}に返信しますか？`)
  if(check){
  if(messageInput.value.includes("@"+name) !== true){
     
  if(messageInput.value == ""){
    alert("メッセージが入力されていません。")
  }else{
    messageInput.value = `@${name},` + messageInput.value
    messageSend()
  }
}
}
}
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
}

let checkCount = 0;
socket.on("check", () => {
  checkCount = 0;
});
setInterval(() => {
  if (checkCount == 50000000) {
    location.reload();
  }
  socket.emit("check");
  checkCount++;
  if (usernameInput.value.includes("∴") || usernameInput.value.includes("∵")) {
    usernameInput.value = "anonymous";
    alert("その文字は使用することができません。");
  }
  cookie.set("username", usernameInput.value);
}, 200);

function getUserColor() {
  var ips = ip.split(".");
  ips = ips.splice(0, 3);
  var max = 0;
  for (var i = 0; i < ips.length - 1; i++) {
    if (ips[i] > max) {
      max = ips[i];
    }
  }
  for (var i = 0; i < ips.length - 1; i++) {
    ips[i] = Math.floor((ips[i] / max) * 255);
  }
  return ips[0] * ips[1] * ips[2];
}

function decimalToBase32(decimal) {
  // 32進数の基数となる文字列
  const base32Chars = '0123456789abcdefghijklmnopqrstuv';

  let base32 = '';
  while (decimal > 0) {
    // 余りを計算し、対応する文字を取得
    const remainder = decimal % 32;
    base32 = base32Chars[remainder] + base32;
    // 商を次の計算に利用
    decimal = Math.floor(decimal / 32);
  }
  return base32;
}

function idLoadCmp() {
  const consoleStyle = (moji) => {
    const styles = `background-color: ${getUserColor()};
         color: #000;`;

    console.log("%c" + moji, styles);
  };

  consoleStyle("UserColor:" + getUserColor());
}

document.getElementById('imageInput').addEventListener('change', function(e) {encodeImage()
  });
    function encodeImage() {
        var fileInput = document.getElementById('imageInput').files[0];
        var reader = new FileReader();

        reader.onloadend = function() {
          if(reader.result.length < 600000){
            console.log(reader.result);
            var check = confirm("このファイルを送信しますか？")
            if(check){
              socket.emit("image", reader.result);
            }
          }else{
            alert("ファイルサイズが大きすぎます。500kb以下にしてください。")
          }
        }

        reader.readAsDataURL(fileInput);
    }
