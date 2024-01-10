import { addCardTypeButton, clearButton, clearSuit, addQuanBian, addSuit, resetOrderContainer, hideOrderContainer } from './dom'
import { gameStart } from './gameStart'
// import skinMap from './map/skinMap'
import { getCardNumAndSuit, allCardToCurrentMode, currentModeCardType } from './utils/get'
import { calcResult, JiZhanCal } from './utils/calc'
import { drawShouPai, drawRemShouPai, drawDingOrDi, drawMiZhu } from './draw'
import { removeCardType, addCardType, addCard, removeCard } from './zone'

let card = {}

let gameState = {
  isFirstTime: true, //第一次不会弹出skin窗口，只有oldGeneralID != GeneralID 时（新一局游戏）， 才会 isFirstTime = true；新一局游戏开始重置
  paidui: new Set(), //, 别人摸未知牌不会改变,自己mainID摸牌会减少的牌,场上有明牌都会被移出,此牌堆包括别人手牌
  qipai: new Set(), //zone2 弃牌
  chuli: new Set(), //zone3 处理区
  newShouPai: { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 6: new Set(), 7: new Set() }, //key为seat id而不是id，value为 zone5 手牌区
  newIdOrder: { 0: -1, 1: -1, 2: -1, 3: -1, 4: -1, 5: -1, 6: -1, 7: -1 }, //key为玩家id，value为实际座位顺序
  biaoji: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, //key为玩家id，value为zone4 标记区
  shoupai: { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 6: new Set(), 7: new Set() }, //key为seat id而不是id，value为 zone5 手牌区
  zhuangbei: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, //key为玩家id，value为zone6 装备区
  panding: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] }, //key为玩家id，value为zone7 判定区
  jineng: new Set(), //观星询询会会出现
  zone10: new Set(),
  ding: [],
  di: [],
  seat: 0, //用于座位安排
  isGameStart: false,
  isSeatOrder: false, //座位是否安排好了
  isFrameAdd: false,
  arr: [],
  combos: [],
  idOrder: {}, //key为玩家id，value为实际座位顺序
  idOrderPre: [], //按顺序存储idOrder
  idOrderPreSet: new Set(), //按顺序存储idOrder
  isDuanXian: false,
  remShouPai: new Set(), //洗牌后剩余手牌
  temShouPai: new Set(), //用于处理临时手牌
  isDiMeng: false, //缔盟，清忠，等手牌全给情况
  mySeatID: new Set(), // 用于糜竺，可能包括不仅仅两个人的
  GuoZhanGeneral: [],
  myID: -1, //仅仅用于自己
  boTu: new Set(),
  enableBoTu: false,
  luanJi: new Set(),
  enableLuanJi: false,
  enableQuanBian: false,
  quanBian: new Set(),
  enableHuaMu: false,
  huaMu: new Set(),
  unknownCard: [],
  knownShouPai: new Set(),
  isClickSkinSelect: false,
  curGeneral: -1,
  suits: {
    diamond: 0,
    spade: 0,
    heart: 0,
    club: 0,
    spade2_9: 0,
    hongsha: 0,
    heisha: 0
  }
}
let insertInd //用于插入顶/底牌堆，黄承彦

var mySkin
var account = localStorage.SGS_LASTLOGIN_ACCOUNT
var accountUsedGeneralSkinID = account + '::UsedGeneralSkinID'
var UsedGeneralSkinIDString = localStorage[accountUsedGeneralSkinID]
var UsedGeneralSkinID
// Check if UsedGeneralSkinIDString is defined and not null
if (UsedGeneralSkinIDString) {
  try {
    UsedGeneralSkinID = JSON.parse(UsedGeneralSkinIDString)
  } catch (error) {
    console.error('Error parsing JSON:', error)
  }
} else {
  UsedGeneralSkinID = {}
  UsedGeneralSkinID['UsedGeneralSkinID'] = {}
}
//console.warn(UsedGeneralSkinID);

var isSelectGeneral = false
let userID
let UserID
let curUserID
let oldGeneralID = 999 ////只有不同GeneralID才会更新skinFrame
let GeneralID = 999
var paiduiSum = 0 //用于计算的平均数,吉占

var gameStatusMap = {}
let remCardCount = 0
let currentMode = {}

//cardType 基本1锦囊2装备3其他4
let currentCardType
var mainID
var closeIframe = false
var gameModeMap = {}
var calResult = []
var cardNumAndSuit

var b = 1562902854
var isB = false
var isAutoCloseEnabled = true;
//room
let room = {
  cardList: [],
  size: 8,
  firstSeatID: 0
}
var DestSeatIDs
var DestSeatID

export function mainLogic(args) {
  let className = args['className']
  card.CardIDs = args['CardIDs']
  card.CardID = args['CardID']
  card.FromID = args['FromID']
  card.FromZone = args['FromZone']
  card.ToID = args['ToID']
  card.ToZone = args['ToZone']
  card.CardCount = args['CardCount']
  card.DataCount = args['DataCount']
  card.SpellID = args['SpellID'] //使用的技能
  card.FromPosition = args['FromPosition']
  card.ToPosition = args['ToPosition']
  var cardCount = args['cardCount']
  if (typeof args['CardList'] != 'undefined') {
    room.cardList = args['CardList']
  }
  let cardID = 0
  var firstID = args['SeatID']
  var Param = args['Param']
  var Params = args['Params']
  let ClientID = args['ClientID']
  DestSeatIDs = args['DestSeatIDs']
  var GeneralSkinList = args['GeneralSkinList']
  var Infos = args['Infos']
  var Cards = args['Cards']
  var targetSeatID = args['targetSeatID']
  var seatId = args['seatId']
  var SeatID = args['SeatID']
  var Round = args['Round']
  var curUserID = args['curUserID']
  var userID = args['userID']
  var UserID = args["UserID"];

  var enableBoTu = false;
  var enableQuanBian = false;


  if(className == 'ClientLoginRep' ){
    userID = args["uid"];
    //addSkinFrame();//预先注入
    console.warn("userID"+userID);
    // if(!isFrameAdd){
    //   addFrame();
    //   var elmnt = document.getElementById('createIframe');
    //   buttonClick();
    //   initDragElement();
    // }
  }
  //enable博图
  if(className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 306 || (curUserID == UserID && !gameStatusMap.isGuoZhanBiaoZhun && !gameStatusMap.isGuoZhanYingBian)){
    enableBoTu = true;
  }
  if(className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 7003 && curUserID == UserID){
    enableQuanBian = true;
  }
  //博图，用于检测什么适合清空博图花色
  if (className == 'GsCGamephaseNtf' && Round == 0 && (gameState.enableBoTu || gameState.enableLuanJi || gameState.enableQuanBian)) {
    clearSuit()
  }
  if (className == 'GsCModifyUserseatNtf') {
    room.size = Infos['length']
    console.warn('card renshu' + room.size)
    for (let info of Infos) {
      if (info['ClientID'] < 4200000000) {
        room.firstSeatID = info['SeatID']
      }
    }
    console.warn('武将练习firstSeatID', room.firstSeatID)
  }
  if (className == 'MsgReconnectGame') {
    gameState.isDuanXian = true
  }

  // 游戏开始
  if (className == 'MsgGamePlayCardNtf') {
    gameStatusMap = {
      isJunZhengBiaoZhun: false,
      isJunZhengBiaoZhunShanShan: false,
      isJunZhengYingBian: false,
      isJunZhengYingBianShanShan: false,
      isShenZhiShiLian: false,
      isGuoZhanBiaoZhun: false,
      isGuoZhanYingBian: false,
      isDouDiZhu: false,
      isShenWu: false,
      isZhuGongSha: false,
      isZhuGongShaShanShan: false,
      isTongShuai: false,
      isUnknown: false,
      isHuanLeBiaoZhun: false,
      isHuanLeBiaoZhunShanShan: false
    }
    if (cardCount === 161 && room.cardList[160] === 12142) {
      gameStatusMap.isJunZhengBiaoZhunShanShan = true
    } else if (cardCount === 161 && room.cardList[160] === 161) {
      gameStatusMap.isJunZhengBiaoZhun = true
    } else if (cardCount === 160 && room.cardList[159] === 160) {
      gameStatusMap.isHuanLeBiaoZhun = true
    } else if (cardCount === 160 && room.cardList[159] === 12142) {
      gameStatusMap.isHuanLeBiaoZhunShanShan = true
    } else if (cardCount === 166 && room.cardList[165] === 13005) {
      gameStatusMap.isDouDiZhu = true
    } else if (cardCount === 155 && room.cardList[154] === 326) {
      gameStatusMap.isShenWu = true
    } else if (cardCount === 110 && room.cardList[107] === 1108) {
      gameStatusMap.isGuoZhanBiaoZhun = true
    } else if (cardCount == 161 && room.cardList[160] == 7160) {
      gameStatusMap.isJunZhengYingBian = true
    } else if (cardCount == 164 && room.cardList[160] == 7160) {
      gameStatusMap.isJunZhengYingBian = true
    } else if (cardCount == 162 && room.cardList[1] == 201) {
      gameStatusMap.isShenZhiShiLian = true
    } else if (cardCount == 111 && room.cardList[110] == 20330) {
      gameStatusMap.isGuoZhanYingBian = true
    } else if (cardCount == 157 && room.cardList[156] == 13005) {
      gameStatusMap.isGuoZhanYingBian = true
    } else if (cardCount == 158 && room.cardList[157] == 13005) {
      gameStatusMap.isZhuGongShaShanShan = true
    } else {
      gameStatusMap.isUnknown = true
    }
    currentMode = allCardToCurrentMode(room.cardList)
    currentCardType = currentModeCardType(currentMode)

    gameState = gameStart({ cardList: room.cardList, gameStatusMap })
    for (let i = 1; i <= 3; i++) {
      clearButton('type' + i)
    }
    addCardTypeButton(currentCardType)
  }

  //严教
  if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && Param == 0 && card.SpellID == 945) {
    gameState.arr = []
    for (const p of Params) {
      gameState.arr.push(parseInt(getCardNumAndSuit(p)['cardNum']))
    }
    calcResult()
  }
  //断线
  if (gameState.isDuanXian || isB) {
    if (document.getElementById('createIframe')) {
      document.getElementById('iframe-source').contentWindow.document.getElementById('nav1').innerHTML = '<b>不支持该牌堆/断线重连</b>'
      if (isAutoCloseEnabled) {
        document.getElementById('iframe-source').style.display = 'none'
        var toggle = document.getElementById('toggle-me')
        toggle.innerText = '+'
        document.getElementById('createIframe').style.height = '30px'
        document.getElementById('createIframe').style.resize = 'none' // 禁用窗口调整大小
        isAutoCloseEnabled = false
      }
    }
    return
  }

  // let cardNumAndSuit
  if (!gameState.isDuanXian && !isB) {
    if (className == 'GsCGamephaseNtf' && typeof Round != 'undefined' && typeof SeatID != 'undefined') {
      //座位表 start
      //先根据movecard发牌得到 idOrderPre 然后根据第一个阶段将座位重新排列
      if (!gameState.isSeatOrder && Round == 0 && (SeatID == room.firstSeatID || gameStatusMap.isDouDiZhu || gameStatusMap.isShenWu)) {
        if (gameStatusMap.isDouDiZhu) {
          room.firstSeatID = gameState.idOrderPre[0]
        }
        if (gameStatusMap.isShenWu) {
          room.firstSeatID = gameState.idOrderPre[4]
        }
        let ind = gameState.idOrderPre.indexOf(room.firstSeatID)
        for (let i = 0; i < gameState.idOrderPre.length; i++) {
          gameState.newIdOrder[gameState.idOrderPre[ind % gameState.idOrderPre.length]] = gameState.seat
          gameState.newShouPai[gameState.seat] = gameState.shoupai[gameState.idOrderPre[ind % gameState.idOrderPre.length]]
          gameState.seat++
          ind++
        }
        gameState.idOrder = gameState.newIdOrder
        gameState.shoupai = gameState.newShouPai
        gameState.isSeatOrder = true
        console.warn('card reOrder shoupai: ' + JSON.stringify(gameState.shoupai))
        console.warn('card reOrder seat info: ' + JSON.stringify(gameState.idOrder))
      }
    }
    if (className == 'GsCFirstPhaseRole' && (typeof seatId != 'undefined' || typeof SeatID != 'undefined')) {
      if (typeof seatId !== 'undefined') {
        room.firstSeatID = seatId
        console.warn('card first seat ID' + seatId)
      } else {
        room.firstSeatID = SeatID
        console.warn('card first seat ID' + SeatID)
      }
      gameState.seat = 0
    }
    //座位表 end
    if (className == 'PubGsCUseSpell' && typeof DestSeatIDs != 'undefined' && DestSeatIDs.length > 0 && (card.SpellID == 921 || card.SpellID == 851)) {
      //spell 记录目标角色 987 988 黄承彦，神甘921 伏间851
      //card.SpellID == 987  || || card.SpellID == 988
      DestSeatID = DestSeatIDs[0]
    }
    if (className == 'PubGsCUseSpell' && card.SpellID == 3157 && card.CardIDs.length != 0) {
      for (const c of card.CardIDs) {
        gameState.shoupai[gameState.idOrder[firstID]].add(c)
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'PubGsCUseSpell' && card.SpellID == 781) {
      //徐氏洗牌
      gameState.paidui.forEach((element) => {
        gameState.qipai.add(element)
      })
      gameState.paidui = new Set()
      gameState.ding = []
      gameState.di = []
    }

    if (className == 'PubGsCUseCard' && gameState.myID == SeatID && gameState.enableQuanBian) {
      //记录国战大嘴乱击花色
      console.warn('quanbian')
      addQuanBian(card.CardID)
    }
    if (className == 'PubGsCUseSpell' && card.SpellID == 2143) {
      gameState.enableLuanJi = true
      for (const c of card.CardIDs) {
        addSuit(c)
      }
    } else if (className == 'ClientHappyGetFriendHandcardRep') {
      //什么傻叉昭然，用的欢乐成双的class不用欢乐成双的ui和代码逻辑
      for (const c of Cards) {
        if (typeof gameState.idOrder[seatId] != 'undefined') {
          gameState.shoupai[gameState.idOrder[seatId]].add(c)
        }
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && targetSeatID != 255 && Param == 0 && card.SpellID == 3266) {
      Params = Params.slice()
        .reverse()
        .filter((_, index) => (index + 1) % 3 === 0)
      if (typeof targetSeatID != 'undefined') {
        for (const p of Params) {
          gameState.shoupai[gameState.idOrder[targetSeatID]].add(p)
          console.warn('card shoupai target ' + p)
        }
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && card.SpellID == 372) {
      //溃围
      // Params: (9) [5, 2, 63, 138, 60, 118, 153, 28, 20]

      if (typeof targetSeatID != 'undefined') {
        for (let p = Params.length - 1; p >= 0; p--) {
          gameState.shoupai[gameState.idOrder[targetSeatID]].add(Params[p])
        }
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && Param == 0 && (card.SpellID == 921 || card.SpellID == 851)) {
      //神甘宁 伏间 目标角色手牌
      //Param: 0
      // Params: (4) [101, 52, 143, 26]
      // SeatID: 5
      // SpellID: 921
      // SrcSeatID: 5
      // Timeout: 10
      if (typeof DestSeatID != 'undefined') {
        for (const p in Params) {
          gameState.shoupai[gameState.idOrder[DestSeatID]].add(Params[p])
        }
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && Param == 0 && (card.SpellID == 361 || card.SpellID == 774 || card.SpellID == 357 || card.SpellID == 811)) {
      //贿生 闪袭 勘破目标角色手牌
      if (typeof targetSeatID != 'undefined') {
        for (let p = Params.length - 1; p >= 0; p--) {
          gameState.shoupai[gameState.idOrder[targetSeatID]].add(Params[p])
        }
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && (card.SpellID == 3119 || card.SpellID == 501)) {
      //邓忠，改你妹啊
      if (typeof targetSeatID != 'undefined') {
        for (let p = Params.length - 1; p >= 0; p--) {
          gameState.shoupai[gameState.idOrder[targetSeatID]].add(Params[p])
        }
      }
      drawShouPai(gameState.shoupai)
    } else if (className == 'PubGsCMoveCard' && typeof card.CardCount != 'undefined' && card.CardCount > 0) {
      //游戏开始后 洗牌，会从弃牌堆2丢到洗牌堆
      if (card.FromZone == 2 && card.ToZone == 9 && card.FromID == 0 && card.ToID == 0 && gameState.isGameStart) {
        gameState.ding = []
        gameState.di = []
        remCardCount = card.CardCount
        gameState.remShouPai = gameState.paidui
        drawRemShouPai(gameState.remShouPai)
        gameState.paidui = gameState.qipai
        gameState.qipai = new Set()
        for (const cid of room.cardList) {
          removeCardType(cid)
        }
        gameState.suits = {
          diamond: 0,
          spade: 0,
          heart: 0,
          club: 0,
          spade2_9: 0,
          hongsha: 0,
          heisha: 0
        }
        gameState.paidui.forEach((element) => {
          addCardType(element)
        })
      }
      //游戏开始 弃牌堆2丢到洗牌堆
      else if (card.FromZone == 2 && card.ToZone == 9 && card.FromID == 0 && card.ToID == 0 && !gameState.isGameStart) {
        remCardCount = card.CardCount
        resetOrderContainer()
        // if(gameStatusMap.isZhuGongSha){hideOrderContainer(5);}
        // else if(gameStatusMap.isZhuGongShaShanShan){hideOrderContainer(5);}
        hideOrderContainer(room.size)
        console.warn('发牌')
      }
      //系统发牌+手气卡拿牌+牌堆全部进入弃牌堆了洗牌 对自己手牌和cardType 和paidui 产生影响
      else if (card.ToZone == 5 && card.FromID == 255 && card.FromZone == 1 && !gameState.isGameStart) {
        //重复用手气卡不会添加 但是手牌会更新
        console.warn('游戏开始,系统发牌/使用手气卡')
        console.warn('card shouqika/fapai shoupai[id]' + JSON.stringify(gameState.shoupai))
        remCardCount -= card.CardCount
        if (!gameState.idOrderPreSet.has(card.ToID)) {
          gameState.idOrderPreSet.add(card.ToID)
          gameState.idOrderPre.push(card.ToID)
        }
        console.warn('card idOrderPre ' + JSON.stringify(gameState.idOrderPre))

        //用于22 的糜竺计算
        if (typeof card.CardIDs[0] != 'undefined' && card.CardIDs[0] != 0) {
          mainID = card.ToID
          gameState.mySeatID.add(mainID)
        }

        for (let i = 0; i < card.CardCount; i++) {
          if (card.CardIDs.length != 0) {
            cardID = card.CardIDs[i]
            const targetID = gameState.isSeatOrder ? gameState.idOrder[card.ToID] : card.ToID
            gameState.shoupai[targetID].add(cardID)
            removeCardType(cardID)
            gameState.paidui.delete(cardID)
          }
        }
      }
      //手气卡丢牌
      else if (card.FromZone == 5 && card.ToZone == 1 && card.ToID == 0 && !gameState.isGameStart) {
        remCardCount += card.CardCount
        gameState.shoupai[card.FromID] = new Set()
        for (let i = 0; i < card.CardCount; i++) {
          if (card.CardIDs.length != 0) {
            cardID = card.CardIDs[i]
          }
          addCardType(cardID)
          gameState.paidui.add(cardID)
        }
        console.warn('card 手气卡丢牌 ' + JSON.stringify(gameState.shoupai))
      }
      //神武先丢一张装备牌
      else if (card.FromID == 255 && card.FromZone == 1 && card.ToZone == 12 && card.ToID == 255 && !gameState.isGameStart) {
        removeCardType(cardID)
      }
      //然后换一个装备置入牌堆
      else if (card.FromID == 255 && card.FromZone == 0 && card.ToZone == 1 && card.ToID == 255 && !gameState.isGameStart) {
        addCardType(cardID)
      } else if (card.FromID == 255 && card.FromZone == 1 && card.ToZone == 6 && !gameState.isGameStart) {
      }
      // 或者有其他操作,则说明游戏开始
      //不点手气卡,摸牌,也会进入这里
      else {
        gameState.isGameStart = true
      }
      //游戏开始
      if (gameState.isGameStart) {
        // 缔盟 清忠
        if (card.FromZone == 10 && card.FromID != card.ToID && card.ToPosition == 65280 && card.FromPosition == 65282 && card.ToZone == 5 && (card.SpellID == 3036 || card.SpellID == 121)) {
          //只需要换一次，清忠缔盟会有两次，第一次赋值之后就不需要再换了
          gameState.isDiMeng = !gameState.isDiMeng
          if (gameState.isDiMeng) {
            gameState.temShouPai = gameState.shoupai[gameState.idOrder[card.ToID]]
            gameState.shoupai[gameState.idOrder[card.ToID]] = gameState.shoupai[gameState.idOrder[card.FromID]]
            gameState.shoupai[gameState.idOrder[card.FromID]] = gameState.temShouPai
          }
        }

        for (let i = 0; i < card.CardCount; i++) {
          if (card.CardIDs.length != 0) {
            cardID = card.CardIDs[i]
          } else {
            cardID = 0
          }
          var FromID = card.FromID
          var FromZone = card.FromZone
          var ToZone = card.ToZone
          var ToID = card.ToID
          var FromPosition = card.FromPosition
          var ToPosition = card.ToPosition
          if (card.FromZone == 1) {
            remCardCount--
          }
          if (card.ToZone == 1) {
            remCardCount++
          }
          //从牌堆出发，到其他区域，判断顶/底
          //从顶摸牌 已经到底了
          if (FromID == 255 && FromZone == 1 && FromPosition == 65280 && gameState.di.length != 0 && remCardCount == gameState.di.length) {
            gameState.ding = gameState.di.reverse()
            gameState.di = []
          }
          //顶
          if (FromID == 255 && FromZone == 1 && FromPosition == 65280 && gameState.ding.length != 0 && cardID == 0) {
            cardID = gameState.ding.pop()
            console.warn('card 顶 pop ' + cardID)
          }

          //底
          if (FromID == 255 && FromZone == 1 && FromPosition == 0 && gameState.di.length != 0 && cardID == 0) {
            cardID = gameState.di.pop()
            console.warn('card 底 pop ' + cardID)
          }
          removeCard(FromID, cardID, FromZone, FromPosition)
          addCard(ToID, cardID, ToZone, ToPosition, card.SpellID)
        }
      }
      if (card.FromZone == 1 && card.FromID == 255 && card.ToZone == 8 && card.ToID == 255 && typeof card.SpellID != 'undefined' && card.SpellID == 3033) {
        JiZhanCal(parseInt(getCardNumAndSuit(cardID)['cardNum']))
      }
      //行殇
      if (typeof card.SpellID != 'undefined' && card.SpellID == 105) {
        for (const c of gameState.shoupai[gameState.idOrder[card.FromID]]) {
          removeCard(card.FromID, c, card.FromZone, card.FromPosition)
          addCard(card.ToID, c, card.ToZone, card.SpellID)
        }
      }
      drawShouPai(gameState.shoupai)
      drawDingOrDi(gameState.ding, gameState.di)
      if (gameState.remShouPai.size != 0) {
        drawRemShouPai(gameState.remShouPai)
      } else {
        document.getElementById('iframe-source').contentWindow.document.getElementById('knownCards').innerText = ''
        document.getElementById('iframe-source').contentWindow.document.getElementById('knownCardsInHand').style.display = 'none'
      }
    }
    isAutoCloseEnabled = true
  }
}
