# Mac的使用技巧

	  从18 年下半年到19 年的朋友圈，每刷 10 条朋友圈，至少有 1 条标题党说xxx你会吗，xxx条小技巧，可以参看下图。整个就是早上鸡汤味包子馒头，中午鸡汤泡饭，晚上鸡汤味粉丝。反正就是弄的你很焦虑，原谅我现在不怎么看朋友圈推文了😂。

![xxx高手课](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-xxx%E9%AB%98%E6%89%8B%E8%AF%BE.jpg)

  这里面固然有各大网课平台的推广，但是也反映出了技术人的焦虑、不安。在经济低迷的年代，我们听到某某某整个业务线被裁啦，谁谁谁刚贷款买的房，公司就倒闭啦。总有人害怕自己被替代了，或者说怕一下子就失业了。所以这也萌发了我写文章的想法，竟然都是学，那不如自己学会在教给别人，岂不美滋滋。

    使用mac有五年时间了，每年几乎都要重装一次系统（原谅手残的我，每次都能把系统弄崩）。每次重装系统免不了要设置一些快捷键，下载一些常用工具。次数多了，总会漏掉一些东西。 所以写篇文章来给Mac新手或者自己下次在重装的时候能够查阅。
    

## iTerm2

 苹果自带的终端在个性化方面总是那么的不尽如人意，所以我们选择 iTerm2，来替代原生的终端。

 在Unix/Linux的世界里，人机交互的工具就是shell了，常见的有bash, ksh, csh等。 由于各个发行版的系统默认shell都是bash，所以大家对bash的熟悉度是最高的。最今天给大家介绍一款效率远远超过bash的shell —— zsh
 首先 我们看看shell

 

``` shell
  cat /etc/shells

 ```

Item2配合zsh，秒杀自带的终端。
改变zsh
chsh -s /bin/zsh

解决Git下载很慢的方法
[地址](https://blog.csdn.net/MENGHUANBEIKE/article/details/74001756)

1. 安装好oh my zsh后，在~/.zshrc中添加如下内容，能让你用的更愉快，

ZSH_THEME="agnoster"  #使用 agnoster 主题，很好很强大
DEFAULT_USER="你的用户名"     #增加这一项，可以隐藏掉路径前面那串用户名
plugins=(git brew node npm)   #自己按需把要用的 plugin 写上

Tab纵向分割：⌘+d

自动填充：⌘ + ； 命令补全提示

打开粘贴历史：⌘ + shift + h  

zsh_stats 能够查看使用频率最高的20条历史记录

配置命令提示：

``` zsh
# Incremental completion for zsh
# by y.fujii <y-fujii at mimosa-pudica.net>, public domain

autoload -U compinit
zle -N self-insert self-insert-incr
zle -N vi-cmd-mode-incr
zle -N vi-backward-delete-char-incr
zle -N backward-delete-char-incr
zle -N expand-or-complete-prefix-incr
compinit

bindkey -M viins '^[' vi-cmd-mode-incr
bindkey -M viins '^h' vi-backward-delete-char-incr
bindkey -M viins '^?' vi-backward-delete-char-incr
bindkey -M viins '^i' expand-or-complete-prefix-incr
bindkey -M emacs '^h' backward-delete-char-incr
bindkey -M emacs '^?' backward-delete-char-incr
bindkey -M emacs '^i' expand-or-complete-prefix-incr

unsetopt automenu
compdef -d scp
compdef -d tar
compdef -d make
compdef -d java
compdef -d svn
compdef -d cvs
now_predict=0

function limit-completion
{
	if ((compstate[nmatches] <= 1)); then
		zle -M ""
	elif ((compstate[list_lines] > 6)); then
		compstate[list]=""
		zle -M "too many matches."
	fi
}

function correct-prediction
{
	if ((now_predict == 1)); then
		if [[ "$BUFFER" != "$buffer_prd" ]] || ((CURSOR != cursor_org)); then
			now_predict=0
		fi
	fi
}

function remove-prediction
{
	if ((now_predict == 1)); then
		BUFFER="$buffer_org"
		now_predict=0
	fi
}

function show-prediction
{
	# assert(now_predict == 0)
	if
		((PENDING == 0)) &&
		((CURSOR > 1)) &&
		[[ "$PREBUFFER" == "" ]] &&
		[[ "$BUFFER[CURSOR]" != " " ]]
	then
		cursor_org="$CURSOR"
		buffer_org="$BUFFER"
		comppostfuncs=(limit-completion)
		zle complete-word
		cursor_prd="$CURSOR"
		buffer_prd="$BUFFER"
		if [[ "$buffer_org[1,cursor_org]" == "$buffer_prd[1,cursor_org]" ]]; then
			CURSOR="$cursor_org"
			if [[ "$buffer_org" != "$buffer_prd" ]] || ((cursor_org != cursor_prd)); then
				now_predict=1
			fi
		else
			BUFFER="$buffer_org"
			CURSOR="$cursor_org"
		fi
		echo -n "\e[32m"
	else
		zle -M ""
	fi
}

function preexec
{
	echo -n "\e[39m"
}

function vi-cmd-mode-incr
{
	correct-prediction
	remove-prediction
	zle vi-cmd-mode
}

function self-insert-incr
{
	correct-prediction
	remove-prediction
	if zle .self-insert; then
		show-prediction
	fi
}

function vi-backward-delete-char-incr
{
	correct-prediction
	remove-prediction
	if zle vi-backward-delete-char; then
		show-prediction
	fi
}

function backward-delete-char-incr
{
	correct-prediction
	remove-prediction
	if zle backward-delete-char; then
		show-prediction
	fi
}

function expand-or-complete-prefix-incr
{
	correct-prediction
	if ((now_predict == 1)); then
		CURSOR="$cursor_prd"
		now_predict=0
		comppostfuncs=(limit-completion)
		zle list-choices
	else
		remove-prediction
		zle expand-or-complete-prefix
	fi
}

```

之后保存在：
source ~/.oh-my-zsh/plugins/incr/incr*.zsh

然后生效下配置
 soucre .zshrc

我们的 shell 文件看起来密密麻麻，怎么办。我们可以添加下主题, 行号等。
我们首先要明确一点 vi 是不带高亮的 ，vim 才带高亮。
vi ~./vimrc

``` vim
  set hlsearch           " 高亮度反白
  set backspace=2        " 可随时用退格键删除
  set autoindent         " 自劢缩排
  set ruler              " 可显示最后一行癿状态
  set showmode           " 左下角那一行癿状态
  set number             " 可以在每一行癿最前面显示行号啦！
```

## Go2Shell

![Go2Shell](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-035349.png)

  这也是一款神器，能够直接进入相应的目录终端，安装方法十分特殊，需要你拖到相应的 finder 界面。生成 Go2ShellHelper，之后在想打开的 finder 页面，点击 Go2ShellHelper，就能够生成了。

![Go2Shellhelper](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-025358.png)

## pap.er

	这是一款比较好用的壁纸，也是推荐。支持在各个分屏做壁纸。
	
![paper](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-035728.png)

下面是我的分区情况

![paper分区](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-040038.png)

## Gestimer

	一款类似于番茄todo的产品，这款软件的优点就是易上手，操作方式简洁，
	设置时间的方式也很有趣，一条线一直拉伸，能够增加相对应的时间分钟数。不过不知道为什么 gif 没显示出来（假装有）
	<iframe height=500 width=500 src="http://pvt7l4h05.bkt.clouddn.com/2019-08-16-2019-08-16%2012.15.46.gif">
    
	设置时间到了之后，Mac的通知栏会有条提醒

![Gestimer](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-041724.png)

	
	能关联到iphone上面的提醒。 
    
	<iframe height=500 width=500 src="http://pvt7l4h05.bkt.clouddn.com/2019-08-16-2019-08-16%2012.25.55.gif">

## Gifox

![Gifox](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-052318.png)

这是一款视频转 gif 的软件，本文所有的 gif，均由它生成，操作简单，只要设置快捷键，简直就是想截哪个截哪个。

![Gifox](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-051803.png)

## iPic

这个图床墙裂推荐，分有免费版和高级版，免费版只支持微博图床。高级版每年 60 大洋，支持多个云平台，能够做到一件上传，批量上传，还能自动生成 MarkDown格式。是在是居家旅行必备的软件。
![ipic](http://pvt7l4h05.bkt.clouddn.com/2019-08-16-053610.png)

分享的这几个都是能够切切实实提升效率的软件，也是最近常用的软件，之后还会在补充。毕竟上手这些也要成本的。很多细节方面我没有一一去讲，只是讲了大概。
