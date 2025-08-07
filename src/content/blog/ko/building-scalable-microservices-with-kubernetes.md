---
title: "나의 마이크로서비스 여정: 1년간의 삽질과 깨달음"
description: "자율주행차 플랫폼을 위한 마이크로서비스 아키텍처 도입에 대한 솔직한 이야기, 실패와 성공을 모두 담은 실전 경험 공유"
pubDate: 2025-01-18
heroImage: ""
categories: ["Tech", "Architecture"]
tags: ["마이크로서비스", "kubernetes", "아키텍처", "devops", "확장성", "docker"]
lang: "ko"
author: "Jay Lee"
readingTime: "15분"
socialImage: "/assets/img/microservices-architecture.jpg"
canonicalURL: "https://jayleekr.github.io/blog/ko/building-scalable-microservices-with-kubernetes/"
---

# 나의 마이크로서비스 여정: 1년간의 삽질과 깨달음

안녕하세요 여러분! 오늘은 지난 1년간 제가 겪었던 마이크로서비스 도입 여정을 솔직하게 공유해보려고 합니다. 성공 스토리보다는 실패 스토리가 더 많을 수도 있지만, 누군가에게는 도움이 될 것 같아서 용기를 내서 적어봅니다.

## 시작은 이랬어요: "뭔가 한계에 부딪힌 것 같아"

약 2년 전, 저희 팀의 차량 데이터 플랫폼이 점점 커지면서 정말 답답한 상황들을 마주하기 시작했어요:

- **배포 한 번에 30분**: 커피 한 잔 타러 갔다 와도 아직 배포 중이더라고요 😅
- **하나 에러나면 전체가 다운**: 새벽에 장애 전화 받는 게 일상이 되어버렸죠
- **다른 팀과 일정 조율**: "저희 팀 개발 끝나면 같이 배포해주세요"라는 말을 너무 자주 들었어요

처음엔 "이 정도는 뭐 괜찮지 않나?" 싶었는데, 팀이 커지고 서비스가 복잡해지니까 확실히 한계가 느껴지더라고요. 그래서 마이크로서비스로 전환하기로 결정했습니다.

## 첫 번째 큰 실수: 잘못된 서비스 분해

### 기술별로 나누면 안 된다는 걸 너무 늦게 알았어요

마이크로서비스를 도입하기로 했을 때, 가장 먼저 한 일은 "어떻게 서비스를 나눌까?"였어요. 처음엔 정말 단순하게 생각했죠:

**처음에 이렇게 나눴어요** (돌이켜보면 정말 잘못된 접근이었죠):
```
database-service (모든 DB 관련)
api-service (모든 API 관련)
auth-service (인증 관련)  notification-service (알림 관련)
```

이렇게 몇 달 써보니 정말 답답했어요. 하나의 기능을 추가하려면 여러 서비스를 동시에 수정해야 했고, 결국 계속해서 함께 배포해야 했거든요.

**그래서 이렇게 바꿨어요** (비즈니스 중심 접근):
```
vehicle-management (차량 관리에 관한 모든 것)
trip-analytics (주행 분석 관련)
user-profiles (사용자 프로필)
billing-payments (결제 관련)
```

이렇게 바꾸고 나니 각 팀이 독립적으로 개발할 수 있게 되었어요. 정말 큰 차이였죠!

#### 실제 도메인 분해 예시

```typescript
// 자율주행 플랫폼을 위한 도메인 분해
interface DomainBoundaries {  vehicleFleet: {  responsibilities: ['차량 등록', '상태 모니터링', '펌웨어 관리'];  dataOwnership: ['vehicles', 'sensors', 'diagnostics'];  apis: ['/vehicles', '/fleet/status', '/diagnostics'];  };  tripManagement: {  responsibilities: ['주행 생성', '경로 최적화', '실시간 추적'];  dataOwnership: ['trips', 'routes', 'locations'];  apis: ['/trips', '/routes', '/tracking'];  };  userExperience: {  responsibilities: ['사용자 인터페이스', '알림', '피드백'];  dataOwnership: ['users', 'preferences', 'feedback'];  apis: ['/users', '/notifications', '/feedback'];  };
}
```

### 데이터 일관성 전략

#### 이벤트 소싱 패턴 구현

```typescript
// 이벤트 기반 데이터 동기화
interface DomainEvent {  eventId: string;  aggregateId: string;  eventType: string;  timestamp: Date;  version: number;  data: any;
}

class VehicleEventHandler {  async handleTripCompleted(event: DomainEvent) {  const { tripId, vehicleId, mileage, fuelConsumption } = event.data;  // 1. Vehicle Service: 차량 상태 업데이트  await this.vehicleService.updateMileage(vehicleId, mileage);  // 2. Analytics Service: 주행 데이터 저장  await this.analyticsService.recordTripData({  tripId, vehicleId, mileage, fuelConsumption  });  // 3. Billing Service: 요금 계산 이벤트 발행  await this.eventPublisher.publish('billing.calculate', {  tripId, mileage, userId: event.data.userId  });  }
}
```

#### SAGA 패턴으로 분산 트랜잭션 관리

```yaml
# trip-booking-saga.yml
saga:  name: "TripBookingSaga"  steps:  - service: "user-service"  action: "reserve-credits"  compensate: "release-credits"  - service: "vehicle-service"  action: "reserve-vehicle"  compensate: "release-vehicle"  - service: "trip-service"  action: "create-trip"  compensate: "cancel-trip"  - service: "notification-service"  action: "send-confirmation"  compensate: "send-cancellation"
```

## 쿠버네티스 클러스터 구성

### ️ 인프라 아키텍처

```yaml
# cluster-architecture.yml
apiVersion: v1
kind: ConfigMap
metadata:  name: cluster-config
data:  # 프로덕션 클러스터 구성  nodes: |  master-nodes: 3 (HA 구성)  worker-nodes: 12 (auto-scaling)  resources:  cpu: "노드당 48 cores"  memory: "노드당 192GB"  storage: "2TB NVMe SSD"  networking:  cni: "Calico"  service-mesh: "Istio"  ingress: "NGINX + Cert-Manager"
```

### 서비스별 배포 구성

#### 1. 고가용성 서비스 (Vehicle Management)

```yaml
# vehicle-service-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:  name: vehicle-service  labels:  app: vehicle-service  version: v2.1.3
spec:  replicas: 5  strategy:  type: RollingUpdate  rollingUpdate:  maxSurge: 2  maxUnavailable: 1  selector:  matchLabels:  app: vehicle-service  template:  metadata:  labels:  app: vehicle-service  version: v2.1.3  spec:  containers:  - name: vehicle-service  image: myregistry/vehicle-service:v2.1.3  ports:  - containerPort: 8080  env:  - name: DATABASE_URL  valueFrom:  secretKeyRef:  name: db-credentials  key: url  - name: REDIS_URL  valueFrom:  configMapKeyRef:  name: cache-config  key: redis-url  resources:  requests:  memory: "512Mi"  cpu: "250m"  limits:  memory: "1Gi"  cpu: "500m"  livenessProbe:  httpGet:  path: /health  port: 8080  initialDelaySeconds: 30  periodSeconds: 10  readinessProbe:  httpGet:  path: /ready  port: 8080  initialDelaySeconds: 15  periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:  name: vehicle-service
spec:  selector:  app: vehicle-service  ports:  - port: 80  targetPort: 8080  type: ClusterIP
```

#### 2. HPA (Horizontal Pod Autoscaler) 설정

```yaml
# vehicle-service-hpa.yml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:  name: vehicle-service-hpa
spec:  scaleTargetRef:  apiVersion: apps/v1  kind: Deployment  name: vehicle-service  minReplicas: 3  maxReplicas: 20  metrics:  - type: Resource  resource:  name: cpu  target:  type: Utilization  averageUtilization: 70  - type: Resource  resource:  name: memory  target:  type: Utilization  averageUtilization: 80  - type: Pods  pods:  metric:  name: requests_per_second  target:  type: AverageValue  averageValue: "100"
```

## 운영 경험에서 배운 교훈들

### 성공 요인들

#### 1. 팀 구조와 조직 정렬

```mermaid
graph TD  A[프로덕트 팀] --> B[도메인 팀 1: Vehicle]  A --> C[도메인 팀 2: Trip]  A --> D[도메인 팀 3: User]  B --> E[백엔드 개발자]  B --> F[DevOps 엔지니어]  B --> G[QA 엔지니어]  H[플랫폼 팀] --> I[인프라]  H --> J[모니터링]  H --> K[보안]
```

**Conway의 법칙 활용**: 조직 구조가 아키텍처를 결정한다는 걸 인정하고 의도적으로 설계

#### 2. 점진적 마이그레이션

```typescript
// Strangler Fig 패턴으로 점진적 전환
class LegacyTripService {  async createTrip(tripData: TripData): Promise<Trip> {  // Feature Flag로 신/구 시스템 분기  if (this.featureFlag.isEnabled('NEW_TRIP_SERVICE', tripData.userId)) {  return this.newTripService.createTrip(tripData);  } else {  return this.legacyCreateTrip(tripData);  }  }  private async legacyCreateTrip(tripData: TripData): Promise<Trip> {  // 기존 모놀리틱 로직  }
}
```

#### 3. 관찰가능성 우선 개발

```typescript
// 코드 작성 시점부터 메트릭 수집 고려
class PaymentService {  async processPayment(payment: Payment): Promise<PaymentResult> {  const timer = this.metrics.startTimer('payment_processing_duration');  try {  this.metrics.increment('payment_attempts_total', {  payment_method: payment.method,  amount_range: this.getAmountRange(payment.amount)  });  const result = await this.paymentGateway.charge(payment);  this.metrics.increment('payment_success_total');  return result;  } catch (error) {  this.metrics.increment('payment_failure_total', {  error_type: error.constructor.name  });  throw error;  } finally {  timer.end();  }  }
}
```

### 실패에서 배운 교훈들

#### 1. 너무 작은 서비스의 함정

**문제**: 과도한 네트워크 호출과 복잡한 오케스트레이션

```typescript
// ❌ 지나치게 세분화된 서비스
interface MicroServices {  userIdService: '사용자 ID 생성';  userNameService: '사용자 이름 관리';  userEmailService: '사용자 이메일 처리';  userPhoneService: '전화번호 관리';
}

// ✅ 적절한 크기의 서비스
interface RightSizedServices {  userManagementService: '사용자 전체 라이프사이클';  authenticationService: '로그인, 로그아웃, 토큰';  profileService: '사용자 설정, 프리퍼런스';
}
```

#### 2. 분산 모놀리스의 위험

분산되었지만 여전히 강하게 결합된 시스템:

- 서비스 간 동기식 호출 체인
- 공유 데이터베이스
- 동시 배포 필요

**해결책**: 이벤트 기반 아키텍처와 CQRS 패턴 도입

#### 3. 테스트 전략의 중요성

```typescript
// Contract Testing으로 서비스 간 호환성 보장
describe('Vehicle Service Contract', () => {  it('should return vehicle data in expected format', async () => {  const pact = new Pact({  consumer: 'trip-service',  provider: 'vehicle-service'  });  await pact  .given('vehicle exists')  .uponReceiving('a request for vehicle data')  .withRequest({  method: 'GET',  path: '/vehicles/123'  })  .willRespondWith({  status: 200,  headers: { 'Content-Type': 'application/json' },  body: {  id: like('123'),  status: like('available'),  location: {  lat: like(37.5665),  lng: like(126.9780)  }  }  });  const vehicle = await vehicleClient.getVehicle('123');  expect(vehicle).toHaveProperty('id');  expect(vehicle).toHaveProperty('status');  });
});
```

## 성능 측정과 지속적인 개선

### 핵심 성과 지표 (KPIs)

#### 기술적 메트릭

| 메트릭 | 목표 | 현재 | 개선율 |
|--------|--------|---------|-------------|
| 배포 빈도 | 5회/일 | 8회/일 | ✅ +60% |
| 배포 리드타임 | 30분 | 8분 | ✅ -73% |
| MTTR (평균 복구 시간) | 1시간 | 15분 | ✅ -75% |
| 변경 실패율 | <5% | 2.3% | ✅ -54% |

#### 비즈니스 메트릭

- **서비스 가용성**: 99.97% → 99.99%
- **응답 시간**: P95 500ms → 150ms
- **동시 사용자**: 10,000명 → 100,000명 처리 가능

### 지속적인 개선 프로세스

```yaml
# 월간 회고 프로세스
retrospective:  what_went_well:  - "카나리 배포로 장애 최소화"  - "모니터링 대시보드로 빠른 문제 파악"  what_needs_improvement:  - "팀 간 의존성 해결"  - "테스트 자동화 범위 확대"  action_items:  - name: "이벤트 기반 통신 확대"  owner: "architecture-team"  due_date: "2025-02-28"  - name: "E2E 테스트 커버리지 80% 달성"  owner: "qa-team"  due_date: "2025-02-15"
```

## 앞으로의 계획

### 다음 단계 로드맵

#### Q1 2025: 플랫폼 엔지니어링 강화
- **개발자 포털** 구축 (Backstage 기반)
- **셀프서비스 인프라** 도입
- **개발자 생산성 메트릭** 수집

#### Q2 2025: AI/ML 통합
- **예측적 오토스케일링** (머신러닝 기반)
- **이상 탐지** 자동화
- **성능 최적화** AI 어시스턴트

#### Q3-Q4 2025: 글로벌 확장
- **멀티 리전** 아키텍처
- **지리적 데이터 분산**
- **엣지 컴퓨팅** 도입

## 실전 적용 가이드

### 단계별 체크리스트

#### 설계 단계
- [ ] 도메인 경계 명확히 정의
- [ ] 데이터 소유권 분리
- [ ] 통신 패턴 결정 (동기/비동기)
- [ ] 장애 시나리오 계획

#### 개발 단계  - [ ] API 버저닝 전략
- [ ] 로깅/메트릭 표준화
- [ ] Contract Test 작성
- [ ] 보안 정책 적용

#### 배포 단계
- [ ] CI/CD 파이프라인 구축
- [ ] 카나리/블루-그린 배포
- [ ] 모니터링 대시보드 설정
- [ ] 알림 규칙 정의

#### 운영 단계
- [ ] SLA/SLO 정의
- [ ] 장애 대응 플레이북
- [ ] 정기적인 재해복구 훈련
- [ ] 성능 튜닝과 최적화

### 정말로 배운 것들 (나의 깨달음)

1년간의 삽질 끝에 제가 깨달은 가장 중요한 것들:

1. **한 번에 모든 걸 바꾸려 하지 마세요**: 처음엔 너무 욕심이 많아서 정말 고생했어요. 하나씩 천천히 바꾸는 게 훨씬 안전해요
2. **모니터링부터 시작하세요**: 뭔가 잘못됐을 때 원인을 찾을 수 없으면 정말 막막해져요. 로그와 메트릭 수집은 필수예요
3. **팀 구조도 함께 바뀌어야 해요**: 조직 구조가 시스템 구조를 반영한다는 Conway의 법칙이 정말 맞더라고요
4. **자동화에 투자하세요**: 서비스가 많아지면 수동으로는 절대 관리할 수 없어요

### 솔직한 고백

마이크로서비스는 모든 문제를 해결해주는 마법의 해결책이 아니에요. 때로는 새로운 복잡성을 가져오고, 때로는 모놀리스가 더 나은 선택일 수도 있어요.

하지만 제대로 도입한다면 팀의 생산성과 시스템의 안정성을 정말 향상시킬 수 있어요. 저희 팀도 힘들었지만, 지금은 정말 만족하고 있답니다.

혹시 마이크로서비스 도입을 고민하고 계신다면, 언제든 질문해주세요. 제가 겪은 삽질을 미리 공유해드릴 수 있을 것 같아요! 😊

---

**다음에는 이런 이야기를 공유할 예정이에요:**
- 쿠버네티스 운영하면서 배운 성능 최적화 꿀팁 (다음 주 예정)
- 이벤트 기반 아키텍처가 정말 필요한가에 대한 고민 (2월경)

**더 자세한 논의를 원하신다면:**
- LinkedIn으로 연락주세요: [linkedin.com/in/jaylee](https://linkedin.com/in/jaylee)
- GitHub에서 만나요: [github.com/jayleekr](https://github.com/jayleekr)