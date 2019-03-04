由flutter团队发布

 flutter团队本周将在巴塞罗那举行的[移动世界大会](https://www.mwcbarcelona.com/session/flutter-google-toolkit-for-building-mobile-experiences/)上为您直播, 这是移动技术行业最大的年度聚会。一年前, 我们在同一事件中宣布了 flutter 的第一个测试版, 此后 flutter 的[增长速度超过了我们想象的速度](http://sotagtrends.com/?tags=[ionic-framework,react-native,flutter,xamarin]&relative=false)。因此, 我们用 flutter 的第一个稳定更新发布来庆祝这一周年, 这似乎是合适的。

![图片](https://user-gold-cdn.xitu.io/2019/2/27/1692cde2694c5d41?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

# Flutter 1.2
flutter 1.2 是 flutter 的第一个功能更新。我们将此版本的重点放在几个主要领域:

* 提高了核心框架的稳定性、性能和质量。
* 致力于改善现有小部件的视觉光洁度和功能。
* 用于构建 flutter 应用程序的开发人员的新的基于 web 的工具。

在发布 flutter 1.0 之后, 在过去的几个月里, 我们将大量精力集中在改进我们的测试和代码基础结构、清除积压的请求以及提高整体框架的性能和质量上。对于那些对细节感兴趣的人,flutter wiki 中有一份全面的这些[请求清单](http://robertpenner.com/easing/)。这项工作还包括更广泛地支持新的 UI 语言, 如Swahili语。

我们继续改进材料和库比蒂诺小部件集, 以支持更灵活地使用材料, 并继续努力在 ios 上实现像素完美的保真度。后一项工作包括支持[浮动光标文本编辑](https://github.com/flutter/flutter/pull/25384), 以及显示对次要细节的持续关注 (例如, 我们更新了文本编辑光标在 ios 上绘制的方式, 以实现动画和绘画顺序的忠实表示)。在[罗伯特·彭纳工作的启发下](http://robertpenner.com/easing/), 我们增加了对更广泛的动画放松功能的支持。我们还增加了对新键盘事件和鼠标悬停支持的支持, 为更深入地支持桌面级操作系统做准备。

flutter 1.2 中的插件团队也一直很忙, 支持应用内购买以及[视频播放器](https://pub.dartlang.org/packages/video_player)、[webview](https://pub.dartlang.org/packages/webview_flutter)和[地图](https://pub.dartlang.org/packages/google_maps_flutter)的许多错误修复工作正在进行中。由于 [intuit](https://developer.android.com/guide/app-bundle/) 的开发人员提供了一个拉请求, 我们现在已经支持了 android app [捆绑](https://github.com/flutter/flutter/pull/24440), 这是一种新的包装格式, 有助于缩小应用尺寸, 并支持新功能, 如 android 应用的动态交付。

最后, flutter 1.2 包括 dart 2.2 sdk, 这是一个更新, 它为编译的代码带来了显著的性能改进, 同时还提供了用于初始化集的新语言支持。有关此作品的更多信息, 您可以阅读 dart 2.2 [公告](https://medium.com/dartlang/announcing-dart-2-2-faster-native-code-set-literal-support-7e2ab19cc86d)。

(顺便说一句, 有些人可能想知道为什么这个版本的编号为1.2。我们的目标是每月向 "beta" 频道发送一个 1. x 版本, 并大约每季度向准备生产使用的 "稳定" 通道发布更新。我们上个月的1.1 是测试版, 因此1.2 是我们的第一个稳定版本。

# 面向 flutter开发人员的新工具

移动开发人员来自不同的背景, 通常更喜欢不同的编程工具和编辑器。flutter 本身支持不同的工具, 包括对 android studio 和 visual studio 代码的一流支持, 以及对从命令行构建应用程序的支持, 因此我们知道, 在如何公开调试和运行时检查工具方面, 我们需要有灵活性。

除了 flutter 1.2 之外, 我们还很高兴预览一套新的基于 web 的[编程工具](https://flutter.github.io/devtools/), 以帮助 flutter 开发人员调试和分析他们的应用程序。这些工具现在可与 visual studio 代码和 android studio 的扩展和外接程序一起安装, 并提供了许多功能:
*一个小部件检查器, 用于可视化和探索 flutter 用于呈现的树层次结构。
*时间线视图, 可帮助您在逐帧级别诊断应用程序, 识别可能导致应用中的动画 "抖动" 的渲染和计算工作。
*一个完整的源代码级调试器, 允许您逐步执行代码、设置断点并调查调用堆栈。
*显示从应用程序记录的活动以及网络、框架和垃圾收集事件的日志记录视图。

![图片](https://3.bp.blogspot.com/-Hz8zRiEUnS0/XHQ2HKshgWI/AAAAAAAAHI8/GkflqlcLyjMznm1F_s5tJky3L4fLaDMkQCLcBGAs/s1600/image2a.png)

我们计划进一步投资于这个新的基于 web 的工具, 适用于 flutter 和 dart 开发人员, 随着基于 web 的体验集成的改进, 我们计划将这些服务直接构建到 visual studio 代码等工具中。

# flutter 接下来要做什么？

除了工程工作, 我们花了一些时间在 flutter 1.0 之后记录了我们的[2019年路线图](https://github.com/flutter/flutter/wiki/Roadmap), 你会看到我们还有很多工作要做。

2019年的一大重点是超越移动平台的 flutter 活动。在[ flutter live, 我们宣布了一个代号为 "蜂鸟" 的项目 ](), 它将 flutter 带到了网络上, 我们计划在未来几个月内分享一个技术预览。此外, 我们还继续努力将 flutter 带到桌面级设备上;这既需要在上述框架级别的工作, 也需要能够打包和部署应用程序的操作系统, 如 windows 和 mac, 我们正在其中投资通过我们的 flutter 桌面嵌入[项目](https://github.com/google/flutter-desktop-embedding)。

# Flutter 创造: 你能用 5 k 的 dart 做什么？

本周, 我们也很高兴推出[ flutter create ](https://flutter.dev/create), 这是一个挑战你建立一些有趣的, 鼓舞人心的, 美丽的 flutter 使用5千字节或更少的飞镖代码的比赛。5k 不是很多-对于一个典型的 mp3 文件, 它是大约三分之一的音乐-但我们打赌, 你可以让我们惊讶的是什么, 你可以实现什么 flutter 和这么小的代码。

![图片](https://user-gold-cdn.xitu.io/2019/2/27/1692cde25904c398?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

比赛一直持续到 4月7日, 所以你有几个星期的时间来打造一些很酷的东西。我们有一些伟大的奖品, 包括一个[满载的 imac pro 开发人员工作站](https://www.apple.com/imac-pro/specs/)与14核处理器和128gb 的内存, 价值超过 $10, 000!我们将在 [google i/o](https://events.google.com/io/) 宣布获奖者, 在那里我们将进行大量的 flutter 会谈、codelabs 和活动。

# 在结束时

flutter 现在是 github 上的前20名软件的 repos 之一, 全世界的社区都在与时俱进。在印度钦奈的会议、尼日利亚哈考特港的文章、哥本哈根、丹麦的应用和美国纽约市的孵化工作室之间, flutter 显然继续成为一个世界性的现象, 多亏了你。你可以在拥有数亿用户的[应用](https://play.google.com/store/apps/details?id=com.alibaba.intl.android.apps.poseidon)中看到 flutter, 也可以在[企业家将他们的第一个想法推向市场](https://play.google.com/store/apps/details?id=com.kissaan.gomitra)的应用中看到 flutter。看到你的想法范围很兴奋, 我们希望我们能帮助你用 flutter 表达。

![图片](https://user-gold-cdn.xitu.io/2019/2/27/1692cde261f430c7?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

在 SRM 大学 technozzare 进行一次 flutter 的深入研讨会。

最后, 我们最近推出了一个专门针对 flutter 的 youtube [频道](https://www.youtube.com/flutterdev)。一定要订阅在[ flutter. dev/youtube ](https://www.youtube.com/playlist?list=PLjxrf2q8roU3ahJVrSgAnPjzkpGmL9Czl)的节目, 包括针对 flutter [发展秀](https://www.youtube.com/playlist?list=PLjxrf2q8roU3ahJVrSgAnPjzkpGmL9Czl), [窗口小部件工具](https://www.youtube.com/playlist?list=PLjxrf2q8roU23XGwz3Km7sQZFTdB996iG), 和[ flutter 在焦点 ](https://www.youtube.com/playlist?list=PLjxrf2q8roU2HdJQDjJzOeO6J3FoFLWr2)。你还会发现一个新的案例研究从[梦 11](https://www.youtube.com/watch?v=lCeRZhoqEP8&feature=youtu.be), 一个流行的印度奇幻运动网站, 以及其他[开发商的故事](https://www.youtube.com/playlist?list=PLjxrf2q8roU33POuWi4bK0zvDpAHK6759)。在那儿见!

![图片](https://user-gold-cdn.xitu.io/2019/2/27/1692cde33881ba6b?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)