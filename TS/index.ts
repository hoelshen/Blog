import { expectType } from 'tsd';


expectType<string>("hoel"); // √
// expectType<string>(599); // ×

// const tmp1: null = null;
// const tmp2: undefined = undefined;

// const tmp3: string = null; // 仅在关闭 strictNullChecks 时成立，下同
// const tmp4: string = undefined;

const arr4: [string, string, string] = ['shen', 'jun', 'hong'];

// console.log(arr4[599]);

const arr6: [string, number?, boolean?] = ['hoel'];

type TupleLength = typeof arr6.length; // 1 | 2 | 3

type test_type = { name: string, age: number }
interface test_interface {
  name: string
  age: number
}
const obj_test1: test_interface = { name: '', age: 0 }
const obj_test2: test_type = { name: '', age: 0 }


// 对于 undefined、null、void 0 ，需要关闭 strictNullChecks
const tmp1: Object = undefined;
const tmp2: Object = null;
const tmp3: Object = void 0;

const tmp4: Object = 'hoel';
const tmp5: Object = 599;
const tmp6: Object = { name: 'hoel' };
const tmp7: Object = () => { };
const tmp8: Object = [];

function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}

const res1 = func(599); // number
const res2 = func(599, true); // string
const res3 = func(599, false); // number

class Utils {
  public static identifier = "hoel";
  
  private constructor(){}

  public static makeUHappy() {
  }
}

// class sub extends Utils{

// }

type UnionWithNever = "hoel" | 599 | true | void | never;

const arr = [];

arr.push("linbudu"); // 类型“string”的参数不能赋给类型“never”的参数。

interface IFoo {
  name: string;
}

declare const obj: {
  foo: IFoo
}

const {
  foo = {} as IFoo
} = obj

const str: string = "linbudu";

// 从 X 类型 到 Y 类型的断言可能是错误的，blabla
(str as { handler: () => {} }).handler()

const element = document.querySelector("#id");
console.log('element: ', element);

const target = [1, 2, 3, 599].find(item => item === 599);
console.log('target: ', target);

interface NameStruct {
  name: string;
  age: string
}

interface AgeStruct {
  age: number;
}

type ProfileStruct = NameStruct & AgeStruct;

// const profile: ProfileStruct = {
//   name: "hoel",
//   age: 18
// }

type StrAndNum = string & number; // never

interface AllStringTypes {
  // 类型“number”的属性“propA”不能赋给“string”索引类型“boolean”。
  propA: number;
  [key: string]: boolean;
}

interface Foo {
  linbudu: 1,
  599: 2
}
type FooKeys = keyof Foo; // 

interface Foo {
  propA: number;
}

// 类型“Foo”没有匹配的类型“string”的索引签名。
type PropAType = Foo[keyof Foo]; 
