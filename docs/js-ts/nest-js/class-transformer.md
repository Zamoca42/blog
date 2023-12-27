---
title: 응답 객체 직렬화하기 (class-transformer)
order: 6
category:
  - JS & TS
tag:
  - NestJS
---

요청 객체를 역직렬화 과정과 마찬가지로 클라이언트에 데이터를 전달할 때
응답 객체를 인스턴스로 변환하는데 NestJS에서는 `class-transformer`를 사용한다.

한 객체가 변경이 발생하면 해당 객체에 의존하는 다른 객체들도 변경해야 하기 때문에 이들의 변경 범위를 최소화 하기 위해 캡슐화를 사용한다.

## class-transformer 설치

```bash
npm install --save class-transformer
```

[class-transformer][class-transformer]는 class-validator와 마찬가지로 데코레이터를 기반으로한 직렬화 라이브러리다.

## 글로벌 인터셉터

모든 HTTP 요청에서 직렬화가 가능하도록 class-validator의 글로벌 파이프처럼 글로벌로 인터셉터를 추가한다.

```ts
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```

`ClassSerializerInterceptor` 클래스에서 HTTP 응답값을 중간에서 가로채
class-transformer의 `instanceToPlain()` 함수를 호출하여 JSON을 직렬화해서 반환한다.

![출처: https://slides.com/yariv-gilad/nest-js-request-lifecycle/#/1][lifecycle]

## 응답용 Dto

페이지네이션을 위한 Dto를 작성한다.

**src/common/get-pagination-list.dto.ts**

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { PaginationProps } from "./get-pagination-query.dto";

export class Page<T> {
  @Exclude() private readonly _take: number;
  @Exclude() private readonly _count: number;
  @Exclude() private readonly _results: T[];
  @Exclude() private readonly _page: number;

  constructor(pageProps: PaginationProps, count: number, results: T[]) {
    this._page = pageProps.page;
    this._take = pageProps.take;
    this._count = count;
    this._results = results;
  }

  @ApiProperty({
    description: "페이지당 항목 수가 적용된 결과 데이터",
  })
  @Expose()
  get results(): T[] {
    return this._results;
  }

  @ApiProperty({
    description: "현재 페이지",
  })
  @Expose()
  get page(): number {
    return this._page;
  }

  @ApiProperty({
    description: "총 페이지 수",
  })
  @Expose()
  get totalPage(): number {
    return Math.ceil(this._count / this._take);
  }

  @ApiProperty({
    description: "쿼리 결과 항목 수 (전체)",
  })
  @Expose()
  get queryCount(): number {
    return this._count;
  }

  @ApiProperty({
    description: "현재 페이지의 항목 수",
  })
  @Expose()
  get resultsLength(): number {
    return this._results.length;
  }

  static create<T>(
    pageProps: PaginationProps,
    count: number,
    results: T[]
  ): Page<T> {
    return new Page<T>(pageProps, count, results);
  }
}
```

1. `Exclude()`

   - 내부 멤버 변수인 take, count, page 등을 JSON 직렬화 대상에서 제외한다.
   - class-transformer의 경우 private 변수라도 직렬화를 시킬 수 있기 때문에
     노출을 원하지 않는 곳들은 모두 Exclude() 처리하는 것이 좋다.

2. `@Expose()`

   - class-transformer 의 데코레이터로, 직렬화 대상 필드를 지정한다.
   - 여기서는 모든 멤버변수는 @Exclude() 로 직렬화 대상에서 제외하고,
     온전히 노출에만 사용할 수 있는 getter 메소드에만 @Expose() 를 선언한다.

3. 정적메서드 create

   - 페이지네이션에 필요한 API 응답의 경우 정적메서드를 사용해서 페이지네이션을 적용한다.

**src/common/hashtag.controller.ts**

```ts
//...

@ApiTags("해시태그")
@Controller("hashtag")
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  @SwaggerAPI({
    name: "해시태그 목록 조회",
    model: GetHashtagListDto,
    isPagination: true,
  })
  async findAllHashtags(
    @Query() request: PaginationDto
  ): Promise<ResponseEntity<Page<GetHashtagListDto>>> {
    const [response, count] = await this.hashtagService.findAllHashtags(
      request.getPageProps()
    );

    return ResponseEntity.OK_WITH<Page<GetHashtagListDto>>(
      "해시태그 목록입니다.",
      Page.create(request.getPageProps(), count, response) //페이지네이션 적용
    );
  }
}
```

작성 후 테스트를 작성해보거나 직접 API로 요청해보고 결과를 확인할 수 있다.

```json
{
  "code": 200,
  "message": "해시태그 목록입니다.",
  "success": true,
  "data": {
    "results": [
      {
        "id": 13,
        "name": "여행"
      },
      {
        "id": 14,
        "name": "할로윈"
      },
      {
        "id": 15,
        "name": "크리스마스"
      }
      //...
    ],
    "page": 1,
    "totalPage": 2,
    "queryCount": 16,
    "resultsLength": 10
  }
}
```

[class-transformer]: https://github.com/typestack/class-transformer
[lifecycle]: https://github.com/Zamoca42/blog/assets/96982072/9decee8b-43af-4713-84af-e3969ed923a8
