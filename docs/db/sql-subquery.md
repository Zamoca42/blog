---
title: SQL-subquery
category:
  - DB
tag:
  - Subquery
---

> <https://youtu.be/lwmwlA2WhFc?si=Szgl3bDlly7CF266>

서브쿼리(subquery)란 nested query 또는 inner query 라고 불리며
SELECT, INSERT, UPDATE, DELETE 쿼리문에 포함된 쿼리를 말한다.

서브쿼리는 쿼리문 내에서 괄호`()`안에 기술된다.

서브쿼리의 종류에는 IN, ANY, ALL, EXISTS 등이 있다.

| 이름   | 설명                                       |
| ------ | ------------------------------------------ |
| IN     | 결과중 하나라도 일치하면 TRUE              |
| ANY    | 결과와 하나 이상 일치                      |
| ALL    | 결과와 모든 값이 일치                      |
| EXISTS | 결과 중에서 값이 최소 하나라도 있으면 TRUE |
| NOT ~  | 결과의 값과 값이 다르다면 TRUE             |

## 예제 테이블

**Department**

- column
  - id, name, leader_id

**Employee**

- column
  - id, name, birth_date, sex, positon, salary, dept_id(department)

**Project**

- column
  - id, name, leader_id, start_date, end_date

**Works_on**

- column
  - empl_id(employee), proj_id(project)

## SELECT with subquery 예제

**예제1: ID가 14인 임직원보다 생일이 빠른 임직원의 ID, 이름, 생일을 알고 싶다.**

```sql
SELECT birth_date FROM employee WHERE id = 14;
```

```sql
SELECT id, name, birth_date FROM employee WHERE birth_date < '1992-08-04';
```

서브쿼리를 사용하지 않으면 두 개의 쿼리를 순차적으로 실행해서 결과를 찾아야한다.

```sql
SELECT id, name, birth_date FROM employee WHERE birth_date < (SELECT birth_date FROM employee WHERE id = 14);
```

서브쿼리를 이용하면 두 개의 쿼리를 하나로 합쳐서 하나의 쿼리로 실행해 결과를 찾는다.

### IN 사용 예제

**예제2: ID가 5인 임직원과 같은 프로젝트에 참여한 임직원들의 ID를 알고 싶다.**

ID가 5인 임직원의 프로젝트 id를 찾는 쿼리

```sql
SELECT proj_id FROM works_on WHERE empl_id = 5;
```

프로젝트 id가 2001, 2002이고 임직원 아이디가 5인 것을 제외한 임직원 아이디를 찾는 쿼리

```sql
SELECT DISTINCT empl_id FROM works_on WHERE empl_id != 5 AND proj_id IN (2001, 2002);
```

이 두 쿼리를 하나의 쿼리로 정보를 찾을 수 있다.

```sql
SELECT DISTINCT empl_id FROM works_on -- outer 쿼리
WHERE empl_id != 5 AND proj_id IN (
  SELECT proj_id FROM works_on WHERE empl_id = 5
);
```

**예제2-1: ID가 5인 임직원과 같은 프로젝트에 참여한 임직원들의 ID와 이름을 알고 싶다.**

위의 예제에서 쿼리 결과는 임직원들의 ID밖에 알 수 없다.
그렇다면 id와 이름을 알 수 있는 방법은 works_on 테이블을 쿼리해서 나온 결과를 다시 employee 테이블에 쿼리하는 것이다.

```sql
SELECT id, name
FROM employee,
  (
    SELECT DISTINCT empl_id FROM works_on -- 예제 2의 쿼리
    WHERE empl_id != 5 AND proj_id IN (
      SELECT proj_id FROM works_on WHERE empl_id = 5
    )
  ) AS DSTNCT_E
WHERE id = DSTNCT_E.empl_id;
```

### EXISTS 사용 예제

**예제3: ID가 7 혹은 12인 임직원이 참여한 프로젝트의 ID와 이름을 알고 싶다.**

```sql
SELECT P.id, P.name
FROM project AS P
WHERE EXISTS (
  SELECT *
  FROM works_on AS W
  WHERE W.proj_id = P.id AND W.empl_id IN (7, 12)
);
```

서브쿼리에 있는 `W.proj_id = P.id`에서 P.id는 outer 쿼리에있는 project의 단축어인 P이다.
서브쿼리가 바깥쪽 query의 attribute를 참조할 때, 상관 서브쿼리(correlated subquery)라고 부른다.

또 다른 방법으로 EXISTS가 있는 부분을 IN으로 바꿔줄 수도 있다.

```sql
SELECT P.id, P.name
FROM project AS P
WHERE id IN ( -- EXISTS를 IN으로 변경
  SELECT W.proj_id
  FROM works_on AS W
  WHERE W.empl_id IN (7, 12)
);
```

위의 두 개의 쿼리문은 같은 결과를 반환한다.
이렇게 EXISTS와 IN은 바꿔서 사용할 수 있다.

### NOT EXISTS 사용 예제

NOT EXISTS는 서브쿼리의 결과가 단 하나의 row도 없다면 TRUE를 반환한다.

**예제4: 2000년대생이 없는 부서의 ID와 이름을 알고 싶다.**

```sql
SELECT D.id, D.name
FROM department AS D
WHERE NOT EXISTS (
  SELECT *
  FROM employee AS E
  WHERE E.dept_id = D.id AND E.birth_date >= '2000-01-01'
);
```

이 쿼리문도 마찬가지로 NOT IN으로 바꿀 수 있다.

```sql
SELECT D.id, D.name
FROM department AS D
WHERE D.id NOT IN (
  SELECT E.dept_id
  FROM employee AS E
  WHERE E.birth_date >= '2000-01-01'
);
```

### ANY 사용 예제

**예제5: 리더보다 높은 연봉을 받는 부서원을 가진 리더의 ID와 이름, 연봉을 알고 싶다.**

```sql
SELECT E.id, E.name, E.salary
FROM department AS D, employee AS E
WHERE D.leader_id AND E.salary < ANY( -- ANY는 비교연산자와 함께 사용, 단 하나라도 True라면 True
  SELECT salary
  FROM employee
  WHERE id <> D.leader_id AND dept_id = E.dept_id -- <> 연산자는 != 연산자와 같다
);
```

### ALL 사용 예제

**예제5: ID가 13인 임직원과 한번도 같은 프로젝트에 참여하지 못한 임직원들의 ID,이름,직군을 알고 싶다.**

```sql
SELECT DISTINCT E.id, E.name, E.position
FROM employee AS E, works_on AS W
WHERE E.id = W.empl_id AND W.proj_id <> ALL( -- 비교 연산이 모두 True라면 True를 반환
  SELECT proj_id
  FROM works_on
  WHERE empl_id = 13
);
```

## IN vs EXISTS

RDBMS의 종류와 버전에 따라 다르며 최근 버전은 많은 개선이 이루어져 IN과 EXISTS의 성능 차이가 거의 없다.
