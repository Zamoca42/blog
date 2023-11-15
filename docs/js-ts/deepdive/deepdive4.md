---
title: 4. 변수
category:
  - JS & TS
tag:
  - JavaScript
---

## 1. 변수란 무엇인가?

- 컴퓨터는 데이터를 메모리에 저장하거나 읽어들임

  - 메모리는 메모리 셀의 집합체

  - 각 셀은 고유의 메모리 주소를 갖는다

    - 4GB 메모리의 주소는 0x00000000 ~ 0xffffffff

- 변수는 하나의 값을 저장하기 위해 확보한 메모리 공간을 식별하기 위해 붙인 이름

  - 변수에 값을 저장하는 것을 **할당(대입, 저장)**

  - 변수에 저장된 값을 읽어 들이는 것을 **참조**

## 2. 식별자

- 변수의 이름 = 식별자 = 고유한 이름

  - 식별자는 값이 저장되어 있는 메모리 주소와 매핑관계

  ```javascript
  var result = 30;
  ```

  - 변수 이름(식별자) -> 메모리주소 \[메모리\]

## 3. 변수 선언

변수를 선언할때는 `var`, `let`, `const` 키워드를 사용한다.

```javascript
var score; // 변수 선언
```

변수를 선언한 후 값을 할당하지않으면 `undefined`로 초기화

:pushpin: `undefined`는 원시 타입의 값이다.

변수를 선언 하지 않고 값을 할당하면 `ReferenceError`(참조 에러)가 발생한다.

## 4. 변수 선언의 실행 시점과 호이스팅

```javascript
console.log(score); // undefined

var score; // 변수 선언
```

자바스크립트 코드는 한 줄씩 순차적으로 실행된다.

- `console.log(score)`에서 참조 에러가 아닌 이유

  - 변수 선언이 런타임 시점이 아니라 그 전 단계에서 먼저 실행

- 호이스팅은 변수 선언문이 코드의 선두로 끌어 올려진 것처럼 동작하는 자바스크립트 특징
  - 변수 선언 뿐 아니라 변수, 함수, 클래스 등의 식별자는 모두 호이스팅 된다.

## 5. 값의 할당

```javascript
console.log(score); // undefined

score = 80; // 값의 할당
var score; // 변수 선언

console.log(score); // ??
```

결과

```text
> 80
```

## 6. 값의 재할당

```javascript
var score = 80;
score = 90;
```

`var` 키워드로 선언된 변수는 값을 재할당 가능, `const`는 재할당 불가능

## 참고 링크

:pushpin: [가비지 컬렉션 - 코어 자바스크립트](https://ko.javascript.info/garbage-collection)
