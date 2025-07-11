---
title: 02. Preparing To Debug With GDB
author: Jay Lee
date: 2021-04-07 00:00:00 +0800
categories: [TechSavvy, EmbeddedLinux]
tags: [Blogging, Linux, AGL, EmbeddedLinux, OpenEmbedded, Yocto, CrossDevelopment, GCC, GDB, Toolchain]
image: /assets/img/embeddedlinux.jpg
---

Toolchain 이 준비가 됐다면 일단 도구들은 다 준비가 됐다고 봐도 된다.

이제 실제로 디버깅을 해야할 대상을 디버깅 할 수 있게 만들자.

## Compiler Option 조정

![Desktop View]({{ "/assets/img/02-PreparingToDebugWithGDB/1.png" | relative_url }})
Ref: Linux Foundation 2020 Conference   

먼저 c나 c++ 소스코드를 컴파일 할때 위 그림처럼 -g 옵션이나 -gN 옵션을 주어 source code debugging 정보 등 다양한 정보들이 elf에 포함되게 만들어준다.

-ggdbN 을 사용하게되면 표준 DWARF format 대신 gdb format을 사용하여 elf를 생성한다.

일반적으로 -g 만 넣게되면 elf는 -g2에 해당하는 단계를 가지게 된다.

![Desktop View]({{ "/assets/img/02-PreparingToDebugWithGDB/2.png" | relative_url }})
Ref: Linux Foundation 2020 Conference   

그 다음은 Optimization Option 을 조정해줘야 한다.

Optimization을 하게되면 컴파일러는 코드의 로직을 분석하여 동일한 결과를 내는 다른 방식의 실행코드를 생성할 수 도 있기 때문에, 디버깅시에는 최적화 옵션을 빼줘야한다.

-O0 옵션을 주거나 -Og 를 주어 gdb 호완가능한 최적화 옵션을 주자

## Reference

1. [http://www.epnc.co.kr/news/articleView.html?idxno=48128](http://www.epnc.co.kr/news/articleView.html?idxno=48128)