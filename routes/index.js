const Router = require('koa-router');
const router = new Router();
const fs = require('fs')


//所有路由前缀
// router.prefix('/login');

router.get('/',async ctx=>{
    ctx.type = 'html',
    ctx.body = fs.createReadStream('views/login.html')
})



//get 和 post都可能用all，但是单独一个就要和表单的请求方式一致
router.post('/choose',async ctx=>{
    ctx.type = 'html',
    ctx.body = fs.createReadStream('views/choose.html')
})

// router.all('/chat',async ctx=>{
//     ctx.type = 'html',
//     ctx.body = fs.createReadStream('views/chat.html')
// })

module.exports = router.routes();