// 比较版本号
/**
 * @param {string} version1
 * @param {string} version2
 * @return {number}
 */
var compareVersion = function (version1, version2) {
  const v1 = version1.split(".");
  const v2 = version2.split(".");
  console.log("v1:", v1, v2);
  const len = Math.max(v1.length, v2.length);
  for (let i = 0; i < len; i++) {
    const a = v1[i] ? parseInt(v1[i]) : 0;
    const b = v2[i] ? parseInt(v2[i]) : 0;
    if (a !== b) {
      return a > b ? 1 : -1;
    }
  }
  return 0;
};
(version1 = "1.01"), (version2 = "1.001");
compareVersion(version1, version2);
