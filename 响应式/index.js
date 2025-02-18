// 订阅器模型
let Dep = {
    clientList: {}, // 容器
    // 添加订阅
    listen: function(key, fn) {
        // if(!this.clientList[key]) {
        //     this.clientList[key] = []
        // }
        (this.clientList[key] || (this.clientList[key] = [])).push(fn);
    },
    // 发布
    trigger: function () {
        let key = Array.prototype.shift.call(arguments),
        fns = this.clientList[key];
        if (!fns || fns.length === 0) {
            return false
        }
        for (let i = 0, fn;fn = fns[i++];) {
            fn.apply(this, arguments)
        }
    }
}
// 数据劫持
let dataHi = function({data, tag, datakey, selector}) {
    let value = '',
        el = document.querySelector(selector)
    Object.defineProperty(data, datakey, {
        get: function () {
            return value
        },
        set: function(val) {
            value = val
            Dep.trigger(tag, val)
        }
    })
    // 订阅
    Dep.listen(tag, function(text) {
        el.innerHTML = text
    })
}


