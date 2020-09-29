# Git 常见疑惑

1. git fetch  →→ 这将更新git remote 中所有的远程repo 所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中

2. git remote
git merge and git --rebase

我们正常git pull  是先fetch 后接merge操作。如果加-rebase参数，就是使用git rebase代替git merge 。更新本地仓库
git  FETCH_HEAD   FETCH_HEAD指向这个分支的提示

FETCH_HEAD： 是一个版本链接，记录在本地的一个文件中，指向着目前已经从远程仓库取下来的分支的末端版本。

git pull 的运行过程：

git pull : 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，然后git fetch 获得当前指向的远程分支的后续版本的数据，然后再利用git merge将其与本地的当前分支合并。


git pull --rebase

## 踩坑




## 技巧一

当merge出错的时候：
撤销最后一次修改：
git reset —hard HEAD^  不会产生log
git revert HEAD  会产生log
git push origin master -f  连历史记录

## 技巧二

解决fatal： remote origin already exists 
1.先删除远程git 仓库
git remote rm origin
2.添加远程git 仓库

如果报错 执行 vi .git/config


## 技巧三

git 错误 fatal: Not a valid object name: 'master'.
出现的原因 没有进行一次提交

git config -l
查看 git 配置


如果你只需要修改最新的 commit ，直接使用：
git commit --amend --author="Author Name <email@address.com>"
复制代码
如果你已经修改了 git config 中的用户名和邮箱，也可以使用
git commit --amend --reset-author --no-edit

设置用户名与邮箱
$ git config user.name "Author Name"
$ git config user.email email@address.com


### 技巧四

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdvnuxshn5j31h00cst9a.jpg)

![](https://tva1.sinaimg.cn/large/007S8ZIlly1gdvnuu4j2zj31740limyx.jpg)

### 技巧五

git branch -r 查看远程分支

git commit -m'应用属性标签榜单'


git commit --amend


###  技巧六

git log -g 找到最近一次提交的commit记录,并记下commit id
git branch newbranch commit_id生成一个newbranch新分支
切到newbranch分支