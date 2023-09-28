---
title: 11. 원시 값과 객체의 비교
---

데이터 타입을 원시 타입과 객체 타입으로 구분하는 이유는 무엇일까?
원시 타입과 객체 타입은 크게 세 가지 측면에서 다르다.

- 원시 타입의 값은 변경 불가능 한 값이다.
  객체 타입의 값은 변경 가능한 값이다.

- 원시 값을 변수에 할당하면 변수에는 실제 값이 저장된다.
  객체를 변수에 할당하면 변수에는 참조(메모리 주소) 값이 저장된다.

- 원시 값을 갖는 변수를 다른 변수에 할당하면 원본의 원시 값이 복사되어 전달된다.
  이를 **값에 의한 전달**(pass by value)이라 한다.
  객체를 가리키는 변수를 다른 변수에 할당하면 원본의 참조 값이 복사되어 전달된다.  
  이를 **참조에 의한 전달**(pass by reference)이라 한다.

## 1. 원시 값

### 1.1. 변경 불가능한 값

원시 타입(primitive type)의 값, 즉 원시 값은 변경 불가능한 값이다.
한번 생성된 원시 값은 읽기 전용(read only)값으로서 변경할 수 없다.

변수는 하나의 값을 저장하기 위해 확보한 메모리 공간 자체 또는 그 메모리 공간을 식별하기 위해 붙인 이름이고, 값은 변수에 저장된 데이터로서 표현식이 평가되어 생성된 결과를 말한다.

즉 "**원시 값은 변경 불가능하다**"는 말은 원시 값 자체를 변경할 수 없다는 것이지 변수 값을 변경할 수 없다는 것이 아니다.
변수는 언제든지 재할당을 통해 변수값을 교체할 수 있다.

변수의 상대 개념인 상수는 재할당이 금지된 변수를 말한다.
상수도 값을 저장하기 위한 메모리 공간이 필요하므로 변수라고 할 수 있다.
단, 변수는 언제든지 재할당을 통해 값을 교체할 수 있지만 상수는 단 한 번만 할당이 허용되므로 변수 값을 교체할 수 없다.

상수는 재할당이 금지된 변수 일 뿐이다.

```js
const o = {};

// const 키워드를 통해 선언한 변수에 할당한 원시 값은 변경할 수 없다.
// 하지만 객체는 변경할 수 있다.
o.a = 1;
console.log(o); // {a: 1}
```

새로운 원시 값을 재할당하면 메모리 공간에 저장되어 있는 재할당 이전의 원시 값을 변경하는 것이 아니라 새로운 메모리 공간을 확보하고 재할당한 원시 값을 저장한 후, 변수는 새롭게 재할당한 원시 값을 가리킨다.
이 때 변수가 참조하던 메모리 공간의 주소가 바뀐다.

![](https://github.com/Zamoca42/blog/assets/96982072/ee95e369-7dd0-4175-aed3-881554c38d18)

만약 원시 값이 변경 가능한 값이라면 변수에 새로운 원시 값을 재할당했을 때 변수가 가리키던 메모리 공간의 주소를 바꿀 필요없이 원시 값 자체를 변경하면 그만이다.

![](https://github.com/Zamoca42/blog/assets/96982072/9dd0e7b2-5786-45a6-9e41-e20e1f5f0e47)

하지만 원시 값은 변경 불가능한 값이기 때문에 값을 직접 변경할 수없다. 따라서 변수 값을 변경하기 위해 원시 값을 재할당하면 새로운 메모리 공간을 확보하고 재할당한 값을 저장한 후, 변수가 참조하던 메모리 공간의 주소를 변경한다.

값의 이러한 특성을 **불변성**(immutability)이라한다.

### 1.2. 문자열과 불변성

원시 값인 문자열은 다른 원시 값과 비교할 때 독특한 특징이 있다. 문자열은 0개 이상의 문자로 이뤄진 집합을 말하며, 1개의 문자는 2바이트 메모리 공간에 저장된다.

따라서 문자열은 몇 개의 문자로 이뤄졌느냐에 따라 필요한 메모리 공간의 크기가 결정된다.
숫자 값은 1도 1,000,000도 동일한 8바이트가 필요하지만 문자열의 경우 1개의 문자로 이뤄진 문자열은 2바이트, 10개로 문자로 이뤄진 문자열은 20바이트가 필요하다.

```js
var str1 = "";
var str2 = "Hello";
```

이 같은 이유로 C에는 하나의 문를 위한 데이터 타입(char)만 있을 뿐 문자열 타입은 존재하지 않는다.
C에서는 문자열을 문자의 배열로 처리하고 자바에서는 문자열을 String 객체로 처리한다.

하지만 자바스크립트는 개발자의 편의를 위해 원시 타입인 문자열 타입을 제공한다.
자바스크립트의 문자열은 원시 타입이며, 문자열이 생성된 이후에는 변경할 수 없다.

```js
var str = "Hello";
str = "world";
```

첫 번째 문이 실행되면 문자열 'Hello'가 생성되고 변수는 'Hello'가 저장된 메모리 셀 주소를 가리킨다.
그리고 두번째 문이 실행되면 'Hello'를 수정하는 것이 아니라 새로운 문자열 'world'를 메모리에 생성하고 str은 이것을 가리킨다.

이때 문자열 'Hello'와 'world'는 모두 메모리에 존재한다.
문자열의 한 문자를 변경해 보자. 문자열은 유사 배열 객체로 원시 값을 객체처럼 사용하면 원시 값을 감싸는 래퍼 객체로 자동 변환된다.

```js
var str = "string";

str[0] = "S";

console.log(str); // string
```

`str[0] = 'S'` 처럼 이미 생성된 문자열의 일부 문자를 변경해도 반영되지 않는다.
한번 생성된 문자열은 읽기 전용 값으로 변경할 수 없다. 따라서 예기치 못한 변경으로부터 자유롭다.
이는 신뢰성을 보장한다.

### 1.3. 값에 의한 전달

```js
var score = 80;
var copy = score;

console.log(score); // 80
console.log(copy); // 80

score = 100;

console.log(score); // 100
console.log(copy); // ?
```

변수에 변수를 할당했을 때 무엇이 어떻게 전달되는가?

copy = score에서 score는 변수 값 80으로 평가되므로 copy 변수에도 80이 할당될 것이다.

변수에 원시 값을 갖는 변수를 할당하면 할당받는 변수(copy)에는 할당 되는 변수(score)의 원시 값이 복사되어 전달된다. 이를 **값에 의한 전달**이라 한다.

```js
var score = 80;
var copy = score;

console.log(score, copy); // 80 80
console.log(score === copy); // true
```

score 변수와 copy변수는 숫자 값 80을 갖는다는 점에서는 동일하지만,
score변수와 copy 변수의 값 80은 다른 메모리 공간에 저장된 별개의 값이다.

![](https://github.com/Zamoca42/blog/assets/96982072/ee7ad029-0372-472d-aaa9-d207c5951867)

```js
var score = 80;
var copy = score;

console.log(score, copy); // 80 80
console.log(score === copy); // true

score = 100;

console.log(score, copy); // 100 80
console.log(score === copy); // false
```

score 변수와 copy 변수의 값은 80은 다른 메모리 공간에 저장된 별개의 값이라는 것에 주의하기 바란다.
따라서 score 변수의 값을 변경해도 copy 변수의 값에는 어떠한 영향도 주지 않는다.

![](https://github.com/Zamoca42/blog/assets/96982072/9d106de8-4a61-4b3c-bcc6-3f3320d9afcb)

위 그림은 실제 자바스크립트 엔진의 내부 동작과 정확히 일치하지 않을 수 있다. ECMAScript 사양에는 변수를 통해 메모리를 어떻게 관리해야하는지 명확하게 정의되어 있지 않다.

변수에 원시 값을 갖는 변수를 할당하는 시점에는 두 변수가 같은 원시 값을 참조하다가 어느 한쪽의 변수에 재할당이 이뤄졌을 때 비로소 새로운 메모리 공간에 재할당된 값을 저장하도록 동작할 수도 있다.

![](https://github.com/Zamoca42/blog/assets/96982072/0db68804-6e63-43d3-9a1b-8894a8375ba4)

참고로 "값에 의한 전달"이라는 용어는 자바스크립트를 위한 용어가 아니므로 오해가 있을 수 있다.

엄격하게 표현하면 변수에는 값이 전달되는 것이 아니라 메모리 주소가 전달되기 때문이다. 이는 변수와 같은 식별자는 값이 아니라 메모리 주소를 기억하고 있기 때문이다.

```js
var copy = score;
```

위 예제의 경우 score는 식별자 표현식으로 숫자 값 80으로 평가된다. 이때 두 가지 평가 방식이 가능하다.

1. 새로운 80을 생성해서 메모리 주소를 전달하는 방식. 할당 시점에 두 변수가 기억하는 메모리 주소가 다르다.

1. score의 변수값 80의 메모리 주소를 그대로 전달하는 방식. 할당 시점에 두 변수가 기억하는 메모리 주소가 같다.

"값에 의한 전달"도 사실은 값을 전달하는 것이 아니라 메모리 주소를 전달한다. 단, 전달된 메모리 주소를 통해 메모리 공간에 접근하면 값을 참조할 수 있다.

중요한 것은 결국 두 변수의 원시 값은 서로 다른 메모리 공간에 저장된 별개의 값이 되어 어느 한쪽에서 재할당을 통해 값을 변경하더라도 서로 간섭할 수 없다는 것이다.

## 2. 객체

객체는 프로퍼티의 개수가 정해져 있지 않으며, 동적으로 추가되고 삭제할 수 있다.
또한 프로퍼티의 값에도 제약이 없다. 따라서 객체는 원시 값과 같이 확보해야 할 메모리 공간의 크기를 사전에 정해 둘 수 없다.

따라서 객체는 원시 값과는 다른 방식으로 동작하도록 설계되어 있다. 원시 값과의 비교를 통해 객체를 이해해 보자.

:::details 자바스크립트 객체의 관리 방식

자바스크립트 객체는 프로퍼티 키를 인덱스로 사용하는 해시 테이블이라고 생각할 수 있다.
대부분의 자바스크립트 엔진은 해시 테이블과 유사하지만 높은 성능을 위해 일반적인 해시 테이블보다 나은 방법으로 객체를 구현한다.

![](https://github.com/Zamoca42/blog/assets/96982072/9c36989e-d8fd-47ac-9d41-90604b918be4)

V8 자바스크립트 엔진에서는 프로퍼티에 접근하기 위해 동적 탐색 대신 히든 클래스라는 방식을 사용해 C++ 객체의 프로퍼티에 접근하는 정도의 성능을 보장한다.

히든 클래스는 자바와 같이 고정된 객체 레이아웃(클래스)과 유사하게 동작한다. 크롬 V8 자바스크립트 엔진이 객체를 어떻게 관리하는지에 대해 관심있다면 아래의 글을 참고하기 바란다.
:::

### 2.1. 변경 가능한 값

객체는 변경 가능한 값이다.

```js
var person = {
  name: "Lee",
};
```

객체를 할당한 변수가 기억하는 메모리 주소를 통해 메모리 공간에 접근하면 참조 값에 접근할 수 있다.
참조 값은 생성된 객체가 저장된 메모리 공간의 주소 그 자체다.

다음 그림을 보면 객체를 할당한 변수에는 생성된 객체가 실제로 저장된 메모리 공간의 주소가 저장되어 있다. 이 값을 참조 값이라고한다.

![](https://github.com/Zamoca42/blog/assets/96982072/8d74d65a-cc2f-45ad-8088-fd79c6df8c09)

원시 값을 할당한 변수를 참조하면 메모리에 저장되어 있는 원시 값을 접근한다. 하지만 객체를 할당한 변수를 참조하면 메모리에 저장되어 있는 참조 값을 통해 실제 객체에 접근한다.

```js
var person = {
  name: "Lee",
};

console.log(person); // {name: 'Lee'}
```

따라서 객체를 할당한 변수는 재할당 없이 객체를 직접 변경할 수 있다.
즉, 재할당 없이 프로퍼티를 동적으로 추가할 수도 있고 프로퍼티 값을 갱신할 수도 있으면 프로퍼티 자체를 삭제할 수도 있다.

```js
var person = {
  name: "Lee",
};

// 프로퍼티 값 갱신
person.name = "Kim";

// 프로퍼티 동적 생성
person.address = "Seoul";

console.log(person); // {name: 'Kim', address: 'Seoul'}
```

객체는 변경 가능한 값이므로 메모리에 저장된 객체를 직접 수정할 수 있다.
이때 객체를 할당한 변수를 재할당을 하지 않았으므로 객체를 할당한 변수의 참조 값은 변경되지 않는다.

![](https://github.com/Zamoca42/blog/assets/96982072/584d848b-bc3a-40d3-9269-fb27b8aee564)

객체를 변경할 때마다 원시 값처럼 이전 값을 복사해서 새롭게 생성한다면 명확하고 신뢰성이 확보되겠지만 객체는 크기가 일정하지도 않으며, 복사해서 생성하는 비용이 많이든다.

따라서 메모리를 효율적으로 사용하기 위해 객체는 변경 가능한 값으로 설계되어 있다.

### 2.2. 참조에 의한 전달

```js
var person = {
  name: "Lee",
};

// 참조 값을 복사(얕은 복사)
var copy = person;
```

객체를 가리키는 변수를 다른 변수에 할당하면 원본의 **참조 값이 복사되어 전달**된다.
이를 **참조에 의한 전달**이라 한다.

![](https://github.com/Zamoca42/blog/assets/96982072/f81b6e2a-b2a1-48bb-9a1e-a78620c7179d)

위 그림처럼 원본 person을 사본 copy에 할당하면 원본 person의 참조 값을 복사해서 copy에 저장한다.

원본 person과 사본 copy는 모두 동일한 객체를 가리킨다. 이것은 **두 개의 식별자가 하나의 객체**를 공유한다는 것을 의미한다.

```js
var person = {
  name: "Lee",
};

// 참조 값을 복사(얕은 복사)
var copy = person;

console.log(copy === person);

copy.name = "Kim";

person.address = "Seoul";

console.log(person); // {name: 'Kim', address: 'Seoul'}
console.log(copy); // {name: 'Kim', address: 'Seoul'}
```

"값에 의한 전달"과 "참조에 의한 전달"은 식별자가 기억하는 메모리 공간에 저장되어 있는 값을 복사해서 전달한다는 면에서 동일하다. 다만 식별자가 기억하는 메모리 공간, 즉 변수에 저장되어 있는 값이 원시 값이냐 참조 값이냐의 차이만 있을 뿐이다. 따라서 **자바스크립트에는 "참조에 의한 전달"은 존재하지 않고 "값에 의한 전달"만 존재한다고 말할 수 있다.**

```js
var person1 = {
  name: "Lee",
};

var person2 = {
  name: "Lee",
};

console.log(person1 === person2); // 1
console.log(person1.name === person2.name); // 2
```

1. person1 변수와 person2 변수가 가리키는 객체는 비록 내용은 같지만 다른 메모리에 저장된 별개의 객체다. 따라서 false다.

1. person1.name과 person2.name은 모두 원시 값 'Lee'로 평가된다. 따라서 true다.