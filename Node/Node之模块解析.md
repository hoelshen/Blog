# node之模块解析（一）


## http



## fs

软链接
 
ls -s source target

软链接类似于 windows 中的”快捷方式“。两个文件虽然 inode 号码不一样，但是文件 A 内部会指向文件 B 的 inode。但是当我们删除掉源文件 B 时，再访问文件 A 时会报错 “No such file or directory”。

和硬链接不同, 我们可以给目录建立软链接,.

硬链接

ls source target

一般情况，一个文件名“唯一”对应一个 inode。但是，linux 允许多个文件名都指向同一个 inode。这表示我们可以使用不同的文件名访问同样的内容；对文件内容进行修改将“反映”到所有文件；删除一个文件不影响另一个文件的访问 。这种机制就被称为“硬链接”。

我们可以使用 ln source target 来建立硬链接(注意: source 是本身已存在的文件, target 是将要建立的链接)

只能给文件建立硬链接, 不能给目录建立硬链接. 另外 source 文件必须存在, 否则将会报错.

我们可以使用 fs.symlink 建立软链接(符号链接), 没有直接的方法建立硬链接

总结:
1. 使用 ln source target 建立硬链接；使用 ln -s source target 建立软链接
2. 硬链接不会创建额外 inode，和源文件共用同一个 inode；软链接会创建额外一个文件（额外 inode），指向源文件的 inode
3. 建立硬链接时，source 必须存在且只能是文件；建立软链接时，source 可以不存在而且可以是目录
4. 删除源文件不会影响硬链接文件的访问（因为 inode 还在）；删除源文件会影响软链接文件的访问（因为指向的 inode 已经不存在了）
5. 对于已经建立的同名链接，不能再次建立，除非删掉或者使用 -f 参数

### fs.symlink

fs.symlinkSync('file', 'file-soft'); // file-soft -> file
fs.symlinkSync('dir', 'dir-soft', 'dir'); // dir-soft -> dir


require
在 Node 中，我们经常通过 require 来引用模块。非常有趣的是，require 引用模块时，会“考虑”符号链接，但是却使用模块的真实路径作为 __filename、__dirname，而不是符号链接的路径。

最终的结论是在找到更好的方法前给 node v6 增加了一个 --preserve-symlinks 选项来禁止这种 require 的行为，而是使用全新的 require 逻辑。有兴趣和闲情的可以去围观：

```sh
 app
  - index.js // require('dep1')
  - node_modules
    - dep1 -> ../../mods/node_modules/dep1 // 软链接
    - dep2 -> ../../mods/node_modules/dep2 // 软连接
- mods
  - node_modules
    - dep1
      - index.js
    - dep2
      - index.js
```

## path







## 数据库模块