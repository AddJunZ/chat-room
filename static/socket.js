let username = document.querySelector('#username').innerText;
var socket = io('http://localhost:8080');
// console.log(socket);
//前后端，一次连接一个socketId
socket.on('connect', () => {
    //默认的连接事件
    console.log('连接到服务器');

    //连接后触发更新代码
    socket.emit('login', {
        username: username
    });
})
// socket.on('disconnect',()=>{
//     //默认的断开连接事件，这里用了关闭服务器测试可以触发的，但关掉浏览器不触发？？
//     console.log('断开链接');
//     socket.emit('exit',{
//         username:username
//     })
// })
//有人登录，同步在线人数，data应该传的是在线的用户数据数组
socket.on('online', data => {
    //同步在线人数
    document.getElementById('active-num').innerText = Object.keys(data).length;
})

