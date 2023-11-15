---
title: 37. Set과 Map
---

## 1. Set

Set 객체는 중복되지 않는 유일한 값들의 집합으로 배열과 유사하지만 다음과 같은 차이가 있다.

| 구분                      | 배열 | Set 객체 |
| ------------------------- | :--: | :------: |
| 동일한 값을 중복하여 포함 | :o:  |   :x:    |
| 요소 순서에 의미          | :o:  |   :x:    |
| 인덱스로 요소에 접근      | :o:  |   :x:    |

#### Set 객체의 특성

- 수학적 집합의 특성과 일치
- 집합을 구현하기 위한 자료구조
- 교집합, 합집합, 차집합, 여집합 등을 구현

### 1.1. Set 객체의 생성

Set 생성자 함수로 생성한다. 생성자 함수에 인수를 전달하지 않으면 빈 객체가 생성된다.

```js
const set = new Set();
console.log(set); // Set(0) {}
```

Set 생성자 함수는 이터러블 인수로 전달받아 Set 객체를 생성
이때 이터러블의 중복된 값은 Set 객체에 요소로 저장되지 않는다.

```js
const set1 = new Set([1, 2, 3, 3]);
console.log(set1); // Set(3) {1, 2, 3}

const set2 = new Set("hello");
console.log(set2); // Set(4) {"h", "e", "l", "o"}
```

중복을 허용하지 않는 Set 객체의 특성을 활용하여 배열에서 중복된 요소를 제거

```js
// 배열의 중복 요소 제거
const uniq = (array) => array.filter((v, i, self) => self.indexOf(v) === i);
console.log(uniq([2, 1, 2, 3, 4, 3, 4])); // [2, 1, 3, 4]

// Set을 사용한 배열의 중복 요소 제거
const uniq = (array) => [...new Set(array)];
console.log(uniq([2, 1, 2, 3, 4, 3, 4])); // [2, 1, 3, 4]
```

### 1.2. 요소 개수 확인

요소 개수를 확인할 때는 Set.prototype.size 프로퍼티를 사용

```js
const { size } = new Set([1, 2, 3, 3]);
console.log(size); // 3
```

size 프로퍼티는 setter 없이 getter만 존재하는 접근자 프로퍼티
따라서 요소의 개수를 변경할 수 없다.

```js
const set = new Set([1, 2, 3]);

console.log(Object.getOwnPropertyDescriptor(Set.prototype, "size"));
// {set: undefined, enumerable: false, configurable: true, get: ƒ}

set.size = 10; // 무시된다.
console.log(set.size); // 3
```

### 1.3. 요소 추가

요소를 추가할 때는 Set.prototype.add 메서드를 사용

```js
const set = new Set();
console.log(set); // Set(0) {}

set.add(1);
console.log(set); // Set(1) {1}
```

add 메서드는 새로운 요소에 추가된 Set 객체를 반환
따라서 add 메서드를 호출한 후에 add 메서드를 연속으로 호출

```js
const set = new Set();

set.add(1).add(2);
console.log(set); // Set(2) {1, 2}
```

add 메서드는 새로운 요소가 추가된 Set 객체를 반환.
연속적으로 호출할 수 있다.

```js
const set = new Set();

set.add(1).add(2);
console.log(set); // Set(2) {1, 2}
```

중복된 요소의 추가는 허용하지 않는다.

```js
const set = new Set();

set.add(1).add(2).add(2);
console.log(set); // Set(2) {1, 2}
```

일치 비교 연산자를 사용하면 NaN과 NaN을 다르다고 평가한다.

```js
const set = new Set();

console.log(NaN === NaN); // false
console.log(0 === -0); // true

// NaN과 NaN을 같다고 평가하여 중복 추가를 허용하지 않는다.
set.add(NaN).add(NaN);
console.log(set); // Set(1) {NaN}

// +0과 -0을 같다고 평가하여 중복 추가를 허용하지 않는다.
set.add(0).add(-0);
console.log(set); // Set(2) {NaN, 0}
```

Set 객체는 객체나 배열과 같이 자바스크립트의 모든 값을 요소로 저장

```js
const set = new Set();

set.add(1).add("a").add(true).add(undefined).add(null).add({}).add([]);

console.log(set); // Set(7) {1, "a", true, undefined, null, {}, []}
```

### 1.4. 요소 존재 여부 확인

특정 요소가 존재하는지 확인하려면 Set.prototype.has 메서드를 사용하고
has 메서드는 불리언 값을 반환한다.

```js
const set = new Set([1, 2, 3]);

console.log(set.has(2)); // true
console.log(set.has(4)); // false
```

### 1.5. 요소 삭제

특정 요소를 삭제하려면 Set.prototype.delete 메서드를 사용한다.
삭제 성공 여부를 나타내는 불리언 값을 반환

Set 객체는 순서가 의미가 없다.

```js
const set = new Set([1, 2, 3]);

// 요소 2를 삭제한다.
set.delete(2);
console.log(set); // Set(2) {1, 3}

// 요소 1을 삭제한다.
set.delete(1);
console.log(set); // Set(1) {3}
```

만약 존재하지 않는 요소를 삭제하려면 무시된다.

```js
const set = new Set([1, 2, 3]);

// 존재하지 않는 요소 0을 삭제하면 에러없이 무시된다.
set.delete(0);
console.log(set); // Set(3) {1, 2, 3}
```

삭제 성공 여부를 나타내는 불리언 값을 반환한다.
add 메서드와 달리 연속적으로 호출할 수 없다.

```js
const set = new Set([1, 2, 3]);

// delete는 불리언 값을 반환한다.
set.delete(1).delete(2); // TypeError: set.delete(...).delete is not a function
```

### 1.6. 요소 일괄 삭제

일괄 삭제하려면 Set.prototype.clear 메서드를 사용한다.
clear 메서드는 언제나 undefined를 반환한다.

```js
const set = new Set([1, 2, 3]);

set.clear();
console.log(set); // Set(0) {}
```

### 1.7. 요소 순회

Set 객체의 요소를 순회하려면 Set.prototype.forEach 메서드를 사용한다.
이때 콜백 함수는 다음과 같이 3개의 인수를 전달

- 첫번째: 현재 순회 중인 요소
- 두번째: 현재 순회 중인 요소
- 세번쨰: 현재 순회 중인 Set 객체

```js
const set = new Set([1, 2, 3]);

set.forEach((v, v2, set) => console.log(v, v2, set));
/*
1 1 Set(3) {1, 2, 3}
2 2 Set(3) {1, 2, 3}
3 3 Set(3) {1, 2, 3}
*/
```

Set 객체는 이터러블이다. 스프레드 문법과 배열 디스트럭처링의 대상이 될 수도 있다.

```js
const set = new Set([1, 2, 3]);

// Set 객체는 Set.prototype의 Symbol.iterator 메서드를 상속받는 이터러블이다.
console.log(Symbol.iterator in set); // true

// 이터러블인 Set 객체는 for...of 문으로 순회할 수 있다.
for (const value of set) {
  console.log(value); // 1 2 3
}

// 이터러블인 Set 객체는 스프레드 문법의 대상이 될 수 있다.
console.log([...set]); // [1, 2, 3]

// 이터러블인 Set 객체는 배열 디스트럭처링 할당의 대상이 될 수 있다.
const [a, ...rest] = [...set];
console.log(a, rest); // 1, [2, 3]
```

### 1.8. 집합 연산

Set 객체를 통해 교집합, 합집합, 차집합 등을 구현할 수 있다.

#### 교집합

집합 A와 집합 B의 공통 요소로 구성된다.

##### 방법 1

```js
Set.prototype.intersection = function (set) {
  const result = new Set();

  for (const value of set) {
    // 2개의 set의 요소가 공통되는 요소이면 교집합의 대상이다.
    if (this.has(value)) result.add(value);
  }

  return result;
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA와 setB의 교집합
console.log(setA.intersection(setB)); // Set(2) {2, 4}
// setB와 setA의 교집합
console.log(setB.intersection(setA)); // Set(2) {2, 4}
```

##### 방법 2

```js
Set.prototype.intersection = function (set) {
  return new Set([...this].filter((v) => set.has(v)));
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA와 setB의 교집합
console.log(setA.intersection(setB)); // Set(2) {2, 4}
// setB와 setA의 교집합
console.log(setB.intersection(setA)); // Set(2) {2, 4}
```

#### 합집합

집합 A와 집합 B의 중복 없는 모든 요소로 구성

##### 방법 1

```js
Set.prototype.union = function (set) {
  // this(Set 객체)를 복사
  const result = new Set(this);

  for (const value of set) {
    // 합집합은 2개의 Set 객체의 모든 요소로 구성된 집합이다. 중복된 요소는 포함되지 않는다.
    result.add(value);
  }

  return result;
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA와 setB의 합집합
console.log(setA.union(setB)); // Set(4) {1, 2, 3, 4}
// setB와 setA의 합집합
console.log(setB.union(setA)); // Set(4) {2, 4, 1, 3}
```

##### 방법 2

```js
Set.prototype.union = function (set) {
  return new Set([...this, ...set]);
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA와 setB의 합집합
console.log(setA.union(setB)); // Set(4) {1, 2, 3, 4}
// setB와 setA의 합집합
console.log(setB.union(setA)); // Set(4) {2, 4, 1, 3}
```

#### 차집합

집합 A에는 존재하지만 집합 B에는 존재하지 않는 요소로 구성된다.

##### 방법 1

```js
Set.prototype.difference = function (set) {
  // this(Set 객체)를 복사
  const result = new Set(this);

  for (const value of set) {
    // 차집합은 어느 한쪽 집합에는 존재하지만 다른 한쪽 집합에는 존재하지 않는 요소로 구성된 집합이다.
    result.delete(value);
  }

  return result;
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA에 대한 setB의 차집합
console.log(setA.difference(setB)); // Set(2) {1, 3}
// setB에 대한 setA의 차집합
console.log(setB.difference(setA)); // Set(0) {}
```

##### 방법 2

```js
Set.prototype.difference = function (set) {
  return new Set([...this].filter((v) => !set.has(v)));
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA에 대한 setB의 차집합
console.log(setA.difference(setB)); // Set(2) {1, 3}
// setB에 대한 setA의 차집합
console.log(setB.difference(setA)); // Set(0) {}
```

#### 부분 집합과 상위 집합

##### 방법 1

```js
// this가 subset의 상위 집합인지 확인한다.
Set.prototype.isSuperset = function (subset) {
  for (const value of subset) {
    // superset의 모든 요소가 subset의 모든 요소를 포함하는지 확인
    if (!this.has(value)) return false;
  }

  return true;
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA가 setB의 상위 집합인지 확인한다.
console.log(setA.isSuperset(setB)); // true
// setB가 setA의 상위 집합인지 확인한다.
console.log(setB.isSuperset(setA)); // false
```

##### 방법 2

```js
// this가 subset의 상위 집합인지 확인한다.
Set.prototype.isSuperset = function (subset) {
  const supersetArr = [...this];
  return [...subset].every((v) => supersetArr.includes(v));
};

const setA = new Set([1, 2, 3, 4]);
const setB = new Set([2, 4]);

// setA가 setB의 상위 집합인지 확인한다.
console.log(setA.isSuperset(setB)); // true
// setB가 setA의 상위 집합인지 확인한다.
console.log(setB.isSuperset(setA)); // false
```

## 2. Map

Map 객체는 키와 값의 쌍으로 이루어진 컬렉션이다.

| 구분                   | 객체                    | Map 객체              |
| ---------------------- | ----------------------- | --------------------- |
| 키로 사용할 수 있는 값 | 문자열 또는 심벌 값     | 객체를 포함한 모든 값 |
| 이터러블               | :x:                     | :o:                   |
| 요소 개수 확인         | Object.keys(obj).length | map.size              |

### 2.1. Map 객체의 생성

Map 객체는 생성자 함수로 생성한다. 함수에 인수를 전달하지 않으면 빈 Map 객체가 생성된다.

```js
const map = new Map();
console.log(map); // Map(0) {}
```

Map 생성자 함수는 이터러블을 인수로 전달받아 객체를 생성한다. 이때 인수는 키와 값의 쌍으로 이루어진 요소로 구성되어야 한다.

```js
const map1 = new Map([
  ["key1", "value1"],
  ["key2", "value2"],
]);
console.log(map1); // Map(2) {"key1" => "value1", "key2" => "value2"}

const map2 = new Map([1, 2]); // TypeError: Iterator value 1 is not an entry object
```

중복된 키를 갖는 요소가 존재하면 값이 덮어 써진다.

```js
const map = new Map([
  ["key1", "value1"],
  ["key1", "value2"],
]);
console.log(map); // Map(1) {"key1" => "value2"}
```

### 2.2. 요소 개수 확인

요소의 개수를 확인할 때는 Map.prototype.size 프로퍼티를 사용한다.

```js
const { size } = new Map([
  ["key1", "value1"],
  ["key2", "value2"],
]);
console.log(size); // 2
```

size 프로퍼티는 getter만 존재해서 숫자를 할당하여 요소의 개수를 변경할 수 없다.

### 2.3. 요소 추가

요소를 추가할 때는 Map.prototype.set 메서드를 사용한다.

```js
const map = new Map();
console.log(map); // Map(0) {}

map.set("key1", "value1");
console.log(map); // Map(1) {"key1" => "value1"}
```

set 메서드는 새로운 요소가 추가된 Map 객체를 반환한다. 연속적으로 호출할 수 있따.

```js
const map = new Map();

map.set("key1", "value1").set("key2", "value2");

console.log(map); // Map(2) {"key1" => "value1", "key2" => "value2"}
```

중복된 키를 갖는 요소를 추가하면 값이 덮어 써진다. 에러가 발생하지 않는다.

```js
const map = new Map();

map.set("key1", "value1").set("key1", "value2");

console.log(map); // Map(1) {"key1" => "value2"}
```

일치 비교 연산자 ===을 사용하면 NaN과 NaN을 다르다고 평가한다. Set과 같다.
일반 객체는 문자열 또는 심벌 값만 키로 사용할 수 있다.
Map 객체는 키 타입에 제한이 없다. 일반 객체와의 차이점이다.

```js
const map = new Map();

console.log(NaN === NaN); // false
console.log(0 === -0); // true

// NaN과 NaN을 같다고 평가하여 중복 추가를 허용하지 않는다.
map.set(NaN, "value1").set(NaN, "value2");
console.log(map); // Map(1) { NaN => 'value2' }

// +0과 -0을 같다고 평가하여 중복 추가를 허용하지 않는다.
map.set(0, "value1").set(-0, "value2");
console.log(map); // Map(2) { NaN => 'value2', 0 => 'value2' }
```

### 2.4. 요소 취득

Map.prototype.get 메서드로 특정 요소를 취득

```js
const map = new Map();

const lee = { name: "Lee" };
const kim = { name: "Kim" };

map.set(lee, "developer").set(kim, "designer");

console.log(map.get(lee)); // developer
console.log(map.get("key")); // undefined
```

### 2.5. 요소 존재 여부 확인

Map.prototype.has로 특정 요소가 존재하는지 확인. 존재 여부를 나타내는 불리언 값을 반환

```js
const lee = { name: "Lee" };
const kim = { name: "Kim" };

const map = new Map([
  [lee, "developer"],
  [kim, "designer"],
]);

console.log(map.has(lee)); // true
console.log(map.has("key")); // false
```

### 2.6. 요소 삭제

Map.prototype.delete로 객체의 요소를 삭제하고 성공 여부로 불리언 값을 반환

```js
const lee = { name: "Lee" };
const kim = { name: "Kim" };

const map = new Map([
  [lee, "developer"],
  [kim, "designer"],
]);

map.delete(kim);
console.log(map); // Map(1) { {name: "Lee"} => "developer" }
```

delete 메서드는 연속적으로 호출할 수 없다.

```js
const lee = { name: "Lee" };
const kim = { name: "Kim" };

const map = new Map([
  [lee, "developer"],
  [kim, "designer"],
]);

map.delete(lee).delete(kim); // TypeError: map.delete(...).delete is not a function
```

### 2.7. 요소 일괄 삭제

Map.prototype.clear 메서드를 사용하여 요소를 일괄 삭제하고 undefined를 반환

```js
const lee = { name: "Lee" };
const kim = { name: "Kim" };

const map = new Map([
  [lee, "developer"],
  [kim, "designer"],
]);

map.clear();
console.log(map); // Map(0) {}
```

### 2.8. 요소 순회

Map 객체의 요소를 순회하려면 Map.protype.forEach 메서드를 사용한다.
이때 콜백 함수는 다음과 같이 3개의 인수로 전달받는다.

- 첫번째: 현재 순회 중인 요소 값
- 두번째: 현재 순회 중인 요소 키
- 세번째: 현재 순회 중인 Map 객체

```js
const lee = { name: "Lee" };
const kim = { name: "Kim" };

const map = new Map([
  [lee, "developer"],
  [kim, "designer"],
]);

map.forEach((v, k, map) => console.log(v, k, map));
/*
developer {name: "Lee"} Map(2) {
  {name: "Lee"} => "developer",
  {name: "Kim"} => "designer"
}
designer {name: "Kim"} Map(2) {
  {name: "Lee"} => "developer",
  {name: "Kim"} => "designer"
}
*/
```

Map 객체는 이터러블이면서 동시에 이터레이터인 객체를 반환하는 메서드를 제공한다.
스프레드 문법과 배열 디스트럭처링 할당의 대상이 될 수 있다.

```js
const lee = { name: "Lee" };
const kim = { name: "Kim" };

const map = new Map([
  [lee, "developer"],
  [kim, "designer"],
]);

// Map.prototype.keys는 Map 객체에서 요소키를 값으로 갖는 이터레이터를 반환한다.
for (const key of map.keys()) {
  console.log(key); // {name: "Lee"} {name: "Kim"}
}

// Map.prototype.values는 Map 객체에서 요소값을 값으로 갖는 이터레이터를 반환한다.
for (const value of map.values()) {
  console.log(value); // developer designer
}

// Map.prototype.entries는 Map 객체에서 요소키와 요소값을 값으로 갖는 이터레이터를 반환한다.
for (const entry of map.entries()) {
  console.log(entry); // [{name: "Lee"}, "developer"]  [{name: "Kim"}, "designer"]
}
```
