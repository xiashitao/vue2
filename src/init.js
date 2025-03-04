import { compileToFunction } from "./compiler/index.js";
import { callHook, mount } from "./lifecycle.js";
import { initState } from "./state";
import { mergeOptions } from "./utils.js";


export function initMixIn(Vue) {
    Vue.prototype._init = function (options) { // 用于初始化操作
        // vm获取用户的配置
        // 我们使用vue的时候，
        const vm = this;
        // 将用户的选项挂在到实例上 
        vm.$options = mergeOptions(this.constructor.options, options);

        callHook(vm, 'beforeCreated');

        // 初始化状态
        console.log('init')
        initState(vm);

        callHook(vm, 'created')
        // ... 
        if (options.el) {
            vm.$mount(options.el); // 实现数据的挂载
        }
    }

    Vue.prototype.$mount = function (el) {
        const vm = this;
        el = document.querySelector(el);
        let opts = vm.$options;
        if (!opts.render) { // 先进行查找有没有render函数
            let template; // 没有render，看一下是否写了template， 没写template采用外部的template
            if (!opts.template && el) { // 没有写模版，但是写了el
                template = el.outerHTML;
            } else {
                if (el) {
                    template = opts.template; // 如果有el，则采用模版的内容
                }
            }
            // 写了tempalte就用写的template
            console.log('template1', template)
            if (template) {
                // 这里需要对模版进行编译
                const render = compileToFunction(template);
                opts.render = render; // jsx 最终会编译成h("xxx")
            }
        }

        mount(vm, el); // 组件的挂载
        // opts.render; // 最终就可以获取render方法
    }
}
