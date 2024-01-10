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
      var elmnt = document.getElementById('createIframe')
      buttonClick()
      initDragElement()
    }
  }

  //enable博图
  if ((className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 306) || (curUserID == UserID && !gameStatusMap.isGuoZhanBiaoZhun && !gameStatusMap.isGuoZhanYingBian)) {
    enableBoTu = true
  }
  if (className == 'ClientGeneralSkinRep' && GeneralSkinList[0]['GeneralID'] == 7003 && curUserID == UserID) {
    enableQuanBian = true
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
    curGeneral = curGeneral === -1 ? GeneralSkinList[0]['GeneralID'] : curGeneral
    if (curUserID < 10) {
      myID = curUserID
    } //没什么，只是初始化而已
    console.warn('myID' + myID + 'curGeneral' + curGeneral + 'skin')

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
            isFirstTime = true
          } else {
            if (oldGeneralID == 999) {
              mySkin = 0
            } else {
              mySkin = UsedGeneralSkinID['UsedGeneralSkinID'][GeneralID]
            }
            oldGeneralID = GeneralID
            isFirstTime = true
          }
        } else {
          isFirstTime = false
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
    if (!disableSkinLogic && !isFirstTime && document.getElementById('createSkinIframeSource').contentWindow.document.body.innerHTML != '') {
      document.getElementById('createSkinIframe').style.display = 'inline-block'
      clickToChangeSkinAndCloseSkinFrame()
    }
  }
}
