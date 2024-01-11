import { gameState, deckState } from './state'

let insertInd //用于插入顶/底牌堆，黄承彦

export function addCard(id, cardID, zone, ToPosition, SpellID) {
  //观星询询翻回牌堆,牌堆增加,cardType增加
  //65280 丢到牌堆顶
  if (zone == 1 && id == 255 && ToPosition == 65280 && cardID != 4400 && cardID != 4401 && SpellID != 3208 && SpellID != 3266) {
    deckState.paidui.add(cardID)
    addCardType(cardID)
    deckState.ding.push(cardID)
    console.warn('card ding ' + deckState.ding)
  }
  //0 丢到牌堆底
  else if (zone == 1 && id == 255 && ToPosition == 0 && SpellID != 3218) {
    deckState.paidui.add(cardID)
    addCardType(cardID)
    deckState.di.push(cardID)
    console.warn('card di ' + deckState.di)
  }
  //黄承彦技能
  // else if (zone == 1 && id == 255 && (SpellID == 987)) {
  //     paidui.add(cardID);
  //     addCardType(cardID);
  //     ding.splice(insertInd, 0, cardID);
  //     // ding.reverse();
  //     console.warn("card ding 黄承彦 "+ding + " "+insertInd);
  // }
  //用手气卡把手牌丢回给牌堆
  else if (zone == 1 && id == 0) {
    addCardType(cardID)
  } else if (zone == 2) {
    deckState.qipai.add(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
    //吕蒙博图
    //console.warn(getCardNumAndSuit(cardID)["cardSuit"])
    if (gameState.enableBoTu) {
      addSuit(cardID)
    }
  } else if (zone == 3) {
    deckState.chuli.add(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else if (zone == 4) {
    deckState.biaoji[id].push(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else if (zone == 5) {
    //周妃/徐盛
    if (SpellID == 414 || SpellID == 3178) {
      cardID = deckState.unknownCard.splice(-1, 1)[0]
    }
    if (typeof cardID != 'undefined' && typeof deckState.shoupai[gameState.idOrder[id]] != 'undefined') {
      gameState.isDuanXian = false
      deckState.shoupai[gameState.idOrder[id]].add(cardID)
      if (deckState.paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      gameState.isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else if (zone == 6) {
    deckState.zhuangbei[id].push(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else if (zone == 7) {
    deckState.panding[id].push(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else if (zone == 8) {
    deckState.jineng.add(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else if (zone == 9) {
    return '洗牌'
  } else if (zone == 10) {
    deckState.zone10.add(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    deckState.remShouPai.delete(cardID)
  } else {
    console.warn('card.ToZone: ' + zone + ' id: ' + id + 'cardID' + cardID)
  }
  //出现在别的区域，清除此牌
  if (zone != 5) {
    for (let i = 0; i < gameState.idOrderPre.length; i++) {
      deckState.shoupai[i].delete(cardID)
    }
  }
}
//FromZone
export function removeCard(id, cardID, zone, FromPosition) {
  //id = 0,zone 1 游戏开始发牌
  if (zone == 1 && id == 0) {
    return '游戏开始发牌'
  }
  //破黄承彦 记录index 用于导入这张牌到ding 伏间
  else if (zone == 0 && id == 0 && FromPosition == 0) {
    let index = deckState.ding.indexOf(cardID)
    if (index != -1) {
      insertInd = index
    }
  }
  //系统直接从牌堆发装备--绝响
  //从牌堆发牌,牌堆删除这个id,cardType减少
  // 从牌堆顶发牌
  else if (zone == 1 && id == 255 && FromPosition == 65280) {
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    if (cardID != 0 && deckState.ding.indexOf(cardID) != -1) {
      deckState.ding.splice(deckState.ding.indexOf(cardID), 1)
    } else if (deckState.ding.indexOf(cardID) == -1 && deckState.ding.indexOf(0) != -1) {
      deckState.ding.splice(deckState.ding.indexOf(0), 1)
    }
  } else if (zone == 1 && id == 255 && FromPosition == 0) {
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    if (cardID != 0 && deckState.di.indexOf(cardID) != -1) {
      deckState.di.splice(deckState.di.indexOf(cardID), 1)
    } else if (deckState.di.indexOf(cardID) == -1 && deckState.di.indexOf(0) != -1) {
      deckState.di.splice(deckState.di.indexOf(0), 1)
    }
  }
  // 猜测65282是处理区
  else if (zone == 1 && id == 255 && FromPosition == 65282) {
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    if (cardID != 0) {
      let index = deckState.ding.indexOf(cardID)
      if (index != -1) {
        deckState.ding.splice(index, 1)
        insertInd = index
      } else if (index == -1 && deckState.ding.indexOf(0) != -1) {
        deckState.ding.splice(index, 1)
        insertInd = -1
      }
    }
  }
  //从弃牌堆丢牌
  else if (zone == 2) {
    deckState.qipai.delete(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  }
  //从处理区丢牌
  else if (zone == 3) {
    deckState.chuli.delete(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  }
  //从标记区丢牌
  else if (zone == 4) {
    if (typeof deckState.biaoji[id] != 'undefined') {
      gameState.isDuanXian = false
      if (deckState.paidui.delete(cardID)) {
        removeCardType(cardID)
      }
      let index = deckState.biaoji[id].indexOf(cardID)
      if (index == -1) {
        cardID = 0
        index = deckState.biaoji[id].indexOf(cardID)
      }
      deckState.unknownCard.push(deckState.biaoji[id].splice(index, 1)[0])
    } else {
      gameState.isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  } else if (zone == 5) {
    if (typeof deckState.shoupai[gameState.idOrder[id]] != 'undefined') {
      gameState.isDuanXian = false

      for (let i = 0; i < gameState.idOrderPre.length; i++) {
        deckState.shoupai[i].delete(cardID)
      }
      if (deckState.paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      gameState.isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  }
  //装备区丢牌
  else if (zone == 6) {
    if (typeof deckState.zhuangbei[id] != 'undefined') {
      gameState.isDuanXian = false
      let index = deckState.zhuangbei[id].indexOf(cardID)
      if (index == -1) {
        let cardID = 0
        index = deckState.zhuangbei[id].indexOf(cardID)
      }
      deckState.zhuangbei[id].splice(index, 1)
      if (deckState.paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      gameState.isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  }
  //判定
  else if (zone == 7) {
    if (typeof deckState.panding[id] != 'undefined') {
      let index = deckState.panding[id].indexOf(cardID)
      if (index == -1) {
        let cardID = 0
        index = deckState.panding[id].indexOf(cardID)
      }
      deckState.panding[id].splice(index, 1)
      if (deckState.paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      gameState.isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  } else if (zone == 8) {
    deckState.jineng.delete(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  } else if (zone == 9) {
    return '洗牌'
  } else if (zone == 10) {
    deckState.zone10.delete(cardID)
    if (deckState.paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  } else {
    console.warn('card.remove: ' + zone + ' id: ' + id + 'cardID' + cardID)
  }
  deckState.remShouPai.delete(cardID)
  // return cardID;
}
