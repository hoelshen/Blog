# 页面布局

  如果小伙伴是从前端过来的，那么应该会对页面布局这块感到熟悉，跟css页面的布局有点类似.每个控件的属性可能要用到才能知道，下面记录一些常用的。

## Row、Column、
最常见的布局控件，可以创建行或列，子控件添加到Row或Column控件。
mainAxisAlignment、crossAxisAlignment 控制行或者列如何对齐子控件。
对于行，主轴水平运行，横轴垂直运行。
对于列，主轴垂直运行，横轴水平运行。

```dart
Row(
  children: <Widget>[
    const FlutterLogo(),
    const Expanded(
      child: Text('Flutter\'s hot reload helps you quickly and easily experiment, build UIs, add features, and fix bug faster. Experience sub-second reload times, without losing state, on emulators, simulators, and hardware for iOS and Android.'),
    ),
    const Icon(Icons.sentiment_very_satisfied),
  ],
)

```

## stack

有点像css的绝对布局，可以在上面写widget

```dart
Stack(
  fit: StackFit.loose,
  alignment: Alignment.center,
  children: <Widget>[
    Text('hello'),
    Positioned(
     bottom: 10,
     child: Text('world'),
   )
 ],
),

```


## Expanded  Flexible

Expanded继承自 Flexible，
Expanded控件具有一个flex属性，一个确定控件的弹性系数的整数，Expanded控件的默认flex系数为1。

要创建一组三个控件，其中中间的控件是其他两个控件的两倍，则将中间控件的弹性系数设置为2

```dart
Center(
          child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
            Expanded(
              child: Container(alignment: Alignment.center, color: Colors.red),
            ),
            Expanded(
                flex: 2,
                child:
                    Container(alignment: Alignment.center, color: Colors.blue)),
            Expanded(
                child: Container(
                    alignment: Alignment.center, color: Colors.yellow)),
          ]),
        )
```

```dart
以下是经典的排列方式

 Center(
          child: Row(crossAxisAlignment: CrossAxisAlignment.center, children: [
            Flexible(
                fit: FlexFit.loose,
                child:
                    Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Flexible(
                      child: Container(
                        alignment: Alignment.center,
                        color: Colors.red,
                        child: Text('1'),
                      ),
                    ),
                    Flexible(
                      child: Container(
                        alignment: Alignment.center,
                        color: Colors.yellow,
                        child: Text('1'),
                      ),
                    ),
                    Flexible(
                      child: Container(
                        alignment: Alignment.center,
                        color: Colors.blue,
                        child: Text('1'),
                      ),
                    ),
                    Container(
                      alignment: Alignment.center,
                      color: Colors.yellow,
                      child: Text('1'),
                    ),
                    Container(
                      alignment: Alignment.center,
                      color: Colors.blue,
                      child: Text('1'),
                    ),
                  ],
                )),
            Flexible(
              flex: 1,
              child: Container(alignment: Alignment.center, color: Colors.blue),
            ),
            Flexible(
                flex: 1,
                child: Container(
                    alignment: Alignment.center, color: Colors.yellow))


```

![](https://user-gold-cdn.xitu.io/2019/7/10/16bdb43324bed55d?w=326&h=634&f=png&s=9297)


## List

```dart
    //list
    SliverFixedExtentList(
    itemExtent: 50.0,
    delegate:
        SliverChildBuilderDelegate((BuildContext context, int index) {
        //创建列表项
        return Container(
        alignment: Alignment.center,
        color: Colors.lightBlue[100 * (index % 9)],
        child: Text('list item $index'),
        );
    }, childCount: 50), //50个列表项
    ),



```

![list](https://user-gold-cdn.xitu.io/2019/7/10/16bdad5bca13f6a8?w=674&h=1480&f=gif&s=741462)

## Grid

```dart
GridView.builder(
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3, //每行三列
        childAspectRatio: 1.0 //显示区域宽高相等  数字越大  代表 一行放进去的东西越多
        ),
    itemCount: _icons.length,
    itemBuilder: (context, index) {
        //如果显示到最后一个并且Icon总数小于200时继续获取数据
        if (index == _icons.length - 1 && _icons.length < 200) {
        _retrieveIcons();
        }
        return Container(
            decoration: BoxDecoration(
            color: Colors.grey,
            borderRadius: BorderRadius.circular(4),
            ),
            child: Icon(_icons[index])
);

```

```dart
//还有一种是直接采用
    sliver: SliverGrid(
    //Grid
    gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
    crossAxisCount: 2, //Grid按两列显示
    mainAxisSpacing: 20.0, //上下的间距
    crossAxisSpacing: 20.0, //左右的间距
    childAspectRatio: 4.0,
    ),
    delegate: SliverChildBuilderDelegate(
    (BuildContext context, int index) {
        //创建子widget
        return Container(
        alignment: Alignment.center,
        color: Colors.cyan[100 * (index % 9)],
        child: Text('grid item $index'),
        );
    },
    childCount: 20,
    ),



```


![grid](https://user-gold-cdn.xitu.io/2019/7/10/16bdad44a93c2d50?w=674&h=1470&f=gif&s=758201)



## NestedScrollView

```dart
import 'package:flutter/material.dart';

class GraidPage extends StatefulWidget {
  
  @override
  State<StatefulWidget> createState() => _GraidPageState();
}

class _GraidPageState extends State<GraidPage> {
  final String title = 'appbar';
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxIsScrolled) {
          return <Widget>[
            SliverAppBar(
              title: Text(title),
            )
          ];
        },
        body: ListView.builder(
          itemBuilder: (BuildContext context, int index) {
            return ListItemDemo('标题_$index');
          },
          itemCount: 50,
        ),
      ),
    );
  }
}

class ListItemDemo extends StatelessWidget {
  final String title;
  ListItemDemo(this.title);
  @override
  Widget build(BuildContext context) {
    return InkWell(
      child: ListTile(
        leading: Icon(Icons.ac_unit),
        title: Text(title),
      ),
    );
  }
}
```

![](https://user-gold-cdn.xitu.io/2019/7/10/16bdb6d0752c672e?w=658&h=1430&f=gif&s=1639349)


## SingleChildSriollView

```dart

 Container(
            child: Column(
          children: <Widget>[
            Container(
              height: 52,
              child: SingleChildScrollView(
                child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(20),
                    color: const Color.fromARGB(26, 192, 186, 186),
                    child: Text(
                      '【鲁哈尼警告英国：将面临扣押伊朗油轮的后果】当地时间10日，据伊朗塔斯尼姆通讯社报道，伊朗总统鲁哈尼表态称，英国将因为扣押油轮而面临“后果”。鲁哈尼称，“你们（英国）是不稳定的始作俑者，很快你们将意识到后果。”鲁哈尼还表示，伊朗提高浓缩铀丰度是出于和平目的，是为发电厂提供燃料。 ​​​​',
                      maxLines: 5,
                    )),
              ),
            )
          ],
        )));




```



![](https://user-gold-cdn.xitu.io/2019/7/10/16bdb54f8604c63c?w=682&h=1460&f=gif&s=323382)

