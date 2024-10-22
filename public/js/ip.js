console.log('ip.js setup');
let ip = null;
function ipToRgb(ip) {
  // IPアドレスを数値の配列に変換
  const ipArray = ip.split('.').map(Number);

  // 各オクテットをRGBの範囲(0-255)に収まるように調整
  const r = Math.floor((ipArray[0] * 255) / 255);
  const g = Math.floor((ipArray[1] * 255) / 255);
  const b = Math.floor((ipArray[2] * 255) / 255);

  // RGB値を16進数に変換し、#をつけてカラーコードとして返す
  return `#${r.toString(16).padStart(2, '0')}${g
    .toString(16)
    .padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
async function getIp() {
  const script = document.createElement('script');

  script.src = 'https://ipinfo.io?callback=callback';
  document.body.appendChild(script);
  document.body.removeChild(script);
}
getIp();
function callback(data) {
  console.log(data.ip);
  ip = data.ip;
}
//localstrage cookie
const ls = {
  body: [],
  key: [],
  value: [],
  splitBody: function () {
    this.key = [];
    this.value = [];
    for (var i = 0; i <= this.body.length - 1; i++) {
      var arr = this.body[i].split('=');
      this.key.push(decodeURIComponent(arr[0]));
      this.value.push(decodeURIComponent(arr[1]));
    }
  },
  integrationToBody: function () {
    this.body = [];
    var key;
    var value;
    for (var i = 0; i <= this.key.length - 1; i++) {
      key = encodeURIComponent(this.key[i]);
      value = encodeURIComponent(this.value[i]);
      this.body.push(`${key}=${value}`);
    }
  },
  convertBody: function () {
    localStorage.setItem('userData', this.body.join(';'));
  },
  add: function (k, v) {
    this.splitBody();
    if (this.key.indexOf(k) == -1) {
      this.key.push(k);
      this.value.push(v);
    } else {
      this.value[this.key.indexOf(k)] = v;
    }
    this.integrationToBody();
    this.convertBody();
  },
  remove: function (keyword) {
    var index = this.key.indexOf(keyword);
    this.key.splice(index, 1);
    this.value.splice(index, 1);
    this.integrationToBody();
    this.convertBody();
  },
  removeByNumber: function (num) {
    this.key.splice(num, 1);
    this.value.splice(num, 1);
    this.integrationToBody();
    this.convertBody();
  },
  search: function (keyword) {
    var result = null;
    if (this.key.indexOf(keyword) !== -1) {
      result = this.value[this.key.indexOf(keyword)];
    }
    return result;
  },
  delete: function () {
    localStorage.setItem('userData', null);
  },
};

function initLocalStrage() {
  if (localStorage.getItem('userData') == null) {
    localStorage.setItem('userData', '');
  }
  ls.body = localStorage.getItem('userData').split(';');
  ls.splitBody();
}
initLocalStrage();
