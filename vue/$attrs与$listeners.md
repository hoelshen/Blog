# vm.attrs与$listeners

## vm.$attrs

包含了父作用域中不作为 prop 被识别 (且获取) 的特性绑定 (class 和 style 除外)。简单点讲就是包含了所以父组件在子组件上设置的属性（除了prop传递的属性、class 和 style ）。

## vm.$listeners

包含了父作用域中的 (不含 .native 修饰器的) v-on 事件监听器。它可以通过 v-on="$listeners" 传入内部组件——在创建更高层次的组件时非常有用.简单点讲它是一个对象，里面包含了作用在这个组件上所有的监听器（监听事件），可以通过 v-on="$listeners" 将事件监听指向这个组件内的子元素（包括内部的子组件）。

## $inheritAttrs

默认情况下父作用域的不被认作 props 的特性绑定 (attribute bindings) 将会“回退”且作为普通的 HTML 特性应用在子组件的根元素上。当撰写包裹一个目标元素或另一个组件的组件时，这可能不会总是符合预期行为。通过设置 inheritAttrs 到 false，这些默认行为将会被去掉。

***注意：这个选项不影响 class 和 style 绑定。***

没有被 props绑定的属性就没有作为普通的 HTML 特性应用在子组件的根元素上。




