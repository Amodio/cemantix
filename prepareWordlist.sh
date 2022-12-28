#!/bin/bash

# prepareWordlist.sh:
#     Use this script to sanitize a wordlist, before testing it
#     against the server with the Golang program.
#
# To get a wordlist from a w2v binary model, use these two lines:
# ./convertvec bin2txt "$name" "${name%.*}.txt"
# awk '{print $1}' "${name%.*}.txt" | awk NR\>1 > "$name.list"
#
# You may want to split your wordlist as 500000 words already takes ~30 minutes
# split -l 500000 "$name.list" "$name.list"

TMP_FILE_MAIN=$(mktemp -q /tmp/tmp.XXXXXX)
if [ $? -ne 0 ]; then
    echo 'error: cannot create temp file.' > /dev/stderr
    exit 1
fi

TMP_FILE=$(mktemp -q /tmp/tmp.XXXXXX)
if [ $? -ne 0 ]; then
    echo 'error: cannot create temp file.' > /dev/stderr
    exit 1
fi

if [ $# -ne 1 -o ! -f "$1" ]; then
    echo "Usage: $0 wordlist" > /dev/stderr
    echo "It will output the result into a wordlist_stripped file." > /dev/stderr
    exit 1
fi
echo "Provided: $(wc -l "$1" | awk '{print $1}') words."

# First: convert all words to lower case and get a unique appearance
cat "$1" | while read word; do
    echo "$word" | tr '[:upper:]' '[:lower:]'
done > "$TMP_FILE"
sort -u "$TMP_FILE" > "$TMP_FILE_MAIN"
echo "[+] Got $(wc -l "$TMP_FILE_MAIN" | awk '{print $1}') unique lower cased words."

# List of the words containing invalid characters
cat "$TMP_FILE_MAIN" | while read word; do
    if [[ $word = *[^a-zA-ZáíóúãñÑÁÂÀÍÓÚÇüéâäàåçêëèïîìÎÄÅÂÉÈôÕÒÔõðöòûùÿýÝÖÜžŽØø]* ]]; then
        echo "$word"
    fi
done > "$TMP_FILE"
if [ $? -ne 0 ]; then
    echo "ERROR!" > /dev/stderr
    rm -f "$TMP_FILE"
    rm -f "$TMP_FILE_MAIN"
    exit 1
fi
echo "[+] Got $(wc -l "$TMP_FILE" | awk '{print $1}') words containing invalid characters."

# Output the words not containing invalid chars (list generated above)
cat "$TMP_FILE_MAIN" | while read word; do
    grep -q -- "^$word$" "$TMP_FILE"
    if [ $? -ne 0 ]; then
        echo $word
    fi
done > "$1_stripped"
if [ $? -ne 0 ]; then
    echo "ERR!" > /dev/stderr
    rm -f "$TMP_FILE"
    rm -f "$TMP_FILE_MAIN"
    exit 1
fi
# Additional cleaning
echo "[1/3] Got $(wc -l "$1_stripped" | awk '{print $1}') stripped words."
grep -v _ "$1_stripped" > "$TMP_FILE"
grep -v '\.' "$TMP_FILE" > "$1_stripped"
echo "[2/3] Got $(wc -l "$1_stripped" | awk '{print $1}') stripped words."
grep -v '#' "$1_stripped" > "$TMP_FILE"
grep -v '\*' "$TMP_FILE" > "$1_stripped"
echo "[3/3] Got $(wc -l "$1_stripped" | awk '{print $1}') stripped words."
grep -v ':' "$1_stripped" > "$TMP_FILE"
grep -v '\/' "$TMP_FILE" > "$1_stripped"
rm -f "$TMP_FILE"
rm -f "$TMP_FILE_MAIN"
echo "Stripped to: $(wc -l "$1_stripped" | awk '{print $1}') words."
