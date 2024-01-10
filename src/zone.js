import { addSuit } from './dom'
import { getCardNumAndSuit } from './utils/get'

export function addCard(id, cardID, zone, ToPosition, SpellID) {
  //观星询询翻回牌堆,牌堆增加,cardType增加
  //65280 丢到牌堆顶
  if (zone == 1 && id == 255 && ToPosition == 65280 && cardID != 4400 && cardID != 4401 && SpellID != 3208 && SpellID != 3266) {
    paidui.add(cardID)
    addCardType(cardID)
    ding.push(cardID)
    console.warn('card ding ' + ding)
  }
  //0 丢到牌堆底
  else if (zone == 1 && id == 255 && ToPosition == 0 && SpellID != 3218) {
    paidui.add(cardID)
    addCardType(cardID)
    di.push(cardID)
    console.warn('card di ' + di)
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
    qipai.add(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
    //吕蒙博图
    //console.warn(getCardNumAndSuit(cardID)["cardSuit"])
    if (enableBoTu) {
      addSuit(cardID)
    }
  } else if (zone == 3) {
    chuli.add(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
  } else if (zone == 4) {
    biaoji[id].push(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
  } else if (zone == 5) {
    //周妃/徐盛
    if (SpellID == 414 || SpellID == 3178) {
      cardID = unknownCard.splice(-1, 1)[0]
    }
    if (typeof cardID != 'undefined' && typeof shoupai[idOrder[id]] != 'undefined') {
      isDuanXian = false
      shoupai[idOrder[id]].add(cardID)
      if (paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
    remShouPai.delete(cardID)
  } else if (zone == 6) {
    zhuangbei[id].push(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
  } else if (zone == 7) {
    panding[id].push(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
  } else if (zone == 8) {
    jineng.add(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
  } else if (zone == 9) {
    return '洗牌'
  } else if (zone == 10) {
    zone10.add(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    remShouPai.delete(cardID)
  } else {
    console.warn('card.ToZone: ' + zone + ' id: ' + id + 'cardID' + cardID)
  }
  //出现在别的区域，清除此牌
  if (zone != 5) {
    for (let i = 0; i < idOrderPre.length; i++) {
      shoupai[i].delete(cardID)
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
    let index = ding.indexOf(cardID)
    if (index != -1) {
      insertInd = index
    }
  }
  //系统直接从牌堆发装备--绝响
  //从牌堆发牌,牌堆删除这个id,cardType减少
  // 从牌堆顶发牌
  else if (zone == 1 && id == 255 && FromPosition == 65280) {
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    if (cardID != 0 && ding.indexOf(cardID) != -1) {
      ding.splice(ding.indexOf(cardID), 1)
    } else if (ding.indexOf(cardID) == -1 && ding.indexOf(0) != -1) {
      ding.splice(ding.indexOf(0), 1)
    }
  } else if (zone == 1 && id == 255 && FromPosition == 0) {
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    if (cardID != 0 && di.indexOf(cardID) != -1) {
      di.splice(di.indexOf(cardID), 1)
    } else if (di.indexOf(cardID) == -1 && di.indexOf(0) != -1) {
      di.splice(di.indexOf(0), 1)
    }
  }
  // 猜测65282是处理区
  else if (zone == 1 && id == 255 && FromPosition == 65282) {
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
    if (cardID != 0) {
      let index = ding.indexOf(cardID)
      if (index != -1) {
        ding.splice(index, 1)
        insertInd = index
      } else if (index == -1 && ding.indexOf(0) != -1) {
        ding.splice(index, 1)
        insertInd = -1
      }
    }
  }
  //从弃牌堆丢牌
  else if (zone == 2) {
    qipai.delete(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  }
  //从处理区丢牌
  else if (zone == 3) {
    chuli.delete(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  }
  //从标记区丢牌
  else if (zone == 4) {
    if (typeof biaoji[id] != 'undefined') {
      isDuanXian = false
      if (paidui.delete(cardID)) {
        removeCardType(cardID)
      }
      let index = biaoji[id].indexOf(cardID)
      if (index == -1) {
        cardID = 0
        index = biaoji[id].indexOf(cardID)
      }
      unknownCard.push(biaoji[id].splice(index, 1)[0])
    } else {
      isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  } else if (zone == 5) {
    if (typeof shoupai[idOrder[id]] != 'undefined') {
      isDuanXian = false

      for (let i = 0; i < idOrderPre.length; i++) {
        shoupai[i].delete(cardID)
      }
      if (paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  }
  //装备区丢牌
  else if (zone == 6) {
    if (typeof zhuangbei[id] != 'undefined') {
      isDuanXian = false
      let index = zhuangbei[id].indexOf(cardID)
      if (index == -1) {
        let cardID = 0
        index = zhuangbei[id].indexOf(cardID)
      }
      zhuangbei[id].splice(index, 1)
      if (paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  }
  //判定
  else if (zone == 7) {
    if (typeof panding[id] != 'undefined') {
      let index = panding[id].indexOf(cardID)
      if (index == -1) {
        let cardID = 0
        index = panding[id].indexOf(cardID)
      }
      panding[id].splice(index, 1)
      if (paidui.delete(cardID)) {
        removeCardType(cardID)
      }
    } else {
      isDuanXian = true
      console.warn('duanxian' + zone + cardID)
    }
  } else if (zone == 8) {
    jineng.delete(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  } else if (zone == 9) {
    return '洗牌'
  } else if (zone == 10) {
    zone10.delete(cardID)
    if (paidui.delete(cardID)) {
      removeCardType(cardID)
    }
  } else {
    console.warn('card.remove: ' + zone + ' id: ' + id + 'cardID' + cardID)
  }
  remShouPai.delete(cardID)
  // return cardID;
}

export function removeCardType(cardID) {
  if (cardID != 0 && cardList.includes(cardID)) {
    console.warn('card type remove: ' + cardID + currentMode[cardID]['name'] + ' ' + JSON.stringify(getCardNumAndSuit(cardID)))
    if (typeof currentCardType[currentMode[cardID]['name']] != 'undefined') {
      let n = currentCardType[currentMode[cardID]['name']]['cardNum']
      if (n > 0) {
        n--
        currentCardType[currentMode[cardID]['name']]['cardNum'] = n
        if (n == 1) {
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).disabled = false
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).innerText = currentMode[cardID]['name']
        } else if (n == 0) {
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).innerText = currentMode[cardID]['name']
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).disabled = true
        } else {
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).innerText = n + currentMode[cardID]['name']
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).disabled = false
        }
      }
      if (getCardNumAndSuit(cardID)['cardSuit'] == '♦') {
        suits.diamond--
      } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♣') {
        suits.club--
      } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♠') {
        suits.spade--
      } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♥') {
        suits.heart--
      }
      if ((getCardNumAndSuit(cardID)['cardSuit'] == '♥' || getCardNumAndSuit(cardID)['cardSuit'] == '♦') && (currentMode[cardID]['name'] == '火杀' || currentMode[cardID]['name'] == '雷杀' || currentMode[cardID]['name'] == '杀')) {
        suits.hongsha--
      } else if ((getCardNumAndSuit(cardID)['cardSuit'] == '♣' || getCardNumAndSuit(cardID)['cardSuit'] == '♠') && (currentMode[cardID]['name'] == '火杀' || currentMode[cardID]['name'] == '雷杀' || currentMode[cardID]['name'] == '杀')) {
        suits.heisha--
      }
      if (suits.diamond < 0) {
        suits.diamond = 0
      } else if (suits.heart < 0) {
        suits.heart = 0
      } else if (suits.club < 0) {
        suits.club = 0
      } else if (suits.diamond < 0) {
        suits.diamond = 0
      } else if (suits.spade < 0) {
        suits.spade = 0
      } else if (suits.hongsha < 0) {
        suits.hongsha = 0
      } else if (suits.heisha < 0) {
        suits.heisha = 0
      } else if (suits.diamond < 0) {
        suits.diamond = 0
      }

      document.getElementById('iframe-source').contentWindow.document.getElementById('heart').innerText = '♥红桃 × ' + suits.heart
      document.getElementById('iframe-source').contentWindow.document.getElementById('club').innerText = '♣梅花 × ' + suits.club
      document.getElementById('iframe-source').contentWindow.document.getElementById('spade').innerText = '♠黑桃 × ' + suits.spade
      document.getElementById('iframe-source').contentWindow.document.getElementById('diamond').innerText = '♦方片 × ' + suits.diamond
      // document.getElementById('iframe-source').contentWindow.document.getElementById("shandian").innerText ="♠黑桃2~9 概率:"+ Math.round((spade2_9 / paidui.size) * 100)+'%';
      document.getElementById('iframe-source').contentWindow.document.getElementById('hongsha').innerText = '红杀 × ' + suits.hongsha
      document.getElementById('iframe-source').contentWindow.document.getElementById('heisha').innerText = '黑杀 × ' + suits.heisha
    }
  }
}

export function addCardType(cardID) {
  if (cardID != 0 && cardList.includes(cardID)) {
    //console.warn("card type add: " + cardID + currentMode[cardID]["name"] + " " + JSON.stringify(getCardNumAndSuit(cardID)));
    if (typeof currentCardType[currentMode[cardID]['name']] != 'undefined') {
      let n = currentCardType[currentMode[cardID]['name']]['cardNum']
      if (n >= 0) {
        n++
        currentCardType[currentMode[cardID]['name']]['cardNum'] = n
        if (n == 1) {
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).disabled = false
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).innerText = currentMode[cardID]['name']
        } else if (n == 0) {
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).innerText = currentMode[cardID]['name']
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).disabled = true
        } else {
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).innerText = n + currentMode[cardID]['name']
          document.getElementById('iframe-source').contentWindow.document.getElementById(currentMode[cardID]['name']).disabled = false
        }
      }
      if (getCardNumAndSuit(cardID)['cardSuit'] == '♦') {
        suits.diamond++
      } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♣') {
        suits.club++
      } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♠') {
        suits.spade++
      } else if (getCardNumAndSuit(cardID)['cardSuit'] == '♥') {
        suits.heart++
      }
      if ((getCardNumAndSuit(cardID)['cardSuit'] == '♥' || getCardNumAndSuit(cardID)['cardSuit'] == '♦') && (currentMode[cardID]['name'] == '火杀' || currentMode[cardID]['name'] == '雷杀' || currentMode[cardID]['name'] == '杀')) {
        suits.hongsha++
      } else if ((getCardNumAndSuit(cardID)['cardSuit'] == '♣' || getCardNumAndSuit(cardID)['cardSuit'] == '♠') && (currentMode[cardID]['name'] == '火杀' || currentMode[cardID]['name'] == '雷杀' || currentMode[cardID]['name'] == '杀')) {
        suits.heisha++
      }
      if (getCardNumAndSuit(cardID)['cardSuit'] == '♠' && getCardNumAndSuit(cardID)['cardNum'] >= 2 && getCardNumAndSuit(cardID)['cardNum'] <= 9) {
        suits.spade2_9++
      }
      document.getElementById('iframe-source').contentWindow.document.getElementById('heart').innerText = '♥红桃 × ' + suits.heart
      document.getElementById('iframe-source').contentWindow.document.getElementById('club').innerText = '♣梅花 × ' + suits.club
      document.getElementById('iframe-source').contentWindow.document.getElementById('spade').innerText = '♠黑桃 × ' + suits.spade
      document.getElementById('iframe-source').contentWindow.document.getElementById('diamond').innerText = '♦方片 × ' + suits.diamond
      // document.getElementById('iframe-source').contentWindow.document.getElementById("shandian").innerText ="♠黑桃2~9 概率:"+ (spade2_9/paidui.size).toFixed(2);
      //document.getElementById('iframe-source').contentWindow.document.getElementById("paiduiSize").innerText ="牌堆张数: "+ paidui.size;
      document.getElementById('iframe-source').contentWindow.document.getElementById('hongsha').innerText = '红杀 × ' + suits.hongsha
      document.getElementById('iframe-source').contentWindow.document.getElementById('heisha').innerText = '黑杀 × ' + suits.heisha
    }
  }
}