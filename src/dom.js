import { getCardNumAndSuit } from './utils/get'

export function clearButton(type) {
  var div = document.getElementById('iframe-source').contentWindow.document.getElementById(type)
  while (div.firstChild) {
    div.removeChild(div.firstChild)
  }
}

export function addCardTypeButton(cardType) {
  var toBeAdd
  for (const key in cardType) {
    var type = 'type' + cardType[key]['cardType']
    var button = document.createElement('button')
    toBeAdd = document.getElementById('iframe-source').contentWindow.document.getElementById(type)
    button.id = key
    button.className = 'cardType'
    let n = cardType[key]['cardNum']
    if (n == 1) {
      button.innerText = key
    } else if (n == 0) {
      button.innerText = key
    } else {
      button.innerText = n + key
    }
    // button.innerText = cardType[key]['cardNum']+key;
    toBeAdd.append(button)
  }
}

export function addQuanBian(cardID) {
  let quanBianText = document.getElementById('iframe-source').contentWindow.document.getElementById('suit')
  if (enableQuanBian) {
    if (getCardNumAndSuit(cardID)['cardSuit'] == '♦' && !quanBian.has('♦')) {
      quanBianText.innerText += '♦️'
      quanBian.add('♦')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♥' && !quanBian.has('♥')) {
      quanBianText.innerText += '♥️'
      quanBian.add('♥')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♠' && !quanBian.has('♠')) {
      quanBianText.innerText += '♠️'
      quanBian.add('♠')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♣' && !quanBian.has('♣')) {
      quanBianText.innerText += '♣️'
      quanBian.add('♣')
    }
  }
}

export function addSuit(cardID) {
  let toBeAddBoTu = document.getElementById('iframe-source').contentWindow.document.getElementById('boTu')
  if (enableBoTu) {
    if (getCardNumAndSuit(cardID)['cardSuit'] == '♦' && !boTu.has('♦')) {
      toBeAddBoTu.innerText += '♦️'
      boTu.add('♦')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♥' && !boTu.has('♥')) {
      toBeAddBoTu.innerText += '♥️'
      boTu.add('♥')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♠' && !boTu.has('♠')) {
      toBeAddBoTu.innerText += '♠️'
      boTu.add('♠')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♣' && !boTu.has('♣')) {
      toBeAddBoTu.innerText += '♣️'
      boTu.add('♣')
    }
  }

  let toBeAddLuanJi = document.getElementById('iframe-source').contentWindow.document.getElementById('suit')
  if (enableLuanJi) {
    luanJi.add(getCardNumAndSuit(cardID)['cardSuit'])
    for (const suit of luanJi) {
      toBeAddLuanJi.innerText += suit
    }
  }
  if (enableHuaMu) {
    clearSuit()
    if (getCardNumAndSuit(cardID)['cardSuit'] == '♦') {
      toBeAdd.innerText += '🟥'
      huaMu.add('♦')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♥') {
      toBeAdd.innerText += '🟥'
      huaMu.add('♥')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♠') {
      toBeAdd.innerText += '⬛️'
      huaMu.add('♠')
    } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♣') {
      toBeAdd.innerText += '⬛️'
      huaMu.add('♣')
    }
  }
}

export function clearSuit() {
  if (enableQuanBian) {
    quanBian = new Set()
    document.getElementById('iframe-source').contentWindow.document.getElementById('suit').innerText = '权变 '
  }
  if (enableBoTu) {
    boTu = new Set()
    document.getElementById('iframe-source').contentWindow.document.getElementById('boTu').innerText = '博图 '
  }
  if (enableHuaMu) {
    document.getElementById('iframe-source').contentWindow.document.getElementById('suit').innerText = '化木 '
  }
  if (enableLuanJi) {
    luanJi = new Set()
    document.getElementById('iframe-source').contentWindow.document.getElementById('suit').innerText = '乱击 '
  }
}

export function resetOrderContainer() {
  for (let i = 0; i <= 7; i++) {
    document.getElementById('iframe-source').contentWindow.document.getElementsByClassName('orderContainer')[i].style.display = 'inline-block'
  }
}
export function hideOrderContainer(size) {
  for (let i = 7; i >= size; i--) {
    document.getElementById('iframe-source').contentWindow.document.getElementsByClassName('orderContainer')[i].style.display = 'none'
  }
}