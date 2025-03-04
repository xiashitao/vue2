// 我们希望重写数组中的部分方法

let oldArrayProto = Array.prototype; // 获取数组的原型

export let newArrayProto = Object.create(oldArrayProto)

let methods = [
    // 找到所有的变异方法，
    'push',
    'pop',
    'shift',
    'unshift',
    "reverse",
    'sort',
    'splice'
]

methods.forEach(method => {
    newArrayProto[method] = function (...args) {
        const res = oldArrayProto[method].call(this, ...args)

        let inserted;

        let ob = this.__ob__;

        switch (method) {
            case "push":
            case "unshift":
                inserted = args;
                break;
            case "splice": // arr.splice()
                inserted = args.slice(2);

            default:
                break;
        }

        if (inserted) {
            ob.observeArray(inserted)
        }
        return res;
    }
})