#git 常见疑惑
1. git fetch          →→ 这将更新git remote 中所有的远程repo 所包含分支的最新commit-id, 将其记录到.git/FETCH_HEAD文件中
2.git remote 
git merge and git --rebase

我们正常git pull  是先fetch 后接merge操作。如果加-rebase参数，就是使用git rebase代替git merge 。更新本地仓库
git  FETCH_HEAD   FETCH_HEAD指向这个分支的提示

FETCH_HEAD： 是一个版本链接，记录在本地的一个文件中，指向着目前已经从远程仓库取下来的分支的末端版本。

git pull 的运行过程：

git pull : 首先，基于本地的FETCH_HEAD记录，比对本地的FETCH_HEAD记录与远程仓库的版本号，然后git fetch 获得当前指向的远程分支的后续版本的数据，然后再利用git merge将其与本地的当前分支合并。


git rebase  自己跟自己远程的分支合并

git merge --no-ff 跟别人的分支合并

git checkout -b 





