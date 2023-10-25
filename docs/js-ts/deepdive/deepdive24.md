---
title: 24. 클로저
---

> 중첩 함수 bar는 외부 함수보다 더 오래 유지되고 상위 스코프의 식별자를 참조하므로 클로저다.
> 그리고 외부 함수의 외부로 반환되어 외부 함수보다 더 오래 살아남는다.
> 클로저는 상태를(state)를 안전하게 변경하고 의도치 않게 변경되지 않도록 은닉하고 특정 함수에게만 상태 변경을 허용하기 위해 사용한다.

클로저는 난해하기로 유명한 자바스크립트 개념 중 하나다. 클로저는 자바스크립트의 고유의 개념이 아니다.
함수를 일급 객체로 취급하는 함수형 프로그래밍 언어(하스켈, 리스트, 얼랭, 스칼라 등)에서 사용되는 중요한 특성이다.

MDN에서는 클로저에 대해 다음과 같이 정의하고 있다.

::: info

클로저는 함수와 그 함수가 선언된 렉시컬 환경의 조합이다.

:::

위 정의에서 먼저 이해해야할 핵심 키워드는 "함수가 선언된 렉시컬 환경"이다.

```js
const x = 1;

function outerFunc() {
  const x = 10;

  function innerFunc() {
    console.log(x); // 10
  }

  innerFunc();
}

outerFunc();
```

중첩 함수 `innerFunc`의 상위 스코프는 외부 함수 `outerFunc`의 스코프다.
따라서 `innerFunc` 내부에서 자신을 포함하고 있는 외부 함수 `outerFunc`의 x 변수에 접근할 수 있다.
만약 `innerFunc` 함수가 `outerFunc` 함수의 내부에서 정의된 중첩 함수가 아니라면 `innerFunc` 함수를 `outerFunc` 함수의 내부에서 호출한다 하더라도 `outerFunc` 함수의 변수에 접근할 수 없다.

```js
const x = 1;

function outerFunc() {
  const x = 10;
  innerFunc();
}

function innerFunc() {
  console.log(x); // 1
}

outerFunc();
```

이 같은 현상이 발생하는 이유는 자바스크립트가 렉시컬 스코프를 따르는 프로그래밍 언어이기 때문이다.

## 1. 렉시컬 스코프

자바스크립트 엔진은 함수를 어디서 호출했는지가 아니라 함수를 어디 정의했는지에 따라 상위 스코프를 결정한다.
이를 렉시컬 스코프(정적 스코프)라 한다.

```js
const x = 1;

function foo() {
  const x = 10;
  bar();
}

function bar() {
  console.log(x);
}

foo(); // ?
bar(); // ?
```

위 예제는 foo 함수와 bar 함수는 모두 전역에서 정의된 전역 함수다.
함수의 상위 스코프는 함수를 어디서 정의했느냐에 따라 결정되고 foo 함수와 bar 함수의 상위 스코프는 전역이다.
함수를 어디서 호출하는지는 함수의 상위 스코프 결정에 어떠한 영향도 주지 못한다.
즉, 함수의 상위 스코프는 함수를 정의한 위치에 의해 정적으로 결정되고 변하지 않는다.

렉시컬 환경의 "외부 렉시컬 환경에 대한 참조"에 저장할 참조값, 즉 상위 스코프에 대한 참조는 함수 정의가 평가되는 시점에 함수가 정의된 환경(위치)에 의해 결정된다. 이것이 바로 렉시컬 스코프다.

## 2. 함수 객체의 내부 슬롯 `[[Environment]]`

함수가 정의된 환경(위치)과 호출되는 환경(위치)은 다를 수 있다.
따라서 렉시컬 스코프가 가능하려면 함수는 자신이 호출되는 환경과는 상관없이 자신이 정의된 환경,
즉 상위 스코프를 기억해야한다. 이를 위해 함수는 자신의 내부 슬롯 `[[Environment]]`에 자신이 정의된 환경
즉 상위 스코프의 참조를 저장한다.

함수 객체의 내부 슬롯 `[[Environment]]`에 저장된 현재 실행 중인 실행 컨텍스트의 렉시컬 환경의 참조가 바로 상위 스코프다. 또한 자신이 호출되었을 때 생성될 함수 렉시컬 환경의 "외부 렉시컬 환경에 대한 참조"에 저장될 참조값이다. 함수 객체는 내부 슬롯 `[[Environment]]`에 저장된 렉시컬 환경의 참조, 즉 상위 스코프를 자신이 존재하는 한 기억한다.

```js
const x = 1;

function foo() {
  const x = 10;

  // 상위 스코프는 함수 정의 환경(위치)에 따라 결정된다.
  // 함수 호출 위치와 상위 스코프는 아무런 관계가 없다.
  bar();
}

// 함수 bar는 자신의 상위 스코프, 즉 전역 렉시컬 환경을 [[Environment]]에 저장하여 기억한다.
function bar() {
  console.log(x);
}

foo(); // ?
bar(); // ?
```

위 예제의 foo 함수 내부에서 bar 함수가 호출되어 실행 중인 시점의 실행 컨텍스트는 다음과 같다.

![그림 24-1. 함수 객체의 내부 슬롯 `[[Environment]]`에는 상위 스코프가 저장](https://github.com/Zamoca42/blog/assets/96982072/6cd5167a-5991-44ef-b22c-aedc0eac7739)

foo 함수와 bar 함수는 모두 전역에서 함수 선언문으로 정의되었다.
foo 함수와 bar 함수는 모두 전역 코드가 평가되는 시점에 평가되어 함수 객체를 생성하고 전역 객체 window의 메서드가 된다.

함수 코드 평가는 아래 순서로 진행된다.

1. 함수 실행 컨텍스트 생성
2. 함수 렉시컬 환경 생성
   2.1. 함수 환경 레코드 생성
   2.2. this 바인딩
   2.3. 외부 렉시컬 환경에 대한 참조 결정

## 3. 클로저와 렉시컬 환경

```js
const x = 1;

// ①
function outer() {
  const x = 10;
  const inner = function () {
    console.log(x);
  }; // ②
  return inner;
}

// outer 함수를 호출하면 중첩 함수 inner를 반환한다.
// 그리고 outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 팝되어 제거된다.
const innerFunc = outer(); // ③
innerFunc(); // ④ 10
```

③의 outer 함수를 호출하면 outer 함수는 중첩 함수 inner를 반환하고 생명 주기를 마감
④에서 실행 결과 outer 함수의 지역 변수 x의 값인 10이다. 이미 생명 주기가 종료되어 실행 컨텍스트 스택에서 제거된 outer 함수의 지역 변수 x가 다시 부활이라도 한 듯이 동작

이처럼 외부 함수보다 중첩 함수가 더 오래 유지되는 경우 중첩 함수는 이미 생명 주기가 종료된 외부 함수의 변수를 참. 이러한 중첩 함수를 클로저라고 부른다.

① 위 예제에서 outer 함수가 평가되어 함수 객체를 생성할 때 현재 실행 중인 실행 컨텍스트의 렉시컬 환경, 즉 전역 렉시컬 환경을 outer 함수 객체의 `[[Environment]]` 내부 슬롯에 상위 스코프로서 저장.

![그림 24-2. 전역 함수 객체의 상위 스코프 결정](https://github.com/Zamoca42/blog/assets/96982072/ee05d7bc-4b79-4814-bf7e-7c33c3ae83d2)

outer 함수를 호출하면 outer 함수의 렉시컬 환경이 생성되고 앞서 outer 함수 객체의 `[[Environment]]` 내부 슬롯에 저장된 전역 렉시컬 환경을 outer 함수 렉시컬 환경의 외부 렉시컬 환경에 대한 참조에 할당한다.

중첩 함수 inner는 자신의 `[[Environment]]`내부 슬롯에 현재 실행 중인 실행 컨텍스트의 렉시컬 환경,
즉 outer 함수의 렉시컬 환경을 상위 스코프로서 저장한다.

![그림 24-3. 중첩 함수의 상위 스코프 결정](https://github.com/Zamoca42/blog/assets/96982072/34febe71-4875-455d-942e-4b018f8a1da4)

outer 함수의 실행 컨텍스트는 실행 컨텍스트 스택에서 제거되지만 outer 함수의 렉시컬 환경까지 소멸하는 것은 아니다.

inner 함수는 전역 변수 innerFunc에 의해 참조되고 있으므로 가비지 컬렉션의 대상이 되지 않기 때문이다.
가비지 컬렉터는 누군가가 참조하고 있는 메모리 공간을 함부로 해제하지 않는다.

![그림 24-4. outer 함수의 실행 컨텍스트가 제거되어도 outer 함수의 렉시컬 환경은 유지](https://github.com/Zamoca42/blog/assets/96982072/694f1b88-e806-4b85-9442-da8d28fe42ba)

outer 함수가 반환한 inner 함수를 호출하면 inner 함수의 실행 컨텍스트가 생성되고 실행 컨텍스트 스택에 푸시된다. 그리고 렉시컬 환경의 외부 렉시컬 환경에 대한 참조에는 inner 함수 객체의 `[[Environment]]` 내부 슬롯에 저장되어 있는 참조값이 할당

![그림 24-5. 외부 함수가 소멸해도 반환된 중첩 함수는 외부 함수의 변수에 참조](https://github.com/Zamoca42/blog/assets/96982072/d40c5080-4ec9-4cbf-8779-60e4794707c9)

중첩 함수 inner는 외부 함수 outer보다 더 오래 생존했다.
자바스크립트의 모든 함수는 상위 스코프를 기억하므로 이론적으로 모든 함수는 클로저다.
하지만 일반적으로 모든 함수를 클로저라고 하지 않는다.

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      function foo() {
        const x = 1;
        const y = 2;

        // 일반적으로 클로저라고 하지 않는다.
        function bar() {
          const z = 3;

          debugger;
          // 상위 스코프의 식별자를 참조하지 않는다.
          console.log(z);
        }

        return bar;
      }

      const bar = foo();
      bar();
    </script>
  </body>
</html>
```

![그림 24-6. 상위 스코프의 어떤 식별자도 참조하지 않는 함수는 클로저가 아니다.](https://github.com/Zamoca42/blog/assets/96982072/79bcf787-a865-4dc4-acbe-2c8587d7332e)

위 예제의 중첩 함수 bar는 외부 함수 foo보다 더 오래 유지되지만 상위 스코프의 어떤 식별자도 참조하지 않는다.
참조하지도 않는 식별자를 기억하는 것은 메모리 낭비이기 때문에 bar 함수는 클로저라고 할 수 없다.

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      function foo() {
        const x = 1;

        // 일반적으로 클로저라고 하지 않는다.
        // bar 함수는 클로저였지만 곧바로 소멸한다.
        function bar() {
          debugger;
          // 상위 스코프의 식별자를 참조한다.
          console.log(x);
        }
        bar();
      }

      foo();
    </script>
  </body>
</html>
```

![그림 24-7. 중첩 함수 bar는 클로저였지만 외부 함수보다 일찍 소멸되기 떄문에 클로저의 본질에 부합하지 않는다.](https://github.com/Zamoca42/blog/assets/96982072/5669a91b-21ca-4026-ae3e-b57a3c3b1a34)

위 예제의 중첩 함수 bar는 상위 스코프의 식별자를 참조하고 있으므로 클로저다.
하지만 외부 함수 foo의 외부로 중첩 함수 bar가 반환되지 않는다.
즉, 외부 함수 foo보다 중첩 함수 bar의 생명 주기가 짧다.
따라서 중첩 함수 bar는 일반적으로 클로저라고 하지 않는다.

```html
<!DOCTYPE html>
<html>
  <body>
    <script>
      function foo() {
        const x = 1;
        const y = 2;

        // 클로저
        // 중첩 함수 bar는 외부 함수보다 더 오래 유지되며 상위 스코프의 식별자를 참조한다.
        function bar() {
          debugger;
          console.log(x);
        }
        return bar;
      }

      const bar = foo();
      bar();
    </script>
  </body>
</html>
```

![그림 24-8. 중첩 함수 bar는 외부 함수보다 더 오래 유지되고 상위 스코프의 식별자를 참조하므로 클로저다.](https://github.com/Zamoca42/blog/assets/96982072/0922fb47-7cf5-4aa0-ac1b-c64f795fb242)

외부 함수의 외부로 반환되어 외부 함수보다 더 오래 살아남는다.

이처럼 외부 함수보다 중첩 함수가 더 오래 유지되는 경우 중첩 함수는 이미 생명 주기가 종료한 외부 함수의 변수를 참조할 수 있다. 이러한 중첩 함수를 클로저라고 부른다.

클로저에 의해 참조되는 상위 스코프의 변수를 자유 변수(free variable)이라고 부른다.
클로저란 "함수가 자유 변수에 대해 닫혀있다"라는 의미다.
이를 좀 더 쉽게 설명하면 "자유 변수에 묶여있는 함수"

## 4. 클로저의 활용

클로저는 상태를(state)를 안전하게 변경하고 의도치 않게 변경되지 않도록 은닉하고 특정 함수에게만 상태 변경을 허용하기 위해 사용한다.

함수가 호출될 때마다 호출된 횟수를 누적하여 출력하는 카운터를 만들어보자.

```js
// 카운트 상태 변수
let num = 0;

// 카운트 상태 변경 함수
const increase = function () {
  // 카운트 상태를 1만큼 증가 시킨다.
  return ++num;
};

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```

위 코드는 잘 동작하지만 오류를 발생시킬 가능성을 내포하고 있는 코드다.
위 예제가 바르게 동작하려면 다음의 전제 조건이 필요하다.

1. 카운트 상태(num 변수의 값)는 increase 함수가 호출되기 전까지 변경되지 않고 유지
2. 이를 위해 카운트 상태(num 변수의 값)는 increase 함수만이 변경할 수 있어야함

하지만 카운트 상태는 전역 변수를 통해 관리되고 있기 때문에 언제든지 접근 가능하고 변경할 수 있다.
이는 의도치 않게 상태가 변경될 수 있다는 것을 의미한다.

따라서 카운트 상태를 안전하게 변경하고 유지하기 위해서는 increase 함수만이 num 변수를 참조하고 변경할 수 있게 전역 변수 num을 increase 함수의 지역 변수로 바꾸어 상태 변경을 방지 해야한다.

```js
// 카운트 상태 변경 함수
const increase = function () {
  // 카운트 상태 변수
  let num = 0;

  // 카운트 상태를 1만큼 증가 시킨다.
  return ++num;
};

// 이전 상태를 유지하지 못한다.
console.log(increase()); // 1
console.log(increase()); // 1
console.log(increase()); // 1
```

전역 변수 num을 increase 함수의 지역 변수로 변경하여 의도치 않은 상태 변경을 방지했다.
이제 num 변수의 상태는 increase 함수만이 변경할 수 있다.

increase 함수가 호출될 때마다 지역 변수 num은 다시 선언되고 0으로 초기화되기 때문에 출력 결과는 언제나 1이다.

다시 말해, 상태가 변경되기 이전 상태를 유지하지 못한다. 이전 상태를 유지할 수 있도록 클로저를 사용해보자.

```js
// 카운트 상태 변경 함수
const increase = (function () {
  // 카운트 상태 변수
  let num = 0;

  // 클로저
  return function () {
    // 카운트 상태를 1만큼 증가 시킨다.
    return ++num;
  };
})();

console.log(increase()); // 1
console.log(increase()); // 2
console.log(increase()); // 3
```

위 코드가 실행되면 즉시 실행 함수가 호출되고 즉시 실행 함수가 반환한 함수가 increase 변수에 할당된다.
increase 변수에 할당된 함수는 자신이 정의된 위치에 의해 결정된 상위 스코프인 즉시 실행 함수의 렉시컬 환경을 기억하는 클로저다.

이처럼 클로저는 상태가 의도치 않게 변경되지 않도록 안전하게 은닉하고 특정 함수에게만 상태 변경을 허용하여 상태를 안전하게 변경하고 유지하기 위해 사용한다.

```js
const counter = (function () {
  // 카운트 상태 변수
  let num = 0;

  // 클로저인 메서드를 갖는 객체를 반환한다.
  // 객체 리터럴은 스코프를 만들지 않는다.
  // 따라서 아래 메서드들의 상위 스코프는 즉시 실행 함수의 렉시컬 환경이다.
  return {
    // num: 0, // 프로퍼티는 public하므로 은닉되지 않는다.
    increase() {
      return ++num;
    },
    decrease() {
      return num > 0 ? --num : 0;
    },
  };
})();

console.log(counter.increase()); // 1
console.log(counter.increase()); // 2

console.log(counter.decrease()); // 1
console.log(counter.decrease()); // 0
```

위 예제의 increase, decrease 메서드의 상위 스코프는 increase, decrease 메서드가 평가되는 시점에 실행 중인 실행 컨텍스트인 즉시 실행 함수 실행 컨텍스트의 렉시컬 환경이다.

```js
const Counter = (function () {
  // ① 카운트 상태 변수
  let num = 0;

  function Counter() {
    // this.num = 0; // ② 프로퍼티는 public하므로 은닉되지 않는다.
  }

  Counter.prototype.increase = function () {
    return ++num;
  };

  Counter.prototype.decrease = function () {
    return num > 0 ? --num : 0;
  };

  return Counter;
})();

const counter = new Counter();

console.log(counter.increase()); // 1
console.log(counter.increase()); // 2

console.log(counter.decrease()); // 1
console.log(counter.decrease()); // 0
```

위 예제의 num은 생성자 함수 Counter가 생성할 인스턴스의 프로퍼티가 아니라 즉시 실행 함수 내에서 선언된 변수다.
만약 num이 생성자 함수 Counter가 생성할 인스턴스의 프로퍼티라면 인스턴스를 통해 외부에서 접근이 자유로운 public 프로퍼티가 된다.

다음은 함수형 프로그래밍에서 클로저를 활용하는 간단한 예제다.

```js
// 함수를 인수로 전달받고 함수를 반환하는 고차 함수
// 이 함수는 카운트 상태를 유지하기 위한 자유 변수 counter를 기억하는 클로저를 반환한다.
function makeCounter(aux) {
  // 카운트 상태를 유지하기 위한 자유 변수
  let counter = 0;

  // 클로저를 반환
  return function () {
    // 인수로 전달 받은 보조 함수에 상태 변경을 위임한다.
    counter = aux(counter);
    return counter;
  };
}

// 보조 함수
function increase(n) {
  return ++n;
}

// 보조 함수
function decrease(n) {
  return --n;
}

// 함수로 함수를 생성한다.
// makeCounter 함수는 보조 함수를 인수로 전달받아 함수를 반환한다
const increaser = makeCounter(increase); // ①
console.log(increaser()); // 1
console.log(increaser()); // 2

// increaser 함수와는 별개의 독립된 렉시컬 환경을 갖기 때문에 카운터 상태가 연동하지 않는다.
const decreaser = makeCounter(decrease); // ②
console.log(decreaser()); // -1
console.log(decreaser()); // -2
```

`makeCounter` 함수는 보조 함수를 인자로 전달받고 함수를 반환하는 고차 함수다.
`makeCounter` 함수가 반환하는 함수는 자신이 생성됐을 때의 렉시컬 환경인 `makeCounter` 함수의 스코프에 속한 counter 변수를 기억하는 클로저다.

`makeCounter` 함수를 호출해 함수를 반환할 때 반환된 함수는 자신만의 독립된 렉시컬 환경을 갖는다는 것이다.

![그림 24-9. `makeCounter` 함수를 처음 호출했을 때 생성된 렉시컬 환경](https://github.com/Zamoca42/blog/assets/96982072/e73eb918-7543-428c-b7c8-b3692e9c3c66)

![그림 24-10. `makeCounter` 함수를 두 번째로 호출했을 때 생성된 렉시컬 환경](https://github.com/Zamoca42/blog/assets/96982072/b57008c1-dfa1-4f79-a593-77e486f0c50d)

## 5. 캡슐화와 정보 은닉

캡슐화는 객체의 상태를 나타내는 프로퍼티와 프로퍼티를 참조하고 조작할 수 있는 동작인 메서드를 하나로 묶는 것을 말한다.
캡슐화는 객체의 특정 프로퍼티나 메서드를 감출 목적으로 사용하기도 하는데 이를 정보 은닉이라 한다.

정보 은닉은 외부에 공개할 필요가 없는 구현의 일부를 외부에 공개되지 않도록 감추어 적절치 못한 접근으로부터 객체의 상태가 변경되는 것을 방지해 정보를 보호하고, 객체 간의 상호 의존성, 즉 결합도를 낮추는 효과가 있다.

```js
function Person(name, age) {
  this.name = name; // public
  let _age = age;   // private

  // 인스턴스 메서드
  this.sayHi = function () {
    console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
  };
}

const me = new Person('Lee', 20);
me.sayHi(); // Hi! My name is Lee. I am 20.
console.log(me.name); // Lee
console.log(me._age); // undefined

const you = new Person('Kim', 30);
you.sayHi(); // Hi! My name is Kim. I am 30.
console.log(you.name); // Kim
console.log(you._age); // undefined
```

위 예제의 name 프로퍼티는 현재 외부로 공개되어 있어서 자유롭게 참조하거나 변경할 수 있다.
즉, name 프로퍼티는 public하다. 하지만 _age 변수는 Person 생성자 함수의 지역 변수이므로 Person 생성자 함수 외부에서 참조하거나 변경할  수 없다. 즉, _age 변수는 private하다.

하지만 위 예제의 `sayHi` 메서드는 인스턴스 메서드이므로 Person 객체가 생성될 때 마다 중복 생성된다.
`sayHi` 메서드를 프로토타입 메서드로 변경하여 `sayHi` 메서드의 중복 생성을 방지해보자.

```js
function Person(name, age) {
  this.name = name; // public
  let _age = age;   // private
}

// 프로토타입 메서드
Person.prototype.sayHi = function () {
  // Person 생성자 함수의 지역 변수 _age를 참조할 수 없다
  console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
};
```

이때 Person.prototype.sayHi 메서드 내에서 Person 생성자 함수의 지역 변수 _age를 참조할 수 없는 문제가 발생한다.

```js
const Person = (function () {
  let _age = 0; // private

  // 생성자 함수
  function Person(name, age) {
    this.name = name; // public
    _age = age;
  }

  // 프로토타입 메서드
  Person.prototype.sayHi = function () {
    console.log(`Hi! My name is ${this.name}. I am ${_age}.`);
  };

  // 생성자 함수를 반환
  return Person;
}());

const me = new Person('Lee', 20);
me.sayHi(); // Hi! My name is Lee. I am 20.
console.log(me.name); // Lee
console.log(me._age); // undefined

const you = new Person('Kim', 30);
you.sayHi(); // Hi! My name is Kim. I am 30.
console.log(you.name); // Kim
console.log(you._age); // undefined
```

위 패턴을 사용하면 public, private, protected같은 접근 제한자를 제공하지 않는 자바스크립트에서도 정보 은닉이 가능한 것처럼 보인다. 하지만 위 코드도 문제가 있다. Person 생성자 함수가 여러 개의 인스턴스를 생성할 경우 다음과 같이 _age 변수의 상태가 유지되지 않는다는 것이다.

```js
const me = new Person('Lee', 20);
me.sayHi(); // Hi! My name is Lee. I am 20.

const you = new Person('Kim', 30);
you.sayHi(); // Hi! My name is Kim. I am 30.

// _age 변수 값이 변경된다!
me.sayHi(); // Hi! My name is Lee. I am 30.
```

## 6. 자주 발생하는 실수

아래는 클로저를 사용할 떄 자주 발생할 수 있는 실수를 보여주는 예제다.

```js
var funcs = [];

for (var i = 0; i < 3; i++) {
  funcs[i] = function () { return i; }; // ①
}

for (var j = 0; j < funcs.length; j++) {
  console.log(funcs[j]()); // ②
}
```

위의 예제에서 funcs 배열의 요소로 추가된 3개의 함수가 0, 1, 2를 반환할 것을 기대했다면 아쉽지만 결과는 그렇지 않다.

따라서 funcs 배열의 요소로 추가한 함수를 호출하면 전역 변수 i를 참조하여 i의 값 3이 출력된다.

클로저를 사용해 위 예제를 바르게 동작하는 코드를 만들어보자.

```js
var funcs = [];

for (var i = 0; i < 3; i++){
  funcs[i] = (function (id) { // ①
    return function () {
      return id;
    };
  }(i));
}

for (var j = 0; j < funcs.length; j++) {
  console.log(funcs[j]());
}
```

위 예제는 자바스크립트의 함수가 함수 레벨 스코프 특성으로 인해 for 문의 변수 선언문에서 var 키워드로 선언한 변수가 전역 변수가 되기 때문에 발생하는 현상이다. ES6의 let 키워드를 사용하면 이 같은 번거로움이 깔끔하게 해결된다.

```js
const funcs = [];

for (let i = 0; i < 3; i++) {
  funcs[i] = function () { return i; };
}

for (let i = 0; i < funcs.length; i++) {
  console.log(funcs[i]()); // 0 1 2
}
```

![그림 24-11. for 문의 변수 선언문에서 let 키워드로 선언한 초기화 변수를 사용한 for 문은 코드 블록이 반복 실행될 때마다 for 문 코드 블록의 새로운 렉시컬 환경을 생성한다.](https://github.com/Zamoca42/blog/assets/96982072/3c44cb6a-d67f-43d5-888f-4a18ba638c54)

let이나 const를 사용하는 반복문은 코드 블록을 반복 실행할 때마다 새로운 렉시컬 환경을 생성하여 반복할 당시의 상태를 마치 스냅샷을 찍는 것처럼 저장한다.

또 다른 방법으로 함수형 프로그래밍 기법인 고차함수를 사용하는 방법이 있다.

```js
// 요소가 3개인 배열을 생성하고 배열의 인덱스를 반환하는 함수를 요소로 추가한다.
// 배열의 요소로 추가된 함수들은 모두 클로저다.
const funcs = Array.from(new Array(3), (_, i) => () => i); // (3) [ƒ, ƒ, ƒ]

// 배열의 요소로 추가된 함수 들을 순차적으로 호출한다.
funcs.forEach(f => console.log(f())); // 0 1 2
```

Array 생성자 함수와 메서드에 대해서는 27장 "배열"에서 자세히 살펴보도록 하자.