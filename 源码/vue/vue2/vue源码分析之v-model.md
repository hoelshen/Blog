# v-model  

addDirective 生成directiv属性

对浏览器的原生事件
select  input radio checkbox  texttarea

addProps(el, ‘value’, ‘$(${value})’)

addHandle(el, event, code , null, true) // 添加语法糖

注释例子：
:value=‘message’
@input=“message=$event.target.value”

所以在v-model 定义后 不能爱在props上定义

他们的区别： 中文事件

directive 会有一个inserted事件

expression  变现， 表达，态度
normalize  正常的
primitive  原始
strat  策略/战略
pascalcase 大驼峰
kebab-case (短横线分隔命名)
modifier 修饰符
invoke  援用，援引

## 表单元素

```JS
function genDefaultModel (
  el: ASTElement,
  value: string,
  modifiers: ?ASTModifiers
): ?boolean {
  const type = el.attrsMap.type

  // warn if v-bind:value conflicts with v-model
  // except for inputs with v-bind:type
  if (process.env.NODE_ENV !== 'production') {
    const value = el.attrsMap['v-bind:value'] || el.attrsMap[':value']
    const typeBinding = el.attrsMap['v-bind:type'] || el.attrsMap[':type']
    if (value && !typeBinding) {
      const binding = el.attrsMap['v-bind:value'] ? 'v-bind:value' : ':value'
      warn(
        `${binding}="${value}" conflicts with v-model on the same element ` +
        'because the latter already expands to a value binding internally'
      )
    }
  }

  const { lazy, number, trim } = modifiers || {}
  const needCompositionGuard = !lazy && type !== 'range'
  const event = lazy
    ? 'change'
    : type === 'range'
      ? RANGE_TOKEN
      : 'input'

  let valueExpression = '$event.target.value'
  if (trim) {
    valueExpression = `$event.target.value.trim()`
  }
  if (number) {
    valueExpression = `_n(${valueExpression})`
  }

  let code = genAssignmentCode(value, valueExpression)
  if (needCompositionGuard) {
    code = `if($event.target.composing)return;${code}`
  }

  addProp(el, 'value', `(${value})`)
  addHandler(el, event, code, null, true)
  if (trim || number) {
    addHandler(el, 'blur', '$forceUpdate()')
  }
}
```

```JS
/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */
export function genAssignmentCode (
  value: string,
  assignment: string
): string {
  const res = parseModel(value)
  if (res.key === null) {
    return `${value}=${assignment}`
  } else {
    return `$set(${res.exp}, ${res.key}, ${assignment})`
  }
}
```

```JS
addProp(el, 'value', `(${value})`)
addHandler(el, event, code, null, true)
```

这实例上是input 实现v-model 的精髓， 通过修改 ast 元素， 给 el 添加一个 prop， 相当于我们在 input 上动态绑定了 value，又给 el 添加了事件处理， 相当于在 input 上绑定了 input 事件， 其实转换成模板如下：

```htm
<input
  v-bind:value="message"
  v-on:input="message=$event.target.value">
```

其实就是动态绑定了 input 的 value 指向了 message 变量， 并且在触发 input 事件的时候去动态把 message 设置为目标值。

## 组件
