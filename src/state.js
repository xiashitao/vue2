import { observer } from "./observe/index";

export function initState(vm) {
    const opts = vm.$options;
    if (opts.data) {
        initData(vm);
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[target][key]
        },
        set(newValue) {
            vm[target][key] = newValue;
        }
    })
}

function initData(vm) {
    let data = vm.$options.data;
    data = typeof data === 'function' ? data.call(this) : data;
    // 对数据进行劫持
    vm._data = data;
    observer(data)
    // console.log(data)
    // 将vm._data 用vm来代理就可以了
    for (let key in data) {
        proxy(vm, '_data', key)
    }
}