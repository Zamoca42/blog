---
title: 27. 배열
---

## 1. 배열이란?

배열은 여러 개의 값을 순차적으로 나열한 자료구조다. 배열은 사용 빈도가 매우 높은 가장 기본적인 자료구조다. 자바스크립트는 배열을 다루기 위한 유용한 메서드를 다수 제공한다.
배열은 사용 빈도가 높으므로 배열 메서드를 능숙하게 다룰 수 있다면 코딩에 매우 도움이 된다.

```js
const arr = ["apple", "banana", "orange"];
```

배열이 가지고 있는 값을 요소(element)라고 부른다. 자바스크립트의 모든 값은 배열의 요소가 될 수 있다. 즉, 원시값은 물론 객체, 함수, 배열 등 자바스크립트에서 값으로 인정하는 모든 것은 배열의 요소가 될 수 있다.

배열의 요소는 배열에서 자신의 위치를 나타내는 0 이상의 정수인 인덱스를 갖는다.
인덱스는 배열의 요소에 접근할 때 사용한다. 대부분의 프로그래밍 언어에서 인덱스는 0부터 시작한다.

```js
arr[0]; // -> 'apple'
arr[1]; // -> 'banana'
arr[2]; // -> 'orange'
```

배열은 요소의 개수, 즉 배열의 길이를 나타내는 length 프로퍼티를 갖는다.

```js
arr.length; // -> 3
```

배열은 인덱스와 length 프로퍼티를 갖기 때문에 for 문을 통해 순차적으로 요소에 접근할 수 있다.

```js
// 배열의 순회
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 'apple' 'banana' 'orange'
}
```

자바스크립트에 배열이라는 타입은 존재하지 않는다. 배열은 객체 타입이다.

```js
typeof arr; // -> object
```

배열은 배열 리터럴, `Array` 생성자 함수, `Array.of`, `Array.from` 메서드로 생성할 수 있다.

배열의 프로토타입 객체는 `Array.prototype`이다. `Array.prototype`은 배열을 위한 빌트인 메서드를 제공한다.

```js
const arr = [1, 2, 3];

arr.constructor === Array; // -> true
Object.getPrototypeOf(arr) === Array.prototype; // -> true
```

배열은 객체지만 일반 객체와는 구별되는 독특한 특징이 있다.

| 구분            |           객체            |     배열      |
| --------------- | :-----------------------: | :-----------: |
| 구조            | 프로퍼티 키와 프로퍼티 값 | 인덱스와 요소 |
| 값의 참조       |        프로퍼티 키        |    인덱스     |
| 값의 순서       |            :x:            |      :o:      |
| length 프로퍼티 |            :x:            |      :o:      |

일반 객체와 배열을 구분하는 가장 명확한 차이는 "값의 순서"와 "length 프로퍼티"다.

```js
const arr = [1, 2, 3];

// 반복문으로 자료 구조를 순서대로 순회하기 위해서는 자료 구조의 요소에 순서대로
// 접근할 수 있어야 하며 자료 구조의 길이를 알 수 있어야 한다.
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 1 2 3
}
```

배열의 장점

- 처음부터 순차적으로 요소에 접근
- 마지막부터 역순으로 요소에 접근
- 특정 위치부터 순차적 요소로 접근

## 2. 자바스크립트 배열은 배열이 아니다

배열의 요소는 하나의 데이터 타입으로 통일되어 있으며 서로 연속적으로 인접해 있다.
이러한 배열을 밀집 배열이라 한다.

![그림 27-1. 자료구조에서 말하는 배열은 동일한 크기의 메모리 공간이 빈틈없이 연속적으로 나열된 자료구조다.](https://github.com/Zamoca42/blog/assets/96982072/3b2e5896-a372-4c04-bf51-e8c2974d91fb)

이처럼 일반적인 의미의 배열은 각 요소가 동일한 데이터 크기를 가지며, 빈틈없이 연속적으로 이어져 있으므로 다음과 같이 인덱스를 통해 단 한 번의 연산으로 임의의 요소에 접근할 수 있다.

이는 매우 효율적이며, 고속으로 동작한다.

```
검색 대상 요소의 메모리 주소 = 배열의 시작 메모리 주소 + 인덱스 * 요소의 바이트 수
```

예를 들어, 위 그림처럼 메모리 주소 1000에서 시작하고 각 요소가 8바이트인 배열을 생각해보자

- 인덱스가 0인 요소의 메모리 주소: 1000 + 0 \* 8 = 1000
- 인덱스가 1인 요소의 메모리 주소: 1000 + 1 \* 8 = 1008
- 인덱스가 2인 요소의 메모리 주소: 1000 + 2 \* 8 = 1016

이처럼 배열은 인덱스를 통해 효율적으로 요소에 접근할 수 있다는 장점이 있다.

```js
// 선형 검색을 통해 배열(array)에 특정 요소(target)가 존재하는지 확인한다.
// 배열에 특정 요소가 존재하면 특정 요소의 인덱스를 반환하고, 존재하지 않으면 -1을 반환한다.
function linearSearch(array, target) {
  const length = array.length;

  for (let i = 0; i < length; i++) {
    if (array[i] === target) return i;
  }

  return -1;
}

console.log(linearSearch([1, 2, 3, 4, 5, 6], 3)); // 2
console.log(linearSearch([1, 2, 3, 4, 5, 6], 0)); // -1
```

또한 배열에 요소를 삽입하거나 삭제하는 경우 배열의 요소를 연속적으로 유지하기 위해 요소를 이동시켜야 하는 단점도 있다.

![그림 27-2. 배열 요소의 삽입과 삭제](https://github.com/Zamoca42/blog/assets/96982072/d1f72fdc-be86-4d75-aba7-18f18d5585cf)

자바스크립트의 배열은 배열의 요소를 위한 각각의 메모리 공간은 동일한 크기를 갖지 않아도 되며, 연속적으로 이어져 있지 않을 수도 있다. 배열의 요소가 연속적으로 이어져 있지 않는 배열을 희소 배열이라 한다.

자바스크립트의 배열은 일반적인 배열의 동작을 흉내 낸 특수한 객체다.

```js
// "16.2. 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체" 참고
console.log(Object.getOwnPropertyDescriptors([1, 2, 3]));
/*
{
  '0': {value: 1, writable: true, enumerable: true, configurable: true}
  '1': {value: 2, writable: true, enumerable: true, configurable: true}
  '2': {value: 3, writable: true, enumerable: true, configurable: true}
  length: {value: 3, writable: true, enumerable: false, configurable: false}
}
*/
```

이처럼 배열은 인덱스를 나타내는 문자열을 프로퍼티 키로 가지며, length 프로퍼티를 갖는 특수한 객체다.

```js
const arr = [
  "string",
  10,
  true,
  null,
  undefined,
  NaN,
  Infinity,
  [],
  {},
  function () {},
];
```

일반적인 배열과 자바스크립트 배열의 장단점을 정리해보면 다음과 같다.

- 일반적인 배열은 인덱스로 요소에 빠르게 접근할 수 있다. 하지만 요소를 삽입 또는 삭제하는 경우에는 효율적이지 않다.
- 자바스크립트의 배열은 해시 테이블로 구현된 객체이므로 인덱스로 요소에 접근하는 경우 일반적인 배열보다 성능적인 면에서 느릴 수 밖에 없는 구조적인 단점이 있다.

인덱스로 배열 요소에 접근할 때 일반적인 배열보다 느릴 수 밖에 없는 구조적인 단점을 보완하기 위해 대부분의 모던 자바스크립트 엔진은 배열을 일반 객체와 구별하여 좀 더 배열처럼 동작하도록 최적화하여 구현했다.

```js
const arr = [];

console.time("Array Performance Test");

for (let i = 0; i < 10000000; i++) {
  arr[i] = i;
}
console.timeEnd("Array Performance Test");
// 약 340ms

const obj = {};

console.time("Object Performance Test");

for (let i = 0; i < 10000000; i++) {
  obj[i] = i;
}

console.timeEnd("Object Performance Test");
// 약 600ms
```

## 3. length 프로퍼티와 희소 배열

length 프로퍼티는 요소의 개수를 0 이상의 정수를 값으로 갖는다.

```js
[].length[(1, 2, 3)].length; // -> 0 // -> 3
```

length 프로퍼티의 값은 배열에 요소를 추가하거나 삭제하면 자동으로 갱신된다.

```js
const arr = [1, 2, 3];
console.log(arr.length); // 3

// 요소 추가
arr.push(4);
// 요소를 추가하면 length 프로퍼티의 값이 자동 갱신된다.
console.log(arr.length); // 4

// 요소 삭제
arr.pop();
// 요소를 삭제하면 length 프로퍼티의 값이 자동 갱신된다.
console.log(arr.length); // 3
```

현재 length 프로퍼티 값보다 작은 숫자 값을 할당하면 배열의 길이가 줄어든다.

```js
const arr = [1, 2, 3, 4, 5];

// 현재 length 프로퍼티 값인 5보다 작은 숫자 값 3을 length 프로퍼티에 할당
arr.length = 3;

// 배열의 길이가 5에서 3으로 줄어든다.
console.log(arr); // [1, 2, 3]
```

이때 length 프로퍼티 값은 변경되지만 실제로 배열의 길이가 늘어나지는 않는다.

```js
const arr = [1];

// 현재 length 프로퍼티 값인 1보다 큰 숫자 값 3을 length 프로퍼티에 할당
arr.length = 3;

// length 프로퍼티 값은 변경되지만 실제로 배열의 길이가 늘어나지는 않는다.
console.log(arr.length); // 3
console.log(arr); // [1, empty × 2]
```

위 예제의 출력 결과 empty \* 2는 실제로 추가된 배열의 요소가 아니다.
즉, `arr[1]`과 `arr[2]`에는 값이 존재하지 않는다.

```js
console.log(Object.getOwnPropertyDescriptors(arr));
/*
{
  '0': {value: 1, writable: true, enumerable: true, configurable: true},
  length: {value: 3, writable: true, enumerable: false, configurable: false}
}
*/
```

이처럼 배열의 요소가 연속적으로 위치하지 않고 일부가 비어 있는 배열을 희소 배열이라 한다.

```js
// 희소 배열
const sparse = [, 2, , 4];

// 희소 배열의 length 프로퍼티 값은 요소의 개수와 일치하지 않는다.
console.log(sparse.length); // 4
console.log(sparse); // [empty, 2, empty, 4]

// 배열 sparse에는 인덱스가 0, 2인 요소가 존재하지 않는다.
console.log(Object.getOwnPropertyDescriptors(sparse));
/*
{
  '1': { value: 2, writable: true, enumerable: true, configurable: true },
  '3': { value: 4, writable: true, enumerable: true, configurable: true },
  length: { value: 4, writable: true, enumerable: false, configurable: false }
}
*/
```

하지만 희소 배열은 length와 배열의 요소의 개수가 일치하지 않는다.
희소 배열의 length는 희소 배열의 실제 요소 개수보다 언제나 크다.

## 4. 배열 생성

### 4.1. 배열 리터럴

배열 리터럴은 0개 이상의 요소를 쉼표로 구분하여 대괄호([])로 묶는다.
배열 리터럴은 객체 리터럴과 달리 프로퍼티 키가 없고 값만 존재한다.

```js
const arr = [1, 2, 3];
console.log(arr.length); // 3
```

```js
const arr = [];
console.log(arr.length); // 0
```

```js
const arr = [1, , 3]; // 희소 배열
```

```js
const arr = [1, , 3]; // 희소 배열

// 희소 배열의 length는 배열의 실제 요소 개수보다 언제나 크다.
console.log(arr.length); // 3
console.log(arr); // [1, empty, 3]
console.log(arr[1]); // undefined
```

위 에제의 arr은 인덱스가 1인 요소를 갖지 않는 희소 배열이다. `arr[1]`인 undefined인 이유는 사실은 객체인 arr에 프로퍼티 키가 '1'인 프로퍼티가 존재하지 않기 때문이다.

### 4.2. Array 생성자 함수

`Object` 생성자 함수를 통해 객체를 생성할 수 있듯이 Array 생성자 함수를 통해 배열을 생성할 수도 있다. Array 생성자 함수는 전달된 인수의 개수에 따라 다르게 동작하므로 주의가 필요하다.

- 전달된 인수가 1개이고 숫자인 경우 length 프로퍼티 값이 인수인 배열을 생성한다.

```js
const arr = new Array(10);

console.log(arr); // [empty × 10]
console.log(arr.length); // 10
```

이때 생성된 배열은 희소 배열이다. length 프로퍼티 값은 0이 아니지만 실제로 배열의 요소는 존재하지 않는다.

```js
console.log(Object.getOwnPropertyDescriptors(arr));
/*
{
  length: {value: 10, writable: true, enumerable: false, configurable: false}
}
*/
```

### 4.3. Array.of

Array.of 메서드는 전달된 인수를 요소로 갖는 배열을 생성한다.
Array.of는 Array 생성자 함수와 다르게 전달된 인수가 1개이고 숫자이더라도 인수를 요소로 갖는 배열을 생성한다.

```js
// 전달된 인수가 1개이고 숫자이더라도 인수를 요소로 갖는 배열을 생성한다.
Array.of(1); // -> [1]

Array.of(1, 2, 3); // -> [1, 2, 3]

Array.of("string"); // -> ['string']
```

### 4.4. Array.from

ES6에서 도인된 Array.from 메서드는 유사 배열 객체 또는 이터러블 객체를 인수로 전달받아 배열로 변환하여 반환한다.

```js
// 유사 배열 객체를 변환하여 배열을 생성한다.
Array.from({ length: 2, 0: "a", 1: "b" }); // -> ['a', 'b']

// 이터러블을 변환하여 배열을 생성한다. 문자열은 이터러블이다.
Array.from("Hello"); // -> ['H', 'e', 'l', 'l', 'o']
```

Array.from을 사용하면 두 번째 인수로 전달한 콜백 함수를 통해 값을 만들면서 요소를 채울 수 있다.
Array.from 메서드는 두 번째 인수로 전달한 콜백 함수에 첫 번째 인수에 의해 생성된 배열의 요소값과 인덱스를 순차적으로 전달하면서 호출하고, 콜백 함수의 반환값으로 구성된 배열을 반환한다.

```js
// Array.from에 length만 존재하는 유사 배열 객체를 전달하면 undefined를 요소로 채운다.
Array.from({ length: 3 }); // -> [undefined, undefined, undefined]

// Array.from은 두 번째 인수로 전달한 콜백 함수의 반환값으로 구성된 배열을 반환한다.
Array.from({ length: 3 }, (_, i) => i); // -> [0, 1, 2]
```

:::info 유사 배열 객체와 이터러블 객체
유사 배열 객체는 마치 배열처럼 인덱스로 프로퍼티 값에 접근할 수 있고 length 프로퍼티를 갖는 객체를 말한다. 유사 배열 객체는 마치 배열처럼 for 문으로 순회할 수도 있다.

```js
// 유사 배열 객체
const arrayLike = {
  0: "apple",
  1: "banana",
  2: "orange",
  length: 3,
};

// 유사 배열 객체는 마치 배열처럼 for 문으로 순회할 수도 있다.
for (let i = 0; i < arrayLike.length; i++) {
  console.log(arrayLike[i]); // apple banana orange
}
```

:::

### 5. 배열 요소의 참조

배열의 요소를 참조할 때에는 대괄호(`[]`) 표기법을 사용한다.
대괄호 안에는 인덱스가 와야한다.
정수로 평가되는 표현식이라면 인덱스 대신 사용할 수 있다.

```js
const arr = [1, 2];

// 인덱스가 0인 요소를 참조
console.log(arr[0]); // 1
// 인덱스가 1인 요소를 참조
console.log(arr[1]); // 2
```

존재하지 않는 요소에 접근하면 undefined가 반환된다.

```js
const arr = [1, 2];

// 인덱스가 2인 요소를 참조. 배열 arr에는 인덱스가 2인 요소가 존재하지 않는다.
console.log(arr[2]); // undefined
```

배열은 사실 인덱스를 나타내는 문자열을 프로퍼티 키로 갖는 객체다.
따라서 존재하지 않는 프로퍼티 키로 객체의 프로퍼티에 접근 했을 때 undefined를 반환하는 것처럼
배열도 존재하지 않는 요소를 참조하면 undfined를 반환한다.

```js
// 희소 배열
const arr = [1, , 3];

// 배열 arr에는 인덱스가 1인 요소가 존재하지 않는다.
console.log(Object.getOwnPropertyDescriptors(arr));
/*
{
  '0': {value: 1, writable: true, enumerable: true, configurable: true},
  '2': {value: 3, writable: true, enumerable: true, configurable: true},
  length: {value: 3, writable: true, enumerable: false, configurable: false}
*/

// 존재하지 않는 요소를 참조하면 undefined가 반환된다.
console.log(arr[1]); // undefined
console.log(arr[3]); // undefined
```

## 6. 배열 요소의 추가와 갱신

객체에 프로퍼티를 동적으로 추가할 수 있는 것처럼 배열에도 요소를 동적으로 추가할 수 있다.
존재하지 않는 인덱스를 사용해 값을 할당하면 새로운 요소로 추가된다. 이때 length 프로퍼티 값은 자동 갱신된다.

```js
const arr = [0];

// 배열 요소의 추가
arr[1] = 1;

console.log(arr); // [0, 1]
console.log(arr.length); // 2
```

만약 현재 배열의 length 프로퍼티 값보다 큰 인덱스로 새로운 요소를 추가하면 희소 배열이 된다.

```js
arr[100] = 100;

console.log(arr); // [0, 1, empty × 98, 100]
console.log(arr.length); // 101
```

이때 인덱스로 요소에 접근하여 명시적으로 값을 할당하지 않은 요소는 생성되지 않는 것에 주의하자.

```js
// 명시적으로 값을 할당하지 않은 요소는 생성되지 않는다.
console.log(Object.getOwnPropertyDescriptors(arr));
/*
{
  '0': {value: 0, writable: true, enumerable: true, configurable: true},
  '1': {value: 1, writable: true, enumerable: true, configurable: true},
  '100': {value: 100, writable: true, enumerable: true, configurable: true},
  length: {value: 101, writable: true, enumerable: false, configurable: false}
*/
```

이미 요소가 존재하는 요소에 값을 재할당하면 요소값이 갱신된다.

```js
// 요소값의 갱신
arr[1] = 10;

console.log(arr); // [0, 10, empty × 98, 100]
```

인덱스는 요소의 위치를 나타내므로 반드시 0 이상의 정수를 사용해야 한다.
만약 정수 이외의 값을 인덱스처럼 사용하면 요소가 생성되는 것이 아니라 프로퍼티가 생성된다.
이때 추가된 프로퍼티는 length 프로퍼티 값에 영향을 주지 않는다.

```js
const arr = [];

// 배열 요소의 추가
arr[0] = 1;
arr["1"] = 2;

// 프로퍼티 추가
arr["foo"] = 3;
arr.bar = 4;
arr[1.1] = 5;
arr[-1] = 6;

console.log(arr); // [1, 2, foo: 3, bar: 4, '1.1': 5, '-1': 6]

// 프로퍼티는 length에 영향을 주지 않는다.
console.log(arr.length); // 2
```

## 7. 배열 요소의 삭제

배열은 사실 객체이기 때문에 배열의 특정 요소를 삭제하기 위해 delete 연산자를 사용할 수 있다.

```js
const arr = [1, 2, 3];

// 배열 요소의 삭제
delete arr[1];
console.log(arr); // [1, empty, 3]

// length 프로퍼티에 영향을 주지 않는다. 즉, 희소 배열이 된다.
console.log(arr.length); // 3
```

delete 연산자를 객체의 프로퍼티를 삭제한다.
따라서 위 예제의 `delete arr[1]`은 arr에서 프로퍼티 키가 '1'인 프로퍼티를 삭제한다.
이때 배열은 희소 배열이 되면 length 프로퍼티 값은 변하지 않는다.
따라서 희소 배열을 만드는 delete 연산자는 사용하지 않는 것이 좋다.
희소 배열을 만들지 않으면서 배열의 특정 요소를 완전히 삭제하려면 `Array.prototype.splice` 메서드를 사용한다.

```js
const arr = [1, 2, 3];

// Array.prototype.splice(삭제를 시작할 인덱스, 삭제할 요소 수)
// arr[1]부터 1개의 요소를 제거
arr.splice(1, 1);
console.log(arr); // [1, 3]

// length 프로퍼티가 자동 갱신된다.
console.log(arr.length); // 2
```

## 8. 배열 메서드

자바스크립트는 배열을 다룰 때 유용한 다양한 빌트인 메서드를 제공한다.
Array 생성자 함수는 정적 메서드를 제공하며, 배열 객체의 프로토타입인 Array.prototype은 프로토타입 메서드를 제공한다.
배열은 사용 빈도가 높은 자료구조이므로 배열 메서드의 사용법을 잘 알아둘 필요가 있다.

배열 메서드는 결과물을 반환하는 패턴이 두 가지이므로 주의가 필요하다.

- 원본 배열을 직접 변경하는 메서드
- 원본 배열을 직접 변경하지 않고 새로운 배열을 생성하여 반환하는 메서드

```js
const arr = [1];

// push 메서드는 원본 배열(arr)을 직접 변경한다.
arr.push(2);
console.log(arr); // [1, 2]

// concat 메서드는 원본 배열(arr)을 직접 변경하지 않고 새로운 배열을 생성하여 반환한다.
const result = arr.concat(3);
console.log(arr); // [1, 2]
console.log(result); // [1, 2, 3]
```

#### 8.1. Array.isArray

`Array.isArray`는 Array 생성자 함수의 정적 메서드다.
`Array.of`와 `Array.from`도 Array 생성자 함수의 정적 메서드다.

`Array.isArray` 메서드는 전달된 인수가 배열이면 true, 배열이 아니면 false를 반환한다.

```js
// true
Array.isArray([]);
Array.isArray([1, 2]);
Array.isArray(new Array());

// false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(1);
Array.isArray("Array");
Array.isArray(true);
Array.isArray(false);
Array.isArray({ 0: 1, length: 1 });
```

#### 8.2. Array.prototype.indexOf

`indexOf` 메서드는 원본 배열에서 인수로 전달된 요소를 검색하여 인덱스를 반환한다.

- 원본 배열에 인수로 전달한 요소와 중복되는 요소가 여러 개 있다면 첫 번쨰로 검색된 요소의 인덱스를 반환한다.
- 원본 배열에 인수로 전달한 요소가 존재하지 않으면 -1을 반환한다.

```js
const arr = [1, 2, 2, 3];

// 배열 arr에서 요소 2를 검색하여 첫 번째로 검색된 요소의 인덱스를 반환한다.
arr.indexOf(2); // -> 1
// 배열 arr에 요소 4가 없으므로 -1을 반환한다.
arr.indexOf(4); // -> -1
// 두 번째 인수는 검색을 시작할 인덱스다. 두 번째 인수를 생략하면 처음부터 검색한다.
arr.indexOf(2, 2); // -> 2
```

`indexOf` 메서드는 배열에 특정 요소가 존재하는지 확인할 때 유용하다.

```js
const foods = ["apple", "banana", "orange"];

// foods 배열에 'orange' 요소가 존재하는지 확인한다.
if (foods.indexOf("orange") === -1) {
  // foods 배열에 'orange' 요소가 존재하지 않으면 'orange' 요소를 추가한다.
  foods.push("orange");
}

console.log(foods); // ["apple", "banana", "orange"]
```

`indexOf` 메서드 대신 ES7에서 도입된 `Array.prototype.includes` 메서드를 사용하면 가독성이 더 좋다.

```js
const foods = ["apple", "banana"];

// foods 배열에 'orange' 요소가 존재하는지 확인한다.
if (!foods.includes("orange")) {
  // foods 배열에 'orange' 요소가 존재하지 않으면 'orange' 요소를 추가한다.
  foods.push("orange");
}

console.log(foods); // ["apple", "banana", "orange"]
```

#### 8.3. Array.prototype.push

push 메서드는 인수로 전달받은 모든 값을 원본 배열의 마지막 요소로 추가하고 변경된 length 프로퍼티 값을 반환한다. push 메서드는 원본 배열을 직접 변경한다.

```js
const arr = [1, 2];

// 인수로 전달받은 모든 값을 원본 배열 arr의 마지막 요소로 추가하고 변경된 length 값을 반환한다.
let result = arr.push(3, 4);
console.log(result); // 4

// push 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [1, 2, 3, 4]
```

push 메서드는 성능 면에서 좋지 않다. 마지막 요소로 추가할 요소가 하나뿐이라면 push 메서드를 사용하지 않고 length 프로퍼티를 사용하여 배열의 마지막 요소를 직접 추가할 수도 있다.
이 방법이 push 메서드보다 빠르다.

```js
const arr = [1, 2];

// arr.push(3)과 동일한 처리를 한다. 이 방법이 push 메서드보다 빠르다.
arr[arr.length] = 3;
console.log(arr); // [1, 2, 3]
```

push 메서드는 원본 배열을 직접 변경하는 부수 효과가 있다. 따라서 push 메서드보다는 ES6의 스프레드 문법을 사용하는 편이 좋다. 스프레드 문법을 사용하면 함수 호출 없이 표현식으로 마지막에 요소를 추가할 수 있으며 부수 효과도 없다.

```js
const arr = [1, 2];

// ES6 스프레드 문법
const newArr = [...arr, 3];
console.log(newArr); // [1, 2, 3]
```

#### 8.4. Array.prototype.pop

pop 메서드는 원본 배열에서 마지막 요소를 제거하고 제거한 요소를 반환.
원본 배열이 빈 배열이면 `undefined`를 반환
pop 메서드는 원본 배열을 직접 변경

```js
const arr = [1, 2];

// 원본 배열에서 마지막 요소를 제거하고 제거한 요소를 반환한다.
let result = arr.pop();
console.log(result); // 2

// pop 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [1]
```

pop 메서드와 push 메서드를 사용하면 스택을 쉽게 구현할 수 있다.
스택은 데이터를 마지막에 밀어 넣고, 마지막에 밀어 넣은 데이터를 먼저 꺼내는 후입 선출(LIFO - Last In First Out)방식의 자료구조다.
스택은 언제나 가장 마지막에 밀어 넣은 최신 데이터를 먼저 취득한다. 스택에 데이터를 밀어 넣는 것을 푸시라 하고 스택에서 데이터를 꺼내는 것을 pop 이라고 한다.

![그림 27-3. 스택](https://github.com/Zamoca42/blog/assets/96982072/fa9468a6-6198-4ba1-a5db-54c26bccce70)

스택을 생성자 함수로 구현해 보면 다음과 같다.

```js
const Stack = (function () {
  function Stack(array = []) {
    if (!Array.isArray(array)) {
      // "47. 에러 처리" 참고
      throw new TypeError(`${array} is not an array.`);
    }
    this.array = array;
  }

  Stack.prototype = {
    // "19.10.1. 생성자 함수에 의한 프로토타입의 교체" 참고
    constructor: Stack,
    // 스택의 가장 마지막에 데이터를 밀어 넣는다.
    push(value) {
      return this.array.push(value);
    },
    // 스택의 가장 마지막 데이터, 즉 가장 나중에 밀어 넣은 최신 데이터를 꺼낸다.
    pop() {
      return this.array.pop();
    },
    // 스택의 복사본 배열을 반환한다.
    entries() {
      return [...this.array];
    },
  };

  return Stack;
})();

const stack = new Stack([1, 2]);
console.log(stack.entries()); // [1, 2]

stack.push(3);
console.log(stack.entries()); // [1, 2, 3]

stack.pop();
console.log(stack.entries()); // [1, 2]
```

스택을 클래스로 구현해 보면 다음과 같다.

```js
class Stack {
  #array; // private class member

  constructor(array = []) {
    if (!Array.isArray(array)) {
      throw new TypeError(`${array} is not an array.`);
    }
    this.#array = array;
  }

  // 스택의 가장 마지막에 데이터를 밀어 넣는다.
  push(value) {
    return this.#array.push(value);
  }

  // 스택의 가장 마지막 데이터, 즉 가장 나중에 밀어 넣은 최신 데이터를 꺼낸다.
  pop() {
    return this.#array.pop();
  }

  // 스택의 복사본 배열을 반환한다.
  entries() {
    return [...this.#array];
  }
}

const stack = new Stack([1, 2]);
console.log(stack.entries()); // [1, 2]

stack.push(3);
console.log(stack.entries()); // [1, 2, 3]

stack.pop();
console.log(stack.entries()); // [1, 2]
```

#### 8.5. Array.prototype.unshift

unshift 메서드는 인수로 전달받은 모든 값을 원본 배열을 선두에 요소로 추가하고 변경된 length 프로퍼티 값을 반환한다.
unshift 메서드는 원본 배열을 직접 변경한다.

```js
const arr = [1, 2];

// 인수로 전달받은 모든 값을 원본 배열의 선두에 요소로 추가하고 변경된 length 값을 반환한다.
let result = arr.unshift(3, 4);
console.log(result); // 4

// unshift 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [3, 4, 1, 2]
```

unshift 메서드는 원본 배열을 직접 변경하는 부수 효과가 있다. 따라서 unshift 메서드보다는 ES6의 스프레드 문법을 사용하는 편이 좋다.
스프레드 문법을 사용하면 함수 호출 없이 표현식으로 선두에 요소를 추가할 수 있으며 부수 효과도 없다.
이에 대해서는 31장 "스프레드 문법"에서 자세히 살펴볼 것이다.

```js
const arr = [1, 2];

// ES6 스프레드 문법
const newArr = [3, ...arr];
console.log(newArr); // [3, 1, 2]
```

#### 8.6. Array.prototype.shift

shift 메서드는 원본 배열에서 첫 번쨰 요소를 제거하고 제거한 요소를 반환.
원본 배열이 빈 배열이면 undefined를 반환.
shift 메서드는 원본 배열을 직접 변경.

```js
const arr = [1, 2];

// 원본 배열에서 첫 번째 요소를 제거하고 제거한 요소를 반환한다.
let result = arr.shift();
console.log(result); // 1

// shift 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [2]
```

shift 메서드와 push 메서드를 사용하면 큐를 쉽게 구현할 수 있다.
큐는 데이터를 마지막에 밀어 넣고, 처음 데이터, 즉 가장 먼저 밀어 넣은 데이터를 먼저 꺼내는 선입 선출 방식의 자료구조다.
스택은 언제나 마지막에 밀어 넣은 최신 데이터를 취득 하지만 큐는 언제나 데이터를 밀어 넣은 순서대로 취득한다.

![그림 27-4. 큐](https://github.com/Zamoca42/blog/assets/96982072/fe481aa9-6bd9-4110-b320-e501b9e30cfa)

큐를 생성자 함수로 구현해 보면 다음과 같다.

```js
const Queue = (function () {
  function Queue(array = []) {
    if (!Array.isArray(array)) {
      // "47. 에러 처리" 참고
      throw new TypeError(`${array} is not an array.`);
    }
    this.array = array;
  }

  Queue.prototype = {
    // "19.10.1. 생성자 함수에 의한 프로토타입의 교체" 참고
    constructor: Queue,
    // 큐의 가장 마지막에 데이터를 밀어 넣는다.
    enqueue(value) {
      return this.array.push(value);
    },
    // 큐의 가장 처음 데이터, 즉 가장 먼저 밀어 넣은 데이터를 꺼낸다.
    dequeue() {
      return this.array.shift();
    },
    // 큐의 복사본 배열을 반환한다.
    entries() {
      return [...this.array];
    },
  };

  return Queue;
})();

const queue = new Queue([1, 2]);
console.log(queue.entries()); // [1, 2]

queue.enqueue(3);
console.log(queue.entries()); // [1, 2, 3]

queue.dequeue();
console.log(queue.entries()); // [2, 3]
```

큐를 클래스로 구현해 보면 다음과 같다.

```js
class Queue {
  #array; // private class member

  constructor(array = []) {
    if (!Array.isArray(array)) {
      throw new TypeError(`${array} is not an array.`);
    }
    this.#array = array;
  }

  // 큐의 가장 마지막에 데이터를 밀어 넣는다.
  enqueue(value) {
    return this.#array.push(value);
  }

  // 큐의 가장 처음 데이터, 즉 가장 먼저 밀어 넣은 데이터를 꺼낸다.
  dequeue() {
    return this.#array.shift();
  }

  // 큐의 복사본 배열을 반환한다.
  entries() {
    return [...this.#array];
  }
}

const queue = new Queue([1, 2]);
console.log(queue.entries()); // [1, 2]

queue.enqueue(3);
console.log(queue.entries()); // [1, 2, 3]

queue.dequeue();
console.log(queue.entries()); // [2, 3]
```

#### 8.7. Array.prototype.concat

concat 메서드는 인수로 전달된 값들을 원본 배열의 마지막 요소로 추가한 새로운 배열을 반환한다.
인수로 전달한 값이 배열인 경우 배열을 해체하여 새로운 배열의 요소로 추가
원본 배열은 변경되지 않는다.

```js
const arr1 = [1, 2];
const arr2 = [3, 4];

// 배열 arr2를 원본 배열 arr1의 마지막 요소로 추가한 새로운 배열을 반환한다.
// 인수로 전달한 값이 배열인 경우 배열을 해체하여 새로운 배열의 요소로 추가한다.
let result = arr1.concat(arr2);
console.log(result); // [1, 2, 3, 4]

// 숫자를 원본 배열 arr1의 마지막 요소로 추가한 새로운 배열을 반환한다.
result = arr1.concat(3);
console.log(result); // [1, 2, 3]

// 배열 arr2와 숫자를 원본 배열 arr1의 마지막 요소로 추가한 새로운 배열을 반환한다.
result = arr1.concat(arr2, 5);
console.log(result); // [1, 2, 3, 4, 5]

// 원본 배열은 변경되지 않는다.
console.log(arr1); // [1, 2]
```

push와 unshift 메서드는 concat 메서드로 대체할 수 있다. push와 unshift 메서드는 concat 메서드와 유사하게 동작하지만
다음과 같이 미묘한 차이가 있다.

- push와 unshift 메서드는 원본 배열을 직접 변경하지만 concat 메서드는 원본 배열을 변경하지않고 새로운 배열을 반환한다.
  따라서 push와 unshift 메서드를 사용할 경우 원본 배열을 반드시 변수에 저장해 두어야 하며 concat 메서드를 사용할 경우 반환값을
  반드시 변수에 할당 받아야한다.

  ```js
  const arr = [3, 4];

  // unshift와 push 메서드는 인수로 전달받은 배열을 그대로 원본 배열의 요소로 추가한다
  arr.unshift([1, 2]);
  arr.push([5, 6]);
  console.log(arr); // [[1, 2], 3, 4,[5, 6]]

  // concat 메서드는 인수로 전달받은 배열을 해체하여 새로운 배열의 요소로 추가한다
  let result = [1, 2].concat([3, 4]);
  result = result.concat([5, 6]);

  console.log(result); // [1, 2, 3, 4, 5, 6]
  ```

concat 메서드는 ES6의 스프레드 문법으로 대체할 수 있다.

```js
let result = [1, 2].concat([3, 4]);
console.log(result); // [1, 2, 3, 4]

// concat 메서드는 ES6의 스프레드 문법으로 대체할 수 있다.
result = [...[1, 2], ...[3, 4]];
console.log(result); // [1, 2, 3, 4]
```

결론적으로 push/unshift 메서드와 concat 메서드를 사용하는 대신 ES6의 스프레드 문법을 일관성 있게 사용할 것을 권장

#### 8.8. Array.prototype.splice

![그림 27-5. push, pop, unshift, shift 메서드](https://github.com/Zamoca42/blog/assets/96982072/808bd387-aa78-4561-bbe5-bc83cba6ab02)

원본 배열의 중간에 요소를 추가하거나 중간에 있는 요소를 제거하는 경우 splice 메서드를 사용한다.
splice 메서드는 3개의 매개변수가 있으며 원본 배열을 직접 변경한다.

- start: 원본 배열의 요소를 제거하기 시작할 인덱스다. start만 지정하면 원본 배열의 start부터 모든 요소를 제거한다.
  start가 음수인 경우 배열의 끝에서 인덱스를 나타낸다. 만약 start가 -1이면 마지막 요소를 가리키고 -n이면 마지막에서 n번째 요소를 가리킨다.

- deleteCount: 원본 배열의 요소를 제거하기 시작할 인덱스 start부터 제거할 요소의 개수다.
  deleteCount가 0인 경우 아무론 요소도 제거되지 않는다(옵션).

- items: 제거한 위치에 삽입할 요소들의 목록이다. 생략할 경우 원본 배열에서 요소들을 제거하기만 한다(옵션).

```js
const arr = [1, 2, 3, 4];

// 원본 배열의 인덱스 1부터 2개의 요소를 제거하고 그 자리에 새로운 요소 20, 30을 삽입한다.
const result = arr.splice(1, 2, 20, 30);

// 제거한 요소가 배열로 반환된다.
console.log(result); // [2, 3]
// splice 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [1, 20, 30, 4]
```

![그림 27-6. Array.prototype.splice 메서드](https://github.com/Zamoca42/blog/assets/96982072/4f09e8ed-2126-47e2-8534-b8f40580253e)

splice 메서드의 두 번째 인수, 즉 제거할 요소의 개수를 0으로 지정하면 아무런 요소도 제거하지 않고 새로운 요소들을 삽입

```js
const arr = [1, 2, 3, 4];

// 원본 배열의 인덱스 1부터 0개의 요소를 제거하고 그 자리에 새로운 요소 100을 삽입한다.
const result = arr.splice(1, 0, 100);

// 원본 배열이 변경된다.
console.log(arr); // [1, 100, 2, 3, 4]
// 제거한 요소가 배열로 반환된다.
console.log(result); // []
```

splice 메서드의 세 번째 인수, 즉 제거한 위치에 추가할 요소들의 목록을 전달하지 않으면 원본 배열에서 지정된 요소를 제거하기만 한다.

```js
const arr = [1, 2, 3, 4];

// 원본 배열의 인덱스 1부터 2개의 요소를 제거한다.
const result = arr.splice(1, 2);

// 원본 배열이 변경된다.
console.log(arr); // [1, 4]
// 제거한 요소가 배열로 반환된다.
console.log(result); // [2, 3]
```

![그림 27-7. Array.prototype.splice 메서드](https://github.com/Zamoca42/blog/assets/96982072/d1d85a48-32a7-4884-8c12-80270302466a)

#### 8.9. Array.prototype.slice

slice 메서드는 인수로 전달된 범위의 요소들을 복사하여 배열로 반환.
원본 배열은 변경되지 않는다.
이름이 유사한 splice 메서드는 원본 배열을 변경하므로 주의하기 바란다.
slice 메서드는 두 개의 매개변수를 갖는다.

- start: 복사를 시작할 인덱스다. 음수인 경우 배열의 끝에서의 인덱스를 나타낸다. 예를 들어, slice(-2)는 배열의 마지막 두 개의 요소를
  복사하여 배열로 반환

- end: 복사를 종료할 인덱스다. 이 인덱스에 해당하는 요소는 복사되지 않는다. end는 생략 가능하며 생략 시 기본값은 length 프로퍼티 값이다.

```js
const arr = [1, 2, 3];

// arr[0]부터 arr[1] 이전(arr[1] 미포함)까지 복사하여 반환한다.
arr.slice(0, 1); // -> [1]

// arr[1]부터 arr[2] 이전(arr[2] 미포함)까지 복사하여 반환한다.
arr.slice(1, 2); // -> [2]

// 원본은 변경되지 않는다.
console.log(arr); // [1, 2, 3]
```

slice 메서드는 첫 뻔재 인수(start)로 전달 받은 인덱스부터 두 번째 인수(end)로 전달 받은 인덱스 이전까지 요소들을 복사하여
배열로 반환한다.

![그림 27-8. Array.prototype.slice 메서드](https://github.com/Zamoca42/blog/assets/96982072/03d352ce-bc54-43fd-a287-bc77040141b6)

slice 메서드의 두 번째 인수(end)를 생략하면 첫 번째 인수(start)로 전달받은 인덱스부터 모든 요소를 복사하여 배열로 반환

```js
const arr = [1, 2, 3];

// arr[1]부터 이후의 모든 요소를 복사하여 반환한다.
arr.slice(1); // -> [2, 3]
```

slice 메서드의 인수를 모두 생략하면 원본 배열의 복사본을 얕은 복사를 통해 생성한다.

```js
const arr = [1, 2, 3];

// 인수를 모두 생략하면 원본 배열의 복사본을 생성하여 반환한다.
const copy = arr.slice();
console.log(copy); // [1, 2, 3]
console.log(copy === arr); // false
```

```js
const todos = [
  { id: 1, content: "HTML", completed: false },
  { id: 2, content: "CSS", completed: true },
  { id: 3, content: "Javascript", completed: false },
];

// 얕은 복사(shallow copy)
const _todos = todos.slice();
// const _todos = [...todos];

// _todos와 todos는 참조값이 다른 별개의 객체다.
console.log(_todos === todos); // false

// 배열 요소의 참조값이 같다. 즉, 얕은 복사되었다.
console.log(_todos[0] === todos[0]); // true
```

::: info 얕은 복사와 깊은 복사
객체를 프로퍼티 값으로 갖는 객체의 경우 얕은 복사는 한 단계까지만 복사하는 것을 말하고

깊은 복사는 객체에 중첩되어 있는 객체까지 모두 복사하는 것을 말한다.

slice 메서드, 스프레드 문법, object.assign 메서드는 모두 얕은 복사를 수행한다.
깊은 복사를 위해서는 Lodash 라이브러 리의 cloneDeep 메서드를 사용하는 것을 추천한다.
:::

#### 8.10. Array.prototype.join

join 메서드는 원본 배열의 모든 요소를 문자열로 변환한 후, 인수로 전달받은 문자열, 즉 구분자로 연결한 문자열을 반환한다.
구분자는 생략 가능하며 기본 구분자는 콤마다.

```js
const arr = [1, 2, 3, 4];

// 기본 구분자는 ','이다.
// 원본 배열 arr의 모든 요소를 문자열로 변환한 후, 기본 구분자 ','로 연결한 문자열을 반환한다.
arr.join(); // -> '1,2,3,4';

// 원본 배열 arr의 모든 요소를 문자열로 변환한 후, 빈문자열로 연결한 문자열을 반환한다.
arr.join(""); // -> '1234'

// 원본 배열 arr의 모든 요소를 문자열로 변환한 후, 구분자 ':'로 연결한 문자열을 반환한다.ㄴ
arr.join(":"); // -> '1:2:3:4'
```

#### 8.11. Array.prototype.reverse

reverse 메서드는 원본 배열의 순서를 반대로 뒤집는다. 이때 원본 배열이 변경된다. 반환값은 변경된 배열이다.

```js
const arr = [1, 2, 3];
const result = arr.reverse();

// reverse 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [3, 2, 1]
// 반환값은 변경된 배열이다.
console.log(result); // [3, 2, 1]
```

#### 8.12. Array.prototype.fill

ES6에서 도입된 fill 메서드는 인수로 전달받은 값을 배열의 처음부터 끝까지 요소로 채운다. 이때 원본 배열이 변경

```js
const arr = [1, 2, 3];

// 인수로 전달 받은 값 0을 배열의 처음부터 끝까지 요소로 채운다.
arr.fill(0);

// fill 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [0, 0, 0]
```

두 번째 인수는 요소 채우기, 세 번째 인수로 요소 채우기를 멈출 인덱스를 전달

```js
const arr = [1, 2, 3];

// 인수로 전달받은 값 0을 배열의 인덱스 1부터 끝까지 요소로 채운다.
arr.fill(0, 1);

// fill 메서드는 원본 배열을 직접 변경한다.
console.log(arr); // [1, 0, 0]
```

Array.from 메서드를 사용하면 두 번째 인수로 전달한 콜백 함수를 통해 요소값을 만들면서 배열을 채울 수 있다.

```js
// 인수로 전달받은 정수만큼 요소를 생성하고 0부터 1씩 증가하면서 요소를 채운다.
const sequences = (length = 0) => Array.from({ length }, (_, i) => i);
// const sequences = (length = 0) => Array.from(new Array(length), (_, i) => i);

console.log(sequences(3)); // [0, 1, 2]
```

#### 8.13. Array.prototype.includes

ES7에서 도입된 includes 메서드는 배열 내에 특정 요소 포함되어 있는지 확인하여 true또는 false를 반환한다.
첫 번째 인수로 검색할 대상을 지정한다.

```js
const arr = [1, 2, 3];

// 배열에 요소 2가 포함되어 있는지 확인한다.
arr.includes(2); // -> true

// 배열에 요소 100이 포함되어 있는지 확인한다.
arr.includes(100); // -> false
```

두 번째 인수로 검색을 시작할 인덱스를 전달할 수 있다.
두 번째 인수를 생략할 경우 기본값 0이 설정된다.

```js
const arr = [1, 2, 3];

// 배열에 요소 1이 포함되어 있는지 인덱스 1부터 확인한다.
arr.includes(1, 1); // -> false

// 배열에 요소 3이 포함되어 있는지 인덱스 2(arr.length - 1)부터 확인한다.
arr.includes(3, -1); // -> true
```

배열 내의 특정 요소가 포함되어 있는지 확인할 수 있다.

```js
[NaN].indexOf(NaN) !== -1; // -> false
[NaN].includes(NaN); // -> true
```

#### 8.14. Array.prototype.flat

flat 메서드는 인수로 전달한 깊이만큼 재귀적으로 배열을 평탄화한다.

```js
[1, [2, 3, 4, 5]].flat(); // -> [1, 2, 3, 4, 5]
```

중첩 배열을 평탄화할 깊이를 인수로 전달. 인수를 생략할 경우 기본값은 1이다.

```js
// 중첩 배열을 평탄화하기 위한 깊이 값의 기본값은 1이다.
[1, [2, [3, [4]]]].flat(); // -> [1, 2, [3, [4]]]
[1, [2, [3, [4]]]].flat(1); // -> [1, 2, [3, [4]]]

// 중첩 배열을 평탄화하기 위한 깊이 값을 2로 지정하여 2단계 깊이까지 평탄화한다.
[1, [2, [3, [4]]]].flat(2); // -> [1, 2, 3, [4]]
// 2번 평탄화한 것과 동일하다.
[1, [2, [3, [4]]]].flat().flat(); // -> [1, 2, 3, [4]]

// 중첩 배열을 평탄화하기 위한 깊이 값을 Infinity로 지정하여 중첩 배열 모두를 평탄화한다.
[1, [2, [3, [4]]]].flat(Infinity); // -> [1, 2, 3, 4]
```

## 9. 배열 고차 함수

고차 함수는 **함수를 인수로 전달받거나 함수를 반환하는 함수**를 말한다.
고차 함수는 외부 상태의 변경이나 가변 데이터를 피하고 불변성을 지향하는 함수형 프로그래밍에 기반을 두고 있다.

함수형 프로그래밍은 결국 순수 함수를 통해 부수 효과를 최대한 억제하여 오류를 피하고 프로그램의 안정성을 높이려는 노력의 일환이라고 할 수 있다.

#### 9.1. Array.prototype.sort

배열의 요소를 정렬한다.
원본 배열을 직접 변경하며 정렬된 배열을 반환한다.
기본적으로 오름차순으로 요소를 정렬한다.

```js
const fruits = ["Banana", "Orange", "Apple"];

// 오름차순(ascending) 정렬
fruits.sort();

// sort 메서드는 원본 배열을 직접 변경한다.
console.log(fruits); // ['Apple', 'Banana', 'Orange']
```

한글 문자열인 요소도 오름차순으로 정렬된다.

```js
const fruits = ["바나나", "오렌지", "사과"];

// 오름차순(ascending) 정렬
fruits.sort();

// sort 메서드는 원본 배열을 직접 변경한다.
console.log(fruits); // ['바나나', '사과', '오렌지']
```

내림차순으로 요소를 정렬하려면 sort메서드를 이용하여 오룸차순 정렬 후 reverse 메서드를 사용

```js
const fruits = ["Banana", "Orange", "Apple"];

// 오름차순(ascending) 정렬
fruits.sort();

// sort 메서드는 원본 배열을 직접 변경한다.
console.log(fruits); // ['Apple', 'Banana', 'Orange']

// 내림차순(descending) 정렬
fruits.reverse();

// reverse 메서드도 원본 배열을 직접 변경한다.
console.log(fruits); // ['Orange', 'Banana', 'Apple']
```

sort 메서드의 기본 정렬 순서는 유니코드 코드 포인트의 순서를 따른다.

```js
const points = [40, 100, 1, 5, 2, 25, 10];

points.sort();

// 숫자 요소들로 이루어진 배열은 의도한 대로 정렬되지 않는다.
console.log(points); // [1, 10, 100, 2, 25, 40, 5]
```

따라서 숫자 요소를 정렬할 때는 sort 메서드에 정렬 순서를 정의하는 비교 함수를 인수로 전달

```js
const points = [40, 100, 1, 5, 2, 25, 10];

// 숫자 배열의 오름차순 정렬. 비교 함수의 반환값이 0보다 작으면 a를 우선하여 정렬한다.
points.sort((a, b) => a - b);
console.log(points); // [1, 2, 5, 10, 25, 40, 100]

// 숫자 배열에서 최소/최대값 취득
console.log(points[0], points[points.length]); // 1

// 숫자 배열의 내림차순 정렬. 비교 함수의 반환값이 0보다 크면 b를 우선하여 정렬한다.
points.sort((a, b) => b - a);
console.log(points); // [100, 40, 25, 10, 5, 2, 1]

// 숫자 배열에서 최대값 취득
console.log(points[0]); // 100
```

객체를 요소로 갖는 배열을 정렬하는 예제는 다음과 같다.

```js
const todos = [
  { id: 4, content: "JavaScript" },
  { id: 1, content: "HTML" },
  { id: 2, content: "CSS" },
];

// 비교 함수. 매개변수 key는 프로퍼티 키다.
function compare(key) {
  // 프로퍼티 값이 문자열인 경우 - 산술 연산으로 비교하면 NaN이 나오므로 비교 연산을 사용한다.
  // 비교 함수는 양수/음수/0을 반환하면 되므로 - 산술 연산 대신 비교 연산을 사용할 수 있다.
  return (a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0);
}

// id를 기준으로 오름차순 정렬
todos.sort(compare("id"));
console.log(todos);
/*
[
  { id: 1, content: 'HTML' },
  { id: 2, content: 'CSS' },
  { id: 4, content: 'JavaScript' }
]
*/

// content를 기준으로 오름차순 정렬
todos.sort(compare("content"));
console.log(todos);
/*
[
  { id: 2, content: 'CSS' },
  { id: 1, content: 'HTML' },
  { id: 4, content: 'JavaScript' }
]
*/
```

:::info sort 메서드의 정렬 알고리즘
sort 메서드는 quicksort 알고리즘을 사용했었다. quicksort 알고리즘은 동일한 값의 요소가 중복되어 있을 때 초기 순서와 변경될 수 있는 불안정한 정렬 알고리즘으로 알려져 있다. ECMAScript 2019(ES10)에서는 timesort 알고리즘을 사용하도록 바뀌었다.
:::

#### 9.2. Array.prototype.forEach

함수형 프로그래밍은 순수 함수와 보조 함수의 조합을 통해 로직 내에 존재하는 조건문과 반복문을 제거하여 복잡성을 해결
변수의 사용을 억제하여 상태 변경을 피하려는 프로그래밍 패러다임이다.

```js
const numbers = [1, 2, 3];
let pows = [];

// for 문으로 배열 순회
for (let i = 0; i < numbers.length; i++) {
  pows.push(numbers[i] ** 2);
}
console.log(pows); // [1, 4, 9]
```

forEach 메서드는 for 문을 대체할 수 있는 고차 함수다. forEach 메서드는 자신의 내부에서 반복문을 실행한다.

```js
const numbers = [1, 2, 3];
let pows = [];

// forEach 메서드는 numbers 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다.
numbers.forEach((item) => pows.push(item ** 2));
console.log(pows); // [1, 4, 9]
```

위 예제의 경우 forEach 메서드는 numbers 배열의 모든 요소를 순회하며 콜백 함수를 반복 호출한다.
forEach 메서드를 호출한 배열의 요소값과 인덱스, forEach 메서드를 호출한 배열을 순차적으로 전달

```js
// forEach 메서드는 콜백 함수를 호출하면서 3개(요소값, 인덱스, this)의 인수를 전달한다.
[1, 2, 3].forEach((item, index, arr) => {
  console.log(
    `요소값: ${item}, 인덱스: ${index}, this: ${JSON.stringify(arr)}`
  );
});
/*
요소값: 1, 인덱스: 0, this: [1,2,3]
요소값: 2, 인덱스: 1, this: [1,2,3]
요소값: 3, 인덱스: 2, this: [1,2,3]
*/
```

forEach 메서드는 원본 배열을 변경하지않는다.
하지만 콜백 함수를 통해 원본 배열을 변경할 수는 있다.

```js
const numbers = [1, 2, 3];

// forEach 메서드는 원본 배열을 변경하지 않지만 콜백 함수를 통해 원본 배열을 변경할 수는 있다.
// 콜백 함수의 세 번째 매개변수 arr은 원본 배열 numbers를 가리킨다.
// 따라서 콜백 함수의 세 번째 매개변수 arr을 직접 변경하면 원본 배열 numbers가 변경된다.
numbers.forEach((item, index, arr) => {
  arr[index] = item ** 2;
});
console.log(numbers); // [1, 4, 9]
```

```js
class Numbers {
  numberArray = [];

  multiply(arr) {
    // 화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 그대로 참조한다.
    arr.forEach((item) => this.numberArray.push(item * item));
  }
}

const numbers = new Numbers();
numbers.multiply([1, 2, 3]);
console.log(numbers.numberArray); // [1, 4, 9]
```

forEach 메서드는 for문에 비해 성능이 좋지는 않지만 가독성은 더 좋다.

#### 9.3. Array.prototype.map

콜백 함수의 반환값들로 구성된 새로운 배열을 반환한다.

```js
const numbers = [1, 4, 9];

// map 메서드는 numbers 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다.
// 그리고 콜백 함수의 반환값들로 구성된 새로운 배열을 반환한다.
const roots = numbers.map((item) => Math.sqrt(item));

// 위 코드는 다음과 같다.
// const roots = numbers.map(Math.sqrt);

// map 메서드는 새로운 배열을 반환한다
console.log(roots); // [ 1, 2, 3 ]
// map 메서드는 원본 배열을 변경하지 않는다
console.log(numbers); // [ 1, 4, 9 ]
```

forEach 메서드는 언제나 undefined를 반환. 단순히 반복문을 대체하기 위한 고차함수
map 메서드는 반환값들로 구성된 새로운 배열을 반환. 요소값을 다른 값으로 매핑한 새로운 배열을 생성하기 위한 고차 함수다.

map 메서드가 생성하여 반환하는 새로운 배열의 length 프로퍼티 값은 map 메서드를 호출한 배열의 length 프로퍼티 값과 반드시 일치. 즉, 1:1 매핑

![그림 27-9. Array.prototype.map](https://github.com/Zamoca42/blog/assets/96982072/efc5722d-2d49-40eb-b1b2-2c6a8bb68dfe)

```js
class Prefixer {
  constructor(prefix) {
    this.prefix = prefix;
  }

  add(arr) {
    // 화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 그대로 참조한다.
    return arr.map((item) => this.prefix + item);
  }
}

const prefixer = new Prefixer("-webkit-");
console.log(prefixer.add(["transition", "user-select"]));
// ['-webkit-transition', '-webkit-user-select']
```

#### 9.4. Array.prototype.filter

콜백 함수의 반환값이 true인 요소로만 구성된 새로운 배열을 반환.

```js
const numbers = [1, 2, 3, 4, 5];

// filter 메서드는 numbers 배열의 모든 요소를 순회하면서 콜백 함수를 반복 호출한다.
// 그리고 콜백 함수의 반환값이 true인 요소로만 구성된 새로운 배열을 반환한다.
// 다음의 경우 numbers 배열에서 홀수인 요소만을 필터링한다(1은 true로 평가된다).
const odds = numbers.filter((item) => item % 2);
console.log(odds); // [1, 3, 5]
```

![그림 27-10. Array.prototype.filter](https://github.com/Zamoca42/blog/assets/96982072/8f290284-c853-487d-a89e-fcbb00865ac3)

filter 메서드는 콜백 함수의 반환값이 true인 요소만 추출한 새로운 배열에 반환
필터링 조건을 만족하는 특정 요소만 추출하여 새로운 배열을 만들고 싶을 때 사용.

```js
class Users {
  constructor() {
    this.users = [
      { id: 1, name: "Lee" },
      { id: 2, name: "Kim" },
    ];
  }

  // 요소 추출
  findById(id) {
    // id가 일치하는 사용자만 반환한다.
    return this.users.filter((user) => user.id === id);
  }

  // 요소 제거
  remove(id) {
    // id가 일치하지 않는 사용자를 제거한다.
    this.users = this.users.filter((user) => user.id !== id);
  }
}

const users = new Users();

let user = users.findById(1);
console.log(user); // [{ id: 1, name: 'Lee' }]

// id가 1인 사용자를 제거한다.
users.remove(1);

user = users.findById(1);
console.log(user); // []
```

#### 9.5. Array.prototype.reduce

콜백 함수를 호출하여 하나의 결과값을 만들어 반환한다.
인수로 콜백, 초기값, 요소값, 배열 순으로 전달된다.

```js
// [1, 2, 3, 4]의 모든 요소의 누적을 구한다.
const sum = [1, 2, 3, 4].reduce(
  (accumulator, currentValue, index, array) => accumulator + currentValue,
  0
);

console.log(sum); // 10
```

![그림 27-11. Array.prototype.reduce](https://github.com/Zamoca42/blog/assets/96982072/5687c4e8-9d43-4aed-bf2e-7e5fbb6a1b74)

reduce 메서드는 하나의 결과값을 반환한다.

##### 평균 구하기

```js
const values = [1, 2, 3, 4, 5, 6];

const average = values.reduce((acc, cur, i, { length }) => {
  // 마지막 순회가 아니면 누적값을 반환하고 마지막 순회면 누적값으로 평균을 구해 반환한다.
  return i === length - 1 ? (acc + cur) / length : acc + cur;
}, 0);

console.log(average); // 3.5
```

##### 요소의 중복 횟수 구하기

```js
const fruits = ["banana", "apple", "orange", "orange", "apple"];

const count = fruits.reduce((acc, cur) => {
  // 첫 번째 순회 시 acc는 초기값인 {}이고 cur은 첫 번째 요소인 'banana'다.
  // 초기값으로 전달받은 빈 객체에 요소값인 cur을 프로퍼티 키로, 요소의 개수를 프로퍼티 값으로
  // 할당한다. 만약 프로퍼티 값이 undefined(처음 등장하는 요소)이면 프로퍼티 값을 1로 초기화한다.
  acc[cur] = (acc[cur] || 0) + 1;
  return acc;
}, {});

// 콜백 함수는 총 5번 호출되고 다음과 같이 결과값을 반환한다.
/*
{banana: 1} => {banana: 1, apple: 1} => {banana: 1, apple: 1, orange: 1}
=> {banana: 1, apple: 1, orange: 2} => {banana: 1, apple: 2, orange: 2}
*/

console.log(count); // { banana: 1, apple: 2, orange: 2 }
```

##### 중복 요소 제거

```js
const values = [1, 2, 1, 3, 5, 4, 5, 3, 4, 4];

const result = values.reduce(
  (unique, val, i, _values) =>
    // 현재 순회 중인 요소의 인덱스 i가 val의 인덱스와 같다면 val은 처음 순회하는 요소다.
    // 현재 순회 중인 요소의 인덱스 i가 val의 인덱스와 다르다면 val은 중복된 요소다.
    // 처음 순회하는 요소만 초기값 []가 전달된 unique 배열에 담아 반환하면 중복된 요소는 제거된다.
    _values.indexOf(val) === i ? [...unique, val] : unique,
  []
);

console.log(result); // [1, 2, 3, 5, 4]
```

중복 요소를 제거할 때는 유일한 값들의 집합인 Set을 사용할 수도 있다.

```js
const values = [1, 2, 1, 3, 5, 4, 5, 3, 4, 4];

// 중복을 허용하지 않는 Set 객체의 특성을 활용하여 배열에서 중복된 요소를 제거할 수 있다.
const result = [...new Set(values)];
console.log(result); // [1, 2, 3, 5, 4]
```

map, filter, some, every, find 같은 고차 함수는 reduce 메서드로 구현할 수 있다.

```js
// reduce 메서드의 두 번째 인수, 즉 초기값을 생략했다.
const sum = [1, 2, 3, 4].reduce((acc, cur) => acc + cur);
console.log(sum); // 10
```

![그림 27-12. Array.prototype.reduce 메서드의 초기값 생략](https://github.com/Zamoca42/blog/assets/96982072/bd8b3c0b-2296-4b65-a695-8b2a63d2a3a7)

reduce 메서드를 호출할 때는 언제나 초기값을 전달하는 것이 안전하다.

```js
const sum = [].reduce((acc, cur) => acc + cur);
// TypeError: Reduce of empty array with no initial value
```

빈 배열을 호출하면 에러가 발생한다.

```js
const sum = [].reduce((acc, cur) => acc + cur, 0);
console.log(sum); // 0
```

초기 값을 전달하면 에러가 발생하지 않는다.

#### 9.6. Array.prototype.some

some 메서드는 콜백 함수의 반환 값이 단 한 번이라도 참이면 true,
모두 거짓이면 false를 반환

```js
// 배열의 요소 중에 10보다 큰 요소가 1개 이상 존재하는지 확인
[5, 10, 15].some((item) => item > 10); // -> true

// 배열의 요소 중에 0보다 작은 요소가 1개 이상 존재하는지 확인
[5, 10, 15].some((item) => item < 0); // -> false

// 배열의 요소 중에 'banana'가 1개 이상 존재하는지 확인
["apple", "banana", "mango"].some((item) => item === "banana"); // -> true

// some 메서드를 호출한 배열이 빈 배열인 경우 언제나 false를 반환한다.
[].some((item) => item > 3); // -> false
```

#### 9.7. Array.prototype.every

콜백 함수의 반환값이 모두 참이면 true, 단 한번이라도 거짓이면 false를 반환

```js
// 배열의 모든 요소가 3보다 큰지 확인
[5, 10, 15].every((item) => item > 3); // -> true

// 배열의 모든 요소가 10보다 큰지 확인
[5, 10, 15].every((item) => item > 10); // -> false

// every 메서드를 호출한 배열이 빈 배열인 경우 언제나 true를 반환한다.
[].every((item) => item > 3); // -> true
```

#### 9.8. Array.prototype.find

콜백 함수를 호출하여 반환값이 true인 첫 번째 요소를 반환한다.
find의 결과값은 배열이 아닌 요소값이다.

```js
const users = [
  { id: 1, name: "Lee" },
  { id: 2, name: "Kim" },
  { id: 2, name: "Choi" },
  { id: 3, name: "Park" },
];

// id가 2인 첫 번째 요소를 반환한다. find 메서드는 배열이 아니라 요소를 반환한다.
users.find((user) => user.id === 2); // -> {id: 2, name: 'Kim'}
```

```js
// Array#filter는 배열을 반환한다.
[1, 2, 2, 3].filter((item) => item === 2); // -> [2, 2]

// Array#find는 요소를 반환한다.
[1, 2, 2, 3].find((item) => item === 2); // -> 2
```

#### 9.9. Array.prototype.findIndex

콜백 함수를 호출하여 반환값이 true인 첫 번째 요소의 인덱스를 반환한다.

```js
const users = [
  { id: 1, name: "Lee" },
  { id: 2, name: "Kim" },
  { id: 2, name: "Choi" },
  { id: 3, name: "Park" },
];

// id가 2인 요소의 인덱스를 구한다.
users.findIndex((user) => user.id === 2); // -> 1

// name이 'Park'인 요소의 인덱스를 구한다.
users.findIndex((user) => user.name === "Park"); // -> 3

// 위와 같이 프로퍼티 키와 프로퍼티 값으로 요소의 인덱스를 구하는 경우
// 다음과 같이 콜백 함수를 추상화할 수 있다.
function predicate(key, value) {
  // key와 value를 기억하는 클로저를 반환
  return (item) => item[key] === value;
}

// id가 2인 요소의 인덱스를 구한다.
users.findIndex(predicate("id", 2)); // -> 1

// name이 'Park'인 요소의 인덱스를 구한다.
users.findIndex(predicate("name", "Park")); // -> 3
```

#### 9.10. Array.prototype.flatMap

map 메서드를 통해 생성된 새로운 배열을 평탄화 한다.
map과 flat을 순차적으로 실행하는 효과가 있다.

```js
const arr = ["hello", "world"];

// map과 flat을 순차적으로 실행
arr.map((x) => x.split("")).flat();
// -> ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']

// flatMap은 map을 통해 생성된 새로운 배열을 평탄화한다.
arr.flatMap((x) => x.split(""));
// -> ['h', 'e', 'l', 'l', 'o', 'w', 'o', 'r', 'l', 'd']
```

단, flatmap은 1단계만 평탄화 가능하다.

```js
const arr = ["hello", "world"];

// flatMap은 1단계만 평탄화한다.
arr.flatMap((str, index) => [index, [str, str.length]]);
// -> [[0, ['hello', 5]], [1, ['world', 5]]] => [0, ['hello', 5], 1, ['world', 5]]

// 평탄화 깊이를 지정해야 하면 flatMap 메서드를 사용하지 말고 map 메서드와 flat 메서드를 각각 호출한다.
arr.map((str, index) => [index, [str, str.length]]).flat(2);
// -> [[0, ['hello', 5]], [1, ['world', 5]]] => [0, 'hello', 5, 1, 'world', 5]
```
