# cemantix
Bot for a web game where you have to guess a word each day.

* Fetch a [word2vec model](https://embeddings.net/embeddings/frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.bin "word2vec model") (121 MB) from the creator of the game
* Run [websocket.py](websocket.py?raw=true "websocket.py") from the same directory (needs: `pip install gensim`)
* Go to https://cemantix.herokuapp.com
* Load [inject.js](inject.js?raw=true "inject.js") into your console (F12) or preferably in the Chrome extension [Custom JavaScript for Websites 2](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk "Custom JavaScript for Websites 2")
* Click the 'Joker!' button and enjoy!

![Joker button](images/joker_btn.png?raw=true "Joker button")
![Joker running](images/joker_processing.png?raw=true "Joker running")
![Run example](images/run.png?raw=true "Run example")

I went to 150 ms of sleep time (1st line of `inject.js`), the bug with one more word sent (16th here) is fixed.

# Note
In order to fetch the [right model](https://fauconnier.github.io/#data "right model"), I have tested all of them on two words:
---
![Model Benchmarking](images/model_benchmark.png?raw=true "Model Benchmarking")

As you can see, results are far from perfect (containing illegal words)!
I may try to cleanse the provided model later.
