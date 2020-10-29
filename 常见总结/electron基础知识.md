# CLI

主要的有两个：electron-forge和electron-builder

分发等同于打包

electron-forage package 只是打包一个目录到out目录下， 一般用来调试
electron-forage make 
参数 —arch  
—platform 参数指定系统结构和平台，到那时需要注意的是只能打包你当前机器的平台包

* electron-packager；
* electron-builder；


electron-packager <sourcedir> <appname> <platform> <architecture> <electron version> <optional options>
* 
* sourcedir：项目所在路径
* appname：应用名称
* platform：确定了你要构建哪个平台的应用（Windows、Mac 还是 Linux）
* architecture：决定了使用 x86 还是 x64 还是两个架构都用
* electron version：electron 的版本
* optional options：可选选项

简单的说，electron-builder 就是有比 electron-packager 有更丰富的的功能，支持更多的平台，同时也支持了自动更新。除了这几点之外，由 electron-builder 打出的包更为轻量，并且可以打包出不暴露源码的 setup 安装程序。考虑到以上几点，我果断选择了 electron-builder.

dependencies 表示我们要在生产环境下使用该依赖，devDependencies 则表示我们仅在开发环境使用该依赖。

## ASAR 文件

ASAR 文件是一个归档文件，用于使用 Electron 打包应用程序的源代码，Electron 是一个用于构建跨平台程序的开源库。 它以类似于以下格式的格式保存 。存档中包含存档的文件，例如 .HTML, .JS和 .CSS 文件在不使用压缩的情况下串联在一起。
讲执行资源打包到一个.asar 文件中,应用启动执行时直接访问.asar 文件内部资源获取执行代码.

asar属于一种将多个文件打包合并的文件, 类似于 Linux 中的 tar 格式文件，Windows 中的 zip, rar 格式文件，然而不同于上面类比的格式，asar 属于无压缩类型的，也没有经过加密处理的，所有包含的文件的二进制数据都直接添加到 .asar 文件中，该文件头部包含一个 JSON 格式的字符串，记录其中包含的文件结构以及所有文件的起始位置以及文件长度：

## 为什么要有

* 在 window 系统中, 文件路径默认使用256位的字符串存储,因此资源文件路径过深,或者资源父级文件夹名过长的情况,就会出现资源访问失败的问题.因此 electron 提出了将所有执行资源归档到一个.asar 文件中的解决方案,.asar 文件会保留原来资源的层级结构,逻辑代码技能狗无需额外修改,也能解决 windows 中可能出现层级过深导致的执行失败问题.

* .asar 格式能加快 require 访问的速度. 而.asar 只需要根据文件路径获取到文件的便宜位置 offset 以及文件长度 size,就可以直接从其中获取文件的具体信息. 一来只需要保持一个文件的读状态,无需同时读取多个文件,二来还能加快其访问速度.

* 引入.asar 文件,能够隐藏项目开发的源代码.asar 属于无压缩无解密的归档类型,有意解包者能够轻松导出其中的内容

