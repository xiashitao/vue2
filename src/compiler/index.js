import { parseHTML } from "./parse"

function genProps(attrs) {
    let str = '';
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i];
        if (attr.name === 'style') {
            // style: { color: 'red'}
            let obj = {};
            attr.value.split(";").forEach(item => {
                let [key, value] = item.split(':');
                obj[key] = value;
            })
            attr.value = obj;
        }
        str += `${attr.name}: ${JSON.stringify(attr.value)},`
    }

    return `{${str.slice(0, -1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配到的内容就是我们表达式的变量

function genChild(node) {
    if (node.type === 1) {
        return codeGen(node)
    }
    let text = node.text;
    if (!defaultTagRE.test(text)) {
        return `_v(${JSON.stringify(text)})`
    } else {
        // _s(name)+"hello"+_s(name)
        let tokens = [];
        let match;
        defaultTagRE.lastIndex = 0;
        let lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
            console.log(match)
            let index = match.index;
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }

            console.log('indexindex', index);
            tokens.push(`_s(${match[1].trim()})`)

            lastIndex = index + match[0].length;
        }

        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }

        return `_v(${tokens.join('+')})`
    }
}

function genChildren(children) {
    return children.map(child => genChild(child)).join(',')
}

function codeGen(ast) {
    let children = genChildren(ast.children);
    let code = `_c('${ast.tag}', ${ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'}${ast.children.length ? `,${children}` : ''})`;

    return code;
}

export function compileToFunction(template) {
    // 1. 将template转换成 ast 语法树
    const ast = parseHTML(template)

    // 2. 生成render方法(render 方法执行后的结果就是虚拟dom)
    console.log(ast)
    // 模版引擎的实现原理就是with + new Function
    let code = codeGen(ast);
    code = `with(this){return ${code}}`
    const render = new Function(code);

    return render;
}
