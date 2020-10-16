
postcss配置 ：方案一

在 vue.config.js中
    css: {
      loaderOptions: {
          postcss: {
              plugins: [
                  require('postcss-pxtorem')({
                      rootValue : 108, // 换算的基数
                      selectorBlackList  : ['weui','mu'], // 忽略转换正则匹配项
                      propList   : ['*'],
                  }),
              ]
          }
      }


      loaderOptions: {
          postcss: {
              plugins: [
                RemFixer
              ]
          }
      }


在 pack.json 中
不生效：
  "postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-pxtorem": {
         "rootValue": 108
      } 
    }
  },
