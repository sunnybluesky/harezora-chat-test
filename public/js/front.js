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
  userCountElement.innerHTML = userCount;
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
  m.body = decodeURIComponent(m.body);
  el.innerHTML = `
  <div class="message-info">
  <span class="message-name">${m.name}</span>
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
