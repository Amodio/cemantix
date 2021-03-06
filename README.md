# cemantix
Bot for a web game where you have to guess a word each day.

* Fetch this [word2vec model](frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.bin?raw=true "word2vec model") (29 MB, cleansed from [the creator of the game](https://fauconnier.github.io/#data "the creator of the game"))
* Run [websocket.py](websocket.py?raw=true "websocket.py") from the same directory (requires: `pip install gensim`)
* Go to https://cemantix.herokuapp.com
* Load [inject.js](inject.js?raw=true "inject.js") into your console (F12) or preferably in the Chrome extension [Custom JavaScript for Websites 2](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk "Custom JavaScript for Websites 2")
* Click the 'Joker!' button and enjoy!

![Joker button](images/joker_btn.png?raw=true "Joker button")
![Joker running](images/joker_processing.png?raw=true "Joker running")
![Run example](images/run.png?raw=true "Run example")
![Run example 2](images/run2.png?raw=true "Run example2")

## Notes
![Model Benchmarking](images/model_benchmark.png?raw=true "Model Benchmarking")

As you can see, results are far from being perfect!

I have tested _57759_ [valid words](goTestWords/wordlist.txt "valid words") for this game, some do not exist in French and the proposed models do not contain all of them:
```
$ wc -l missing_frWac_no*
 21332 missing_frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.txt
 18535 missing_frWac_no_postag_no_phrase_500_cbow_cut100.txt
 39867 total
$ wc -l frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.txt frWac_no_postag_no_phrase_500_cbow_cut100.txt
    36428 frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.txt
    39225 frWac_no_postag_no_phrase_500_cbow_cut100.txt
    75653 total
```
Nevertheless it works pretty well as this for now, even if a better model (= with all of the valid words found) would be salutary.

TODO: Execute the python part inside the browser, see: https://github.com/pyodide/pyodide/issues/2545
