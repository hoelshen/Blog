# electron

一整套开发流程

## 第一次分发

先执行 npm run precompile预编译部分库代码
再执行 npm run dev，生成第一次代码（如果是mac的电脑，则执行npm run mac_dev）
再执行 npm run build-pack，生成activity-builder-win32-x64目录
再执行 asar pack src src.asar
在执行 asar pack node_modules node_modules.asar
然后复制 node_modules.asar和src.asar到 activity-builder-win32-x64/resource目录下

最后可以压缩activity-builder-win32-x64直接分发

## 之后的分发

只要node_modules没有改动，可以不需要执行asar pack node_modules node_modules.asar生成node_modules.asar文件

只需执行 asar pack src src.asar 生成 src.asar 文件

然后用XSHEEL登录内网服务器172.16.187.147
账户：root
密码：meizu.com
目录：/home/meizu/game-open/update-server

把 src.asar 复制到（如果需要更新node_modules.asar也一样复制到）/home/update-server/update目录

注意：（/home/update-server/dev）是测试时使用的路径 （/home/update-server/update）是正式发布使用的路径

然后回到/home/update-server目录执行npm run restart，重启服务器（注意：第一次部署服务使用npm run start）

之后模板工具重新打开，会检查到更新则自动更新（注意，更新的地址为：<http://172.16.187.147:8181/update/>）

## 热更新

当我们每次的 electron 加载完毕之后,就会发送一个请求,去获取 github 项目上的 package.json文件, 主要是知道目前线上的版本是多少,然后和本地的 package.json 文件的 version 版本数据做比较.如果发现不一致,则说明有新版本可以升级,于是变成这样.

当我们点击“升级”按钮后，会把高于本地版本的需要更新的文件重新整合成一个新的完整的升级文件列表，然后依次从github上远程获取，存储在一个临时文件夹中，如果全部文件获取成功，再一并覆盖本地资源，全部覆盖完成后，刷新页面，完成升级。

以上就是完整的升级原理。

或者 采用 mainWindow.loadURL("http://www.apps.com/")

打包成 asar 文件 可以执行不打包 electron-builder 指定 asarUnpacked属性, 来让某些文件暴露在文件系统下/

## 实战
