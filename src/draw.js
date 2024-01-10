import { getCardNumAndSuit } from './utils/get'
import allCard from './map/allCard'
const emojiFontSize = '15px' // 可变的字体大小，可以根据需要进行调整


export function drawRemShouPai({remShouPai}) {
  var knownCardsDiv = document.getElementById('iframe-source').contentWindow.document.getElementById('knownCards')
  var knownCardsInHandDiv = document.getElementById('iframe-source').contentWindow.document.getElementById('knownCardsInHand')
  // knownCardsDiv.innerText = '';
  const shoupaiDIV = document.createElement('div')
  for (const c of remShouPai) {
    var button = document.createElement('button')
    if (getCardNumAndSuit(c)['cardSuit'] == '♦' || getCardNumAndSuit(c)['cardSuit'] == '♥') {
      button.className = 'shoupaiR' //红色手牌
    } else {
      button.className = 'shoupai'
    }
    let emojiWrapper = document.createElement('div')
    emojiWrapper.style.width = '100%'
    emojiWrapper.style.textAlign = 'center'

    let emoji = document.createElement('span')
    emoji.style.fontSize = emojiFontSize // 应用可变的字体大小
    emoji.innerText = getCardNumAndSuit(c)['cardNumAndSuit']

    emojiWrapper.appendChild(emoji)
    button.appendChild(emojiWrapper)
    button.innerHTML += getCardNumAndSuit(c)['name']
    shoupaiDIV.append(button)
  }

  knownCardsDiv.style.border = '1px rgb(40,40,40) solid'
  knownCardsDiv.style.animation = 'blink 2s'
  knownCardsDiv.style.animationIterationCount = 'infinite'

  knownCardsDiv.innerHTML = shoupaiDIV.innerHTML
  if (!knownCardsDiv.innerText == '') {
    knownCardsInHandDiv.style.display = 'block'
  }
}

export function drawDingOrDi(ding, di) {
  var DingCardsDiv = document.getElementById('iframe-source').contentWindow.document.getElementById('dingCards')
  var DiCardsDiv = document.getElementById('iframe-source').contentWindow.document.getElementById('diCards')
  DingCardsDiv.innerText = ''
  DiCardsDiv.innerText = ''
  const cardDIV = document.createElement('div')
  var dingReverse = ding.slice().reverse()
  for (const c of dingReverse) {
    var button = document.createElement('button')
    if (getCardNumAndSuit(c)['cardSuit'] == '♦' || getCardNumAndSuit(c)['cardSuit'] == '♥') {
      button.className = 'shoupaiR' //红色手牌
    } else {
      button.className = 'shoupai'
    }
    let emojiWrapper = document.createElement('div')
    emojiWrapper.style.width = '100%'
    emojiWrapper.style.textAlign = 'center'

    let emoji = document.createElement('span')
    emoji.style.fontSize = emojiFontSize // 应用可变的字体大小
    emoji.innerText = getCardNumAndSuit(c)['cardNumAndSuit']

    emojiWrapper.appendChild(emoji)
    button.appendChild(emojiWrapper)
    button.innerHTML += allCard[c] ? allCard[c]['name'] : '?'
    DingCardsDiv.append(button)
  }
  var diReverse = di.slice().reverse()
  for (const c of diReverse) {
    var button = document.createElement('button')
    if (getCardNumAndSuit(c)['cardSuit'] == '♦' || getCardNumAndSuit(c)['cardSuit'] == '♥') {
      button.className = 'shoupaiR' //红色手牌
    } else {
      button.className = 'shoupai'
    }
    let emojiWrapper = document.createElement('div')
    emojiWrapper.style.width = '100%'
    emojiWrapper.style.textAlign = 'center'

    let emoji = document.createElement('span')
    emoji.style.fontSize = emojiFontSize // 应用可变的字体大小
    emoji.innerText = getCardNumAndSuit(c)['cardNumAndSuit']

    emojiWrapper.appendChild(emoji)
    button.appendChild(emojiWrapper)
    button.innerHTML += allCard[c] ? allCard[c]['name'] : '?'
    DiCardsDiv.append(button)
  }
  DingCardsDiv.innerHTML = DingCardsDiv.innerHTML
  DiCardsDiv.innerHTML = DiCardsDiv.innerHTML
  if (DiCardsDiv.innerText == '') {
    DiCardsDiv.style.display = 'none'
  } else {
    DiCardsDiv.style.display = 'block'
  }
  if (DingCardsDiv.innerText == '') {
    DingCardsDiv.style.display = 'none'
  } else {
    DingCardsDiv.style.display = 'block'
  }
}

export function drawMiZhu(MiZhuRes) {
  var MiZhuResHTML = document.getElementById('iframe-source').contentWindow.document.getElementById('res')
  MiZhuResHTML.innerText = ''
  if (MiZhuRes.length == 0) {
    document.getElementById('iframe-source').contentWindow.document.getElementById('res').innerHTML = "<span style='color: red'>这道题冲儿算不出来</span>"
  } else {
    for (let sebs of MiZhuRes) {
      let span = document.createElement('span')
      var spanText = ''
      span.className = 'calRes'
      for (let seb of sebs) {
        spanText += ' ' + transformLetter(seb)
      }
      span.innerText = spanText
      span.onmousedown = function () {
        toClipboard(spanText)
        span.innerText = '复制成功'
        setTimeout(() => {
          span.textContent = spanText
        }, '500')
      }
      MiZhuResHTML.append(span)
      var br = document.createElement('br')
      MiZhuResHTML.append(br)
    }
  }
}

export function drawShouPai(shoupai) {
  var toBeAdd
  for (let i = 0; i < idOrderPre.length; i++) {
    let seatID = (i + 1).toString()
    toBeAdd = document.getElementById('iframe-source').contentWindow.document.getElementById(seatID)
    const shoupaiDIV = document.createElement('div')

    for (const s of shoupai[i]) {
      if (s == '0') {
        continue
      }

      var button = document.createElement('button')
      if (getCardNumAndSuit(s)['cardSuit'] == '♦' || getCardNumAndSuit(s)['cardSuit'] == '♥') {
        button.className = 'shoupaiR' // 红色手牌
      } else {
        button.className = 'shoupai'
      }

      if (knownShouPai.has(s)) {
        button.classList.add('knownShouPai')
      }

      let emojiWrapper = document.createElement('div')
      emojiWrapper.style.width = '100%'
      emojiWrapper.style.textAlign = 'center'

      let emoji = document.createElement('span')
      emoji.style.fontSize = emojiFontSize // 应用可变的字体大小
      emoji.innerText = getCardNumAndSuit(s)['cardNumAndSuit']

      emojiWrapper.appendChild(emoji)
      button.appendChild(emojiWrapper)
      button.innerHTML += allCard[s] ? allCard[s]['name'] : '?'
      shoupaiDIV.append(button)
    }

    toBeAdd.innerHTML = shoupaiDIV.innerHTML
  }
}