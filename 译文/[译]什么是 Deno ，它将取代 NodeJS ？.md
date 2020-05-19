# 什么是 Deno ，它将取代 NodeJS ？

Deno v1.0.0 计划于 5 月 13 日发布。以下是一些有趣的事实，可能会在确定这一事实中起作用。

![deno](https://miro.medium.com/max/1400/1*GzfZZNWFeQ3kKJsKeKy7_A.jpeg)

简短的答案是（显然）现在还为时过早，但是这里有一些事实可能在确定这一点上起着重要作用。

对于初学者来说，[Deno](https://deno.land/) 是 Ryan Dahl 的创作，他也因创建称为 Node.js 的小东西而闻名，听起来很熟悉吗？这是否意味着 Deno 实际上是 Node 实际上的替代品，我们都应该开始计划重构吗？哎呀！但是，如果您想了解更多，请继续阅读！

## 让我们从头开始

在2018年，Ryan 进行了一次演讲，讲解了 Node.js 认为错误的十大问题，在演讲结束时，他揭开了Deno 的面纱，当时那只是一个小项目，他在其中构建您的内容中调用 No​​de.js v2，它得到了改进并且更加安全。

这是该演示文稿的视频：

油管内容:<iframe width="665" height="382" src="https://www.youtube.com/embed/M3BM9TB-8yA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

两年后，日期确定了：5月13日，即 Deno 1.0 正式发布的日期。一种用于后端的全新 JavaScript 运行时，但它不是用 C ++编写，而是基于 [Tokio](https://tokio.rs/) 平台（它提供JavaScript所需的异步运行时），是用 Rust 编写的，仍在运行 Google 的 V8 引擎。

## 但是还有什么新东西？

我们不仅在谈论与当前 Node.js 完全兼容的新 JavaScript 运行时，而是 Ryan 借此机会在 Deno 中加入了一些他认为较早的创作中所缺少的东西。

## 安全性已集成

默认情况下，Node.js 允许您访问所有内容，也就是说，您可以读写文件系统，发出传出请求，访问环境变量等。尽管作为具有这种访问权限的开发人员是有好处的，但如果您在编写自己的代码时不注意，也会带来安全风险。

因此，Deno 使用命令行参数来启用或禁用对不同安全功能的访问。因此，如果您需要脚本能够访问 /etc 文件夹，则可以执行以下操作：

```ts
deno --allow-read=/etc myscript.ts
```

这样一来，您的代码就可以从该文件夹中读取任何其他内容，并且会遇到安全异常。这类似于其他平台处理安全性的方式。如果您是 Android 用户，那么肯定有很多应用程序曾要求您允许它们访问手机内部的不同系统（例如联系人，电话，文件夹等），此处可以应用相同的概念。通过在执行脚本的命令行中使用这些标志，可以提供代码所需的权限。

## 更完整的标准库

自从第一个 Node 版本以来，JavaScript 改进了其标准库，但是与其他语言相比，它还有很长的路要走。 Deno 还试图改善这一点，并声称拥有一个非常完整的标准库，允许开发人员使用官方工具来执行基本任务，而只需要对复杂任务使用外部库（ala NPM）。
本质上讲，Deno 开箱即用，提供了将[颜色](https://deno.land/std/fmt/colors.ts)添加到终端文本，并与[外部数据结构](https://deno.land/std/encoding/README.md)（例如二进制，csv，yaml等），生成 [UUID](https://deno.land/std/uuid/README.md) 甚至编写 [websockets](https://deno.land/std/ws/README.md) 。还有其他更基本的模块可用，例如文件系统访问，日期帮助器功能，与http相关的功能以及[更多](https://deno.land/std/)

## 集成 Typescript

您没看错，如果您是 TypeScript 的爱好者，那么 Deno 就可以满足您的需要，不需要外部工具，默认情况下，转换为 JavaScript 是在内部完成的，因此无需担心。

尽管默认情况下，Deno 会处理很多事情，但是您可以使用自己的 tsconfig.json 文件覆盖配置：

```ts
deno run -c tsconfig.json [your-script.ts]
```

默认配置是使用严格模式，因此会立即警告任何不当使用的编码做法。

## 不再有 NPM 或 node_modules 文件夹

因为每个人和他的过去都有话要说，所以这是一个大问题。太臃肿了吗？分发依赖关系的方式错误吗？这绝对是 Node 最具争议的方面之一，而Deno 决定完全放弃它。

那么，Deno 如何处理依赖关系？到目前为止，只需允许您在任何地方都需要模块即可。换句话说，您可以简单地执行以下操作：

```ts
import * as log from "https://deno.land/std/log/mod.ts";
```

不再需要拥有自己的集中式存储库，但是您必须谨慎进行此操作，因为从无法控制的第三方来源导入模块会导致您打开并暴露于外界。

实际上，我们也缺少好朋友的 package.json，现在通过在名为 deps.ts 的文件中包含模块列表及其各自的 URL ，简化了依赖管理。但是版本控制呢？我听到你问。好的，您可以在 URL 上指定软件包的版本，虽然它不是很精美，但是可以使用。

普通的 deps.ts 文件可能如下所示：

```ts
export { assert } from "https://deno.land/std@v0.39.0/testing/asserts.ts";
export { green, bold } from "https://deno.land/std@v0.39.0/fmt/colors.ts";
```

这将重新导出模块，如果您想更改其版本，请相应地简化 URL 的修改。

顺便说一句，导入的代码是第一次执行脚本时进行缓存，直到使用 --reload 标志再次运行它为止。


## 还有什么？

Deno 还包含其他功能，例如开箱即用的大型工具，包括测试运行程序，调试器，文件监视程序等。但是再说一遍，其中一些只是该语言提供的 API ，您需要编写自己的工具才能使用它们。

以 Deno.watchFs 提供给您的文件监视程序 API 为例，如果您正在寻找与 nodemon 类似的解决方案，那么您必须自己构建它。这是一个解决类似问题的23行脚本，如下所示：

![code](https://miro.medium.com/max/1400/1*VI1E-bhnnp3bvjH7d3cMiA.png)

用户 Caesar2011 作为其回滚之一发布了该代码，您可以在此处找到[完整的代码]（https://github.com/Caesar2011/rhinoder/blob/master/mod.ts）。

## 那么，它将很快取代Node.js吗？

老实说，标题确实吸引人。我们中的某些人早在版本 0.10 左右的那天就开始使用 deno，而我们在生产中使用它！告诉你真相有点吓人，但是我们正在做，因为周围没有类似的事情。PHP，Python甚至 Ruby（更不用说Java或.NET）都无法与后端具有 JavaScript 和异步I / O模型相提并论。多年来，Node（和JavaScript）已经发展到可以满足行业要求。完美吗？哎呀！但是，就像生活中的任何其他事物一样，编程语言也不是完美无缺的。

Deno 没什么不同，只是因为现在，这只是一个想法大约 2 年工作的结晶。尚未在生产系统中进行尝试和测试。尚未对其进行审查，也未将其放入怪异和意外的用例中，以了解其如何处理这些边界情况。直到做到这一点，它才是供早期采用者使用的玩具。也许一年后，我们将开始听取公司的经验，分享他们的经验，他们如何解决新发现的缺点，最终，它背后的社区将使其适应有用的地步。它将取代 Node 吗？谁知道！我们将不得不拭目以待。

所以你怎么看？


[原文地址](https://blog.bitsrc.io/what-is-deno-and-will-it-replace-nodejs-a13aa1734a74) 