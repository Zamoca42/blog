---
title: EC2에 Django 배포하기
order: 3
---

## CodeDeploy

## 설정파일

```yaml
name: Backend Deploy # action 명

on: # 이벤트 트리거
	push: # push event에 반응
		paths:
			- "backend/**" # backend의 변경이 있을 때
		branches: # github repository의 branch가
			- main # main 일 경우만

jobs:
	deploy: # GitHub-hosted runners env
		runs-on: ubuntu-latest # using Ubuntu

		defaults:
			run:
				working-directory: "backend" # backend 폴더에서 실행

	steps:
		- uses: actions/checkout@v3

		- name: Authenticate AWS CLI
		  env:
			AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
			AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
			AWS_REGION: ${{ secrets.AWS_REGION }}
		  run: |
			aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
			aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
			aws configure set default.region $AWS_REGION

		- name: Create CodeDeploy Deployment
		  run: |
			aws deploy create-deployment \
				--application-name backendEC2Deploy \
				--deployment-group-name yourDeployGroup \
				--deployment-config-name CodeDeployDefault.AllAtOnce \
				--file-exists-behavior OVERWRITE \
				--github-location repository=${{ github.repository }},commitId=${{ github.sha }}

```

on에서 main 브랜치에서 push 이벤트가 일어나고, backend폴더가 변경사항이 있으면 작업을 실행합니다.
jobs 아래의 steps를 보면 AWS 권한을 설정한 후 AWS CodeDeploy에서 미리 설정해놓은 작업을 실행합니다.

이렇게 설정하면 backend에서 변경사항이 있을 때 Github Actions를 실행해서 CodeDeploy로 보내는 과정을 실행하게됩니다.

`Create CodeDeploy Deployment`의 `run`의 명령어들은[ AWS CLI](https://aws.amazon.com/ko/cli/)입니다. 
추가하거나 변경하고 싶은 작업이 있으면 AWS CLI 명령어들을 확인해서 변경하면 됩니다.

## 배포 확인

![스크린샷 2023-09-15 오후 4 18 45](https://github.com/Zamoca42/vue-django-blog/assets/96982072/46c82e81-59d7-4f8f-8b84-0030be9ce3d3)

CodeDeploy에서도 배포된 것을 확인할 수 있습니다.
