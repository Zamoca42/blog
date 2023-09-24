---
title: 6. 데이터 타입
---

자바스크립트의 모든 값은 데이터 타입을 갖는다. 데이터 타입(Data type)은 값의 종류를 말한다.

자바스크립트(ES6)은 7개의 데이터 타입을 제공하고 
원시 타입(Primitive type)과 객체 타입(Object/Reference type)으로 분류할 수 있다.

<table>
  <tr>
    <th>구분</th>
    <th>데이터 타입</th>
    <th>설명</th>
  </tr>
  <tr>
    <td rowspan="6">원시 타입</td>
    <td>숫자(number)</td>
    <td>정수와 실수 구분 없이 하나의 숫자 타입만 존재</td>
  </tr>
  <tr>
    <td>문자열(string)</td>
    <td>문자열</td>
  </tr>
  <tr>
    <td>불리언(boolean)</td>
    <td>논리적 참(true)과 거짓(false)</td>
  </tr>
  <tr>
    <td>undefined</td>
    <td>var 키워드로 선언된 변수에 암묵적으로 할당되는 값</td>    
  </tr>
  <tr>
    <td>null</td>
    <td>값이 없다는 것을 의도적으로 명시할 때 사용하는 값</td>
  </tr>
  <tr>
    <td>심벌(symbol)</td>
    <td>ES6에서 추가된 7번째 타입</td>
  </tr>
  <tr>
    <td colspan="2">객체 타입</td>
    <td>객체, 함수, 배열 등</td>
  </tr>
</table>

데이터 타입에 따라 확보해야 할 메모리 공간의 크기도 다르고 메모리에 저장되는 2진수도 다르며 읽어 들여 해석하는 방식도 다르다.

## 6.1 숫자 타입

C나 자바의 경우, 정수와 실수를 구분해서 int, log, float, double 등과 같은 다양한 숫자 타입을 제공한다.

하지만 자바스크립트는 하나의 숫자타입만 존재한다.

ECMAScript사양에 따르면 숫자 타입의 값은 [배정밀도 64비트 부동소수점 형식](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)을 따른다

![IEEE 754 Double Floating Point Format](https://github.com/Zamoca42/blog/assets/96982072/ff9bc416-9cc2-4796-8328-12a5f4345b6d)

- 부호(sign): 1 bit - 0(양수), 1(음수)
- 지수(exponent): 11 bits - 정수 표현
- 가수(fraction): 52 bits - 소수점이하 자리수 표현

정수, 실수, 2진수, 8진수, 16진수 리터럴은 모두 메모리에 배정밀도 64비트 부동소수점 형식의 2진수로 저장된다.

숫자 타입은 세 가지 특별한 값도 표현할 수 있다.

- `Infinity`: 양의 무한대
- `-Infinity`: 음의 무한대
- `NaN`: 산술 연산 불가(not-a-number)

```javascript
console.log(10 / 0); // Infinity
console.log(10 / -0); // -Infinity
console.log(1 * 'String'); // NaN
```

:pushpin: 자바스크립트는 대소문자를 구별하므로 `NaN`을 NAN, Nan, nan으로 표현하면 변수로 인식해 에러가 발생

## 6.2 문자열 타입

문자열(String) 타입은 텍스트 데이터를 나타내는데 사용한다. 
문자열은 0개 이상의 16비트 유니코드 문자(UTF-16)의 집합으로 전 세계 대부분의 문자를 표현할 수 있다.

문자열은 작은따옴표('), 큰따옴표("), 백틱(\`)으로 텍스트를 감싼다. 

```javascript
var string;

string = '문자열';
string = "문자열";
string = `문자열`;
string = '작은 따옴표로 감싼 문자열 내의 "큰따옴표"는 문자열로 인식된다.';
string = "큰따옴표로 감싼 문자열 내의 '작은따옴표'는 문자열로 인식된다.";
```

문자열을 따옴표로 감싸는 이유는 키워드나 식별자 같은 토큰과 구분하기 위해서다.

```javascript
var string = hello; // hello를 변수로 인식
```

자바스크립트의 문자열은 원시 타입이며, 변경 불가능한 값(Immutable value)이다.

## 6.3 템플릿 리터럴

ES6부터 템플릿 리터럴(Template literal)이라고 하는 새로운 문자열 표기법이 도입되었다.
템플릿 리터럴은 멀티라인 문자열, 표현식 삽입, 태그드 템플릿 등 편리한 문자열 처리 기능을 제공한다.

템플릿 리터럴은 백틱(\`)을 사용해 표현한다.

### 6.3.1 멀티라인 문자열

```javascript
var template = `<ul>
    <li><a href="#">Home</a></li>
</ul>`;

console.log(template);
```

출력 결과

```
<ul>
    <li><a href="#">Home</a></li>
</ul>
```

### 6.3.2 표현식 삽입

```javascript
var first = 'Ung-mo';
var last = 'Lee';

console.log(`My name is ${first} ${last}`);
```

출력 결과

```
My name is Ung-mo Lee
```

표현식을 삽입하려면 `${}`으로 표현식을 감싼다. 이때 표현식의 평가결과가 문자열이 아니더라도 문자열로 강제 변환되어 삽입된다.

```javascript
console.log(`1 + 2 = ${1 + 2}`);
```

출력

```
1 + 2 = 3
```

## 6.4 불리언 타입

불리언 타입의 값은 `true`와 `false`로 프로그램의 흐름을 제어하는 조건문에서 주로 사용한다.

## 6.5 undefined 타입

`var` 키워드로 선언한 변수는 암묵적으로 `undefined`로 초기화 된다.
변수를 선언한 이후 값을 할당하지 않은 변수를 참조하면 `undefined`가 반환된다.

:pushpin: ECMAScript 사양에서 변수는 '선언한다'로 표현하고, 함수는 '정의한다'로 표현한다.

## 6.6 `null` 타입

프로그래밍 언어에서 `null`은 변수에 값이 없다는 것을 의도적으로 명시할 때 사용한다.
변수에 `null`을 할당하는 것은 변수가 이전에 참조하던 값을 제거하는 것의 의미다.

자바스크립트 엔진은 누구도 참조하는 메모리 공간에 대해 가비지 컬렉션을 수행할 것이다.

```javascript
var foo = 'Lee';

foo = null;
```

함수가 유효한 값을 반환할 수 없는 경우 명시적으로 `null`을 반환하기도 한다.

```html
<!DOCTYPE html>
<html>
    <body>
        <script>
            var element = document.querySelector('.myClass');
            // HTML 문서에 myClass 클래스를 갖는 요소가 없다면 null을 반환한다
            console.log(element); // null
        </script>
    </body>
</html>
```

## 6.7 심벌 타입

심벌은 ES6에서 추가된 7번째 타입으로, 변경 불가능한 원시 타입의 값으로 다른 값과 중복되지 않는 유일무이한 값이다. 
따라서 주로 이름이 충돌할 위험이 없는 객체의 유일한 프로퍼티 키를 만들기 위해 사용한다.

```javascript
var key = Symbol('key');

console.log(typeof key); // symbol

// 객체 생성
var obj = {};

// 이름이 충돌할 위험이 없는 유일무이한 값인 심벌을 프로퍼티 키로 사용한다
obj[key] = 'value';
console.log(obj[key]); //value
```

## 6.8 객체 타입

자바스크립트는 객체 기반의 언어이며, **자바스크립트를 이루고 있는 거의 모든 것이 객체**라는 것이다.
원시 타입 이외의 값은 모두 객체 타입이다.

## 6.9 데이터 타입의 필요성

데이터 타입은 왜 필요한 것일까? 데이터 타입의 필요성에 대해 살펴보자.

### 6.9.1 데이터 타입에 의한 메모리 공간의 확보와 참조

메모리에 값을 저장하려면 먼저 확보해야 할 메모리 공간의 크기를 결정해야한다.
만약 숫자 타입 값 100을 저장하려면 자바스크립트 엔진은 리터럴 100을 숫자 타입의 값으로 해석하고 100을 저장하기 위해 메모리 공간을 확보한다. 
그 다음 100을 2진수로 저장한다.

<img width="666" alt="" src="https://github.com/Zamoca42/blog/assets/96982072/8156627b-47d5-4e3e-b9e7-351c8bf65a8b">

실제로 메모리에 저장되는 2진수 값은 그림과 다르게 배정밀도 64비트 부동소수점 형식을 사용한다.

### 6.9.2 데이터 타입에 의한 값 해석

모든 값은 메모리에 2진수, 즉 비트의 나열로 저장된다. 데이터 타입에 따라 메모리 공간 주소에서 읽어 들인 2진수를 해석한다.

### 정리

데이터 타입이 필요한 이유는 다음과 같다

- 값을 저장할 때 확보해야 하는 **메모리 공간의 크기**를 결정하기 위해
- 값을 참조할 때 한 번에 읽어 들여야 할 **메모리 공간의 크기**를 결정하기 위해
- 메모리에서 읽어 들인 **2진수를 어떻게 해석**할지 결정하기 위해

## 6.10 동적 타이핑

C나 자바같은 정적 타입 언어는 변수를 선언할 때 변수에 할당할 수 있는 값의 종류, 즉 데이터 타입을 사전에 선언해야한다. 
이를 명시적 타입 선언이라 한다.

```c
// 1바이트 정수 타입의 값(-128 ~ 127)
char c

// 정수 타입의 값(-2,124,483,648 ~ 2,124,483,647)만 할당할 수 있다.
int num;
```

정적 타입 언어는 변수의 타입을 변경할 수 없으며, 변수에 선언한 타입에 맞는 값만 할당할 수 있다.
그리고 컴파일 시점에 타입 체크를 수행해서 타입 체크를 통과하지 못했다면 에러를 발생시키고 프로그램의 실행 자체를 막는다. 이를 통해 타입의 일관성을 강제함으로써 런타임에 발생하는 에러를 줄인다.

자바 스크립트는 정적 타입언어와 다르게 타입을 선언하지 않는다.

```javascript
var foo;
console.log(typeof foo); // undefined

foo = 3;
console.log(typeof foo); // number

foo = 'Hello';
console.log(typeof foo); // string

foo = true;
console.log(typeof foo); // boolean

foo = null;
console.log(typeof foo); // object

foo = Symbol();
console.log(typeof foo); // symbol

foo = {};
console.log(typeof foo); // object

foo = [];
console.log(typeof foo); // object

foo = function() {}; 
console.log(typeof foo); // function
```

자바스크립트의 변수에는 어떤 데이터 타입의 값이라도 자유롭게 할당할 수 있으므로 정적 타입 언어에서 말하는 데이터 타입과 개념이 다르다.

자바스크립트에서는 값을 할당하는 시점에 변수의 타입이 동적으로 결정되고 변수의 타입을 언제든지 자유롭게 변경할 수 있다.
이러한 특징을 **동적 타이핑**이라하며, 자바스크립트를 정적 타입 언어와 구별하기 위해 **동적 타입 언어**라 한다.
대표적인 동적 타입 언어로는 자바스크립트, 파이썬, PHP, 루비, 리스프, 펄 등이 있다.

### 동적 타입 언어와 변수

동적 타입 언어는 변수의 타입이 고정되어 있지 않고 값의 변경에 의해 언제든지 변경될 수 있다.
변수 값은 언제든지 변경될 수 있기 때문에 복잡한 프로그램에서는 변화하는 변수 값을 추적하기 어려울 수 있다.
이러한 이유로 안정적인 프로그램을 만들기 위해 데이터 타입을 체크해야하는 경우 주의 사항은 다음과 같다.

- 변수의 유효 범위(스코프)는 최대한 좁게 만들어 변수의 부작용을 억제
- 전역 변수는 최대한 사용을 자제
- 변수보다는 상수를 사용해 값의 변경을 억제
- 변수 이름은 변수의 목적이나 의미를 파악할 수 있도록 네이밍

## 추가 자료

- [자바스크립트의 숫자(Number)형 - aeunhi99님의 티스토리](https://aeunhi99.tistory.com/323)