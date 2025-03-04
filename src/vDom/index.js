export function createElementVNode(vm, tag, data = {}, ...children) {
    if (data == null) {
        data = {};
    }
    let key = data.key;
    if (key) {
        delete data.key;
    }
    return vNode(vm, tag, key, data, children)
}

// v
export function createTextVNode(vm, text) {
    return vNode(vm, undefined, undefined, undefined, undefined, text)
}

function vNode(vm, tag, key, data, children, text) {
    return {
        vm,
        tag,
        key,
        data,
        children,
        text
    }
}