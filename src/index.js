// import './style.css';
// import { setupCounter } from './counter.js';
import { main } from './main.js'

const version = '2.5.4'
window.WDVerSion = '1.0.0'
const SGSMODULE = []
if (!console._log) console._log = console.log
console._log('%cBASE', 'font-weight: bold; color: white; background-color: #525288; padding: 1px 4px; border-radius: 4px;')
const classList = ['SsCChatmsgNtf', 'GsCModifyUserseatNtf', 'MsgReconnectGame', 'MsgGamePlayCardNtf', 'PubGsCUseSpell', 'ClientHappyGetFriendHandcardRep', 'GsCRoleOptTargetNtf', 'PubGsCMoveCard', 'GsCFirstPhaseRole', 'GsCGamephaseNtf', 'PubGsCUseCard', 'ClientGeneralSkinRep', 'ClientLoginRep', 'MsgReconnectGame', 'ClientRoleGeneralStarRep', 'SmsgGameStateData']

const _log = (...args) => {
  // 如果第一个参数是一个对象，并且它的 className 属性在 classList 中，那么执行 console._log 和 SGSMODULE 中的函数
  if ((typeof args[0] === 'object' && 'className' in args[0] && classList.includes(args[0].className)) || args == '资源组加载完毕：selectSkin') {
    console._log(...args)
    SGSMODULE.forEach((fn) => fn(...args))
  }
}

Object.defineProperty(console, 'log', {
  get() {
    return _log
  },
  set() {
    return
  }
})
SGSMODULE.push(main)
window.SGSMODULE = SGSMODULE
