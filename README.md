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