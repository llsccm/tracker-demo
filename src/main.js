import { mainLogic } from './mainLogic'
import { skinLogic } from './skinLogic'
const classList = ['SsCChatmsgNtf', 'GsCModifyUserseatNtf', 'MsgReconnectGame', 'MsgGamePlayCardNtf', 'PubGsCUseSpell', 'ClientHappyGetFriendHandcardRep', 'GsCRoleOptTargetNtf', 'PubGsCMoveCard', 'GsCFirstPhaseRole', 'GsCGamephaseNtf', 'PubGsCUseCard', 'ClientGeneralSkinRep', 'ClientLoginRep', 'MsgReconnectGame', 'ClientRoleGeneralStarRep', 'SmsgGameStateData']

export function main() {
  let args = Array.prototype.slice.call(arguments)
  let mainInfo = {}
  skinLogic(args)
  let className = args[0] && args[0]['className']
  if (classList.includes(className)) {
    mainInfo['className'] = args[0]['className']
    mainInfo['CardIDs'] = args[0]['CardIDs']
    mainInfo['CardID'] = args[0]['CardID']
    mainInfo['FromID'] = args[0]['FromID']
    mainInfo['FromZone'] = args[0]['FromZone']
    mainInfo['ToID'] = args[0]['ToID']
    mainInfo['ToZone'] = args[0]['ToZone']
    mainInfo['CardCount'] = args[0]['CardCount']
    mainInfo['DataCount'] = args[0]['DataCount']
    mainInfo['SpellID'] = args[0]['SpellID'] //使用的技能
    mainInfo['FromPosition'] = args[0]['FromPosition']
    mainInfo['ToPosition'] = args[0]['ToPosition']
    mainInfo['cardCount'] = args[0]['cardCount']
    mainInfo['CardList'] = args[0]['CardList']
    mainInfo['SeatID'] = args[0]['SeatID']
    mainInfo['Param'] = args[0]['Param']
    mainInfo['Params'] = args[0]['Params']
    mainInfo['DestSeatIDs'] = args[0]['DestSeatIDs']
    mainInfo['GeneralSkinList'] = args[0]['GeneralSkinList']
    mainInfo['Infos'] = args[0]['Infos']
    mainInfo['Cards'] = args[0]['Cards']
    //var targetSeatID = args[0]["targetSeatID"];
    mainInfo['targetSeatID'] = args[0]['targetSeatID']
    //var seatId = args[0]["seatId"];
    mainInfo['seatId'] = args[0]['seatId']
    mainInfo['SeatID'] = args[0]['SeatID']
    mainInfo['Round'] = args[0]['Round']
    mainInfo['uid'] = args[0]['uid']
    mainInfo['UserID'] = args['UserID']
  }
  let mainInfoToMainLogic = JSON.parse(JSON.stringify(mainInfo))
  try {
    mainLogic(mainInfoToMainLogic)
  } catch (e) {
    console.error(e.message)
    console.error(e.stack)
    const [, lineno, colno] = e.stack.match(/(\d+):(\d+)/)
    console.error('Line:', lineno)
    console.error('Column:', colno)
    document.getElementById('iframe-source').contentWindow.document.getElementById('nav1').innerHTML = '<b>小抄GG了，联系作者解决</b>'
  }
}
