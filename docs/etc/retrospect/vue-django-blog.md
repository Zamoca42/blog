---
title: vue-django 블로그 개발 후기
---

로봇공학, 인공지능 강의를 들으면서 파이썬에 관심을 가지게 되었고 파이썬으로 공부를 하면서 배운 것을 어떻게 적용해볼 수 있을지 고민했습니다. 마침 인프런에서 vue-django 블로그 만들기가 눈에 들어왔고 만들어서 기술블로그로 사용할 생각으로 AWS에 배포까지 계획했습니다.
vue를 사용해 S3에 정적 웹 호스팅을 할 생각이었고 EC2에 Django 서버를 배포하고 배포 자동화까지 해보려고 계획했습니다.

![블로그 페이지](https://github.com/Zamoca42/blog/assets/96982072/176eb656-2c1c-4fef-aada-249c7ae8dc16)

프로젝트를 진행하면서 했던 생각들을 정리해보겠습니다.

## 1. Django

파이썬 프레임워크로 반복적으로 구현해야 하는 부분은 이미 만들어져있어 빠르게 서버를 만드는데 좋았습니다.
Django ORM 사용해서 DB와 쉽게 연결 할 수 있었습니다.
[ccbv](https://ccbv.co.uk/)나 [cdrf](https://www.cdrf.co/)와 같은 사이트에서 API View에 대해 어트리뷰트와 메서드를 보여주고 있었기 때문에 빠르게 파악 가능했습니다.

### Django admin

![admin_home](https://github.com/Zamoca42/blog/assets/96982072/10abdd64-b558-4baa-b01c-e2f27a40a297)

임시로 admin으로 블로그 글들을 등록하고 관리했습니다. 
편리한 기능이지만 기본 제공하는 기능 이외에 커스터마이징에 제한적이었습니다.

### REST framework

Django에서는 REST framework의 Serializer가 직렬화 및 역직렬화를 지원합니다.
기본적인 `serializers.ModelSerializer`를 상속해서 쉽게 직렬화 가능했습니다.

```python
class PostListSerializer(TaggitSerializer, serializers.ModelSerializer):
	category = serializers.CharField(source='category.name', default='New')
	tags = TagListSerializerField()
	create_dt = serializers.DateTimeField(format='%B %d, %Y')

	class Meta:
		model = Post
		fields = '__all__'

	def create(self, validated_data):
		category_name = validated_data.pop('category')['name']
		category, _ = Category.objects.get_or_create(name=category_name)

		tags = validated_data.pop('tags', [])
		instance = super().create(validated_data)
		instance.tags.set(*tags)
		return instance

	def to_representation(self, instance):
		representation = super().to_representation(instance)
		request = self.context.get('request')
		if request and request.method == 'GET':
			fields_to_omit = ['content', 'owner','modify_dt']
			for field in fields_to_omit:
				representation.pop(field, None)
		return representation
```

제네릭 뷰를 상속해 기본 CRUD 기능을 바로 사용할 수 있고 커스텀도 내가 원하는 쿼리스트링이나 필터를 사용해 줄 수 있었습니다.

```python
class PostListAPIView(generics.ListCreateAPIView):
	queryset = Post.objects.all()
	serializer_class = PostListSerializer
	filter_backends = (filters.DjangoFilterBackend,)
	filterset_class = PostFilter
```

페이지네이션도 상속만하면 쉽게 설정 가능했습니다.

```py
class PostPageNumberPagination(pagination.PageNumberPagination):
    page_size = 12

    def get_paginated_response(self, data):
      return Response(OrderedDict([
          ('postList', data),
          ('pageCnt', self.page.paginator.num_pages),
          ('curPage', self.page.number),
      ]))
```

### slack - logging

한동안 서버가 멈춘 적이 있었는데 블로그에 접속이 안되는걸 보고 알았습니다.
그래서 모니터링 도구가 필요하다고 생각해 슬랙으로 서버 로그를 볼 수 있게 추가했습니다.

**settings\.py**

```py
LOGGING = {
  'handlers': {
    'slack': {
      'class': 'apiv2.utils.SlackWebhookHandler',
      'webhook_url': SLACK_WEBHOOK_URL,
      'level': 'INFO',
      'formatter': 'standard',
    },
  }
}
```

![slack으로 서버 로깅 메세지 모니터링](https://github.com/Zamoca42/blog/assets/96982072/e73f62d4-2e82-42ea-90b7-f5af2b26955e)

## 2. Vue

![블로그 페이지](https://github.com/Zamoca42/blog/assets/96982072/176eb656-2c1c-4fef-aada-249c7ae8dc16)

![Markdown 설정](https://github.com/Zamoca42/blog/assets/96982072/b34bb194-2b5f-4d2d-8a57-d70f4b9f7f00)

생각보다 포스트를 보여주는데 있어 많은 기능이 필요했습니다.

## 3. 배포 자동화

AWS를 사용해보고 [GitHub Actions로 배포 자동화](../github-actions/)해보는 것까지 이번 프로젝트의 목표였습니다. 
배포할 때마다 반복해서 같은 작업을 해야하는데 배포를 수동으로 반복 하게되면
실수할 가능성이 있고 일관성있게 자동화해주는게 실수를 줄이고 유지보수가 편했습니다.

## 마무리

지금은 사용하고 있지 않고 GitHub Pages 블로그로 변경했습니다.
제가 저를 위해 만든 서비이지만 한 개의 주제를 길게 써야하는 시스템과 글을 길게 쓰는 재능이 없는 저와 안맞았다고 생각합니다. 그래서 공부한 것을 전부 기록한다는 목표에 맞지 않았던거 같습니다.

![사이트맵](https://github.com/Zamoca42/blog/assets/96982072/bbe4c72f-05d3-4e60-ae53-759fe30075d2)

사이트맵을 만들고 서치콘솔에 등록도 해봤지만 구글에 검색 노출이 되지않았던거 같아서 아쉬움이 많이 남습니다.

![구글 검색 인덱싱](https://github.com/Zamoca42/blog/assets/96982072/e53600fc-5ee1-4923-a599-44bd05ad75c2)

처음 열정을 가지고 몰입했던 프로젝트이기도 하고 AWS에 배포까지해보면서 전체 서비스의 흐름을 이해하는데 많은 도움이 되었다고 생각합니다. 강의만 들었을 때는 전체 서비스가 어떻게 이뤄지는지 몰랐는데 직접 경험 해보는게 이해가 더 빨랐습니다.
