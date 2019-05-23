const Router = require('koa-router');
const router = new Router();
// const fs = require('fs')


//所有路由前缀
// router.prefix('/login');

router.get('/',async ctx=>{
    // ctx.type = 'html',
    // ctx.body = fs.createReadStream('views/login.html')
    await ctx.render('login');//使用模板后
})


//get 和 post都可能用all，但是单独一个就要和表单的请求方式一致
router.post('/choose',async ctx=>{
    // console.log('按道理请求的数据会在这里？',ctx.request.fields);//undefined???
    let {username} = ctx.request.fields;//需要账号不需要密码现在

    //要存session了，方便以后获取总在线人数？
    ctx.session[username] = username;//不用的人村一个session，那么，怎么遍历获取session的总数呢？
    //就算服务关掉重启session也还在的，此时需要监听socket断开，删除对应session



    console.log('session实际上就是存在服务端，为所有连接着共享的储存空间？？？',ctx.session);
    //????
    //按道理，第二个登录着不应该session有两项了吗



    
    // ctx.type = 'html',
    // ctx.body = fs.createReadStream('views/choose.html')
    await ctx.render('choose',{
        username
    });
})



// router.all('/chat',async ctx=>{
//     ctx.type = 'html',
//     ctx.body = fs.createReadStream('views/chat.html')
// })

module.exports = router.routes();