## 使用

pm2 start app.js 启动 app.js 应用程序

pm2 start script.sh # 启动 bash 脚本

pm2 list # 列表 PM2 启动的所有的应用程序

pm2 logs # 显示所有应用程序的日志

```js
{
  "apps": {
    "name": "pm2-test-server",
    "script": "app.js",
    "watch": true, // 监听文件改变,自动重启服务
    "ignore_watch": [ // 忽略监听目录
      "node_modules",
      "logs"
    ],
    "instances": 4, // 多进程
    "error_file": "logs/error.log", // 错误日志
    "out_file": "logs/out.log", // 日志
    "log_date_format": "YYYY-MM-DD HH-mm-ss" // 日志时间格式
  }
}
```

常见配置

```js
module.exports = {
  apps: [
    {
      name: "game-external",
      script: "./index.js",
      watch: true,
      ignore_watch: [
        // 从监控目录中排除
        "node_modules",
        "logs",
        "public",
        "static",
      ],
      error_file: "./logs/h5-err.log",
      out_file: "./logs/h5.log", // 普通日志路径
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      instances: 4,
      env: {
        NODE_ENV: "production",
        NODE_PORT: "9080",
        NODE_DEPLOY: "prod",
      },
      max_memory_restart: "6G",
    },
  ],
};
```

## pm2 如果自己挂了怎么办

1. 使用 PM2 的自动重启功能

PM2 提供了自动重启机制，可以在进程异常退出时自动重启应用。

    配置方法：

      在 PM2 配置文件中设置 autorestart: true。

      或者在启动时添加 --autorestart 参数。

```bash
pm2 start app.js --name "my-app" --autorestart
```

2.  使用系统级进程管理器

    1. 为了防止 PM2 本身挂掉，可以使用系统级的进程管理器（如 systemd 或 supervisord）来监控和重启 PM2。

    例如，可以创建一个 systemd 服务单元文件来监控 PM2 进程（如 /etc/systemd/system/pm2.service）：

    2. 配置服务文件

       ```bash
       [Unit]
       Description=PM2 Process Manager
       After=network.target

       [Service]
       Type=forking
       User=your-username
       ExecStart=/usr/bin/pm2 start /path/to/your/app.js
       ExecReload=/usr/bin/pm2 reload all
       ExecStop=/usr/bin/pm2 stop all
       Restart=always

       [Install]
       WantedBy=multi-user.target
       ```

    3. 启用并启动服务：

       ```bash
       sudo systemctl enable pm2
       sudo systemctl start pm2
       ```

    使用 supervisord 管理 PM2：

    1. 安装 supervisord

    ```bash
    sudo apt-get install supervisor
    ```

    2. 创建配置文件（如 /etc/supervisor/conf.d/pm2.conf）：

    ```bash
    [program:pm2]
    command=/usr/bin/pm2 start /path/to/your/app.js
    autostart=true
    autorestart=true
    user=your-username
    ```

    3. 重新加载 supervisord 配置：

    ```bash
    sudo supervisorctl reread
    sudo supervisorctl update
    sudo supervisorctl start pm2
    ```

## 在 k8s 中如果 pm2 挂了怎么办

1. 利用 Kubernetes 的 Pod 重启策略

Kubernetes 提供了 restartPolicy 来定义 Pod 的重启行为。默认情况下，Pod 的 restartPolicy 是 Always，这意味着如果容器退出，Kubernetes 会自动重启它。

配置示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
    - name: my-app
      image: my-app-image
  restartPolicy: Always
```

Always：总是重启（适用于 Deployment、StatefulSet 等）。

OnFailure：仅在容器失败时重启。

Never：从不重启。

2. 使用健康检查（Liveness 和 Readiness Probes）

Kubernetes 提供了两种健康检查机制：

Liveness Probe：检测容器是否存活。如果失败，Kubernetes 会重启容器。

Readiness Probe：检测容器是否准备好接收流量。如果失败，Kubernetes 会将该容器从服务端点中移除。

配置示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
    - name: my-app
      image: my-app-image
      livenessProbe:
        httpGet:
          path: /healthz
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 10
      readinessProbe:
        httpGet:
          path: /ready
          port: 8080
        initialDelaySeconds: 5
        periodSeconds: 10
```

initialDelaySeconds：容器启动后延迟多少秒开始检查。

periodSeconds：检查的频率。

3. 使用 Deployment 实现高可用

通过 Kubernetes 的 Deployment，可以轻松实现应用的高可用性和自动恢复。
