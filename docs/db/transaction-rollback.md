---
title: 트랜잭션 롤백 해결하기
description: 1:N 관계에서 수정을 요청하면서 발생한 트랜잭션 롤백을 해결하는 과정입니다.
category:
  - DB
tag:
  - Database
  - TypeORM
  - ORM
  - NestJS
---

현재 진행중인 프로젝트에서 이벤트를 생성하고 수정하는 기능을 만들려고한다.

생성할때는 문제가 없었지만 이벤트를 수정하려고 할때 1:N 관계인 이벤트의 이미지와 해시태그를
수정할 때 pk키를 못찾거나 수정에 실패해서 트랜잭션이 롤백되고 있었다.

![이벤트 이미지 수정 시 트랜잭션 롤백이 발생한다](https://github.com/Zamoca42/blog/assets/96982072/74f75939-7aad-418b-966f-d839c47c8bde)

![이벤트 관련 테이블](https://github.com/Zamoca42/blog/assets/96982072/84b03205-12b1-44bd-ba2a-a55f4e12da42)

**src/event/event.entity.ts**

```ts
@Entity("event")
export class Events extends BaseDateEntity {
  //...

  @OneToMany(() => EventImage, (eventImage: EventImage) => eventImage.event, {
    cascade: true,
  })
  eventImages: EventImage[];

  //...
}
```

```json
// GET api/event/28
{
  "code": 200,
  "message": "요청한 이벤트 정보를 조회합니다.",
  "success": true,
  "data": {
    "id": 28,
    "title": "string",
    "content": "string",
    "mainThumbnailUrl": "string",
    "brandName": "string",
    "hashtags": ["캐릭터"],
    "images": ["https://example.com"]
  }
}
```

```json
// PATCH api/event/28
{
  "images": ["https://example2.com"] // 수정 시 트랜잭션 오류가 발생한다.
}
```

## 트랜잭션이란?

트랜잭션에 대해서 설명하면 컴퓨터 과학 분야에서의 트랜잭션(Transaction)은 "더이상 분할이 불가능한 업무처리의 단위"를 의미한다.

이것은 하나의 작업을 위해 더이상 분할될 수 없는 명령들의 모음,
즉, 한꺼번에 수행되어야 할 일련의 연산모음을 의미한다.

```sql
START TRANSACTION
    -- 이 블록안의 명령어들은 마치 하나의 명령어 처럼 처리됨
    -- 성공하던지, 다 실패하던지 둘중 하나가 됨.
    A의 계좌로부터 인출;
    B의 계좌로 입금;
COMMIT
```

이와 같이, 데이터베이스와 어플리케이션의 데이터 거래(Transaction)에 있어서 안전성을 확보하기 위한 방법이 트랜잭션인 것이다.

따라서 데이터베이스에서 테이블의 데이터를 읽어 온 후 다른 테이블에 데이터를 입력하거나 갱신, 삭제하는 도중에 오류가 발생하면,
결과를 재반영 하는 것이 아니라 모든 작업을 원상태로 복구하고, 처리 과정이 모두 성공하였을때 만 그 결과를 반영한다.
트랜잭션(Transaction)의 사전적 의미는 거래이고,
컴퓨터 과학 분야에서의 트랜잭션(Transaction)은 "더이상 분할이 불가능한 업무처리의 단위"를 의미한다.

출처: <https://inpa.tistory.com/entry/MYSQL-📚-트랜잭션Transaction-이란-💯-정리>

## 원인

이벤트를 수정할 때 TypeORM 레포지토리에서 update 메서드를 사용하고 있었다.

**src/event/event.service.ts**

```ts
@Injectable()
export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * @param id - 이벤트 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그
   *       - 이벤트와 이벤트 관련 해시태그 수정
   *       - 이벤트 이미지를 여러장 수정
   */
  async updateEvent(
    id: number,
    updateProps: EventUpdateProps
  ): Promise<boolean> {
    const eventId = Events.byId(id);
    const isExistEvent = this.eventRepository.hasId(eventId);

    if (!isExistEvent) {
      throw new NotFoundException("업데이트할 이벤트가 없습니다.");
    }

    await this.eventRepository.update(eventId, {
      id,
      ...updateProps,
    });

    return true;
  }
}
```

update 메서드에 대한 설명을 읽어보면 다음과 같다

```ts
/**
 * Updates entity partially. Entity can be found by a given conditions.
 * Unlike save method executes a primitive operation without cascades, relations and other operations included.
 * Executes fast and efficient UPDATE query.
 * Does not check if entity exist in the database.
 */
update(criteria: string | string[] | number | number[] | Date | Date[] | ObjectId | ObjectId[] | FindOptionsWhere<Entity>, partialEntity: QueryDeepPartialEntity<Entity>): Promise<UpdateResult>;
```

```text
Unlike save method executes a primitive operation without cascades, relations and other operations included.
```

update에 작성된 주석의 2번째에 cascades나 관계된 테이블을 포함한 수정은 지원하지 않는거같다.
이벤트와 관계된 테이블의 row를 수정해야할 때는 save 메서드를 사용해야한다는 뜻이다.

사실 update -> save로 변경한다고해도 바뀌는건 없다.
**save로 변경해야하는건 맞지만 여전히 쿼리에서 UPDATE를 실행해서 CONFLICT가 발생해 트랜잭션 롤백이 발생한다.**

## 해결

![TypeORM 깃헙 이슈에서 발견](https://github.com/Zamoca42/blog/assets/96982072/5b2623ff-756b-4381-9894-cbf6d4eb72c9)

관계된 테이블에서 CONFLICT를 해결할 옵션이 없다는게 아쉽지만 엔티티에서 `{orphanedRowAction: 'delete'}` 옵션으로
UPDATE를 대신 관계된 Row를 모두 삭제하고 다시 INSERT 하는 방법을 선택했다.

**src/event/event.entity.ts**

```ts
@Entity("event")
export class Events extends BaseDateEntity {
  //...

  @OneToMany(() => EventImage, (eventImage: EventImage) => eventImage.event, {
    cascade: true,
    orphanedRowAction: "delete", // 옵션을 추가한다.
  })
  eventImages: EventImage[];

  //...
}
```

**src/event/event.service.ts**

```ts
@Injectable()
export class EventService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly eventRepository: EventRepository,
    private readonly photoBoothService: PhotoBoothService
  ) {}

  /**
   * @param id - 이벤트 id
   * @param updateProps - 수정이 필요한 데이터 일부
   * @desc - 제목, 내용, 업체명, 대표이미지, 시작일, 마감일, 공개여부, 해시태그
   *       - 이벤트와 이벤트 관련 해시태그 수정
   *       - 이벤트 이미지를 여러장 수정
   */
  async updateEventWithHastags(
    id: number,
    updateProps: EventUpdateProps
  ): Promise<boolean> {
    const eventId = Events.byId(id);
    const isExistEvent = this.eventRepository.hasId(eventId);

    if (!isExistEvent) {
      throw new NotFoundException("업데이트할 이벤트가 없습니다.");
    }

    const [photoBoothBrand, eventImages] = await this.prepareEventAttributes(
      updateProps
    );

    await this.eventRepository.save(
      //-> update에서 save로 변경
      {
        id,
        eventImages,
        photoBoothBrand,
        ...updateProps,
      }
    );

    return true;
  }

  /**
   * @param props - 이벤트 생성 및 수정에 필요한 속성들
   * @desc  - 이벤트 관련 업체명 가져오기
   *        - 이벤트 관련 해시태그 가져오기
   *        - 이벤트 이미지 엔티티에 이벤트 이미지를 삽입
   */
  private prepareEventAttributes(
    props: EventCreateProps | EventUpdateProps
  ): Promise<[PhotoBoothBrand, EventImage[]]> {
    return Promise.all([
      this.photoBoothService.findOneBrandByName(props.brandName),
      props.images?.map((image) => EventImage.create(image)),
    ]);
  }
}
```

다시 한번 수정을 요청해보면 트랜잭션이 성공한 것을 볼 수 있다.

![커밋된 트랜잭션 확인](https://github.com/Zamoca42/blog/assets/96982072/9ee842f3-c26e-4fc5-b6b6-09bded4f3339)
