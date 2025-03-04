import Watcher from "./observe/watcher";
import { createElementVNode, createTextVNode } from "./vDom"

function patchProps(el, props) {
    for (let key in props) {

        if (key === 'style') { // style{color: 'red'}
            for (let styleName in props.style) {
                el.style[styleName] = props.style[styleName]
            }
        }
        el.setAttribute(key, props[key])
    }
}

function createElm(vnode) {
    const { tag, data, children, text } = vnode;
    if (typeof tag === 'string') { // 标签
        // 将真实节点和虚拟节点对应起来
        // 后续如果修改属性了
        vnode.el = document.createElement(tag)
        patchProps()
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    } else {
        vnode.el = document.createTextVNode(text)
    }
    return vnode.el;
}

function patch(oldVNode, vnode) {
    // 写的是初渲染流程
    const isRealElement = oldVNode.nodeType;
    if (isRealElement) {
        const elm = oldVNode; // 获取真实元素
        const parentElm = elm.parentNode; // 拿到父元素
        let newEle = createElm(parentElm);
        console.log('newEle', newEle)
        parentElm.insertBefore(newEle, elm.nextSibling)
        parentElm.removeChild(elm);

        return newEle;
    } else {
        // diff算法
    }
}

export function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this;
        const el = vm.$el;

        console.log('update', vnode)
        // patch 既有初始化的功能，也有更新的功能
        vm.$el = patch(el, vnode)
    }

    Vue.prototype._c = function () {
        return createElementVNode(this, ...arguments)
    }

    Vue.prototype._v = function () {
        return createTextVNode(this, ...arguments)
    }

    Vue.prototype._s = function (value) {
        if (typeof value !== 'object') return;
        return JSON.stringify(value)
    }

    Vue.prototype._render = function () {
        // console.log('render')
        // 当渲染的时候会去实例中取值，我们就可以将属性和视图绑定在一起
        const vm = this;
        // 让with中的this 指向 vm
        return vm.$options.render.call(vm); // 通过ast语法转译后生成的render方法
    }
}

export function mountComponent(vm, el) {
    // 1. 调用render方法 产出虚拟DOM
    vm.$el = el;

    const updateComponent = () => {
        vm._update(vm._render()); // vm.$options.render() 虚拟节点
    }
    const watcher = new Watcher(vm, updateComponent, true) // 用true标识这是一个渲染watcher
    console.log('watcher', watcher);
    // 2. 根据虚拟DOM产生真实DOM
    // 3. 插入到el中
}

// vue 核心流程
/* 
    1. 创建了响应式数据
    2. 模版转化成了ast语法树
    3. 将ast语法树转换成render函数
    4. 后续每次数据更新，只执行render函数，无需再次执行ast执行的过程

    render 函数会产生虚拟节点（使用响应式数据），根据生成的虚拟节点，创造真实DOM
*/

export function callHook(vm, hook) {
    const handlers = vm.$options[hook];
    if (handlers) {
        handlers.forEach(handler => {
            handler.call(vm);
        })
    }
}