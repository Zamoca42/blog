---
title: 19. 프로토타입
---

자바스크립트는 명령형, 함수형, 프로토타입 기반 객체지향 프로그래밍을 지원하는 멀티 패러다임 프로그래밍 언어다.
클래스 기반 객체지향 프로그래밍 언어보다 효율적이며 더 강력한 객체지향 프로그래밍 능력을 지니고 있는 프로토타입 기반의 객체지향 프로그래밍언어다.

:::info 클래스(class)
ES6에서 클래스가 도입되었다. 하지만 ES6의 클래스가 기존 프로토타입 기반 객체지향 모델을 폐지하고 새로운 객체지향 모델을 제공하는 것은 아니다. 사실 클래스도 함수이며, 기존 프로토타입 기반 패턴의 문법적 설탕이라고 볼 수 있다.

클래스와 생성자 함수는 모두 프로토타입 기반의 인스턴스를 생성하지만 정확히 동일하게 동작하지는 않는다.
클래스는 생성자 함수보다 엄격하며 클래스는 생성자 함수에서는 제공하지 않는 기능도 제공한다.

따라서 클래스를 프로토타입 기반 객체 생성패턴의 단순한 문법적 설탕으로 보기보다는 **새로운 객체 생성 메커니즘**으로 보는것이 좀 더 합당하다고 할 수 있다.

클래스에 대해서는 25장 "클래스"에서 자세히 살펴보자.
:::

자바스크립트는 객체 기반의 프로그래밍 언어이며 **자바스크립트를 이루고 있는 거의 "모든 것"이 객체다.**
원시 타입의 값을 제외한 나머지 값들(함수, 배열, 정규 표현식 등)은 모두 객체다.

## 1. 객체지향 프로그래밍

객체지향 프로그래밍은 프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 명령형 프로그래밍의 절자지향적 관점에서 벗어나 여러 개의 독립적 단위, 즉 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임을 말한다.

객체지향 프로그래밍은 실세계의 실체(사물이나 개념)를 인식하는 철학적 사고를 프로그래밍에 접목하려는 시도에서 시작한다. 실체는 특징이나 성질을 나타내는 **속성**(attribute/property)을 가지고 있고, 이를 통해 실체를 인식하거나 구별할 수 있다.

예를 들어, 사람은 이름, 주소, 나이, 직업 등 다양한 속성을 갖는다.
이때 "이름이 아무개이고 성별은 여성이며 나이는 20세인 사람"과 같이 속성을 구체적으로 표현하면 특정한 사람을 다른 사람과 구별하여 인식할 수 있다.

이러한 방식을 프로그래밍에 접목시켜보자. 사람에게는 다양한 속성이 있으나 우리가 구현하려는 프로그램에서는 사람의 "이름"과 "주소"라는 속성에만 관심이 있다고 가정하자. 이처럼 다양한 속성 중에서 프로그램에 필요한 속성만 간추려 내어 표현하는 것을 **추상화**(abstraction)라 한다.

"이름"과 "주소"라는 속성을 갖는 person이라는 객체를 자바스크립트로 표현하면 다음과 같다.

```js
// 이름과 주소 속성을 갖는 객체
const person = {
  name: "Lee",
  address: "Seoul",
};

console.log(person); // {name: "Lee", address: "Seoul"}
```

이때 프로그래머(subject, 주체)는 이름과 주소 속성으로 표현된 객체(object)인 person을 다른 객체와 구별하여 인식할 수 있다. 이처럼 **속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조**를 객체라 하며, 객체지향 프로그래밍은 독립적인 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임이다.

이번에는 원(Circle)이라는 개념을 객체로 만들어보자. 원에는 반지름이라는 속성이 있다. 이 반지름을 가지고 원의 지름, 둘레, 넓이를 구할 수 있다. 이때 반지름은 원의 상태를 나타내는 데이터이며 원의 지름, 둘레, 넓이를 구하는 것은 동작이다.

```js
const circle = {
  radius: 5, // 반지름

  // 원의 지름: 2r
  getDiameter() {
    return 2 * this.radius;
  },

  // 원의 둘레: 2πr
  getPerimeter() {
    return 2 * Math.PI * this.radius;
  },

  // 원의 넓이: πrr
  getArea() {
    return Math.PI * this.radius ** 2;
  },
};

console.log(circle);
// {radius: 5, getDiameter: ƒ, getPerimeter: ƒ, getArea: ƒ}

console.log(circle.getDiameter()); // 10
console.log(circle.getPerimeter()); // 31.41592653589793
console.log(circle.getArea()); // 78.53981633974483
```

이처럼 객체지향 프로그래밍은 객체의 **상태**를 나타내는 데이터와 상태 데이터를 조작할 수 있는 **동작**을 하나의 논리적인 단위로 묶어 생각한다. 따라서 객체는 **상태 데이터와 동작을 하나의 논리적인 단위로 묶은 복합적인 자료구조**라고 할 수 있다. 이때 객체의 상태 데이터를 프로퍼티(property), 동작을 메서드(method)라 부른다.

## 2. 상속과 프로토타입

상속(inheritance)은 객체지향 프로그래밍의 핵심 개념으로, 어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는 것을 말한다.
자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거한다. 중복을 제거하는 방법은 기존의 코드를 적극적으로 재사용하는 것이다.

```js
// 생성자 함수
function Circle(radius) {
  this.radius = radius;
  this.getArea = function () {
    // Math.PI는 원주율을 나타내는 상수다.
    return Math.PI * this.radius ** 2;
  };
}

// 반지름이 1인 인스턴스 생성
const circle1 = new Circle(1);
// 반지름이 2인 인스턴스 생성
const circle2 = new Circle(2);

// Circle 생성자 함수는 인스턴스를 생성할 때마다 동일한 동작을 하는
// getArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
// getArea 메서드는 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.
console.log(circle1.getArea === circle2.getArea); // false

console.log(circle1.getArea()); // 3.141592653589793
console.log(circle2.getArea()); // 12.566370614359172
```

`Circle` 생성자 함수가 생성하는 모든 객체(인스턴스)는 `radius` 프로퍼티와 `getArea` 메서드를 갖는다.
`radius` 프로퍼티 값은 일반적으로 인스턴스마다 다르다.
하지만 `getArea` 메서드는 모든 인스턴스가 동일한 내용의 메서드를 사용하므로 단 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.
`Circle` 생성자 함수는 인스턴스를 생성할 때마다 `getArea` 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.

![그림 19-1. 메서드 중복 생성](https://github.com/Zamoca42/blog/assets/96982072/61aeff06-7651-449c-92df-929f689eccfe)

이처럼 동일한 생성자 함수에 의해 생성된 모든 인스턴스가 동일한 메서드를 중복 소유하는 것은 메모리를 불필요하게 낭비한다.
상속을 통해 불필요한 중복을 제거해보자. **자바스크립트는 프로토타입을 기반으로 상속을 구현한다.**

```js
// 생성자 함수
function Circle(radius) {
  this.radius = radius;
}

// Circle 생성자 함수가 생성한 모든 인스턴스가 getArea 메서드를
// 공유해서 사용할 수 있도록 프로토타입에 추가한다.
// 프로토타입은 Circle 생성자 함수의 prototype 프로퍼티에 바인딩되어 있다.
Circle.prototype.getArea = function () {
  return Math.PI * this.radius ** 2;
};

// 인스턴스 생성
const circle1 = new Circle(1);
const circle2 = new Circle(2);

// Circle 생성자 함수가 생성한 모든 인스턴스는 부모 객체의 역할을 하는
// 프로토타입 Circle.prototype으로부터 getArea 메서드를 상속받는다.
// 즉, Circle 생성자 함수가 생성하는 모든 인스턴스는 하나의 getArea 메서드를 공유한다.
console.log(circle1.getArea === circle2.getArea); // true

console.log(circle1.getArea()); // 3.141592653589793
console.log(circle2.getArea()); // 12.566370614359172
```

![그림 19-2. 상속에 의한 메서드 공유](https://github.com/Zamoca42/blog/assets/96982072/2e28ebe4-b7ae-404c-b232-0a89df2cfb74)

`Circle` 생성자 함수가 생성한 모든 인스턴스는 자신의 프로토타입, 즉 상위(부모) 객체 역할을 하는 `Circle.prototype`의 모든 프로퍼티와 메서드를 상속받는다.

`getArea` 메서드는 단 하나만 생성되어 프로토타입인 `Circle.prototype`의 메서드로 할당되어 있다. 따라서 `Circle` 생성자 함수가 생성하는 모든 인스턴스는 `getArea` 메서드를 상속받아 사용할 수 있따.
즉, 자신의 상태를 나타내는 `radius` 프로퍼티만 개별적으로 소유하고 내용이 동일한 메서드는 상속을 통해 공유하여 사용하는 것이다.

상속은 코드의 재사용이란 관점에서 유용하다.

## 3. 프로토타입 객체

프로토타입 객체란 객체지향 프로그래밍의 근간을 이루는 객체 간 상속을 구현하기 위해 사용된다.
프로토타입은 어떤 객체의 상위(부모) 객체의 역할ㄹ을 하는 객체로서 다른 객체에 공유 프로퍼티를 제공한다.

모든 객체는 `[[Prototype]]`이라는 내부 슬롯을 가지며, 이 내부 슬롯의 값은 프로토타입의 참조다.
`[[Prototype]]`에 저장되는 프로토타입은 객체 생성 방식에 의해 결정된다.
즉, 객체가 생성될 때 객체 생성 방식에 따라 프로토타입이 결정되고 `[[Prototype]]`에 저장된다.

모든 객체는 하나의 프로토타입을 갖는다. 그리고 모든 프로토타입은 생성자 함수와 연결되어 있다.

![그림 19-3. 객체와 프로토타입과 생성자 함수는 서로 연결되어 있다.](https://github.com/Zamoca42/blog/assets/96982072/acf4b8a2-7f4a-478e-9063-896927d4877d)

### 3.1. `__proto__` 접근자 프로퍼티

모든 객체는 `__proto__`접근자 프로퍼티를 통해 자신의 프로토타입, 즉 `[[Prototype]]`내부 슬롯에 간접적으로 접근할 수 있다.

```js
const person = { name: "Lee" };
```

![그림 19-4. 크롬 브라우저의 콘솔에서 출력한 객체의 프로퍼티](https://github.com/Zamoca42/blog/assets/96982072/9f6d5f1c-f928-4daa-8f65-00112ce96040)

#### `__proto__`는 접근자 프로퍼티다.

내부 슬롯은 프로퍼티가 아니다. 따라서 원칙적으로 내부 슬롯과 내부 메서드에 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지 않는다.
`[[Prototype]]` 내부 슬롯에도 직접 접근할 수 없으며 `__proto__`접근자 프로퍼티를 통해 간접적으로 프로토타입에 접근할 수 있다.

![그림 19-5. `Object.Prototype.__proto__`는 접근자 프로퍼티다.](https://github.com/Zamoca42/blog/assets/96982072/05af1aa0-d2b2-4ec0-b998-abf761e1208c)

`__proto__` 접근자 프로퍼티를 통해 새로운 프로토타입을 할당하면 `__proto__` 접근자 프로퍼티의 setter 함수인 `[[Set]]`이 호출된다.

```js
const obj = {};
const parent = { x: 1 };

// getter 함수인 get **proto**가 호출되어 obj 객체의 프로토타입을 취득
obj.**proto**;
// setter함수인 set **proto**가 호출되어 obj 객체의 프로토타입을 교체
obj.**proto** = parent;

console.log(obj.x); // 1
```

#### `__proto__` 접근자 프로퍼티는 상속을 통해 사용된다.

`__proto__`접근자 프로퍼티는 객체가 직접 소유하는 프로퍼티가 아니라 `Object.prototype`의 프로퍼티다.
모든 객체는 상속을 통해 `Object.prototype.__proto__` 접근자 프로퍼티를 사용할 수 있다.

```js
const person = { name: "Lee" };

// person 객체는 __proto__ 프로퍼티를 소유하지 않는다.
console.log(person.hasOwnProperty("__proto__")); // false

// __proto__ 프로퍼티는 모든 객체의 프로토타입 객체인 Object.prototype의 접근자 프로퍼티다.
console.log(Object.getOwnPropertyDescriptor(Object.prototype, "__proto__"));
// {get: ƒ, set: ƒ, enumerable: false, configurable: true}

// 모든 객체는 Object.prototype의 접근자 프로퍼티 __proto__를 상속받아 사용할 수 있다.
console.log({}.__proto__ === Object.prototype); // true
```

::: info Object.prototype
모든 객체는 프로토타입의 계층 구조인 프로토타입 체인에 묶여 있다. 자바스크립트 엔진은 객체의 프로퍼티에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 `__proto__` 접근자 프로퍼티가 가리키는 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다.

프로토타입 체인의 종점, 즉 프로토타입 체인의 최상위 객체는 Object.prototype이며, 이 객체의 프로퍼티와 메서드는 모든 객체에 상속된다.

이는 19.7절 "프로토타입 체인"에서 자세히 살펴보도록 하자.
:::

#### `__proto__` 접근자 프로퍼티를 통해 프로토타입에 접근하는 이유

`[[Prototype]]` 내부 슬롯의 값, 즉 프로토타입에 접근하기 위해 접근자 프로퍼티를 사용하는 이유는 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지하기 위해서다.

```js
const parent = {};
const child = {};

// child의 프로토타입을 parent로 설정
child.__proto__ = parent;
// parent의 프로토타입을 child로 설정
parent.__proto__ = child; // TypeError: Cyclic __proto__ value
```

위 예제에서는 parent 객체를 child 객체의 프로토타입으로 설정한 후, child 객체를 parent 객체의 프로토타입으로 설정했다.
이러한 코드가 에러 없이 정상적으로 처리되면 서로가 자신의 프로토타입이 되는 비정상적인 프로토타입 체인이 만들어지기 때문에 `__proto__` 접근자 프로퍼티는 에러를 발생시킨다.

![그림 19-6. 서로가 자신의 프로토타입이 되는 비정상적인 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/16c534b9-92f5-4c1e-94de-033bb7e9254f)

프로토타입 체인 방향은 단방향 링크드 리스크로 구현되어야 한다. 즉, 프로퍼티 검색 방향이 한쪽 방향으로 흘러가야한다. 하지만 위 그림과 같이 서로가 자신의 프로토타입이 되는 비정상적인 프로토타입 체인, 다시 말해 순환 참조(circular reference)하는 프로토타입 체인이 만들어지면 프로토타입 체인 종점이 존재하지 않기 때문에 프로토타입 체인에서 프로퍼티를 검색할 때 무한 루프에 빠진다.

#### `__proto__` 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않는다.

코드 내에서 `__proto__` 접근자 프로퍼티를 직접 사용하는 것은 권장하지 않는다. 모든 객체가 `__proto__` 접근자 프로퍼티를 사용할 수 있는 것은 아니기 때문이다. 나중에 살펴보겠지만 직접 상속을 통해 다음과 같이 `Object.prototype`을 상속받지 않는 객체를 생성할 수도 있기 때문에 `__proto__` 접근자 프로퍼티를 사용할 수 없는 경우가 있다.

```js
// obj는 프로토타입 체인의 종점이다. 따라서 Object.__proto__를 상속받을 수 없다.
const obj = Object.create(null);

// obj는 Object.__proto__를 상속받을 수 없다.
console.log(obj.__proto__); // undefined

// 따라서 __proto__보다 Object.getPrototypeOf 메서드를 사용하는 편이 좋다.
console.log(Object.getPrototypeOf(obj)); // null
```

따라서 `__proto__` 접근자 프로퍼티 대신 프로토타입의 참조를 취득하고 싶은 경우에는 `Object.getPrototypeOf` 메서드를 사용하고, 프로토타입을 교체하고 싶은 경우에는 `Object.setPrototypeOf` 메서드를 사용할 것을 권장한다.

```js
const obj = {};
const parent = { x: 1 };

// obj 객체의 프로토타입을 취득
Object.getPrototypeOf(obj); // obj.__proto__;
// obj 객체의 프로토타입을 교체
Object.setPrototypeOf(obj, parent); // obj.__proto__ = parent;

console.log(obj.x); // 1
```

`Object.getPrototypeOf` 메서드와 `Object.setPrototypeOf` 메서드는 `get Object.prototype.__proto__`와 `set Object.prototype.__proto__`의 처리 내용과 정확히 일치한다.

### 3.2. 함수 객체의 prototype 프로퍼티

함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 생성할 인스턴스의 프로토타입을 가리킨다.

```js
// 함수 객체는 prototype 프로퍼티를 소유한다.
(function () {}).hasOwnProperty("prototype"); // -> true

// 일반 객체는 prototype 프로퍼티를 소유하지 않는다.
({}).hasOwnProperty("prototype"); // -> false
```

prototype 프로퍼티는 생성자 함수가 생성할 객체(인스턴스)의 프로토타입을 가리킨다.
따라서 생성자 함수로서 호출할 수 없는 함수, 즉 non-constructor인 화살표 함수와 ES6 메서드 축약 표현으로 정의한 메서드는 prototype 프로퍼티를 소유하지 않으며 프로토타입도 생성하지 않는다.

```js
// 화살표 함수는 non-constructor다.
const Person = (name) => {
  this.name = name;
};

// non-constructor는 prototype 프로퍼티를 소유하지 않는다.
console.log(Person.hasOwnProperty("prototype")); // false

// non-constructor는 프로토타입을 생성하지 않는다.
console.log(Person.prototype); // undefined

// ES6의 메서드 축약 표현으로 정의한 메서드는 non-constructor다.
const obj = {
  foo() {},
};

// non-constructor는 prototype 프로퍼티를 소유하지 않는다.
console.log(obj.foo.hasOwnProperty("prototype")); // false

// non-constructor는 프로토타입을 생성하지 않는다.
console.log(obj.foo.prototype); // undefined
```

모든 객체가 가지고 있는 `__proto__` 접근자 프로퍼티와 함수 객체만이 가지고 있는 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킨다.

| 구분                             | 소유        | 사용 주체   | 사용 목적                                                              |
| :------------------------------- | :---------- | :---------- | :--------------------------------------------------------------------- |
| `__proto__` <br> 접근자 프로퍼티 | 모든 객체   | 모든 객체   | 객체가 자신의 포로토타입에 접근 <br>또는 교체하기 위해 사용            |
| prototype <br> 프로퍼티          | constructor | 생성자 함수 | 생성자 함수가 자신이 생성할 객체의 <br>프로토타입을 할당하기 위해 사용 |

생성자 함수로 객체를 생성한 후 `__proto__` 접근자 프로퍼티와 prototype 프로퍼티로 프로토타입 객체에 접근해보자.

```js
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 결국 Person.prototype과 me.__proto__는 결국 동일한 프로토타입을 가리킨다.
console.log(Person.prototype === me.__proto__); // true
```

![그림 19-7. 객체의 __proto__ 접근자 프로퍼티와 함수 객체의 prototype 프로퍼티는 결구 동일한 프로토타입을 가리킨다.](https://github.com/Zamoca42/blog/assets/96982072/f0ebfda7-7532-4a04-bd79-19f1fc4bc9dc)

### 3.3. 프로토타입의 constructor 프로퍼티와 생성자 함수

모든 프로토타입은 constructor 프로퍼티를 갖는다. 이 constructor 프로퍼티는 prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킨다.
이 연결은 생성자 함수가 생성될 때, 즉 함수 객체가 생성될 때 이뤄진다.

```js
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// me 객체의 생성자 함수는 Person이다.
console.log(me.constructor === Person); // true
```

![그림 19-8. 프로토타입의 constructor 프로퍼티](https://github.com/Zamoca42/blog/assets/96982072/2a448388-1f1c-4da8-8531-46d46717308d)

위 예제에서 `Person` 생성자 함수는 `me` 객체를 생성했다. 이때 `me` 객체는 프로토타입의 constructor 프로퍼티를 통해 생성자 함수와 연결된다.
`me` 객체에는 constructor 프로퍼티가 없지만 `me` 객체의 프로토타입인 `Person.prototype`에는 constructor 프로퍼티가 있다.
따라서 `me` 객체는 프로토타입인 `Person.prototype`의 constructor 프로퍼티를 상속받아 사용할 수 있다.

## 4. 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

생성자 함수에 의해 생성된 인스턴스는 프로토타입의 constructor 프로퍼티에 의해 생성자 함수와 연결된다.
이때 constructor 프로퍼티가 가리키는 생성자 함수는 인스턴스를 생성한 생성자 함수다.

```js
// obj 객체를 생성한 생성자 함수는 Object다.
const obj = new Object();
console.log(obj.constructor === Object); // true

// add 함수 객체를 생성한 생성자 함수는 Function이다.
const add = new Function("a", "b", "return a + b");
console.log(add.constructor === Function); // true

// 생성자 함수
function Person(name) {
  this.name = name;
}

// me 객체를 생성한 생성자 함수는 Person이다.
const me = new Person("Lee");
console.log(me.constructor === Person); // true
```

하지만 리터럴 표기법에 의한 객체 생성 방식과 같이 명시적으로 new 연산자와 함께 생성자 함수를 호출하여 인스턴스를 생성하지 않는 객체 생성 방식도 있다.

```js
// 객체 리터럴
const obj = {};

// 함수 리터럴
const add = function (a, b) {
  return a + b;
};

// 배열 리터럴
const arr = [1, 2, 3];

// 정규표현식 리터럴
const regexp = /is/gi;
```

리터럴 표기법에 의해 생성된 객체도 물론 프로토타입이 존재한다. 하지만 리터럴 표기법에 의해 생성된 객체의 경우 프로토타입의 constructor 프로퍼티가 가리키는 생성자 함수가 반드시 객체를 생성한 생성자 함수라고 단정할 수 없다.

```js
// obj 객체는 Object 생성자 함수로 생성한 객체가 아니라 객체 리터럴로 생성했다.
const obj = {};

// 하지만 obj 객체의 생성자 함수는 Object 생성자 함수다.
console.log(obj.constructor === Object); // true
```

위 예제의 obj객체는 Object 생성자 함수로 생성한 객체가 아니라 객체 리터럴에 의해 생성된 객체다.
하지만 obj 객체는 Object 생성자 함수와 constructor 프로퍼티로 연결되어 있다.
그렇다면 객체 리터럴에 의해 생성된 객체는 사실 Object 생성자 함수로 생성되는 것은 아닐까?
ECMAScript 사양을 살펴보자. Object 생성자 함수는 다음과 같이 구현하도록 정의되어 있다.

![그림 19-9. Object 생성자 함수](https://github.com/Zamoca42/blog/assets/96982072/483e444b-15c1-4186-a5e0-bb89955bbb08)

2에서 Object 생성자 함수에 인수를 전달하지 않거나 `undefined` 또는 `null`을 인수로 전달하면서 호출하면 내부적으로는 추상 연산 `OrdinaryObjectCreate`를 호출하여 `Object.prototype`을 프로토타입으로 갖는 빈 객체를 생성한다.

:::info 추상 연산(abstract operation)
추상 연산은 ECMAScript 사양에서 내부 동작의 구현 알고리즘을 표현한 것이다. ECMAScript 사양에서 설명을 위해 사용되는 함수와 유사한 의사코드라고 이해하자.
:::

```js
// 2. Object 생성자 함수에 의한 객체 생성
// 인수가 전달되지 않았을 때 추상 연산 OrdinaryObjectCreate를 호출하여 빈 객체를 생성한다.
let obj = new Object();
console.log(obj); // {}

// 1. new.target이 undefined나 Object가 아닌 경우
// 인스턴스 -> Foo.prototype -> Object.prototype 순으로 프로토타입 체인이 생성된다.
class Foo extends Object {}
new Foo(); // Foo {}

// 3. 인수가 전달된 경우에는 인수를 객체로 변환한다.
// Number 객체 생성
obj = new Object(123);
console.log(obj); // Number {123}

// String  객체 생성
obj = new Object("123");
console.log(obj); // String {"123"}
```

객체 리터럴이 평가될 때는 다음과 같이 추상 연산 `OrdinaryObjectCreate`를 호출하여 빈 객체를 생성하고 프로퍼티를 추가하도록 정의되어 있다.

![그림 19-10. 객체 리터럴의 평가](https://github.com/Zamoca42/blog/assets/96982072/20310990-944c-4dbd-86dd-645809f00e0f)

이처럼 Object 생성자 함수 호출과 객체 리터럴의 평가는 추상 연산 `OrdinaryObjectCreate`를 호출하여 빈 객체를 생성하는 점에서 동일하나 `new.target`의 확인이나 프로퍼티를 추가하는 처리 등 세부 내용은 다르다.

따라서 객체 리터럴에 의해 생성된 객체는 Object 생성자 함수가 생성한 객체가 아니다.

함수 객체의 경우 차이가 더 명확하다. 함수 선언문과 함수 표현식을 평가하여 함수 객체를 생성한 것은 Function 생성자 함수가 아니다. 하지만 constructor 프로퍼티를 통해 확인해보면 foo 생성자 함수는 Function 생성자 함수다.

```js
// foo 함수는 Function 생성자 함수로 생성한 함수 객체가 아니라 함수 선언문으로 생성했다.
function foo() {}

// 하지만 constructor 프로퍼티를 통해 확인해보면 함수 foo의 생성자 함수는 Function 생성자 함수다.
console.log(foo.constructor === Function); // true
```

프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍(pair)으로 존재한다.
리터럴 표기법(객체, 함수, 배열, 정규표현식)에 의해 생성된 객체는 생성자 함수에 의해 생성된 객체는 아니다. 하지만 큰 틀에서 생각해 보면 리터럴 표기법으로 생성한 객체도 생성자 함수로 생성한 객체의 본질적인 면에서 큰 차이는 없다.

프로토타입의 constructor 프로퍼티를 통해 연결되어 있는 생성자 함수를 리터럴 표기법으로 생성한 객체를 생성한 생성자 함수로 생각해도 크게 무리는 없다. 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입은 다음과 같다.

| 리터럴 표기법 | 생성자 함수 | 프로토타입         |
| :------------ | :---------- | :----------------- |
| 객체          | Object      | Object.prototype   |
| 함수          | Function    | Function.prototype |
| 배열          | Array       | Array.prototype    |
| 정규 표현식   | RegExp      | RegExp.prototype   |

## 5. 프로토타입의 생성 시점

리터럴 표기법에 의해 생성된 객체도 생성자 함수와 연결되는 것을 살펴보았다.
객체는 리터럴 표기법 또는 생성자 함수에 의해 생성되므로 결국 모든 객체는 생성자 함수와 연결되어 있다.

:::info Object.create 메서드와 클래스에 의한 객체 생성
아직 살펴보지 않았지만 Object.create 메서드와 클래스로 객체를 생성하는 방법도 있다.
Object.create 메서드와 클래스로 생성한 객체도 생성자 함수와 연결되어 있다. 이에 대해서는 19.11.1절 "Object.create"에 의한 직접 상속"과 25장 "클래스"에서 살펴보도록 하자.
:::

**프로토타입은 생성자 함수가 생성되는 시점에 더불어 생성된다.**
생성자 함수는 사용자가 직접 정의한 사용자 정의 생성자 함수와 자바스크립트가 기본 제공하는 빌트인 생성자로 구분할 수 있다. 프로토타입 생성 시점에 대해 살펴보자.

### 5.1. 사용자 정의 생성자 함수와 프로토타입 생성 시점

화살표 함수나 ES6의 메서드 축약 표현으로 정의하지 않고 일반 함수로 정의한 함수 객체는 new연산자와 함께 생성자 함수로서 호출할 수 있다.

생성자 함수로서 호출할 수 있는 함수. 즉 constructor는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.

```js
// 함수 정의(constructor)가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.
console.log(Person.prototype); // {constructor: ƒ}

// 생성자 함수
function Person(name) {
  this.name = name;
}
```

생성자 함수로서 호출할 수 없는 함수, 즉 non-constructor는 프로토타입이 생성되지 않는다.

```js
// 화살표 함수는 non-constructor다.
const Person = (name) => {
  this.name = name;
};

// non-constructor는 프로토타입이 생성되지 않는다.
console.log(Person.prototype); // undefined
```

생성된 프로토타입은 Person 생성자 함수의 prototype 프로퍼티에 바인딩된다. Person 생성자 함수와 더불어 생성된 프로토타입의 내부를 살펴보자.

![그림 19-11. 생성자 함수와 더불어 생성된 프로토타입](https://github.com/Zamoca42/blog/assets/96982072/030f2b84-54a0-4d8f-a473-237e6c31f514)

생성된 프로토타입은 오직 constructor 프로퍼티만 갖는 객체다. 프로토타입도 객체이고 모든 객체는 프로토타입을 가지므로 프로토타입도 자신의 프로토타입을 갖는다.
생성된 프로토타입의 프로토타입은 `Object.prototype`이다.

![그림 19-12. Person.prototype의 프로토타입](https://github.com/Zamoca42/blog/assets/96982072/fdb94348-4696-43eb-808c-5f095d5c7950)

### 5.2. 빌트인 생성자 함수와 프로토타입 생성 시점

Object, String, Number, Function, Array 등과 같은 빌트인 생성자 함수도 일반 함수와 마찬가지로 빌트인 생성자 함수가 생성되는 시점에 프로토타입이 생성된다.
모든 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성된다.
생성된 프로토타입은 빌트인 생성자 함수의 prototype 프로퍼티에 바인딩된다.

![그림 19-13. Object 생성자 함수와 프로토타입](https://github.com/Zamoca42/blog/assets/96982072/d619b6f5-b231-42c7-99ed-bb4239d0dd38)

:::info 전역 객체(global object)
전역 객체는 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 생성되는 특수한 객체다.
전역 객체는 클라이언트 사이드 환경(브라우저)에서 window, 서버 사이드 환경(Node.js)에서는 global 객체를 의미한다.

전역 객체는 표준 빌트인 객체(Object, String, Number, Function, Array ...)들과 같은 환경에 따른 호스트 객체(클라이언트 Web API 또는 Node.js의 호스트 API), 그리고 var 키워드로 선언한 전역 변수와 전역 함수를 프로퍼티로 갖는다. Math, Reflect,JSON을 제외한 표준 빌트인 객체는 모두 생성자 함수다.

```js
// 전역 객체 window는 브라우저에 종속적이므로 아래 코드는 브라우저 환경에서 실행해야 한다.
// 빌트인 객체인 Object는 전역 객체 window의 프로퍼티다.
window.Object === Object; // true
```

표준 빌트인 객체인 Object도 전역 객체의 프로퍼티이며, 전역 객체가 생성되는 시점에 생성된다. 전역 객체와 표준 빌트인 객체에 대해서는 21장 "빌트인 객체"에서 자세히 살펴보자.
:::

이처럼 객체가 생성되기 이전에 생성자 함수와 프로토타입은 이미 객체화되어 존재한다.
이후 생성자 함수 또는 리터럴 표기법으로 객체를 생성하면 프로토타입은 생성된 객체의 `[[Prototype]]` 내부 슬롯에 할당된다. 이로써 생성된 객체는 프로토타입을 상속받는다.

## 6. 객체 생성 방식과 프로토타입의 결정

객체는 다음과 같이 다양한 생성 방법이 있다.

- 객체 리터럴
- Object 생성자 함수
- Object.create 메서드
- 클래스(ES6)

이처럼 다양한 방식으로 생성된 모든 객체는 각 방식마다 세부적인 객체 생성 방식의 차이는 있으나 추상 연산 `OrdinaryObjectCreate`에 의해 생성된다는 공통점이 있다.

### 6.1. 객체 리터럴에 의해 생성된 객체의 프로토타입

```js
const obj = { x: 1 };
```

위 객체 리터럴이 평가되면 추상 연산 `OrdinaryObjectCreate`에 의해 다음과 같이 Object 생성자 함수와 `Object.prototype`과 생성된 객체 사이에 연결이 만들어진다.

![그림 19-14. 객체 리터럴에 의해 생성된 객체의 프로토타입](https://github.com/Zamoca42/blog/assets/96982072/6216cb74-f125-479e-a377-174a07ee4093)

이처럼 객체 리터럴에 의해 생성된 obj 객체는 Object.prototype을 프로토타입으로 갖게되며, 이로써 Object.prototype을 상속받는다. obj 객체는 constructor 프로퍼티와 hasOwnProperty 메서드 등을 소유하지 않지만 자신의 프로토타입인 Object.prototype의 constructor 프로퍼티와 hasOwnProperty 메서드를 자신의 자산인 것처럼 자유롭게 사용할 수 있다.

```js
const obj = { x: 1 };

// 객체 리터럴에 의해 생성된 obj 객체는 Object.prototype을 상속받는다.
console.log(obj.constructor === Object); // true
console.log(obj.hasOwnProperty("x")); // true
```

### 6.2. Object 생성자 함수에 의해 생성된 객체의 프로토타입

Object 생성자 함수를 인수 없이 호출하면 빈 객체가 생성된다. Object 생성자 함수를 호출하면 객체 리터럴과 마찬가지로 추상 연산 `OrdinaryObjectCreate`가 호출된다.
이때 추상 연산 `OrdinaryObjectCreate`에 전달되는 프로토타입은 Object.prototype이다.
즉, Object 생성자 함수에 의해 생성되는 객체의 프로토타입은 Object.prototype이다.

```js
const obj = new Object();
obj.x = 1;
```

위 코드가 실행되면 추상 연산 `OrdinaryObjectCreate`에 의해 다음과 같이 Object 생성자 함수와 Object.prototype과 생성된 객체 사이에 연결이 만들어진다. 객체 리터럴에 의해 생성된 객체와 동일한 구조를 갖는 것을 알 수 있다.

![그림 19-15. Object 생성자 함수에 의해 생성된 객체의 프로토타입](https://github.com/Zamoca42/blog/assets/96982072/6216cb74-f125-479e-a377-174a07ee4093)

이처럼 Object 생성자 함수에 의해 생성된 obj 객체는 Object.prototype을 프로토타입으로 갖게 되며 이로써 Object.prototype을 상속 받는다.

```js
const obj = new Object();
obj.x = 1;

// Object 생성자 함수에 의해 생성된 obj 객체는 Object.prototype을 상속받는다.
console.log(obj.constructor === Object); // true
console.log(obj.hasOwnProperty("x")); // true
```

객체 리터럴과 Object 생성자 함수에 의한 객체 생성 방식의 차이는 프로퍼티를 추가하는 방식에 있다.
객체 리터럴 방식은 객체 리터럴 내부에 프로퍼티를 추가하지만 Object 생성자 함수 방식은 일단 빈 객체를 생성한 이후 프로퍼티를 추가해야 한다.

### 6.3. 생성자 함수에 의해 생성된 객체의 프로토타입

new 연산자와 함께 생성자 함수를 호출하여 인스턴스를 생성하면 다른 객체 생성 방식과 마찬가지로
추상 연산 `OrdinaryObjectCreate`가 호출된다.
이때 추상 연산 `OrdinaryObjectCreate`에 전달되는 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체다. 즉, 생성자 함수에 의해 생성되는 객체의 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체다.
다음 예제를 살펴보자.

```js
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");
```

위 코드가 실행되면 추상 연산 `OrdinaryObjectCreate`에 의해 다음과 같이 생성자 함수와 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체와 생성된 객체 사이에 연결이 만들어진다.

![그림 19-16. 생성자 함수에 의해 생성된 객체의 프로토타입](https://github.com/Zamoca42/blog/assets/96982072/fd92c072-408c-4932-81f9-54da16a89705)

표준 빌트인 객체인 Object 생성자 함수와 더불어 생성된 프로토타입 Object.prototype은 다양한 빌트인 메서드를 갖고 있다.
하지만 사용자 정의 생성자 함수 Person과 더불어 생성된 프로토타입 Object.prototype의 프로퍼티는 constructor뿐이다.

프로토타입 Person.prototype에 프로퍼티를 추가하여 하위 객체가 상속받을 수 있도록 구현해보자.
프로토타입은 객체다. 따라서 일반 객체와 같이 프로토타입에도 프로퍼티를 추가/삭제할 수 있다. 그리고 이렇게 추가된 추가/삭제한 프로퍼티는 프로토타입 체인에 즉각 반영된다.

```js
function Person(name) {
  this.name = name;
}

// 프로토타입 메서드
Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`);
};

const me = new Person("Lee");
const you = new Person("Kim");

me.sayHello(); // Hi! My name is Lee
you.sayHello(); // Hi! My name is Kim
```

Person 생성자 함수를 통해 생성된 모든 객체는 프로토타입에 추가된 `sayHello` 메서드를 상속받아 자신의 메서드처럼 사용할 수 있다.

![그림 19-17. 프로토타입의 확장과 상속](https://github.com/Zamoca42/blog/assets/96982072/648a01f5-2e17-421b-a010-6a8832ef9599)

## 7. 프로토타입 체인

```js
function Person(name) {
  this.name = name;
}

// 프로토타입 메서드
Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`);
};

const me = new Person("Lee");

// hasOwnProperty는 Object.prototype의 메서드다.
console.log(me.hasOwnProperty("name")); // true
```

Person 생성자 함수에 의해 생성된 me 객체는 Obejct.prototype의 메서드인 hasOwnProperty를 호출할 수 있다.
이것은 me 객체가 Person.prototype뿐만 아니라 Object.prototype도 상속받았다는 것을 의미한다.
me 객체의 프로토타입은 Perosn.prototype이다.

```js
Object.getPrototypeOf(me) === Person.prototype; // -> true
```

Person.prototype의 프로토타입은 Object.prototype이다. 프로토타입의 프로토타입은 언제나 Object.prototype이다.

```js
Object.getPrototypeOf(Person.prototype) === Object.prototype; // -> true
```

따라서 위 예제를 그림으로 표현하면 다음과 같다.

![그림 19-18. 프로토타입 체인](https://github.com/Zamoca42/blog/assets/96982072/95b6e198-e0cb-4f65-be2e-3992d0302fe0)

자바스크립트는 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 `[[Prototype]]` 내부 슬롯의 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다. 이를 프로토타입 체인이라 한다. 프로토타입 체인은 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 메커니즘이다.

```js
// hasOwnProperty는 Object.prototype의 메서드다.
// me 객체는 프로토타입 체인을 따라 hasOwnProperty 메서드를 검색하여 사용한다.
me.hasOwnProperty("name"); // -> true
```

me.hasOwnProperty('name')과 같이 메서드를 호출하면 자바스크립트 엔진은 다음과 같은 과정을 거쳐 메스드를 검색한다.
물론 프로퍼티를 참조하는 경우도 마찬가지다.

1. 먼저 hasOwnProperty 메서드를 호출한 me 객체에서 hasOwnProperty 메서드를 검색한다. me 객체에는 hasOwnProperty 메서드가 없으므로 프로토타입 체인을 따라, 다시 말해 `[[Prototype]]` 내부 슬롯에 바인딩되어 있는 프로토타입(위 예제의 경우 Person.prototype)으로 이동하여 hasOwnProperty 메서드를 검색한다.

2. Perosn.prototype에도 hasOwnProperty 메서드가 없으므로 프로토타입 체인을 따라, 1번과 같이 hasOwnProperty 메서드를 검색한다.

3. Object.prototype에 있는 hasOwnProperty 메서드가 존재한다.
   자바스크립트 엔진은 Object.prototype.hasOwnProperty메서드를 호출하고 해당 메서드의 this에는 me 객체가 바인딩 된다.

```js
Object.prototype.hasOwnProperty.call(me, "name");
```

::: info call 메서드
call 메서드는 this로 사용할 객체를 전달하면서 함수를 호출한다. 이에 대해서는 22.2.4절 "Function.prototype.apply/call/bind 메서드에 의한 간접 호출"에서 자세히 살펴볼 것이다. 지금은 this로 사용할 me 객체를 전달하면서 Object.prototype.hasOwnProperty 메서드를 호출한다고 이해하자.
:::

프로토타입 체인으 최상위에 위치한 객체는 언제나 Object.prototype이다. Object.prototype을 프로토타입 체인의 종점이라 한다. 종점의 프로토타입 `[[Prototype]]`내부 슬롯의 값은 null이다.

프로토타입 체인의 종점인 `Object.prototype`에서도 프로퍼티를 검색할 수 없는 경우 `undefined`를 반환한다.

```js
console.log(me.foo); // undefined
```

이처럼 자바스크립트 엔진은 프로토타입 체인을 따라 프로퍼티/메서드를 검색한다. 다시 말해, 자바스크립트 엔진은 객체 간의 상속 관계로 이루어진 프로토타입의 계층적인 구조에서 객체의 프로퍼티를 검색한다. 따라서 **프로토타입 체인은 상속과 프로퍼티 검색을 위한 메커니즘**이라고 할 수 있다.

```js
me.hasOwnProperty("name");
```

위 예제의 경우, 먼저 스코프 체인에서 me 식별자를 검색한다. me 식별자는 전역에서 선언되었으므로 전역 스코프에서 검색된다. me 식별자를 검색한 다음, me 객체의 프로토타입 체인에서 hasOwnProperty 메서드를 검색한다. 이처럼 **스코프 체인과 프로토타입 체인은 서로 연관없이 별도로 작동하는 것이 아니라 서로 협력하여 식별자와 프로퍼티를 검색하는 데 사용된다.**

## 8. 오버라이딩과 프로퍼티 섀도잉

```js
const Person = (function () {
  // 생성자 함수
  function Person(name) {
    this.name = name;
  }

  // 프로토타입 메서드
  Person.prototype.sayHello = function () {
    console.log(`Hi! My name is ${this.name}`);
  };

  // 생성자 함수를 반환
  return Person;
})();

const me = new Person("Lee");

// 인스턴스 메서드
me.sayHello = function () {
  console.log(`Hey! My name is ${this.name}`);
};

// 인스턴스 메서드가 호출된다. 프로토타입 메서드는 인스턴스 메서드에 의해 가려진다.
me.sayHello(); // Hey! My name is Lee
```

생성자 함수로 객체(인스턴스)를 생성한 다음, 인스턴스에 메서드를 추가했다.

![그림 19-19. 오버라이딩과 프로퍼티 섀도잉](https://github.com/Zamoca42/blog/assets/96982072/6a87e851-8831-4091-89a3-42d6bd732096)

프로토타입이 소유한 프로퍼티(메서드 포함)를 프로토타입 프로퍼티, 인스턴스가 소유한 프로퍼티를 인스턴스 프로퍼티라고 부른다.

프로토타입 프로퍼티와 같은 이름의 프로퍼티를 인스턴스에 추가하면 프로토타입 체인을 따라 프로토타입 프로퍼티를 검색하여 프로토타입 프로퍼티를 덮어쓰는 것이 아니라 인스턴스 프로퍼티로 추가한다.
이때 인스턴스 메서드 sayHello는 프로토타입 메서드 sayHello를 오버라이딩했고 프로토타입 메서드 sayHello는 가려진다. 이처럼 상속 관계에 의해 프로퍼티가 가려지는 현상을 프로퍼티 섀도잉(property shadowing)이라 한다.

:::info 오버라이딩(overriding)과 오버로딩(overloading)

오버라이딩은 상위 클래스가 가지고 있는 메서드를 하위 클래스가 재정의하여 사용하는 방식이다.

오버로딩은 함수 이름은 동일하지만 매개변수의 타입 또는 개수가 다른 메서드를 구현하고 매개변수에 의해 메서드를 구별하여 호출하는 방식이다. 자바스크립트는 오버로딩을 지원하지 않지만 arguments 객체를 사용하여 구현할 수는 있다.
:::

프로퍼티를 삭제하는 경우도 마찬가지다. 위 예제에서 추가한 인스턴스 메서드 sayHello를 삭제해보자.

```js
// 인스턴스 메서드를 삭제한다.
delete me.sayHello;
// 인스턴스에는 sayHello 메서드가 없으므로 프로토타입 메서드가 호출된다.
me.sayHello(); // Hi! My name is Lee
```

당연히 프로토타입 메서드가 아닌 인스턴스 메서드 sayHello가 삭제된다. 다시 한번 sayHello 메서드를 삭제하여 프로토타입 메서드의 삭제를 시도해보자.

```js
// 프로토타입 체인을 통해 프로토타입 메서드가 삭제되지 않는다.
delete me.sayHello;
// 프로토타입 메서드가 호출된다.
me.sayHello(); // Hi! My name is Lee
```

이와 같이 하위 객체를 통해 프로토타입의 프로퍼티를 변경 또는 삭제하는 것은 불가능하다. 다시 말해 하위 객체를 통해 프로토타입에 get 액세스는 허용되나 set 액세스는 허용되지 않는다.

프로토타입 프로퍼티를 변경 또는 삭제하려면 하위 객체를 통해 프로토타입 체인으로 접근하는 것이 아니라 프로토타입에 직접 접근해야한다.

```js
// 프로토타입 메서드 변경
Person.prototype.sayHello = function () {
  console.log(`Hey! My name is ${this.name}`);
};
me.sayHello(); // Hey! My name is Lee

// 프로토타입 메서드 삭제
delete Person.prototype.sayHello;
me.sayHello(); // TypeError: me.sayHello is not a function
```

## 9. 프로토타입의 교체

프로토타입은 임의의 다른 객체로 변경할 수 있다. 이것은 부모 객체인 프로토타입을 동적으로 변경할 수 있다는 것을 의미한다. 이러한 특징을 활용하여 객체 간의 상속 관계를 동적으로 변경할 수 있다.
프로토타입은 생성자 함수 또는 인스턴스에 의해 교체할 수 있다.

### 9.1. 생성자 함수에 의한 프로토타입의 교체

```js
const Person = (function () {
  function Person(name) {
    this.name = name;
  }

  // ① 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    sayHello() {
      console.log(`Hi! My name is ${this.name}`);
    },
  };

  return Person;
})();

const me = new Person("Lee");
```

①에서 Person.prototype에 객체 리터럴을 할당했다.
이는 Person 생성자 함수가 생성할 객체의 프로토타입을 객체 리터럴로 교체한 것이다.
이를 그림으로 나타내면 다음과 같다.

![그림 19-20. 생성자 함수에 의한 프로토타입 교체](https://github.com/Zamoca42/blog/assets/96982072/15e23de0-5e55-49e4-91b9-78f268f0699f)

프로토타입으로 교체한 객체 리터럴에는 constructor 프로퍼티가 없다.
constructor 프로퍼티는 자바스크립트 엔진이 프로토타입을 생성할 때 암묵적으로 추가한 프로퍼티다.
따라서 me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나온다.

```js
// 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
console.log(me.constructor === Person); // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색된다.
console.log(me.constructor === Object); // true
```

이처럼 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
파괴된 constructor 프로퍼티와 생성자 함수 간의 연결을 되살려 보자.
프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가하여 프로토타입의 constructor 프로퍼티를 되살린다.

```js
const Person = (function () {
  function Person(name) {
    this.name = name;
  }

  // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    // constructor 프로퍼티와 생성자 함수 간의 연결을 설정
    constructor: Person,
    sayHello() {
      console.log(`Hi! My name is ${this.name}`);
    },
  };

  return Person;
})();

const me = new Person("Lee");

// constructor 프로퍼티가 생성자 함수를 가리킨다.
console.log(me.constructor === Person); // true
console.log(me.constructor === Object); // false
```

### 9.2. 인스턴스에 의한 프로토타입의 교체

프로토타입은 생성자 함수의 prototype 프로퍼티뿐만 아니라 인스턴스의 `__proto__` 접근자 프로퍼티
(또는 `Object.getPrototypeOf` 메서드)를 통해 접근하여 프로토타입을 교체할 수 있다.

생성자 함수의 prototype 프로퍼티에 다른 임의의 객체를 바인딩하는 것은 미래에 생성할 인스턴스의 프로토타입을
교체하는 것이다.

`__proto__` 접근자 프로퍼티를 통해 프로토타입을 교체하는 것은 이미 생성된 객체의 프로토타입을 교체하는 것이다.

```js
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 프로토타입으로 교체할 객체
const parent = {
  sayHello() {
    console.log(`Hi! My name is ${this.name}`);
  },
};

// ① me 객체의 프로토타입을 parent 객체로 교체한다.
Object.setPrototypeOf(me, parent);
// 위 코드는 아래의 코드와 동일하게 동작한다.
// me.__proto__ = parent;

me.sayHello(); // Hi! My name is Lee
```

①에서 me 객체의 프로토타입을 parent 객체로 교체했다. 이를 그림으로 나타내면 다음과 같다.

![그림 19-21. 인스턴스에 의한 프로토타입의 교체](https://github.com/Zamoca42/blog/assets/96982072/42b8010e-f390-4798-9546-ae3e2f7eb4f3)

프로토타입으로 교체한 객체에는 constructor 프로퍼티가 없으므로 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
따라서 프로토타입의 constructor 프로퍼티로 me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나온다.

```js
// 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
console.log(me.constructor === Person); // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색된다.
console.log(me.constructor === Object); // true
```

생성자 함수에 의한 프로토타입 교체와 인스턴스에 의한 프로토타입 교체는 별다른 차이가 없어 보인다.
하지만 미묘한 차이가 있다.

![그림 19-22. 프로토타입 교체 방식에 의해 발생하는 차이](https://github.com/Zamoca42/blog/assets/96982072/acbb95b4-c32d-4922-8e5d-09f4ae3dff15)

프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가하고 생성자 함수의 prototype 프로퍼티를 재설정하여 파괴된 생성자 함수와
프로토타입 간의 연결을 되살려 보자.

```js
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 프로토타입으로 교체할 객체
const parent = {
  // constructor 프로퍼티와 생성자 함수 간의 연결을 설정
  constructor: Person,
  sayHello() {
    console.log(`Hi! My name is ${this.name}`);
  },
};

// 생성자 함수의 prototype 프로퍼티와 프로토타입 간의 연결을 설정
Person.prototype = parent;

// me 객체의 프로토타입을 parent 객체로 교체한다.
Object.setPrototypeOf(me, parent);
// 위 코드는 아래의 코드와 동일하게 동작한다.
// me.__proto__ = parent;

me.sayHello(); // Hi! My name is Lee

// constructor 프로퍼티가 생성자 함수를 가리킨다.
console.log(me.constructor === Person); // true
console.log(me.constructor === Object); // false

// 생성자 함수의 prototype 프로퍼티가 교체된 프로토타입을 가리킨다.
console.log(Person.prototype === Object.getPrototypeOf(me)); // true
```

이처럼 프로토타입 교체를 통해 객체 간의 상속 관계를 동적으로 변경하는 것은 꽤나 번거롭다.
따라서 프로토타입은 직접 교체하지 않는 것이 좋다.
상속 관계를 인위적으로 설정하려면 19.11절 "직접 상속"에서 살펴볼 직접 상속이 더 편리하고 안전하다.
또는 ES6에서 도입된 클래스를 사용하면 간편하고 직관적으로 상속 관계를 구현할 수 있다.
이에 대해서는 25장 "클래스"에서 자세히 살펴보도록 하자.

## 10. instanceof 연산자

instanceof 연산자는 이항 연산자로서 좌변에 객체를 가리키는 식별자, 우변에 생성자 함수를 가리키는 식별자를 피연산자로 받는다.
만약 우변의 피연산자가 함수가 아닌 경우 TypeError가 발생한다.

```js
객체 instanceof 생성자 함수
```

우변의 생성자 함수의 prototype에 바인딩된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 `true`로 평가되고,
그렇지 않은 경우에 `false`로 평가된다.

```js
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Person); // true

// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Object); // true
```

instanceof 연산자가 어떻게 동작하는지 이해하기 위해 프로토타입을 교체해 보자.

```js
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 프로토타입으로 교체할 객체
const parent = {};

// 프로토타입의 교체
Object.setPrototypeOf(me, parent);

// Person 생성자 함수와 parent 객체는 연결되어 있지 않다.
console.log(Person.prototype === parent); // false
console.log(parent.constructor === Person); // false

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하지 않기 때문에 false로 평가된다.
console.log(me instanceof Person); // false

// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Object); // true
```

me 객체는 비록 프로토타입이 교체되어 프로토타입과 생성자 함수 간의 연결이 파괴되었지만 Person 생성자 함수에 의해 생성된 인스턴스임에는 틀림없다.
그러나 `me instanceof Person`은 `false`로 평가된다.

이는 Person.prototype이 me 객체의 프로토타입 체인 상에 존재하지 않기 때문이다. 따라서 프로토타입으로 교체한 parent 객체를
Person 생성자 함수의 prototype 프로퍼티에 바인딩하면 `me instanceof Person`은 `true`로 평가될 것이다.

```js
// 생성자 함수
function Person(name) {
  this.name = name;
}

const me = new Person("Lee");

// 프로토타입으로 교체할 객체
const parent = {};

// 프로토타입의 교체
Object.setPrototypeOf(me, parent);

// Person 생성자 함수와 parent 객체는 연결되어 있지 않다.
console.log(Person.prototype === parent); // false
console.log(parent.constructor === Person); // false

// parent 객체를 Person 생성자 함수의 prototype 프로퍼티에 바인딩한다.
Person.prototype = parent;

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Person); // true

// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Object); // true
```

이처럼 instanceof 연산자는 프로토타입의 constructor 프로퍼티가 가리키는 생성자 함수를 찾는 것이 아니라
생성자 함수의 prototype에 바인딩된 객체가 프로토타입 체인 상에 존재하는지 확인한다.

![그림 19-23. instanceof 연산자](https://github.com/Zamoca42/blog/assets/96982072/857da284-85bb-4f14-9470-dfa341ca8571)

`me instanceof Person`의 경우 me 객체의 프로토타입 체인 상에 Person.prototype에 바인딩된 객체가 존재하는지 확인한다.

`me instanceof Object`의 경우도 마찬가지다. me 객체의 프로토타입 체인 상에 Object.prototype에 바인딩된 객체가 존재하는지 확인한다.

instanceof 연산자를 함수로 표현하면 다음과 같다.

```js
function isInstanceof(instance, constructor) {
  // 프로토타입 취득
  const prototype = Object.getPrototypeOf(instance);

  // 재귀 탈출 조건
  // prototype이 null이면 프로토타입 체인의 종점에 다다른 것이다.
  if (prototype === null) return false;

  // 프로토타입이 생성자 함수의 prototype 프로퍼티에 바인딩된 객체라면 true를 반환한다.
  // 그렇지 않다면 재귀 호출로 프로토타입 체인 상의 상위 프로토타입으로 이동하여 확인한다.
  return (
    prototype === constructor.prototype || isInstanceof(prototype, constructor)
  );
}

console.log(isInstanceof(me, Person)); // true
console.log(isInstanceof(me, Object)); // true
console.log(isInstanceof(me, Array)); // false
```

따라서 생성자 함수에 의해 프로토타입이 교체되어 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴되어도 생성자 함수의 prototype 프로퍼티와
프로토타입 간의 연결은 파괴되지 않으므로 instanceof는 아무런 영향을 받지 않는다.

```js
const Person = (function () {
  function Person(name) {
    this.name = name;
  }

  // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    sayHello() {
      console.log(`Hi! My name is ${this.name}`);
    },
  };

  return Person;
})();

const me = new Person("Lee");

// constructor 프로퍼티와 생성자 함수 간의 연결은 파괴되어도 instanceof는 아무런 영향을 받지 않는다.
console.log(me.constructor === Person); // false

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Person); // true
// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Object); // true
```

## 11. 직접 상속

### 11.1. Object.create에 의한 직접 상속

`Object.create` 메서드는 명시적으로 프로토타입을 지정하여 새로운 객체를 생성한다.
`Object.create` 메서드도 다른 객체 생성 방식과 마찬가지로 추상 연산 `OrdinaryObjectCreate`를 호출한다.

`Object.create` 메서드의 첫 번째 매개변수에는 생성할 객체의 프로토타입으로 지정할 객체를 전달한다.
두 번째 매개변수에는 생성할 객체의 프로퍼티 키와 프로퍼티 디스크립터 객체로 이뤄진 객체를 전달한다.
이 객체의 형식은 Object.defineProperties 메서드의 두 번쨰 인수와 동일하다.
두 번째 인수는 옵션이므로 생략이 가능하다.

```js
// 프로토타입이 null인 객체를 생성한다. 생성된 객체는 프로토타입 체인의 종점에 위치한다.
// obj → null
let obj = Object.create(null);
console.log(Object.getPrototypeOf(obj) === null); // true
// Object.prototype을 상속받지 못한다.
console.log(obj.toString()); // TypeError: obj.toString is not a function

// obj → Object.prototype → null
// obj = {};와 동일하다.
obj = Object.create(Object.prototype);
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

// obj → Object.prototype → null
// obj = { x: 1 };와 동일하다.
obj = Object.create(Object.prototype, {
  x: { value: 1, writable: true, enumerable: true, configurable: true },
});
// 위 코드는 다음과 동일하다.
// obj = Object.create(Object.prototype);
// obj.x = 1;
console.log(obj.x); // 1
console.log(Object.getPrototypeOf(obj) === Object.prototype); // true

const myProto = { x: 10 };
// 임의의 객체를 직접 상속받는다.
// obj → myProto → Object.prototype → null
obj = Object.create(myProto);
console.log(obj.x); // 10
console.log(Object.getPrototypeOf(obj) === myProto); // true

// 생성자 함수
function Person(name) {
  this.name = name;
}

// obj → Person.prototype → Object.prototype → null
// obj = new Person('Lee')와 동일하다.
obj = Object.create(Person.prototype);
obj.name = "Lee";
console.log(obj.name); // Lee
console.log(Object.getPrototypeOf(obj) === Person.prototype); // true
```

이처럼 `Object.create` 메서드는 첫 번째 매개변수에 전달한 객체의 프로토타입 체인에 속하는 객체를 생성한다.
즉, 객체를 생성하면서 직접적으로 상속을 구현하는 것이다. 이 메서드의 장점은 다음과 같다.

- new 연산자가 없이도 객체를 생성할 수 있다.
- 프로토타입을 지정하면서 객체를 생성할 수 있다.
- 객체 리터럴에 의해 생성된 객체도 상속받을 수 있다.

참고로 `Object.prototype`의 빌트인 메서드인 `hasOwnProperty`,`isPrototypeOf`, `propertyIsEnumerable` 등은
모든 객체의 프로토토타입 체인의 종점, 즉 `Object.prototype`의 메서드이므로 모든 객체가 상속받아 호출할 수 있다.

```js
const obj = { a: 1 };

obj.hasOwnProperty("a"); // -> true
obj.propertyIsEnumerable("a"); // -> true
```

그런데 ESLint에서는 아프이 예제와 같이 `Object.prototype`의 빌트인 메서드를 객체가 직접 호출하는 것을 권장하지 않는다.
그 이유는 `Object.create` 메서드를 통해 프로토타입 체인의 종점에 위치하는 객체를 생성할 수 있기 때문이다.
프로토타입 체인의 종점에 위치하는 객체는 `Object.prototype`의 빌트인 메서드를 사용할 수 없다.

```js
// 프로토타입이 null인 객체, 즉 프로토타입 체인의 종점에 위치하는 객체를 생성한다.
const obj = Object.create(null);
obj.a = 1;

console.log(Object.getPrototypeOf(obj) === null); // true

// obj는 Object.prototype의 빌트인 메서드를 사용할 수 없다.
console.log(obj.hasOwnProperty("a")); // TypeError: obj.hasOwnProperty is not a function
```

따라서 이 같은 에러를 발생시킬 위험을 없애기 위해 `Object.prototype`의 빌트인 메서드는 다음과 같이
간접적으로 호출하는 것이 좋다.

```js
// 프로토타입이 null인 객체를 생성한다.
const obj = Object.create(null);
obj.a = 1;

// console.log(obj.hasOwnProperty('a')); // TypeError: obj.hasOwnProperty is not a function

// Object.prototype의 빌트인 메서드는 객체로 직접 호출하지 않는다.
console.log(Object.prototype.hasOwnProperty.call(obj, "a")); // true
```

Function.prototype.call 메서드에 대해서는
22.2.4절 "Function.prototype.apply/call/bind 메서드에 의한 간접 호출"에서 살펴보도록 하자.

### 11.2. 객체 리터럴 내부에서 `__proto__`에 의한 직접 상속

`Object.create` 메서드에 의한 직접 상속은 앞에서 다룬 것과 같이 여러 장점이 있다.
하지만 두 번쨰 인자로 프로퍼티를 정의하는 것은 번거롭다.
일단 객체를 생성한 이후 프로퍼티를 추가하는 방법도 잇으나 이 또한 깔끔한 방법은 아니다.

ES6에서는 객체 리터럴 내부에서 `__proto__` 접근자 프로퍼티를 사용하여 직접 상속을 구현할 수 있다.

```js
const myProto = { x: 10 };

// 객체 리터럴에 의해 객체를 생성하면서 프로토타입을 지정하여 직접 상속받을 수 있다.
const obj = {
  y: 20,
  // 객체를 직접 상속받는다.
  // obj → myProto → Object.prototype → null
  __proto__: myProto,
};
/* 위 코드는 아래와 동일하다.
const obj = Object.create(myProto, {
  y: { value: 20, writable: true, enumerable: true, configurable: true }
});
*/

console.log(obj.x, obj.y); // 10 20
console.log(Object.getPrototypeOf(obj) === myProto); // true
```

## 12. 정적 프로퍼티/메서드

정적(static) 프로퍼티/메서드는 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출할 수 있는
프로퍼티/메서드를 말한다.

```js
// 생성자 함수
function Person(name) {
  this.name = name;
}

// 프로토타입 메서드
Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`);
};

// 정적 프로퍼티
Person.staticProp = "static prop";

// 정적 메서드
Person.staticMethod = function () {
  console.log("staticMethod");
};

const me = new Person("Lee");

// 생성자 함수에 추가한 정적 프로퍼티/메서드는 생성자 함수로 참조/호출한다.
Person.staticMethod(); // staticMethod

// 정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없다.
// 인스턴스로 참조/호출할 수 있는 프로퍼티/메서드는 프로토타입 체인 상에 존재해야 한다.
me.staticMethod(); // TypeError: me.staticMethod is not a function
```

Person 생성자 함수는 객체이므로 자신의 프로퍼티/메서드를 소유할 수 있다.
Person 생성자 함수 객체가 소유한 프로퍼티/메서드를 정적 프로퍼티/메서드라고 한다.
정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없다.

![그림 19-24. 정적 프로퍼티/메서드](https://github.com/Zamoca42/blog/assets/96982072/2ff3f64d-7471-4e73-9aeb-bd8da2c38b73)

생성자 함수가 생성한 인스턴스는 자신의 프로토타입 체인에 속한 객체의 프로퍼티/메서드에 접근할 수 있다.
하지만 정적 프로퍼티/메서드는 인스턴스의 프로토타입 체인에 속한 객체의 프로퍼티/메서드가 아니므로
인스턴스로 접근할 수 없다.

앞에서 살펴본 Object.create 메서드는 Object 생성자 함수의 정적 메서드고
Object.prototype.hasOwnProperty 메서드는 Object.prototype의 메서드다.

따라서 Object.create 메서드는 인스턴스, 즉 Object 생성자 함수가 생성한 객체로 호출할 수 없다.
하지만 bject.prototype.hasOwnProperty 메서드는 모든 객체의 프로토타입 체인의 종점,
즉 Object.prototype의 메서드이므로 모든 객체가 호출할 수 있다.

```js
// Object.create는 정적 메서드다.
const obj = Object.create({ name: "Lee" });

// Object.prototype.hasOwnProperty는 프로토타입 메서드다.
obj.hasOwnProperty("name"); // -> false
```

만약 인스턴스/프로토타입 메서드 내에서 this를 사용하지 않는다면 그 메서드는 정적 메서드로 변경
할 수 있다. 인스턴스가 호출한 인스턴스/프로토타입 메서드 내에서 this는 인스턴스를 가리킨다.
메서드 내에서 인스턴스를 참조할 필요가 없다면 정적 메서드로 변경하여도 동작한다.
프로토타입 메서드를 호출하려면 인스턴스를 생성해야 하지만 정적 메서드는 인스턴스를 생성하지않아도
호출할 수 있다.

```js
function Foo() {}

// 프로토타입 메서드
// this를 참조하지 않는 프로토타입 메소드는 정적 메서드로 변경해도 동일한 효과를 얻을 수 있다.
Foo.prototype.x = function () {
  console.log("x");
};

const foo = new Foo();
// 프로토타입 메서드를 호출하려면 인스턴스를 생성해야 한다.
foo.x(); // x

// 정적 메서드
Foo.x = function () {
  console.log("x");
};

// 정적 메서드는 인스턴스를 생성하지 않아도 호출할 수 있다.
Foo.x(); // x
```

MDN과 같은 문서를 보면 다음과 같이 정적 프로퍼티/메서드와 프로토타입 프로퍼티/메서드를 구분하여
소개하고 있다. 따라서 표기법만으로도 정적 프로퍼티/메서드와 프로토타입 프로퍼티/메서드를 구별할 수
있어야 한다.

![그림 19-25. MDN(https://developer.mozilla.org)](https://github.com/Zamoca42/blog/assets/96982072/f7b69a07-1fc0-452a-b6f7-f5bd92ef0763)

참고로 프로토타입 프로퍼티/메서드를 표기할 때 prototype을 #으로 표기
(예를 들어, Object.prototype#isPrototypeOf)하는 경우도 있으니 알아두도록 하자.

## 13. 프로퍼티 존재 확인

### 13.1 in 연산자

`in` 연산자는 객체 내에 특정 프로퍼티가 존재하는지 여부를 확인한다. `in` 연산자의 사용법은 다음과 같다.

```js
key in object;
```

```js
const person = {
  name: "Lee",
  address: "Seoul",
};

// person 객체에 name 프로퍼티가 존재한다.
console.log("name" in person); // true
// person 객체에 address 프로퍼티가 존재한다.
console.log("address" in person); // true
// person 객체에 age 프로퍼티가 존재하지 않는다.
console.log("age" in person); // false
```

`in` 연산자는 확인 대상 객체의 프로퍼티뿐만 아니라 확인 대상 객체가 상속받은 모든 프로토타입의 프로퍼티를 확인하므로 주의가 필요하다.
`person` 객체에는 `toString`이라는 프로퍼티가 없지만 다음 코드의 실행 결과는 true다.

```js
console.log("toString" in person); // true
```

이는 `in` 연산자가 person 객체가 속한 프로토타입 체인 상에 존재하는 모든 프로토타입에서 `toString` 프로퍼티를 검색했기 때문이다.
`toString`은 `Object.prototype`의 메서드다.
`in` 연산자 대신 ES6에서 도입된 `Reflect.has` 메서드를 사용할 수도 있다. `Reflect.has` 메서드는 `in` 연산자와 동일하게 동작한다.

```js
const person = { name: "Lee" };

console.log(Reflect.has(person, "name")); // true
console.log(Reflect.has(person, "toString")); // true
```

### 13.2 Object.prototype.hasOwnProperty 메서드

`Object.prototype.hasOwnProperty` 메서드를 사용해도 객체에 특정 프로퍼티가 존재하는지 확인할 수 있다.

```js
console.log(person.hasOwnProperty("name")); // true
console.log(person.hasOwnProperty("age")); // false
```

`Object.prototype.hasOwnProperty` 메서드는 이름에서 알 수 있듯이 인수로 전달받은 프로퍼티 키가 객체 고유의 프로퍼티 키인 경우에만 `true`를
반환하고 상속받은 프로토타입의 프로퍼티 키인 경우 false를 반환한다.

```js
console.log(person.hasOwnProperty("toString")); // false
```

## 14. 프로퍼티 열거

### 14.1. for ... in 문

객체의 모든 프로퍼티를 순회하면 열거(enumeration)하려면 for ... in 문을 사용한다.

```js
for (변수선언문 in 객체) {...}
```

```js
const person = {
  name: "Lee",
  address: "Seoul",
};

// for...in 문의 변수 key에 person 객체의 프로퍼티 키가 할당된다.
for (const key in person) {
  console.log(key + ": " + person[key]);
}
// name: Lee
// address: Seoul
```

for ... in 문은 객체의 프로퍼티 개수만큼 순회하면 for ... in 문의 변수 선언문에서 선언한 변수에 프로퍼티 키를 할당한다.
위 예제의 경우 person 객체에는 2개의 프로퍼티가 있으므로 객체를 2번 순회하면서 프로퍼티 키를 key 변수에 할당한 후 코드 블록을 실행한다.
첫 번째 순회에서는 프로퍼티 키 'name'을 key 변수에 할당한 후 코드 블록을 실행하고
두 번째 순회에서는 프로퍼티 키 'address'를 key 변수에 할당한 후 코드 블록을 실행한다.

for ... in 문은 in 연산자처럼 순회 대상 객체의 프로퍼티뿐만 아니라 상속받은 프로토타입의 프로퍼티까지 열거한다.
하지만 위 예제의 경우 `toString`과 같은 Object.prototype의 프로퍼티가 열거되지 않는다.

```js
const person = {
  name: "Lee",
  address: "Seoul",
};

// in 연산자는 객체가 상속받은 모든 프로토타입의 프로퍼티를 확인한다.
console.log("toString" in person); // true

// for...in 문도 객체가 상속받은 모든 프로토타입의 프로퍼티를 열거한다.
// 하지만 toString과 같은 Object.prototype의 프로퍼티가 열거되지 않는다.
for (const key in person) {
  console.log(key + ": " + person[key]);
}

// name: Lee
// address: Seoul
```

이는 toString 메서드가 열거할 수 없도록 정의되어 있는 프로퍼티이기 때문이다.
다시 말해, Object.prototype.toString 프로퍼티의 프로퍼티 어트리뷰트 `[[Enumerable]]`의 값이 `false`이기 때문이다.
프로퍼티 어트리뷰트 `[[Enumerable]]`은 프로퍼티의 열거 가능 여부를 나타내며 불리언 값을 갖는다.

```js
// Object.getOwnPropertyDescriptor 메서드는 프로퍼티 디스크립터 객체를 반환한다.
// 프로퍼티 디스크립터 객체는 프로퍼티 어트리뷰트 정보를 담고 있는 객체다.
console.log(Object.getOwnPropertyDescriptor(Object.prototype, "toString"));
// {value: ƒ, writable: true, enumerable: false, configurable: true}
```

for ... in 문은 객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중에서
프로퍼티 어트리뷰트 `[[Enumerable]]`의 값이 `true`인 프로퍼티를 순회하며 열거한다.

```js
const person = {
  name: "Lee",
  address: "Seoul",
  __proto__: { age: 20 },
};

for (const key in person) {
  console.log(key + ": " + person[key]);
}
// name: Lee
// address: Seoul
// age: 20
```

for ... in 문은 프로퍼티 키가 심벌인 프로퍼티는 열거하지 않는다.

```js
const sym = Symbol();
const obj = {
  a: 1,
  [sym]: 10,
};

for (const key in obj) {
  console.log(key + ": " + obj[key]);
}
// a: 1
```

상속받은 프로퍼티는 제외하고 객체 자신의 프로퍼티만 열거하려면 Object.prototype.hasOwnProperty 메서드를 사용하여
객체 자신의 프로퍼티인지 확인해야한다.

```js
const person = {
  name: "Lee",
  address: "Seoul",
  __proto__: { age: 20 },
};

for (const key in person) {
  // 객체 자신의 프로퍼티인지 확인한다.
  if (!person.hasOwnProperty(key)) continue;
  console.log(key + ": " + person[key]);
}
// name: Lee
// address: Seoul
```

위 예제의 결과는 person 객체의 프로퍼티가 정의된 순서대로 열거되었다.
하지만 for ... in 문은 프로퍼티를 열거할 때 순서를 보장하지 않으므로 주의하기 바란다.
하지만 대부분의 모던 브라우저는 순서를 보장하고 숫자인 프로퍼티 키에 대해서는 정렬을 실시한다.

```js
const obj = {
  2: 2,
  3: 3,
  1: 1,
  b: "b",
  a: "a",
};

for (const key in obj) {
  if (!obj.hasOwnProperty(key)) continue;
  console.log(key + ": " + obj[key]);
}

/*
1: 1
2: 2
3: 3
b: b
a: a
*/
```

배열에는 for ... in 문을 사용하지 말고 일반적인 for 문이나 for ... of 문 
또는 Array.prototype.forEach 메서드를 사용하기를 권장한다.

사실 배열도 객체이므로 프로퍼티와 상속받은 프로퍼티가 포함될 수 있다.

```js
const arr = [1, 2, 3];
arr.x = 10; // 배열도 객체이므로 프로퍼티를 가질 수 있다.

for (const i in arr) {
  // 프로퍼티 x도 출력된다.
  console.log(arr[i]); // 1 2 3 10
};

// arr.length는 3이다.
for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]); // 1 2 3
}

// forEach 메서드는 요소가 아닌 프로퍼티는 제외한다.
arr.forEach(v => console.log(v)); // 1 2 3

// for...of는 변수 선언문에서 선언한 변수에 키가 아닌 값을 할당한다.
for (const value of arr) {
  console.log(value); // 1 2 3
};
```

forEach 메서드에 대해서는 27.9.2절 "Array.prototype.forEach"에서, for ... of 문에 대해서는 
34.3절 "for ... of 문"에서 자세히 살펴보도록 하자.

### 14.2. Object.keys/values/entries 메서드

지금까지 살펴보았듯이 for ... in 문은 객체 자신의 고유 프로퍼티뿐 아니라 상속받은 프로퍼티도 열거한다.
따라서 Object.prototype.hasOwnProperty 메서드를 사용하여 객체 자신의 프로퍼티인지 확인하는 추가 처리가 필요하다.

객체 자신의 고유 프로퍼티만 열거하기 위해서는 for ... in 문을 사용하는 것보다 
Object.keys/values/entries 메서드를 사용하는 것을 권장한다.

Object.keys 메서드는 객체 자신의 열거 가능한 프로퍼티 키를 배열로 반환한다.

```js
const person = {
  name: 'Lee',
  address: 'Seoul',
  __proto__: { age: 20 }
};

console.log(Object.keys(person)); // ["name", "address"]
```

ES8에서 도입된 Object.values 메서드는 객체 자신의 열거 가능한 프로퍼티 값을 배열로 반환한다.

```js
console.log(Object.values(person)); // ["Lee", "Seoul"]
```

ES8에서 도입된 Object.entries 메서드는 객체 자신의 열거 가능한 프로퍼티 키와 값의 쌍의 배열을 배열에 담아 반환한다.

```js
console.log(Object.entries(person)); // [["name", "Lee"], ["address", "Seoul"]]

Object.entries(person).forEach(([key, value]) => console.log(key, value));
/*
name Lee
address Seoul
*/
```
