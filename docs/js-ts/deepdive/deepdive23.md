---
title: 23. 실행 컨텍스트
---

실행 컨텍스트(execution context)는 자바스크립트의 동작 원리를 담고있는 내용이다.
실행 컨텍스트에서 주요하게 살펴볼 내용이다.

- 스코프를 기반으로 식별자와 식별자에 바인딩된 값을 관리하는 방식
- 호이스팅이 발생하는 이유
- 클로저의 동작방식
- 태스크 큐와 함께 동작하는 이벤트 핸들러
- 비동기 처리의 동작방식

## 1. 소스코드의 타입

ECMAScript 사양은 실행 컨텍스트를 생성하는 소스코드를 4가지 타입으로 구분한다.
소스코드(실행 가능한 코드)를 4가지 타입으로 구분하는 이유는 소스코드의 타입에 따라 실행 컨텍스트를 생성하는 과정과 내용이 다르기 때문이다.

#### 1. 전역 코드

- 전역에 존재하는 소스코드
- 전역 변수를 관리하기 위해 최상위 스코프인 전역 스코프를 생성
- var 키워드로 선언된 전역 변수와 함수 선언문으로 정의된 전역 함수를 전역 객체의 프로퍼티와 메서드로 바인딩하고 참조하기위해 전역 객체와 연결
- 전역에 정의된 함수, 클래스 등의 내부 코드는 포함되지 않음

#### 2. 함수 코드

- 함수 내부 존재하는 소스코드
- 지역 스코프를 생성하고 지역 변수, 매개변수, arguments 객체를 관리
- 생성한 지역 스코프를 전역 스코프에서 시작하는 스코프 체인의 일원으로 연결
- 함수 내부에 중첩된 함수, 클래스 등의 내부 코드는 포함되지 않음

#### 3. eval 코드

- 빌트인 전역 함수인 eval 함수에 인수로 전달되어 실행되는 소스코드
- strict mode에서 자신만의 독자적인 스코프를 생성

#### 4. 모듈 코드

- 모듈 내부에 존재하는 소스코드
- 모듈별로 독립적인 모듈 스코프를 생성
- 모듈 내부의 함수, 클래스 등의 내부 코드는 포함되지 않음

![그림 23-1. 소스코드를 평가하여 실행 컨텍스트를 생성](https://github.com/Zamoca42/blog/assets/96982072/4c259d36-2264-460b-af8f-fb17113b49df)

## 2. 소스코드의 평가와 실행

자바스크립트 엔진은 모든 소스코드를 실행에 앞서 **소스코드의 평가**와 **소스코드의 실행** 과정으로 나누어 처리

- 소스코드 평가 과정

  1. 실행 컨텍스트를 생성하고 변수, 함수 등의 선언문만 먼저 실행
  2. 생성된 변수나 함수 식별자를 키로 실행 컨텍스트가 관리하는 스코프(렉시컬 환경의 환경 레코드)에 등록

- 소스코드의 실행

  1. 런타임 시작(순차적 실행)
  2. 실행에 필요한 변수나 함수의 참조를 실행 컨텍스트가 관리하는 스코프에서 검색해서 취득
  3. 변수 값의 변경 등 소스코드의 실행 결과는 다시 실행 컨텍스트가 관리하는 스코프에 등록

![그림 23-2. 소스코드의 평가와 실행](https://github.com/Zamoca42/blog/assets/96982072/93b2e49a-fb6e-47f9-8f9a-fa52942182e9)

```js
var x;
x = 1;
```

자바스크립트 엔진은 위 예제를 2개의 과정으로 나누어 처리한다.

![그림 23-3. 소스코드의 평가](https://github.com/Zamoca42/blog/assets/96982072/2fa783f5-fe76-4974-ba1f-4efe573e3698)

- 소스코드 평가 과정
  1. 평가 과정에서 변수 선언문 `var x;`를 먼저 실행
  2. 생성된 변수 식별자 x는 실행 컨텍스트가 관리하는 스코프에 등록되고 `undefined`로 초기화

![그림 23-4. 소스코드의 실행](https://github.com/Zamoca42/blog/assets/96982072/5f00a604-fc30-48a4-8a49-64800e692cdb)

- 소스코드 실행 과정
  1. 실행 컨텍스트가 관리하는 스코프에 x 변수가 선언된 변수인지 확인
  2. x 변수가 선언된 변수라면 값을 할당하고 할당 결과를 실행 컨텍스트에 등록하여 관리

## 3. 실행 컨텍스트의 역할

자바스크립트 엔진이 전역 코드와 함수코드로 구성된 예제를 어떻게 평가하고 실행할지 생각해보자.

```js
// 전역 변수 선언
const x = 1;
const y = 2;

// 함수 정의
function foo(a) {
  // 지역 변수 선언
  const x = 10;
  const y = 20;

  // 메서드 호출
  console.log(a + x + y); // 130
}

// 함수 호출
foo(100);

// 메서드 호출
console.log(x + y); // 3
```

#### 1. 전역 코드 평가

- 전역 코드의 변수 선언문과 함수 선언문이 먼저 실행
- 생성된 전역 변수와 전역 함수가 실행 컨텍스트가 관리하는 전역 스코프에 등록
- var 키워드로 선언된 전역 변수와 함수 선언문으로 정의된 전역 함수는 전역 객체의 프로퍼티와 메서드

#### 2. 전역 코드 실행

- 런타임이 시작되어 전역 코드가 순차적으로 실행되기 시작
- 전역 변수에 값이 할당되고 함수 호출
- 함수가 호출되면 순차적으로 실행되던 전역 코드의 실행을 일시 중단하고 코드 실행 순서를 변경하여 함수 내부로 진입

#### 3. 함수 코드 평가

- 함수 호출에 의해 코드 실행 순서가 변경되어 함수 내부로 진입
- 함수 내부의 문들을 실행하기에 앞서 함수 코드 평가 과정을 거치며 함수 코드를 실행하기 위한 준비
- 매개변수와 지역 변수 선언문이 먼저 실행
- 생성된 매개변수와 지역 변수가 실행 컨텍스트가 관리하는 지역 스코프에 등록
- 함수 내부에서 지역 변수처럼 사용할 수 있는 arguments 객체가 생성되어
  지역 스코프에 등록되고 this 바인딩도 결정

#### 4. 함수 코드 실행

- 런타임이 시작되어 함수 코드가 순차적으로 실행
- 매개변수와 지역 변수에 값이 할당되고 `console.log` 메서드가 호출
- `console.log` 메서드를 호출하기 위해 먼저 식별자인 `console`을 스코프 체인을 통해 검색
- 함수 코드의 지역 스코프는 상위 스코프인 전역 스코프와 연결
- `console` 식별자는 스코프체인에 등록되어 있지 않고 전역 객체에 프로퍼티로 존재
  - 전역 객체의 프로퍼티가 마치 전역 변수처럼 전역 스코프를 통해 검색 가능해야 한다는 것을 의미
- `console.log` 메서드의 실행이 종료되면 함수 코드 실행 과정이 종료되고 함수 호출 이전으로 되돌아가 전역 코드 실행을 계속

이처럼 코드가 실행되려면 다음과 같이 스코프, 식별자, 코드 실행 순서 등의 관리 필요

1. 선언에 의해 생성된 모든 식별자를 스코프를 구분하여 등록하고 상태 변화를 지속적으로 관리
2. 스코프는 중첩 관계에 의해 스코프 체인을 형성. 즉, 스코프 체인을 통해 상위 스코프로 이동하여 식별자를 검색
3. 현재 실행 중인 코드의 실행 순서를 변경

실행 컨텍스트는 소스코드를 실행하는데 필요한 환경을 제공하고 코드의 실행 결과를 실제로 관리하는 영역
식별자와 스코프는 실행 컨텍스트의 렉시컬 환경으로 관리하고 실행 순서는 실행 컨텍스트 스택으로 관리

## 4. 실행 컨텍스트 스택

```js
const x = 1;

function foo() {
  const y = 2;

  function bar() {
    const z = 3;
    console.log(x + y + z);
  }
  bar();
}

foo(); // 6
```

위 예제는 소스코드의 타입으로 분류할 때 전역 코드와 함수 코드로 이루어져 있다.

- 자바스크립트 엔진은 먼저 전역 코드를 평가하여 전역 실행 컨텍스트를 생성
- 함수가 호출되면 함수 코드를 평가하여 함수 실행 컨텍스트를 생성

이때 생성된 실행 컨텍스트는 스택 자료구조로 관리하고 이를 **실행 컨텍스트 스택**이라고 부른다.

![그림 23-5. 실행 컨텍스트 스택](https://github.com/Zamoca42/blog/assets/96982072/b08dbc15-dc58-4de9-a7dd-4ece9676a5c5)

#### 1. 전역 코드의 평가와 실행

- 자바스크립트 엔진은 먼저 전역 코드를 평가하여 전역 실행 컨텍스트를 생성하고 실행 컨텍스트 스택에 푸시
- 전역 변수 x와 전역 함수 foo는 전역 실행 컨텍스트에 등록
- 전역 코드가 실행되기 시작하여 전역 변수 x에 값이 할당되고 전역 함수 foo가 호출

#### 2. foo 함수 코드의 평가와 실행

- 전역 함수 foo가 호출되면 전역 코드의 실행은 일시 중단되고 코드의 제어권이 foo 함수 내부로 이동
- 자바스크립트 엔진은 foo 함수 내부의 함수 코드를 평가하여 foo 함수 실행 컨텍스트를 생성 실행 컨텍스트 스택에 푸시
- foo 함수의 지역 변수 y와 중첩 함수 bar가 foo 함수 실행 컨텍스트에 등록
- foo 함수 코드가 실행되기 시작하여 지역 변수 y에 값이 할당되고 중첩 함수 bar가 호출

#### 3. bar 함수 코드의 평가와 실행

- 중첩 함수 bar가 호출되면 foo 함수 코드의 실행은 일시 중단되고 코드의 제어권이 bar 함수 내부로 이동
- 자바스크립트 엔진은 bar 함수 내부의 함수 코드를 평가하여 bar 함수 실행 컨텍스트를 생성하고 실행 컨텍스트 스택에 푸시
- bar 함수의 지역 변수 z가 bar 함수 실행 컨텍스트에 등록
- bar 함수 코드가 실행되기 시작하여 지역 변수 z에 값이 할당되고 console.log 메서드를 호출한 이후 bar 함수는 종료

#### 4. foo 함수 코드로 복귀

- bar 함수가 종료되면 코드의 제어권은 다시 foo 함수로 이동
- 자바스크립트 엔진은 bar 함수 실행 컨텍스트를 실행 컨텍스트에서 팝하여 제거
- foo 함수는 더 이상 실행할 코드가 없으므로 종료

#### 5. 전역 코드로 복귀

- foo 함수가 종료되면 코드의 제어권은 다시 전역 코드로 이동
- 자바스크립트 엔진은 foo 함수 실행 컨텍스트를 실행 컨텍스트 스택에서 팝하여 제거

실행 컨텍스트 스택은 코드의 실행 순서를 관리. 최상위에 존재하는 실행 컨텍스트 언제나 현재 실행 중인 코드의 실행 컨텍스트다.

## 5. 렉시컬 환경

렉시컬 환경은 식별자와 식별자에 바인딩된 값, 그리고 상위 스코프에 대한 참조를 기록하는 자료구조로 실행 컨텍스트를 구성하는 컴포넌트다.
실행 컨텍스트 스택이 코드의 실행 순서를 관리한다면 렉시컬 환경은 스코프와 식별자를 관리

![그림 23-6. 렉시컬 환경과 스코프 체인](https://github.com/Zamoca42/blog/assets/96982072/09865ff4-387e-41e9-a2bd-81dac91f2c0d)

렉시컬 환경은 키와 값을 갖는 객체 형태의 스코프를 생성하여 식별자를 키로 등록하고 식별자에 바인딩된 값을 관리하는 저장소 역할이 렉시컬 스코프의 실체

실행 컨텍스트는 LexicalEnvironment 컴포넌트와 VariableEnvironment 컴포넌트로 구성

![그림 23-7. 실행 컨텍스트와 렉시컬 환경](https://github.com/Zamoca42/blog/assets/96982072/54f5d6d0-fbc4-4909-ac5d-884830883fc7)

- 생성 초기에 LexicalEnvironment 컴포넌트와 VariableEnvironment 컴포넌트는 하나의 동일한 렉시컬 환경을 참조
- strict mode와 eval 코드, try/catch 문과 같은 특수한 상황을 만나면 컴포넌트는 내용이 달라지는 경우도 있음

![그림 23-8. 렉시컬 환경의 구성 컴포넌트](https://github.com/Zamoca42/blog/assets/96982072/6861eaad-0c1c-4f2c-812f-c16a142de709)

1. 환경 레코드(Environment Record)

- 스코프에 포함된 식별자를 등록하고 등록된 식별자에 바인딩된 값을 저장하는 저장소
- 환경 레코드는 소스코드의 타입에 따라 관리하는 내용에 차이 존재

2. 외부 렉시컬 환경에 대한 참조(Outer Lexical Environment Reference)

- 외부 렉시컬 환경에 대한 참조는 상위 스코프를 가리킨다.
  - 상위 스코프란 해당 실행 컨텍스트를 생성한 소스코드를 포함하는 상위 코드의 렉시컬 환경을 말한다.
- 외부 렉시컬 환경에 대한 참조를 통해 단방향 링크드 리스트인 스코프 체인을 구현한다.

## 6. 실행 컨텍스트의 생성과 식별자 검색 과정

```js
var x = 1;
const y = 2;

function foo(a) {
  var x = 3;
  const y = 4;

  function bar(b) {
    const z = 5;
    console.log(a + b + x + y + z);
  }
  bar(10);
}

foo(20); // 42
```

### 6.1. 전역 객체 생성

- 코드 평가 이전에 생성
- 표준 빌트인 객체가 추가되며 동작환경에 따라 Web API 또는 특정 환경을 위한 호스트 객체 포함
- 전역 객체도 프로토타입 체인의 일원이므로 `Object.prototype` 상속을 받음

```js
// Object.prototype.toString
window.toString(); // -> "[object Window]"

window.__proto__.__proto__.__proto__.__proto__ === Object.prototype; // -> true
```

### 6.2. 전역 코드 평가

1. 전역 실행 컨텍스트 생성
2. 전역 렉시컬 환경 생성
   2.1. 전역 환경 레코드 생성
   - 객체 환경 레코드 생성
   - 선언적 환경 레코드 생성
     2.2. this 바인딩
     2.3. 외부 렉시컬 환경에 대한 참조 결정

위 과정을 그림으로 나타내면 다음과 같다.

![그림 23-9. 전역 실행 컨텍스트와 렉시컬 환경](https://github.com/Zamoca42/blog/assets/96982072/e319082c-df91-424a-9d0c-98fba98d3db0)

세부적인 생성 과정을 살펴보자.

#### 1. 전역 실행 컨텍스트 생성

비어있는 전역 실행 컨텍스트을 생성하여 스택에 푸시한다.

![그림 23-10. 전역 실행 컨텍스트 생성](https://github.com/Zamoca42/blog/assets/96982072/dafaee77-a7a5-44c9-a038-1e8a8196f173)

#### 2. 전역 렉시컬 환경 생성

전역 렉시컬 환경을 생성하고 전역 실행 컨텍스트에 바인딩

![그림 23-11. 전역 렉시컬 환경 생성](https://github.com/Zamoca42/blog/assets/96982072/b9295509-83d0-4871-ba13-8de117c195ec)

환경 레코드(Environment Record)와 외부 렉시컬 환경에 대한 참조로 구성

- 전역 환경 레코드 생성

  - 전역 변수를 관리하는 전역 스코프, 전역 객체의 빌트인 전역 프로퍼티, 전역 함수, 표준 빌드인 객체 제공

  - 객체 환경 레코드

    - var 키워드로 선언한 변수 및 함수 선언문으로 정의된 전역 함수는 전역 환경 레코드의 객체 환경 레코드에 연결된 BindingObject(전역 객체)를 통해 전역 객체의 프로퍼티와 메서드가 된다.
    - 변수 호이스팅이 발생하는 원인

    ```js
    var x = 1;
    const y = 2;

    function foo (a) {
    ...
    }
    ```

    ![그림 23-12. 전역 환경 레코드의 객체 환경 레코드](https://github.com/Zamoca42/blog/assets/96982072/f15c97ae-27c7-48bb-bc47-98873083f04a)

  - 선언적 환경 레코드

    - let, const 키워드로 선언한 전역 변수는 선언적 환경 레코드에 등록되고 관리
    - 일시적 사각지대의 원인

    ```js
    let foo = 1; // 전역 변수
    {
      // let, const 키워드로 선언한 변수가 호이스팅되지 않는다면 전역 변수를 참조해야 한다.
      // 하지만 let 키워드로 선언한 변수도 여전히 호이스팅이 발생하기 때문에 참조 에러(ReferenceError)가 발생한다.
      console.log(foo); // ReferenceError: Cannot access 'foo' before initialization
      let foo = 2; // 지역 변수
    }
    ```

    ![그림 23-13. 전역 환경 레코드의 선언적 환경 레코드](https://github.com/Zamoca42/blog/assets/96982072/79e333cf-4c30-4fbe-b388-eb8ead44fef6)

- this 바인딩

  - 전역 코드에서 this를 참조하면 전역 환경 레코드의 `[[GlobalThisValue]]` 내부 슬롯에 바인딩 되어있는 객체가 반환

![그림 23-14. this 바인딩](https://github.com/Zamoca42/blog/assets/96982072/65ed9240-b0fe-462d-acc4-93871654a76e)

- 외부 렉시컬 환경에 대한 참조 결정

  - 평가 중인 소스코드를 포함하는 외부 소스코드의 렉시컬 환경(상위 스코프)를 가리킨다.
  - 전역 코드를 포함하는 소스코드는 없으므로 null이 할당
  - 스코프 체인의 종점에 존재함을 의미

![그림 23-15. 외부 렉시컬 환경에 대한 참조 결정](https://github.com/Zamoca42/blog/assets/96982072/e2ff0e5d-0fe8-46df-9ba3-bdc59b5a3b9a)

### 6.3. 전역 코드 실행

변수 할당문이 실행되어 전역 변수 x, y에 값이 할당, foo 함수 호출

![그림 23-16. 전역 코드의 실행](https://github.com/Zamoca42/blog/assets/96982072/d3bdc47c-ce0f-420f-ac73-b030e05e0313)

식별자를 결정하기 위해 식별자를 검색할 때는 실행중인 실행 컨텍스트에서 식별자를 검색하기 시작

### 6.4. foo 함수 코드 평가

```js
var x = 1;
const y = 2;

function foo(a) {
  var x = 3;
  const y = 4;

  function bar(b) {
    const z = 5;
    console.log(a + b + x + y + z);
  }
  bar(10);
}

foo(20); // ← 호출 직전
```

1. 함수 실행 컨텍스트 생성
2. 함수 렉시컬 환경 생성
   2.1. 함수 환경 레코드 생성
   2.2. this 바인딩
   2.3. 외부 렉시컬 환경에 대한 참조 결정

![그림 23-17. foo 함수 실행 컨텍스트와 렉시컬 환경](https://github.com/Zamoca42/blog/assets/96982072/bdd53a0f-29ff-4adf-a535-f997a5ba4569)

### 6.5. foo 함수 코드 실행

- 식별자 결정을 위해 실행 중인 실행 컨텍스트의 렉시컬 환경에서 식별자를 검색하기 시작

![그림 23-22. foo 함수 코드의 실행](https://github.com/Zamoca42/blog/assets/96982072/0ba73a20-9cf7-44fe-9945-dc5b5acc22bd)

### 6.6. bar 함수 코드 평가

- foo 함수 코드 평가와 동일

```js
var x = 1;
const y = 2;

function foo(a) {
  var x = 3;
  const y = 4;

  function bar(b) {
    const z = 5;
    console.log(a + b + x + y + z);
  }
  bar(10); // ← 호출 직전
}

foo(20);
```

![그림 23-23. bar 함수 실행 컨텍스트와 렉시컬 환경](https://github.com/Zamoca42/blog/assets/96982072/56a3f8c4-cef1-4ddf-88ed-ff38d48f5436)

### 6.7. bar 함수 코드 실행

![그림 23-24. bar 함수 코드의 실행](https://github.com/Zamoca42/blog/assets/96982072/8e01ccce-15e2-4359-b1a3-ba3a4c423ea6)

### 6.8 ~ 9. 함수 코드 실행 종료

![그림 23-26. bar 함수 코드 실행 종료](https://github.com/Zamoca42/blog/assets/96982072/9dd3ed36-bbd8-40db-8af4-d1fc5f372bed)

![그림 23-27. foo 함수 코드 실행 종료](https://github.com/Zamoca42/blog/assets/96982072/a6434fe3-4a3a-4b70-b448-5e976761ed26)

### 6.10. 전역 코드 실행 종료

- 전역 코드의 실행이 종료되고 실행 컨텍스트 스택에는 아무것도 남아있지 않게됨

## 7. 실행 컨텍스트와 블록 레벨 스코프

let, const 키워드로 선언한 변수는 블록 레벨 스코프를 따른다.

```js
let x = 1;

if (true) {
  let x = 10;
  console.log(x); // 10
}

console.log(x); // 1
```

![그림 23-28. if 문의 코드 블록이 실행되면 새로운 렉시컬 환경을 생성하여 기존의 렉시컬 환경을 교체](https://github.com/Zamoca42/blog/assets/96982072/1b5def64-2db5-4dfa-9236-e9d217c684f9)

![그림 23-29. if 문의 코드 블록을 위한 렉시컬 환경에서 이전 렉시컬 환경으로 복귀](https://github.com/Zamoca42/blog/assets/96982072/a41e03ec-7d5b-46b4-a68c-23f35af550db)
