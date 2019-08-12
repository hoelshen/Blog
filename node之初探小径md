 ~ 会匹配最近小版本依赖包

^ 会匹配最新的大版本依赖包

node 常见的一些问题 
例如读写权限目录


第一种方案就是 将npm默认目录指向到你具有读写权限的目录
1.创建一个目录用全局安装
mkdir ~/.npm-global

2.配置npm使用这个新目录
npm config set prefix '~/.npm-global'

3.打开或者创建一个"~/.zshrc"文件并添加代码
touch ~/.zshrc  或者 echo "export PATH=~/.npm-global/bin:$PATH" > ~/.zshrc

export PATH=~/.npm-global/bin:$PATH

4.返回命令行，更新系统变量
source ~/.zshrc

测试
npm install -g jsdoc

如果这一步还是遇到问题 那么可以采用这个问题来解决
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config

第二种方法是 用包管理器来帮你管理
brew install node



