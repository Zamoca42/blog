---
title: 8. 제어문
category:
  - JS & TS
tag:
  - JavaScript
---

제어문은 조건에 따라 코드 블록을 실행(조건문)하거나 반복 실행(반복문)할 때 사용한다.
일반적으로 코드는 위에서 아래 방향으로 순차적으로 실행된다.
제어문을 사용하면 코드의 실행 흐름을 인위적으로 제어할 수 있다.

## 1. 블록문

블록문(block statement)는 0개 이상의 문을 중괄호로 묶은 것으로, 코드 블록 또는 블록이라 부르기도 한다.

```javascript
// 블록문
{
  var foo = 10;
}

// 제어문
var x = 1;

if (x < 10) {
  x++;
}

// 함수 선언문
function sum(a, b) {
  return a + b;
}
```

## 2. 조건문

조건문(conditional statement)은 주어진 조건식의 평가 결과에 따라 코드 블록(블록문)의 실행을 결정한다.

조건식은 불리언 값으로 평가될 수 있는 표현식이다.

### 2.1. if ... else 문

if ... else 문은 주어진 조건식의 평가 결과, 즉 논리적 참 또는 거짓에 따라 실행할 코드 블록을 결정한다.

```javascript
if (조건식) {
  // true면 여기서 실행
} else {
  // false면 여기서 실행
}
```

만약 if 문의 조건식이 불리언 값이 아닌 값으로 평가되면 자바스크립트 엔진에 의해 암묵적으로 불리언 값으로 강제 변환되어 실행할 코드 블록을 결정한다.

조건식을 추가하여 실행될 코드 블록을 늘리고 싶으면 `else if` 문을 사용한다.

```javascript
if (조건식1) {
  // 조건식1이 참이면 여기서 실행
} else if (조건식2) {
  // 조건식2가 참이면 여기서 실행
} else {
  // 조건식1과 2가 모두 거짓이면 여기서 실행
}
```

else if 문과 else 문은 옵션이다. if문과 else문은 2번 이상 사용할 수 없지만 else if 문은 여러 번 사용할 수 있다.

```javascript
var num = 2;
var kind;

// if 문
if (num > 0) {
  kind = "양수";
}

console.log(kind); //양수

// if ... else 문

if (num > 0) {
  kind = "양수";
} else {
  kind = "음수";
}
console.log(kind); // 양수

// if...else if 문
if (num > 0) {
  kind = "양수";
} else if (num < 0) {
  kind = "음수";
} else {
  kind = "영";
}
console.log(kind); // 양수
```

코드 블록 내의 문이 하나라면 중괄호를 생략해서 한줄에 작성할 수 있다.

```js
var num = 2;
var kind;

if (num > 0) kind = "양수";
else if (num < 0) kind = "음수";
else kind = "영";

console.log(kind); //양수
```

if ... else문은 삼항 조건 연산자로 바꿔 쓸 수 있다.

```js
var num = 2;
var kind;

if (x % 2) {
  // 2 % 2는 0이다. 이때 0은 false로 타입 변환 된다.
  result = "홀수";
} else {
  result = "짝수";
}

console.log(result); // 짝수
```

다음과 같이 삼항 조건 연산자로 바꿀 수 있다.

```js
var x = 2;

// 0은 false로 취급된다.

var result = x % 2 ? "홀수" : "짝수";
console.log(result); // 짝수
```

만약 경우의 수가 세 가지('양수', '음수', '영')라면 다음과 같이 바꿀 수 있다.

```js
var num = 2;

var kind = num ? (num > 0 ? "양수" : "음수") : "영";
console.log(kind); // 양수
```

## 2.2. switch 문

switch 문은 주어진 표현식을 평가하여 그 값과 일치하는 표현식을 갖는 case문으로 실행 흐름을 옮긴다.
switch 문의 표현식과 일치하는 case 문이 없다면 실행 순서는 default 문으로 이동한다.

default 문은 선택사항이다.

```js
switch (표현식) {
  case 표현식1:
    // 실행문
    break;
  case 표현식2:
    // 실행문
    break;
  default:
  // case와 일치하는 문이 없을 때 실행
}
```

switch 문은 논리적 참, 거짓 보다는 상황(case)에 따라 실행할 코드 블록을 결정할 때 사용한다.

## 3. 반복문

반복문(loop statement)은 조건식의 평가 결과가 참인 경우 코드 블록을 실행한다. 이는 조건식이 거짓일 때까지 반복된다.

자바스크립트는 세 가지 반복문인 for문, while문, do...while문을 제공한다.

### 3.1. for 문

for 문은 조건식이 거짓으로 평가될 때까지 코드 블록을 반복 실행한다.

```js
for (변수 선언문 또는 할당문; 조건식; 증감식) {
    //조건식이 참인 경우 반복 실행될 문;
}

for (var i = 0; i < 2; i++) {
    console.log(i);
}
```

```text
0
1
```

위 예제의 for문은 i 변수가 0으로 초기화된 상태에서 i가 2보다 작을 때까지 코드 블록을 2번 반복 실행한다.

![for 문의 실행 순서](https://github.com/Zamoca42/blog/assets/96982072/c0125a1f-c1ae-48b0-8f2e-f88f665fbe3e)

for 문의 변수 선언문, 조건식, 증감식은 모두 옵션이므로 반드시 사용할 필요는 없다.
단, 어떤 식도 선언하지 않으면 무한루프가 된다.

```js
// 무한루프
for (;;) {...}
```

for문 내에 for 문을 중첩해 사용할 수 있다.
다음은 두 개의 주사위를 던졌을 때 두 눈의 합이 6이 되는 경우의 수를 출력하기 위해 이중 중첩 for 문을 사용한 예다.

```js
for (var i = 1; i <= 6; i++) {
  for (var j = 1; j <= 6; j++) {
    if (i + j === 6) console.log(`[${i}, ${j}]`);
  }
}
```

```text
[1, 5]
[2, 4]
[3, 3]
[4, 2]
[5, 1]
```

### 8.3.2 while 문

while 문은 주어진 조건식의 평가 결과가 참이면 코드 블록을 계속해서 반복 실행한다.
while 문은 반복 횟수가 불명확할 때 주로 사용한다.

```js
var count = 0;

while (count < 3) {
  console.log(count); // 0 1 2
  count++;
}
```

조건식의 평가 결과가 언제나 참이면 무한루프가 된다.

```js
while (true) {...}
```

무한루프에서 탈출하기 위해서는 코드 블록 내에 if문으로 탈출 조건을 만들고 break문으로 코드 블록을 탈출한다.

```js
var count = 0;

while (true) {
  console.log(count);
  count++;
  if (count === 3) break;
} // 0 1 2
```

## 4. break 문

break는 레이블 문, 반복문 또는 switch 문의 코드 블록을 탈출한다.
이 외의 break문을 사용하면 `SyntaxError`가 발생한다.

```js
if (true) {
    break; // SyntaxError
}
```

break문은 반복문을 더 이상 진행하지 않아도 될 때 불필요한 반복을 회피할 수 있어 유용하다.
다음은 문자열에서 특정 문자의 인덱스(위치)를 검색하는 예다.

```js
var string = "Hello World.";
var search = "l";
var index;

for (var i = 0; i < string.length; i++) {
  // 문자열의 개별문자가 'l'이면
  if (string[i] === search) {
    index = i;
    break; // 탈출
  }
}

console.log(index); // 2

// String.prototype.indexOf 메서드를 사용
console.log(string.indexOf(search)); // 2
```

## 5. continue 문

countinue 문은 반복문의 코드 블록 실행을 현 지점에서 중단하고 반복문의 증감식으로 실행 흐름을 이동시킨다.

```js
var string = "Hello World.";
var search = "l";
var count = 0;

// 문자열은 유사 배열이므로 for 문으로 순회할 수 있다.
for (var i = 0; i < string.length; i++) {
  if (string[i] !== search) continue;
  count++;
}

console.log(count); // 3

// String.prototype.match 메서드를 사용해도 같은 동작을 한다.
const regexp = new RegExp(search, "g");
console.log(string.match(regexp).length); // 3
```

위 예제의 for 문은 다음 코드와 동일하게 동작한다.

```js
for (var i = 0; i < string.length; i++) {
  if (string[i] === search) count++;
}
```
