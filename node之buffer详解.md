// const buffer = new Buffer(10);
// console.log('buffer', buffer.length);


const buf = new Buffer([1,2,3])
console.log('buf', buf)



//下面这些是在Buffer构造函数中使用到的一些基本的方法：

//smalloc为内存操作的对象
var smalloc = process.binding('smalloc');

//util为工具函数，包含一些基本的操作方法
var util = require('util');

//alloc对象用于生成一段内存的方法
var alloc = smalloc.alloc;

//truncate类似于一个查找方法，比如在数据库中根据一定的条件查表。
var truncate = smalloc.truncate;

//我的理解，这个sliceOnto是属于合并拼接内存区间所用
var sliceOnto = smalloc.sliceOnto;

//kMaxLength为生成内存区间的最大容量
var kMaxLength = smalloc.kMaxLength;

//pollSize表示自定义的一个值
Buffer.poolSize = 8 * 1024;

var poolSize, poolOffset, allocPool;
//定义的三个全局变量，也算是闭包内的私有变量

//上述的含义，是我再读源码时，按照当时的逻辑理解的意思，还没有去看相关部分的源码，所以，如果有任何疑问，请指教。

//createPool用于生成一个内存区间的，并把生成的内存区间存入allocPool
function createPool() {
  poolSize = Buffer.poolSize;
  allocPool = alloc({}, poolSize);
  //allocPool保存生成的一段大小为poolSize的内存区间
  poolOffset = 0;
  //在生成的内存中使用位置的偏移量，用于保存当前内存区间的使用量，
  //防止被后面的数据覆盖掉。
}
createPool();
//先生成一段供使用

//下述构造函数中，英文注释是源码中的注释，中文是我的理解注释。
function Buffer(subject, encoding) {
  if (!util.isBuffer(this)){
    //如果忘记使用new ，则重定义
    return new Buffer(subject, encoding);
  }

  if (util.isNumber(subject)) {
    //这里就是我们前面第一种实例化的源代码逻辑部分。
    
    //如果第一个参数是一个数字，那么把该数字，定义为数组的长度
    this.length = +subject;

  } else if (util.isString(subject)) {
    //实例化时，第三种实例化源码逻辑处理
    
    //如果第一个参数是字符串
    if (!util.isString(encoding) || encoding.length === 0){
      //第二个参数不是字符串，则把第二个默认为utf8的编码
      encoding = 'utf8';
    }
    
    //按照规定的编码方式，计算字符串的长度，并定义为在数组的长度
    this.length = Buffer.byteLength(subject, encoding);

  // Handle Arrays, Buffers, Uint8Arrays or JSON.
  } else if (util.isObject(subject)) {
    //构造函数第二种实例化处理逻辑
    
    //如果第一个参数是一个对象
    if (subject.type === 'Buffer' && util.isArray(subject.data)){
      //如果第一个参数是buffer类型或者array类型，则直接处理
      subject = subject.data;
    }
    //定义数组的长度
    this.length = +subject.length;

  } else {
    //否则，抛出一个错误，第一个参数的类型，
    //必须是固定的四种类型，其他类型是不被支持的。
    throw new TypeError('must start with number, buffer, array or string');
  }

  //判断数组长度，是否超出最大长度，也就是数组时否溢出。
  if (this.length > kMaxLength) {
    //如果当前的buffer数组，过长，则抛出一个“范围异常”
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength.toString(16) + ' bytes');
  }

  //判断当前数组的长度是否小于0，如果是，则置为0
  if (this.length < 0)
    this.length = 0;
  else
    this.length >>>= 0;  // Coerce to uint32.
    //无符号右移，变化为数字的方法

  this.parent = undefined;
  if (this.length <= (Buffer.poolSize >>> 1) && this.length > 0) {
  //在判断是否需要重新分配内存空间，不需要生成的话，则执行该部分逻辑
  //如果需要生成的内存buffer的大小，占生成内存区间大小的一半之上的话
  //则重新分配一整段的内存区间，存放该数据
    if (this.length > poolSize - poolOffset){
     //需要重新分配内存区间
     createPool();
    }
    
    //parent表示，当前生成的buffer数组，是属于那一段内存区间的。
    //allocPool表示上次生成的一段内存区间，或者前面刚刚生成的内存区间。
    this.parent = sliceOnto(allocPool,
                            this,
                            poolOffset,
                            poolOffset + this.length);
    
    //更新内存区间已使用的值，下次再有新的Buffer创建时，从该偏移继续保存数据
    poolOffset += this.length;

    // Ensure aligned slices
    //没有看出来，这个是在干嘛？
    //按我的感觉，应该是为了规范一下poolOffset的值，使得数据可以保存的更有规律
    if (poolOffset & 0x7) {
      poolOffset |= 0x7;
      poolOffset++;
    }
  } else {
  //给该数据，生成一个单独的静态内存区间，保存数据
    alloc(this, this.length);
  }

  if (util.isNumber(subject)) {
  //如果第一个参数是数字，那么这里就可以结束了。
    return;
  }

  if (util.isString(subject)) {
    // In the case of base64 it's possible that the size of the buffer
    // allocated was slightly too large. In this case we need to rewrite
    // the length to the actual length written.
    var len = this.write(subject, encoding);
    //调用buffer对象的write方法，write方法，后面再看~
    // Buffer was truncated after decode, realloc internal ExternalArray
    //如果当前的第一个参数是字符串，那么就把该字符串根据encoding的类型，写入到this的buffer对象上去
    
    //
    if (len !== this.length) {
    //如果是字符串，在不同的编码下，字符串保存的数据大小时有区别的
    //所以，这里对该部分，进行单独的特殊处理。
    
      var prevLen = this.length;
      //保存当前buffer的长度
      
      this.length = len;
      //更新到最新的长度。
      
      truncate(this, this.length);
      //更新该buffer数组
      
      // Only need to readjust the poolOffset if the allocation is a slice.
      if (this.parent != undefined)
        poolOffset -= (prevLen - len);
        //更新内存区间中poolOffset的位置，防止下次Buffer实例化时，
        //把该部分数据给覆盖掉。
    }

  } else if (util.isBuffer(subject)) {
  //第二种和第三种构造函数使用时，初始化数据到buffer对象中去。
  //如果当前对象为Buffer对象，
  //则把subject对象上的数据，保存到this对象上
    subject.copy(this, 0, 0, this.length);

  } else if (util.isNumber(subject.length) || util.isArray(subject)) {
    // Really crappy way to handle Uint8Arrays, but V8 doesn't give a simple
    // way to access the data from the C++ API.
    //如果subject是数组的话，则~~使用数组赋值
    for (var i = 0; i< this.length; i++)
      this[i] = subject[i];
  }
  
  //构造函数，返回this对象，即一个新的buffer对象
}