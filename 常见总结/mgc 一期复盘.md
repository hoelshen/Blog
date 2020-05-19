1. 遇到属性时判断存在与否

global.EventJavascriptInterface.getVersionCode

2. promiseall

```js
      function fetchExchange(param, index){
        return that.$store.dispatch("fetchExchange", { context: that, id: param }).then(function(res){
          let data = res.data.code;  //200
          return {code: data, index}
        }).catch(function (response) {
          console.log('resp', response.data.code) //123006  2
          return {code :response.data.code , index}
        });
      }
      let pool = data.filter(value => {
          return value.total - value.used > 0
      })

      let new_pool = pool.map((value,index) => {
          return fetchExchange(value.configId, index)
      })
      Promise.all(new_pool).then(function(res){
        let promiseResult = res;
        promiseResult.map((e,index)=>{
          if(e.code == 200){
            num ++ //成功
            count1 += that.couponList[e.index].count_limit
          } else {
            mun ++ //失败
            count2 += that.couponList[e.index].count_limit
          }
        })
        if((num == promiseResult.length)){
          WelfareDialogBuilder.of(that).alert(`成功领取到 ${that.countLimit} 张优惠券`);
        } else if((mun == promiseResult.length)){
          WelfareDialogBuilder.of(that).alert(`有 ${that.countLimit} 张优惠券领取失败，请联系 VIP 客服（QQ:  3001151184）进行补发。`);
        } else {
          WelfareDialogBuilder.of(that).alert(`成功领取到了 ${count1} 张优惠券,有 ${count2} 张优惠券领取失败，请联系 VIP 客服（QQ:  3001151184）进行补发。`);
        }
      }).catch(function (response) {
        console.log('catch', response) //unde
        return response
      });
      const arr1 = this.couponList;
      arr1.forEach((element,index) => {
        element.used = true;
        console.log('this.couponList', arr1)
      });
      this.couponList = arr1;
```

3. css 样式

```less
.upLevel_header /deep/ .icon {
  padding-left: .305556rem; //33px
  padding-top:1.41662rem!important;
}
.upLevel_header /deep/ .action-bar {
  opacity: 1 !important;
}

```

4. 动态 margin 高度

```js
  //获取可视高度
  this.pageHeight =  document.body.clientHeight * 0.12


  <img :style="{'margin-top': pageHeight + 'px'}" src="~images/upLevel.png">

```

5.

