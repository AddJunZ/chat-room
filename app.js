const Koa = require('koa');
const server = new Koa();
const Router = require('koa-router');
const router = new Router();
const IO = require('koa-socket');//实现对websocket的对接的
const io = new IO();
const render = require('koa-ejs');//模板
const path = require('path');//为了写模板的路径引入的
const body = require('koa-better-body');
const session = require('koa-session');//挂session


let {store} = require('./js/store.js');


server.keys = ['AddJunZ'];

//上传文件的制定路径
server.use(body({
    uploadDir:'./static/upload'
}))

const CONFIG = {
    key:'AddJunZ',
    maxAge:1800000
}
//使用session，配置为null
server.use(session(CONFIG,server));


//这样一挂后，路由里都能使用了？
render(server,{
    root:path.join(__dirname,'views'),
    layout:false,
    viewExt:'ejs',
    cache:false,
    debug:false
})



router.use('', require('./routes/index.js'))
server.use(router.routes())
server.use(router.allowedMethods())


//socket
io.attach(server);
//附着之后可以使用server.io来访问socket
//如果没有的话，则浏览器向服务器方向的连接就不成立


io.use(async (ctx, next) => {
    let start = new Date()
    await next()
    console.log(`response time: ${new Date() - start}ms`)
})


//在这里监听html触发的事件
//登录后就跳到聊天界面
server.io.on('login',(ctx,data)=>{
    console.log('login',data);
    // console.log('目前的session',ctx.session)    不是登陆的是没有的//???
    let username = data.username;
    let socketId = ctx.socket.socket.id;
    console.log(socketId);//每次登录都有一个特定的socketid
    store.set(username,socketId);
    //通知所有登录者
    console.log(store);
    io.broadcast("online", store.state);
})


server.listen(8080, () => {
    console.log('监听8080-----------');
})