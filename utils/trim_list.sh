#!/bin/bash

TMP_FILE=$(mktemp -q /tmp/tmp.XXXXXX)
if [ $? -ne 0 ]; then
    echo "error: cannot create temp file." > /dev/stderr
    exit 1
fi

if [ $# -ne 1 ]; then
    echo "Usage: $0 wordlist" > /dev/stderr
    exit 1
fi

lines_before=$(cat "$1" | wc -l)
for i in {¢,¬,¦,³,=,_,:,@,+,--,°,¤,\`,´,¼,±,¶,®,\\^,·,¹,\ ,¿,\|,¨,¥,¡,«,»,©,×,²,\\.,£,½,\*,^\',\'$, ,¸,¯,\'}; do
    lines="$(cat "$1" | wc -l)"
    echo -n "Stripping ->$i<-: "
    grep -v -- "$i" "$1" > "$TMP_FILE"
    mv "$TMP_FILE" "$1"
    expr "$lines" - "$(cat "$1" | wc -l)"
done
lines="$(cat "$1" | wc -l)"
echo -n 'Stripping non-printable characters: '
grep -v '[^[:print:]]' "$1" > "$TMP_FILE"
mv "$TMP_FILE" "$1"
lines_after=$(cat "$1" | wc -l)
expr "$lines" - "$lines_after"
echo "Before: $lines_before"
echo "After: $lines_after"
echo -n 'Delta: '
expr "$lines_before" - "$lines_after"
