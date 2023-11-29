---
title: Preferred Networks
author: Jay Lee
date: 2021-04-10 00:00:00 +0800
categories: [DeepThinking, AI]
tags: [DeepThinking, AI, GithubPage, Retrospect, AdaptiveAUTOSAR, AUTOSAR, ClassicAUTOSAR, ECU, CPU, GPU, OTA]
image : /assets/img/PreferredNetwork.png
---

## About this post

이 글은 Bain&Company 출신 Jihyo Lee님의 포스팅을 퍼온 것입니다.

## Preferred Networks

최근에 본 무수히 많은 AI 스타트업 중에 가장 스케일이 크고 대담한 업체. 일본기업이라 숨어있어서 그렇지 엄청나다 못해 황당한 수준이다. 

초기엔 Tensorflow같은 AI framework을 자체적으로 만들었고, 아래로는 CuDNN같은 library를, 위로는 AI 모델의 hyperparameter 최적화하는 tool 등으로 확장하더니만 아예 각잡고 자기 전용 GPU cluster를 짓고 나서는, 결국엔 전용 AI chip까지 찍어서 AI슈퍼컴퓨터 cluster를 구축. Chip도 대단한데 2018년 찍은 칩인데 FP32 성능이 131 TFLOPS다. 

참고로 NVIDIA의 최신 A100이 FP32 성능은 19 TFLOPS. Chiplet써서 die 네개 붙이는 방식의 구현도 감탄스럽고... 이걸로 만든 cluster는 아예 2020년 기준 글로벌 슈퍼컴퓨터 Green500 순위 공인 1위. (한국에서 AI 칩만든다고 떠드는 애들은 쎄고 쌨지만 제대로 나온거 하나도 없고 제대로 된 training 만드는 애는 아예 0인거 생각하면 참...)

이 모든 infrastructure의 HW와 SW stack을 통째로 내재화한 다음에 자기 전용의 데이터센터 위에서 직접 AI application들을 개발한다. 

파트너/고객으로 일본의 주요 대기업은 다 붙어있다. 

자동차는 Toyota, 로보트는 FANUC, 소비재는 KAO, 통신은 NTT. @_@ 벌이고 있는 사업의 방향성이나 그림이야 뭐 그럴 수 있는데, 이걸 진짜로 여기까지 해놓은거 보고 움찔했다. 

아니 이런 녀석이 도대체 왜 안알려져있지? 

스타트업이 구글과 다이다이 붙는 수준(반도체-AI데이터센터-AI프레임웍-AI어플리케이션까지...)으로 일을 벌이고 있다. 

일본 무시할 게 아니다. 

내수만으로 저런 스케일이 나오니 외부에 안알려질 뿐이다. 

한국의 AI스타트업들 다 합쳐도 택도 없는 scale.

우와... 우와... 세상은 넓고 겸손해야 된다... 잠이 다 안오네..