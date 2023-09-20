# 5. 표현식과 문

## 5.1 값

값(value)는 표현식(expression)이 평가되어 생성된 결과를 말한다.

```javascript
// 10 + 20은 평가되어 숫자 값 30을 생성
10 + 20; // 30
```

변수는 **하나의 값**을 저장하기 위해 확보한 메모리 공간

```javascript
var sum = 10 + 20;
```

sum변수에 할당되는 것은 10 + 20이 아니라 30이라는 값이다.

## 5.2 리터럴

리터럴은 사람이 이해할 수 있는 문자, 기호를 통해 값을 생성하는 **표기법**이다.

| 리터럴     | 예시                               | 비고      |
| :--------- | :--------------------------------- | :-------- |
| 정수       | 100                                |           |
| 부동소수점 | 10.5                               |           |
| 2진수      | 0b01000001                         | 0b로 시작 |
| 8진수      | 0o101                              | 0o로 시작 |
| 16진수     | 0x41                               | 0x로 시작 |
| 문자열     | 'Hello' <br> "world"               |           |
| 불리언     | true <br> false                    |           |
| null       | null                               |           |
| undefined  | undefined                          |           |
| 객체       | \{ name: 'Lee', address: 'Seoul'\} |           |
| 배열       | [1, 2, 3]                          |           |
| 함수       | function() {}                      |           |
| 정규표현식 | /[A-Z]+/g                          |           |

## 5.3 표현식

표현식(expression)은 값으로 평가될 수 있는 문(statement)이다.

즉 표현식이 평가되면 새로운 값을 생성하거나 기존 값을 참조한다.

```javascript
var score = 50 + 50;
```

```javascript
score; // -> 100
```

```javascript
var x = 1 + 2;

x + 3; // -> 6
```

## 5.4 문

문(statement)은 프로그램을 구성하는 기본 단위이자 최소 실행 단위이다.

```javascript
// 변수 선언문
var x;

// 할당문
x = 5;

// 함수 선언문
function foo() {}

// 조건문
if (x > 1) {
  console.log(x);
}

// 반복문
for (var i = 0; i < 2; i++) {
  console.log(i);
}
```

## 5.5 세미콜론과 세미콜론 자동 삽입 기능

세미콜론(;)은 문의 종료를 나타낸다.

세미콜론 자동 삽입 기능(ASI: Automatic Semicolon Insertion)이 자바스크립트 엔진에 있어 세미콜론은 생략 가능하다.

## 5.6 표현식인 문과 표현식이 아닌 문

표현식인 문과 표현식이 아닌 문을 구별하는 방법은 변수에 할당해 보는 것이다.

- 표현식이 아닌 문

```javascript
var foo = var x; // SyntaxError: Unexpected token var

var num = 10;
// -> undefined

if (true) {}
// -> undefined
```

- 표현식인 문

```javascript
100 + num;
// -> 110

num = 100;
// -> 100
```

표현식 -> 반환할 값이 있어야한다
