console.log('front.js setup');
const messageList = document.querySelector('.message-list');
const userCountElement = document.querySelector('.user-count');
const urlRegex =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
let messageCount = 0;
var count = 0;

setInterval(() => {
  count++;
  setMessageListSize();
  if (count > 5) {
    ls.add('scrollTop', Math.floor(messageList.scrollTop));
  }
}, 200);
function setMessageListSize() {
  messageList.style.height = innerHeight - 150 + 'px';
  userCountElement.innerHTML = userList.length;
}
function secondToDate(seconds) {
  // 1. ミリ秒に変換してDateオブジェクトを作成
  const date = new Date(seconds * 1000);

  // 2. 各パーツを2桁固定（ゼロ埋め）で取得
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const DD = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');

  return `${MM}/${DD} ${HH}:${mm}`;
}
function showMessages(m) {
  setMessageListSize();

  m.body = addLinks(m.body);

  var el = document.createElement('div');
  el.id = `m${messageCount}`;
  el.classList.add('message-frame');
  m.name = decodeURIComponent(m.name);
  m.id = decodeURIComponent(m.id);
  m.date = decodeURIComponent(m.date);
  m.date = secondToDate(Number(m.date))
  m.body = decodeURIComponent(m.body);

  el.innerHTML = `
  <div class="message-info">
  <span class="message-name" onclick='reply("${m.name}")'>${m.name}</span>
  <span class="message-id small"> Id:${m.id}</span>
  <span class="message-date small"> ${m.date}</span><br>
  <div class="message-body">${m.body}</div></div>`;
  messageList.append(el);
  setTimeout(() => {
    scrollBy(0, 60);
  }, 100);
}

function addLinks(text) {
  return text.replace(
    urlRegex,
    '<a href="$&" target="_blank" rel="noopener noreferrer" >$&</a>'
  );
}

const entrantsDialog = document.querySelector(".entrants")

let userListDialogData = null
let dialogType = 0
function showEntrants() {
  var str = `<h2>ユーザーリスト</h2>`
  var arr = userList.sort((a, b) => b[3] - a[3]);
  for (var i = 0; i <= arr.length - 1; i++) {
    str += `
    <div class="entrant-property">
      <span>${arr[i][0]}</span>
      <span class="small">${arr[i][1]}</span>
    </div>`
  }
  userListDialogData = str
  if (dialogType == 0) {
    entrantsDialog.innerHTML = str
  }
}
function switchDialog(n = 0) {
  dialogType = n
  switch (n) {
    case 0: entrantsDialog.innerHTML = userListDialogData;
      break;
    case 1: entrantsDialog.innerHTML = document.querySelector(".access-counter-dialog").innerHTML;
      break;
  }
}
const userCountFrame = document.querySelector(".user-count-frame")
userCountFrame.addEventListener("click", () => {
  switchDialog(0)
  showDialog()
})
document.querySelector(".show-access").addEventListener("click", () => {
  switchDialog(1)
  showDialog()
})

var overlay = document.createElement('div');
overlay.classList.add('overlay'); // CSSで背景をグレーアウトさせる

// ダイアログを表示する関数
function showDialog() {
  document.body.appendChild(overlay);
  entrantsDialog.showModal();
}

// ダイアログを閉じる関数
function closeDialog() {
  document.body.removeChild(overlay);
  entrantsDialog.close();
}

// オーバーレイをクリックしたらダイアログを閉じる
overlay.addEventListener('click', closeDialog);
// ダイアログの外側をクリックしたらダイアログを閉じる
entrantsDialog.addEventListener('click', (event) => {
  if (event.target === entrantsDialog) {
    closeDialog();
  }
});

function reply(replyName) {
  if (sendForm.message.value == "") {
    alert("メッセージが入力されていません。")
  } else {
    var text = `@${replyName},${sendForm.message.value}`;
    var name = sendForm.name.value;
    if (name == '') {
      name = 'anonymous';
    }
    sendForm.message.value = '';
    sendMessage(text, name);
  }
}

document.getElementById('imageInput').addEventListener('change', function (e) {
  encodeImage()
});
function encodeImage() {
  var fileInput = document.getElementById('imageInput').files[0];
  var reader = new FileReader();

  reader.onloadend = function () {
    if (reader.result.length < 600000) {
      console.log(reader.result);
      var check = confirm("このファイルを送信しますか？")
      if (check) {
        sendMessage(`<img src="${reader.result}">`, user.name)
      }
    } else {
      alert("ファイルサイズが大きすぎます。500kb以下にしてください。")
    }
  }

  reader.readAsDataURL(fileInput);
}
