# cemantix
Bot for a web game where you have to guess a word each day (FR + EN).

* Go to https://cemantix.certitudes.org or https://cemantle.certitudes.org
* Load [inject.js](https://raw.githubusercontent.com/Amodio/cemantix/main/inject.js "inject.js") using the Chrome extension [Custom JavaScript for Websites 2](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk "Custom JavaScript for Websites 2") or manually into your console (F12):
```
function injectScript(src){
  var script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
}
injectScript('https://raw.githubusercontent.com/Amodio/cemantix/main/inject.js')
```
* Click the 'Joker!' button and enjoy!

![Joker button](https://raw.githubusercontent.com/Amodio/cemantix/main/images/joker_btn.png "Joker button")

![First](https://raw.githubusercontent.com/Amodio/cemantix/main/images/1st_17tries.png "First")

## Notes
Models from [Jean-Philippe Fauconnier](https://fauconnier.github.io) and [Google](https://code.google.com/archive/p/word2vec/) (for Cemantle).

I have tested _55402_ [FR words](https://raw.githubusercontent.com/Amodio/cemantix/main/wordlist.txt "FR words") for this game even if some do not exist in French; _46212_ [EN words](https://raw.githubusercontent.com/Amodio/cemantix/main/wordlist.txt "EN words") for Cemantle. Check [benchmark.txt](https://raw.githubusercontent.com/Amodio/cemantix/main/benchmark/benchmark.txt) or [benchmark.txt](https://raw.githubusercontent.com/Amodio/cemantix/main/CEMANTLE/benchmark/benchmark.txt) (Cemantle) to see how similar our models are: ~97% for Cémantix and 100% for Cemantle.

*TODO:* cache the fetched models and do not compress any model to load it quicker? (optimization) + why not 100% match for Cémantix (accents)?
