# 分析provide 和 inject

## 使用 provide/inject 做全局状态管理

Vue 不会对 provide 中的变量进行响应式处理。所以，要想 inject 接受的变量是响应式的，provide 提供的变量本身就需要是响应式的。

```vue
// 父组件
<template>
  <div id="app">
    Parent组件
    <br />
    <button type="button" @click="changeName">改变name</button>
    <br />
    Parent组件中 name的值: {{ name }}

    <HelloWorld msg="Hello Vue in CodeSandbox!" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",
  components: {
    HelloWorld,
  },
  data() {
    return {
      name: "kevin",
      store: {
        login: true
      }
    };
  },
  created() {
    this.userInfo = "created";
  },
  provide() {
    return {
      getReaciveNameFromParent: () => this.name,
      store: () => this.store,
    };
  },
  methods: {
    changeName(val) {
      this.name = "New Kevin";
      this.store.login = false
    },
  },
};
</script>
```

```vue
// HelloWorld
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ion></ion>
    <h1>{{ msg }}</h1>
    <test></test>
  </div>
</template>

<script>
import ion from "./ion";
import test from "./test";
export default {
  name: "HelloWorld",
  components: {
    ion,
    test,
  },
  props: {
    msg: String,
  },
};
</script>

```

```vue
<template>
  <div class="ion">
    <div class="grandson-container">
      Grandson组件
      <br />
      <br />
      {{ reactiveNameFromParent }}
      <hr />
      test： {{ reactiveStore.login }}
    </div>
  </div>
</template>

<script>
export default {
  name: "ion",
  props: {
    msg: String,
  },
  inject: ["getReaciveNameFromParent", "store"],
  computed: {
    reactiveNameFromParent() {
      return this.getReaciveNameFromParent();
    },
    reactiveStore(){
       return this.store();
    }
  },
  watch: {
    reactiveNameFromParent: function (val) {
      console.log("来自Parent组件的name值发生了变化", val);
    },
  },
};
</script>

```

```vue
<template>
  <div class="test" @click="changeName">
  test： {{ reactiveStore.login }}</div>
</template>

<script>
export default {
  name: "test",
  props: {
    msg: String,
  },
  inject: ["store"],
  computed: {
    reactiveStore(){
       return this.store();
    }
  },
  methods: {
    changeName() {
      console.log("val",  this.reactiveStore.login);
       this.reactiveStore.login = !this.reactiveStore.login
    },
  },
};
</script>
```

[代码预览](https://codesandbox.io/s/stoic-solomon-xfvmd?file=/src/components/test.vue)

Vuex 和 provide/inject 最大的区别在于，Vuex 中的全局状态的每次修改是可以追踪回溯的，而 provide/inject 中变量的修改是无法控制的，换句话说，你不知道是哪个组件修改了这个全局状态。

## 原理

还记得我们注册全局组件过程中所用到的Vue.extend方法吗。

``` js
    Sub.options = mergeOptions(
        Super.options,
        extendOptions
    );
```

extendOptions 就包含我们inject属性，看看mergeOptions函数：

``` js
    function mergeOptions(
        parent,
        child,
        vm
    ) {
        {
            checkComponents(child);
        }

        if (typeof child === 'function') {
            child = child.options;
        }

        normalizeProps(child, vm);
        normalizeInject(child, vm);
        normalizeDirectives(child);

        // Apply extends and mixins on the child options,
        // but only if it is a raw options object that isn't
        // the result of another mergeOptions call.
        // Only merged options has the _base property.
        if (!child._base) {
            if (child.extends) {
                parent = mergeOptions(parent, child.extends, vm);
            }
            if (child.mixins) {
                for (var i = 0, l = child.mixins.length; i < l; i++) {
                    parent = mergeOptions(parent, child.mixins[i], vm);
                }
            }
        }

        var options = {};
        var key;
        for (key in parent) {
            mergeField(key);
        }
        for (key in child) {
            if (!hasOwn(parent, key)) {
                mergeField(key);
            }
        }

        function mergeField(key) {
            var strat = strats[key] || defaultStrat;
            options[key] = strat(parent[key], child[key], vm, key);
        }
        return options
    }
```

我们看看这个函数 **normalizeInject（child， vm）**

``` js
  /**
   * Normalize all injections into Object-based format
   */
  function normalizeInject(options, vm) {
      var inject = options.inject;
      if (!inject) {
          return
      }
      var normalized = options.inject = {};
      if (Array.isArray(inject)) {
          for (var i = 0; i < inject.length; i++) {
              normalized[inject[i]] = {
                  from: inject[i]
              };
          }
      } else if (isPlainObject(inject)) {
          for (var key in inject) {
              var val = inject[key];
              normalized[key] = isPlainObject(val) ?
                  extend({
                      from: key
                  }, val) : {
                      from: val
                  };
          }
      } else {
          warn(
              "Invalid value for option \"inject\": expected an Array or an Object, " +
              "but got " + (toRawType(inject)) + ".",
              vm
          );
      }
  }
```

  很简单就是把inject：『parentValue』 挂在了子组件中的options。inject对象下
  vm.$options.inject = {"parentValue": {"from": "parentValue"}}
  我们在实例化子组件的时候要用到， 看看实例化子组件时对 inject 的处理。 在 _init 时会调用
  这个函数

``` js
  function initInjections(vm) {
      var result = resolveInject(vm.$options.inject, vm);
      if (result) {
          toggleObserving(false);// 关闭响应式数据定义开关，保证在调用 defineReactive$$1 的时候不对数据进行响应式绑定
          Object.keys(result).forEach(function(key) {
              /* istanbul ignore else */
              {
                  defineReactive$$1(vm, key, result[key], function() {
                      warn(
                          "Avoid mutating an injected value directly since the changes will be " +
                          "overwritten whenever the provided component re-renders. " +
                          "injection being mutated: \"" + key + "\"",
                          vm
                      );
                  });
              }
          });
          toggleObserving(true);
      }
  }
```

看看这个 resloveInject

``` js
 function resolveInject(inject, vm) {
     if (inject) {

         // inject 是 :any 类型因为流没有智能到能够指出缓存
         const result = Object.create(null)
         // 获取 inject 选项的 key 数组
         const keys = hasSymbol ?
             Reflect.ownKeys(inject).filter(key => {
                 /* istanbul ignore next */
                 return Object.getOwnPropertyDescriptor(inject, key).enumerable
             }) :
             Object.keys(inject)

         for (let i = 0; i < keys.length; i++) {
             const key = keys[i]
             const provideKey = inject[key].from
             let source = vm

             // 循环向上， 直到拿到祖先节点中的 provide 值
             while (source) {
                 if (source._provided && provideKey in source._provided) {
                     result[key] = source._provided[provideKey]
                     break
                 }
                 source = source.$parent //关键代码
             }
             if (!source) {
                 if ('default' in inject[key]) {
                     const provideDefault = inject[key].default
                     result[key] = typeof provideDefault === 'function' ?
                         provideDefault.call(vm) :
                         provideDefault
                 } else if (process.env.NODE_ENV !== 'production') {
                     warn( `Injection "${key}" not found` , vm)
                 }
             }
         }
         return result
     }
```

从这个函数可以看到通过while循环，以及source = source.$parent 找到父组件中的_provided属性，拿到其值，也就拿到父组件提供的provide了。所以说孙组件可以拿到父组件中的数据。

接着是_provide属性

``` js
  function initProvide(vm) {
      var provide = vm.$options.provide;
      if (provide) {
          vm._provided = typeof provide === 'function' ?
              provide.call(vm) :
              provide;
      }
  }
```

在父组件实例化时， 我们也调用了 mergeOptions 对父组件的 provide 属性进行了处理：

``` js
if (options && options._isComponent) {
    // optimize internal component instantiation
    // since dynamic options merging is pretty slow, and none of the
    // internal component options needs special treatment.
    initInternalComponent(vm, options);
} else {
    vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
    );
}
```

这个options 参数里面包含 provide 属性。 看看mergeOptions 函数对 provide 的处理.

``` js
strats.provide = mergeDataOrFn;

function mergeDataOrFn(
    parentVal,
    childVal,
    vm
) {
    if (!vm) {
        // in a Vue.extend merge, both should be functions
        if (!childVal) {
            return parentVal
        }
        if (!parentVal) {
            return childVal
        }
        // when parentVal & childVal are both present,
        // we need to return a function that returns the
        // merged result of both functions... no need to
        // check if parentVal is a function here because
        // it has to be a function to pass previous merges.
        return function mergedDataFn() {
            return mergeData(
                typeof childVal === 'function' ? childVal.call(this, this) : childVal,
                typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
            )
        }
    } else {
        return function mergedInstanceDataFn() {
            // instance merge
            var instanceData = typeof childVal === 'function' ?
                childVal.call(vm, vm) :
                childVal;
            var defaultData = typeof parentVal === 'function' ?
                parentVal.call(vm, vm) :
                parentVal;
            if (instanceData) {
                return mergeData(instanceData, defaultData)
            } else {
                return defaultData
            }
        }
    }
}
```

vm.$options.provide 就是 mergedInstanceDataFn 函数。通过调用这个函数我们 _provided 就成为了 {"parentValue":"here is parent data"}。

