import { getCardNumAndSuit, transformLetter } from './get'
import { drawYanJiao } from '../dom'

let combos = []

export function calcResult(arr) {
  combos = []
  arr.sort()
  findCombos(arr)
}

function findCombos(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    printCombination(arr, arr.length, i)
  }
  findPairs()
}

function printCombination(arr, n, r) {
  // A temporary array to store all combination one by one
  var data = []

  // Print all combination using temporary array 'data'
  combinationUtil(arr, n, r, 0, data, 0)
}

/*
   arr[]  ---> Input Array
   n      ---> Size of input array
   r      ---> Size of a combination to be printed
   index  ---> Current index in data[]
   data[] ---> Temporary array to store current combination
   i      ---> index of current element in arr[]
*/
function combinationUtil(arr, n, r, index, data, i) {
  // Current combination is ready, print it
  if (index === r) {
    //make combo array local and insert sum
    var insertable = []
    for (var i = 0; i < data.length; i++) {
      insertable.push(data[i])
    }
    combos.push(insertable)
    return
  }
  // When no more elements are there to put in data[]
  if (i >= n) {
    return
  }
  // current is included, put next at next location
  data[index] = arr[i]
  combinationUtil(arr, n, r, index + 1, data, i + 1)
  // current is excluded, replace it with next
  // (Note that i+1 is passed, but index is not
  // changed)
  combinationUtil(arr, n, r, index, data, i + 1)
}

function findPairs() {
  var pairs = []
  for (var i = 0; i < combos.length; i++) {
    for (var j = i + 1; j < combos.length; j++) {
      if (sum(combos[i]) === sum(combos[j])) {
        var pair1 = combos[i]
        var pair2 = combos[j]
        var concat = pair1.concat(pair2).sort()
        var origin = arr.sort()
        var is_same =
          concat.length === origin.length &&
          concat.every(function (element, index) {
            return element === origin[index]
          })

        var b = 0,
          c = 0,
          cIndex = 0,
          is_subarray = false
        // Traverse both arrays simultaneously
        while (b < origin.length && c < concat.length) {
          // If element matches, increment both pointers
          if (origin[b] === concat[c]) {
            b++
            c++
            cIndex++
            // If concat array is completely traversed
            if (c === concat.length) {
              // console.log("is_subarray set to true");
              is_subarray = true
            }
          } else {
            if (origin[b] !== concat[cIndex]) {
              //fix when having duplicates of same value
              b++
            }
            c = cIndex
          }
        }
        // console.log("is_subarrray?: " + is_subarray);
        if (is_same || is_subarray) {
          pairs.push(toLetter(combos[i]).join('+') + ' = ' + toLetter(combos[j]).join('+'))
        }
      }
    }
  }
  if (pairs.length === 0) {
    document.getElementById('iframe-source').contentWindow.document.getElementById('res').innerHTML = "<span style='color: red'>这道题冲儿算不出来</span>"
    return
  }

  var sortedPairs = pairs.sort(function (a, b) {
    if (b.length !== a.length) {
      // sort by length
      return b.length - a.length
    } else {
      // 尽量2组平均分配
      return Math.abs(parseInt(b.length / 2) - a.indexOf('=')) - Math.abs(parseInt(b.length / 2) - b.indexOf('='))
    }
  })
  var filteredPairs = []
  sortedPairs.filter(function (value, index, array) {
    if (!containsStr(filteredPairs, value)) {
      filteredPairs.push(value)
    }
  })
  if (filteredPairs.length > 3) {
    filteredPairs = filteredPairs.slice(0, 3)
  }
  drawYanJiao(filteredPairs)
}

function containsStr(arr, str) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === str) {
      return true
    }
  }
  return false
}

function toLetter(combo) {
  var toLetter = []
  for (var i = 0; i < combo.length; i++) {
    toLetter.push(transformLetter(combo[i]))
  }
  return toLetter
}

function sum(arr) {
  var sum = 0
  for (var i = 0; i < arr.length; i++) {
    sum += arr[i]
  }
  return sum
}

export function JiZhanCal(cardNum) {
  var bigger = 0
  var smaller = 0
  for (const card of paidui) {
    if (parseInt(getCardNumAndSuit(card)['cardNum']) > cardNum) {
      bigger++
    }
    if (parseInt(getCardNumAndSuit(card)['cardNum']) < cardNum) {
      smaller++
    }
  }
  // paidui.forEach(c => paiduiSum+=parseInt(getCardNumAndSuit(c)["cardNum"]));
  document.getElementById('iframe-source').contentWindow.document.getElementById('jizhan').innerHTML = '牌堆比' + cardNum + '大张数：' + bigger + '<br>' + '牌堆比' + cardNum + '小张数：' + smaller
}

// var MiZhuCards = [10, 2, 3, 7, 6]
//记录结果的位置，如果有相同则略过
// var pathArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
// var pathSum
// var pathArrSet = new Set()

// function mizhuCal(cards, index, res,sum) {
export function MiZhuCal(arr, n) {
  let pathArrSet = new Set()
  let MiZhuRes = []
  var opsize = Math.pow(2, [10, 2, 3, 7, 6].length)
  // Run from counter 000..1 to 111..1
  for (let counter = 1; counter < opsize; counter++) {
    let pathArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    let pathSum = 0

    for (let j = 0; j < n; j++) {
      // Check if jth bit in the counter is set
      // If set then print jth element from arr[]
      if ((counter & (1 << j)) != 0) {
        pathSum += arr[j]
        pathArr[arr[j]]++ //位数加一
      }
    }
    if (pathSum == 13 && !pathArrSet.has(JSON.stringify(pathArr))) {
      pathArrSet.add(JSON.stringify(pathArr))
      var toPathArr = []
      for (let i = 1; i <= 13; i++) {
        for (let j = 0; j < pathArr[i]; j++) {
          toPathArr.push(i)
        }
      }
      MiZhuRes.push(toPathArr)
      if (MiZhuRes.length >= 10) {
        return MiZhuRes
      }
    }
  }
  return MiZhuRes
}
