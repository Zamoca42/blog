---
title: 9. 타입 변환과 단축 평가
category:
  - JS & TS
tag:
  - JavaScript
---

## 1. 타입 변환이란?

개발자가 의도적으로 값의 타입을 변환하는 것을 **명시적(Explicit) 타입 변환**
또는 **타입 캐스팅**이라 한다

```js
var x = 10;

var str = x.toString();
console.log(typeof str, str); // string 10

console.log(typeof x, x); //number 10
```

개발자의 의도와는 상관 없이 표현식을 평가하는 도중에 암묵적으로 타입이 자동 변환 되기도 한다.

이를 **암묵적(Implicit) 타입 변환** 또는 **타입 강제 변환**이라 한다.

```js
var x = 10;

var str = x + "";
console.log(typeof str, str); //string 10

console.log(typeof x, x); //number 10
```

## 2. 암묵적 타입 변환

```js
// 피연산자가 모두 문자열 타입이어야 하는 문맥
"10" + 2; // -> '102'

//피연산자가 모두 숫자 타입이어야 하는 문맥
5 * "10"; // -> 50

//피연산자 또는 표현식이 불리언 타입이어야 하는 문맥
!0; //-> true
if (1) {
}
```

표현식을 평가할 때 코드의 문맥에 부합하지 않는 다양한 상황이 발생할 수 있다.
타입별로 암묵적 타입 변환이 어떻게 발생하는지 살펴보자.

### 2.1. 문자열 타입으로 변환

자바스크립트 엔진은 표현식을 평가할 때 코드 문맥에 부합하도록 암묵적 타입 변환을 실행한다.
예를 들어, ES6에서 도입된 템플릿 리터럴 표현식 삽입은 표현식의 평가 결과를 문자열 타입으로 변환한다.

```js
`1 + 1 = ${1 + 1}`; //-> "1 + 1 = 2"
```

문자열 타입이 아닌 값을 문자열 타입으로 암묵적 타입 변환을 수행할 때 다음과 같이 동작한다

```js
// 숫자 타입
0 + '' //-> "0"
-0 + '' //-> "0"
-1 + '' //-> "-1"
NaN + '' //-> "NaN"
-Infinity + '' //-> "-Infinity"

// 불리언 타입
true + '' //-> "true"
false + '' //-> "false"

// null 타입
undefined + '' //-> "undefined"

// 객체 타입
({}) + '' // -> "[object Object]"
Math + '' // -> "[object Math]"
[] + '' // -> ""
[10, 20] + '' //-> "10, 20"
(function(){}) + '' //-> "function(){}"
Array + '' //-> "function Array() {[native code]}"
```

### 2.2. 숫자 타입으로 변환

```js
1 - "1"; //-> 0
1 * "10"; //-> 10
1 / "one"; //-> NaN
```

피연산자를 숫자 타입으로 변환할 수 없는 경우는 산술 연산을 수행할 수 없으므로 표현식의 평가 결과는 `NaN`이 된다.

피연산자를 숫자타입으로 변환해야할 문맥은 산술 연산자뿐만이 아니다.

```js
"1" > 0; //-> true
```

비교 연산자의 역할은 불리언 값을 만드는 것이다.
`>` 비교 연산자는 피연산자의 크기를 비교하므로 피연산자는 코드 문맥상 모두 숫자 타입이어야한다.
비교 연산자의 피연산자 중에서 숫자 타입이 아닌 피연산자를 숫자 타입으로 암묵적 타입 변환한다.

숫자 타입이 아닌 값을 숫자 타입으로 암묵적 타입 변환을 수행할 때 다음과 같이 동작한다.

```js
// 문자열
+"" + //-> 0
  "0" + //-> 0
  "1" + //-> 1
  "string" + //-> NaN
  // 불리언 타입
  true + //-> 1
  false + //-> 0
  // null 타입
  null + //-> 0
  // undefined 타입
  undefined + // -> NaN
  //객체 타입
  {} + //-> NaN
  [] + // -> 0
  [10, 20] + //-> NaN
  function () {}; //-> NaN
```

빈 문자열(''), 빈 배열(\[\]), `null`, `false`는 0으로 ,`true`는 1로 변환된다.
객체와 빈 배열이 아닌 배열, `undefined`는 변환되지 않아 `NaN`이 된다.

### 2.3. 불리언 타입으로 변환

if 문이나 for 문과 같은 제어문 또는 삼항 조건 연산자의 조건식은 불리언 값이 되어야하는 표현식이다.

```js
if ("") console.log("1");
if (true) console.log("2");
if (0) console.log("3");
if ("str") console.log("4");
if (null) console.log("5");
// 2 4
```

불리언 타입이 아닌 값을 Truthy(참으로 평가) 또는 Falsy(거짓으로 평가)로 구분한다.

아래는 `false`로 평가되는 Falsy 값이다.

- false
- undefined
- null
- 0, -0
- NaN
- ''(빈 문자열)

## 3. 명시적 타입 변환

개발자의 의도에 따라 명시적으로 타입을 변경하는 방법은 다양하다.

### 3.1. 문자열 타입으로 변환

1. String 생성자 함수를 new 연산자 없이 호출
2. Object.prototype.toString 메서드를 사용
3. 문자열 연결 연산자를 이용

```js
String(1); //-> "1"
String(NaN); //-> "NaN"
Stirng(true); //-> "true"

(1).toString(); //-> "1"
NaN.toString(); //-> "NaN"
true.toString(); //-> "true"

1 + ""; //-> "1"
NaN + ""; //-> "NaN"
true + ""; //-> "true"
```

### 3.2. 숫자 타입으로 변환

1. Number 생성자 함수를 new 연산자 없이 호출
2. parseInt, parseFloat 함수를 사용 (문자열 -> 숫자)
3. `+` 단항 산술 연산자를 이용
4. `*` 산술 연산자를 이용

```js
Number("0"); //-> 0
Number("10.53"); //-> 10.53
Number(true); //-> 1

ParseInt("0"); //-> 0
ParseInt("10.53"); //-> 10.53
ParseInt(true) + //-> 1
  "0" + //-> 0
  "10.53" + //-> 10.53
  true; //-> 1

"0" * 1; //-> 0
"10.53" * 1; //-> 10.53
true * 1; //-> 1
```

### 3.3. 불리언 타입으로 변환

1. Boolean 생성자 함수를 new 연산자 없이 호출
2. ! 부정 논리 연산자를 두 번 사용

```js
Boolean("x"); //->true
Boolean(""); //->false

Boolean(0); //-> false
Boolean(NaN); //-> false
Boolean(Infinity); //-> true
Boolean(null); //-> false

Boolean({}); //-> true
Boolean([]); //-> true

!!"x"; //->true
!!""; //->false

!!0; //-> false
!!NaN; //-> false
!!Infinity; //-> true
!!null; //-> false

!!{}; //-> true
!![]; //-> true
```

## 4. 단축 평가

### 4.1. 논리 연산자를 사용한 단축 평가

```js
"Cat" && "Dog"; //-> 'Dog'
```

논리곱(&&) 연산자는 두 개의 피연산자 모두 true로 평가될 때 true를 반환한다.
논리곱 연산자는 좌항에서 우항으로 평가가 진행되면서 두 번째 피연산자가 논리 연산의 결과를 결정한다.

즉 문자열 'Dog'를 그대로 반환한다.

```js
"Cat" || "Dog"; //-> 'Cat'
```

논리합(||) 연산자는 두 개의 피연산자 중 하나만 true로 평가되어도 true를 반환한다.
논리합 연산자는 두 번째 피연산자까지 평가해 보지 않아도 위 표현식을 평가할 수 있다.

즉 문자열 'Cat'을 그대로 반환한다.

단축평가는 표현식을 평가하는 도중에 평가 결과가 확정된 경우 나머지 평가 과정을 생략하는 것을 말한다

| 표현식              | 평가 결과 |
| :------------------ | :-------- |
| true \|\| anything  | true      |
| false \|\| anything | anything  |
| true && anything    | anything  |
| false && anything   | false     |

단축 평가를 사용하면 if문을 대체할 수 있고, 다음과 같은 상황에서 유용하게 사용된다.

- 객체를 가리키기를 기대하는 변수가 null 또는 undefined가 아닌지 확인하고 프로퍼티를 참조

```js
var elem = null;

var value = elem && elem.value; //-> null
```

- 함수 매개변수에 기본값을 설정할 때

```js
function getStringLength(str) {
  str = str || "";
  return str.length;
}

getStringLength(); //-> 0
getStringLength("hi"); //-> 2

// ES6의 매개변수의 기본값 설정
function getStringLength(str = "") {
  return str.length;
}
```

### 4.2. 옵셔널 체이닝 연산자

ES11(ECMAScript2020)에서 도입된 옵셔널 체이닝 연산자 ?.는
좌항의 피연산자가 null 또는 undefined인 경우 undefined를 반환하고, 그렇지 않으면 우항의 프로퍼티 참조를 이어간다

```js
var elem = null;

var value = elem?.value;
console.log(value); // undefined
```

옵셔널 체이닝 연산자가 도입되기 이전에는 논리 연산자 &&을 사용하여 변수가 null 또는 undefined인지 확인했다.

### 4.3. null 병합 연산자

ES11(ECMAScript2020)에서 도입된 null 병합 연산자 ??는
좌항의 피연산자가 null 또는 undefined인 경우 우항의 피연사자를 반환하고, 그렇지 않으면 좌항의 피연산자를 반환한다.

```js
var foo = null ?? "default string";
console.log(foo); // 'default string'
```
