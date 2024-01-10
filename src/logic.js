import { addCardTypeButton, clearButton, clearSuit, addQuanBian, addSuit, resetOrderContainer, hideOrderContainer } from './dom'
// import skinMap from './map/skinMap'
import { getCardNumAndSuit, allCardToCurrentMode, currentModeCardType } from './utils/get'
import { calcResult, JiZhanCal } from './utils/calc'
import { drawShouPai, drawRemShouPai, drawDingOrDi } from './draw'
import { removeCardType, addCardType, addCard, removeCard } from './zone'
import { addFrame, addSkinFrame, updateSkinList, updateSkinListGuoZhan } from './dom'

const deckConfig = {
  isJunZhengBiaoZhun: { label: '军争', diamond: 41, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isJunZhengBiaoZhunShanShan: { label: '军争', diamond: 41, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isGuoZhanBiaoZhun: { label: '国战', diamond: 27, spade: 27, heart: 27, club: 28, spade2_9: 17, hongsha: 8, heisha: 21 },
  isGuoZhanYingBian: { label: '国战应变', diamond: 26, spade: 27, heart: 28, club: 28, spade2_9: 17, hongsha: 8, heisha: 21 },
  isDouDiZhu: { label: '斗地主', diamond: 43, spade: 40, heart: 43, club: 40, spade2_9: 25, hongsha: 18, heisha: 30 },
  isShenWu: { label: '神武', diamond: 43, spade: 40, heart: 43, club: 40, spade2_9: 25, hongsha: 18, heisha: 30 },
  isZhuGongSha: { label: '主公杀', diamond: 40, spade: 39, heart: 38, club: 39, spade2_9: 25, hongsha: 14, heisha: 30 },
  isZhuGongShaShanShan: { label: '主公杀', diamond: 40, spade: 39, heart: 38, club: 39, spade2_9: 25, hongsha: 14, heisha: 30 },
  isHuanLeBiaoZhun: { label: '军争无木马', diamond: 40, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isHuanLeBiaoZhunShanShan: { label: '军争无木马', diamond: 40, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isJunZhengYingBian: { label: '军争应变', diamond: 41, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isJunZhengYingBianShanShan: { label: '军争应变', diamond: 41, spade: 40, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isShenZhiShiLian: { label: '神之试炼', diamond: 41, spade: 41, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 },
  isUnknown: { label: '未知牌堆', diamond: 41, spade: 41, heart: 40, club: 40, spade2_9: 25, hongsha: 14, heisha: 30 }
}
let mySkin
let card = {}
let disableSkinLogic = true
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
  luanJi: new Set(),
  quanBian: new Set(),
  huaMu: new Set(),
  enableBoTu: false,
  enableLuanJi: false,
  enableQuanBian: false,
  enableHuaMu: false,
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

// var mySkin
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

// var isSelectGeneral = false
let userID
let UserID
let curUserID
let oldGeneralID = 999 ////只有不同GeneralID才会更新skinFrame
let GeneralID = 999
var paiduiSum = 0 //用于计算的平均数,吉占

let gameStatusMap = {}
let remCardCount = 0
let currentMode = {}

//cardType 基本1锦囊2装备3其他4
let currentCardType
var mainID

// var gameModeMap = {}
// var calResult = []
// var cardNumAndSuit

var b = 1562902854
var isB = false
let isAutoCloseEnabled = true
//room
let room = {
  cardList: [],
  size: 8,
  firstSeatID: 0
}
// var DestSeatIDs
let DestSeatID

export function mainLogic(args) {
  let { className, CardIDs, CardID, FromID, FromZone, ToID, ToZone, CardCount, DataCount, SpellID, FromPosition, ToPosition, CardList } = args
  card.CardIDs = CardIDs
  card.CardID = CardID
  card.FromID = FromID
  card.FromZone = FromZone
  card.ToID = ToID
  card.ToZone = ToZone
  card.CardCount = CardCount
  card.DataCount = DataCount
  card.SpellID = SpellID //使用的技能
  card.FromPosition = FromPosition
  card.ToPosition = ToPosition
  if (typeof CardList != 'undefined') {
    room.cardList = CardList
  }

  let cardID = 0
  let { SeatID, Param, Params, DestSeatIDs, GeneralSkinList, Infos, Cards, targetSeatID, seatId, Round, curUserID, userID, UserID } = args
  var firstID = SeatID
  // var Param = args['Param']
  // var Params = args['Params']
  let ClientID = args['ClientID'] // 未使用
  // DestSeatIDs = args['DestSeatIDs']
  // var GeneralSkinList = args['GeneralSkinList']
  // var Infos = args['Infos']
  // var Cards = args['Cards']
  // var targetSeatID = args['targetSeatID']
  // var seatId = args['seatId']

  // var Round = args['Round']
  // var curUserID = args['curUserID']
  // var userID = args['userID']
  // var UserID = args['UserID']

  // gameState.enableBoTu = false
  // gameState.enableQuanBian = false

  if (className == 'ClientLoginRep') {
    userID = args['uid']
    console.warn('userID' + userID)
  }
  //enable博图
  if ((className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 306) || (curUserID == UserID && !gameStatusMap.isGuoZhanBiaoZhun && !gameStatusMap.isGuoZhanYingBian)) {
    gameState.enableBoTu = true
  }
  if (className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 7003 && curUserID == UserID) {
    gameState.enableQuanBian = true
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
    gameStatusInit(CardCount)
    currentMode = allCardToCurrentMode(room.cardList)
    currentCardType = currentModeCardType(currentMode)

    gameState = gameStart(room.cardList)
    for (let i = 1; i <= 3; i++) {
      clearButton('type' + i)
    }
    addCardTypeButton(currentCardType)
  }

  //严教
  if (className == 'GsCRoleOptTargetNtf' && typeof Params != 'undefined' && Param == 0 && card.SpellID == 945) {
    let arr = []
    for (const p of Params) {
      arr.push(parseInt(getCardNumAndSuit(p)['cardNum']))
    }
    calcResult(arr)
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
          // 这里看不懂！
          FromID = card.FromID
          FromZone = card.FromZone
          ToZone = card.ToZone
          ToID = card.ToID
          FromPosition = card.FromPosition
          ToPosition = card.ToPosition
          //
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

function gameStatusInit(cardCount) {
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
}

export function skinLogic(args) {
  var GeneralSkinList = args[0] && args[0]['GeneralSkinList']
  let className = args[0] && args[0]['className']
  let curUserID = args[0] && args[0]['ClientID']
  if (curUserID == b) isB = true

  //研究区
  // if(className == "" && typeof  args[0].idStr != 'undefined'){
  //     args[0].idStr = "206_20601_狂暴;0;2";
  // }

  //更改卡背 只有1是有用的
  if (className == 'GsClientSyncTablePersonalityCardSetRsp') {
    const seatDatas = args[0].seatDatas
    for (let i = 0; i < seatDatas.length; i++) {
      seatDatas[i].cardBackId = 1
      seatDatas[i].cardFaceId = 1
    }
  }

  //无用
  if (className == '') {
    // if (args[0].Model&&args[0].Nickname &&args[0].Nickname == "小麦丨麦麦麦"){
    //     args[0].Model = 8;
    //     // args[0].SkinItem.RealGeneralID = 161;
    //     // args[0].SkinItem.SkinID = 16101;
    //     // console.warn(args[0].SkinItem.GeneralID);
    //     // console.warn(args[0].SkinItem.RealGeneralID);
    //     // console.warn(args[0].SkinItem.SkinID);
    // }
  }
  if (className == 'GsCRoleOptTargetNtf') {
    if (typeof args[0].Params != 'undefined' && args[0].Params.length > 0 && args[0].Spell != null) {
      for (const p of args[0].Params) {
        console.warn('target Params' + JSON.stringify(getCardNumAndSuit(p)))
      }
      console.warn('target SkillName' + args[0].Spell.skillName)
    }
  }
  if (className == 'PubGsCUseSpell') {
    if (typeof args[0].CardIDs != 'undefined' && args[0].CardIDs.length > 0 && args[0].Spell != null) {
      for (const p of args[0].CardIDs) {
        console.warn('target useSpell Params' + JSON.stringify(getCardNumAndSuit(p)))
      }
      console.warn('target useSpell SkillName' + args[0].Spell.skillName)
    }
  }
  if (className == 'ClientLoginRep') {
    userID = args[0]['uid']
    UserID = args[0]['UserID']
    addSkinFrame() //预先注入
    console.warn('userID' + userID)
    if (!isFrameAdd) {
      addFrame()
    }
  }

  //enable博图
  if ((className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 306) || (curUserID == UserID && !gameStatusMap.isGuoZhanBiaoZhun && !gameStatusMap.isGuoZhanYingBian)) {
    gameState.enableBoTu = true
  }
  if (className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 7003 && curUserID == UserID) {
    gameState.enableQuanBian = true
  }
  // else if(className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 7003 && curUserID == UserID){
  //     enableJianYing = true;
  // }
  // else if(className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 509 && curUserID == UserID){
  //     enableHuaMu = true;
  // }
  //skinLogic start
  //进入游戏先进入这个class，点击皮肤按钮才进入“资源组加载完毕：selectSkin”
  //只适配当前用户的皮肤 && typeof(skinMap[GeneralID])!='undefined'
  // clientID 是seatID 我的seatid通过武将皮肤来获取，进场先跳几条换皮肤的信息，这个时候clientID是正常的，然后clientID变成座位号，可以通过重复的信息确定当前武将id，如果当前武将id等于信息台的武将id，则可以获取到myID
  if (className == 'ClientGeneralSkinRep' && (curUserID == userID || curGeneral == GeneralSkinList[0]['GeneralID'])) {
    console.warn('curUserID' + curUserID + 'userID' + userID + 'skin')
    GeneralID = GeneralSkinList[0]['GeneralID']
    gameState.curGeneral = gameState.curGeneral === -1 ? GeneralSkinList[0]['GeneralID'] : gameState.curGeneral
    if (curUserID < 10) {
      gameState.myID = curUserID
    } //没什么，只是初始化而已
    console.warn('myID' + gameState.myID + 'curGeneral' + gameState.curGeneral + 'skin')

    if (!disableSkinLogic) {
      //国战模式
      if (gameStatusMap.isGuoZhanBiaoZhun || gameStatusMap.isGuoZhanYingBian) {
        //国战只会换副将，仅仅在需要更新的时候才更新列表避免重复请求
        if (GuoZhanGeneral.indexOf(GeneralID) == -1) {
          if (GuoZhanGeneral.length >= 2) {
            GuoZhanGeneral[1] = GeneralID
          } else {
            GuoZhanGeneral.push(GeneralID)
          }
          updateSkinListGuoZhan(GuoZhanGeneral[0], GuoZhanGeneral[1])
          console.warn('GuoZhanGeneral' + GuoZhanGeneral)
          isFirstTime = false
        }
        //新的一局游戏开始，skinID需要初始化，用在localStorage里面的初始化
        if (!isClickSkinSelect) {
          if (typeof UsedGeneralSkinID != 'undefined' && typeof UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID] != 'undefined') {
            mySkin = UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID]
          }
        }
      } else {
        //general不一样：换将/新一局游戏开始
        //进场会有选皮肤框，isFirstTime true 不会跳出自选皮肤框
        //old 用于换将
        if (GeneralID != oldGeneralID && GeneralID != 999) {
          updateSkinList(GeneralID)
          ///999隐匿
          if (typeof UsedGeneralSkinID != 'undefined' && typeof UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID] != 'undefined') {
            mySkin = UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID]
            oldGeneralID = GeneralID
            gameState.isFirstTime = true
          } else {
            if (oldGeneralID == 999) {
              mySkin = 0
            } else {
              mySkin = UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID]
            }
            oldGeneralID = GeneralID
            gameState.isFirstTime = true
          }
        } else {
          gameState.isFirstTime = false
        }
      }
      console.warn('mySkin: ' + mySkin + ' oldGen: ' + oldGeneralID + ' general: ' + GeneralID + ' isFirstTime: ' + isFirstTime)
      console.warn('used skin' + UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID] + 'myskin' + mySkin)

      if (typeof mySkin != 'undefined') {
        //update my skin to local storage
        UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID] = mySkin
        localStorage.setItem(accountUsedGeneralSkinID, JSON.stringify(UsedGeneralSkinID))
        // console.warn(localStorage[accountUsedGeneralSkinID])
        //国战中两个武将，会出现两个武将的全部皮肤，选一个根据class确定现在的角色， 如果match，则换皮肤
        var box = document.getElementById('createSkinIframeSource').contentWindow.document.getElementById(parseInt(mySkin))
        //var box = document.getElementById(parseInt(mySkin));
        if (box != null && typeof box != 'undefined' && box.classList[1] == GeneralID) {
          GeneralSkinList[0]['SkinID'] = parseInt(mySkin)
        }
      }
      GeneralSkinList[0]['state'] = 1
      GeneralSkinList[0]['State'] = 1
    }
  }
  // TODO 仅仅是控制没用的，还需要恢复点击原来的皮肤，功能还能用
  if (args == '资源组加载完毕：selectSkin') {
    if (!disableSkinLogic && !gameState.isFirstTime && document.getElementById('createSkinIframeSource').contentWindow.document.body.innerHTML != '') {
      document.getElementById('createSkinIframe').style.display = 'inline-block'
      clickToChangeSkinAndCloseSkinFrame()
    }
  }
}

function gameStart(cardList) {
  let suits = {
    diamond: 0,
    spade: 0,
    heart: 0,
    club: 0,
    spade2_9: 0,
    hongsha: 0,
    heisha: 0
  }
  for (let i = 0; i < 8; i++) {
    let seatID = (i + 1).toString()
    document.getElementById('iframe-source').contentWindow.document.getElementById(seatID).innerHTML = ''
  }
  const paidui = new Set()
  for (const cid of cardList) {
    paidui.add(cid)
  }
  //全部区域清空,牌堆回复张
  var currentDeckConfig
  // 找到第一个为 true 的状态
  for (let key in deckConfig) {
    if (gameStatusMap[key]) {
      currentDeckConfig = deckConfig[key]
      //TODO
      suits = currentDeckConfig
      break
    }
  }
  document.getElementById('iframe-source').contentWindow.document.getElementById('nav1').innerHTML = '<b>当前牌堆：' + currentDeckConfig.label + '</b>'

  gameState.qipai = new Set() //zone2 弃牌
  gameState.chuli = new Set() //zone3 处理区
  gameState.biaoji = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] } //key为玩家id，value为zone4 标记区
  gameState.shoupai = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 6: new Set(), 7: new Set() } //key为seat id而不是id，value为 zone5 手牌区
  gameState.zhuangbei = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] } //key为玩家id，value为zone6 装备区
  gameState.panding = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] } //key为玩家id，value为zone7 判定区
  gameState.jineng = new Set() //观星询询会会出现 zone8
  gameState.zone10 = new Set() //祈禳甘露 zone 10
  gameState.ding = []
  gameState.di = []
  gameState.idOrder = {} //key为玩家id，value为实际座位顺序
  gameState.seat = 0 //用于座位安排
  gameState.isGameStart = false
  //cardType 基本1锦囊2装备3其他4
  gameState.isSeatOrder = false //座位是否安排好了
  gameState.isFrameAdd = false
  gameState.newIdOrder = {}
  gameState.newShouPai = {}
  gameState.idOrderPreSet = new Set()
  gameState.idOrderPre = []
  gameState.isDuanXian = false
  gameState.remShouPai = new Set()

  gameState.temShouPai = new Set() //用于处理临时手牌
  gameState.isDiMeng = false //缔盟
  gameState.mySeatID = new Set() //用于计算糜竺13点，自己的位置
  gameState.isFirstTime = true
  gameState.GuoZhanGeneral = []
  gameState.boTu = new Set()
  gameState.enableBoTu = false
  gameState.luanJi = new Set()
  gameState.enableLuanJi = false
  gameState.enableQuanBian = false
  gameState.quanBian = new Set()
  gameState.enableHuaMu = false
  gameState.huaMu = new Set()
  gameState.unknownCard = []
  gameState.knownShouPai = new Set()
  gameState.isClickSkinSelect = false
  gameState.myID = -1
  gameState.curGeneral = -1
  clearSuit()
}
