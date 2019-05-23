const Koa = require('koa');
const server = new Koa();
const Router = require('koa-router');
const router = new Router();
const IO = require('koa-socket');
const io = new IO();

router.use('', require('./routes/index.js'))
server.use(router.routes())




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
// server.io.on('login',ctx=>{
    // console.log('login');
    //路由的ctx才有跳转
    // ctx.redirect('/chat');
// })



//attach后都不能再用这种方式了吗
// io.on('join', (ctx, data) => {
//     console.log('join event fired', data);
// })


server.listen(8080, () => {
    console.log('监听8080');
})