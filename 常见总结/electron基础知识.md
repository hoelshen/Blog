# CLI

主要的有两个：electron-forge和electron-builder

分发等同于打包

electron-forage package 只是打包一个目录到out目录下， 一般用来调试
electron-forage make 
参数 —arch  
—platform 参数指定系统结构和平台，到那时需要注意的是只能打包你当前机器的平台包

* electron-packager；
* electron-builder；

ASAR文件是一个归档文件，用于使用Electron打包应用程序的源代码，Electron是一个用于构建跨平台程序的开源库。 它以类似于以下格式的格式保存 。柏油 存档中包含存档的文件，例如 .HTML, .JS和 .CSS 文件在不使用压缩的情况下串联在一起。

electron-packager <sourcedir> <appname> <platform> <architecture> <electron version> <optional options>
* 
* sourcedir：项目所在路径
* appname：应用名称
* platform：确定了你要构建哪个平台的应用（Windows、Mac 还是 Linux）
* architecture：决定了使用 x86 还是 x64 还是两个架构都用
* electron version：electron 的版本
* optional options：可选选项



简单的说，electron-builder就是有比electron-packager有更丰富的的功能，支持更多的平台，同时也支持了自动更新。除了这几点之外，由electron-builder打出的包更为轻量，并且可以打包出不暴露源码的setup安装程序。考虑到以上几点，我果断选择了electron-builder 


dependencies 表示我们要在生产环境下使用该依赖，devDependencies 则表示我们仅在开发环境使用该依赖。
