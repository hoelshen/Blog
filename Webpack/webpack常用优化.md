webpack 打包优化
1. 优化resolve.extensions配置
1.配置时尽可能减小后嘴尝试列表，不要把项目中不可能存在的情况写到列表中
2.频率最高的文件后嘴要优先放在最前面，以做到最快推出
3.在源码中写导入语句时，要尽可能的带上后缀，从而可以避免寻找过程。例如在你确定的情况下把 require('./data') 写成 require('./data.json') 

2.优化 resolve.modules 配置
resolve.modules 用于配置 Webpack 去哪些目录下寻找第三方模块。

resolve.modules 的默认值是 ['node_modules']，会采用向上递归搜索的方式查找

3.优化resolve.alias配置

resolve.alias 配置项通过别名来把原导入路径映射成一个新的导入路径。

4.缩小文件匹配范围

Include：需要处理的文件的位置

Exclude：排除掉不需要处理的文件的位置

二、设置noParse
防止 webpack 解析那些任何与给定正则表达式相匹配的文件。忽略的文件中不应该含有 import, require, define 的调用，或任何其他导入机制。忽略大型的 library 可以提高构建性能。比如jquery、elementUi

三、给babel-loader设置缓存
babel-loader 提供了 cacheDirectory特定选项（默认 false）：设置时，给定的目录将用于缓存加载器的结果。

HappyPack的基本原理：在webpack构建过程中，我们需要使用Loader对js，css，图片，字体等文件做转换操作，并且转换的文件数据量也是非常大的，且这些转换操作不能并发处理文件，而是需要一个个文件进行处理，HappyPack的基本原理是将这部分任务分解到多个子进程中去并行处理，子进程处理完成后把结果发送到主进程中，从而减少总的构建时间。