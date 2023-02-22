// 属性修饰进阶;

// 属性修饰工具类型的进阶主要分为这么几个方向：

// 深层的属性修饰；
// 基于已知属性的部分修饰，以及基于属性类型的部分修饰。

type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V> : T;

 表示不能同时拥有两个属性

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

export type XOR<T, U> = (Without<T, U> & U) | (Without<U, T> & T);

type XORUser = XOR<VIP, CommonUser>;

expectType<XORUser>({
  vipExpires: 0,
});

expectType<XORUser>({
  promotionUsed: false,
});

// 报错，至少需要一个
// @ts-expect-error
expectType<XORUser>({});

// 报错，不允许同时拥有
// @ts-expect-error
expectType<XORUser>({
  promotionUsed: false,
  vipExpires: 0,
});





































