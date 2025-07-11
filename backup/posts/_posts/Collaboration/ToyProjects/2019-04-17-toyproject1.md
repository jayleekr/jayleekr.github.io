---
title: "토이 프로젝트 #1"
author : Jay Lee
date: 2019-04-17 12:00:00 +0800
categories: [Collaboration, ToyProjects]
tags: [ToyProjects, C#, Windows, Youtube, Downloader, 유튜브, 다운로더, 유튜버]
image : "/assets/img/post1/workwell2.png" 

---

### [J-YoutubeDL는 뭔가유?]

유튜브 링크(URL)을 복사해서 붙여넣으면 해당 유튜브 링크에서 지원하는 영상 및 음악 퀄리티들을 원하는대루 다운가능한 Windows용 프로그램이다.

### [왜만들었나유?]

웹에서 링크입력해서 이용하다가 다른 퀄리티로 받고싶어서 직접 만듬

### [설치&실행 어찌하나유?]

[**설치 파일 링크**](https://github.com/jayleekr/YoutubeDownloaderWPF/releases/tag/1.0.1904)

![Desktop View]({{ "/assets/img/post1/github.png" | relative_url }})

위 링크에 들어가면 소스코드부터 설치파일, .Net40 다 있다.

dotnetfx40 어쩌구 프로그램은 윈도우 피씨에 해당 프레임워크가 깔려있으면 안깔아도되고, 심지어 설치할때 웹으로 연결해서 자동 다운을 받아준다. 혹시나 해서 올려놓은 파일이니 필요한 사람은 다운받길 바란다. (**dotNetFx40_Client_x86_x64.exe**)

자 Release1.0.1904.zip을 다운받아 압축을 풀고 setup.exe를 틀어보면 아래와 같은 화면이 뜬당.

![Desktop View]({{ "/assets/img/post1/setup.png" | relative_url }})

기호에 맞게 설치위치를 설정하고 웬만하면 그냥 다음 다음을 눌러서 설치를 마치자.

설치를 마치면 아래와 같은 아이콘이 바탕화면과 시작프로그램에에 생성된다.

![Desktop View]({{ "/assets/img/post1/icon.png" | relative_url }})

프로그램을 실행하면 아래와 같은 화면이 나온다.
![Desktop View]({{ "/assets/img/post1/main.png" | relative_url }})

### [하우투 사용?]

사용법은 간단하다. <br/>
<br/>
www.youtube.com 에 접속한 후 원하는 영상의 url을 클립보드에 복사한 후 프로그램의 URL 칸에 붙여넣기 하면 해당 영상의 추출 가능한 영상 및 음악 포멧과 품질 리스트가 생성된다.<br/>
![Desktop View]({{ "/assets/img/post1/howtogeturl.png" | relative_url }})

<br/>
<br/>
<br/>

원하는 세팅값을 선택하고 GO! 버튼을 누르면 "저장위치" 에 파일을 생성한다.
![Desktop View]({{ "/assets/img/post1/workwell1.png" | relative_url }})
![Desktop View]({{ "/assets/img/post1/workwell2.png" | relative_url }})


참고로 "저장위치" 의 기본값은 프로그램의 **설치위치** 이다.

원하는 위치로 변경하길 권장한다.

매우 간단한 기능만 포함하고 있으니 원하시는 기능을 **댓글** 로 남겨주시면 심심할 때 또 구현해서 넣기로 하겠다.

그럼 Adios
