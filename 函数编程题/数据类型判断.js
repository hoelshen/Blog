function typeOfValue(value) {
  // const typeMap = {
  //   "[object Boolean]": "boolean",
  //   "[object Number]": "number",
  //   "[object String]": "string",
  //   "[object Function]": "function",
  //   "[object Array]": "array",
  //   "[object Date]": "date",
  // };
  return Object.prototype.toString.call(value).slice(8, -1);
}
console.log("typeOfValue", typeOfValue(true));
