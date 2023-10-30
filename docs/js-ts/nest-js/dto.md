---
title: DTO (Data Transfer Object)
order: 3
---

## DTO란?

DTO(Data Transfer Object)는 **계층간 데이터 교환**을 하기 위해 사용하는 객체로 로직을 가지지 않은 순수한 데이터 객체이고 getter, setter 메서드만 가진 클래스를 의미합니다.

![Layered 아키텍쳐](https://github.com/Zamoca42/blog/assets/96982072/9460d59f-2b48-445c-85ca-23f9b7021520)

계층간 데이터 교환은 아키텍쳐에서 레이어 사이에 데이터 교환을 위한 객체를 생성해주는 것으로 이해할 수 있습니다.

- [NestJS — Architectural Pattern, Controllers, Providers, and Modules.](https://medium.com/geekculture/nest-js-architectural-pattern-controllers-providers-and-modules-406d9b192a3a)

![계층 사이에 데이터를 전달할때 객체를 DTO라고 할 수 있겠습니다](https://github.com/Zamoca42/blog/assets/96982072/6830b3db-07b6-4aca-b6e4-806842b171c8)

## 그렇다면 왜 DTO를 사용해야할까?

DTO를 사용해야 하는 이유는 Entity를 Controller와 같은 클라이언트단과 마주하는 계층에 직접 전달하기 보다는 Wrapper Class를 만들어서 도메인 모델의 정보를 외부로 노출시키지 않고 캡슐화로 보안을 강화할 수 있습니다.

Entity에서 getter만을 사용해 원하는 데이터를 표시하기 어렵기 때문에 Entity와 DTO를 분리하고 DTO에 Presentation을 위한 필드나 로직을 추가하고 Entity는 변경하지 않아서 모델링의 변경을 막습니다.

## DTO 사용하기

전에는 DTO의 예시만 보고 getter는 사용한적 없고 validator와 transformer로만 사용했었는데요. 
프로젝트를 하면서 dto에서 contructor와 getter, setter를 사용하는 방법을 알게되어 
getter함수를 사용해서 페이지네이션을 해보도록 하겠습니다.

### getter를 사용하기 전

**page-request.dto.ts**
```js
import { Transform } from 'class-transformer';
import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsNumber } from 'class-validator';

export class PageRequestDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value)
    if (isNaN(parsedValue) || parsedValue < 1) {
      return 1;
    }
    return parsedValue
  })
  @IsNumber()
  page?: number;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => {
    const parsedValue = parseInt(value)
    if (isNaN(parsedValue) || parsedValue < 10) {
      return 10;
    }
    return parsedValue
  })
  @Type(() => Number)
   perPage?: number;
}
```
처음에 이렇게 작성을 하고 pagination을 하고 서비스 로직에서 페이지와 offset을 컨트롤 했습니다.

**project.service.ts**
```js
//...
  const skip = (page - 1) * perPage; // -> page offset
  const [totalArticleCount, articles] = await Promise.all([
    this.articleModel.countDocuments({}),
    this.articleModel
      .find(mongoQuery)
      .sort({ [sort]: order })
      .skip(skip)
      .limit(perPage)
      .exec()
  ]);
  const totalPage = Math.ceil(totalArticleCount / perPage); // 전체 페이지 수
  const articleDtos = articles.map((article) =>
    plainToClass(GetArticleResDto, article, { excludeExtraneousValues: true })
  );
//...
```

이 후에 DTO에서 constructor와 getter 사용 방법을 알게 되었습니다.
DTO에서 getter 함수를 사용 페이지에 대한 offset을 보여주는 계산을 DTO로 이동할 수 있습니다.

서비스 로직에 작성했던 skip을 dto로 옮기고, `PageRequestDto`에서 @Transform()으로 사용했던 
page에 대한 쿼리 스트링이 없을 때 기본으로 숫자 1로 반환하던 함수도 getter로 이동해보겠습니다.

```js
const skip = (page - 1) * perPage; // -> getter로 이동
```

```js
//...
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  @Transform(({ value }) => { //-> 이 부분을 getter로 이동
    const parsedValue = parseInt(value)
    if (isNaN(parsedValue) || parsedValue < 1) {
      return 1;
    }
    return parsedValue
  })
  @IsNumber()
  page?: number;
//..
```

```js
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class RequestPaginatedQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  perPage?: number;

  constructor(
    page?: number,
    perPage?: number,
  ) {
    this.page = page;
    this.perPage = perPage;
  }

  get skip(): number {
    return this.page <= 0 ? (this.page = 0) : (this.page - 1) * this.perPage;
  } //-> const skip = (page - 1) * perPage; // page offset

  validatePaginateQuery() {
    this.validatePage();
    this.validateTake();

    return this;
  }

  private validateTake(): void {
    this.perPage = this.perPage && this.perPage >= 1 ? this.perPage : 10;
  } // -> @transform()을 사용했던 기본 페이지 항목 반환

  private validatePage(): void {
    this.page = this.page && this.page >= 1 ? this.page : 1;
  } // -> @transform()을 사용했던 기본 페이지 수 반환
}
```

이제 서비스 로직에서 DTO에서 getter함수로 사용한 skip을 전달 해보겠습니다.

**project.service.ts**

```js
@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>,
  ) { }

  async getPaginatedArticleList(request: RequestPaginatedQueryDto): Promise<Page<GetArticleResDto>> {
    const { page, perPage, skip } = request // -> getter skip 전달

    const articles = await this.articleModel.find({})
        .skip(skip) //-> 여기서 page offset 전달
        .limit(perPage)
        .lean();

    const articleDtos = articles.map((article) =>
      plainToClass(GetArticleResDto, article, { excludeExtraneousValues: true })
    );

    const totalPage = Math.ceil(totalArticleCount / perPage);

    return new Page<GetArticleResDto>(page, totalPage, articleDtos)
  }
}
```

이렇게 서비스 로직에 getter함수로 선언했던 pageoffset인 skip을 쿼리에 전달할 수 있습니다.
같은 방법으로 총 페이지수를 반환하는 totalPage도 dto로 옮겨볼 수 있을 것 같습니다.

```js
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) { }

@Get()
  async getPaginatedList(
    @Query()
    request: RequestPaginatedQueryDto,
  ): Promise<Page<GetArticleResDto>> {
    return await this.articleService.getPaginatedArticleList(
      request.validatePaginateQuery() // 페이지 쿼리 전달
    );
  }
}
```

컨트롤러에서도 쿼리 매개변수로 request에 앞서 작성한 DTO를 사용하고 postman으로 요청을 보낸다면 이렇게 나옵니다.

![DTO에 type을 해서 서비스에 쿼리를 전달하면 이렇게 사용할 수도 있습니다.](https://github.com/Zamoca42/blog/assets/96982072/7c798fc3-a855-4a0b-8242-ccae790ae195)

로컬 데이터베이스에 임시로 만든 데이터에 facebook타입을 가진 5페이지의 항목은 1개가 존재하는 것을 확인할 수 있습니다. 이렇게 pagination으로 쿼리를 할 수 있지만 데이터 베이스에 쿼리하고 싶은 다른 내용을 dto에 추가할 수 있습니다.

```js
import { Type } from 'class-transformer';
import { IsOptional, IsInt, IsString } from 'class-validator';

export class RequestPaginatedQueryDto {
  @IsInt()
  @Type(() => Number)
  @IsOptional()
  page?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  perPage?: number;

  @IsString()
  @IsOptional()
  @Type(() => String)
  type?: string; //-> SNS 타입을 추가

  constructor(
    type?: string,
    page?: number,
    perPage?: number,
  ) {
    this.type = type;
    this.page = page;
    this.perPage = perPage;
  }

  // 생략...
}
```

이렇게하고 서비스 로직에서 type을 추가해서 데이터베이스에 쿼리를 하면 되겠습니다.
