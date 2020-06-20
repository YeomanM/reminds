const app = getApp()
Page({
  data: {
    reminds: [],
    type2Name : [
      "一次性",
      "工作日",
      "每天"
    ],
    currentTab: 0,
    addClass : "pressClass",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {

    var list = this.data.reminds;
    list.map(item => {
      item.x = 0;
    });
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          reminds : list
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
            reminds : list
          })
        }
      })
    }
  },
  onReady: function () {

  },
  //点击tab menu
  clickMenu: function (e) {
    var current = e.currentTarget.id; //获取当前tab的index
    console.log(e);
    if (this.data.currentTab == current) {
      return false
    } else {
      this.setData({
        currentTab: current
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  touchMoveStartHandle(e) {
    // 我们要记录滑动开始的坐标点，后面计算要用到
     if (e.touches.length == 1) {
 
       this.setData({
         startX: e.touches[0].clientX,
         startY: e.touches[0].clientY
       });
     }
   },
   // 滑动事件处理,一次只能滑出一个删除按钮 为了防止滑动出现抖动，我们用滑动结束事件
   touchMoveEndHandle: function (e) {
     var currentIndex = e.currentTarget.dataset.index, //当前索引
       startX = this.data.startX, //开始X坐标
       startY = this.data.startY, //开始Y坐标
       touchMoveEndX = e.changedTouches[0].clientX, //滑动变化X坐标
       touchMoveEndY = e.changedTouches[0].clientY, //滑动变化Y坐标

       //获取滑动角度
       angle = this.angle({
         X: startX,
         Y: startY
       }, {
         X: touchMoveEndX,
         Y: touchMoveEndY
       });
     //滑动超过50度角 return，防止上下滑动触发
     
     console.log(currentIndex);
     if (Math.abs(angle) > 50) return;
     this.data.reminds.map((item, index) => {
       if (touchMoveEndX > startX || !this.canMove(startX, touchMoveEndX)) {
         // 右滑
         if (index == currentIndex) item.x = 0;
       } else {
         // 左滑
         item.x = -240
         if (index != currentIndex) item.x = 0;
       }
     })
     this.setData({
      reminds: this.data.reminds
     })
   },


     /**
   * 处理movable-view移动事件
   */
  handleMovableChange: function (e) {
    if (e.detail.source === 'friction') {
      if (e.detail.x < -30) {
        this.showDeleteButton(e)
      } else {
        this.hideDeleteButton(e)
      }
    } else if (e.detail.source === 'out-of-bounds' && e.detail.x === 0) {
      this.hideDeleteButton(e)
    }
  },

   touchMoveHandle: function(e) {
      console.log(e);
   },

   canMove : function(startX, endX) {
      return startX - endX >= 10;
   },

   /**
    * 计算滑动角度
    * start 起点坐标
    * end 终点坐标
    * Math.PI 表示一个圆的周长与直径的比例，约为 3.14159;PI就是圆周率π，PI是弧度制的π,也就是180°
    */
   angle: function (start, end) {
     var _X = end.X - start.X,
       _Y = end.Y - start.Y
     return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
   },


   switch1Change: function(e) {
     var target = e.currentTarget.id;
     var v = e.detail.value;
     var list = this.data.reminds;
     list[target].open = v;
     this.setData({
       reminds: list
     });
   },

   gotoAddPage() {
     wx.navigateTo({
       url: '/pages/add/add',
     })
   }

})