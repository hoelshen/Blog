/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var isAnagram = function(s, t) {
  if(s.length !== t.length) return false

  var hash = Array(26).fill(0);

  var codeA = "a".charCodeAt();

  let length = s.length;

  for(let i = 0; i < length;i++){
    hash[s.charCodeAt(i) - codeA]++
    hash[s.charCodeAt(i) - codeA]--
  }

  for(let value of hash){
    if(value !== 0) return false
  }

  return true
};