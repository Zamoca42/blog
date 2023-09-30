---
title: 15. let, const 키워드와 블록 레벨 스코프
---

## 1. var 키워드로 선언한 변수의 문제점

ES5까지 변수를 선언할 수 있는 유일한 방법은 `var` 키워드를 사용하는 것이었다.
var 키워드로 선언된 변수는 다음과 같은 특징이 있다.

### 1.1. 변수 중복 선언 허용

`var` 키워드로 선언한 변수는 중복 선언이 가능하다.

```js
var x = 1;
var y = 1;

// var 키워드로 선언된 변수는 같은 스코프 내에서 중복 선언이 허용한다.
var x = 100;

// 초기화문이 없는 변수 선언문은 무시된다.
var y;

console.log(x); // 100
console.log(y); // 1
```

위 예제의 `var` 키워드로 선언한 x와 y 변수는 중복 선언되었다. 이처럼 `var` 키워드로 선언한 변수를 중복 선언하면 초기화문 유무에 따라 다르게 동작한다.

### 1.2. 함수 레벨 스코프

`var` 키워드로 선언한 변수는 오로지 함수의 코드 블록만을 지역 스코프로 인정한다.
따라서 함수 외부에서 `var` 키워드로 선언한 변수는 코드 블록 내에서 선언해도 모두 전역 변수가 된다.

```js
var x = 1;

if (true) {
  var x = 10;
}

console.log(x); // 10
```

for 문의 변수 선언문에서 `var` 키워드로 선언한 변수도 전역 변수가 된다.

```js
var i = 10;

for (var i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

// 의도치 않게 i 변수의 변수 값이 변경되었다.
console.log(i); // 5
```

함수 레벨 스코프는 전역 변수를 남발할 가능성을 높인다.

### 1.3. 변수 호이스팅

`var` 키워드로 변수를 선언하면 변수 호이스팅에 의해 변수 선언문이 선두로 끌어 올려진 것처럼 동작한다.
단, 할당문 이전에 변수를 참조하면 언제나 `undefined`를 반환한다.

```js
console.log(foo); //undefined

foo = 123;

console.log(foo); // 123

var foo;
```

변수 선언문 이전에 변수를 참조하는 것은 변수 호이스팅에 의해 에러를 발생시키지는 않지만 프로그램 흐름상 맞지 않을 뿐더러 가독성을 떨어뜨리고 오류를 발생할 여지를 남긴다.

## 2. let 키워드

앞에서 살펴본 `var` 키워드의 단점을 보완하기 위해 ES6에서는 새로운 변수 선언 키워드인 `let`과 `const`를 도입했다.
`var` 키워드와의 차이점을 중심으로 `let` 키워드를 살펴보자.

### 2.1. 변수 중복 선언 금지

let 키워드로 이름이 같은 변수를 중복 선언하면 문법 에러(SyntaxError)가 발생한다.

```js
var foo = 123;

var foo = 456;

let bar = 123;
// let이나 const 키워드로 선언된 변수는 스코프 내에서 중복 선언을 허용하지 않는다.
let bar = 456; // SyntaxError: Identifier 'bar' has already been declared
```

### 2.2. 블록 레벨 스코프

`let` 키워드로 선언한 변수는 모든 코드 블록(함수, if, for, while, try/catch 문 등)을 지역 스코프로 인정하는 블록 레벨 스코프를 따른다.

```js
let foo = 1; // 전역 변수

{
  let foo = 2; // 지역 변수
  let bar = 3; // 지역 변수
}

console.log(foo); // 1
console.log(bar); // ReferenceError: bar is not defined
```

전역에서 선언된 foo 변수와 코드 블록 내에서 선언된 foo 변수는 다른 별개의 변수다.
또한 bar 변수도 블록 레벨 스코프를 갖는 지역 변수다. 따라서 전역에서는 bar 변수를 참조할 수 없다.
함수도 코드 블록이므로 스코프를 만든다. 이때 함수 내의 코드 블록은 함수 레벨 스코프에 중첩된다.

![그림 15-1. 블록 레벨 스코프의 중첩](https://github.com/Zamoca42/blog/assets/96982072/129ef772-183a-4054-b4ee-4aec10e09a84)

### 2.3. 변수 호이스팅

var 키워드로 선언한 변수와 달리 let 키워드로 선언한 변수는 변수 호이스팅이 발생하지 않는 것처럼 동작한다.

```js
console.log(foo); // ReferenceError: foo is not defined
let foo;
```

`let` 키워드로 선언한 변수를 변수 선언문 이전에 참조하면 참조 에러가 발생한다.
4.3절 "변수 선언"에서 살펴본 바와 같이 `var` 키워드로 선언한 변수는 런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 "선언 단계"와 "초기화 단계"가 한번에 진행된다.

따라서 변수 선언문 이전에 변수에 접근해도 스코프에 변수가 존재하기 때문에 에러가 발생하지 않는다.
다만 `undefined`를 반환한다.

```js
console.log(foo);

var foo;
console.log(foo);

foo = 1;
console.log(foo); // 1
```

![그림 15-2. var 키워드로 선언한 변수의 생명 주기](https://github.com/Zamoca42/blog/assets/96982072/bf40fa6e-57f8-483d-9352-4334d352df03)

`let` 키워드로 선언한 변수는 "선언 단계"와 "초기화 단계"가 분리되어 진행된다.
런타임 이전에 자바스크립트 엔진에 의해 암묵적으로 선언 단계가 실행되지만 초기화 단계는 변수 선언문에 도달 했을 때 실행된다.

스코프의 시작 지점부터 초기화 시작 지점까지 변수를 참조할 수 없는 구간을 일시적 사각지대(TDZ: Temporal Dead Zone)라고 부른다.

```js
// 선언 단계 실행. 초기화 x
// 일시적 사각지대
console.log(foo); // ReferenceError: foo is not defined

let foo; // 변수 선언문에서 초기화 단계 실행
console.log(foo); // undefined

foo = 1; // 할당문에서 할당 단계 실행
console.log(foo); // 1
```

![그림 15-3. let 키워드로 선언한 변수의 생명 주기](https://github.com/Zamoca42/blog/assets/96982072/61f5f0d6-c5b7-4dda-b95e-6122a7d06c96)

`let` 키워드로 선언한 변수는 변수 호이스팅이 발생하지 않는 것처럼 보인다. 하지만 그렇지 않다.

```js
let foo = 1; // 전역 변수

{
  console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
  let foo = 2; // 지역 변수
}
```

`let` 키워드로 선언한 변수의 경우 변수 호이스팅이 발생하지 않는다면 위 예제는 전역 변수 foo의 값을 출력해야한다.

하지만 `let` 키워드로 선언한 변수도 여전히 호이스팅이 발생하기 때문에 참조 에러(ReferenceError)가 발생한다.

자바스크립트는 ES6에서 도입된 `let`, `const`를 포함해서 모든 선언(`var`, `let`, `const`, `function`, `function*`, `class` 등)을 호이스팅 한다.

단, `let`, `const`, `class`를 사용한 선언문은 호이스팅이 발생하지 않는 것처럼 동작한다.

### 2.4. 전역 객체와 let

`var` 키워드로 선언한 전역 변수와 전역 함수, 그리고 선언하지 않은 변수에 값을 할당한 암묵적 전역은 전역 객체 window의 프로퍼티가 된다. 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다.

```js
// 브라우저 환경에서 실행

// 전역 변수
var x = 1;

// 암묵적 전역
y = 2;

// 전역 함수
function foo() {}

console.log(window.x); // 1
console.log(x); // 1

console.log(window.y); // 2
console.log(y); // 2

console.log(window.foo); // f foo() {}
console.log(foo); // f foo() {}
```

`let` 키워드로 선언한 전역 변수는 전역 객체의 프로퍼티가 아니다. 즉, `window.foo`와 같이 접근할 수 없다.

```js
let x = 1;

console.log(window.x); // undefined
console.log(x); // 1
```

## 3. const 키워드

`const`는 상수를 선언하기 위해 사용한다. 하지만 반드시 상수만을 위해 사용하지는 않는다
`const` 키워드의 특징은 `let` 키워드와 대부분 동일하므로 `let` 키워드와 다른 점을 중심으로 살펴보자.

### 3.1. 선언과 초기화

`const` 키워드로 선언한 변수는 반드시 선언과 동시에 초기화 해야한다.

```js
const foo = 1;
```

그렇지 않으면 다음과 같이 문법 에러가 발생한다.

```js
const foo; // SyntaxError: Missing initializer in const declaration
```

`const`로 선언한 변수는 `let` 키워드로 선언한 변수와 마찬가지로 블록 레벨 스코프를 가지며, 변수 호이스팅이 발생하지 않는 것처럼 동작한다.

```js
{
  console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
  const foo = 1;
  console.log(foo); // 1
}

// 블록 레벨 스코프를 갖는다.
console.log(foo); // ReferenceError: foo is not defined
```

### 3.2. 재할당 금지

`var` 또는 `let` 키워드로 선언한 변수는 재할당이 자유로우나 `const` 키워드로 선언한 변수는 재할당이 금지된다.

```js
const foo = 1;
foo = 2; // TypeError: Assignment to constant varialbe
```

### 3.3. 상수

변수의 상대 개념인 **상수는 재할당이 금지된 변수를 말한다.** 상수도 값을 저장하기 위한 메모리 공간이 필요하므로 변수라고 할 수 있다.
단, 변수는 언제든지 재할당을 통해 변수 값을 변경할 수 있지만 상수는 재할당이 금지된다.

상수는 상태 유지와 가독성, 유지보수의 편의를 위해 적극적으로 사용해야한다.

```js
let preTaxPrice = 100;

let afterTaxPrice = preTaxPrice + preTaxPrice * 0.1;

console.log(afterTaxPrice); // 110
```

코드 내에서 사용한 0.1은 어떤 의미로 사용했는지 명확히 알기 어렵기 때문에 가독성이 좋지 않다.
이 때 세율을 상수로 정의하면 값의 의미를 쉽게 파악하고 변경될 수 없는 고정값으로 사용할 수 있다.

```js
const TAX_RATE = 0.1;

let preTaxPrice = 100;

let afterTaxPrice = preTaxPrice + preTaxPrice * TAX_RATE;

console.log(afterTaxPrice); // 110
```

### 3.4 const 키워드와 객체

**`const` 키워드로 선언된 변수에 객체를 할당한 경우 값을 변경할 수 있다.**
변경 불가능한 값인 원시 값은 재할당 없이 변경할 수 있는 방법이 없지만
변경 가능한 값인 객체는 재할당 없이도 직접 변경이 가능하기 때문이다.

```js
const person = {
  name: "Lee",
};

person.name = "Kim";

console.log(person); // {name: "Kim"}
```

**`const` 키워드는 재할당을 금지할 뿐 "불변"을 의미하지 않는다.**
다시 말해, 새로운 값을 재할당하는 것은 불가능하지만 프로퍼티 동적 생성, 삭제, 프로퍼티 값의 변경을 통해 객체를 변경하는 것은 가능하다. 이떄 객체가 변경되더라도 변수에 할당한 참조 값은 변경되지 않는다.

## 4. `var` vs. `let` vs. `const`

변수 선언에는 기본적으로 `const`를 사용하고 `let`은 재할당이 필요한 경우에 한정해 사용하는 것이 좋다.
`const` 키워드를 사용하면 의도치 않은 재할당을 방지하기 때문에 좀 더 안전하다.

`var`와 `let`, `const` 키워드는 다음과 같이 사용하는 것을 권장한다.

- ES6을 사용한다면 `var` 키워드는 사용하지 않는다.
- 재할당이 필요한 경우에 한정해 `let` 키워드를 사용한다. 이때 변수의 스코프는 최대한 좁게 만든다.
- 변경이 발생하지 않고 읽기 전용으로 사용하는 원시 값(재할당이 필요 없는 상수)과 객체에는 `const` 키워드를 사용한다.
  `const` 키워드는 재할당을 금지하므로 `var`, `let` 키워드 보다 안전하다.

변수를 선언하는 시점에는 재할당이 필요할지 잘 모르는 경우가 많다. 그리고 객체는 의외로 재할당하는 경우가 드물다.

따라서 변수를 선언할 때는 일단 `const` 키워드를 사용하자. 반드시 재할당이 필요하다면 그때 `const` 키워드를 `let` 키워드로 변경해도 결코 늦지 않다.
