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