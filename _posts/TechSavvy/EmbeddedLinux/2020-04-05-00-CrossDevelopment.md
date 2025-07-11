---
title: 00. Cross Development
author: Jay Lee
date: 2021-04-05 00:00:00 +0800
categories: [TechSavvy, EmbeddedLinux]
tags: [Blogging, Linux, AGL, EmbeddedLinux, OpenEmbedded, Yocto, CrossDevelopment, GCC, GDB, Toolchain]
image: /assets/img/embeddedlinux.jpg
---

## What is Cross Development?

Cross Development란 내가 지금 **개발하고 있는 환경**과 실제 개발된 어플리케이션이 **동작하는 환경**이 다르게 어플리케이션을 개발하는 것을 의미한다.

예를 들면 Windows 10 환경에서 Visual Studio로 Windows 10에서 동작하는 어플리케이션을 만들 수도 있지만, 프레임워크의 도움을 받아 OS 레벨에선 iOS, Android등에서 동작하는 어플리케이션도 만들 수 있다. Xamarin, UWP, Flutter등이 그 프레임워크의 예이다.

**환경**이 다르다는 것은 어떤것을 의미할까?

혹자는 *"Windows 건 Mac이건 Android건 코드짤때는 다 똑같은데, 어플리케이션 레벨에서 원하는 기능 다 똑같은데 뭐가 다른거야?"* 하고 생각할 수 있다.

하지만 내부로 들어가면 그 어플리케이션이 동작하기위해 필요로하는 라이브러리들이 있고, 그 라이브러리들이 동작하기 위한 디바이스들과 그 것들을 운용하는 커널 및  운영체제 그리고 아키텍쳐들이 준비가 되어야 비로서 어플리케이션이 동작 할 수 있는 것이다.

이러한 시스템 레벨의 작업들을 1차적으로 처리해주는 것을 우리는 프레임워크단라고 부르기도 한다.

- JAVA의 **JavaRuntimeEnvrionment**
- Windows의 **.NETFramework**
- MAC의 Rosetta 2

그리고 Visual Studio, Android Studio 같은 통합개발환경(IDE)에서 개발자들이 쉽게 개발할 수 있게 컴파일러, 링커, 디버거 등을하여 프레임워크와 연결시켜주는 것이다.

혹자는 *"그럼 저는 컴파일이 필요없는 파이썬, JavaScript, Ruby, SQL 과 같은 인터프리터 언어를 이용하여 개발할 건데, Cross Development할 필요없는거네요?"* 하고 말할 수 있다.

작성한 인터프리터 언어에서 필요로 하는 ***라이브러리***가 동작하고자 하는 환경을 ***지원하지 않는다면*** 이 언어로 작성한 어플리케이션은 무용지물이다.

이렇듯 우리가 Thorough하게 환경들을 고려해야 어플리케이션의 동작과 성능을 테스트하고 보장할 수 있다.

## Cross Compiling for Embedded System

![Desktop View]({{ "/assets/img/00-CrossDevelopment/1.png" | relative_url }})
Ref: Linux Foundation 2020 Conference   

임베디드는 이러한 Cross Development 기법을 사용해야 효율적인 분야 중 하나다.

지금이야 임베디드 기기가 훌륭한 성능을 내지만, 몇년전만 하더라도 해당기기에서 직접 개발을 한다거나 Compile을 한다거나 하는 것은 꿈도 꾸기 힘들었다.

그래서 발전한 Cross 빌드 시스템관련한 Open Source Projects들은 OpenEmbedded, Buildroot, Yocto Project, Bitbake 등이 있다.