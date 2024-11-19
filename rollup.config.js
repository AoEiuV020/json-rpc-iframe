import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

const isProduction = process.env.NODE_ENV === 'production';

export default {
  input: 'src/index.ts', // 入口文件
  output: {
    file: 'dist/json-rpc-iframe.js', // 输出文件路径
    name: 'JsonRpcIframe',
    format: "umd",
    esModule: false,
    exports: "named",
    sourcemap: isProduction,
  },
  plugins: [
    resolve(), // 解析依赖
    typescript(), // 编译 TypeScript
    isProduction && terser(), // 仅生产环境启用压缩
  ],
};
