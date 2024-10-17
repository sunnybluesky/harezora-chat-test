
async function hashIP(ipAddress) {
  const buffer = str2ab(ipAddress);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // バッファをバイト配列に変換
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // バイト配列を16進数の文字列に変換
  return hashHex;
}
// 文字列をArrayBufferに変換する関数
function str2ab(str) {
  const buf = new Uint8Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf;
}
function hexToUtf8(hexString) {
  // Split the hex string into an array of two-character chunks
  const hexChunks = hexString.match(/.{1,2}/g);

  // Convert the array of hex chunks to an array of characters
  const utf8Chars = hexChunks.map((hex) => {
    // Convert each hex chunk to a decimal
    const decimal = parseInt(hex, 16);
    // Convert the decimal to a character
    return String.fromCharCode(decimal);
  });

  // Combine the array of characters into a single string
  return utf8Chars.join('');
}

// Example usage:
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


let ip = null
let hashIp = null
let userId = null
var test = async function(){
const API_URL = 'https://api.ipify.org/?format=json'
const res = await fetch(API_URL)
const data = await res.json()
  ip = data.ip
  
}
test()

let waitForIp = setInterval(()=>{
  if(ip !== null){
    
    userId = decimalToBase32(Math.floor(getUserColor()))
    clearInterval(waitForIp)
  }
},10)
let waitForUserId = setInterval(()=>{
  if(userId !== null){
      socket.emit("user-id",userId)
    clearInterval(waitForUserId)
  }
},10)


