export const gameState = {
  seat: 0, //用于座位安排
  isFirstTime: true, //第一次不会弹出skin窗口，只有oldGeneralID != GeneralID 时（新一局游戏）， 才会 isFirstTime = true；新一局游戏开始重置
  isGameStart: false,
  isSeatOrder: false, //座位是否安排好了
  isFrameAdd: false,
  idOrder: {}, //key为玩家id，value为实际座位顺序
  idOrderPre: [], //按顺序存储idOrder
  idOrderPreSet: new Set(), //按顺序存储idOrder
  isDuanXian: false,
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
  isClickSkinSelect: false,
  curGeneral: -1,
  oldGeneralID: 999,
  GeneralID: 999
}

export const deckState = {
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
  suits: {
    diamond: 0,
    spade: 0,
    heart: 0,
    club: 0,
    spade2_9: 0,
    hongsha: 0,
    heisha: 0
  },
  knownShouPai: new Set(),
  unknownCard: [],
  temShouPai: new Set(), //用于处理临时手牌
  remShouPai: new Set() //洗牌后剩余手牌
}

export const room = {
  cardList: [],
  size: 8,
  firstSeatID: 0,
  currentMode: {},
  currentCardType: {} //cardType 基本1锦囊2装备3其他4
}
