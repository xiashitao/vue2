// rollup 默认导出一个对象，作为打包的配置文件
import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve'
export default {
    input: './src/index.js', // 入口文件
    output: {
        file: './dist/vue.js', // 出口文件
        // new Vue
        name: 'Vue',
        format: "umd", // esm es6模块，commonjs 模块，iief自执行函数 umd(commonjs amd)
        sourcemap: true, // 希望可以调试源代码
    },
    plugins: [
        babel({
            exclude: "node_modules/**", // 排除node_modules 所有文件
        }),
        resolve()
    ]
}