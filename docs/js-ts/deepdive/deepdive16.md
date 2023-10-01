---
title: 16. 프로퍼티 어트리뷰트
---

## 1. 내부 슬롯과 내부 메서드

내부 슬롯과 내부 메서드는 자바스크립트 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript 사양에서 사용하는 의사 프로퍼티와 의사 메서드다.

ECMAScript 사양에 등장하는 이중 대괄호(`[[...]]`)으로 감싼 이름들이 내부 슬롯과 내부 메서드다.

![그림 16-1. 내부 슬롯과 내부 메서드](https://github.com/Zamoca42/blog/assets/96982072/3f224dcd-f0d8-42f5-a713-7dded3781068)


내부 슬롯과 내부 메서드는 ECMAScript 사양에 정의된 대로 구현되어 자바스크립트 엔진에서 실제로 동작하지만
엔진의 내부 로직이므로 원칙적으로 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지 않는다.
단, 일부에 한하여 간접적으로 접근할 수 있는 수단을 제공하기는 한다.

예를 들어, 모든 객체는 `[[Prototype]]`이라는 내부 슬롯을 갖는다. 내부 슬롯은 자바스크립트 엔진의 내부 로직이므로 원칙적으로 직접 접근할 수 없지만 `[[Prototype]]` 내부 슬롯의 경우, `__proto__`를 통해 간접적으로 접근할 수 있다.

```js
const o = {};

o.[[Prototype]] // -> Uncaught SyntaxError: Unexpected token '[]'
o.__proto__ // -> Object.prototype
```

## 2. 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체

자바스크립트 엔진은 프로퍼티를 생성할 때 프로퍼티의 상태를 나타내는 프로퍼티 어트리뷰트를 기본값으로 자동 정의한다.

- 프로퍼티의 상태
  - 프로퍼티의 값 (value)
  - 값의 갱신 가능 여부 (writable)
  - 열거 가능 여부 (enumerable)
  - 재정의 가능 여부 (configurable)

프로퍼티 어트리뷰트에 직접 접근할 수 없지만 `Object.getOwnPropertyDescriptor` 메서드를 사용하여 간접적으로 확인할 수는 있다.

```js
const person = {
  name: "Lee",
};

console.log(Object.getOwnPropertyDescriptor(person, "name"));
// {value: "Lee", writable: true, enumerable: true, configurable: true}
```

메서드를 호출할 때 `Object.getOwnPropertyDescriptor(객체, 프로퍼티 키)`로 매개변수를 전달한다.
이때 메서드는 프로퍼티 어트리뷰트 정보를 제공하는 프로퍼티 디스크립터(Property Descriptor) 객체를 반환한다.
만약 존재하지 않는 프로퍼티나 상속받은 프로퍼티에 대한 요구를 하면 `undefined`가 반환된다.

ES8에서 도입된 `Object.getOwnPropertyDescriptors(객체)`로 모든 프로퍼티의 프로퍼티 어트리뷰트 정보를 제공하는 프로퍼티 디스크립터 객체들을 반환한다.

```js
const person = {
  name: "Lee",
};

// 프로퍼티 동적 생성
person.age = 20;

console.log(Object.getOwnPropertyDescriptors(person));
```

출력 결과

```
{
  name: {value: "Lee", writable: true, enumerable: true, configurable: true},
  age: {value: 20, writable: true, enumerable: true, configurable: true}
}
```

## 3. 데이터 프로퍼티와 접근자 프로퍼티

- 데이터 프로퍼티(data property)

  - 키와 값으로 구성된 일반적인 프로퍼티다. 지금까지 살펴본 모든 프로퍼티는 데이터 프로퍼티다.

- 접근자 프로퍼티(accessor property)
  - 자체적으로는 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수(accessor function)로 구성된 프로퍼티다.

### 3.1. 데이터 프로퍼티

데이터 프로퍼티는 자바스크립트 엔진이 프로퍼티를 생성할 때 다음과 같은 프로퍼티 어트리뷰트가 기본값으로 자동 정의된다.

- value(`[[Value]]`)

  - 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값
  - 키를 통해 값을 변경하면 `[[Value]]`에 값을 재할당
  - 프로퍼티가 없으면 동적 생성하고 생성된 프로퍼티의 `[[Value]]`에 값을 저장

- writable(`[[Writable]]`)

  - 프로퍼티 값의 변경 가능 여부 (불리언)
  - `[[Writable]]`이 `false`인 경우 `[[Value]]`값을 변경할 수 없음

- enumerable(`[[Enumerable]]`)

  - 프로퍼티 열거 가능 여부 (불리언)
  - `[[Enumerable]]`의 값이 `false`인 경우 `for...in`문이나 Object.keys 메서드 등으로 열거할 수 없음

- configurable(`[[Configurable]]`)

  - 프로퍼티 재정의 가능 여부 (불리언)
  - `[[Configurable]]`의 값이 `false`인 경우 프로퍼티 삭제, 프로퍼티 어트리뷰트 값의 변경이 금지
    단, `[[Writable]]`이 `true`인 경우 `[[Value]]`, `[[Writable]]` 변경 허용

### 3.2. 접근자 프로퍼티

접근자 프로퍼티는 다음과 같은 프로퍼티 어트리뷰트를 갖는다.

- get(`[[Get]]`)

  - 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 읽을 때 호출되는 접근자 함수.
    getter 함수가 호출되고 그 결과가 프로퍼티 값으로 반환.

- set(`[[Set]]`)

  - 접근자 프로퍼티를 통해 데이터 프로퍼티의 값을 저장할 때 호출되는 접근자 함수.
    setter 함수가 호출되고 그 결과가 프로퍼티 값으로 반환.

- enumerable(`[[Enumerable]]`)

  - 데이터 프로퍼티의 `[[Enumerable]]`와 같다

- configurable(`[[Configurable]]`)

  - 데이터 프로퍼티의 `[[Configurable]]`와 같다

```js
const person = {
  // 데이터 프로퍼티
  firstName: "Ungmo",
  lastName: "Lee",

  // fullName은 접근자 함수로 구성된 접근자 프로퍼티다.
  // getter 함수
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  // setter 함수
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(" ");
  },
};

// 데이터 프로퍼티를 통한 참조
console.log(person.firstName + " " + person.lastName); // Ungmo Lee

// 접근자 프로퍼티를 통한 값의 저장
// setter 함수 호출
person.fullName = "Heegun Lee";
console.log(person); //{firstName: "Heegun", lastName: "Lee"}

// 접근자 프로퍼티를 통한 참조
// getter 함수 호출
console.log(person.fullName); // Heegun Lee

console.log(Object.getOwnPropertyDescriptor(person, "fullName"));
// {get: f, set: f, enumerable: true, configurable: true}
```

접근자 프로퍼티는 자체적으로 값을 가지지 않으면 다만 데이터 프로퍼티의 값을 읽거나 저장할 때 관여할 뿐이다.
`fullName`으로 프로퍼티 값에 접근하면 내부적으로 `[[Get]]` 내부 메서드가 호출되어 다음과 같이 동작한다.

1. 프로퍼티 키가 문자열 또는 심벌인지 확인. 프로퍼티 키 `fullName`은 문자열이므로 유효한 프로퍼티 키

2. `person` 객체에 `fullName` 프로퍼티가 존재하는지 프로토타입 체인에서 프로퍼티 검색

3. 검색된 `fullName` 프로터피가 데이터 프로퍼티인지 접근자 프로퍼티인지 확인

4. 접근자 프로퍼티 `fullName`의 프로퍼티 어트리뷰트 `[[Get]]`을 호출하여 결과 반환

:::info 프로토타입(prototype)
프로토타입은 어떤 객체의 상위(부모)객체 역할을 하는 객체다. 프로토타입은 하위(자식)객체에게 자신의 프로퍼티와 메서드를 상속한다. 프로토타입을 상속받은 하위 객체는 자신의 프로퍼티 또는 메서드인 것처럼 자유롭게 사용할 수 있다.

프로토타입 체인은 프로토타입 단방향 링크드 리스트 형태로 연결되어 있는 상속 구조를 말한다.
객체의 프로퍼티나 메서드에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티 또는 메서드가 없다면 프로토타입 체인을 따라 프로토타입의 프로퍼티나 메서드를 차례대로 검색한다.

프로토타입과 프로토타입 체인에 대해서는 19장 "프로토타입"에서 자세히 살펴보도록 하자.
:::

접근자 프로퍼티와 데이터 프로퍼티를 구별하는 방법은 다음과 같다.

```js
// 일반 객체의 __proto__는 접근자 프로퍼티다.
Object.getOwnPropertyDescriptor(Object.prototype, "__proto__");
// {get: f, set: f, enumerable: true, configurable: true}

// 함수 객체의 prototype은 데이터 프로퍼티다.
Object.getOwnPropertyDescriptor(function () {}, "prototype");
// {value: "Lee", writable: true, enumerable: true, configurable: true}
```

## 4. 프로퍼티 정의

프로퍼티 정의란 새로운 프로퍼티를 추가하면서 어트리뷰트를 명시적으로 정의하거나, 기존 프로퍼티의 어트리뷰트를 재정의하는 것을 말한다.

예를 들어, 프로퍼티 값을 갱신 가능하도록 할것인지, 열거 가능하도록 할것인지, 재정의 가능하도록 할 것인지 정의할 수 있다.

`Object.defineProperty` 메서드를 사용하면 프로퍼티의 어트리뷰트를 정의할 수 있다.

```js
const person = {};

Object.defineProperty(person, "firstName", {
  value: "Ungmo",
  writable: true,
  enumerable: true,
  configurable: true,
});

Object.defineProperty(person, "lastName", {
  value: "Lee",
});

let descriptor = Object.getOwnPropertyDescriptor(person, "firstName");
console.log("firstName", descriptor);
// firstName {value: "Ungmo", writable: true, enumerable: true, configurable: true}

let descriptor = Object.getOwnPropertyDescriptor(person, "lastName");
console.log("lastName", descriptor);
// lastName {value: "Lee", writable: false, enumerable: false, configurable: false}
```

`[[Enumerable]]` 값이 `false`인 lastName 프로퍼티는 `Object.keys`로 열거 할 수 없다.

```js
console.log(Object.keys(person)); // ["firstNAme"]
```

`[[Writable]]` 값이 `false`인 lastName 프로퍼티는 `[[Value]]`의 값을 변경할 수 없다.
마찬가지로 `[[Configurable]]` 값도 `false`이므로 해당 프로퍼티를 삭제할 수 없다.
이때 값을 변경하면 에러는 발생하지 않고 무시된다.

```js
//[[Writable]]
person.lastName = "Kim";

//[[Configurable]]
delete person.lastName;

let descriptor = Object.getOwnPropertyDescriptor(person, "lastName");
console.log("lastName", descriptor);
// lastName {value: "Lee", writable: false, enumerable: false, configurable: false}
```

접근자 프로퍼티 정의

```js
Object.defineProperty(person, "fullName", {
  // getter 함수
  get() {
    return `${this.firstName} ${this.lastName}`;
  },
  // setter 함수
  set(name) {
    [this.firstName, this.lastName] = name.split(" ");
  },
  enumerable: true,
  configurable: true,
});

let descriptor = Object.getOwnPropertyDescriptor(person, "fullName");
console.log("lastName", descriptor);
// {get: f, set: f, enumerable: true, configurable: true}

person.fullName = "Heegun Lee";
console.log(person); // {firstName: "Heegun", lastName: "Lee"}
```

`Object.defineProperty` 메서드로 프로퍼티를 정의할 때객체의 프로퍼티를 일부 생략할 수 있다.
생략된 어트리뷰트는 다음과 같이 기본값이 적용된다.

| 프로퍼티 어트리뷰트 | 생략 했을 때의 기본값 |
| :------------------ | :-------------------- |
| `[[Value]]`         | undefined             |
| `[[Get]]`           | undefined             |
| `[[Set]]`           | undefined             |
| `[[Writable]]`      | false                 |
| `[[Enumerable]]`    | false                 |
| `[[Configurable]]`  | false                 |

`Object.defineProperties` 메서드를 사용하면 여러 개의 프로퍼티를 한 번에 정의할 수 있다.

```js
const person = {};

Object.defineProperties(person, {
  firstName: {
    value: "Ungmo",
    writable: true,
    enumerable: true,
    configurable: true,
  },
  lastName: {
    value: "Lee",
    writable: true,
    enumerable: true,
    configurable: true,
  },
  // 접근자 프로퍼티 정의
  fullName: {
    get() {
      return `${this.firstName} ${this.lastName}`;
    },

    set(name) {
      [this.firstName, this.lastName] = name.split(" ");
    },
    enumerable: true,
    configurable: true,
  },
});

person.fullName = "Heegun Lee";
console.log(person); // {firstName: "Heegun", lastName: "Lee"}
```

## 5. 객체 변경 방지

자바스크립트는 객체의 변경을 방지하는 다양한 메서드를 제공한다.
| 구분 | 메서드 | 프로퍼티 <br>추가 | 삭제 | 값 읽기 | 값 쓰기 | 어트리뷰트 <br> 재정의 |
| :------------- | :----------------------- | :----------------: | :----------------: | :-------------------: | :-------------------: | :--------------------: |
| 객체 확장 금지 | Object.preventExtensions | :x: | :o: | :o: | :o: | :o: |
| 객체 밀봉 | Object.seal | :x: | :x: | :o: | :o: | :x: |
| 객체 동결 | Object.freeze | :x: | :x: | :o: | :x: | :x: |

### 5.1. 객체 확장 금지

`Object.preventExtensions` 메서드는 객체의 프로퍼티 추가가 금지된다.
프로퍼티 동적 추가, `Object.defineProperty` 메서드를 사용하는 방법 모두 금지된다.
확장 가능한 객체인지 여부는 `Object.isExtensible`메서드로 확인할 수 있다.

```js
const person = { name: "Lee" };

console.log(Object.isExtensible(person)); // true

// person 객체의 프로퍼티 추가 금지
Object.preventExtensions(person);

console.log(Object.isExtensible(person)); // false

perosn.age = 20; // 무시. strict mode에서는 에러
console.log(person); // {name: "Lee"}

// 추가는 금지되지만 삭제는 가능하다.
delete person.name;
console.log(person); // {}

Object.defineProperty(person, "age", { value: 20 });
// TypeError: Cannot define property age, object is not extensible
```

### 5.2. 객체 밀봉

객체 밀봉이란(`Object.seal`) 객체의 프로퍼티 추가, 삭제, 재정의를 금지 한다. 읽기와 쓰기만 가능하다.
밀봉된 객체인지 여부는 `Object.isSealed` 메서드로 확인할 수 있다.

```js
const person = { name: "Lee" };

console.log(Object.isSealed(person)); // false

// person 객체의 프로퍼티 추가, 삭제, 재정의 금지
Object.seal(person);

console.log(Object.isSealed(person)); // true

// 밀봉(seal)된 객체는 configurable이 false다
console.log(Object.getOwnPropertyDescriptors(person));
/*
{
  name: {value: "Lee", writable: true, enumerable: true, configurable: false},
}
*/

// 프로퍼티 추가가 금지된다.
perosn.age = 20; // 무시. strict mode에서는 에러
console.log(person); // {name: "Lee"}

// 프로퍼티 삭제가 금지된다.
delete person.name; // 무시. strict mode에서는 에러
console.log(person); // {name: "Lee"}

// 프로퍼티 값 갱신은 가능하다.
person.name = "Kim";
console.log(person); // {name: "Kim"}

// 프로퍼티 어트리뷰트 재정의가 금지된다.
Object.defineProperty(person, "name", { configurable: true });
// TypeError: Cannot define property: name
```

### 5.3. 객체 동결

객체 동결(`Object.freeze`)이란 프로퍼티 추가, 삭제, 어트리뷰트 재정의, 값 갱신 금지를 의미한다. 읽기만 가능하다.
동결된 객체인지 여부는 `Object.isFrozen` 메서드로 확인할 수 있다.

```js
const person = { name: "Lee" };

console.log(Object.isFrozen(person)); // false

// person 객체의 프로퍼티 추가, 삭제, 재정의, 쓰기를 금지
Object.freeze(person);

console.log(Object.isFrozen(person)); // true

// 동결(freeze)된 객체는 writable과 configurable이 false다
console.log(Object.getOwnPropertyDescriptors(person));
/*
{
  name: {value: "Lee", writable: false, enumerable: true, configurable: false},
}
*/

// 프로퍼티 추가가 금지된다.
perosn.age = 20; // 무시. strict mode에서는 에러
console.log(person); // {name: "Lee"}

// 프로퍼티 삭제가 금지된다.
delete person.name; // 무시. strict mode에서는 에러
console.log(person); // {name: "Lee"}

// 프로퍼티 값 갱신이 금지된다.
person.name = "Kim"; // 무시. strict mode에서는 에러
console.log(person); // {name: "Lee"}

// 프로퍼티 어트리뷰트 재정의가 금지된다.
Object.defineProperty(person, "name", { configurable: true });
// TypeError: Cannot define property: name
```

### 5.4. 불변 객체

지금까지 살펴본 변경 방지 메서드들은 얕은 변경 방지로 직속 프로퍼티만 변경이 방지되고 중첩 객체까지는 영향을 주지 못한다. 따라서 `Object.freeze` 메서드로 객체를 동결하여도 중첩 객체까지는 동결할 수 없다.

```js
const person = {
  name: "Lee",
  address: { city: "Seoul" },
};

// 얕은 객체 동결
Object.freeze(person);

// 직속 프로퍼티만 동결
console.log(Object.isFrozen(person)); // true
// 중첩 객체까지 동결하지 못한다.
console.log(Object.isFrozen(person.address)); // false

// 프로퍼티 추가가 금지된다.
perosn.address.city = "Busan";
console.log(person); // {name: "Lee", address: {city: "Busan"}}
```

객체의 중첩 객체까지 동결하여 변경이 불가능한 읽기 전용의 불변 객체를 구현하려면 객체를 값으로 갖는 모든 프로퍼티에 대해 자귀적으로 `Object.freeze` 메서드를 호출해야 한다.

```js
function deepFreeze(target) {
  if (target && typeof target === "object" && !Object.isFrozen(target)) {
    Object.freeze(target);
    Object.keys(target).forEach((key) => deepFreeze(target[key]));
  }
  return target;
}

const person = {
  name: "Lee",
  address: { city: "Seoul" },
};

// 깊은 객체 동결
deepFreeze(person);

console.log(Object.isFrozen(person)); // true
// 중첩 객체까지 동결한다.
console.log(Object.isFrozen(person.address)); // true

person.address.city = 'Busan'; // 무시
console.log(person); // {name: "Lee", address: {city: "Seoul"}}
```
