# cemantix
Bot for a game where you have to guess a word per day

* Fetch a word2vec model from the creator of the game (121 MB): https://embeddings.net/embeddings/frWac_non_lem_no_postag_no_phrase_200_cbow_cut100.bin
* Run `websocket.py` (needs: `pip install gensim`)
* Go to https://cemantix.herokuapp.com
* Load `inject.js` into your console (F12) or preferably in the Chrome extension [Custom JavaScript for Websites 2](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk "Custom JavaScript for Websites 2")
* Click the 'Joker!' button and enjoy!

![Joker button](joker_btn.png?raw=true "Joker button")
![Run example](run.png?raw=true "Run example")


# Note
In order to fetch the right model, I have tested all of them on two words:
---
![Model Benchmarking](model_benchmark.png?raw=true "Model Benchmarking")

As you can see, results are far from perfect (containing illegal words)!
I may try to cleanse the provided model later.
