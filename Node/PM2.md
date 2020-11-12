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
