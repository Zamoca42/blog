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

![그림 27-1. 자료구조에서 말하는 배열은 동일한 크기의 메모리 공간이 빈틈없이 연속적으로 나열된 자료구조다.]()

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

![그림 27-2. 배열 요소의 삽입과 삭제]()

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

## 7. 배열 요소의 삭제

## 8. 배열 메서드

#### 8.1. Array.isArray

#### 8.2. Array.prototype.indexOf

#### 8.2. Array.

#### 8.3. Array.

#### 8.4. Array.

#### 8.5. Array.

#### 8.6. Array.

#### 8.7. Array.

#### 8.8. Array.

#### 8.9. Array.

#### 8.10. Array.

#### 8.11. Array.

#### 8.12. Array.

#### 8.13. Array.

#### 8.14. Array.

## 9. 배열 고차 함수

#### 9.1. Array.prototype

#### 9.2. Array.prototype

#### 9.3. Array.prototype

#### 9.4. Array.prototype

#### 9.5. Array.prototype

#### 9.6. Array.prototype

#### 9.7. Array.prototype

#### 9.8. Array.prototype

#### 9.9. Array.prototype

#### 9.10. Array.prototype
