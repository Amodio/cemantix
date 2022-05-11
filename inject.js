const myTimeout = 200
const processingStr = '<span class="button__text">Processing...</span>'
const jokerStr = '<span class="button__text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Joker!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
const bingoStr = '<span class="button__text">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;BINGO!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>'
let indexWords = 1
let previous_request = ''

function sleep(delay) {
  return new Promise(resolve => setTimeout(resolve, delay))
}

function myMeanCalc(arr) {
  return arr.reduce((acc, val) => acc + val, 0) / arr.length
}

function tryWord(word) {
  if (word.indexOf(' ') == -1 && word.length > 1) {
    document.getElementById("form").guess.value = word
    document.getElementById("guess-btn").click()
  }
}

function askAword() {
  var ws = new WebSocket('ws://localhost:8080')
  ws.onopen = function(e) {
    let positiveWords = []
    let negativeWords = []
    let negThreshold = 17.0
    const tmp = JSON.parse(localStorage.getItem("guesses"))
    if (tmp) {
      let meanPos = 0.0
      let tmpArray = []
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i][3])
          tmpArray.push(tmp[i][3])
      }
      if (tmpArray.length > 5)
        negThreshold = 10.0
      else if (tmpArray.length > 2)
        negThreshold = 12.0
      if (tmpArray.length > 5){
        meanPos = myMeanCalc(tmpArray)
      }
      let meanNeg = 0.0
      tmpArray = []
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i][3] == null)
          tmpArray.push(tmp[i][2])
      }
      meanNeg = myMeanCalc(tmpArray)
      for (let i = 0; i < tmp.length; i++) {
        if (tmp[i][3] == null && tmp[i][2] < meanNeg) {
          if (negativeWords.indexOf(tmp[i][0]) == -1) {
            negativeWords.push(tmp[i][0])
          }
        } else if (tmp[i][3] && tmp[i][3] > meanPos) {
          if (positiveWords.indexOf(tmp[i][0]) == -1) {
            positiveWords.push(tmp[i][0])
          }
        }
      }
      negativeWords = negativeWords.reverse()
    }
    if (previous_request == positiveWords.toString() + '0' + negativeWords.toString()) {
      indexWords++
    } else {
      indexWords = 1
      previous_request = positiveWords.toString() + '0' + negativeWords.toString()
    }
    ws.send(previous_request + '0' + indexWords)
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
    const tmp = JSON.parse(localStorage.getItem("guesses"))
    if (tmp && tmp[0][3] == 1000) {
      document.getElementById("button3").innerHTML = bingoStr
      document.getElementById("button3").classList.toggle("button--loading")
    } else {
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
  document.getElementById("form").insertAdjacentHTML('beforebegin', '<button id="button3">' + jokerStr + '</button>')
  const element = document.getElementById("button3")
  element.addEventListener("click", () => {
    toggleButton()
  })
  const tmp = JSON.parse(localStorage.getItem("guesses"))
  if (tmp && tmp[0][3] == 1000)
    element.innerHTML = bingoStr
  else
    loadPythonModel()
}
injectCSS()
addButton()