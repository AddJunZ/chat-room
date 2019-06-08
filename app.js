const Koa = require('koa');
const server = new Koa();
const Router = require('koa-router');
const router = new Router();
const IO = require('koa-socket');//实现对websocket的对接的
const io = new IO();
const render = require('koa-ejs');//模板
const path = require('path');//为了写模板的路径引入的
const body = require('koa-better-body');
const session = require('koa-session');//挂session，貌似这个例子不需要session其实
const static = require('koa-static')
const IncomingForm = require('formidable');//用来保存后缀的
const form = new IncomingForm();
const fs = require('fs')

form.keepExtensions = true
form.encoding = 'utf-8'
form.uploadDir = path.join(__dirname, 'static/upload')


//上传文件的制定路径
server.use(body({
    uploadDir: './static/upload',
    IncomingForm: form
}))



let { store } = require('./js/store.js');


server.keys = ['AddJunZ'];


const CONFIG = {
    key: 'AddJunZ',
    maxAge: 1800000
}
//使用session，配置项为CONFIG
server.use(session(CONFIG, server));


//这样一挂后，路由里都能使用了？
render(server, {
    root: path.join(__dirname, 'views'),
    layout: false,
    viewExt: 'ejs',
    cache: false,
    debug: false
})



router.use('', require('./routes/index.js'))
server.use(router.routes())
server.use(router.allowedMethods())
server.use(static('./static'))

//socket
io.attach(server);
//附着之后可以使用server.io来访问socket
//如果没有的话，则浏览器向服务器方向的连接就不成立


io.use(async (ctx, next) => {
    let start = new Date()
    await next()
    console.log(`response time: ${new Date() - start}ms`)
})


//-------------------------------------------------------
//-------------------------------------------------------

//在这里监听html触发的事件
//登录后就跳到聊天界面
server.io.on('connection', ctx => {
    console.log('连接到客户端')
})
server.io.on('login', (ctx, data) => {
    console.log('login', data);
    // console.log('目前的session',ctx.session)    不是登陆的是没有的//???
    let username = data.username;
    let socketId = ctx.socket.socket.id;
    console.log(socketId);//每次登录都有一个特定的socketid
    store.set(username, socketId);
    //通知所有登录者
    console.log(store.state);
    io.broadcast("online", store.state);


    //用户退出登录应该是socket断开连接
    //不能用server.io.on?它会断开所有的server连接？？一个用户退出全部退出??ctx.socket针对某一用户的访问？
    // server.io.on('disconnect',()=>{
    ctx.socket.on('disconnect', () => {
        //通过socketId寻找对应的用户名findUserBySocketId
        store.delete(findUserBySocketId(socketId));
        io.broadcast("online", store.state)
    })
})

//
server.io.on('toPersonMsg', (ctx, data) => {
    console.log(data);
    // { value: '/#sydq_8zlgu2fIMKIAAAB', msg: '12313' }
    //app._io.to(toId).emit("allMsg", `${username} say to you: ${content}`);
    let { socketId, msg } = data;
    let ownSocketId = ctx.socket.socket.id;
    let ownName = findUserBySocketId(ownSocketId);
    let name = findUserBySocketId(socketId);

    ctx.socket.emit('personMsg', `you say to ${name}: ${msg}`);
    //这里需要切换到被发消息的那个人的socketId，然后执行emit命令，先不跳试试
    server._io.to(socketId).emit("personMsg", `${ownName} say to you: ${msg}`);

})


//给所有人的回话
server.io.on('toAllMsg', (ctx, data) => {
    let ownSocketId = ctx.socket.socket.id;
    let ownName = findUserBySocketId(ownSocketId);
    let msg = data.msg;
    server.io.broadcast('allMsg', `${ownName}对所有人说: ${msg}`);
})

server.io.on('toPersonFile', (ctx, data) => {
    console.log('触发文件上传到用户的服务');
    let { socketId, fileName } = data;
    console.log(`'服务器拿到文件对象了,要传给${socketId}，要处理的文件名是${fileName}`);
    let dlFilePath = `http://localhost:8080/downloadFile/${fileName}`;
    server._io.to(socketId).emit('personFile',dlFilePath)//下载的路径
})



//通过socketId寻找对应的用户名findUserBySocketId
var findUserBySocketId = socketId => {
    for (key in store.state) {
        if (store.state[key] == socketId) {
            return key;
        }
    }
}
server.io.on('exit', (ctx, data) => {
    let username = data.username;
    store.delete(username);
    console.log(store.state)
    io.broadcast("online", store.state);
})





//-------------------------------------------------------
//-------------------------------------------------------


server.listen(8080, () => {
    console.log('监听8080-----------');
})