---
title: 03.Remote Debugging Using Gdbserver
author: Jay Lee
date: 2021-01-05 00:00:00 +0800
categories: [Blogging, EmbeddedLinux]
tags: [Blogging, EmbeddedLinux, OpenEmbedded, Yocto, CrossDevelopment, GCC, GDB, Toolchain]
image: /assets/img/embeddedlinux.jpg
---


디버거 툴인  gdbserver 와 gdb를 이용하여 원격 디버깅을 할 수 있는 방법을 포스팅한다.

Remote debugging이란 실제로 Application이 동작하고 있는 Target에 gdbserver를 실행시켜 원격 Host에서 gdb 및 toolchain을 활용하여 디버깅하는 방식이다.

![Desktop View]({{ "assets/img/03-RemoteDebuggingUsingGdbserver/Untitled.png" | relative_url }})
Ref. Linux Foundation Conference 2020

이 방식은 Target에는 compiler를 통해 최적화 및 디버깅 심볼을 제외한 어플리케이션을 gdbserver를 통해 Listening 시키고, 원격 Host에서는 최적화 및 디버깅 심볼이 포함된 어플리케이션을 Toolchain 및 gdb를 통해 gdbserver에 접속하여 디버깅하는 방식이다.

Target 이 Embedded Board인 경우에는 디스크 메모리의 용량이나 시스템 메모리의 용량이 매우 제한적인데, 이런 케이스에 Remote debugging이 유용하다.

본격적 설명에 앞서 일단 기본적으로 gdb를 command line으로 어느정도는 다룰 줄 안다고 가정한다.

/