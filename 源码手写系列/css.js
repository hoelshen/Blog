假设 CSS 选择器有如下权重规则：
• ID 选择器（如 #container），权重 1000
• 类、属性、伪类选择器（如 .element 、[type=text] 、 :hover），权重 100
• 标签、伪元素选择器（如 body 、 ::first-child ），权重 10
选择器表达式的权重为其包含选择器的权重之和，比如 #container > body 权重为 1010。请构造一个函数，对任意 CSS 选择器的优选级进行比较：
/**
 * @param {string} a 选择器表达式
 * @param {string} b 选择器表达式
 * @return {number} 返回权重差
 */
function compare (a, b) {
  let priority_a = 0;
  let priority_b = 0;
  // TODO 你的代码
  
  return priority_a - priority_b;
}
// 验证用例：
compare('#container > .element', 'body > .element') === 990;
compare('body', '.element') === -90;
compare('.element + .element::last-child', '.element:hover') === 10;
compare('input[type=text]', 'li:hover') === 0;