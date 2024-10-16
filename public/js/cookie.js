const cookie = {
  body:"",
  key:[],
  value:[],
  set:function(key,value){
    if(this.key.includes(key)){
      this.value[this.key.indexOf(key)] =value
    }else{
    this.key.push(key)
    this.value.push(value)
    }
  },
  arrToBody:function(){
    this.body = ""
    for(var i=0;i<this.key.length;i++){
      this.body += this.key[i]+"∴"+this.value[i]+"∵"
    }
    document.cookie = this.body
  },
  bodyToArr:function(){
    var arr = document.cookie.split("∵")
    for(var i=0;i<arr.length-1;i++){
      this.key.push(arr[i].split("∴")[0])
      this.value.push(arr[i].split("∴")[1])
    }
  },
  search:function(str){
    return this.value[this.key.indexOf(str)]
    
  }
}

if(document.cookie.length > 0){
  cookie.bodyToArr()
  usernameInput.value = cookie.search("username")
}else{
  cookie.set("username","anonymous")
  cookie.arrToBody()
}
setInterval(()=>{
  cookie.arrToBody()
},1000)
