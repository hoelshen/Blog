今天我将介绍如何在 GitHub 页面上使用 [CircleCI](https://circleci.com/) 进行持续部署。

CircleCI 是一个很像 [Travis CI](https://travis-ci.org/) 的 CI 工具。 但他们的配置有很多不同之处。 你可能会发现, 首先使用它很麻烦。

如果你太忙，不能阅读[官方文档](https://circleci.com/docs/2.0/)。 本教程对您作为快速备忘，非常有帮助。

## 1. 注册 CircleCI

打开 [CircleCI](https://circleci.com/) 官方网站，使用您的 GitHub 帐户登录。

## 2. 启动存储库

检查要在 CircleCI 上管理的存储库的开关按钮。

## 3. 编写 config.yml

在项目根目录或 .circleci 目录中为 CircleCI 创建名为 config.yml 的配置文件
首先，您需要设置构建环境，这取决于您的项目语言和依赖项：

```javascript
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:latest
```

如果要指定触发 ci 任务的某个分支，可以使用过滤器：

```javascript
filters: branches: only: master
```

然后，您可以配置要在虚拟机上运行的命令，命令可以按<font color=orange >步骤</font>划分：

```javascript
steps:
  - run:
    name: Install some stuff
    command: <do-some-stuff>
  - run:
    name: Deploy if tests pass and branch is Master
    command: <my-deploy-commands>
```

我正在使用 [Gatsby](https://link.juejin.im/?target=https%3A%2F%2Fwww.gatsbyjs.org%2F) 来构建我的 doc 站点。这是一个完整的模板：

```javascript
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:latest
    filters:
      branches:
        only: master
    steps:
      - add_ssh_keys:
          fingerprints:
            - "xx:xx:xx:xx:11:22:33:44:55:66:77:88:99:xx:xx:xx"
      - checkout
      - restore_cache:
          keys:
          - dependencies-
          # fallback to using the latest cache if no exact match is found
          - dependencies-
      - run:
          name: Install
          command: yarn install
      - save_cache:
          paths:
            - node_modules
          key: dependencies-
      - run:
          name: Gatsby build site
          command: yarn build
      - run:
          name: Prepare shell commands
          command: cp .scripts/gatsby-deploy.sh ../ && chmod +x ../gatsby-deploy.sh
      - run:
          name: Run deploy scripts
          command: ../gatsby-deploy.sh
```

## 4. 写入 CircleCI 的权限

对我来说，我必须授权 CircleCI 自动更新<font color=orange > gh 页面 </font>。在获得读取权限之前生成的默认 ssh 密钥。所以我们必须手动添加读/写部署密钥。

### 生成一个新的 ssh 密钥

```javascript
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

按照命令行交互，您将获得两个 ssh 密钥文件 id_rsa 和 id_rsa.pub（记得更改默认文件位置或您的本地 ssh 密钥将被覆盖）。

### 上传 ssh 密钥

1.通过https://github.com/<your_name>/<your_repo>/settings/keys 上传您的 GitHub repo 设置上的 id_rsa.pub。

2.跳转到https://circleci.com/gh/<your_name>/<your_repo>/edit#ssh 并添加您刚刚创建的私钥 id_rsa。

&ensp;&ensp;在主机名字段中输入`github.com`，然后按 提交按钮。并添加您刚刚创建的私钥 id_rsa。 在主机名字段中输 入 `github.com`, 然后按提交按钮。

### 将 ssh 密钥添加到配置文件中

使用 add_ssh_keys 设置刚刚添加的 ssh 密钥，以便在运行部署脚本时启用它。

```javascript
- add_ssh_keys:
    fingerprints:
      - "xx:xx:xx:xx:11:22:33:44:55:66:77:88:99:xx:xx:xx"
```

## 5. 编写 deploy.sh shell 脚本

现在 CircleCI 获得了写入您的存储库的权限，您可以使用任何 git 命令来操作您的存储库：

```javascript
git pull
yarn build
git checkout gh-pages
# Add site files...
git push
```

## 6. 开始测试并享受它

就这样。你现在很高兴。拿起一杯咖啡坐下来观看 CircleCI 跑。

## 参考

- [Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent/)
- [Adding read/write deployment key](https://circleci.com/docs/2.0/deployment-integrations/)
- [CircleCI Deploy documents](https://circleci.com/docs/2.0/deployment_integrations/)
- [CircleCI configuration-reference](https://circleci.com/docs/2.0/configuration-reference/#add_ssh_keys)
