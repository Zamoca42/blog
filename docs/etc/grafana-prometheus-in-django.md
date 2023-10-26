---
title: 프로메테우스 - 그라파나 in Django
---

## 왜 그라파나와 프로메테우스 인가?

Datadog, Sentry와 같이 여러 데이터를 시각화해서 보여주는 앱들이 많지만 그라파나와 프로메테우스는 오픈 소스 도구로 비용이 들지 않고 다양하게 커스터마이징할 수 있다는 장점이 있었다. 나는 프로젝트를 해오면서 모니터링 도구를 사용해본 적 없기 때문에 그라파나와 프로메테우스를 포토부스 프로젝트의 첫 모니터링 도구로 설정해보게 되었다.

## 설정 플로우

![prometheus-on-docker [[출처]](https://stefanprodan.com/2016/a-monitoring-solution-for-docker-hosts-containers-and-containerized-services/)](https://github.com/pre-onboarding-backend-G/team-g-project-skeleton/assets/96982072/43bd474a-7143-4a9b-ab6d-2fa8fdee037d)

1. docker-compose 설정
2. django-prometheus를 Django 설정의 앱과 미들웨어 설정
3. prometheus에서 수집한 데이터를 metrics로 내보낼 url을 django에서 설정
4. grafana에서 데이터 소스 연결하고 대시보드 추가

## step 1: docker-compose 설정

우선 github-actions.docker-compose.yml에 프로메테우스와 그라파나 컨테이너 이미지를 설정했습니다

```yaml
services
  #...
  prometheus:
    image: prom/prometheus
    container_name: prometheus
    volumes:
      - prometheus_data:/prometheus
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - 9090:9090
    # network_mode: host
    networks:
      - mynetwork

  grafana:
    image: grafana/grafana
    # environment:
    #   GF_INSTALL_PLUGINS: "grafana-clock-panel,grafana-simple-json-datasource"
    restart: 'no'
    volumes:
      - grafana_data:/var/lib/grafana
    ports:
      - 3000:3000
    depends_on:
      - prometheus
    # network_mode: host
    networks:
      - mynetwork

networks:
  mynetwork:
```

## Step2: 프로메테우스(Prometheus) 설정

프로메테우스는 모니터링을 위해 데이터를 수집하는 도구로 django-prometheus 패키지로 장고와 연결하였습니다. django-prometheus는 poetry로 의존성 패키지를 추가했습니다

```shell
poetry add django-prometheus
```

그 다음 장고 설정파일에서 앱과 미들웨어를 설정하고 urls에서 프로메테우스 metrics 링크를 설정했습니다.

**config/django/base.py**

```python
THIRD_PARTY_APPS = [
	"django_prometheus",
	# ...
]

MIDDLEWARE = [
	"django_prometheus.middleware.PrometheusBeforeMiddleware",
	"django_prometheus.middleware.PrometheusAfterMiddleware",
	# ...
]
```

**config/root_urls.py**

```python
web_urlpatterns = [
	path("", include("django_prometheus.urls")),
]

urlpatterns = [
	# API
	*web_urlpatterns,
	*admin_urlpatterns,
]
```

그리고 프로메테우스 설정파일인 prometheus.yml를 루트 디렉터리에 만들고 다음과 같이 설정합니다.

```yaml
global:
  scrape_interval: 15s # By default, scrape targets every 15 seconds.
  evaluation_interval: 15s

  # Attach these labels to any time series or alerts when communicating with
  # external systems (federation, remote storage, Alertmanager).
  external_labels:
    monitor: "codelab-monitor"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "django-app"

    # Override the global default and scrape targets from this job every 5 seconds.
    # scrape_interval: 5s
    # metrics_path: "/prometheus-xyzabc/metrics"
    static_configs:
      - targets: ["host.docker.internal:8000"]
```

설정 파일에 대한 내용은 [Prometheus 공식문서](https://prometheus.io/docs/prometheus/latest/getting_started/)에 자세히 나와있습니다.

그 다음 docker-compose를 빌드 후 `localhost:8000/metrics`으로 들어가면 다음과 같이 보입니다.

![localhost:8000/metrics](https://github.com/Zamoca42/blog/assets/96982072/51db3ba4-a7bd-4620-8277-9bbe2e4e1891)

모니터링 상태를 확인하려면 `localhost:9090/targets`로 들어가보면 상태를 확인할 수 있습니다.
prometheus.yml에서 `static_configs`에서 모니터링 타겟을 `localhost`로 설정했을 때
`connect refused` 에러가 발생했습니다.

![connected refused error](https://github.com/Zamoca42/blog/assets/96982072/c0c89e38-74b4-466a-a964-cea06dfe7c14)

- 해당 이슈: https://stackoverflow.com/questions/54397463/getting-error-get-http-localhost9443-metrics-dial-tcp-127-0-0-19443-conne

해당 이슈는 docker 컨테이너 내부의 네트워크 호스트를 인지하지 못해서 생기는 이슈인거 같습니다.
모니터링 타겟을 컨테이너 이미지 이름이나 `docker.host.internal`로 설정하면 해결됩니다.

![docker.host.internal로 변경](https://github.com/Zamoca42/blog/assets/96982072/19be385e-0e1e-4c3b-88fe-a2bfc5c937ec)

state가 UP으로 바뀐 것을 확인할 수 있습니다.

## Step 3: 그라파나(Grafana) 설정

그라파나의 경우 단독 컨테이너 이미지로 설정되고 데이터 소스만 받아올 수 있다면 어느 앱에서이든지 모니터링이 가능할 것 같습니다. 이번에는 테스트를 위해 덤핀 앱 내부에서 로컬로 컨테이너 이미지를 가져와서 설정했지만
admin 레포에서 설정하고 어드민용 인스턴스에 배포한다면 어드민에서 단독으로 사용해 볼 수 있을거 같습니다.

먼저 프로메테우스의 데이터 소스를 가져오도록 설정 합니다.

1. 왼쪽 사이드바에서 **Connections**를 클릭하고 **Add new connection**으로 이동합니다.  
   ![그라파나 새로운 커넥션 연결](https://github.com/Zamoca42/blog/assets/96982072/1bb0f209-b69b-47e9-a607-86a8b7cc5fd3)

2. 상단 검색바에서 prometheus를 찾습니다.
3. Prometheus를 클릭해서 Add new data source를 클릭합니다.
   ![그라파나에서 프로메테우스 아이콘은 이렇게 생겼습니다.](https://github.com/Zamoca42/blog/assets/96982072/596c8f1d-eed3-45f8-b75c-b3e103c9f808)

4. `docker.host.internal:9090`또는 `localhost:9090`으로 연결합니다
   ![프로메테우스의 호스트:포트와 연결](https://github.com/Zamoca42/blog/assets/96982072/66b8670b-4e8e-47e0-baf6-d5ead738115c)
   ![save & test 성공 시](https://github.com/Zamoca42/blog/assets/96982072/a4af30ee-433d-4348-96d1-881d8d796176)
5. 대시보드에서 프로메테우스를 선택하고 원하는 Metric을 선택하고 Runqueries를 누르면 데이터를 볼 수 있습니다.
   ![대시보드에서 보고 싶은 metrics 선택](https://github.com/Zamoca42/blog/assets/96982072/72f21655-ce1a-4969-9c00-6d0a0a1ee43e)
   ![Run queries로 대시보드 활성](https://github.com/Zamoca42/blog/assets/96982072/c9c5968f-81af-44aa-967f-0b659a2c44c5)

## 참고 링크

- 프로메테우스

  - https://prometheus.io/docs/guides/cadvisor/

- 그라파나

  - https://grafana.com/docs/grafana/latest/datasources/prometheus/?pg=oss-prom&plcmt=deploy-box-1

- 전체 설정 플로우
  - https://karanchuri.medium.com/prometheus-grafana-in-django-92da4d782f8a
  - https://www.devkuma.com/docs/prometheus/docker-compose-install/
