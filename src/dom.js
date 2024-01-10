import { getCardNumAndSuit } from './utils/get'
import html from './html/iframe'
import skinHTML from './html/skin'

let iframe = null
let closeIframe = false
const version = ' 2.5.5'

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

export function addFrame() {
  isFrameAdd = true
  let div = document.getElementById('createIframe')

  if (!div) {
    div = document.createElement('div')
    div.id = 'createIframe'
    div.className = 'createIframe'
    div.style = 'position: fixed;' + 'overflow: hidden;' + 'resize: vertical;  ' + 'top: 200px; ' + 'right: 5px;' + 'width: 210px;' + 'height: 500px;' + 'z-index: 10000000000;' + 'display: flex;' + 'flex-direction: column;' + 'color: #f2de9c;' + 'background: rgb(50, 50, 50);' + 'user-select: none;' + 'text-align: left;' + 'transition: height 200ms;'

    var header = document.createElement('p')
    header.id = 'header'
    header.className = 'header'
    header.innerText = '三国杀打小抄' + version
    header.style = 'display: inline-block;' + 'margin: 1px;' + 'user-select: none;' + 'cursor: move;' + 'display: flex;' + 'justify-content: space-between;' + 'font-size: 20px;' // 设置字体大小，根据需要调整

    div.appendChild(header)

    // 创建按钮并将其放在 header 最右侧
    var btn = document.createElement('btn')
    btn.innerText = '-'
    btn.id = 'toggle-me'
    btn.style =
      'text-align: center;' +
      'color: #f2de9c;' +
      'background: rgb(50, 50, 50);' +
      'border-radius: 5px;' +
      'width: 25px;' +
      'height: 25px;' +
      'border: 1px solid rgb(212, 212, 162);' +
      'cursor: pointer;' +
      'user-select: none;' +
      'background: rgb(107, 30, 30);' +
      'display: flex;' + // 使用 flex 布局
      'align-items: center;' + // 垂直居中
      'justify-content: center;' + // 水平居中
      'margin: 0;' // 设置外边距为零

    // 添加悬停效果
    btn.addEventListener('mouseover', function () {
      btn.style.backgroundColor = 'rgb(130, 30, 30)'
    })
    btn.addEventListener('mouseout', function () {
      btn.style.backgroundColor = 'rgb(107, 30, 30)'
    })

    var toTab = document.createElement('button')
    toTab.innerText = '【】'
    toTab.id = 'toTab'
    toTab.style =
      'text-align: center;' +
      'color: #f2de9c;' +
      'background: rgb(50, 50, 50);' +
      'border-radius: 5px;' +
      'width: 25px;' +
      'height: 25px;' +
      'border: 1px solid rgb(212, 212, 162);' +
      'cursor: pointer;' +
      'user-select: none;' +
      'background: rgb(107, 30, 30);' +
      'display: flex;' + // 使用 flex 布局
      'align-items: center;' + // 垂直居中
      'justify-content: center;' + // 水平居中
      'margin: 0;' // 设置外边距为零

    header.appendChild(btn)
    //header.appendChild(toTab);
    // 将按钮添加到 header 的右侧

    document.body.appendChild(div)

    iframe = document.createElement('iframe')
    iframe.style = 'border: none;' + 'width: 210px;' + 'height: 1000px;' + 'margin: 0px;' + 'cursor: move;'
    iframe.id = 'iframe-source'
    iframe.title = 'iframe'

    // iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
    div.append(iframe)
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(html)
    iframe.contentWindow.document.close()
  }
  buttonClick()
  initDragElement()
}

function buttonClick() {
  document.getElementById('iframe-source').contentWindow.document.getElementById('uuid').innerText = 'id：' + userID

  var toggle = document.getElementById('toggle-me')
  toggle.onmousedown = function () {
    closeIframe = !closeIframe
    if (closeIframe) {
      document.getElementById('iframe-source').style.display = 'none'
      toggle.innerText = '+'
      document.getElementById('createIframe').style.height = '30px'
      document.getElementById('createIframe').style.resize = 'none' // 禁用窗口调整大小
    } else {
      document.getElementById('iframe-source').style.display = 'block'
      toggle.innerText = '-'
      document.getElementById('createIframe').style.height = '500px'
      document.getElementById('createIframe').style.resize = 'vertical' // 启用窗口调整大小
    }
  }

  var MiZhuCalBTN = document.getElementById('iframe-source').contentWindow.document.getElementById('mizhu')
  var mySeat1BTN = document.getElementById('iframe-source').contentWindow.document.getElementById('mySeatID1')
  var mySeat2BTN = document.getElementById('iframe-source').contentWindow.document.getElementById('mySeatID2')

  MiZhuCalBTN.onmousedown = function () {
    if (mySeatID.size == 1) {
      mySeat1BTN.style.display = 'none'
      mySeat2BTN.style.display = 'none'
      for (const m of mySeatID) {
        MiZhuCards = []
        for (const card of shoupai[idOrder[m]]) {
          MiZhuCards.push(getCardNumAndSuit(card)['cardNum'])
        }
        MiZhuCal(MiZhuCards, MiZhuCards.length)
        drawMiZhu(MiZhuRes)
      }
    } else {
      var index = 0
      for (const m of mySeatID) {
        index += 1
        var seatIND = 'mySeatID' + index
        document.getElementById('iframe-source').contentWindow.document.getElementById(seatIND).style.display = 'block'
        document.getElementById('iframe-source').contentWindow.document.getElementById(seatIND).innerText = '座位: ' + (idOrder[m] + 1)
        document.getElementById('iframe-source').contentWindow.document.getElementById(seatIND).onmousedown = function () {
          MiZhuCards = []
          for (const card of shoupai[idOrder[m]]) {
            MiZhuCards.push(getCardNumAndSuit(card)['cardNum'])
          }
          MiZhuCal(MiZhuCards, MiZhuCards.length)
          drawMiZhu(MiZhuRes)
        }
      }
    }
  }
}

function initDragElement() {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0
  var popups = document.getElementsByClassName('createIframe')
  var elmnt = null
  var currentZIndex = 100

  for (var i = 0; i < popups.length; i++) {
    var popup = popups[i]
    var header = getHeader(popup)

    popup.onmousedown = function () {
      this.style.zIndex = '' + ++currentZIndex
    }

    if (header) {
      header.parentPopup = popup
      header.onmousedown = dragMouseDown
    }
  }

  function dragMouseDown(e) {
    elmnt = this.parentPopup
    elmnt.style.zIndex = '' + ++currentZIndex

    e = e || window.event
    // get the mouse cursor position at startup:
    pos3 = e.clientX
    pos4 = e.clientY
    document.onmouseup = closeDragElement
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag
  }

  function elementDrag(e) {
    if (!elmnt) {
      return
    }

    e = e || window.event
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX
    pos2 = pos4 - e.clientY
    pos3 = e.clientX
    pos4 = e.clientY
    // set the element's new position:
    elmnt.style.top = elmnt.offsetTop - pos2 + 'px'
    elmnt.style.left = elmnt.offsetLeft - pos1 + 'px'
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null
    document.onmousemove = null
  }

  function getHeader(element) {
    var headerItems = element.getElementsByClassName('header')

    if (headerItems.length === 1) {
      return headerItems[0]
    }

    return null
  }
}

export function drawYanJiao(filteredPairs) {
  var YanJiaoResHTML = document.getElementById('iframe-source').contentWindow.document.getElementById('res')
  YanJiaoResHTML.innerText = ''
  for (let sebs of filteredPairs) {
    let span = document.createElement('button')
    span.className = 'calRes'
    span.innerText = sebs
    span.onmousedown = function () {
      toClipboard(sebs)
      span.innerText = '复制成功'
      setTimeout(() => {
        span.textContent = sebs
      }, '500')
    }
    YanJiaoResHTML.append(span)

    var br = document.createElement('br')
    YanJiaoResHTML.append(br)
  }
}

export function addSkinFrame() {
  let createSkinIframe = document.getElementById('createSkinIframe')

  if (!createSkinIframe) {
    createSkinIframe = document.createElement('div')
    createSkinIframe.id = 'createSkinIframe'
    createSkinIframe.className = 'createSkinIframe'
    createSkinIframe.style = '    display: inline-block;' + '    z-index: 10000000000;' + '    display: none;' + '    width: 680px;' + '    height:500px;' + '    position: fixed;' + '    top: 0;' + '    bottom: 0;' + '    left: 0;' + '    right: 20%;' + '    background: rgb(50,50,50);' + '    margin: auto;'

    var header = document.createElement('p')
    header.id = 'header'
    header.className = 'header'
    header.innerText = '请选择皮肤，选中后会自动关闭此窗口，再关闭自身的皮肤窗口即可'
    header.style = 'style:display:inline-block;' + 'margin:1px;' + 'user-select:none;' + 'text-align:center;' + 'color: #f2de9c; ' + 'cursor: pointer'
    var btnSkin = document.createElement('btn')

    btnSkin.innerText = '×'
    btnSkin.id = 'btnSkin'
    btnSkin.style = 'text-align:center;' + 'color: #f2de9c;' + 'background: rgb(40,40,40);' + 'border-radius:5px;' + 'margin-left:3px;' + 'border: 1px solid rgb(212,212,162);' + 'cursor: pointer;' + 'user-select:none;' + 'background: rgb(107,30,30);'
    header.append(btnSkin)
    createSkinIframe.appendChild(header)

    document.body.appendChild(createSkinIframe)

    iframe = document.createElement('iframe')
    iframe.style = 'border: none;' + '    width: 680px;' + '    height:475px;' + 'margin: 0px;' + 'cursor: move;'
    iframe.id = 'createSkinIframeSource'
    iframe.title = 'iframe'

    //iframe.src = 'data:text/html;charset=utf-8,' + encodeURI(html);
    createSkinIframe.append(iframe)
    iframe.contentWindow.document.open()
    iframe.contentWindow.document.write(skinHTML)
    iframe.contentWindow.document.close()
  }
  //skinLogic start
  var btnSkin = document.getElementById('btnSkin')
  btnSkin.onmousedown = function () {
    document.getElementById('createSkinIframe').style.display = 'none'
  }
  //skinLogic end
}

export function updateSkinList(generalID) {
  document.getElementById('createSkinIframeSource').contentWindow.document.body.innerHTML = ''
  //这是原皮
  var imgSkin = document.createElement('img')
  imgSkin.id = 0
  imgSkin.className = 'skinList'
  imgSkin.classList.add(generalID)
  imgSkin.src = 'https://web.sanguosha.com/220/h5_2/res/runtime/pc/general/seat/static/generalface_' + generalID + '.png'
  document.getElementById('createSkinIframeSource').contentWindow.document.body.append(imgSkin)

  if (typeof skinMap[generalID] != 'undefined') {
    for (let i = 0; i < skinMap[generalID].length; i++) {
      for (let id = 1; id <= 12; id++) {
        var imgSkin = document.createElement('img')
        imgSkin.id = skinMap[generalID][i] * 100 + id
        imgSkin.className = 'skinList'
        imgSkin.classList.add(generalID)
        imgSkin.src = 'https://web.sanguosha.com/220/h5_2/res/runtime/pc/general/seat/static/' + imgSkin.id + '.png'
        if (imgSkin.id != 0) {
          document.getElementById('createSkinIframeSource').contentWindow.document.body.append(imgSkin)
        }
      }
    }
  }
  //除了界的，没适配的皮肤在这里
  else {
    for (let id = 1; id <= 12; id++) {
      var imgSkin = document.createElement('img')
      imgSkin.id = generalID * 100 + id
      imgSkin.className = 'skinList'
      imgSkin.classList.add(generalID)
      imgSkin.src = 'https://web.sanguosha.com/220/h5_2/res/runtime/pc/general/seat/static/' + imgSkin.id + '.png'
      if (imgSkin.id != 0) {
        document.getElementById('createSkinIframeSource').contentWindow.document.body.append(imgSkin)
      }
    }
  }
  document
    .getElementById('createSkinIframeSource')
    .contentWindow.document.querySelectorAll('.skinList')
    .forEach(function (img) {
      img.onerror = function () {
        this.style.display = 'none'
      }
    })
}

export function updateSkinListGuoZhan(generalID1, generalID2) {
  document.getElementById('createSkinIframeSource').contentWindow.document.body.innerHTML = ''
  if (typeof skinMap[generalID1] != 'undefined') {
    for (let i = 0; i < skinMap[generalID1].length; i++) {
      for (let id = 1; id <= 12; id++) {
        var imgSkin = document.createElement('img')
        imgSkin.id = skinMap[generalID1][i] * 100 + id
        imgSkin.className = 'skinList'
        imgSkin.classList.add(generalID1)
        imgSkin.src = 'https://web.sanguosha.com/220/h5_2/res/runtime/pc/general/seat/static/' + imgSkin.id + '.png'
        if (imgSkin.id != 0) {
          document.getElementById('createSkinIframeSource').contentWindow.document.body.append(imgSkin)
        }
      }
    }
  }
  const lineBreak = document.createElement('br')
  document.getElementById('createSkinIframeSource').contentWindow.document.body.append(lineBreak)
  document.getElementById('createSkinIframeSource').contentWindow.document.body.append(lineBreak)
  if (typeof skinMap[generalID2] != 'undefined') {
    for (let i = 0; i < skinMap[generalID2].length; i++) {
      for (let id = 1; id <= 12; id++) {
        var imgSkin = document.createElement('img')
        imgSkin.id = skinMap[generalID2][i] * 100 + id
        imgSkin.className = 'skinList'
        imgSkin.classList.add(generalID2)
        imgSkin.src = 'https://web.sanguosha.com/220/h5_2/res/runtime/pc/general/seat/static/' + imgSkin.id + '.png'
        if (imgSkin.id != 0) {
          document.getElementById('createSkinIframeSource').contentWindow.document.body.append(imgSkin)
        }
      }
    }
  }
  document
    .getElementById('createSkinIframeSource')
    .contentWindow.document.querySelectorAll('.skinList')
    .forEach(function (img) {
      img.onerror = function () {
        this.style.display = 'none'
      }
    })
}
