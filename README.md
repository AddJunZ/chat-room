# P2P-net(计网课设)
### 开启服务
```js
//安装依赖包
npm install

//启动服务
npm start
```

### 笔记
敬请期待:smirk:


#### socket传值的时候一定要传一个对象不能传多个参数吗
```js
//正确
socket.emit('toPersonMsg',{
    value:value,
    msg:msg
})
//错误??
scoket.emit('toPersonMsg',value,msg)
```

### ctx.socket和server.io的针对于emit的区别？
```js

```

<!-- 需要对文件进行重命名？创建读写流？顺便改个后缀名？？ -->
```js
接收到文件之后，我们需要把文件保存到目录中，返回一个 url 给前端。在 node 中的流程为

创建可读流 const reader = fs.createReadStream(file.path)

创建可写流 const writer = fs.createWriteStream('upload/newpath.txt')

可读流通过管道写入可写流 reader.pipe(writer)



```

### koa-send是文件下载中间件
```js
//跟ctx.attachment的关系?
```