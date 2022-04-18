/*
 * @Author: chengsl
 * @Date: 2022-01-06 09:29:40
 * @LastEditors: chengsl
 * @LastEditTime: 2022-01-25 15:14:21
 * @Description: file content
 */
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2019
  },
  globals: {
    axios: true,
    Vue: true
  },
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'vue/v-model-argument': 'off',
    'vue/valid-v-model': 'off',
    'no-useless-escape': 0
  }
}
