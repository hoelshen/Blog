const user = {
  name: "Jo<hn",
};
const result = `<h1>${user.name}</h1>`;
console.log(result);

const vm = require("vm");
console.log(
  vm.runInNewContext("`<h1>${helper(user.name)}</h1>`", {
    user,
    include: function (name) {
      return name;
    },
    helper: function (markup) {
      if (!markup) return "";
      return markup.replace(/</g, "&amp;");
    },
    _: function (markup) {
      if (!markup) return "";
      return markup.replace(/</g, "&amp;");
    },
  })
); // <h1>John</h1>
