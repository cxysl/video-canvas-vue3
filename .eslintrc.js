/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-10-31 09:59:16
 * @Description: Eslint 配置, 本配置针仅对个人编码喜好, 支持的技术栈为: vue3 + element-plus + vue/cli + js + scss
 * @40@remarks: vue3框架, 装几个eslint的资源时注意版本, 低版本不兼容;
 *  我装的相关的 eslint 插件以及其版本如下:
    "eslint": "^8.14.0",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.0.0",
    "eslint-plugin-vue": "^8.7.1",
    "@vue/cli-plugin-eslint": "^5.0.8",
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-recommended', 'plugin:vue/recommended', 'prettier'],
  parserOptions: {
		ecmaVersion: 2020,
		ecmaFeatures: {
			jsx: true
		}
  },
  globals: {
    axios: true,
    Vue: true
  },
  rules: {
		// "no-var": "error", // 要求使用 let 或 const 而不是 var
		"no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
		"no-use-before-define": "off", // 禁止在 函数/类/变量 定义之前使用它们
    'vue/multi-word-component-names': "off",
    'no-console': 'off',
		"vue/no-v-model-argument": "off",
    'no-unused-vars': 'error',
    'vue/script-setup-uses-vars': 'error', // 防止<script setup>使用的变量<template>被标记为未使用，此规则仅在启用该no-unused-vars规则时有效。
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/v-model-argument': 'off',
    'no-useless-escape': 0,
    'vue/valid-v-model': 'off',
		'vue/no-v-html':'off' // 允许 v-html 指令，项目中有需要
  }
}
// @see: http://eslint.cn
