---
title: 21. 빌트인 객체
---

## 1. 자바스크립트 객체의 분류

자바스크립트 객체는 다음과 같이 크게 3개의 객체로 분류할 수 있다.

- 표준 빌트인 객체

  - ECMAScript 사양에 정의된 객체

- 호스트 객체

  - ECMAScript 사양에 정의되어있지 않지만 실행환경(브라우저 또는 Node.js)에서 추가로 제공하는 객체
  - 브라우저 환경에서는 DOM,Canvas,Web Component 등
  - Node.js환경에서는 고유의 API

- 사용자 정의 객체

## 2. 표준 빌트인 객체

자바스크립트는 Object, String, Number, Boolean, Symbol, Date, Math, Function, Promise, JSON, Error 등 40여 개의 표준 빌트인 객체를 제공한다.

Math, Reflect, JSON을 제외한 표준 빌트인 객체는 모두 인스턴스를 생성할 수 있는 생성자 함수 객체다.

표준 빌트인 생성자 함수 객체는 프로토타입 메서드와 정적 메서드를 제공
표준 빌트인 객체는 정적 메서드만 제공

```js
// String 생성자 함수에 의한 String 객체 생성
const strObj = new String("Lee"); // String {"Lee"}
console.log(typeof strObj); // object

// Number 생성자 함수에 의한 Number 객체 생성
const numObj = new Number(123); // Number {123}
console.log(typeof numObj); // object

// Boolean 생성자 함수에 의한 Boolean 객체 생성
const boolObj = new Boolean(true); // Boolean {true}
console.log(typeof boolObj); // object

// Function 생성자 함수에 의한 Function 객체(함수) 생성
const func = new Function("x", "return x * x"); // ƒ anonymous(x )
console.log(typeof func); // function

// Array 생성자 함수에 의한 Array 객체(배열) 생성
const arr = new Array(1, 2, 3); // (3) [1, 2, 3]
console.log(typeof arr); // object

// RegExp 생성자 함수에 의한 RegExp 객체(정규 표현식) 생성
const regExp = new RegExp(/ab+c/i); // /ab+c/i
console.log(typeof regExp); // object

// Date 생성자 함수에 의한 Date 객체 생성
const date = new Date(); // Fri May 08 2020 10:43:25 GMT+0900 (대한민국 표준시)
console.log(typeof date); // object
```

생성자 함수인 표준 빌트인 객체가 생성한 인스턴스의 프로토타입은 표준 빌트인 객체의 prototype 프로퍼티에 바인딩된 객체다.

```js
// String 생성자 함수에 의한 String 객체 생성
const strObj = new String("Lee"); // String {"Lee"}

// String 생성자 함수를 통해 생성한 strObj 객체의 프로토타입은 String.prototype이다.
console.log(Object.getPrototypeOf(strObj) === String.prototype); // true
```

표준 빌트인 객체의 prototype 프로퍼티에 바인딩된 객체는 다양한 기능의 빌트인 프로토타입 메서드를 제공한다.
그리고 표준 빌트인 객체는 인스턴스 없이도 호출 가능한 빌트인 정적 메서드를 제공한다.

```js
// Number 생성자 함수에 의한 Number 객체 생성
const numObj = new Number(1.5); // Number {1.5}

// toFixed는 Number.prototype의 프로토타입 메서드다.
// Number.prototype.toFixed는 소수점 자리를 반올림하여 문자열로 반환한다.
console.log(numObj.toFixed()); // 2

// isInteger는 Number의 정적 메서드다.
// Number.isInteger는 인수가 정수(integer)인지 검사하여 그 결과를 Boolean으로 반환한다.
console.log(Number.isInteger(0.5)); // false
```

## 3. 원시값과 래퍼 객체

문자열이나 숫자, 불리언 등의 원시값이 있는데도 문자열, 숫자, 불리언 객체를 생성하는 String, Number, Boolean 등의 표준 빌트인 생성자 함수가 존재하는 이유는 무엇일까?
원시값은 객체가 아니므로 프로퍼티나 메서드를 가질 수 없는데도 원시값인 문자열이 마치 객체처럼 동작한다.

```js
const str = "hello";

// 원시 타입인 문자열이 프로퍼티와 메서드를 갖고 있는 객체처럼 동작한다.
console.log(str.length); // 5
console.log(str.toUpperCase()); // HELLO
```

원시값인 문자열, 숫자, 불리언 값의 경우 이들 원시값에 대해 마치 객체처럼 마침표 표기법으로 접근하면 자바스크립트 엔진이 일시적으로 원시값을 연관된 객체로 변환해 주기 때문이다.

즉, 원시값을 객체처럼 사용하면 자바스크립트 엔진은 암묵적으로 연관된 객체를 생성하여 생성된 객체로 프로퍼티에 접근하거나 메서드를 호출하고 다시 원시값으로 되돌린다.

이처럼 문자열, 숫자, 불리언 값에 대해 객체처럼 접근하면 생성되는 임시 객체를 래퍼 객체(wrapper object)라 한다.

```js
const str = "hi";

// 원시 타입인 문자열이 래퍼 객체인 String 인스턴스로 변환된다.
console.log(str.length); // 2
console.log(str.toUpperCase()); // HI

// 래퍼 객체로 프로퍼티에 접근하거나 메서드를 호출한 후, 다시 원시값으로 되돌린다.
console.log(typeof str); // string
```

이때 문자열 래퍼 객체인 String 생성자 함수의 인스턴스는 `String.prototype`의 메서드를 상속받아 사용할 수 있다.

![그림 21-1. 문자열 래퍼 객체의 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/70a79933-b286-4cc0-90ba-8a91f89c22da)

그 후 래퍼 객체의 처리가 종료되면 래퍼 객체의 `[[StringData]]` 내부 슬롯에 할당된 원시값으로 원래의 상태, 즉 식별자가 원시값을 갖도록 되돌리고 래퍼 객체는 가비지 컬렉션의 대상이 된다.

```js
// ① 식별자 str은 문자열을 값으로 가지고 있다.
const str = "hello";

// ② 식별자 str은 암묵적으로 생성된 래퍼 객체를 가리킨다.
// 식별자 str의 값 'hello'는 래퍼 객체의 [[StringData]] 내부 슬롯에 할당된다.
// 래퍼 객체에 name 프로퍼티가 동적 추가된다.
str.name = "Lee";

// ③ 식별자 str은 다시 원래의 문자열, 즉 래퍼 객체의 [[StringData]] 내부 슬롯에 할당된 원시값을 갖는다.
// 이때 ②에서 생성된 래퍼 객체는 아무도 참조하지 않는 상태이므로 가비지 컬렉션의 대상이 된다.

// ④ 식별자 str은 새롭게 암묵적으로 생성된(②에서 생성된 래퍼 객체와는 다른) 래퍼 객체를 가리킨다.
// 새롭게 생성된 래퍼 객체에는 name 프로퍼티가 존재하지 않는다.
console.log(str.name); // undefined

// ⑤ 식별자 str은 다시 원래의 문자열, 즉 래퍼 객체의 [[StringData]] 내부 슬롯에 할당된 원시값을 갖는다.
// 이때 ④에서 생성된 래퍼 객체는 아무도 참조하지 않는 상태이므로 가비지 컬렉션의 대상이 된다.
console.log(typeof str, str);
```

숫자 값도 숫자값에 대해 마침표 표기법으로 접근하면 그 순간 래퍼 객체인 Number 생성자 함수의 인스턴스가 생성되고 숫자는 래퍼 객체의 `[[NumberData]]` 내부 슬롯에 할당된다.
마찬가지로 래퍼 객체의 처리가 종료되면 할당된 원시값으로 되돌리고 래퍼 객체는 가비지 컬렉션의 대상이 된다.

```js
const num = 1.5;

// 원시 타입인 숫자가 래퍼 객체인 Number 객체로 변환된다.
console.log(num.toFixed()); // 2

// 래퍼 객체로 프로퍼티에 접근하거나 메서드를 호출한 후, 다시 원시값으로 되돌린다.
console.log(typeof num, num); // number 1.5
```

이처럼 문자열, 숫자, 불리언, 심벌은 암묵적으로 생성되는 래퍼 객체에 의해 마치 객체처럼 사용할 수 있으며, 표준 빌트인 객체인 String, Number, Boolean, Symbol의 프로토타입 메서드 또는 프로퍼티를 참조할 수 있다.

따라서 Stirng, Number, Boolean 생성자 함수를 new 연산자와 함께 호출하여 문자열, 숫자, 불리언 인스턴스를 생성할 필요가 없으며 권장하지도 않는다. Symbol은 생성자 함수가 아니므로 이 논의에서는 제외하도록 한다.

문자열, 숫자, 불리언 이외의 원시값, 즉 null과 undefined는 래퍼 객체를 생성하지 않는다.

## 4. 전역 객체

전역 객체는 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 어떤 객체보다도 먼저 생성되는 특수한 객체이며, 어떤 객체에도 속하지 않은 최상위 객체다.

전역 객체는 자바스크립트 환경에 따라 지칭하는 이름이 제각각이다. 브라우저 환경에서는 window가 전역 객체를 가리키지만 Node.js 환경에서는 global이 전역 객체를 가리킨다.

::: info globalThis

ECMAScript2020(ES11)에서 도입된 globalThis는 브라우저 환경과 Node.js 환경에서 전역 객체를 가리키던 다양한 식별자를 통일한 식별자다.

globalThis는 표준 사양이므로 ECMAScript 표준 사양을 준수하는 모든 환경에서 사용할 수 있다.

```js
// 브라우저 환경
globalThis === this; // true
globalThis === window; // true
globalThis === self; // true
globalThis === frames; // true

// Node.js 환경(12.0.0 이상)
globalThis === this; // true
globalThis === global; // true
```

:::

전역 객체는 계층적 구조상 어떤 객체에도 속하지 않은 모든 빌트인 객체의 최상위 객체다.
전역 객체가 최상위 객체라는 것은 프로토타입 상속 관계상에서 최상위 객체라는 의미가 아니다.
전역 객체 자신은 어떤 객체의 프로퍼티도 아니며 객체의 계층적 구조상 표준 빌트인 객체와 호스트 객체를 프로퍼티로 소유한다는 것을 말한다.

#### **전역 객체의 특징**

- 개발자가 의도적으로 생성할 수 없다. 즉, 전역 객체를 생성할 수 있는 생성자 함수가 제공되지 않는다.

- 전역 객체의 프로퍼티를 참조할 때 window를 생략할 수 있다.

  ```js
  // 문자열 'F'를 16진수로 해석하여 10진수로 변환하여 반환한다.
  window.parseInt("F", 16); // -> 15
  // window.parseInt는 parseInt로 호출할 수 있다.
  parseInt("F", 16); // -> 15

  window.parseInt === parseInt; // -> true
  ```

- 전역 객체는 Object, Stirng, Number, Function, Promise 같은 모든 표준 빌트인 객체를 프로퍼티로 가지고 있다.

- 자바스크립트 실행 환경에 따라 추가적으로 프로퍼티와 메서드를 갖는다.(맨 위에서 설명)

- var 키워드로 선언한 전역 변수와 선언하지 않은 변수에 값을 할당하는 암묵적 전역, 그리고 전역 함수는 전역 객체의 프로퍼티가 된다.

  ```js
  // var 키워드로 선언한 전역 변수
  var foo = 1;
  console.log(window.foo); // 1

  // 선언하지 않은 변수에 값을 암묵적 전역. bar는 전역 변수가 아니라 전역 객체의 프로퍼티다.
  bar = 2; // window.bar = 2
  console.log(window.bar); // 2

  // 전역 함수
  function baz() {
    return 3;
  }
  console.log(window.baz()); // 3
  ```

- `let`이나 `const` 키워드로 선언한 전역 변수는 전역 객체의 프로퍼티가 아니다. 전역 렉시컬 환경의 선언적 환경 레코드 내에 존재하게 된다.
  ```js
  let foo = 123;
  console.log(window.foo); // undefined
  ```
- 브라우저 환경의 모든 자바스크립트 코드는 하나의 전역 객체 window를 공유한다.

### 4.1. 빌트인 전역 프로퍼티

- **Infinity**

  ```js
  // 전역 프로퍼티는 window를 생략하고 참조할 수 있다.
  console.log(window.Infinity === Infinity); // true

  // 양의 무한대
  console.log(3 / 0); // Infinity
  // 음의 무한대
  console.log(-3 / 0); // -Infinity
  // Infinity는 숫자값이다.
  console.log(typeof Infinity); // number
  ```

- **NaN**

  - NaN 프로퍼티는 숫자가 아님(Not-a-Number)을 나타내는 숫자값 NaN을 갖는다.
  - NaN 프로퍼티는 `Number.NaN`프로퍼티와 같다.

  ```js
  console.log(window.NaN); // NaN

  console.log(Number("xyz")); // NaN
  console.log(1 * "string"); // NaN
  console.log(typeof NaN); // number
  ```

- **undefined**

  ```js
  console.log(window.undefined); // undefined

  var foo;
  console.log(foo); // undefined
  console.log(typeof undefined); // undefined
  ```

### 4.2. 빌트인 전역 함수

- **eval**

  - eval 함수는 자바스크립트 코드를 나타내는 문자열을 인수로 전달
  - 표현식이라면 런타임에 평가하여 값을 생성
  - 문이라면 문자열 코드를 런타임에 실행

  ```js
  // 표현식인 문
  eval("1 + 2;"); // -> 3
  //  표현식이 아닌 문
  eval("var x = 5;"); // -> undefined

  // eval 함수에 의해 런타임에 변수 선언문이 실행되어 x 변수가 선언되었다.
  console.log(x); // 5

  // 객체 리터럴은 반드시 괄호로 둘러싼다.
  const o = eval("({ a: 1 })");
  console.log(o); // {a: 1}

  // 함수 리터럴은 반드시 괄호로 둘러싼다.
  const f = eval("(function() { return 1; })");
  console.log(f()); // 1
  ```

  - 여러 개의 문으로 이루어져 있다면 모든 문을 실행 후 마지막 결과값을 반환

  ```js
  console.log(eval("1 + 2; 3 + 4;")); // 7
  ```

  - 기존의 스코프를 런타임에 동적으로 수정

  ```js
  const x = 1;

  function foo() {
    // eval 함수는 런타임에 foo 함수의 스코프를 동적으로 수정한다.
    eval("var x = 2;");
    console.log(x); // 2
  }

  foo();
  console.log(x); // 1
  ```

  - strict mode에서 eval 함수는 기존의 스코프를 수정하지 않고 eval 함수 자신의 자체적인 스코프를 생성한다.

  ```js
  const x = 1;

  function foo() {
    "use strict";

    // strict mode에서 eval 함수는 기존의 스코프를 수정하지 않고 eval 함수 자신의 자체적인 스코프를 생성한다.
    eval("var x = 2; console.log(x);"); // 2
    console.log(x); // 1
  }

  foo();
  console.log(x); // 1
  ```

  - 인수로 전달받은 문자열 코드가 let, const 키워드를 사용한 변수 선언문이라면 암묵적으로 strict mode 적용

  ```js
  const x = 1;

  function foo() {
    eval("var x = 2; console.log(x);"); // 2
    // let, const 키워드를 사용한 변수 선언문은 strict mode가 적용된다.
    eval("const x = 3; console.log(x);"); // 3
    console.log(x); // 2
  }

  foo();
  console.log(x); // 1
  ```

  - eval 함수를 통해 입력받은 콘텐츠를 실행하는 것은 **보안에 매우 취약**
  - 최적화가 수행되지 않으므로 처리속도 느림

- **isFinite**

  - 전달받은 인수가 정상적인 유한수인지 검사하여 유한수이면 true를 반환하고 무한수이면 false를 반환한다.

  ```js
  // 인수가 유한수이면 true를 반환한다.
  isFinite(0); // -> true
  isFinite(2e64); // -> true
  isFinite("10"); // -> true: '10' → 10
  isFinite(null); // -> true: null → 0

  // 인수가 무한수 또는 NaN으로 평가되는 값이라면 false를 반환한다.
  isFinite(Infinity); // -> false
  isFinite(-Infinity); // -> false

  // 인수가 NaN으로 평가되는 값이라면 false를 반환한다.
  isFinite(NaN); // -> false
  isFinite("Hello"); // -> false
  isFinite("2005/12/12"); // -> false
  ```

- **isNaN**

  - 전달 받은 인수가 NaN인지 검사하여 그 결과를 불리언 타입으로 반환한다.

  ```js
  // 숫자
  isNaN(NaN); // -> true
  isNaN(10); // -> false

  // 문자열
  isNaN("blabla"); // -> true: 'blabla' => NaN
  isNaN("10"); // -> false: '10' => 10
  isNaN("10.12"); // -> false: '10.12' => 10.12
  isNaN(""); // -> false: '' => 0
  isNaN(" "); // -> false: ' ' => 0

  // 불리언
  isNaN(true); // -> false: true → 1
  isNaN(null); // -> false: null → 0

  // undefined
  isNaN(undefined); // -> true: undefined => NaN

  // 객체
  isNaN({}); // -> true: {} => NaN

  // date
  isNaN(new Date()); // -> false: new Date() => Number
  isNaN(new Date().toString()); // -> true:  String => NaN
  ```

- **parseFloat**

  - 전달받은 문자열 인수를 부동 소수점 숫자(floating point number), 즉 실수로 해석(parsing)하여 반환

  ```js
  // 문자열을 실수로 해석하여 반환한다.
  parseFloat("3.14"); // -> 3.14
  parseFloat("10.00"); // -> 10

  // 공백으로 구분된 문자열은 첫 번째 문자열만 변환한다.
  parseFloat("34 45 66"); // -> 34
  parseFloat("40 years"); // -> 40

  // 첫 번째 문자열을 숫자로 변환할 수 없다면 NaN을 반환한다.
  parseFloat("He was 40"); // -> NaN

  // 앞뒤 공백은 무시된다.
  parseFloat(" 60 "); // -> 60
  ```

- **parseInt**

  - 전달받은 문자열을 인수를 정수로 해석하여 반환

  ```js
  // 문자열을 정수로 해석하여 반환한다.
  parseInt("10"); // -> 10
  parseInt("10.123"); // -> 10
  ```

  - 전달받은 인수가 문자열이 아니라면 문자열로 변환한다음, 정수로 해석하여 반환

  ```js
  parseInt(10); // -> 10
  parseInt(10.123); // -> 10
  ```

  - 두 번째 인수로 진법을 나타내는 기수(2 ~ 36)를 전달할 수 있다. 기수를 생략하면 10진수로 해석하여 반환

  ```js
  // 10'을 10진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt("10"); // -> 10
  // '10'을 2진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt("10", 2); // -> 2
  // '10'을 8진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt("10", 8); // -> 8
  // '10'을 16진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt("10", 16); // -> 16
  ```

  - 기수를 지정하여 10진수 숫자를 해당 기수의 문자열로 변환하여 반환하고 싶을 때는
    `Number.prototype.toStirng` 메서드를 사용한다.

  ```js
  const x = 15;

  // 10진수 15를 2진수로 변환하여 그 결과를 문자열로 반환한다.
  x.toString(2); // -> '1111'
  // 문자열 '1111'을 2진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt(x.toString(2), 2); // -> 15

  // 10진수 15를 8진수로 변환하여 그 결과를 문자열로 반환한다.
  x.toString(8); // -> '17'
  // 문자열 '17'을 8진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt(x.toString(8), 8); // -> 15

  // 10진수 15를 16진수로 변환하여 그 결과를 문자열로 반환한다.
  x.toString(16); // -> 'f'
  // 문자열 'f'를 16진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt(x.toString(8), 8); // -> 15

  // 숫자값을 문자열로 변환한다.
  x.toString(); // -> '15'
  // 문자열 '15'를 10진수로 해석하고 그 결과를 10진수 정수로 반환한다
  parseInt(x.toString()); // -> 15
  ```

  - 두 번쨰 인수로 기수를 지정하지 않더라도 첫 번째로 인수로 전달된 문자열이 "0x"또는 "0X"로 시작하면
    16진수로 해석하여 10진수 정수로 반환한다.

  ```js
  // 16진수 리터럴 '0xf'를 16진수로 해석하고 10진수 정수로 그 결과를 반환한다.
  parseInt("0xf"); // -> 15
  // 위 코드와 같다.
  parseInt("f", 16); // -> 15
  ```

  ```js
  // 2진수 리터럴(0b로 시작)은 제대로 해석하지 못한다. 0 이후가 무시된다.
  parseInt("0b10"); // -> 0
  // 8진수 리터럴(ES6에서 도입. 0o로 시작)은 제대로 해석하지 못한다. 0 이후가 무시된다.
  parseInt("0o10"); // -> 0
  ```

  ```js
  // 문자열 '10'을 2진수로 해석한다.
  parseInt("10", 2); // -> 2
  // 문자열 '10'을 8진수로 해석한다.
  parseInt("10", 8); // -> 8
  ```

  ```js
  // 'A'는 10진수로 해석할 수 없다.
  parseInt("A0"); // -> NaN
  // '2'는 2진수로 해석할 수 없다.
  parseInt("20", 2); // -> NaN
  ```

  - 첫 번째 인수로 전달한 문자열에 공백이 있다면 첫 번째 문자열만 해석하여 변환하며
    앞뒤 공백은 무시된다. 만일 첫 번째 문자열을 숫자로 해석할 수 없는 경우 NaN을 반환

  ```js
  // 10진수로 해석할 수 없는 'A' 이후의 문자는 모두 무시된다.
  parseInt("1A0"); // -> 1
  // 2진수로 해석할 수 없는 '2' 이후의 문자는 모두 무시된다.
  parseInt("102", 2); // -> 2
  // 8진수로 해석할 수 없는 '8' 이후의 문자는 모두 무시된다.
  parseInt("58", 8); // -> 5
  // 16진수로 해석할 수 없는 'G' 이후의 문자는 모두 무시된다.
  parseInt("FG", 16); // -> 15
  ```

  ```js
  // 공백으로 구분된 문자열은 첫 번째 문자열만 변환한다.
  parseInt("34 45 66"); // -> 34
  parseInt("40 years"); // -> 40
  // 첫 번째 문자열을 숫자로 변환할 수 없다면 NaN을 반환한다.
  parseInt("He was 40"); // -> NaN
  // 앞뒤 공백은 무시된다.
  parseInt(" 60 "); // -> 60
  ```

- **encodeURI / decodeURI**

  - encodeURI 함수는 완전한 URI를 문자열로 전달받아 이스케이프 처리를 위해 인코딩
    - URI는 인터넷에 있는 자원을 나타내는 유일한 주소를 말한다. URI의 하위 개념으로 URL, URN이 존재

  ![그림 21-2. URI](https://github.com/Zamoca42/blog/assets/96982072/719fe520-6404-4755-9e89-bfbfdd2e648d)

  - 이스케이프 처리는 네트워크를 통해 정보를 공유할 때 어떤 시스템도 읽을 수 있는 아스키 문자 셋으로 변환하는 것이다.
  - 이스케이프 처리가 필요한 이유는 URL내에서 의미를 갖고 있는 문자(%, ?, #)나 URL에 올 수 없는 문자(한글, 공백 등) 또는 시스템에 해석될 수 있는 문자(<, >)를 이스케이프 처리하여 야기될 수 있는 문제를 예방

  ```js
  // 완전한 URI
  const uri = "http://example.com?name=이웅모&job=programmer&teacher";

  // encodeURI 함수는 완전한 URI를 전달받아 이스케이프 처리를 위해 인코딩한다.
  const enc = encodeURI(uri);
  console.log(enc);
  // http://example.com?name=%EC%9D%B4%EC%9B%85%EB%AA%A8&job=programmer&teacher
  ```

  - decodeURI 함수는 인코딩된 URI를 인수로 전달받아 이스케이프 처리 이전으로 디코딩

  ```js
  const uri = "http://example.com?name=이웅모&job=programmer&teacher";

  // encodeURI 함수는 완전한 URI를 전달받아 이스케이프 처리를 위해 인코딩한다.
  const enc = encodeURI(uri);
  console.log(enc);
  // http://example.com?name=%EC%9D%B4%EC%9B%85%EB%AA%A8&job=programmer&teacher

  // decodeURI 함수는 인코딩된 완전한 URI를 전달받아 이스케이프 처리 이전으로 디코딩한다.
  const dec = decodeURI(enc);
  console.log(dec);
  // http://example.com?name=이웅모&job=programmer&teacher
  ```

- **encodeURIComponent / decodeURIComponent**

  ```js
  // URI의 쿼리 스트링
  const uriComp = "name=이웅모&job=programmer&teacher";

  // encodeURIComponent 함수는 인수로 전달받은 문자열을 URI의 구성요소인 쿼리 스트링의 일부로 간주한다.
  // 따라서 쿼리 스트링 구분자로 사용되는 =, ?, &까지 인코딩한다.
  let enc = encodeURIComponent(uriComp);
  console.log(enc);
  // name%3D%EC%9D%B4%EC%9B%85%EB%AA%A8%26job%3Dprogrammer%26teacher

  let dec = decodeURIComponent(enc);
  console.log(dec);
  // 이웅모&job=programmer&teacher

  // encodeURI 함수는 인수로 전달받은 문자열을 완전한 URI로 간주한다.
  // 따라서 쿼리 스트링 구분자로 사용되는 =, ?, &를 인코딩하지 않는다.
  enc = encodeURI(uriComp);
  console.log(enc);
  // name=%EC%9D%B4%EC%9B%85%EB%AA%A8&job=programmer&teacher

  dec = decodeURI(enc);
  console.log(dec);
  // name=이웅모&job=programmer&teacher
  ```

### 4.3. 암묵적 전역

```js
var x = 10; // 전역 변수

function foo() {
  // 선언하지 않은 식별자에 값을 할당
  y = 20; // window.y = 20;
}
foo();

// 선언하지 않은 식별자 y를 전역에서 참조할 수 있다.
console.log(x + y); // 30
```

foo 함수가 호출되면 자바스크립트 엔진은 y 변수에 값을 할당하기 위해 먼저 스코프 체인을 통해 선언된 변수 인지 확인.
이때 스코프 어디에서도 y 변수의 선언을 찾을 수 없으므로 참조 에러 발생.
하지만 자바스크립트는 `y = 20`을 `window.y = 20`으로 해석하여 전역 객체에 프로퍼티를 동적 생성.
결국 y는 전역 객체의 프로퍼티가 되어 마치 전역 변수처럼 동작. 이러한 현상을 암묵적 전역이라 한다.

```js
// 전역 변수 x는 호이스팅이 발생한다.
console.log(x); // undefined
// 전역 변수가 아니라 단지 전역 객체의 프로퍼티인 y는 호이스팅이 발생하지 않는다.
console.log(y); // ReferenceError: y is not defined

var x = 10; // 전역 변수

function foo() {
  // 선언하지 않은 식별자에 값을 할당
  y = 20; // window.y = 20;
}
foo();

// 선언하지 않은 식별자 y를 전역에서 참조할 수 있다.
console.log(x + y); // 30
```

또한 단지 프로퍼티인 y는 delete 연산자로 삭제할 수 있다.
전역 변수는 프로퍼티지만 delete연산자로 삭제할 수 없다.

```js
var x = 10; // 전역 변수

function foo() {
  // 선언하지 않은 식별자에 값을 할당
  y = 20; // window.y = 20;
  console.log(x + y);
}

foo(); // 30

console.log(window.x); // 10
console.log(window.y); // 20

delete x; // 전역 변수는 삭제되지 않는다.
delete y; // 프로퍼티는 삭제된다.

console.log(window.x); // 10
console.log(window.y); // undefined
```