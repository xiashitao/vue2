const LIFE_CYCLE = [
    'beforeCreated',
    "created"
]
const strats = {};

LIFE_CYCLE.forEach(hook => {
    strats[hook] = function (p, c) {
        if (c) {
            if (p) {
                return p.concot(c)
            } else {
                return [c]
            }
        } else {
            return p
        }
    }

})

export function mergeOptions(parent, child) {
    const options = {};

    function mergeField(key) {
        // 策略模式, 用策略模式减少if else
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            // 如果不在策略中，则以child为准
            options[key] = child[key] || parent[key];
        }
    }

    for (let key in parent) {
        mergeField(key)
    }

    for (let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    return options;
}