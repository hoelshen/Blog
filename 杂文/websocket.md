
websocket
必须要先安装package.json
HTTP和WebSocket两者的差距不大
浏览网页时，经过三个过程
1、浏览器经过三次握手与web服务器建立链接，
2、web服务器返回响应
3、浏览器通过四次握手主动断开链接
因为第三步导致不能持久链接，那我们去掉第三步不就可以了实现持久链接了吗？这就是WebSocket与HTTP最大的不同（Web服务器是不会主动断开连接的），当然还有更多的数据封装格式的不同。
可以看到WebSocket是在HTTP上做的改动，有人曾经用单片机的TCP/IP协议栈封装符合HTTP协议格式的字符串，去连接Web服务器。WebSocket和HTML5没有多大关系。
如果要搭建一个Web服务器，我们会有很多选择，市场上也有很多成熟的产品供我们应用，比如开源的Apache，安装后只需简单的配置（或者默认配置）就可以工作了。但是如果想搭建一个WebSocket服务器就没有那么轻松了，因为WebSocket是一种新的通信协议，目前还是草案，没有成为标准，市场上也没有成熟的WebSocket服务器或者Library实现WebSocket协议，我们就必须自己动手写代码去解析和组装WebSocket的数据包。要这样完成一个WebSocket服务器，估计所有的人都想放弃，幸好的是市场上有几款比较好的开源库供我们使用，我们可以调用这些接口，这在很大程度上减少了我们的工作量。
百万websocket常连接的服务器
Netty服务器
Spray服务器
Undertow服务器
node.js
//-----------------------------------------------
Websocket协议之握手连接
一、协议包含两个部分，第一个是“握手”，第二个是数据传输。
ws://127.0.0.1:8080
wss://127.0.0.1:8080
二、握手（Opening > Closing Handshake）打开连接
1、发送握手请求
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Origin: <http://example.com>
Sec-WebSocket-Protocol: chat,  superchat
Sec-WebSocket-Version: 13
2、返回握手应答
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Protocol: chat
3、错误处理
所有数据传输都是UTF-8编码的数据，当一端接收到的字节流数据不是一个有效的UTF-8数据流，那个么接收到的这一方必须要马上关闭连接。这个规则在开始握手一直到所有的数据交换过程都要进行验证。

//--------------------------socket.io------------------------------------
Socket.io

node.js提供了高效的服务端运行环境，但是由于浏览器端对HTML5的支持不一，为了兼容所有浏览器，提供卓越的实时的用户体验，并且为程序员提供客户端与服务端一致的编程体验，于是socket.io诞生。Socket.io将Websocket和轮询 （Polling）机制以及其它的实时通信方式封装成了通用的接口，并且在服务端实现了这些实时机制的相应代码。也就是说，Websocket仅仅是 Socket.io实现实时通信的一个子集。那么，Socket.io都实现了Polling中的那些通信机制呢？

Adobe® Flash® Socket
AJAX long polling
AJAX multipart streaming
Forever Iframe
JSONP Polling

1. 创建项目，文件夹下创建package.json文件

{
  "name": "socket",
  "version": "0.0.1",
  "description": "myproject",
  "dependencies": {}
}

2. 安装net

G:\www\nodejs\socket>npm install net --save-dev

3. SocketServer.js

```javascript

var net = require('net');
var chatServer = net.createServer(),
    clientList = [];
    clientMap=new Object();

var ii=0;
chatServer.on('connection',  function(client) {  
  // JS 可以为对象自由添加属性。这里我们添加一个 name 的自定义属性，用于表示哪个客户端（客户端的地址+端口为依据）  
  client.name = client.remoteAddress + ':' + client.remotePort;
  client.write('Hi ' + client.name + '!\n');
  clientList.push(client);
  client.name=++ii;
  clientMap[client.name]=client;
  client.setEncoding('utf-8');
  //超时事件
  client.setTimeout(timeout, function(){
        console.log('连接超时');
        client.end();
    });

  client.on('data',  function(data) {
     console.log('客户端传来:'+data);
     //client.write('你发来:'+data);
     broadcast(data,  client); // 接受来自客户端的信息
  });
  //数据错误事件
    client.on('error', function(exception){
        console.log('client error:' + exception);
        client.end();
    });
    //客户端关闭事件
    client.on('close', function(data){
        delete clientMap[client.name];
        console.log(client.name+'下线了');
        broadcast(client.name+'下线了', client);

    });
  
});
function broadcast(message,  client) {
    for(var key in clientMap){
        clientMap[key].write(client.name+'say:'+message+'\n');
    }
}  
chatServer.listen(9000);  

4. SocketClient.js

var net = require('net');
var port = 9000;
var host = '127.0.0.1';

var client= new net. Socket();
client.setEncoding('UTF-8');
//client.setEncoding('binary');
//连接到服务端
client.connect(port, host, function(){
    client.write('你好');
});

client.on('data', function(data){
    console.log('服务端传来:'+ data);
    say();
});
client.on('error', function(error){
    console.log('error:'+error);
    //client.destory();

});
client.on('close', function(){
    console.log('Connection closed');
});
//----------------------------------------------------------
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function say(){
    rl.question('请输入： ',  (inputStr) => {
      if(inputStr!='bye'){
        client.write(inputStr+'\n');
        say();
      }else{
        client.destroy();      //关闭连接
        rl.close();
      }
    });
}
```

基本上用在手机，电脑端用的比较少
WS模块

要支持websocket的浏览器才能用

```javascript

1. 安装ws(IE8不支持)

G:\www\nodejs\socket>npm install ws --save-dev

2. WsServer.js

var WebSocketServer = require('ws'). Server
  , wss = new WebSocketServer({port: 9000});
wss.on('connection', function(ws) {

    console.log(ws+'上线');   
    ws.on('message', function(message) {   
        console.log('received: %s', message);   
    });   
    ws.send('something');   
    ws.on('close', function(){   
        global.gc();    //调用内存回收   
        console.log("leave");   
    });   

});

//运行：node --expose-gc WsServer.js   //让global.gc()可以执行

客户端
WsClient.js
var ws = new WebSocket("ws://127.0.0.1:8080/");
ws.onopen = function() {
   alert("Opened");
   ws.send("I'm client");
};

ws.onmessage = function (evt) {

    alert(evt.data);       

};

ws.onclose = function() {
   alert("Closed");
};

ws.onerror = function(err) {
   alert("Error: " + err);
};

3.wsclient.js

<! DOCTYPE html>
<html>

    <body>   
        <h1>WebSocket</h1>   
        <script src="WsClient.js"></script>   
    </body>   

</html>

wschat聊天室
<script src="WsClient.js"></script>

		<script>
			function say(){
				ws.send(myform.sayinput.value);  
			}
		</script>
	</head>
    <body>
        <h1>WebSocket</h1>
        <div id='chatroom' style='width:400px;height:300px;overflow:auto;border:1px solid blue'></div>
		<form name="myform">
			<input type='text' name='sayinput'/>
			<input type='button' value='say' onclick='say()'/>
		</form>
    </body>

</html>
```

socket.io

socket.io包含websocket
安装socket.io
G:\www\nodejs\socket>npm install "socket.io" --save-dev

2. 安装Express

G:\www\nodejs\socket>npm install express --save-dev

3. 创建服务端SocketIoServer.js

```javascript

var app = require('express')();
var http = require('http'). Server(app);
var io = require('socket.io')(http);
var  fs=  require('fs');

app.get('/', function(req, res){

    function recall(data){    
            res.send(data.toString());    
        }    
        fs.readFile('./socketIoClient.html', function(err,  data)  {    
            if  (err)  {    
              console.log("bbbbb:"+err);    
              recall('文件不存在');    
            }else{    
              //console.log(data.toString());    
              recall(data);    
            }    
        });    
    //res.send('<h1>Welcome Realtime Server</h1>');    

});

app.get('/socketio/jquery-2.1.0.min.js', function(req, res){

    function recall(data){    
            res.send(data.toString());    
        }    
        fs.readFile('./socketio/jquery-2.1.0.min.js', function(err,  data)  {    
            if  (err)  {    
              console.log("bbbbb:"+err);    
              recall('文件不存在');    
            }else{    
              //console.log(data.toString());    
              recall(data);    
            }    
        });    

});
app.get('/socketio/socket.io.js', function(req, res){

    function recall(data){    
            res.send(data.toString());    
        }    
        fs.readFile('./socketio/socket.io.js', function(err,  data)  {    
            if  (err)  {    
              console.log("bbbbb:"+err);    
              recall('文件不存在');    
            }else{    
              //console.log(data.toString());    
              recall(data);    
            }    
        });    

});

//在线用户
var onlineUsers = {};
//当前在线人数
var onlineCount = 0;

io.on('connection', function(socket){

    console.log('有人连上来了');
	//监听新用户加入  
    //socket.on('login', function(obj){ 
	socket.name=++ii;
	onlineUsers[socket.name]=socket;
        
    //监听用户退出    
    socket.on('disconnect', function(){    
         console.log('有人退出'); 
	 delete onlineUsers[socket.name];  
    });    
        
    //监听用户发布聊天内容    
    socket.on('message', function(obj){    
        //向所有客户端广播发布的消息
        console.log(obj.username+'说：'+obj.content);
	sayall(msg,socket);
    });    

});
function sayall(msg, socket){

	for(var key in onlineUsers){
		if(onlineUsers[key]!=socket){
			onlineUsers[key].send(msg);
		}
	}

}

http.listen(9000, function(){

    console.log('listening on *:9000');    

});

socket.io客户端
创建客户端socketIoClient.html
<html>  
<head>  
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />  

    <!-- <script src="./js/jquery-1.3.1.min.js"></script> -->  
    <script src="/js/socket.io.js"></script>
	<script>
		var iosocket = null;
		window.onload=function(){
			 iosocket = io.connect('http://localhost:9000/'); 
			 iosocket.on('connect', function () { 
				 alert('连接成功');
				 iosocket.send('hello,我是ioclient');
			 });
			 iosocket.on('message', function(message) {  
                    //alert('服务端传来:'+message);
					var chatroom = document.getElementById('chatroom');
					chatroom.innerHTML += message+'<br/>';
             });  
			 iosocket.on('disconnect', function() {  
                    alert('服务端关闭');  
             });  
		}
		function say(){
				iosocket.send(myform.sayinput.value);  
			}
	</script>

</head>
<body>

	<div id='chatroom' style='width:400px;height:300px;overflow:auto;border:1px solid blue'></div>
		<form name="myform">
			<input type='text' name='sayinput'/>
			<input type='button' value='say' onclick='say()'/>
		</form>

</body>
</html>

![](http://pvt7l4h05.bkt.clouddn.com/2019-09-03-Pasted%20Graphic%2027.tiff)
```
