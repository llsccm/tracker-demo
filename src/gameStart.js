import { clearSuit } from './dom'

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
//console.warn(UsedGeneralSkinID);

export function gameStart({ cardList, gameStatusMap }) {
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

  let qipai = new Set() //zone2 弃牌
  let chuli = new Set() //zone3 处理区
  let biaoji = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] } //key为玩家id，value为zone4 标记区
  let shoupai = { 0: new Set(), 1: new Set(), 2: new Set(), 3: new Set(), 4: new Set(), 5: new Set(), 6: new Set(), 7: new Set() } //key为seat id而不是id，value为 zone5 手牌区
  let zhuangbei = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] } //key为玩家id，value为zone6 装备区
  let panding = { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [] } //key为玩家id，value为zone7 判定区
  let jineng = new Set() //观星询询会会出现 zone8
  let zone10 = new Set() //祈禳甘露 zone 10
  let ding = []
  let di = []
  let idOrder = {} //key为玩家id，value为实际座位顺序
  let seat = 0 //用于座位安排
  let isGameStart = false
  //cardType 基本1锦囊2装备3其他4
  let isSeatOrder = false //座位是否安排好了
  let isFrameAdd = false
  let arr = []
  let combos = []
  let newIdOrder = {}
  let newShouPai = {}
  let idOrderPreSet = new Set()
  let idOrderPre = []
  let isDuanXian = false
  let remShouPai = new Set()

  let temShouPai = new Set() //用于处理临时手牌
  let isDiMeng = false //缔盟
  let mySeatID = new Set() //用于计算糜竺13点，自己的位置
  let isFirstTime = true
  let GuoZhanGeneral = []
  let boTu = new Set()
  let enableBoTu = false
  let luanJi = new Set()
  let enableLuanJi = false
  let enableQuanBian = false
  let quanBian = new Set()
  let enableHuaMu = false
  let huaMu = new Set()
  let unknownCard = []
  let knownShouPai = new Set()
  let isClickSkinSelect = false
  let myID = -1
  let curGeneral = -1
  clearSuit()

  return {
    suits,
    paidui,
    qipai,
    chuli,
    biaoji,
    shoupai,
    zhuangbei,
    panding,
    jineng,
    zone10,
    ding,
    di,
    idOrder,
    seat,
    isGameStart,
    isSeatOrder,
    isFrameAdd,
    arr,
    combos,
    newIdOrder,
    newShouPai,
    idOrderPreSet,
    idOrderPre,
    isDuanXian,
    remShouPai,
    temShouPai,
    isDiMeng,
    mySeatID,
    isFirstTime,
    GuoZhanGeneral,
    boTu,
    enableBoTu,
    luanJi,
    enableLuanJi,
    enableQuanBian,
    quanBian,
    enableHuaMu,
    huaMu,
    unknownCard,
    knownShouPai,
    isClickSkinSelect,
    curGeneral,
    myID
  }
}
