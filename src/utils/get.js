import allCard from '../map/allCard'

export function getCardNumAndSuit(cardID) {
  let cardNum = allCard[cardID] ? allCard[cardID]['number'] : 0
  let cardSuit = ''
  let cardNumAndSuit = ''
  let cardNumAJQK = ''
  if (allCard[cardID]) {
    if (allCard[cardID]['color'] == 1) {
      cardSuit = '♥'
    } else if (allCard[cardID]['color'] == 2) {
      cardSuit = '♦'
    } else if (allCard[cardID]['color'] == 3) {
      cardSuit = '♠'
    } else if (allCard[cardID]['color'] == 4) {
      cardSuit = '♣'
    }
  } else {
    cardSuit = ''
  }

  if (cardNum == 12) {
    cardNumAJQK = 'Q'
  } else if (cardNum == 13) {
    cardNumAJQK = 'K'
  } else if (cardNum == 11) {
    cardNumAJQK = 'J'
  } else if (cardNum == 1) {
    cardNumAJQK = 'A'
  } else {
    cardNumAJQK = cardNum
  }
  cardNumAndSuit = cardSuit + cardNumAJQK

  let res = { cardNumAndSuit, cardNum, cardSuit }
  return res
}

export function allCardToCurrentMode(cardList) {
  let currentMode = {}
  currentMode['0'] = { ...allCard['0'] }
  // Iterate through cardList and populate currentMode
  for (const cid of cardList) {
    currentMode[cid] = allCard[cid] || { ...allCard['0'] }
  }
  return currentMode
}

export function currentModeCardType(cards) {
  const cardInfoMap = {}
  Object.values(cards).forEach((card) => {
    const cardName = card.name
    const cardType = card.type
    if (cardName !== '?') {
      if (!cardInfoMap[cardName]) {
        cardInfoMap[cardName] = { cardNum: 1, cardType }
      } else {
        cardInfoMap[cardName].cardNum += 1
      }
    }
  })
  return cardInfoMap
}
