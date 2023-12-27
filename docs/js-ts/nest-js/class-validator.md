---
title: 요청 객체 역직렬화하기
order: 5
category:
  - JS & TS
tag:
  - NestJS
  - Class-Validator
---

클라이언트에서 HTTP 요청시 JSON이나 쿼리스트링의 경우 클래스 인스턴스로 변환하는 역직렬화와 유효성 검사과정이 필요하다.

이 부분은 `class-validator` 패키지가 필요하다.
[`class-validator`][class-validator]는 데코레이터를 기반으로 Dto들의 검증을 담당한다.

## class-validator 설치

```bash
npm install --save class-validator
```

## 글로벌 파이프

파이프는 요청 객체를 원하는 형식으로 변환하고, 데이터가 유효하지 않은 경우 예외처리를 목적으로 사용한다.
부트스트랩에서 `useGlobalPipes` 설정으로 `ValidationPipe`를 설정해 전역으로 파이프 설정을 사용할 수 있다.

**src/main.ts**

```ts
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const pipeOptions: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
  };

  //...
  app.useGlobalPipes(new ValidationPipe(pipeOptions));
  //...
  await app.listen(+process.env.APP_SERVER_PORT);
}
```

이렇게 파이프를 등록하면 객체를 `plainToInstance`로 변환할 필요가 없다.

**src/review/review.service.ts**

```ts
//...

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  //...

  /**
   * @param id - 삭제할 리뷰 id
   * @desc 해당 리뷰의 is_deleted 컬럼을 true로 수정 (soft)
   */
  async removeReview(id: number): Promise<boolean> {
    const isExistReview = this.reviewRepository.hasId(Review.byId(id));

    if (!isExistReview) {
      throw new NotFoundException("리뷰를 찾지 못했습니다.");
    }

    await this.reviewRepository.save(
      plainToInstance(Review, { id, isDeleted: true })
    ); // 요청받은 객체를 인스턴스로 변환

    return true;
  }
}
```

아래와 같이 `plainToInstance` 없이 곧바로 인스턴스를 사용할 수 있다.

```ts
//...

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  //...

  /**
   * @param id - 삭제할 리뷰 id
   * @desc 해당 리뷰의 is_deleted 컬럼을 true로 수정 (soft)
   */
  async removeReview(id: number): Promise<boolean> {
    const isExistReview = this.reviewRepository.hasId(Review.byId(id));

    if (!isExistReview) {
      throw new NotFoundException("리뷰를 찾지 못했습니다.");
    }

    await this.reviewRepository.save({ id, isDeleted: true }); //전역 파이프 설정 후 plainToInstance 제거

    return true;
  }
}
```

## 유효성 검사

데코레이터를 사용해서 Dto에서 쿼리스트링이나 요청 데이터가 유효한지 검사할 수 있다.

**src/common/get-pagination-query.dto.ts**

```ts
import { ApiProperty } from "@nestjs/swagger";
import { Expose, Type } from "class-transformer";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export interface PaginationProps {
  take: number;
  skip: number;
  page: number;
}

export class PaginationDto implements PaginationProps {
  @ApiProperty({
    description: "리스트에 요구할 페이지 숫자",
    required: true,
    example: 1,
    default: 1,
  })
  @IsInt()
  @Min(0)
  @Type(() => Number)
  @IsNotEmpty()
  @Expose()
  page: number;

  @ApiProperty({
    description: "리스트에 요구할 페이지당 항목 수",
    required: true,
    example: 10,
    default: 10,
  })
  @IsInt()
  @Min(0)
  @IsNotEmpty()
  @Type(() => Number)
  @Expose()
  perPage: number;

  get skip(): number {
    return this.page < 0 ? 0 : (this.page - 1) * (this.perPage ?? 10);
  }

  get take(): number {
    return this.perPage || 10;
  }

  getPageProps(): PaginationProps {
    return {
      take: this.take,
      skip: this.skip,
      page: this.page,
    };
  }

  decodeString(encodedString: string): string {
    if (typeof encodedString === "undefined") return undefined;
    return decodeURIComponent(encodedString);
  }
}
```

**src/hashtag/hashtag.controller.ts**

```ts
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
      Page.create(request.getPageProps(), count, response)
    );
  }
}
```

유효성 검사가 잘 작동하는지 테스트코드를 작성하거나 동적테스트를 해볼 수 있다.

![perPage에 0이하의 값을 넣으면 400 에러가 발생한다.](https://github.com/develop-pix/dump-in-Admin-BE/assets/96982072/f00427ae-040c-416b-aea9-1bcf5ab218eb)

[class-validator]: https://github.com/typestack/class-validator
