#!/bin/bash

TMP_FILE=$(mktemp -q /tmp/tmp.XXXXXX)
if [ $? -ne 0 ]; then
    echo "error: cannot create temp file." > /dev/stderr
    exit 1
fi

if [ $# -ne 2 ]; then
    echo "Usage $0: wordlist.txt model.txt" > /dev/stderr
    echo 'Discard any word not in wordlist.txt from a word2vec TXT model' > /dev/stderr
    echo 'Run ./convertvec bin2txt model.bin model.txt first.' > /dev/stderr
    exit 1
fi

cat "$1" | while read word; do
    grep "^$word " "$2" >> "$TMP_FILE"
done

echo "$(cat "$TMP_FILE" | wc -l) $(head -1 "$2" | awk '{print $2}')" > "$2"
cat "$TMP_FILE" >> "$2"
rm -f "$TMP_FILE"

name="${2%????}"
./convertvec txt2bin "$name.txt" "$name.bin"
