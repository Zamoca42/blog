---
title: TypeORM - DISTINCT
description: TypeORM에서 목록 조회시 DISTINCT 쿼리가 생기는 이유에 대해 정리했다.
category:
  - DB
tag:
  - Database
  - TypeORM
  - ORM
  - NestJS
star: true
---

TypeORM을 사용해서 개발하다보면 페이지네이션 처리를 해야하는 경우가 생긴다.
이 때 목록 조회 API를 구현하고 요청할 때 SQL문을 보면 SELECT 쿼리에 DISTINCT가 들어있는 경우가 있다.

![유저 목록 조회시 DISTINCT 쿼리가 생기는 것을 볼 수 있다.](https://github.com/Zamoca42/blog/assets/96982072/f109a7a3-0fe3-43da-9d7b-5cc149e79553)

SELECT DISTINCT 쿼리는 왜 생기는지 궁금하여 찾아보다가 나온 정보들을 이번 포스트에서 정리하려고한다.

## DISTINCT 쿼리란?

DISTINCT는 SQL에서 데이터의 중복을 제거하는 쿼리문이다.
중복을 제거하는 쿼리문에는 대표적으로 DISTINCT와 GROUP BY가 있는데 DISTINCT는 중복을 없애주지만
정렬은 해주지 않는다는 특징이 있다.
GROUP BY는 데이터를 그룹화하면서 정렬도 수행하기 때문에 데이터 요약에 사용한다.

그렇다면 TypeORM에서는 페이지네이션할 때 DISTINCT를 사용하는 이유가 뭘까?

## 왜 생기는 걸까?

유저 목록 조회 API를 작성하면서 만든 유저 레포지토리의 옵션을 살펴보자.

```ts
@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    const baseRepository = dataSource.getRepository(User);
    super(
      baseRepository.target,
      baseRepository.manager,
      baseRepository.queryRunner
    );
  }

  findUserByOptionAndCount(page: PaginationProps): Promise<[User[], number]> {
    const options = this.findUserManyOptions(new User());
    const { take, skip } = page;
    return this.findAndCount({ take, skip, ...options });
  }
}
```

페이지네이션을 위해 findAndCount 메서드를 사용했다.
해당 메서드의 findManyOptions 프로퍼티에는 take와 skip이 존재한다.

findOne과 같은 단일 조회에서 파라미터에서 옵션과의 차이는 take와 skip밖에 없다.
findOne에서는 조회시 DISTINCT같은 쿼리가 발생하지 않는다.

take, skip을 사용했을 때 DISTINCT가 발생한다고 의심할 수 밖에 없다.

## take, skip 와 limit, offset

> 참고링크
>
> :pushpin: <https://github.com/typeorm/typeorm/issues/4998>

TypeORM 이슈를 보면 skip과 take를 사용했을 때 DISTINCT를 사용해서 중복을 제거하고,
데이터베이스 캐시로 웜업해서 쿼리 속도를 빠르게 하려고 한다는 것으로 이해했다.

DISTINCT를 사용하는 것을 원하지 않으면 쿼리빌더의 limit, offset을 사용해야한다.
하지만 limit을 사용했을 경우에는 SELECT시 limit을 먼저 실행한 후 join을 실행하기 때문에 원하는 값이 나오지 않을 수 있다.
반면에 take은 SELECT 전에 join까지 적용하여 페이지네이션 한다는 차이가 있다.

## 마무리

![유저 목록 조회의 쿼리 퍼포먼스 확인](https://github.com/Zamoca42/blog/assets/96982072/275e43b5-c84a-4cd7-ba2e-fd71e1d75b93)

DISTINCT 쿼리를 사용하면 중복제거를 실행하기 때문에 쿼리 속도에 영향이 있다고 한다.

센트리의 퍼포먼스 모니터를 열어서 유저 목록 조회의 쿼리 퍼포먼스를 확인해보면 평균 13ms의 쿼리속도가 나오는데,
현재까지는 skip, take를 사용해서 발생하는 문제는 없는거 같다.

TypeORM에서 제공하는 메서드를 이용해서 take, skip을 사용할지, 직접 쿼리 빌더를 사용할지는
단점과 장점이 있겠지만 나는 간단하게 사용할 수 있는 전자를 선호한다.
