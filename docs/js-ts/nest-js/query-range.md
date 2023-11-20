---
title: 맛집 목록 가져와서 지도에 표시하기
category:
  - JS & TS
tag:
  - NestJS
  - Project
---

공공데이터로 맛집 목록을 받아와서 지도에 내 위치 주변 맛집을 보여주는 API를 만들었습니다.

> 해당 프로젝트 링크: <https://github.com/pre-onboarding-backend-G/feed-me-baby>

제가 맡은 부분은 전처리된 데이터를 가져와서 맛집 목록을 지도에 표시할 수 있게 반환하는 부분입니다.

여러 방법이 있겠지만 처음에는 맛집 목록을 내 위치 기준으로 범위만큼 위도나 경도를 빼거나 더해서 가져왔습니다.

**restaurant-guide.repository.ts (findRestaurantsInRange) 메서드**

```ts
//쿼리 빌더..
 .where(
        'latitude >= :minLat AND latitude <= :maxLat AND longitude >= :minLon AND longitude <= :maxLon',
        { minLat, maxLat, minLon, maxLon },
      )
```

![스크린샷 2023-11-04 오후 7 42 18](https://github.com/pre-onboarding-backend-G/feed-me-baby/assets/96982072/4b3ee3fd-3192-4a96-9840-5e36f6bfe09e)

범위 쿼리만 작성 했을 때는 지도에서 검색 범위가 네모형태로 보여집니다.

그 다음 목록들을 배열 메서드 filter로 거리에 벗어난 부분을 제외했습니다.

**restaurant-guide.service.ts (getRestaurantList) 메서드**

```ts
// 쿼리 메서드..
 return restaurants.filter((restaurant) => {
      const distance1 = Math.sqrt(
        Math.pow(request.lat - restaurant.lat, 2) +
        Math.pow(request.lon - restaurant.lon, 2),
      );
      const distance2 = Math.sqrt(Math.pow(request.validateRange, 2));

      return distance1 <= distance2;
 }
```

![맛집 목록을 위치 기준 범위 만큼 제외한 후의 모습](https://github.com/pre-onboarding-backend-G/feed-me-baby/assets/96982072/7a7b2d28-ee00-4cc9-90d6-10fea6766ac7)

![범위를 늘렸을 때](https://github.com/pre-onboarding-backend-G/feed-me-baby/assets/96982072/3dcf95de-6640-4f9b-9c3e-27b7652f9832)

거리상 1도는 약 100km로 계산해서 0.01을 1km로 계산해 위도, 경도에서 범위만큼 더하거나 빼서
범위를 설정했습니다.

```ts
export class CoordinateBoundDto {
  private readonly lat?: number;
  private readonly lon?: number;
  private readonly range?: number;

  constructor(lat?: number, lon?: number, range?: number) {
    this.lat = lat;
    this.lon = lon;
    this.range = range; //-> 0.01(1km) ~ 0.03(3km)의 값
  }

  get minLat(): number {
    return this.lat - this.range;
  }

  get maxLat(): number {
    return this.lat + this.range;
  }

  get minLon(): number {
    return this.lon - this.range;
  }

  get maxLon(): number {
    return this.lon + this.range;
  }
}
```

위도, 경도에 둘 다 적용 가능하지만 위도의 1도의 거리와 경도의 1도의 거리는 차이가 있습니다.

그래서 최종 geojson에서 확인하면 타원이나 직사각형으로 보이는 현상이 있었습니다.

#### 참고 링크

- [geojson](http://geojson.io/#map=2/0/20)
- [위도, 경도의 1도당 거리차이](https://m.cafe.daum.net/GPSGIS/Lrtt/1447)
