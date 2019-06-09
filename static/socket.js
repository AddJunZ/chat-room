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
    //显示可聊天人的列表
    let inHtml = '';
    for (key in data) {
        if (key != username)
            inHtml += `<option value=${data[key]}>${key}</option>`
    }
    document.getElementById('to-person').innerHTML = inHtml;
})

socket.on('personMsg', data => {
    // alert('私聊全聊只是to的socketId有没有指定的区别', data);
    document.getElementById('talk-list').innerHTML += `<li>${data}</li><br/>`;
})

socket.on('allMsg', data => {
    document.getElementById('talk-list').innerHTML += `<li>${data}</li><br/>`;
})

socket.on('personFile', data => {
    document.getElementById('talk-list').innerHTML += `${data.ownName}给你发送了文件，点击下载<a href="${data.dlFilePath}">${data.fileName}</a><br/>`;
})



socket.on('downloadFile', data => {

})


let toPerson = () => {
    let socketId = document.getElementById('to-person').value;//socketId
    let msg = document.getElementById('person-msg').value;
    if (!msg) {
        alert('请输入信息');
        return;
    }
    socket.emit('toPersonMsg', {
        socketId: socketId,
        msg: msg
    })//不是能传多个的吗
    document.getElementById('person-msg').value = '';
}
let toAll = () => {
    let msg = document.getElementById('all-msg').value;
    if (!msg) {
        alert('请输入信息');
        return;
    }
    socket.emit('toAllMsg', {
        msg: msg
    })
    document.getElementById('all-msg').value = '';
}


//给人发文件
let toPersonFile = () => {
    let socketId = document.getElementById('to-person').value;//socketId
    let formdata = new FormData();
    let file = document.querySelector('#file').files[0];
    if (!file) {
        alert('请先选择所需上传文件');
        return;
    }
    console.log(file);
    formdata.append('f1', file);
    var xhr = new XMLHttpRequest();
    xhr.open('post', 'http://localhost:8080/postFile', true);
    xhr.send(formdata);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                alert('成功')
                //同时触发server的接受文件事件？是跟post路径不同的一个东西
                //触发事件的时候，把要传的对象socketId和文件名一起传？
                socket.emit('toPersonFile', {
                    socketId: socketId,
                    fileName: file.name
                })
            } else {
                alert('失败')
            }
        }
    }
    //用户虽然是传给某一个人，但实际上是上传到服务器，然后提醒对应的用户并且让他再次从服务器上下载文件?
    //还是直接通过socket传文件？
}


