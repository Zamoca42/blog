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

new 연산자와 함께 클래스를 호출하면 생성자 함수와 마찬가지로 클래스의 내부 메서드 `[[Construct]]`가 호출된다. 클래스는 new 연산자 없이 호출할 수 없다.

#### 1. 인스턴스 생성과 this 바인딩

new 연산자와 함께 클래스를 호출하면 constructor와 내부 코드가 실행되기에 앞서 암묵적으로 빈 객체가 생성. 이 빈 객체가 바로 클래스가 생성한 인스턴스다.
그리고 인스턴스는 this에 바인딩 된다. 따라서 constructor 내부의 this는 클래스가 생성한 인스턴스를 가리킨다.

#### 2. 인스턴스 초기화

constructor의 내부 코드가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다.
this에 바인딩 되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티 값을 초기화한다. 만약 constructor가 생략되었다면 이 과정도 생략된다.

#### 3. 인스턴스 반환

클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

```js
class Person {
  // 생성자
  constructor(name) {
    // 1. 암묵적으로 인스턴스가 생성되고 this에 바인딩된다.
    console.log(this); // Person {}
    console.log(Object.getPrototypeOf(this) === Person.prototype); // true

    // 2. this에 바인딩되어 있는 인스턴스를 초기화한다.
    this.name = name;

    // 3. 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.
  }
}
```

## 7. 프로퍼티

### 7.1. 인스턴스 프로퍼티

인스턴스 프로퍼티는 constructor 내부에서 정의헤야 한다.

```js
class Person {
  constructor(name) {
    // 인스턴스 프로퍼티
    this.name = name; // name 프로퍼티는 public하다.
  }
}

const me = new Person("Lee");
console.log(me); // Person {name: "Lee"}
```

constructor 내부에서 this에 추가한 프로퍼티는 언제나 클래스가 생성한 인스턴스의 프로퍼티가 된다. ES6의 클래스는 private, public, protected 키워드 같은 접근 제한자를 지원하지 않아서 인스턴스 프로퍼티는 언제나 public이다.

### 7.2. 접근자 프로퍼티

접근자 프로퍼티는 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수로 구성된 프로퍼티다.

```js
const person = {
  // 데이터 프로퍼티
  firstName: "Ungmo",
  lastName: "Lee",

  // fullName은 접근자 함수로 구성된 접근자 프로퍼티다.
  // getter 함수
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  // setter 함수
  set fullName(name) {
    // 배열 디스트럭처링 할당: "36.1. 배열 디스트럭처링 할당" 참고
    [this.firstName, this.lastName] = name.split(" ");
  },
};

// 데이터 프로퍼티를 통한 프로퍼티 값의 참조.
console.log(`${person.firstName} ${person.lastName}`); // Ungmo Lee

// 접근자 프로퍼티를 통한 프로퍼티 값의 저장
// 접근자 프로퍼티 fullName에 값을 저장하면 setter 함수가 호출된다.
person.fullName = "Heegun Lee";
console.log(person); // {firstName: "Heegun", lastName: "Lee"}

// 접근자 프로퍼티를 통한 프로퍼티 값의 참조
// 접근자 프로퍼티 fullName에 접근하면 getter 함수가 호출된다.
console.log(person.fullName); // Heegun Lee

// fullName은 접근자 프로퍼티다.
// 접근자 프로퍼티는 get, set, enumerable, configurable 프로퍼티 어트리뷰트를 갖는다.
console.log(Object.getOwnPropertyDescriptor(person, "fullName"));
// {get: ƒ, set: ƒ, enumerable: true, configurable: true}
```

접근자 프로퍼티는 클래스에서도 사용할 수 있다. 위 예제는 객체 리터럴을 클래스로 표현하면 다음과 같다.

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  // fullName은 접근자 함수로 구성된 접근자 프로퍼티다.
  // getter 함수
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  // setter 함수
  set fullName(name) {
    [this.firstName, this.lastName] = name.split(" ");
  }
}

const me = new Person("Ungmo", "Lee");

// 데이터 프로퍼티를 통한 프로퍼티 값의 참조.
console.log(`${me.firstName} ${me.lastName}`); // Ungmo Lee

// 접근자 프로퍼티를 통한 프로퍼티 값의 저장
// 접근자 프로퍼티 fullName에 값을 저장하면 setter 함수가 호출된다.
me.fullName = "Heegun Lee";
console.log(me); // {firstName: "Heegun", lastName: "Lee"}

// 접근자 프로퍼티를 통한 프로퍼티 값의 참조
// 접근자 프로퍼티 fullName에 접근하면 getter 함수가 호출된다.
console.log(me.fullName); // Heegun Lee

// fullName은 접근자 프로퍼티다.
// 접근자 프로퍼티는 get, set, enumerable, configurable 프로퍼티 어트리뷰트를 갖는다.
console.log(Object.getOwnPropertyDescriptor(Person.prototype, "fullName"));
// {get: ƒ, set: ƒ, enumerable: false, configurable: true}
```

접근자 프로퍼티는 자체적으로는 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수, 즉 getter와 setter 함수로 구성되어 있다.

getter는 호출하는 것이 아니라 참조하는 형식으로 사용되며 무언가 취득할 때 사용하므로 반드시 무언가를 반환해야한다.

setter는 무언가를 프로퍼티에 할당해야할 때 사용하므로 반드시 매개변수가 있어야한다.
setter는 단 하나의 값만 할당받기 때문에 단 하나의 매개변수만 선언할 수 있다.

클래스의 메서드는 기본적으로 프로토타입 메서드가 된다. 따라서 클래스의 접근자 프로퍼티 또한 인스턴스 프로퍼티가 아닌 프로토타입의 프로퍼티가 된다.

```js
// Object.getOwnPropertyNames는 비열거형(non-enumerable)을 포함한 모든 프로퍼티의 이름을 반환한다.(상속 제외)
Object.getOwnPropertyNames(me); // -> ["firstName", "lastName"]
Object.getOwnPropertyNames(Object.getPrototypeOf(me)); // -> ["constructor", "fullName"]
```

![그림 25-6. 클래스의 접근자 프로퍼티는 프로토타입 프로퍼티다.](https://github.com/Zamoca42/blog/assets/96982072/b8ed0bd6-dc79-49c7-a9aa-8468ae8a4c76)

### 7.3. 클래스 필드 정의 제안

클래스 필드는 클래스 기반 객체지향 언어에서 클래스가 생성할 인스턴스의 프로퍼티를 가리키는 용어다. 클래스 기반 객체지향 언어인 자바의 클래스 정의를 살펴보자.
자바의 클래스 필드는 마치 클래스 내부에서 변수처럼 사용된다.

```java
// 자바의 클래스 정의
public class Person {
  // ① 클래스 필드 정의
  // 클래스 필드는 클래스 몸체에 this 없이 선언해야 한다.
  private String firstName = "";
  private String lastName = "";

  // 생성자
  Person(String firstName, String lastName) {
    // ③ this는 언제나 클래스가 생성할 인스턴스를 가리킨다.
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getFullName() {
    // ② 클래스 필드 참조
    // this 없이도 클래스 필드를 참조할 수 있다.
    return firstName + " " + lastName;
  }
}
```

자바스크립트의 클래스에서 인스턴스 프로퍼티를 선언하고 초기화하려면 반드시 constructor 내부에서 this에 프로퍼티를 추가해야 한다.
하지만 자바의 클래스에서는 위 에제 ①과 같이 클래스 필드를 마치 변수처럼 클래스 몸체에 this 없이 선언한다.

```js
class Person {
  // 클래스 필드 정의
  name = "Lee";
}

const me = new Person("Lee");
```

#### 4. private 필드 정의 제안

2021년 1월 TC39 프로세스에서는 private 필드를 정의할 수 있는 새로운 표준 사양이 제안되어 있다.
private 필드의 선두에 #을 붙여주는 것이다.

```js
class Person {
  // private 필드 정의
  #name = "";

  constructor(name) {
    // private 필드 참조
    this.#name = name;
  }
}

const me = new Person("Lee");

// private 필드 #name은 클래스 외부에서 참조할 수 없다.
console.log(me.#name);
// SyntaxError: Private field '#name' must be declared in an enclosing class
```

::: info 타입스크립트
C#의 창시자인 덴마크 출신 소프트웨어 엔지니어 아네르스 하일스베르가 개발을 주도한 자바스크립트의 상위 확장인 타입스크립트는 클래스 기반 객체지향 언어가 지원하는 접근 제한자인 public, private, protected를 모두 지원하며, 의미 또한 동일하다.
:::

private 필드는 클래스 내부에서만 참조할 수 있다.

| 접근 가능성                 | public | private |
| --------------------------- | :----: | :-----: |
| 클래스 내부                 |  :O:   |   :O:   |
| 자식 클래스 내부            |  :O:   |   :X:   |
| 클래스 인스턴스를 통한 접근 |  :O:   |   :X:   |

```js
class Person {
  // private 필드 정의
  #name = '';

  constructor(name) {
    this.#name = name;
  }

  // name은 접근자 프로퍼티다.
  get name() {
    // private 필드를 참조하여 trim한 다음 반환한다.
    return this.#name.trim();
  }
}

const me = new Person(' Lee ');
console.log(me.name); // Lee
```

private 필드는 반드시 클래스 몸체에 정의해야한다. 직접 constructor에 정의하면 에러가 발생한다.

```js
class Person {
  constructor(name) {
    // private 필드는 클래스 몸체에서 정의해야 한다.
    this.#name = name;
    // SyntaxError: Private field '#name' must be declared in an enclosing class
  }
}
```

## 8. 상속에 의한 클래스 확장

### 8.1. 클래스 상속과 생성자 함수 상속

상속에 의한 클래스 확장은 기존 클래스를 상속받아 새로운 클래스를 확장하여 정의하는 것이다.

![그림 25-7. 상속에 의한 클래스 확장](https://github.com/Zamoca42/blog/assets/96982072/49c548f1-2201-4a4e-bb40-0666ba761f37)

![그림 25-8. 클래스 상속을 통해 속성을 상속 받는다](https://github.com/Zamoca42/blog/assets/96982072/9f8e7328-39b7-4f8e-bd47-4ab8b889f6d5)

Bird 클래스와 Lion 클래스는 상속을 통해 Animal 클래스의 속성을 그대로 사용하고 자신만의 고유한 속성을 추가하여 확장했다.
이처럼 상속에 의한 클래스 확장은 코드 재사용 관점에서 유용하다.

```js
class Animal {
  constructor(age, weight) {
    this.age = age;
    this.weight = weight;
  }

  eat() { return 'eat'; }

  move() { return 'move'; }
}

// 상속을 통해 Animal 클래스를 확장한 Bird 클래스
class Bird extends Animal {
  fly() { return 'fly'; }
}

const bird = new Bird(1, 5);

console.log(bird); // Bird {age: 1, weight: 5}
console.log(bird instanceof Bird); // true
console.log(bird instanceof Animal); // true

console.log(bird.eat());  // eat
console.log(bird.move()); // move
console.log(bird.fly());  // fly
```

상속에 의해 확장된 클래스 Bird를 통해 생성된 인스턴스의 프로토타입 체인은 다음과 같다.

![그림 25-9. 상속에 의해 확장된 클래스 Bird에 의해 생성된 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/028f37c2-db28-4300-bd7f-c043938b1b2d)

### super 키워드

super 키워드는 함수처럼 호출할 수도 있고 this와 같이 식별자처럼 참조할 수 있는 특수한 키워드다.

- super를 함수처럼 호출하면 수퍼클래스의 constructor를 호출한다.
- super를 참조하면 수퍼클래스의 메서드를 호출한다.

### 상속 클래스의 인스턴스 생성 과정

```js
// 수퍼클래스
class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  toString() {
    return `width = ${this.width}, height = ${this.height}`;
  }
}

// 서브클래스
class ColorRectangle extends Rectangle {
  constructor(width, height, color) {
    super(width, height);
    this.color = color;
  }

  // 메서드 오버라이딩
  toString() {
    return super.toString() + `, color = ${this.color}`;
  }
}

const colorRectangle = new ColorRectangle(2, 4, 'red');
console.log(colorRectangle); // ColorRectangle {width: 2, height: 4, color: "red"}

// 상속을 통해 getArea 메서드를 호출
console.log(colorRectangle.getArea()); // 8
// 오버라이딩된 toString 메서드를 호출
console.log(colorRectangle.toString()); // width = 2, height = 4, color = red
```

![그림 25-11. ColorRectagle 클래스에 의해 생성된 인스턴스의 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/00fc6a55-ea0a-4e28-9d4a-18caa01f89f3)

서브클래스 ColorRectangle이 new 연산자와 함께 호출되면 다음 과정을 통해 인스턴스를 생성한다.

1. 서브클래스는 자신이 직접 인스턴스를 생성하지 않고 수퍼클래스에게 인스턴스 생성을 위임한다. 이것이 서브클래스에서 super를 호출하는 이유다.

2. 수퍼클래스의 인스턴스 생성과 this 바인딩

3. 수퍼클래스의 인스턴스 초기화

4. 서브클래스 constructor로의 복귀와 this 바인딩

5. 서브클래스의 인스턴스 초기화

6. 인스턴스 반환