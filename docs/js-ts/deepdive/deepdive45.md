---
title: 45. 프로미스
category:
  - JS & TS
tag:
  - JavaScript
---

자바스크립트는 비동기 처리를 위한 하나의 패턴으로 콜백 함수를 사용한다.
하지만 전통적인 콜백 패턴은 콜백 헬로 인해 가독성이 나쁘고 비동기 처리 중 발생한 에러의 처리가 곤란하며
여러 개의 비동기 처리를 한번에 처리하는 데도 한계가 있다.

ES6에서는 비동기 처리를 위한 또 다른 패턴으로 프로미스를 도입했다.
프로미스는 전통적인 콜백 패턴이 가진 단점을 보완하며 비동기 처리 시점을 명확하게 표현할 수 있다.

<!-- more -->

## 1. 비동기 처리를 위한 콜백 패턴의 단점

### 1.1. 콜백 헬

```js
// GET 요청을 위한 비동기 함수
const get = (url) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // 서버의 응답을 콘솔에 출력한다.
      console.log(JSON.parse(xhr.response));
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};

// id가 1인 post를 취득
get("https://jsonplaceholder.typicode.com/posts/1");
/*
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere ...",
  "body": "quia et suscipit ..."
}
*/
```

위 예제의 get 함수는 서버의 응답 결과를 콘솔에 출력한다.
get 함수가 서버의 응답 결과를 반환하게 하려면 어떻게 될까?

비동기 함수를 호출하면 함수 내부의 비동기로 동작하는 코드가 완료되지 않았다 해도 기다리지 않고 즉시 종료된다.
즉, 비동기 함수 내부의 비동기로 동작하는 코드는 비동기 함수가 종료된 이후에 완료된다.
따라서 비동기 함수 내부의 비동기로 동작하는 코드에서 처리 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하면 기대한 대로 동작하지 않는다.

```js
let g = 0;

// 비동기 함수인 setTimeout 함수는 콜백 함수의 처리 결과를 외부로 반환하거나
// 상위 스코프의 변수에 할당하지 못한다.
setTimeout(() => {
  g = 100;
}, 0);
console.log(g); // 0
```

GET 요청을 전송하고 서버의 응답을 전달받는 get 함수도 비동기 함수다.
get 함수가 비동기 함수인 이유는 get 함수 내부의 onload 이벤트 핸들러가 비동기로 동작하기 때문이다.
따라서 get 함수의 onload 이벤트 핸드러에서 서버의 응답 결과를 반환하거나 상위 스코프의 변수에 할당하면 기대한대로 동작하지 않는다.

```js
// GET 요청을 위한 비동기 함수
const get = (url) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // ① 서버의 응답을 반환한다.
      return JSON.parse(xhr.response);
    }
    console.error(`${xhr.status} ${xhr.statusText}`);
  };
};

// ② id가 1인 post를 취득
const response = get("https://jsonplaceholder.typicode.com/posts/1");
console.log(response); // undefined
```

이처럼 비동기 함수는 비동기 처리 결과를 외부에 반환할 수 없고, 상위 스코프의 변수에 할당할 수도 없다.
따라서 비동기 함수의 처리 결과에 대한 후속 처리는 비동기 함수 내부에서 수행해야한다.

```js
// GET 요청을 위한 비동기 함수
const get = (url, successCallback, failureCallback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // 서버의 응답을 콜백 함수에 인수로 전달하면서 호출하여 응답에 대한 후속 처리를 한다.
      successCallback(JSON.parse(xhr.response));
    } else {
      // 에러 정보를 콜백 함수에 인수로 전달하면서 호출하여 에러 처리를 한다.
      failureCallback(xhr.status);
    }
  };
};

// id가 1인 post를 취득
// 서버의 응답에 대한 후속 처리를 위한 콜백 함수를 비동기 함수인 get에 전달해야 한다.
get("https://jsonplaceholder.typicode.com/posts/1", console.log, console.error);
/*
{
  "userId": 1,
  "id": 1,
  "title": "sunt aut facere ...",
  "body": "quia et suscipit ..."
}
*/
```

이처럼 콜백 함수를 통해 비동기 처리 결과에 대한 후속 처리를 수행하는 비동기 함수가 비동기 처리 결과를
가지고 또다시 비동기 함수를 호출해야 한다면 콜백 함수 호출이 중첩되어 복잡도가 높아지는 현상이 발생하는데,
이를 콜백 헬이라 한다.

```js
// GET 요청을 위한 비동기 함수
const get = (url, callback) => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url);
  xhr.send();

  xhr.onload = () => {
    if (xhr.status === 200) {
      // 서버의 응답을 콜백 함수에 전달하면서 호출하여 응답에 대한 후속 처리를 한다.
      callback(JSON.parse(xhr.response));
    } else {
      console.error(`${xhr.status} ${xhr.statusText}`);
    }
  };
};

const url = "https://jsonplaceholder.typicode.com";

// id가 1인 post의 userId를 취득
get(`${url}/posts/1`, ({ userId }) => {
  console.log(userId); // 1
  // post의 userId를 사용하여 user 정보를 취득
  get(`${url}/users/${userId}`, (userInfo) => {
    console.log(userInfo); // {id: 1, name: "Leanne Graham", username: "Bret",...}
  });
});
```

### 1.2. 에러 처리의 한계

비동기 처리를 위한 콜백 패턴의 문제점 중에서 가장 심각한 것은 에러 처리가 곤란하다는 것이다.

```js
try {
  setTimeout(() => {
    throw new Error("Error!");
  }, 1000);
} catch (e) {
  // 에러를 캐치하지 못한다
  console.error("캐치한 에러", e);
}
```

:::info try...catch...finally 문

에러 처리를 구현하는 방법이다. try...catch...finally 문을 실행하면 먼저 try 코드 블록이 실행된다.
이때 try 코드 블록에 포함된 문 중에서 에러가 발생하면 해당 에러는 catch 문의 err 변수에 전달되고
catch 코드 블록이 실행된다. finally 코드 블록은 에러 발생과 상관없이 반드시 한 번 실행된다.

:::

에러는 호출자 방향으로 전파된다. 즉, 콜 스택의 아래 방향으로 전파된다.

## 2. 프로미스의 생성

Promise 생성자 함수를 new 연산자와 함께 호출하면 프로미스를 생성한다.
ES6에 도입된 Promise는 호스트 객체가 아닌 ECMAScript 사양에 정의된 표준 빌트인 객체다.

Promise 생성자 함수를 new 연산자와 함께 호출하면 프로미스를 생성한다.
Promise 생성자 함수는 비동기 처리를 수행할 콜백 함수를 인수로 전달받는데 이 콜백 함수는
resolve와 reject 함수를 인수로 전달받는다.

```js
// 프로미스 생성
const promise = new Promise((resolve, reject) => {
  // Promise 함수의 콜백 함수 내부에서 비동기 처리를 수행한다.
  if (/* 비동기 처리 성공 */) {
    resolve('result');
  } else { /* 비동기 처리 실패 */
    reject('failure reason');
  }
});
```

비동기 처리가 성공하면 콜백 함수를의 인수로 전달받은 resolve 함수를 호출하고
비동기 처리가 실패하면 reject 함수를 호출한다.

```js
// GET 요청을 위한 비동기 함수
const promiseGet = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 성공적으로 응답을 전달받으면 resolve 함수를 호출한다.
        resolve(JSON.parse(xhr.response));
      } else {
        // 에러 처리를 위해 reject 함수를 호출한다.
        reject(new Error(xhr.status));
      }
    };
  });
};

// promiseGet 함수는 프로미스를 반환한다.
promiseGet("https://jsonplaceholder.typicode.com/posts/1");
```

프로미스는 다음과 같이 현재 비동기 처리가 어떻게 진행되고 있는지를 나타내는 상태 정보를 갖는다.

| 프로미스의 상태 정보 | 의미                                  | 상태 변경 조건                   |
| -------------------- | ------------------------------------- | -------------------------------- |
| pending              | 비동기 처리가 아직 수행되지 않은 상태 | 프로미스가 생성된 직후 기본 상태 |
| fulfilled            | 비동기 처리가 수행된 상태(성공)       | resolve 함수 호출                |
| rejected             | 비동기 처리가 수행된 상태(실패)       | reject 함수 호출                 |

생성된 직후 프로미스는 기본적으로 pending 상태다.
이후 비동기 처리가 수행되면 비동기 처리 결과에 따라 다음과 같이 프로미스의 상태가 변경된다.

- **비동기 처리 성공**: resolve 함수를 호출해 프로미스를 fulfilled 상태로 변경
- **비동기 처리 실패**: reject 함수를 호출해 프로미스를 rejected 상태로 변경

이처럼 프로미스의 상태는 resolve 또는 reject 함수를 호출하는 것으로 결정된다.

![그림 45-1. 프로미스의 상태][1]

fulfilled 또는 rejected 상태를 settled 상태라고 한다.
settled 상태는 fulfilled 또는 rejected 상태와 상관없이 pending이 아닌 상태로 비동기 처리가 수행된 상태를 말한다.

아래의 프로미스를 개발자 도구에서 출력해보자.

```js
// fulfilled된 프로미스
const fulfilled = new Promise((resolve) => resolve(1));
```

![그림 45-2. fulfilled된 프로미스][2]

비동기 처리가 성공하면 프로미스는 pending 상태에서 fulfilled 상태로 변화한다.

```js
// rejected된 프로미스
const rejected = new Promise((_, reject) =>
  reject(new Error("error occurred"))
);
```

![그림 45-3. rejected된 프로미스][3]

비동기 처리가 실패하면 프로미스는 pending 상태에서 rejected 상태로 변화한다.
즉, 프로미스는 비동기 처리 상태와 처리 결과를 관리하는 객체다.

## 3. 프로미스의 후속 처리 메서드

프로미스의 비동기 처리 상태가 변화하면 후속 처리 메서드에 인수로 전달한 콜백 함수가 선택적으로 호출된다.
모든 후속 처리 메서드는 프로미스를 반환하며 비동기로 동작한다.

### 3.1. Promise.prototype.then

then 메서드는 두 개의 콜백 함수를 인수로 전달받는다.

- 첫 번째 콜백 함수는 프로미스가 성공 상태가 되면 비동기 처리 결과를 인수로 전달 받는다.
- 두 번째 콜백 함수는 프로미스가 실패하면 에러를 인수로 전달받는다.

```js
// fulfilled
new Promise((resolve) => resolve("fulfilled")).then(
  (v) => console.log(v),
  (e) => console.error(e)
); // fulfilled

// rejected
new Promise((_, reject) => reject(new Error("rejected"))).then(
  (v) => console.log(v),
  (e) => console.error(e)
); // Error: rejected
```

then 메서드는 언제나 프로미스를 반환한다.
만약 then 메서드의 콜백 함수가 프로미스를 반환하면 그 프로미스를 그대로 반환하고,
콜백 함수가 프로미스가 아닌 값을 반환하면 그 값을 암묵적으로 resolve 또는 reject하여
프로미스를 생성해 반환한다.

### 3.2. Promise.prototype.catch

catch 메서드는 한 개의 콜백 함수를 인수로 전달받는다.
catch 메서드의 콜백 함수는 프로미스가 rejected 상태인 경우만 호출된다.

```js
// rejected
new Promise((_, reject) => reject(new Error("rejected"))).catch((e) =>
  console.log(e)
); // Error: rejected
```

catch 메서드는 then과 동일하게 동작한다.
따라서 then 메서드와 마찬가지로 언제나 프로미스를 반환한다.

```js
// rejected
new Promise((_, reject) => reject(new Error("rejected"))).then(undefined, (e) =>
  console.log(e)
); // Error: rejected
```

### 3.3. Promise.prototype.finally

finally 메서드는 한 개의 콜백 함수를 인수로 전달받는다. 메서드의 콜백 함수는 프로미스의 성공 또는 실패와 상관없이 무조건 한 번 호출된다.

프로미스의 상태와 상관없이 공통적으로 수행해야 할 처리 내용이 있을 때 유용하다.

```js
new Promise(() => {}).finally(() => console.log("finally")); // finally
```

```js
const promiseGet = (url) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();

    xhr.onload = () => {
      if (xhr.status === 200) {
        // 성공적으로 응답을 전달받으면 resolve 함수를 호출한다.
        resolve(JSON.parse(xhr.response));
      } else {
        // 에러 처리를 위해 reject 함수를 호출한다.
        reject(new Error(xhr.status));
      }
    };
  });
};

// promiseGet 함수는 프로미스를 반환한다.
promiseGet("https://jsonplaceholder.typicode.com/posts/1")
  .then((res) => console.log(res))
  .catch((err) => console.error(err))
  .finally(() => console.log("Bye!"));
```

## 4. 프로미스의 에러 처리

```js
const wrongUrl = "https://jsonplaceholder.typicode.com/XXX/1";

// 부적절한 URL이 지정되었기 때문에 에러가 발생한다.
promiseGet(wrongUrl).then(
  (res) => console.log(res),
  (err) => console.error(err)
); // Error: 404
```

비동기 처리에서 발생한 에러는 프로미스의 후속 처리 메서드 catch를 사용해 처리할 수도 있다.

```js
const wrongUrl = "https://jsonplaceholder.typicode.com/XXX/1";

// 부적절한 URL이 지정되었기 때문에 에러가 발생한다.
promiseGet(wrongUrl)
  .then((res) => console.log(res))
  .catch((err) => console.error(err)); // Error: 404
```

catch 메서드를 호출하면 내부적으로 then을 호출한다.

```js
const wrongUrl = "https://jsonplaceholder.typicode.com/XXX/1";

// 부적절한 URL이 지정되었기 때문에 에러가 발생한다.
promiseGet(wrongUrl)
  .then((res) => console.log(res))
  .then(undefined, (err) => console.error(err)); // Error: 404
```

단, then 메서드의 두 번째 콜백 함수는 첫 번째 콜백 함수에서 발생한 에러를 캐치하지 못하고 코드가 복잡해져서 가독성이 좋지 않다.

```js
promiseGet("https://jsonplaceholder.typicode.com/todos/1").then(
  (res) => console.xxx(res),
  (err) => console.error(err)
); // 두 번째 콜백 함수는 첫 번째 콜백 함수에서 발생한 에러를 캐치하지 못한다.
```

catch 메서드를 모든 then 메서드를 호출한 이후에 호출하면 비동기 처리에서 발생한 에러 뿐만 아니라
then 메서드 내부에서 발생한 에러까지 모두 캐치할 수 있다.

```js
promiseGet("https://jsonplaceholder.typicode.com/todos/1")
  .then((res) => console.xxx(res))
  .catch((err) => console.error(err)); // TypeError: console.xxx is not a function
```

또한 then 메서드에 두 번째 콜백 함수를 전달하는 것보다 catch 메서드를 사용하는 것이
가독성이 좋고 명확하다. 따라서 then 메서드대신 catch 메서드에서 에러처리 하는 것을 권장한다.

## 5. 프로미스 체이닝

콜백 헬에서 살펴보았듯이 비동기 처리를 위한 콜백 패턴은 콜백 헬이 발생하는 문제가 있다.
프로미스는 then, catch, finally 후속 처리 메서드를 통해 콜백 헬을 해결한다.

```js
const url = "https://jsonplaceholder.typicode.com";

// id가 1인 post의 userId를 취득
promiseGet(`${url}/posts/1`)
  // 취득한 post의 userId로 user 정보를 취득
  .then(({ userId }) => promiseGet(`${url}/users/${userId}`))
  .then((userInfo) => console.log(userInfo))
  .catch((err) => console.error(err));
```

then, catch, finally 후속 처리 메서드는 언제나 연속적으로 호출할 수 있다.
이를 프로미스 체이닝이라 한다.

| 후속처리 메서드 | 콜백 함수의 인수                                       | 후속 처리 메서드의 반환값                  |
| --------------- | ------------------------------------------------------ | ------------------------------------------ |
| then            | promiseGet 함수가 반환한 프로미스가 resolve한 값       | 콜백 함수가 반환한 프로미스                |
| then            | 첫 번째 then 메서드가 반환한 프로미스가 resolve한 값   | 콜백 함수가 반환한 값을 resolve한 프로미스 |
| catch           | promiseGet나 앞선 메서드가 반환한 프로미스가 reject 값 | 콜백 함수가 반환한 값을 resolve한 프로미스 |

프로미스는 프로미스 체이닝을 통해 비동기 처리 결과를 전달받아 후속 처리를 하므로 콜백 패턴에서 발생하던 콜백 헬이 발생하지 않는다.

다만 프로미스도 콜백 패턴을 사용하므로 콜백 함수를 사용하지 않는 것은 아니다.
이 문제는 ES8에서 도입된 async/await를 통해 해결할 수 있다.
async/await를 사용하면 프로미스의 후속처리 메서드 없이 마치 동기 처리 처럼 처리 결과를 받환하도록 구현할 수 있다.

```js
const url = "https://jsonplaceholder.typicode.com";

(async () => {
  // id가 1인 post의 userId를 취득
  const { userId } = await promiseGet(`${url}/posts/1`);

  // 취득한 post의 userId로 user 정보를 취득
  const userInfo = await promiseGet(`${url}/users/${userId}`);

  console.log(userInfo);
})();
```

async/await도 프로미스를 기반으로 동작하므로 프로미스는 잘 이해하고 있어야 한다.

## 6. 프로미스의 정적 메서드

Promise는 주로 생성자 함수로 사용되지만 함수도 객체이므로 메서드를 가질 수 있다.
Promise는 5가지 정적 메서드를 제공한다.

### 6.1. Promise.resolve / Promise.reject

Promise.resolve와 Promise.reject 메서드는 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용한다.

Promise.resolve 메서드는 인수로 전달받은 값을 resolve하는 프로미스를 생성한다.

```js
// 배열을 resolve하는 프로미스를 생성
const resolvedPromise = Promise.resolve([1, 2, 3]);
resolvedPromise.then(console.log); // [1, 2, 3]
```

위 예제는 다음 예제와 동일하게 동작한다.

```js
const resolvedPromise = new Promise((resolve) => resolve([1, 2, 3]));
resolvedPromise.then(console.log); // [1, 2, 3]
```

Promise.reject 메서드는 인수로 전달받은 값을 reject하는 프로미스를 생성한다.

```js
// 에러 객체를 reject하는 프로미스를 생성
const rejectedPromise = Promise.reject(new Error("Error!"));
rejectedPromise.catch(console.log); // Error: Error!
```

위 예제는 다음 예제와 동일하게 동작한다.

```js
const rejectedPromise = new Promise((_, reject) => reject(new Error("Error!")));
rejectedPromise.catch(console.log); // Error: Error!
```

### 6.2. Promise.all

Promise.all 메서드는 여러 개의 비동기 처리를 모두 병렬 처리할 때 사용한다.

```js
const requestData1 = () =>
  new Promise((resolve) => setTimeout(() => resolve(1), 3000));
const requestData2 = () =>
  new Promise((resolve) => setTimeout(() => resolve(2), 2000));
const requestData3 = () =>
  new Promise((resolve) => setTimeout(() => resolve(3), 1000));

// 세 개의 비동기 처리를 순차적으로 처리
const res = [];
requestData1()
  .then((data) => {
    res.push(data);
    return requestData2();
  })
  .then((data) => {
    res.push(data);
    return requestData3();
  })
  .then((data) => {
    res.push(data);
    console.log(res); // [1, 2, 3] ⇒ 약 6초 소요
  })
  .catch(console.error);
```

위 예제는 세 개의 비동기 처리를 순차적으로 처리한다.
위 예제는 비동기 처리에 3초, 2초, 1초가 소요되어 총 6초 이상이 소요된다.

그런데 위 예제의 경우 세 개의 비동기 처리는 서로 의존하지 않고 개별적으로 수행된다.
세 개의 비동기 처리를 순차적으로 처리할 필요가 없다.

Promise.all 메서드는 여러 개의 비동기 처리를 모두 병렬 처리할 때 사용한다.

```js
const requestData1 = () =>
  new Promise((resolve) => setTimeout(() => resolve(1), 3000));
const requestData2 = () =>
  new Promise((resolve) => setTimeout(() => resolve(2), 2000));
const requestData3 = () =>
  new Promise((resolve) => setTimeout(() => resolve(3), 1000));

Promise.all([requestData1(), requestData2(), requestData3()])
  .then(console.log) // [ 1, 2, 3 ] ⇒ 약 3초 소요
  .catch(console.error);
```

인수로 전달받은 배열의 모든 프로미스가 모두 fulfilled 상태가 되면 종료한다.
모든 처리에 걸리는 시간은 가장 늦게 fulfilled 상태가 되는 첫 번쨰 프로미스의 처리시간인 3초보다 조금 더 소요된다.
그리고 처리한 결과를 배열에 저장해 처리 순서가 보장된다.

Promise.all 메서드는 인수로 전달받은 배열의 프로미스가 하나라도 rejected 상태가 되면
나머지 프로미스가 fulfilled 상태가 되는 것을 기다리지 않고 즉시 종료한다.

```js
Promise.all([
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error 1")), 3000)
  ),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error 2")), 2000)
  ),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error 3")), 1000)
  ),
])
  .then(console.log)
  .catch(console.log); // Error: Error 3
```

### 6.3. Promise.race

Promise.race 메서드는 Promise.all 메서드와 동일하게 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달 받는다.
Promise.all 메서드처럼 모든 프로미스가 fulfilled 상태가 되는것을 기다리지 않고
가장 먼저 fulfilled 상태가 된 프로미스의 처리결과를 resolve하는 새로운 프로미스를 반환한다.

```js
Promise.race([
  new Promise((resolve) => setTimeout(() => resolve(1), 3000)), // 1
  new Promise((resolve) => setTimeout(() => resolve(2), 2000)), // 2
  new Promise((resolve) => setTimeout(() => resolve(3), 1000)), // 3
])
  .then(console.log) // 3
  .catch(console.log);
```

### 6.4. Promise.allSettled

Promise.allSettled 메서드는 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.

```js
Promise.allSettled([
  new Promise((resolve) => setTimeout(() => resolve(1), 2000)),
  new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Error!")), 1000)
  ),
]).then(console.log);
/*
[
  {status: "fulfilled", value: 1},
  {status: "rejected", reason: Error: Error! at <anonymous>:3:54}
]
*/
```

반환한 배열에는 fulfilled 또는 rejected 상태와 상관없이 인수로 전달받은 모든 프로미스들의 처리 결과가 모두 담겨 있다.
프로미스의 처리 결과를 나타내는 객체는 다음과 같다.

```js
[
  // 프로미스가 fulfilled 상태인 경우
  {status: "fulfilled", value: 1},
  // 프로미스가 rejected 상태인 경우
  {status: "rejected", reason: Error: Error! at <anonymous>:3:60}
]
```

## 7. 마이크로태스크 큐

```js
setTimeout(() => console.log(1), 0);

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3));
```

프로미스의 후속처리 메서드도 비동기로 동작하므로 1 -> 2 -> 3의 순으로 출력될 것처럼 보이지만
2 -> 3 -> 1의 순으로 출력된다.
프로미스의 후속 처리 메서드의 콜백 함수는 태스크 큐가 아니라 마이크로태스크 큐에 저장되기 때문이다.

마이크로태스크 큐는 태스크 큐와는 별도의 큐다. 프로미스의 후속 처리 메서드의 콜백 함수가 일시 저장된다.

이벤트 루프는 콜 스택이 비면 먼저 마이크로태스크 큐에 대기하고 있는 함수를 태스크 큐보다 먼저 가져와 실행한다.

## 8. fetch

fetch 함수에는 HTTP 요청을 전송할 URL과 HTTP 요청 메서드, HTTP 요청 헤더, 페이로드 등을 설정한 객체를 전달한다.

```js
const promise = fetch(url, [, options]);
```

fetch 함수는 HTTP 응답을 나타내는 Response 객체를 래핑한 Promise 객체를 반환한다.

```js
fetch('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => console.log(response));
```

![그림 45-4. Response 객체][4]

[1]: https://github.com/Zamoca42/blog/assets/96982072/a66568a0-ae77-4cff-b0fb-092dc7a721c7
[2]: https://github.com/Zamoca42/blog/assets/96982072/b43160a6-58ca-4de7-91af-d6c5e4b7371a
[3]: https://github.com/Zamoca42/blog/assets/96982072/30ef8828-19e8-4592-94ad-1333030d1880
[4]: https://github.com/Zamoca42/blog/assets/96982072/04eba749-6131-4ddf-a1a5-8bb8a641f349
