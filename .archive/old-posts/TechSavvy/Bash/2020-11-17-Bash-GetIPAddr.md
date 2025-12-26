---
title: Bash for and while?
author: Jay Lee
date: 2020-11-17 00:00:01 +0800
categories: [TechSavvy, Bash]
tags: [TechSavvy, ProgrammingLanguage, Bash]
image : /assets/img/post/bash.png
---

## for

``` sh
$ cat for.sh 
#!/bin/bash

LISTS=("a" "b" "c") 

# Don't forget Brace!
echo ${LISTS[0]}
echo ${LISTS[1]}
echo ${LISTS[2]}
# Don't forget Brace!
for item in ${LISTS[@]}
do
    echo $item
done
$ ./for.sh
a
b
c
a
b
c
```

아래는 find, eval, sed 를 함께 쓴 예제

``` sh
for file in $(find . -name "*.txt")
do
    echo $file
    eval sed -i "/confidential/d" $file # confidential 이 포함된 라인 지우기
done
```


## while

필자는 while보다는 for문을 더 좋아하는 스타일이라 잘 쓰진않지만,
텍스트 파일로 부터 line 을 읽어들여 작업하는 용도로 좀 쓴다.

```sh
$ while read line; do git rm -r $line; done < remove.lst
```


## Appendix. References

- General : [http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html)

