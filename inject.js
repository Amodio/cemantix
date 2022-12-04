const myTimeout = 500
const processingStr = '<span class="button__text">Processing...</span>'
const jokerStr = '<span class="button__text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joker!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
const bingoStr = '<span class="button__text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BINGO!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

function myMeanCalc(arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length
}

async function tryWord(word) {
  if (word.indexOf(' ') == -1 && word.length > 1) {
    document.getElementById("cemantix-form")[0].value = word
    while(document.getElementById("cemantix-guess").disabled) await sleep(myTimeout)
    document.getElementById("cemantix-guess-btn").click()
    await sleep(myTimeout)
  }
}

function askAword() {
  var ws = new WebSocket('ws://localhost:8080')
  ws.onopen = function(e) {
    let positiveWords = []
    let negativeWords = []
    const data = JSON.parse(localStorage.getItem("guesses"))
    if(data==null) {ws.send('_');return;}
    const tmp = Object.keys(data).map(function(key) {
      return [key, data[key]];
    }).sort((a, b) => b[1][1][0] - a[1][1][0]);
    if (tmp) {
      let meanPos = 0.0
      let tmpArray = []
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i][1][1][1])
          tmpArray.push(tmp[i][1][1][1])
      }
      let meanNeg = 18.0
      if (tmpArray.length > 5){
        meanPos = myMeanCalc(tmpArray)
      } else {
        tmpArray = []
        for (let i = 0; i < tmp.length; i++) {
          if (tmp[i][1][1][1] == null)
            tmpArray.push(tmp[i][1][1][0])
        }
        meanNeg = myMeanCalc(tmpArray)
      }
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i][1][1][1] == null && tmp[i][1][1][0] <= meanNeg) {
          if (negativeWords.indexOf(tmp[i][0]) == -1) {
            negativeWords.push(tmp[i][0])
          }
        } else if (tmp[i][1][1][1] && tmp[i][1][1][1] > meanPos) {
          if (positiveWords.indexOf(tmp[i][0]) == -1) {
            positiveWords.push(tmp[i][0])
          }
        }
      }
      negativeWords = negativeWords.reverse()
    }
    ws.send(positiveWords.toString() + '_' + negativeWords.toString())
  }
  ws.onmessage = function(e) {
    tryWord(e.data)
  }
  ws.onerror = function(e) {
    console.log(e)
  }
}

async function jokerTime() {
  
  while (document.getElementById("button3").innerHTML == processingStr) {
    if (document.getElementsByClassName('number close') && document.getElementsByClassName('number close').length > 0) {
        if (document.getElementsByClassName('number close')[1].innerText == 1000) {
          document.getElementById("button3").innerHTML = bingoStr
        document.getElementById("button3").classList.toggle("button--loading")
      } else {
        askAword()
        await sleep(myTimeout)
      }
    }else {
      askAword()
        await sleep(myTimeout)
    }
  }
}

function toggleButton() {
  const element = document.getElementById("button3")
  if (element.innerHTML == jokerStr) {
    element.innerHTML = processingStr
    jokerTime()
    element.classList.toggle("button--loading")
  } else if (element.innerHTML == processingStr) {
    element.innerHTML = jokerStr
    element.classList.toggle("button--loading")
  }
}

function injectCSS() {
  const style = document.createElement("style")
  style.innerHTML = '#button3{position:relative;padding:8px 16px;background:gold;border:none;outline:none;border-radius:2px;cursor:pointer;float:left}#button3:active{background:red}.button__text{font:bold 20px san-serif;transition:all 0.2s}.button--loading .button__text{opacity:0.4}.button--loading::after{content:"";position:absolute;width:16px;height:16px;top:0;left:0;right:0;bottom:0;margin:auto;border:4px solid transparent;border-top-color:#ffffff;border-radius:50%;animation:button-loading-spinner 1s ease infinite}@keyframes button-loading-spinner{from{transform:rotate(0turn)}to{transform:rotate(1turn)}}'
  document.getElementsByTagName("head")[0].appendChild(style)
}

function addButton() {
  document.getElementById("cemantix-form").insertAdjacentHTML('beforebegin', '<button id="button3">' + jokerStr + '</button>')
  const element = document.getElementById("button3")
  element.addEventListener("click", () => {
    toggleButton()
  })
    if (document.getElementsByClassName('number close').length > 0) {
      if (document.getElementsByClassName('number close')[1].innerText == 1000)
        element.innerHTML = bingoStr
  //  else
      //loadPythonModel()
  }
}
injectCSS()
addButton()
