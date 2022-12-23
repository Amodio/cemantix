# cemantix
Bot for a web game where you have to guess a word each day.

* Go to https://cemantix.certitudes.org
* Load [inject.js](https://raw.githubusercontent.com/Amodio/cemantix/main/inject.js "inject.js") using the Chrome extension [Custom JavaScript for Websites 2](https://chrome.google.com/webstore/detail/custom-javascript-for-web/ddbjnfjiigjmcpcpkmhogomapikjbjdk "Custom JavaScript for Websites 2") or manually into your console (F12):
```
function injectScript(src){
  var script = document.createElement('script');
  script.src = src;
  document.head.appendChild(script);
}
injectScript('https://raw.githubusercontent.com/Amodio/cemantix/main/index.js')
```
* Click the 'Joker!' button and enjoy!

![Joker button](https://raw.githubusercontent.com/Amodio/cemantix/main/images/joker_btn.png "Joker button")
![First](https://raw.githubusercontent.com/Amodio/cemantix/main/images/1st_17tries.png "First")

## Notes
Models from [Jean-Philippe Fauconnier](https://fauconnier.github.io).

I have tested _57759_ [valid words](https://raw.githubusercontent.com/Amodio/cemantix/main/wordlist.txt "valid words") for this game, some do not exist in French and the proposed models do not contain all of them:
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
Nevertheless it works pretty well as this.

Check [benchmark.txt](https://raw.githubusercontent.com/Amodio/cemantix/main/benchmark/benchmark.txt) to see how good our models are from what the website is using.

TODO: cemantle (US)?
