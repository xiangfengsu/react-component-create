### 基于[umi-libary](http://https://github.com/umijs/umi/tree/master/packages/umi-library "umi-libary") 实现类似ant-design 组件开发脚手架

- 开发 yarn start 
（注意:如想实现类似antd的class 模式,需在*.mdx文件中引入`import './style/index.js';`）
- 打包 先执行 **yarn build ** 执行完成后，在执行 **yarn build:style** (备注：因为打包是基于umi-lib ，样式的编译是基于gulp，依赖前面的生产的文件)
- 说明一下 如想本地测试 yarn link  对应目录 yarn link "lib-nam" 会出现样式不起作用，猜测因为umi-lib 基于module 加载css ，把对应的class name 加了module 后缀 如 .test_AFS 形式 ，如想生效，需要发布项目 npm publish 进行测试 (后面会优化)
- 可以使用[ babel-plugin-import](https://github.com/ant-design/babel-plugin-import " babel-plugin-import") 按需加载组件,使用方式和antd 一样
  ```javascript
["import", { libraryName: "my-test-com",style:true},"my-test-com"]
```
