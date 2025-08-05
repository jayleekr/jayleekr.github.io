---
title: "AI 멀티플렉싱 워크플로우: ADHD급 생산성 향상기 (1편)"
description: "월 100달러짜리 AI 스택으로 혼돈 속에서 시스템을 찾아가는 여정"
pubDate: 2025-07-24
heroImage: "/assets/img/ai-workflow.jpg"
categories: ["Tech", "AI"]
tags: ["AI", "Productivity", "Cursor", "ChatGPT", "Claude", "Gemini", "Workflow"]
lang: "ko"
author: "Jay Lee"
readingTime: "7분"
---

![AI Workflow Productivity](/assets/img/ai-workflow.jpg)

# AI 멀티플렉싱 워크플로우: ADHD급 생산성 향상기 (1편)

안녕하세요! 오늘부터 좀 특별한 시리즈를 시작해보려고 합니다.  요즘 컴퓨터 앞에 있을 때 진짜 **ADHD도 이런 ADHD가 없다**고 느낄 정도로 여러 AI 도구들을 동시에 돌리고 있어서, 이 혼돈 속에서 나름의 시스템을 찾아가는 과정을 공유해보려고 합니다.

## 현재 돌리고 있는 AI 스택 (월 $100+)

매달 **100달러 넘게** 쓰면서 이 녀석들을 매일 돌리고 있습니다:

- **Cursor Pro** - 메인 코딩 환경
- **ChatGPT Pro** - 감정노동과 고객 대응용 (ㅋㅋ)
- **Claude Code** - 공격적인 코딩 작업용
- **Gemini CLI** - 문서화 전문
- **Gemini Pro 2.5** - 리서치 및 새 프로젝트 기획

확실히 많이 쓰기도 하지만, **AI 강의를 매주 하면서** 알게 된 노하우들을 녹여서 쓰다 보니 조금씩 Productivity가 향상됨을 느끼고 있습니다.  어느 정도 각을 잡아가는 듯해서 이 기록을 남기기로 했습니다.

## 전체 워크플로우 개요

```mermaid
graph TB  subgraph "AI 스택 (월 $100+)"  A1["🔵 Cursor Pro<br/>메인 코딩"]  A2["🟢 ChatGPT Pro<br/>감정노동 & 고객대응"]  A3["🟣 Claude Code<br/>공격적 코딩"]  A4["🔴 Gemini CLI<br/>문서화 전문"]  A5["🟡 Gemini Pro 2.5<br/>리서치 & 기획"]  end  subgraph "공통 워크플로우"  B1["1️⃣ Context Window<br/>새로 열기"]  B2["2️⃣ 정리된 Context<br/>제공하기"]  B3["3️⃣ 답변 포맷<br/>생각하게 하기"]  B4["4️⃣ 명확한<br/>Request"]  B5["5️⃣ Feedback<br/>과정"]  B6["6️⃣ Context 문서<br/>업데이트"]  B1 --> B2 --> B3 --> B4 --> B5 --> B6  end  subgraph "워크스페이스 구성 (5-8개)"  C1["📡 Remote SSH"]  C2["💻 Native"]  C1 --> C11["Product Code"]  C1 --> C12["Build Server 1-2개"]  C1 --> C13["Test Environment 1-2개"]  C2 --> C21["Blog/Documentation"]  C2 --> C22["강의자료 1-2개"]  end  subgraph "도구별 특화"  D1["Claude Code<br/>💸 3시간 제한"] --> D11["Aggressive<br/>코딩 작업"]  D2["Cursor + 대화창"] --> D22["Agentic Mode<br/>Ping-ponging"]  D3["ChatGPT Pro"] --> D33["이메일<br/>감정노동"]  D4["Gemini 2.5 Pro"] --> D44["Documentation<br/>기똥참"]  end  A1 -.-> B1  A3 -.-> D1  A4 -.-> D4  style A1 fill:#e1f5fe  style A2 fill:#e8f5e8  style A3 fill:#f3e5f5  style A4 fill:#ffebee  style A5 fill:#fffde7
```

위 다이어그램이 제가 현재 운영하고 있는 AI 멀티플렉싱 워크플로우의 전체 구조입니다!

## 왜 이렇게 많은 AI 도구를 써야 하나?

솔직히 처음에는 저도 "이게 맞나?" 싶었습니다. 하지만 실제로 써보니 **각 도구마다 확실히 특화된 영역**이 있더라고요.

- **코딩할 때**: Cursor가 압도적
- **문서 작성할 때**: Gemini가 진짜 기똥참
- **고객 이메일 쓸 때**: ChatGPT가 감정노동을 대신해줌 ㅋㅋ
- **무거운 코딩할 때**: Claude Code가 필요악

결국 **하나로 모든 걸 다 하려고 하면** 오히려 비효율적이더라는 게 결론입니다.

## ️ 기본 운영 철학

### 1. 모든 워크스페이스는 Git Repo
**5~8개의 Cursor 인스턴스**가 항상 떠있는데, 각각이 독립된 git repo입니다:
- Remote SSH 기반: Product Code, Build Server, Test Environment
- Native 기반: Blog, Documentation, 강의자료

### 2. Context 관리가 핵심
AI들이 들쭉날쭉 하는 이유 중 하나가 **Context 관리를 못해서**입니다. 
- project config, workflow 등을 담은 markdown들을 계속 업데이트
- 대화가 길어지면 과감히 새 창으로 시작

### 3. 각 도구의 한계를 인정하고 활용
예를 들어, Claude Code는 **3시간마다 Usage 제한**이 있어서 짜증나지만, 그래서 더 전략적으로 사용하게 됩니다.

## 앞으로 다룰 내용들

이 시리즈에서 다룰 예정인 내용들입니다:

### 2편: "공통 워크플로우 방법론" (다음주 예정)
- 6단계 워크플로우 상세 설명
- 실제 프롬프트 예시와 Before/After
- Context Window 관리 실전 팁

### 3편: "워크스페이스 운영 실전기"
- Remote SSH vs Native 개발환경 구성
- Git Repo 기반 워크스페이스 관리법
- 5~8개 인스턴스를 효율적으로 운영하는 법

### 4편: "도구별 프롬프트 전략"
- Cursor Pro 활용 고급 기법
- Claude Code 3시간 제한 극복법
- Gemini CLI 문서화 자동화

### 5편: "PRD 방법론으로 새 프로젝트 시작하기"
- Gemini 2.5 Pro로 Research 돌리는 법
- 들쭉날쭉한 AI를 더 잘하게 만드는 PRD 작성법
- 실제 프로젝트 적용 사례

## 마무리하며...

사실 **Claude Code usage가 다시 찰 때까지만** 이 글을 쓰려고 한 거였는데... 쓰다 보니 시리즈로 만들어야겠더라고요 ㅋㅋㅋ

각 편마다 실제 사용하는 프롬프트나 설정 파일들도 공유할 예정이니, 비슷한 고민을 하시는 분들에게 도움이 되길 바랍니다!

다음 편은 **공통 워크플로우 방법론**에 대해 더 자세히 다뤄보겠습니다. 여러분도 AI 도구들 어떻게 활용하고 계신가요? 댓글로 공유해주세요!

---

*이 글은 실제 AI 도구들을 매일 활용하며 얻은 경험을 바탕으로 작성되었으며, 비슷한 고민을 하는 개발자들에게 도움이 되길 바랍니다.* 