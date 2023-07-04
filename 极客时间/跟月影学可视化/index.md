##

我们不能停留在可视化现有的库、框架和工具的使用层面上，必须深入技术栈的底层，充分理解数据，掌握视觉呈现相关的技术和基本原理。打好基础之后，再系统地学习可视化领域的方法论，才能提高解决问题的能力

![可视化图谱](2023-07-03-22-56-36.png)

可视化的视觉主要设计四个部分，分别是理论基础、图形系统、图形库和工具

视觉部分的理论基础就是数学和图形学

![](2023-07-03-23-15-09.png)

![](2023-07-03-23-25-12.png)

Web 开发以呈现块状内容为主，所以 HTML 是更合适的技术。而可视化开发因为需要呈现各种各样的形状、结构，所以，形状更丰富的 SVG 以及更底层的 Canvas2D 和 WebGL 就是更合适的技术了。

其次，Web 开发着重于处理普通的文本和多媒体信息，渲染普通的、易于阅读的文本和多媒体内容，而可视化开发则着重于处理结构化数据，渲染各种相对复杂的图表和图形元素。

就是 Web 开发的前端主要还是关注内容和样式，图形的渲染和绘制是由浏览器底层来完成的，而可视化前端则可能要深入底层渲染层，去真正地控制图形的绘制和细节的呈现。

可视化与 Web 前端一样，最终都是以图像呈现在浏览器上，因此有许多通用的方法论。

二者都使用 JavaScript，而且都是浏览器端的 JavaScript。

可视化领域的工具：

我们可以把这些工具大体上分为四类，分别是：
专业呈现各种类型图表的图表库；
专业处理地图、地理位置的可视化地理库；
专业处理视觉呈现的渲染库；
以及处理数据的数据驱动框架。

如果要绘制更加复杂的地图，比如，一座城市的交通线路和建筑物三维模型，或者一个园区的立体建筑模型等等，我们可能要依赖专业的 GIS 地图库。社区中比较成熟的 GIS 库也不少，比较常见的像 Mapbox、Leaflet、Deck.gl、CesiumJS 等等。

如果要绘制其他更灵活的图形、图像或者物理模型，我们常用的一些图表库就不一定能完成了。这个时候，我们可以用 ThreeJS、SpriteJS 这样比较通用的渲染库（实际上图表库或 GIS 地图库本身底层渲染也基于这些渲染库）。我们可以选择通用的图形库，比如，2D 渲染可以选择 SpriteJS，3D 渲染可以选择 ThreeJS、BabylonJS 以及 SpriteJS3D 扩展等等。

除了这些库之外，还有一类比较特殊的库，比如 D3.js，它属于数据驱动框架。那什么是数据驱动框架呢？这是一种特殊的库，它们更专注于处理数据的组织形式，而将数据呈现交给更底层的图形系统（DOM、SVG、Canvas）或通用图形库（SpriteJS、ThreeJS）去完成。

## 浏览器中实现可视化的四种方式

1. 传统的 html+CSS

2. SVG

3. Canvas2D

4. WebGL

用 GPU 渲染各种复杂的 2D 和 3D 图形。值得一提的是，WebGL 利用了 GPU 并行处理的特性，这让它在处理大量数据展现的时候，性能大大优于前 3 种绘图方式。

浏览器的渲染引擎在工作时，要先解析 HTML、SVG、CSS，构建 DOM 树、RenderObject 树和 RenderLayer 树，然后用 HTML（或 SVG）绘图。当图形发生变化时，我们很可能要重新执行全部的工作，这样的性能开销是非常大的。

![](2023-07-04-00-06-19.png)

一般情况下，Canvas2D 绘制图形的性能已经足够高了，但是在三种情况下我们有必要直接操作更强大的 GPU 来实现绘图。第一种情况，如果我们要绘制的图形数量非常多，比如有多达数万个几何图形需要绘制，而且它们的位置和方向都在不停地变化，那我们即使用 Canvas2D 绘制了，性能还是会达到瓶颈。这个时候，我们就需要使用 GPU 能力，直接用 WebGL 来绘制。

第二种情况，如果我们要对较大图像的细节做像素处理，比如，实现物体的光影、流体效果和一些复杂的像素滤镜。由于这些效果往往要精准地改变一个图像全局或局部区域的所有像素点，要计算的像素点数量非常的多（一般是数十万甚至上百万数量级的）。这时，即使采用 Canvas2D 操作，也会达到性能瓶颈，所以我们也要用 WebGL 来绘制。

第三种情况是绘制 3D 物体。因为 WebGL 内置了对 3D 物体的投影、深度检测等特性，所以用它来渲染 3D 物体就不需要我们自己对坐标做底层的处理了。那在这种情况下，WebGL 无论是在使用上还是性能上都有很大优势。

## 要点总结

HTML+CSS 的优点是方便，不需要第三方依赖，甚至不需要 JavaScript 代码。如果我们要绘制少量常见的图表，可以直接采用 HTML 和 CSS。它的缺点是 CSS 属性不能直观体现数据，绘制起来也相对麻烦，图形复杂会导致 HTML 元素多，而消耗性能。

SVG 是对 HTML/CSS 的增强，弥补了 HTML 绘制不规则图形的能力。

![技术选型](2023-07-04-20-05-39.png)

canvas2d 绘图是通过自身的 api，gpu 是浏览器底层调用的，不受开发者控制。webgl 不一样，将数据写入帧缓冲之后，最终通过 WebGLProgram 来执行 shader 完成图形渲染，所以 webgl 能够自己控制 gpu 渲染。

有很多图形计算，webgl 是可以放在 shader 里面去计算的，这样比用 js 计算快，这就是 gpu 和 cpu 计算的区别。

另外为什么 threejs 的自定义的 shader 会更好，也是因为我们可以在 shader 中完成一些计算，还有 threejs 精灵默认的 shader 是根据材质生成的，里面的计算也是依照一些规则来给出的。自定义 shader 更灵活。

## 如何用 canvas 绘制 几何图形

1. canvas 的 html 属性宽高为画布宽高，css 样式宽高为样式宽高

在实际绘画中，如果我们不设置 canvas 元素的样式，那么 canvas 元素的画布宽高就会等于它的样式宽高的像素值，也就是 512px。

画布宽高决定了可视区域的坐标范围，所以 canvas 将画布宽高和样式宽高分开的做法，能更方便地适配不同的显示设备

2. canvas 的坐标系

canvas 的坐标系是以左上角为原点，向右为 x 轴正方向，向下为 y 轴正方向，单位是像素。

3. canvas 的绘图 api

canvas 的绘图 api 有两类，一类是绘制状态的 api，另一类是绘制图形的 api。

获取 canvas 上下文对象

```js
canvas.getContext("2d");
```

我们拿到的 context 对象上会有许多 API，它们大体上可以分为两类：

一类是设置状态的 API，可以设置或改变当前的绘图状态，比如，改变要绘制图形的颜色、线宽、坐标变换等等；

另一类是绘制指令 API，用来绘制不同形状的几何图形。

其中，context.rect 是绘制矩形的 Canvas 指令，它的四个参数分别表示要绘制的矩形的 x、y 坐标和宽高。在这里我们要绘制的正方形宽高都是 100，所以后两个参数是 100 和 100。

那在实际绘制之前，我们还有一些工作要做。我要将正方形填充成红色，这一步通过调用 context.fillStyle 指令就可以完成。然后，我们要调用一个 beginPath 的指令，告诉 Canvas 我们现在绘制的路径。接着，才是调用 rect 指令完成绘图。最后，我们还要调用 fill 指令，将绘制的内容真正输出到画布中。这样我们就完整了绘制，绘制的效果和代码如下：

```JS
//JavaScript

const rectSize = [100, 100];
context.fillStyle = 'red';
context.beginPath();
context.rect(0.5 * canvas.width, 0.5 * canvas.height, ...rectSize);
context.fill();
```

移动图形中心

1. 通过 translate 方法移动图形中心

第一种做法是，我们可以让 rect 指令的 x、y 参数，等于画布宽高的一半分别减去矩形自身宽高的一半。这样，我们就把正方形的中心点真正地移动到画布中心了。代码如下所示：

```JS
//JavaScript
context.rect(0.5 * (canvas.width - rectSize[0]), 0.5 * (canvas.height - rectSize[1]), ...rectSize);
```

2.  第二种做法是，我们可以先给画布设置一个平移变换（Translate），然后再进行绘制。代码如下所示

```JS
//JavaScript

context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]);

```

第一种方式很简单，它直接改变了我们要绘制的图形顶点的坐标位置，但如果我们绘制的不是矩形，而是很多顶点的多边形，我们就需要在绘图前重新计算出每个顶点的位置，这会非常麻烦。第二种方式是对 Canvas 画布的整体做一个平移操作，这样我们只需要获取中心点与左上角的偏移，然后对画布设置 translate 变换就可以了，不需要再去改变图形的顶点位置。不过，这样一来我们就改变了画布的状态。如果后续还有其他的图形需要绘制，我们一定要记得把画布状态给恢复回来。好在，这也不会影响到我们已经画好的图形。

那怎么把画布状态恢复回来呢？恢复画布状态的方式有两种，第一种是反向平移。
反向平移的原理也很简单，你可以直接看下面的代码。

```JS
//JavaScript
// 平移context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]);... 执行绘制

// 恢复context.translate(0.5 * rectSize[0], 0.5 * rectSize[1]);
```

除了使用反向平移的恢复方式以外，Canvas 上下文还提供了 save 和 restore 方法，可以暂存和恢复画布某个时刻的状态。其中，save 指令不仅可以保存当前的 translate 状态，还可以保存其他的信息，比如，fillStyle 等颜色信息。 而 restore 指令则可以将状态指令恢复成 save 指令前的设置。操作代码如下：

```JS

//JavaScript

context.save(); // 暂存状态
// 平移
context.translate(-0.5 * rectSize[0], -0.5 * rectSize[1]);

... 执行绘制

context.restore(); // 恢复状态
```

在操作之前呢，我们先引入一个概念层次结构数据 （Hierarchy Data），它是可视化领域的专业术语，用来表示能够体现层次结构的信息，例如城市与省与国家。一般来说，层次结构数据用层次关系图表来呈现。

首先，我们讲了利用 Canvas 绘制几何图形，这个过程很简单，不过依然有 3 点需要我们注意：在 HTML 中建立画布时，我们要分别设置画布宽高和样式宽高；在建立坐标系时，我们要注意 canvas 的坐标系和笛卡尔坐标系在 y 轴上是相反的；如果要把图形绘制在画布中心，我们不能直接让 x、y 的坐标等于画布中心坐标，而是要让图形中心和画布中心的位置重叠。这个操作，我们可以通过计算顶点坐标或者 平移变换来实现。

# 03 | 声明式图形系统：如何用 SVG 图形元素绘制可视化图表？

SVG 的全称是 Scalable Vector Graphics，可缩放矢量图，它是浏览器支持的一种基于 XML 语法的图像格式。

利用 svg 绘制几何图形，svg 属于声明式绘图系统，它的绘制方式和 canvas 不同。

```JS
<svg xmlns="http://www.w3.org/2000/svg" version="1.1">
  <circle cx="100" cy="50" r="40" stroke="black"
  stroke-width="2" fill="orange" />
</svg>
```

svg 元素是 SVG 的根元素，属性 xmlns 是 xml 的名字空间。那第一行代码就表示，svg 元素的 xmlns 属性值是"http://www.w3.org/2000/svg"，浏览器根据这个属性值就能够识别出这是一段 SVG 的内容了

svg 元素下的 circle 元素表示这是一个绘制在 SVG 图像中的圆形，属性 cx 和 cy 是坐标，表示圆心的位置在图像的 x=100、y=50 处。属性 r 表示半径，r=40 表示圆的半径为 40。

通过 svg 元素设置 viewBox 属性，来改变 svg 的坐标系。如果设置了 viewBox 属性，那 svg 内部的绘制就是相对于 svg 坐标系的了。

```JS

if(children) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    for(let i = 0; i < children.length; i++) {
      draw(group, children[i], {fillStyle, textColor});
    }
    parent.appendChild(group);
  }
```

SVG 的 g 元素表示一个分组，我们可以用它来对 SVG 元素建立起层级结构。而且，如果我们给 g 元素设置属性，那么它的子元素会继承这些属性。

最后，如果下一级没有数据了，那我们还是需要给它添加文字

```JS

else {
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('fill', textColor);
    text.setAttribute('font-family', 'Arial');
    text.setAttribute('font-size', '1.5rem');
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('x', x);
    text.setAttribute('y', y);
    const name = node.data.name;
    text.textContent = name;
    parent.appendChild(text);
  }
```

首先，我们要给 SVG 的根元素添加 mousemove 事件，添加代码的操作很简单，你可以直接看代码。

```JS

 let activeTarget = null;
  svgroot.addEventListener('mousemove', (evt) => {
    let target = evt.target;
    if(target.nodeName === 'text') target = target.parentNode;
    if(activeTarget !== target) {
      if(activeTarget) activeTarget.setAttribute('fill', 'rgba(0, 0, 0, 0.2)');
    }
    target.setAttribute('fill', 'rgba(0, 128, 0, 0.1)');
    activeTarget = target;
  });

```

我们知道，SVG 作为一种浏览器支持的图像格式，既可以作为 HTML 内嵌元素使用，也可以作为图像通过 img 元素加载，或者绘制到 Canvas 内。

而用 SVG 绘制可视化图形与用 Canvas 绘制有明显区别，SVG 通过创建标签来表示图形元素，然后将图形元素添加到 DOM 树中，交给 DOM 完成渲染。

使用 DOM 树渲染可以让图形元素的用户交互实现起来非常简单，因为我们可以直接对图形元素注册事件。但是这也带来问题，如果图形复杂，那么 SVG 的图形元素会非常多，这会导致 DOM 树渲染成为性能瓶颈。

04 | GPU 与渲染管线：如何用 WebGL 绘制最简单的几何图形？

一个通用计算机图形系统主要包括 6 个部分，分别是输入设备、中央处理单元、图形处理单元、存储器、帧缓存和输出设备。

光栅（Raster）：几乎所有的现代图形系统都是基于光栅来绘制图形的，光栅就是指构成图像的像素阵列。

像素（Pixel）：一个像素对应图像上的一个点，它通常保存图像上的某个具体位置的颜色等信息。

帧缓存（Frame Buffer）：在绘图过程中，像素信息被存放于帧缓存中，帧缓存是一块内存地址。

CPU（Central Processing Unit）：中央处理单元，负责逻辑计算。

GPU（Graphics Processing Unit）：图形处理单元，负责图形计算。

![绘图过程](2023-07-17-23-21-11.png)

首先，数据经过 CPU 处理，成为具有特定结构的几何信息。然后，这些信息会被送到 GPU 中进行处理。在 GPU 中要经过两个步骤生成光栅信息。这些光栅信息会输出到帧缓存中，最后渲染到屏幕上。

![图形数据经过GPU处理最终输出到屏幕上](2023-07-17-23-22-38.png)

这个绘图过程是现代计算机中任意一种图形系统处理图形的通用过程。

它主要做了两件事，一是对给定的数据结合绘图的场景要素（例如相机、光源、遮挡物体等等）进行计算，最终将图形变为屏幕空间的 2D 坐标。

二是为屏幕空间的每个像素点进行着色，把最终完成的图形输出到显示设备上。这整个过程是一步一步进行的，前一步的输出就是后一步的输入，所以我们也把这个过程叫做渲染管线（RenderPipelines）。

GPU

每处理一个像素点就相当于完成了一个简单的任务，而一个图片应用又是由成千上万个像素点组成的。

GPU 是由大量的小型处理单元构成，它可能远没有 CPU 那么强大，但胜在数量众多，可以保证每个单元处理一个简单的任务。

如何用 WebGL 绘制最简单的几何图形？

1.创建 WebGL 上下文

```JS
const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');
```

2.创建 WebGL 程序（WebGL Program）

```JS

const vertex = `
  attribute vec2 position;

  void main() {
    gl_PointSize = 1.0;
    gl_Position = vec4(position, 1.0, 1.0);
  }
`;


const fragment = `
  precision mediump float;

  void main()
  {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
`;
```

这里的 WebGL 程序是一个 WebGLProgram 对象，它是给 GPU 最终运行着色的程序，而不是我们正在写的三角形的 JavaScript 程序。

要创建这个 webGL 程序，我们需要两个着色器。它是由两个着色器组成的，一个是顶点着色器，一个是片元着色器。

在绘图的时候，WebGL 是以顶点和图元来描述图形几何信息的。顶点就是几何图形的顶点，比如，三角形有三个顶点，四边形有四个顶点。**图元是 WebGL 可直接处理的图形单元，由 WebGL 的绘图模式决定，有点、线、三角形**等等。

所以，顶点和图元是绘图过程中必不可少的。因此，WebGL 绘制一个图形的过程，一般需要用到两段着色器，一段叫顶点着色器（Vertex Shader）负责处理图形的顶点信息，另一段叫片元着色器（Fragment Shader）负责处理图形的像素信息。

更具体点来说，我们可以把顶点着色器理解为处理顶点的 GPU 程序代码。它可以改变顶点的信息（如顶点的坐标、法线方向、材质等等），从而改变我们绘制出来的图形的形状或者大小等等。

顶点处理完成之后，WebGL 就会根据顶点和绘图模式指定的图元，计算出需要着色的像素点，然后对它们执行片元着色器程序。简单来说，就是对指定图元中的像素点着色。

⚠️： 图元是 WebGL 可直接处理的图形单元，所以其他非图元的图形最终必须要转换为图元才可以被 webGL 处理。

**举个例子，如果我们要绘制实心的四边形，我们就需要将四边形拆分成两个三角形，再交给 WebGL 分别绘制出来。**

无论有多少个像素点，片元着色器都可以同时处理

以上就是片元着色器的作用和使用特点了，关于顶点着色器的作用我们一会儿再说。说了这么多，你可别忘了，创建着色器的目的是为了创建 WebGL 程序，那我们应该如何用顶点着色器和片元着色器代码，来创建 WebGL 程序呢？

首先，因为在 JavaScript 中，顶点着色器和片元着色器只是一段代码片段，所以我们要将它们分别创建成 shader 对象。代码如下所示：

```JS

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertex);
gl.compileShader(vertexShader);


const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragment);
gl.compileShader(fragmentShader);
```

接着，我们创建 WebGL 程序对象，然后将顶点着色器和片元着色器对象附加到 WebGL 程序对象上，最后链接 WebGL 程序对象，就可以创建出 WebGL 程序了。代码如下所示：

```JS

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
```

WebGLProgram 对象的创建过程主要是添加 vertexShader 和 fragmentShader，然后将这个 WebGLProgram 对象链接到 WebGL 上下文对象上。

最后，我们要通过 useProgram 选择启用这个 WebGLProgram 对象。这样，当我们绘制图形时，GPU 就会执行我们通过 WebGLProgram 设定的 两个 shader 程序了。

3.将数据存入缓冲区

webGL 使用的数据需要用类型数组定义，默认格式是 Float32Array.Float32Array 是 JavaScript 的一种类型化数组（TypedArray），JavaScript 通常用类型化数组来处理二进制缓冲区。

```JS

const points = new Float32Array([
  -1, -1,
  0, 1,
  1, -1,
]);

```

接着，我们将定义好的数据写入 webGL 的缓冲区。

```JS

const bufferId = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

```

这个过程我们可以简单总结为三步，分别是创建一个缓存对象，将它绑定为当前操作对象，再把当前的数据写入缓存对象。这三个步骤主要是利用 createBuffer、bindBuffer、bufferData 方法来实现的，过程很简单你可以看一下我下面给出的实现代码

4.将缓冲区数据读取到 GPU

现在我们已经把数据写入缓存了，但是我们的 shader 现在还不能读取这个数据，还需要把数据绑定给顶点着色器中的 position 变量。

```JS
attribute vec2 position;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(position, 1.0, 1.0);
}
```

在 GLSL 中，attribute 表示声明变量，vec2 是变量的类型，它表示一个二维向量，position 是变量名。接下来我们将 buffer 的数据绑定给顶点着色器的 position 变量。

```JS


const vPosition = gl.getAttribLocation(program, 'position'); //获取顶点着色器中的position变量的地址
gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0); //给变量设置长度和类型
gl.enableVertexAttribArray(vPosition); //激活这个变量

```

经过这样的处理，在顶点着色器中，我们定义的 points 类型数组中对应的值，就能通过变量 position 读到了。

5.GPU 执行 WebGL 程序，输出结果

我们把数据传入缓冲区，gpu 也可以读取绑定的数据到着色器变量了。

我们先调用 gl.clear 将当前画布的内容清除，然后调用 gl.drawArrays 传入绘制模式。这里我们选择 gl.TRIANGLES 表示以三角形为图元绘制，再传入绘制的顶点偏移量和顶点数量，WebGL 就会将对应的 buffer 数组传给顶点着色器，并且开始绘制。代码如下：

```JS
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
```

在片元着色器中，我们设置了 gl_FragColor 的值为红色，所以最终绘制出来的图形就是一个红色的三角形。

```JS

precision mediump float;

void main()
{
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```

顶点着色器的作用

顶点着色器大体可以总结为两个作用： 一是通过 gl_Position 设置顶点，二十通过定义 varying 变量，将数据传递给片元着色器。

1. 通过 gl_Position 设置顶点

例如，我想把三角形的周长缩小为原始大小的一半，两种处理方式： 一种是修改 points 数组的值，一种是直接对顶点着色器数据进行处理。

我们不需要修改 points 数据，只需要在顶点着色器中，将 gl_Position = vec4(position, 1.0, 1.0); 修改为 gl_Position = vec4(position \* 0.5, 1.0, 1.0);，代码如下所示。

```JS

attribute vec2 position;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(position * 0.5, 1.0, 1.0);
}

```

2. 通过定义 varying 变量，将数据传递给片元着色器

我们可以通过定义 varying 变量，将数据传递给片元着色器。例如，我们想让三角形的颜色随着顶点的位置变化而变化，那我们就可以在顶点着色器中定义一个 varying 变量，然后在片元着色器中读取这个变量，代码如下所示：

```JS

attribute vec2 position;
varying vec4 color;

void main() {
  gl_PointSize = 1.0;
  gl_Position = vec4(position, 1.0, 1.0);
  color = vec4(0.5 + position * 0.5, 0.0, 1.0);
}

```

```JS

precision mediump float;
varying vec3 color;

void main()
{
  gl_FragColor = vec4(color, 1.0);
}
```

![](2023-07-23-13-00-45.png)

05 | 如何用向量和坐标系描述点和线段？

如果我们手中只有解决具体问题的工具，没有统一的方法论，那我们也无法一劳永逸地解决问题的根本。

坐标系与坐标映射

HTML 采用的窗口坐标系，以参考对象的左上角为原点，向右为 x 轴正方向，向下为 y 轴正方向，单位是像素。

SVG 采用的是视区盒子坐标系。这个坐标系在默认情况下，是以 svg 根元素左上角为原点，向右为 x 轴正方向，向下为 y 轴正方向，单位是像素。如果我们设置了 viewBox 属性，那么 svg 根元素左上角为 viewBox 的前两个值，右下角为 viewBox 的后两个值。

Canvas 采用的坐标系我们比较熟悉了，它默认以画布左上角为坐标原点，右下角坐标值为 Canvas 的画布宽高值。

WebGL 的坐标系比较特殊，是一个三维坐标系。它默认以画布正中间为坐标原点，x 轴朝右，y 轴朝上，z 轴朝外，x 轴、y 轴在画布中范围是 -1 到 1。

坐标变换的好处： 它能够简化计算量，这不仅让代码更容易理解，也可以节省 CPU 运算时间

向量运算的意义：

可视化呈现依赖于计算机图形学，而向量运算是整个计算机图形学的数学基础
