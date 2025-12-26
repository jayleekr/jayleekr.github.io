---
title: Bash String Comparision with if
author: Jay Lee
date: 2020-11-17 00:00:01 +0800
categories: [TechSavvy, Bash]
tags: [TechSavvy, ProgrammingLanguage, Bash]
image : /assets/img/post/bash.png
---

## Bash string comparision using "if"

"==" and "!=" only can be used in case of string comparision.

``` sh
if [ "$STRING" == "abc" ];then
    echo "STRING is abc!"
fi 

or

if [ "$STRING" = "abc" ];then
    echo "STRING is abc!"
fi 
```

## Appendix. References

- General : [http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html)

