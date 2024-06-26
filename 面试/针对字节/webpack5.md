webpack的设计优点：

1.所有资源都是Module，所以可以用同一套代码实现诸多特性，包括：代码压缩、Hot Module Replacement、缓存；
2.打包时,资源与资源之间非常容易实现信息互换，例如可以轻易在 HTML 插入 Base64 格式的图片；
3.借助 Loader，Webpack 几乎可以用任意方式处理任意类型的资源，例如可以用 Less、Stylus、Sass 等预编译 CSS 代码。

基于 Module Federation 的微前端方案；
基于 webpack-dev-server 的 Hot Module Replacement ；
基于 Terser、Tree-shaking、SplitChunks 等工具的 JavaScript 代码压缩、优化、混淆方案；
基于 lazyCompilation 的延迟编译功能；
有利于提升应用性能的异步模块加载能力；
有利于提升构建性能的持久化缓存能力；
内置 JavaScript、JSON、二进制资源解析、生成能力；

学习目标：

1、通过各种应用场景摸清使用规律，结构化地理解各基础配置项与常见组件的用法
2、初步理解底层构建流程，学会分析性能卡点并据此做出正确性能优化
3、深入 Webpack 扩展规则，理解 Loader 与 Plugin 能做什么，怎么做
4、深挖源码，理解 Webpack 底层工作原理，加强应用与扩展能力。

![](webpack5/2022-09-06-12-22-43.png)

webpack的打包过程
输入->模块处理->后处理->输出

输入：从文件系统读入代码文件；

模块递归处理：调用 Loader 转译 Module 内容，并将结果转换为 AST，从中分析出模块依赖关系，进一步递归调用模块处理过程，直到所有依赖文件都处理完毕；

后处理：所有模块递归处理完毕后开始执行后处理，包括模块合并、注入运行时、产物优化等，最终输出 Chunk 集合；

输出： 将 Chunk 写出到外部文件系统；

从打包流程角度，webpack 配置项大体上可分为两类：
* 流程类： 作用于打包流程某个或若干个环节，直接影响编译打包效果的配置项
* 工具类： 打包主流程之外，提供更多工程化的配置项
* 
与打包流程强相关的配置项有：
	* 输入、输出
	entry：用于定义项目入口文件，Webpack 会从这些入口文件开始按图索骥找出所有项目文件；
	context：项目执行上下文路径；
	output：配置产物输出路径、名称等
	* 模块处理
	resolve：用于配置模块路径解析规则，可用于帮助 Webpack 更精确、高效地找到指定模块
	module：用于配置模块加载规则，例如针对什么类型的资源需要使用哪些 Loader 进行处理
	externals:  用于声明外部资源，Webpack 会直接忽略这部分资源，跳过这些资源的解析、打包操作
















