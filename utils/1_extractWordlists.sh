#!/bin/bash

for file in *.bin; do
    name="${file%????}"
    ./convertvec bin2txt "$name.bin" "$name.txt"
    awk '{print $1}' "$name.txt" | awk NR\>1 > "$name.list"
done
wc -l *.list
