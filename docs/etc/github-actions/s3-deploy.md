---
title: S3에 정적 웹페이지 배포하기
order: 3
---

AWS S3 버킷에 vue로 빌드한 페이지를 정적 웹 사이트로 호스팅할 수 있습니다.

- [Amazon S3를 사용하여 정적 웹 사이트 호스팅](https://docs.aws.amazon.com/ko_kr/AmazonS3/latest/userguide/WebsiteHosting.html?icmpid=docs_amazons3_console)

S3 버킷을 정적 웹사이트로 호스팅하기 위해서는 다음과 같은 설정이 필요합니다.

1. 퍼블릭 액세스 설정
2. 버킷 정책 설정
3. CORS 설정

이렇게 버킷을 설정하는 방법을 알아보고 GitHub Actions에서 배포 설정을 자동화 해보겠습니다.

## 버킷 만들고 정적 웹 호스팅 활성화

AWS S3로 이동해서 버킷만들기를 눌러서 버킷이름을 설정하고 버킷을 생성합니다. 
버킷 이름만 설정하고 만들어도 나중에 설정들은 모두 변경할 수 있습니다.

![버킷을 만든 후 모습](https://github.com/Zamoca42/blog/assets/96982072/cb8e241b-53e4-42fc-b5a9-bb1240671e5e)

정적 웹페이지를 사용할 버킷을 눌러서 들어간 후 속성 탭으로 들어가서 맨아래 정적 웹 호스팅을 활성화합니다.

![버킷의 속성 탭](https://github.com/Zamoca42/blog/assets/96982072/b9837bce-bf0b-4237-a306-0d9a732c82ae)

![비활성화 된 모습](https://github.com/Zamoca42/blog/assets/96982072/ae07f41b-9612-467b-8a91-c400d9694572)

![활성화로 설정하기](https://github.com/Zamoca42/blog/assets/96982072/c1490418-98d3-4ded-be1a-b3f15f148d65)

![활성화된 모습](https://github.com/Zamoca42/blog/assets/96982072/8666a960-855a-4a96-b324-b7ab11fbabd0)

## 버킷 권한 설정

이제 버킷의 권한탭으로 이동해서 퍼블릭 액세스로 설정하고 버킷 정책과 CORS 설정이 필요합니다.

![권한 탭으로 이동 해서 퍼블릭 액세스로 바꾸기](https://github.com/Zamoca42/blog/assets/96982072/2902df4e-4e0e-417f-929a-60daf183a51d)

![ACL 설정도 변경해줍니다](https://github.com/Zamoca42/blog/assets/96982072/a7d3e3ca-46cf-498d-80e3-c64830a05271)

### 버킷 정책
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "1",
            "Effect": "Allow",
            "Principal": "*",
            "Action": [
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": [
                "arn:aws:s3:::vue-blog-frontend/*",
                "arn:aws:s3:::vue-blog-frontend"
            ]
        },
    ]
}
```

### CORS(Cross-origin 리소스 공유) 설정

```json
[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "PUT",
            "POST",
            "DELETE"
        ],
        "AllowedOrigins": [
            "https://server.zamoca.space",
            "https://www.zamoca.space"
        ],
        "ExposeHeaders": [
            "Access-Control-Allow-Origin"
        ],
        "MaxAgeSeconds": 3000
    }
]
```

## 리포지토리에서 S3에 배포 설정

리포지토리에서 `.github/workflows`에 `vue-S3.yml`파일을 만들고 다음과 같이 설정했습니다.

```yaml
name: Frontend Deploy # action 명

on: # 이벤트 트리거
	push: # push event에 반응
		paths:
			- "frontend/**" # frontend의 변경이 있을 때
		branches: # github repository의 branch가
			- main # main 일 경우만

jobs:
	deploy: # GitHub-hosted runners env
		runs-on: macos-latest # using MacOS

	defaults:
		run:
			working-directory: "frontend" # frontend 폴더에서 실행
	
	steps:
		- uses: actions/checkout@v3

		- name: Set Node.js 18.x
		  uses: actions/setup-node@v3
		  with:
			node-version: 18.x

		- name: Install dependencies
		  run: npm install

		- name: Build page
		  run: npm run build

		- name: Authenticate AWS CLI
		  env:
			AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
			AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
			AWS_REGION: ${{ secrets.AWS_REGION }}

		  run: |
			aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
			aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
			aws configure set default.region $AWS_REGION

		- name: remove # 삭제
		  run: |
			aws s3 rm s3://my-site/assets/ --recursive
			aws s3 rm s3://my-site/blog/ --recursive
		
		- name: deploy # 배포
		  run: |
			aws s3 cp --recursive dist s3://my-site
```

## 배포 확인

![마지막 수정 시간 확인](https://github.com/Zamoca42/vue-django-blog/assets/96982072/536400d1-9c93-4e3d-845e-53e5222a1c1a)

S3에서 변경사항이 업데이트 되고있는지 마지막 수정 시간에서 확인할 수 있습니다.

![](https://github.com/Zamoca42/blog/assets/96982072/34371e10-988a-4c73-b73c-97d93d39c037)

Route53과 CloudFront까지 사용해서 원하는 도메인으로 라우팅한다면 이런 페이지로 보여집니다.

## 리포지토리의 Actions 확인하기

리포지토리의 Actions 탭가서 배포가 잘 진행되고있는지 확인할 수 있습니다.

![실패했을 때는 :x:가 나옵니다](https://github.com/Zamoca42/blog/assets/96982072/e9a9cb70-1e51-4468-a9cd-159160913b0e)

![변경사항이 있을때마다 배포가 실행됩니다](https://github.com/Zamoca42/blog/assets/96982072/ad181d57-c69b-4fce-b9d7-4bdaa43b76bd)
