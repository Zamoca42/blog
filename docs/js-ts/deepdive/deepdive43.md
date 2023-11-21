---
title: 43. Ajax
category:
  - JS & TS
tag:
  - JavaScript
---

## 1. Ajax란?

Ajax(Asynchronous JavaScript and XML)란 자바스크립트를 사용하여 브라우저가 서버에게
비동기 방식으로 데이터를 요청하고, 서버가 응답한 데이터를 수신하여 웹페이지를 동적으로 갱신하는 프로그래밍 방식을 말한다.

이전의 웹페이지는 html 태그로 시작해서 html 태그로 끝나는 완전한 HTML을 서버로부터 전송받아
웹페이지 전체를 처음부터 다시 렌더링하는 방식으로 동작했다.

![그림 43-1. 전통적인 웹페이지의 생명 주기][1]

이러한 전통적인 방식은 다음과 같은 단점이 있다.

1. HTML을 서버로부터 매번 다시 전송받기 때문에 불필요한 데이터 통신이 발생한다.
2. 변경할 필요가 없는 부분까지 처음부터 다시 렌더링한다.
3. 서버로부터 응답이 있을 때까지 다음 처리는 블로킹된다.

![그림 43-2. Ajax][2]

Ajax는 전통적인 방식과 비교했을 때 다음과 같은 장점이 있다.

1. 필요한 데이터만 서버로부터 전송받기 때 불필요한 데이터 통신이 발생하지 않는다.
2. 변경할 필요가 없는 부분은 다시 렌더링하지 않는다.
3. 비동기 방식으로 동작하기 때문에 서버에게 요청을 보낸 이후 블로킹이 발생하지 않는다.

## 2. JSON

JSON은 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터 포맷이다.
자바스크립트에 종속되지 않는 언어 독립형 데이터 포맷으로, 대부분의 프로그래밍 언어에서 사용할 수 있다.

### 2.1. JSON 표기 방식

JSON은 자바스크립트의 객체 리터럴과 유사하게 키와 값으로 구성된 순수한 텍스트다.

```js
{
  "name": "Lee",
  "age": 20,
  "alive": true,
  "hobby": ["traveling", "tennis"]
}
```

JSON의 키는 반드시 큰따옴표(작은따옴표 사용 불가)로 묶어야 한다.
값은 객체 리터럴과 같은 표기법을 그대로 사용할 수 있다.
하지만 문자열은 반드시 큰 따옴표(작은따옴표 사용 불가)로 묶어야 한다.

### 2.2. JSON.stringify

JSON.stringify 메서드는 객체를 JSON 포맷의 문자열로 변환한다.
클라이언트가 서버로 객체를 전송하려면 객체를 문자열화해야하는데 이를 직렬화라 한다.

```js
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"],
};

// 객체를 JSON 포맷의 문자열로 변환한다.
const json = JSON.stringify(obj);
console.log(typeof json, json);
// string {"name":"Lee","age":20,"alive":true,"hobby":["traveling","tennis"]}

// 객체를 JSON 포맷의 문자열로 변환하면서 들여쓰기 한다.
const prettyJson = JSON.stringify(obj, null, 2);
console.log(typeof prettyJson, prettyJson);
/*
string {
  "name": "Lee",
  "age": 20,
  "alive": true,
  "hobby": [
    "traveling",
    "tennis"
  ]
}
*/

// replacer 함수. 값의 타입이 Number이면 필터링되어 반환되지 않는다.
function filter(key, value) {
  // undefined: 반환하지 않음
  return typeof value === "number" ? undefined : value;
}

// JSON.stringify 메서드에 두 번째 인수로 replacer 함수를 전달한다.
const strFilteredObject = JSON.stringify(obj, filter, 2);
console.log(typeof strFilteredObject, strFilteredObject);
/*
string {
  "name": "Lee",
  "alive": true,
  "hobby": [
    "traveling",
    "tennis"
  ]
}
*/
```

JSON.stringify 메서드는 객체뿐만 아니라 배열도 JSON 포맷의 문자열로 변환한다.

```js
const todos = [
  { id: 1, content: "HTML", completed: false },
  { id: 2, content: "CSS", completed: true },
  { id: 3, content: "Javascript", completed: false },
];

// 배열을 JSON 포맷의 문자열로 변환한다.
const json = JSON.stringify(todos, null, 2);
console.log(typeof json, json);
/*
string [
  {
    "id": 1,
    "content": "HTML",
    "completed": false
  },
  {
    "id": 2,
    "content": "CSS",
    "completed": true
  },
  {
    "id": 3,
    "content": "Javascript",
    "completed": false
  }
]
*/
```

### 2.3. JSON.parse

JSON.parse 메서드는 JSON 포맷의 문자열을 객체로 변환한다.
서버로부터 클라이언트에게 전송된 JSON 데이터는 문자열이다.
이 문자열을 객체로서 사용하려면 JSON 포맷의 문자열을 객체화해야 하는데 이를 역직렬화라 한다.

```js
const obj = {
  name: "Lee",
  age: 20,
  alive: true,
  hobby: ["traveling", "tennis"],
};

// 객체를 JSON 포맷의 문자열로 변환한다.
const json = JSON.stringify(obj);

// JSON 포맷의 문자열을 객체로 변환한다.
const parsed = JSON.parse(json);
console.log(typeof parsed, parsed);
// object {name: "Lee", age: 20, alive: true, hobby: ["traveling", "tennis"]}
```

배열이 JSON 포맷의 문자열로 변환되어 있는 경우 JSON.parse는 문자열을 배열 객체로 변환한다.

```js
const todos = [
  { id: 1, content: "HTML", completed: false },
  { id: 2, content: "CSS", completed: true },
  { id: 3, content: "Javascript", completed: false },
];

// 배열을 JSON 포맷의 문자열로 변환한다.
const json = JSON.stringify(todos);

// JSON 포맷의 문자열을 배열로 변환한다. 배열의 요소까지 객체로 변환된다.
const parsed = JSON.parse(json);
console.log(typeof parsed, parsed);
/*
 object [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'Javascript', completed: false }
]
*/
```

## 3. XMLHttpRequest

Web API인 XMLHttpRequest 객체는 HTTP 요청 전송과 HTTP 응답 수신을 위한 다양한 메서드와 프로퍼티를 제공한다.

### 3.1. XMLHttpRequest 객체 생성

XMLHttpRequest 객체는 생성자 함수를 호출하여 생성한다.
브라우저에서 제공하는 Web API이므로 브라우저 환경에서만 정상적으로 실행된다.

### 3.2. XMLHttpRequest 객체의 프로퍼티와 메서드

대표적인 프로퍼티와 메서드는 다음과 같다.

#### XMLHttpRequest 객체의 프로토타입 프로퍼티

- readyState

  - HTTP 요청의 현재 상태를 나타내는 정수
    - UNSENT: 0
    - OPENED: 1
    - HEADERS_RECEIVED: 2
    - LOADING: 3
    - DONE: 4

- status

  - HTTP 요청에 대한 응답 상태를 나타내는 정수 (예 - 200)

- statusText

  - HTTP 요청에 대한 응답 메세지 (예 - "OK")

- responseType

  - HTTP 응답 타입

- response

  - HTTP 요청에 대한 응답 몸체(body)

- responseText

  - 서버가 전송한 HTTP 요청에 대한 응답 문자열

### 3.3. HTTP 요청 전송

HTTP 요청을 전송하는 경우 다음 순서를 따른다.

1. XMLHttpRequest.prototype.open 메서드로 HTTP 요청을 초기화한다.
2. 필요에 따라 XMLHttpRequest.prototype.setRequestHeader 메서드로 특정 HTTP 요청의 헤더 값을 설정
3. XMLHttpRequest.prototype.send 메서드로 HTTP 요청을 전송한다.

```js
// XMLHttpRequest 객체 생성
const xhr = new XMLHttpRequest();

// HTTP 요청 초기화
xhr.open('GET', '/users');

// HTTP 요청 헤더 설정
// 클라이언트가 서버로 전송할 데이터의 MIME 타입 지정: json
xhr.setRequestHeader('content-type', 'application/json');

// HTTP 요청 전송
xhr.send();
```

![그림 43-3. HTTP 요청/응답 메시지][3]

[1]: https://github.com/Zamoca42/blog/assets/96982072/6809cb8f-8cde-4bae-b477-92eb7354d228
[2]: https://github.com/Zamoca42/blog/assets/96982072/edaec104-e897-48e9-8e84-6b4c3610396f
[3]: https://github.com/Zamoca42/blog/assets/96982072/508716ae-097f-4b1b-b8c3-7bc9399a7492
