# 路由

前文说明，最近一直在折腾flutter，期间踩了不少坑，所以就想总结下，方便自己查阅，希望也能帮助别人，里面涉及到的一些知识点可能没有提及。 包括我自己可能理解有误的地方，欢迎指出。希望能一起进步，成长。趁着有风赶快飞翔吧。

## 路由基础配置

1.方式一

```dart
//以下省略无关代码
import 'index.dart';

mian.dart  //主路由
void main() {
  runApp(MaterialApp(index: IndexPage()));
}

index.dart
import 'xxx1.dart';
import 'xxx2.dart';
class IndexPage extends StatefulWidget {
  @override
  IndexPageState createState() => IndexPageState();
}
class IndexPageState extends State<IndexPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
          children: <Widget>[
              FlatButton(
                onPressed: () {
                      builder = (BuildContext _) => Xxx1Page();
                },
                child: Text(
                    "xxx1",
                ),
              ),
              FlatButton(
                onPressed: () {
                      builder = (BuildContext _) => Xxx2Page();
                },
                child: Text(
                    "xxx2",
                ),
              )
          ],
        ));
  }
}

xxx1.dart
class Xxx1Page extends StatelessWidget  {
}

xxx2.dart
class Xxx2Page extends StatelessWidget  {
}


```

2.方式二

```dart
//以下省略无关代码
route.dart
import 'index.dart';
import 'xxx1.dart';
import 'xxx2.dart';

final Map<String, WidgetBuilder> RoutePath = <String, WidgetBuilder>{
   '/': (BuildContext context) => IndexPage(), //首页路由
    '/xxx1.dart': (BuildContext context) => Xxx1Page(),
    '/xxx2.dart': (BuildContext context) => Xxx2Page(),
}

mian.dart  //主路由
import '/route/route.dart';
  Widget build(BuildContext context) {
    return MaterialApp(
        initialRoute: '/',
        routes: RoutePath,
    ）
  }

index.dart
import 'xxx1.dart';
import 'xxx2.dart';

class IndexPage extends StatefulWidget {
  @override
  IndexPageState createState() => IndexPageState();
}
class IndexPageState extends State<IndexPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
          children: <Widget>[
              FlatButton(
                onPressed: () {
                     Navigator.of(context).pushNamed('/xxx1');
                },
                child: Text(
                    "xxx1",
                ),
              ),
              FlatButton(
                onPressed: () {
                   Navigator.of(context).pushNamed('/xxx2');
                },
                child: Text(
                    "xxx2",
                ),
              )
          ],
        ));
  }
}


xxx1.dart
class Xxx1Page extends StatelessWidget  {
}

xxx2.dart
class Xxx2Page extends StatelessWidget  {
}

```

## 路由传参
在上面页面继续改造

1.方式一

```dart
//以下省略无关代码
import 'index.dart';

mian.dart  //主路由
void main() {
  runApp(MaterialApp(index: IndexPage()));
}

index.dart
import 'xxx1.dart';
import 'xxx2.dart';
class IndexPage extends StatefulWidget {
  @override
  IndexPageState createState() => IndexPageState();
}
class IndexPageState extends State<IndexPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
          children: <Widget>[
              FlatButton(
                onPressed: () {
                      builder = (BuildContext _) => Xxx1Page(id:'xxx2');
                },
                child: Text(
                    "xxx1",
                ),
              ),
              FlatButton(
                onPressed: () {
                      builder = (BuildContext _) => Xxx2Page();
                },
                child: Text(
                    "xxx2",
                ),
              )
          ],
        ));
  }
}

xxx1.dart
class Xxx1Page extends extends StatefulWidget {
  Xxx1Page({this.id, Key key}) : super(key: key);
  String id;
}

xxx2.dart
class Xxx2Page extends  extends StatefulWidget {

}


```


2.方式二

```dart
//以下省略无关代码
route.dart
import 'index.dart';
import 'xxx1.dart';
import 'xxx2.dart';

final Map<String, WidgetBuilder> RoutePath = <String, WidgetBuilder>{
   '/': (BuildContext context) => IndexPage(), //首页路由
    '/xxx1.dart': (BuildContext context) => Xxx1Page(),
    '/xxx2.dart': (BuildContext context) => Xxx2Page(
      id:ModalRoute.of(context).settings.arguments
    ),
}

mian.dart  //主路由
import '/route/route.dart';
  Widget build(BuildContext context) {
    return MaterialApp(
        initialRoute: '/',
        routes: RoutePath,
    ）
  }

index.dart
import 'xxx1.dart';
import 'xxx2.dart';

class IndexPage extends StatefulWidget {
  @override
  IndexPageState createState() => IndexPageState();
}
class IndexPageState extends State<IndexPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: Column(
          children: <Widget>[
              FlatButton(
                onPressed: () {
                      Navigator.of(context).pushNamed('/xxx1',
                      arguments: 'xxx1');
                },
                child: Text(
                    "xxx1",
                ),
              ),
              FlatButton(
                onPressed: () {
                   Navigator.of(context).pushNamed('/xxx2');
                },
                child: Text(
                    "xxx2",
                ),
              )
          ],
        ));
  }
}


xxx1.dart
class Xxx1Page extends extends StatefulWidget {
  Xxx1Page({this.id, Key key}) : super(key: key);
  String id;
}

xxx2.dart
class Xxx2Page extends  extends StatefulWidget {
  
}
```

## other
这几个也是比较常用的路由导航：pop、pushReplacement、pushNamedAndRemoveUntil、 

```dart

 Navigator.pop(context, true); // returns true

 Navigator.of(context)
      .pushNamedAndRemoveUntil('/', (Route<dynamic> route) => false);  //remove all the routes below the pushed route;

 Navigator.of(context).pushReplacementNamed('/'); //If non-null, result will be used as the result of the route that is removed;
```

文末：接下来还会写些相关的文章，敬请期待。