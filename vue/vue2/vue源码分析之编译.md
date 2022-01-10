# 编译

```JS
const { render, staticRenderFns } =  compileToFunctions(template, {
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments
  }, this)
options.render = render
options.staticRenderFns = staticRenderFns
```

```JS
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

此编译过程中的依赖的配置 baseOptions 会有所不同。而编译过程会多次执行，但这同一个平台下每一次的编译过程配置又是相同的，为了不让这些配置在每次编译过程都通过参数传入，Vue.js 利用了函数柯里化的技巧很好的实现了 baseOptions 的参数保留。同样，Vue.js 也是利用函数柯里化技巧把基础的编译过程函数抽出来，通过 createCompilerCreator(baseCompile) 的方式把真正编译的过程和其它逻辑如对编译配置处理、缓存处理等剥离开，这样的设计还是非常巧妙的。

同一个组件，多个地方用，就会多次编译啊，不过会缓存结果，直接从缓存里拿即可

浏览器处理p标签之内的div 是直接提取出来， vue 跟他保持一致

parse

编译过程首先就是对模板做解析，生成 AST，它是一种抽象语法树，是对源代码的抽象语法结构的树状表现形式。

```js
export function parse (
  template: string,
  options: CompilerOptions
): ASTElement | void {
  getFnsAndConfigFromOptions(options)

  parseHTML(template, {
    // options ...
    start (tag, attrs, unary) {
      let element = createASTElement(tag, attrs)
      processElement(element)
      treeManagement()
    },

    end () {
      treeManagement()
      closeElement()
    },

    chars (text: string) {
      handleText()
      createChildrenASTOfText()
    },
    comment (text: string) {
      createChildrenASTOfComment()
    }
  })
  return astRootElement
}
```

AST 元素节点总共有 3 种类型，type 为 1 表示是普通元素，为 2 表示是表达式，为 3 表示是纯文本。其实这里我觉得源码写的不够友好，这种是典型的魔术数字，如果转换成用常量表达会更利于源码阅读。

总结： 
parse 的目标是把 template 模板解析 ast 树，

整个parse 过程就是利用正则表达式顺序解析模板， 对不同的标签和节点有不同的处理过程，直到模板解析完毕。



optimize

```JS
export function optimize (root: ?ASTElement, options: CompilerOptions) {
  if (!root) return
  isStaticKey = genStaticKeysCached(options.staticKeys || '')
  isPlatformReservedTag = options.isReservedTag || no
  // first pass: mark all non-static nodes.
  markStatic(root)
  // second pass: mark static roots.
  markStaticRoots(root, false)
}

function genStaticKeys (keys: string): Function {
  return makeMap(
    'type,tag,attrsList,attrsMap,plain,parent,children,attrs' +
    (keys ? ',' + keys : '')
  )
}
```

markStatic(root) 标记静态节点 ，markStaticRoots(root, false) 标记静态根。

```JS
function isStatic (node: ASTNode): boolean {
  if (node.type === 2) { // expression
    return false
  }
  if (node.type === 3) { // text
    return true
  }
  return !!(node.pre || (
    !node.hasBindings && // no dynamic bindings
    !node.if && !node.for && // not v-if or v-for or v-else
    !isBuiltInTag(node.tag) && // not a built-in
    isPlatformReservedTag(node.tag) && // not a component
    !isDirectChildOfTemplateFor(node) &&
    Object.keys(node).every(isStaticKey)
  ))
}
```


解析子节点是不是static 只要有一个不是的话就跳出

```JS
    for (let i = 0, l = node.children.length; i < l; i++) {
      const child = node.children[i]
      markStatic(child)
      if (!child.static) {
        node.static = false
      }
    }
```

这个是对 if else 做个判断

```JS
    if (node.ifConditions) {
      for (let i = 1, l = node.ifConditions.length; i < l; i++) {
        const block = node.ifConditions[i].block
        markStatic(block)
        if (!block.static) {
          node.static = false
        }
      }
    }
```

总结：

* optimize 的目标是通过标记静态根的方式， 优化重新渲染过程中对静态节点的处理逻辑

* optimize的过程就是深度遍历这个ast 树， 先标记静态节点， 在标记静态根。


make static 就是为了后续 make static root
make static root 会在渲染过程中生成一个静态子 tree，也就是给 vnode 标记 isStatic，这样在 patchVnode 过程中就可以判断并跳过子树的对比。


## codegen

```JS
export function generate (
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  const code = ast ? genElement(ast, state) : '_c("div")'
  return {
    render: `with(this){return ${code}}`,
    staticRenderFns: state.staticRenderFns
  }
}

```

```js

function genNode (node: ASTNode, state: CodegenState): string {
  if (node.type === 1) {
    return genElement(node, state)
  } else if (node.type === 3 && node.isComment) {
    return genComment(node)
  } else {
    return genText(node)
  }
}
```

 会进行三种情况的判断

```JS
const compiled = compile(template, options)
res.render = createFunction(compiled.render, fnGenErrors)

function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}
```

实际上就是把 render 代码串通过 new Function 的方式转换成可执行的函数，赋值给 vm.options.render，这样当组件通过 vm._render 的时候，就会执行这个 render 函数。那么接下来我们就重点关注一下这个 render 代码串的生成过程。

总结：
codegen 的目标是把 ast 树转换成代码字符串，就是render 函数代码。然后再通过 new Function 转换成 render 函数，render 函数会返回一个 VNode 树，然后再 patch 过程中生成 DOM 树渲染到页面

整个 codegen 过程就是深度遍历 ast 树根据不同条件生成不同代码的过程。

我们平时写的 .vue 文件的时候写是template， 这个编译是发生在webpack 编译阶段， vue-loader 负责编译的。
