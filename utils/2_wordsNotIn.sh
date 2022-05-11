#!/bin/bash

if [ $# -ne 2 ]; then
	echo "Usage $0: file1 file2" > /dev/stderr
	echo 'Returns the words from file2 not in file1' > /dev/stderr
	exit 1
fi

cat "$2" | while read word; do
	grep -q -- "^$word$" "$1"
	if [ $? -ne 0 ]; then
		echo $word
	fi
done
