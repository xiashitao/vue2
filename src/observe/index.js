import Dep from "./dep";

class Observer {
    constructor(data) {
        Object.defineProperty(data, '__ob__', {
            value: this,
            enumerable: false // 将__ob__ 变成不可枚举的值
        })
        if (Array.isArray(data)) {
            // 这里我们可以重写数组中的方法
            data.__proto__ = {
                push() {
                    console.log("重写的push")
                }
            }
            this.observeArray(data)
        } else {
            // object.defineProperty只能劫持已经存在的属性，后增的，删除的（vue2中会为此单独写一些api）
            this.walk(data);
        }
    }

    walk(data) { // 循环对象 对属性依次劫持
        // 重新定义属性
        Object.keys(data).forEach(key => defineReactive(data, key, data[key]))

    }

    observeArray(data) {
        data.forEach(item => observe(item))
    }
}

export function defineReactive(target, key, value) {
    observe(value)
    let dep = new Dep(); // 每一个属性都有一个dep
    Object.defineProperty(target, key, {
        get() {
            if (Dep.target) {
                dep.depend(); // 让这个属性的收集器记住这个过程
            }
            // 取值的时候会
            return value;
        },
        set(newValue) {
            if (newValue === value) return;
            observe(newValue);
            value = newValue;
            dep.notify(); // 通知更新
        }
    })
}

export function observe(data) {
    // 对这个对象进行劫持
    if (typeof data !== 'object' || data === null) {
        return; // 只对对象进行劫持，
    }

    if (data.__ob__ instanceof Observer) {
        return data.__ob__
    }
    // 如果一个对象已经被劫持了，那就不需要再被劫持了，（要判断一个对象是否被劫持，可以增添一个实例，用实例来判断是否被劫持）
    return new Observer(data);
}