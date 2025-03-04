let id = 0;


// 每个属性有一个dep，属性就是被观察者，watcher就是观察者，属性变化就会通知观察者来更新
class Watcher {
    constructor(vm, fn) {
        this.id = id++;
        this.renderWatcher = options;// 是一个渲染watcher
        this.getter = fn; // getter 意味着调用这个函数可以发生取值操作
        this.deps = [];// 后续我们实现计算属性，和一些清理工作需要用到
        this.depsId = new Set();
        this.get();
    }

    get() {
        Dep.target = this;
        this.getter(); // 会去vm上取值
        Dep.target = null;
    }

    addDep(dep) { // 一个组件对应多个属性，重复的属性也不用记录
        let id = dep.id;
        if (!this.depsId.has(id)) {
            this.deps.push(dep);
            this.depsId.add(id);
            dep.addSub(this)
        }
    }

    update() {
        queueWatcher(this); // 把当前的watcher暂存起来
        // this.get();
    }

    run() {
        this.get()
    }
}

let queue = [];
let has = {};
let pending = false;

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    has = {};
    queue = [];
    pedding = false;
    flushQueue.forEach(queue => {
        queue.run()
    })
}

function queueWatcher(watcher) {
    const { id } = watcher;
    if (!has[id]) {
        queue.push(watcher)
        has[id] = true;
        // 不管update 走多少次，但是最终只执行一轮刷新操作

        if (!pending) {
            nextTick(flushSchedulerQueue, 0)
            pending = true;
        }
    }
}

let callbacks = [];
let waiting = false;

function flushCallbacks() {
    let cbs = callbacks.slice(0)
    waiting = true;
    callbacks = []
    cbs.forEach(cb => cb()) // 按照顺序依次执行
}

let timerFunc;

if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    let observer = new MutationObserver(flushCallbacks); // 这里传入的回调是异步执行
    let textNode = document.createTextNode(1);
    observer.observe(textNode, {
        characterData: true
    })
    timerFunc = () => {
        textNode.textContent = 2;
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    timerFunc = () => {
        setTimeout(flushCallbacks)
    }
}
export function nextTick(cb) {
    callbacks.push(cb);
    if (!waiting) {
        timerFunc()
        waiting = true
    }
}

export default Watcher;