// //session主要是用来保持用户状态的，而需求是要知道在线人数，利用自定义的session储存空间，来主动的操作session
// //这里好像只需要一个存用户的文件就行了，不用session好像也行？
// let store = [
//     // {
//     //     name:username,
//     //     socketId:socketId
//     // }
// ];
// store.__proto__ = {
//     get(userSocketId) {
//         //根据唯一的socketId获取用户
//         return store.filter((x) => x.socketId == userSocketId);
//     },
//     add(user) {
//         // store.push(user);   push方法不存在了？

//         //如果同一个用户刷新浏览器，会处理成多个用户,在这里做一下处理


//         [].push.call(store,user);
//     },
//     remove(userSocketId) {
//         store.filter((x) => x.socketId != userSocketId)
//     },
// }
// module.exports = store;


module.exports = {
    store:{
        state:{},
        get(name){
            return this.state[name]
        },
        set(name,socketId){
            this.state[name] = socketId
        },
        delete(name){
            delete this.state[name]
        }
    }
}