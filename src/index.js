import { initGlobalApi } from "./globalApi";
import { initMixIn } from "./init";
import { nextTick } from "./observe/watcher";

function Vue(options) { // options 就是用户的选项
    this._init(options)
}

Vue.prototype.$nextTick = nextTick

initMixIn(Vue)
initLifeCycle(Vue)

initGlobalApi(Vue)

export default Vue;