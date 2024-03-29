/*
 * @Author: chengsl
 * @Date: 2022-04-18 08:55:02
 * @LastEditors: chengsl
 * @LastEditTime: 2022-10-31 09:47:47
 * @Description: file content
 */
module.exports = {
  printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
  tabWidth: 2, //一个tab代表几个空格数，默认为80
  useTabs: false, //是否使用tab进行缩进，默认为false，表示用空格进行缩减
  singleQuote: true, //字符串是否使用单引号，默认为false，使用双引号
  semi: false, //行位是否使用分号，默认为true
  trailingComma: 'none', //是否使用尾逗号，有三个可选值"<none|es5|all>"
  bracketSpacing: true, //对象大括号直接是否有空格，默认为true，效果：{ foo: bar }
	// 在html中空格是否是敏感的 "css" - 遵守CSS显示属性的默认值， "strict" - 空格被认为是敏感的 ，"ignore" - 空格被认为是不敏感的
  htmlWhitespaceSensitivity: 'css',
  jsxBracketSameLine: true,
  endOfLine: 'lf', // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
  overrides: [
    {
      files: '*.js',
      options: {
        parser: 'babel'
      }
    },
    {
      files: '*.ts',
      options: {
        parser: 'babel'
      }
    },
    {
      files: '*.vue',
      options: {
        parser: 'vue'
      }
    }
  ]
}
