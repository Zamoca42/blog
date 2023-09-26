---
title: 10.객체 리터럴
---

## 10.1 객체란?

자바스크립트는 객체 기반의 프로그래밍 언어이며, 원시 값을 제외한 나머지 값은 모두 객체다.
원시 타입의 값, 즉 원시 값은 변경 불가능한 값(immutable value)이지만 객체는 변경 가능한 값(mutable value)이다.

객체는 0개 이상의 프로퍼티로 구성된 집합이며, 프로퍼티는 키와 값으로 구성된다.

![](https://github.com/Zamoca42/blog/assets/96982072/30727ee8-b9c9-4c6a-b5e7-a974189d3cca)

프로퍼티 값이 함수일 경우, 일반 함수와 구분하기 위해 메서드라 부른다.

![](https://github.com/Zamoca42/blog/assets/96982072/e9dd00c6-7cec-481e-aa6e-3a8bf9d935da)

프로퍼티와 메서드의 역할은 다음과 같다

- 프로퍼티: 객체의 상태를 나타내는 값(data)
- 메서드: 프로퍼티(상태 데이터)를 참조하고 조작할 수 있는 동작(behavior)

이처럼 객체는 객체의 상태를 나타내는 값과 프로퍼티를 참조하고 조작할 수 있는 메서드를 모두 포함할 수 있기 때문에 상태와 동작을 하나의 단위로 구조화할 수 있어 유용하다.

![](https://github.com/Zamoca42/blog/assets/96982072/59e3746c-4e49-44b9-9eb5-3a45167f4e8b)

객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임을 객체지향 프로그래밍이라 한다.

## 10.2 객체 리터럴에 의한 객체 생성

C++이나 자바 같은 클래스 기반 객체지향 언어는 클래스를 사전에 정의하고 필요한 시점에 new 연산자와 함께 생성자(constructor)를 호출하여 인스턴스를 생성하는 방식으로 객체를 생성한다.

자바스크립트는 프로토타입 기반 객체지향 언어로서 클래스 기반 객체지향 언어와는 달리 다양한 객체 생성 방법을 지원한다.

- 객체 리터럴
- Object 생성자 함수
- 생성자 함수
- Object.create 메서드
- 클래스(ES6)

이러한 객체 생성 방법 중에서 가장 일반적이고 간단한 방법은 객체 리터럴을 사용하는 방법이다.
객체 리터럴은 중괄호({...})내에 0개 이상의 프로퍼티를 정의한다.

```js
var person = {
    name: 'Lee',
    sayHello: function (){
        console.log(`Hello! My name is ${this.name}.`);
    }
};

console.log(typeof person); //object
console.log(person); {name: "Lee", sayHello: f}
```

만약 중괄호 내에 프로퍼티를 정의하지 않으면 빈 객체가 생성된다.

```js
var empty = {}; // 빈 객체
console.log(typeof empty); //object
```

## 10.3 프로퍼티

객체는 프로퍼티의 집합이며, 프로퍼티는 키와 값으로 구성된다.

```js
var person = {
    name: 'Lee',
    age: 20
}
```

프로퍼티 키는 값에 접근할 수 있는 이름으로서 식별자 역할을 한다.
하지만 반드시 식별자 네이밍 규칙을 따라야 하는 것은 아니다. 
식별자 네이밍 규칙을 따르지 않는 이름에는 반드시 따옴표를 사용해야 한다.

```js
var person = {
    firstName: 'Ung-mo',
    'last-name': 'Lee'
}

console.log(person); // {firstName: 'Ung-mo', last-name: "Lee"}
```

last-name은 식별자 네이밍규칙을 준수하지 않는다. 따옴표를 생략하면 `-`연산자가 있는 표현식으로 해석한다.

```js
var person = {
    firstName: 'Ung-mo',
    last-name: 'Lee' // SyntaxError: Unexpected token -
}
```

## 10.4 메서드

프로퍼티 값이 함수일 경우 일반 함수와 구분하기 위해 메서드(method)라 부른다.
즉, 메서드는 객체에 묶여있는 함수를 의미한다.

```js
var circle = {
    radius: 5, // 프로퍼티

    // 원의 지름
    getDiameter: function (){
        return 2 * this.radius; // this는 circle을 가리킨다.
    }
}

console.log(circle.getDiameter()); // -> 10
```

:pushpin: this에 관해서는 22장에서 살펴보자.

## 10.5 프로퍼티 접근

프로퍼티에 접근하는 방법은 다음과 같다.

- 마침표 표기법(dot notation)
- 대괄호 표기법(bracket notation)

```js
var person = {
    name: 'Lee'
}

//마침표 표기법
console.log(person.name) // Lee
//대괄호 표기법
console.log(person['name']) // Lee
```

대괄호 프로퍼티 접근 연산자 내에 따옴표로 감싸지 않은 이름을 프로퍼티 키로 사용하면 변수로 해석한다.

## 10.6 프로퍼티 값 갱신

이미 존재하는 프로퍼티에 값을 할당하면 값이 갱신된다.
```js
var person = {
    name: 'Lee'
}

person.name = 'Kim'

console.log(person) // {name: 'Kim'}
```

## 10.7 프로퍼티 동적 생성

존재하지 않는 프로퍼티에 값을 할당하면 프로퍼티가 동적으로 생성되어 추가되고 값이 할당된다.

```js
var person = {
    name: 'Lee'
}

person.age = 20

console.log(person) // {name: 'Lee', age: 20}
```
## 10.8 프로퍼티 삭제

delete 연산자는 객체의 프로퍼티를 삭제한다.
만약 존재하지않는 프로퍼티를 삭제하면 에러 없이 무시된다.

```js
var person = {
    name: 'Lee'
}

person.age = 20

delete person.age

//address 프로퍼티가 존재하지않지만, 에러가 발생하지 않는다.
delete person.address


console.log(person) // {name: 'Lee'}
```

## 10.9 ES6에서 추가된 객체 리터럴의 확장 기능

ES6에서는 더욱 간편하고 표현력 있는 객체 리터럴의 확장 기능을 제공한다.

### 10.9.1 프로퍼티 축약 표현

프로퍼티의 값은 변수에 할당된 값, 즉 식별자 표현식일 수도 있다.

```js
var x = 1, y = 2

var obj = {
    x: x,
    y: y
}

console.log(obj) // {x: 1, y: 2}
```

ES6에서는 변수의 이름과 키가 동일한 이름일 때 키를 생략할 수 있다.

```js
// ES6
let x = 1, y = 2

// 프로퍼티 축약
const obj = { x, y }

console.log(obj) // {x: 1, y: 2}

```

### 10.9.2 계산된 프로퍼티 이름

ES5에서 계산된 프로퍼티 이름으로 키를 동적 생성하려면 객체 리터러 외부에서 대괄호 표기법(\[...\])을 사용해야 한다.

```js
var prefix = 'prop'
var i = 0;

obj[prefix + '-' + ++i] = i;
obj[prefix + '-' + ++i] = i;
obj[prefix + '-' + ++i] = i;

console.log(obj) // {prop-1: 1, prop-2: 2, prop-3: 3}
```

ES6에서는 객체 리터러 내부에서도 계산된 프로퍼티 이름으로 키를 동적 생성할 수 있다.

```js
const prefix = 'prop'
let i = 0;

const obj = {
 [`${prefix}-${++i}`]: i,
 [`${prefix}-${++i}`]: i,
 [`${prefix}-${++i}`]: i
}

console.log(obj) // {prop-1: 1, prop-2: 2, prop-3: 3}
```

### 10.9.3 메서드 축약 표현

ES5에서 메서드를 정의하려면 값으로 함수를 할당한다.

```js
var obj = {
    name: 'Lee',
    sayHi: function() {
        console.log('Hi!' + this.name)
    }
}

obj.sayHi() // Hi! Lee
```

ES6에서는 메서드를 정의할 때 function 키워드를 생략할 수 있다.

```js
var obj = {
    name: 'Lee',
    sayHi() {
        console.log('Hi!' + this.name)
    }
}

obj.sayHi() // Hi! Lee
```