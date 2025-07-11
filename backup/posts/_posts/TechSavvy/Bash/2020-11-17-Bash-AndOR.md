---
title: Bash Directory Exists?
author: Jay Lee
date: 2020-11-17 00:00:01 +0800
categories: [TechSavvy, Bash]
tags: [TechSavvy, ProgrammingLanguage, Bash]
image : /assets/img/post/bash.png
---

## Directory Exists?

``` sh
$ cat directory_ex.sh 
#!/bin/bash
test_dir_exist(){
    set -e 
    if [ -e "/home/jayleekr/workspace/00_codes/05_info_archive" ];then
        echo "DIR Exist"
        exit 1

    fi
}
test_fail(){
    echo "test_fail"
}
test_dir_exist
```

``` sh
$ ./directory_ex.sh
DIR Exist
```

## Appendix. References

- General : [http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html](http://tldp.org/LDP/Bash-Beginners-Guide/html/sect_07_01.html)

