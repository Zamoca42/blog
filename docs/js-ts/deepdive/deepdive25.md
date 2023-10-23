---
title: 25. 클래스
---

## 1. 클래스는 프로토타입의 문법적 설탕인가?

프로토타입 기반 객체지향 언어는 클래스가 필요 없는 객체지향 프로그래밍 언어다.
ES5에서는 클래스 없이도 다음과 같이 생성자 함수와 프로토타입을 통해 객체지향 언어의 상속을 구현할 수 있었다.

```js
// ES5 생성자 함수
var Person = (function () {
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  // 프로토타입 메서드
  Person.prototype.sayHi = function () {
    console.log("Hi! My name is " + this.name);
  };

  // 생성자 함수 반환
  return Person;
})();

// 인스턴스 생성
var me = new Person("Lee");
me.sayHi(); // Hi! My name is Lee
```

ES6에서 도입된 클래스는 기존 프로토타입 기반 개체지향 프로그래밍보다 자바나 C#과 같은 클래스 기반 객체지향 프로그래밍에 익숙한 프로그래머가 더욱 빠르게 학습할 수 있도록 클래스 기반 객체지향 프로그래밍 언어와 매우 흡사한 새로운 객체 생성 매커니즘을 제시한다.

그렇다고 ES6의 클래스가 기존 프로토타입 기반 객체지향 모델을 폐지하고 새롭게 클래스 기반 객체지향 모델을 제공하는 것은 아니다.

클래스는 생성자 함수와 매우 유사하게 동작하지만 다음과 같이 몇 가지 차이가 있다.

1. 클래스를 new 연산자 없이 호출하면 에러가 발생한다. 하지만 생성자 함수는 일반 함수로서 호출된다.

2. 클래스는 상속을 지원하는 extends와 super 키워드를 제공한다. 하지만 생성자 함수는 지원하지 않는다.

3. 클래스는 호이스팅이 발생하지 않는 것 처럼 동작. 생성자 함수는 변수 호이스팅이 발생

4. 클래스 내의 모든 코드는 암묵적으로 strict mode 지정. 생성자 함수는 암묵적으로 지정되지 않는다.

5. 클래스의 constructor, 프로토타입 메서드, 정적 메서드는 모두 열거되지 않는다.(`[[Enumerable]] : false`)

생성자 함수와 클래스는 프로토타입 기반의 객체지향을 구현했다는 점에서 매우 유사하다. 하지만 클래스는 생성자 함수 기반의 객체 생성 방식보다 견고하고 명료하다.
특히 클래스의 extends와 super 키워드는 상속 관계 구현을 더욱 간결하고 명료하게한다.
따라서 클래스를 단순한 문법적 설탕이라고 보기보다는 새로운 객체 생성 메커니즘으로 보는 것이 더 합당하다.

## 2. 클래스 정의

클래스 이름은 생성자 함수와 마찬가지로 파스칼 케이스를 사용하는 것이 일반적이다.
파스칼 케이스를 사용하지않아도 에러가 발생하지는 않는다.

```js
// 클래스 선언문
class Person {}
```

일반적이지는 않지만 함수와 마찬가지로 표현식으로 클래스를 정의할 수도 있다.
이때 클래스는 함수와 마찬가지로 이름을 가질 수도 있고, 갖지 않을 수도 있다.

```js
// 익명 클래스 표현식
const Person = class {};

// 기명 클래스 표현식
const Person = class MyClass {};
```

클래스를 표현식으로 정의할 수 있다는 것은 클래스가 값으로 사용할 수 있는 일급 객체라는 것을 의미한다.
즉, 클래스는 일급 객체로서 다음과 같은 특징을 갖는다.

- 무명의 리터럴로 생성. 즉, 런타임에 생성 가능
- 변수나 자료구조(객체, 배열 등)에 저장
- 함수의 매개변수에게 전달
- 함수의 반환값으로 사용

좀 더 자세히 말하면 클래스는 함수와 같고 값처럼 사용할 수 있는 일급 객체다.

클래스 몸체에는 0개 이상의 메서드만 정의할 수 있다. 클래스 몸체에서 정의할 수 있는 메서드는 contructor(생성자), 프로토타입 메서드, 정적 메서드의 세 가지가 있다.

```js
// 클래스 선언문
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name; // name 프로퍼티는 public하다.
  }

  // 프로토타입 메서드
  sayHi() {
    console.log(`Hi! My name is ${this.name}`);
  }

  // 정적 메서드
  static sayHello() {
    console.log("Hello!");
  }
}

// 인스턴스 생성
const me = new Person("Lee");

// 인스턴스의 프로퍼티 참조
console.log(me.name); // Lee
// 프로토타입 메서드 호출
me.sayHi(); // Hi! My name is Lee
// 정적 메서드 호출
Person.sayHello(); // Hello!
```

![그림 25-1. 클래스와 생성자 함수의 정의 방식 비교](https://github.com/Zamoca42/blog/assets/96982072/6836d5b3-3291-4a83-9299-56a0ab643b05)

## 3. 클래스 호이스팅

```js
// 클래스 선언문
class Person {}

console.log(typeof Person); // function
```

클래스 선언문으로 정의한 클래스는 함수 선언문과 같이 소스코드 평가 과정, 즉 런타임 이전에 먼저 평가되어 함수 객체를 생성한다. 이때 클래스가 평가되어 생성된 함수 객체는 생성자 함수로서 호출할 수 있는 함수, 즉 constructor다.

```js
console.log(Person);
// ReferenceError: Cannot access 'Person' before initialization

// 클래스 선언문
class Person {}
```

클래스 선언문은 마치 호이스팅이 발생하지 않는 것처럼 보이나 그렇지 않다.

```js
const Person = "";

{
  // 호이스팅이 발생하지 않는다면 ''이 출력되어야 한다.
  console.log(Person);
  // ReferenceError: Cannot access 'Person' before initialization

  // 클래스 선언문
  class Person {}
}
```

클래스 선언문도 변수 선언, 함수 정의와 마찬가지로 호이스팅이 발생한다. 단, 클래스는 let, const 키워드로 선언한 변수처럼 호이스팅된다.
따라서 클래스 선언문 이전에 일시적 사각지대에 빠지기 때문에 호이스팅이 발생하지 않는 것처럼 동작한다.

var, let, const, function, function\*, class 키워드를 사용하여 선언된 모든 식별자는 호이스팅된다.
모든 선언문은 런타임 이전에 먼저 실행되기 때문이다.

## 4. 인스턴스 생성

클래스 생성자 함수이며 new 연산자와 함께 호출되어 인스턴스를 생성

```js
class Person {}

// 인스턴스 생성
const me = new Person();
console.log(me); // Person {}
```

함수는 new 연산자의 사용 여부에 따라 일반 함수로 호출되거나 인스턴스 생성을 위한 생성자 함수로 호출되지만
클래스는 인스턴스를 생성하는 것이 유일한 존재 이유이므로 반드시 new 연산자와 함께 호출.

```js
class Person {}

// 클래스를 new 연산자 없이 호출하면 타입 에러가 발생한다.
const me = Person();
// TypeError: Class constructor Person cannot be invoked without 'new'
```

클래스 표현식으로 정의된 클래스의 경우 다음 예제와 같이 클래스를 가리키는 식별자가 아닌 기명 클래스 표현식의 클래스 이름(MyClass)를 사용해 인스턴스를 생성하면 에러가 발생.

```js
const Person = class MyClass {};

// 함수 표현식과 마찬가지로 클래스를 가리키는 식별자로 인스턴스를 생성해야 한다.
const me = new Person();

// 클래스 이름 MyClass는 함수와 동일하게 클래스 몸체 내부에서만 유효한 식별자다.
console.log(MyClass); // ReferenceError: MyClass is not defined

const you = new MyClass(); // ReferenceError: MyClass is not defined
```

기명 함수 표현식과 마찬가지로 클래스 표현식에서 사용한 클래스 이름은 외부 코드에서 접근 불가능

## 5. 메서드

클래스 몸체에는 0개 이상의 메서드만 선언. 클래스 몸체에서 정의할 수 있는 메서드는 constructor(생성자), 프로토타입 메서드, 정적 메서드의 세 가지가 있다.

::: info 클래스 정의에 대한 새로운 제안 사양
ECMAScript 사양(ES11/ECMAScript 2020)에 따르면 인스턴스 프로퍼티는 반드시 constructor 내부에서 정의해야 한다. 하지만 2021년 1월 현재, 클래스 몸체에 메서드뿐만이 아니라 프로퍼티를 직접 정의할 수 있는 새로운 표준 사양이 제안되어 있다. 이 제안 사양에 의해 머지않아 클래스 몸체에서 메서드뿐만 아니라 프로퍼티도 정의할 수 있게 될 것으로 보인다. 이에 대해서는 25.7.3절 "클래스 필드 정의 제안"에서 살펴볼 것이다.
:::

## 5.1. constructor

- 인스턴스를 생성하고 초기화하기 위한 특수한 메서드다.
- 이름을 변경할 수 없다.

```js
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name;
  }
}
```

클래스 내부를 들여다보기 위해 다음 코드를 크롬 브라우저의 개발자 도구에서 실행해보자.

```js
// 클래스는 함수다.
console.log(typeof Person); // function
console.dir(Person);
```

![그림 25-2. 클래스는 함수다.](https://github.com/Zamoca42/blog/assets/96982072/8900ab53-a2be-40ba-adc1-3f8225c31740)

모든 함수 객체가 가지고 있는 prototype 프로퍼티가 가리키는 프로토타입 객체의 constructor 프로퍼티는 클래스 자신을 가리키고 있다.
다음은 클래스가 생성한 인스턴스 내부를 살펴보자.

```js
// 인스턴스 생성
const me = new Person("Lee");
console.log(me);
```

![그림 25-3.Person 클래스로 생성한 인스턴스](https://github.com/Zamoca42/blog/assets/96982072/01bd8845-ae63-4f75-a90d-75babcd96bb3)

Person 클래스의 constructor 내부에서 this에 추가한 name 프로퍼티가 클래스가 생성한 인스턴스의 프로퍼티로 추가된 것을 확인할 수 있다. 즉, 생성자 함수와 마찬가지로 constructor 내부에서 this에 추가한 프로퍼티는 인스턴스 프로퍼티가 된다.
constructor 내부의 this는 생성자 함수와 마찬가지로 클래스가 생성한 인스턴스를 가리킨다.

```js
// 클래스
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name;
  }
}

// 생성자 함수
function Person(name) {
  // 인스턴스 생성 및 초기화
  this.name = name;
}
```

흥미로운 것은 클래스가 평가되어 생성된 함수 객체나 클래스가 생성한 인스턴스 어디에도 constructor 메서드가 보이지 않는다. 이는 클래스 몸체에 정의한 constructor가 단순한 메서드가 아니라 클래스가 평가되어 생성한 함수 객체 코드의 일부가 된다.

::: info 클래스의 constructor 메서드와 프로토타입의 constructor 프로퍼티
클래스의 constructor 메서드와 프로토타입의 constructor 프로퍼티는 이름이 같아 혼동하기 쉽지만 직접적인 관련이 없다. 프로토타입의 constructor 프로퍼티는 모든 프로토타입이 가지고 있는 프로퍼티이며, 생성자 함수를 가리킨다.
:::

constructor는 생성자 함수와 유사하지만 몇가지 차이가 있다.

- 클래스 내에 최대 한 개만 존재한다. 2개 이상 포함하면 문법 에러가 발생한다.
  ```js
  class Person {
  constructor() {}
  constructor() {}
  }
  // SyntaxError: A class may only have one constructor
  ```
- 생략할 수 있다. 생략하면 빈 constructor가 암묵적으로 정의된다.

  ```js
  class Person {}
  ```

  ```js
  class Person {
    // constructor를 생략하면 다음과 같이 빈 constructor가 암묵적으로 정의된다.
    constructor() {}
  }

  // 빈 객체가 생성된다.
  const me = new Person();
  console.log(me); // Person {}
  ```

- 프로퍼티를 추가하여 초기화한 인스턴스를 생성하려면 this에 인스턴스 프로퍼티를 추가한다.

  ```js
  class Person {
    constructor() {
      // 고정값으로 인스턴스 초기화
      this.name = "Lee";
      this.address = "Seoul";
    }
  }

  // 인스턴스 프로퍼티가 추가된다.
  const me = new Person();
  console.log(me); // Person {name: "Lee", address: "Seoul"}
  ```

  ```js
  class Person {
    constructor(name, address) {
      // 인수로 인스턴스 초기화
      this.name = name;
      this.address = address;
    }
  }

  // 인수로 초기값을 전달한다. 초기값은 constructor에 전달된다.
  const me = new Person("Lee", "Seoul");
  console.log(me); // Person {name: "Lee", address: "Seoul"}
  ```

  따라서 인스턴스를 초기화하려면 constructor를 생략해서는 안된다.

- 별도의 반환문을 갖지 않아야한다. this가 아닌 다른 객체를 명시적으로 반환하면 return문에 명시한 객체가 반환

  ```js
  class Person {
    constructor(name) {
      this.name = name;

      // 명시적으로 객체를 반환하면 암묵적인 this 반환이 무시된다.
      return {};
    }
  }

  // constructor에서 명시적으로 반환한 빈 객체가 반환된다.
  const me = new Person("Lee");
  console.log(me); // {}
  ```

  하지만 원시값을 반환하면 원시값은 무시되고 암묵적으로 this가 반환된다.

  ```js
  class Person {
    constructor(name) {
      this.name = name;

      // 명시적으로 원시값을 반환하면 원시값 반환은 무시되고 암묵적으로 this가 반환된다.
      return 100;
    }
  }

  const me = new Person("Lee");
  console.log(me); // Person { name: "Lee" }
  ```

## 6. 클래스의 인스턴스 생성 과정

## 7. 프로퍼티

## 8. 상속에 의한 클래스 확장

