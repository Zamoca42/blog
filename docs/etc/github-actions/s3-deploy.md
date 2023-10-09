---
title: S3에 정적 웹페이지 배포하기
order: 3
---

## 정적 웹 호스팅 배포

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

![스크린샷 2023-09-15 오후 4 16 03](https://github.com/Zamoca42/vue-django-blog/assets/96982072/536400d1-9c93-4e3d-845e-53e5222a1c1a)

S3에서 변경사항이 업데이트 되고있는지 확인할 수 있습니다