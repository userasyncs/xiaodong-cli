import { defineConfig } from "rollup";
import terser from "@rollup/plugin-terser";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import json from "@rollup/plugin-json";
import nodeExternals from "rollup-plugin-node-externals";

export default defineConfig([
  {
    input: {
      index: "./src/index.ts", // 入口文件
    },
    output: {
      dir: "./dist", // 输出目录
      format: "cjs", // 输出commonjs规范的文件
    },
    plugins: [
      nodeExternals({
        devDeps: false, // 不将开发依赖打包进来
      }),
      nodeResolve(),
      commonjs(),
      typescript(),
      json(),
      terser(),
    ],
  },
]);
