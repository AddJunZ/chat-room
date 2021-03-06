const Router = require('koa-router');
const send = require('koa-send');//下载文件
const router = new Router();
const path = require('path')
const fs = require('fs')

//所有路由前缀
// router.prefix('/login');

router.get('/', async ctx => {
    // ctx.type = 'html',
    // ctx.body = fs.createReadStream('views/login.html')
    await ctx.render('login');//使用模板后
})

//get 和 post都可能用all，但是单独一个就要和表单的请求方式一致
router.all('/choose', async ctx => {
    // console.log('按道理请求的数据会在这里？',ctx.request.fields);//undefined???
    let { username } = ctx.request.fields;//需要账号,不需要密码现在

    //要存session了，方便以后获取总在线人数？
    ctx.session[username] = username;//不用的人村一个session，那么，怎么遍历获取session的总数呢？
    //就算服务关掉重启session也还在的，此时需要监听socket断开，删除对应session
    console.log('-----------------------------------')
    console.log('session实际上就是存在服务端，为所有连接着共享的储存空间？？？', ctx.session);
    await ctx.render('choose', {
        username
    });
})

//做接口用？
router.all('/postFile', async ctx => {
    ctx.body = '上传成功';
    console.log('我的文件呢', ctx.request.fields);//这里会又一个文件的路径信息
    var file = ctx.request.fields.f1[0];
    //我直接把路径加到全局里？ctx.fileName = ???
    var aimPath = 'upload' + file.path.split('upload')[2];
    console.log(aimPath);
    console.log('文件名' + file.name);
    //-----重命名时需要看文件里是否有重复的名字，有就要做对应修改(两个都要写绝对路径啊亲！！！)
    fs.rename(path.join(__dirname, '../static/upload', aimPath), path.join(__dirname, '../static/upload', file.name));
    // 只是作为处理文件上传的部分，要处理文件命名的问题，不处理后期操作，后期操作交给app.js里的server.io去实现
})


router.all('/downloadFile/:name', async ctx => {
    const name = ctx.params.name;
    const dlPath = `static/upload/${name}`;
    ctx.attachment(dlPath);
    await send(ctx, dlPath);
})

// router.all('/chat',async ctx=>{
//     ctx.type = 'html',
//     ctx.body = fs.createReadStream('views/chat.html')
// })

module.exports = router.routes();