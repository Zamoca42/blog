---
title: date-fns로 Date 객체 다루기
category:
  - JS & TS
tag:
  - TypeScript
  - JavaScript
---

TODO 앱을 직접 만들어보면서 오늘 날짜를 기준으로 완료 여부를 확인할 수 있는 기능을 만들어보기 위해

date-fns 라이브러리를 사용했다.

## startOfDay, endOfDay

date-fns의 startOfDay와 endOfDay 함수를 사용하면 Date 객체 기준

날짜의 시작 시간과 완료 시간을 보여주는데

오늘의 범위를 0시부터 23시 59분 기준으로 생각하고 함수를 사용하면 생각과 다른 결과가 나온다.

**내가 기대한 것**

```js
import { endOfDay, startOfDay } from "date-fns";

console.log(startOfDay(new Date()));
//2024-04-23T00:00:00.000Z

console.log(endOfDay(new Date()));
//2024-04-23T23:59:59.999Z
```

**실제 결과**

```js
import { endOfDay, startOfDay } from "date-fns";

console.log(startOfDay(new Date()));
//2024-04-22T15:00:00.000Z -> 15시..?

console.log(endOfDay(new Date()));
//2024-04-23T14:59:59.999Z
```

실제로 javascript의 Date 객체를 그대로 넣으면 0시와 23시 59분 59초와는 다른

전날 15시에서 14시 59분 59초라는 결과가 나온다.

그 이유는 date-fns에서 startOfDay의 코드를 보면 다음과 같다.

## 소스코드 확인

```js
import { toDate } from "../toDate/index.js";

export function startOfDay<DateType extends Date>(
  date: DateType | number | string,
): DateType {
  const _date = toDate(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}
```

startOfDay는 `toDate()`함수를 사용하는데 주석을 보면 로컬 타임 존을 적용한 날짜를 반환한다고 한다.

```js
/**
 * @name toDate
 //... 생략
 * @returns The parsed date in the local time zone -> 로컬 타임존으로 반환
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
```

다시 Date 객체를 확인해보면

```js
console.log(new Date().toString());
//Tue Apr 23 2024 23:30:35 GMT+0900 (대한민국 표준시)
```

Date 객체에 timezone이 적용되어 있다.

실제 결과에서 보여진 startOfDay의 15시는

**timezone이 적용된 날짜의 시작 시간을 UTC 기준 시간으로 보여준 것**이다.

## 다시 적용하기

0시부터 23시 59분 59초의 범위가 필요하다면

date-fns에서 서버에 적용된 timezone과 관계없이 UTC 기준인 날짜 객체를 생성할 수 있게 지원한다.

```shell
npm install @date-fns/utc --save
```

```js
import { endOfDay, startOfDay } from "date-fns";
import { UTCDate } from "@date-fns/utc";

console.log(startOfDay(new UTCDate()));
//2024-04-23T00:00:00.000Z

console.log(endOfDay(new UTCDate()));
//2024-04-23T23:59:59.999Z
```

다른 방법으로는 DB에 timestamp를 저장하는 방법도 있다.

timestamp는 timezone이 적용되어 있든 UTC든 상관없이 값이 같아서 헷갈리지 않는다.

```js
const UTCDate = new UTCDate().getTime();
const DateWithTimeZone = new Date();

console.log(DateWithTimeZone.toString()); // Tue Apr 23 2024 23:59:41 GMT+0900 (대한민국 표준시)
console.log(date === DateWithTimeZone.getTime()); //true
```
