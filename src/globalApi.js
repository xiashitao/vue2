// 静态属性

import { mergeOptions } from "./utils";

export function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.minin = function (mixin) {
        // 我们希望将用户的mixin和全局的options进行合并
        this.options = mergeOptions(this.options, mixin);
        return this;
    }
}
