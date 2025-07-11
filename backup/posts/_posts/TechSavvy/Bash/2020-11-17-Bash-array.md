---
title: Bash list?
author: Jay Lee
date: 2020-11-17 00:00:01 +0800
categories: [TechSavvy, Bash]
tags: [TechSavvy, ProgrammingLanguage, Bash]
image : /assets/img/post/bash.png
---

## array(list)

Bash 에서는 괄호로 Array를 표현가능하다
그 안에서 구분자는 아무래도 띄어쓰기(space bar) 이다

``` sh
$ cat array_ex.sh
#!/bin/bash
lists=("a" b "c")
echo ${lists[1]}
echo ${lists[0]}
echo ${lists[3]}
echo ${lists[2]}
$ sh array_ex.sh
b
a

c
```

아래 예제와 같이 Slicing도 지원된다.

``` sh
lists=("V0.1.0" "V1.0.0")
echo "[1] : "${lists[1]}
echo "[0] : "${lists[0]}
echo "[3] : "${lists[3]}
echo "[-1] : "${lists[-1]}

selected=${lists[-1]}
echo "selected : "$selected
``` 


## Appendix. References

- General : [http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html)

