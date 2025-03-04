const ncname = '[a-zA-Z_][\\-\\.0-9_a-zA-Z]*';
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp('^<' + qnameCapture); // 匹配到的分组是一个标签名
const endTag = new RegExp('^<\\/' + qnameCapture + '[^>]*>'); // 匹配了是</xxx>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>\/]+)))?/; // 匹配属性
// 对于属性来说，第一个分组就是属性的key value 就是
const startTagClose = /^\s*(\/?)>/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // 匹配到的内容就是我们表达式的变量

// vue3 采用的不是正则
// 对模版进行编译处理
export function parseHTML(html) { // html 最开始是<
    const ELEMENT_TYPE = 1;
    const TEXT_TYPE = 3;
    const stack = []; // 用于存放元素
    let currentParent; // 永远指向栈中最后一个
    let root;

    // 最终要转化成一棵抽象语法树
    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    // 利用栈构建一颗树
    function start(tag, attrs) {
        let node = createASTElement(tag, attrs); // 创造一个ast节点
        if (!root) {
            // 如果为空，则当前是树的根节点
            root = node;
        }
        stack.push(node);
        // currentParent 为栈的最后一个
        currentParent = node;
    }
    function end(tag) {
        stack.pop();
        if (currentParent) {
            node.parent = currentParent; // 只赋予了parent属性
            currentParent.children.push(node)
        }
        currentParent = stack[stack.length - 1];
    }
    function chars(text) {
        // 文本直接放到当前指向的节点
        currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }
    function advance(n) {
        html = html.substring(n)
    }
    function parseStartTag() {
        const start = html.match(startTagClose);
        if (start) {
            const match = {
                tagName: start[1], // 标签名
                attrs: []
            }
            advance(start[0].length);
            console.log('start', start, match, html)
            // 如果不是开始标签的结束 就一直匹配下去
            let attr, end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                advance(attr[0].length);
                match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] || true })
            }
            if (end) {
                advance(end[0].length)
            }
            return match;
        }
        // console.log(html);
        return false; // 不是开始标签
    }
    while (html) {
        // 如果 indexOf('<') 是 0, 则说明是个标签
        let textEnd = html.indexOf('<')
        // 如果textEnd 为0 说明是一个开始标签或者结束标签
        if (textEnd === 0) {
            const startTagMatch = parseStartTag(); // 开始标签的匹配
            if (startTagMatch) {
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag);
            if (endTagMatch) {
                end(endTagMatch[1])
                advance(endTagMatch[0].length);
                continue;
            }
        }

        if (textEnd > 0) {
            let text = html.substring(0, textEnd); // 文本内容
            if (text) {
                chars(text)
                advance(text.length);
                console.log(html);
            }
        }
    }

    return root;
}