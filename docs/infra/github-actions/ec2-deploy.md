---
title: EC2에 Django 서버 배포하기
order: 3
category:
  - Infra.
tag:
  - CD
---

이번 글에서는 GitHub Actions에서 AWS CodeDeploy에 전달하고 EC2에 Django 서버를 배포하는 것까지 진행해보겠습니다.

## CodeDeploy

우선 CodeDeploy를 설정해보겠습니다.
저번 글에서 권한 정책에서 CodeDeploy에 대한 권한이 필요합니다.

![CodeDeploy 권한 정책 설정](https://github.com/Zamoca42/blog/assets/96982072/45fce0a4-8a7a-41fb-ad82-1a334a6be19b)

`AWSCodeDeployFullAccess`, `AWSCodeDeployRole` 두 가지 정책을 설정해줍니다.

![배포 생성하기](https://github.com/Zamoca42/blog/assets/96982072/42dda19e-267e-4e65-b4b7-19ae538324e9)

CodeDeploy의 배포 탭에서 애플리케이션 생성을 눌러 배포 그룹, 이름 등을 설정합니다.

![이름, 그룹, IAM 설정](https://github.com/Zamoca42/blog/assets/96982072/4fdba4af-bca3-4d7e-b80c-f19e352126dd)

그 다음 배포할 EC2 인스턴스, 배포 유형, GitHub 리포지토리까지 연결합니다.

![배포할 EC2 인스턴스와 배포 유형 설정](https://github.com/Zamoca42/blog/assets/96982072/7168992c-ad23-4d8c-9514-70637bd76e1d)

배포할 GitHub 리포지토리 최상단에 `appspec.yaml`을 만들어서 설정하면 CodeDeploy에서
배포 중에 실행할 hooks를 설정할 수 있습니다.
여기서는 배포 후에 서버를 재시작하는 설정을 해보겠습니다.

**appspec.yaml**

```yaml
version: 0.0
os: linux
permissions:
  - object: /home/ubuntu/
    owner: ubuntu
    group: ubuntu
    mode: 774
    type:
      - directory
      - file
files:
  - source: ./backend/
    destination: /home/ubuntu/backend
hooks:
  # BeforeInstall:
  #   - location: beforeInstall.sh
  AfterInstall:
    - location: backend/scripts/afterInstall.sh
```

만약에 배포 전에 실행하고 싶은 동작이 있다면 BeforeInstall에 설정하면 됩니다.
필요한 hook들을 설정했다면 다음은 backend폴더 내에 scripts를 만들어줍니다.

![스크린샷 2023-10-09 오후 6 51 08](https://github.com/Zamoca42/blog/assets/96982072/2e30f28d-555e-40cb-9e9e-e14373917a3e)

**backend/scripts/afterInstall.sh**

```sh
python3 /home/ubuntu/backend/scripts/afterInstall.py 1> /home/ubuntu/after.log 2> /home/ubuntu/after.err
```

**backend/scripts/afterInstall.py**

```python
print("after")
import os

os.system('sudo chmod -R gu+rwx /home/ubuntu/backend')

os.system('python3 -m venv /home/ubuntu/backend/venv')
os.system('sudo chown -R ubuntu.ubuntu /home/ubuntu/backend')
os.system('sudo chmod -R gu+rwx /home/ubuntu/backend')
os.system(
    '. /home/ubuntu/backend/venv/bin/activate && pip install --upgrade pip && pip install -r /home/ubuntu/backend/requirements/prod.txt && python /home/ubuntu/backend/manage.py migrate --settings=mysite.settings.product')
os.system('python /home/ubuntu/backend/manage.py --no-input')
os.system('sudo systemctl restart mysite.service')
os.system('sudo systemctl restart nginx')
```

이렇게 작성한다면 배포 후에 스트립트를 실행해서 서버를 재시작할 수 있습니다.
디렉터리 상황이 다를 수 있으므로 디렉터리 경로는 자신의 EC2 인스턴스내의 경로에 맞게 작성해야합니다.

## 설정파일

그 다음은 리포지토리의 `.github/workflows`에서 `Django-EC2.yml`을 설정합니다.

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

main 브랜치와 backend 디렉터리의 변경사항이 있으면 작업을 실행합니다.
jobs 아래의 steps를 보면 AWS 권한을 설정한 후 AWS CodeDeploy에서 미리 설정해놓은 작업을 실행합니다.

이렇게 설정하면 backend에서 변경사항이 있을 때 Github Actions를 실행해서 CodeDeploy로 보내는 과정을 실행합니다.

`Create CodeDeploy Deployment`의 `run`의 명령어들은[AWS CLI](https://aws.amazon.com/ko/cli/)입니다.
추가하거나 변경하고 싶은 작업이 있으면 AWS CLI 명령어들을 확인해서 변경할 수 있습니다.

## 배포 확인

![AWS CodeDeploy](https://github.com/Zamoca42/vue-django-blog/assets/96982072/46c82e81-59d7-4f8f-8b84-0030be9ce3d3)

CodeDeploy에서도 배포된 것을 확인할 수 있습니다.

![배포에 성공하면 afterInstall 이벤트가 실행된 것을 확인할 수 있습니다](https://github.com/Zamoca42/blog/assets/96982072/7df9b4e7-63f8-432a-8eb8-07acfb36ea7b)

배포 후 재시작 스크립트를 실행하는데 9초가 걸린 것을 확인할 수 있습니다.
