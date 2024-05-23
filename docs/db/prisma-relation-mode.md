---
title: Prisma - relationMode 에러
description: prisma에서 relationMode를 설정할 때 생기는 에러에 대해 다뤘습니다.
category:
  - DB
tag:
  - Prisma
  - MySQL
  - PlanetScale
star: true
---

이번에는 MySQL 로컬환경에서 PlanetScale 서비스로 넘어가기 위한 설정을 할 때 겪었던 에러에 대해 다루려고 한다.

![VT10001 외래키 제약 에러 발생](https://github.com/Zamoca42/blog/assets/96982072/e0429b8d-12e9-45c8-9625-6d22189d91c1)

## 스키마 일부

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "mysql"
  url          = env("DATABASE_URL")
  relationMode = "prisma" // 이 옵션
}


model Routine {
  id          String    @id @default(cuid())
  title       String
  description String?
  color       String?
  trash       Boolean   @default(false)
  deletedAt   DateTime? @map(name: "deleted_at")
  createdAt   DateTime  @default(now()) @map(name: "created_at")
  updatedAt   DateTime  @updatedAt @map(name: "updated_at")

  user   User?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String @map(name: "user_id")

  @@index([userId])
  @@map("routine")
}

//...
```

## Prisma의 relationMode 옵션과 외래 키 제약 조건

Prisma의 `relationMode` 옵션은 데이터베이스에서 관계를 정의하고 생성하는 방식을 결정한다.
기본값은 `foreignKeys`이며, 이는 관계를 나타내기 위해 외래 키 제약 조건을 사용함을 의미한다.
그러나 `relationMode`를 `prisma`로 설정하면 Prisma는 자체 관계 시스템을 사용하여 관계를 관리한다.

위의 이미지에서 볼 수 있듯이, `relationMode`를 `prisma`로 설정했을 때 외래 키 제약 조건을 사용하려고 하면
"Error: VT10001: foreign key constraints are not allowed"라는 오류 메시지가 발생한다.
이는 Prisma의 `prisma` 모드에서는 외래 키 제약 조건을 지원하지 않기 때문이다.

## relationMode 옵션의 동작 방식

`relationMode` 옵션에는 두 가지 값이 있다:

1. `foreignKeys` (기본값):

   - 관계를 나타내기 위해 외래 키 제약 조건을 사용한다.
   - 데이터베이스 레벨에서 참조 무결성을 보장한다.
   - 데이터베이스 엔진이 외래 키를 지원해야 한다.

2. `prisma`:

   - Prisma의 자체 관계 시스템을 사용한다.
   - 외래 키 제약 조건 대신 Prisma의 내부 메커니즘을 사용하여 관계를 관리한다.
   - 데이터베이스 레벨에서는 외래 키 제약 조건이 적용되지 않는다.
   - 데이터베이스 엔진이 외래 키를 지원하지 않아도 사용할 수 있다.

## PlanetScale로 전환 시 relationMode 변경 이유

MySQL 환경에서 PlanetScale로 전환할 때
`relationMode`를 `prisma`로 변경한 이유는 PlanetScale의 서비스 특징 때문이다.
PlanetScale 또한 MySQL을 사용하지만 PlanetScale은 Vitess를 기반으로 하는 데이터베이스 서비스다.

:::info
[Vitess](https://vitess.io/)란?

Vitess는 대규모 MySQL 데이터베이스를 확장하고 관리하기 위해 YouTube에서 개발된 오픈 소스 데이터베이스 솔루션이다.

Vitess는 MySQL 호환 데이터베이스를 샤딩하여 여러 서버로 분산 저장하고, 복제와 자동 장애 조치를 통해 고가용성을 보장한다.
또한 들어오는 쿼리를 분석하여 적절한 샤드로 라우팅하고, 분산 환경에서의 트랜잭션 처리를 지원한다.

**확장성과 성능을 위해 외래 키 제약 조건은 지원하지 않으며**, 대신 애플리케이션 수준에서 데이터 무결성을 관리할 것을 권장한다.
Vitess의 궁극적인 목표는 대규모 데이터베이스를 유연하게 확장하고 관리하는 것이며,
이를 통해 개발자들은 데이터베이스 운영 부담을 줄이고 애플리케이션 개발에 집중할 수 있게 된다.
:::

따라서 PlanetScale에서 Prisma를 사용할 때는 `relationMode`를 `prisma`로 설정해야 한다.
이렇게 하면 Prisma의 자체 관계 시스템을 사용하여 외래 키 제약 조건 없이도 관계를 관리할 수 있다.
이는 PlanetScale의 제한 사항을 우회하고 Prisma와 호환되는 방식으로 관계를 처리할 수 있게 해준다.

## relationMode가 prisma일 때 인덱스 추가의 필요성

> 참고 링크: <https://stackoverflow.com/questions/74769279/prisma-next-auth-planetscale-foreign-key-constraints-are-not-allowed>

`relationMode`가 `prisma`로 설정되어 있을 때, Prisma는 관계 필드에 대해 자동으로 인덱스를 생성하지 않는다.
이로 인해 관계 필드를 쿼리할 때 성능 저하가 발생할 수 있다.

첨부된 이미지에서 볼 수 있듯이, 관계 필드에 인덱스가 없을 경우 Prisma는 이런 경고 메시지를 출력한다.

![relationMode를 prisma로 설정했을 때의 경고메시지](https://github.com/Zamoca42/blog/assets/96982072/e763f29f-13fc-41ba-9101-9350ce24bc71)

> "With `relationMode = "prisma"`, no foreign keys are used, so relation fields
> will not benefit from the index usually created by
> the relational database under the hood.
> This can lead to poor performance when querying these fields.
> We recommend adding an index manually."

이 경고 메시지는 `relationMode`가 `prisma`일 때 관계 필드에 인덱스를 수동으로 추가하는 것이 좋다는 것을 알려준다.
인덱스를 추가하면 관계 필드를 쿼리할 때 성능을 향상시킬 수 있다.

인덱스를 추가하려면 Prisma 스키마에서 관계 필드에 `@@index` 속성을 사용하면 된다.
예를 들어, `userId` 필드에 인덱스를 추가하려면 다음과 같이 작성할 수 있다:

```prisma
model Routine {
  // ...
  userId String @map(name: "user_id")
  // ...

  @@index([userId])
}
```

이렇게 하면 `userId` 필드에 인덱스가 생성되어 해당 필드를 기준으로 하는 쿼리의 성능이 향상될 것이다.

## 정리

Prisma의 `relationMode` 옵션은 데이터베이스에서 관계를 정의하고 생성하는 방식을 결정한다.
`foreignKeys` 모드에서는 외래 키 제약 조건을 사용하고, `prisma` 모드에서는 Prisma의 자체 관계 시스템을 사용한다.

PlanetScale로 전환할 때는 `relationMode`를 `prisma`로 설정해야 한다.
이는 PlanetScale이 외래 키 제약 조건을 지원하지 않기 때문이다.
`prisma` 모드에서는 Prisma의 자체 관계 시스템을 사용하여 외래 키 제약 조건 없이도 관계를 관리할 수 있다.

`relationMode`가 `prisma`일 때는 관계 필드에 인덱스를 수동으로 추가하는 것이 좋다.
인덱스를 추가하면 관계 필드를 쿼리할 때 성능을 향상시킬 수 있다.
인덱스는 Prisma 스키마에서 `@@index` 속성을 사용하여 추가할 수 있다.
