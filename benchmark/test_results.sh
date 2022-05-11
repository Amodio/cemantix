#!/bin/bash

# Exec the python script below (change model file & word & length):
# from gensim.models import KeyedVectors
# model = KeyedVectors.load_word2vec_format( "frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.bin", binary=True, unicode_errors="ignore")
# model.most_similar_cosmul("noble", topn=1000)
#
# Then paste results into:
# vi results;sed "s/), ('/\n/gi" results |cut -d \' -f1 > da; mv da results 
#
# Finally, run this script on the desired reference to get a count of matches:
# ./test_results.sh noble_REFERENCE_1000.txt results |wc -l;rm -f results

if [ $# -ne 2 ]; then
	echo "Usage: $0 REFERENCE.txt wordlist.txt" > /dev/stderr
	echo 'REFERENCE.txt: the reference wordlist' > /dev/stderr
	echo 'wordlist.txt: the wordlist to check' > /dev/stderr
	echo 'Print words that are both in REFERENCE and in wordlist.' > /dev/stderr
	exit 1
fi

cat "$1" | while read word; do
	grep "^$word\$" "$2" 
done
