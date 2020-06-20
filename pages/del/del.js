const app = getApp()

Page({
  data: {
    list: [{
        id: 1
      },
      {
        id: 2
      },
      {
        id: 3
      },
      {
        id: 4
      },
      {
        id: 5
      },
      {
        id: 6
      },
      {
        id: 7
      },
      {
        id: 8
      },
      {
        id: 9
      },
      {
        id: 10
      }
    ],
    startX: '',
    startY: ''
  },
  onLoad: function () {
    this.setListX();
  },
  // 给每一项设置x值
  setListX() {
    this.data.list.map(item => {
      item.x = 0;
    })
    this.setData({
      list: this.data.list
    })
  },
  // 开始滑动
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
    if (Math.abs(angle) > 50) return;
    this.data.list.map((item, index) => {
      if (touchMoveEndX > startX) {
        // 右滑
        if (index == currentIndex) item.x = 0;
      } else {
        // 左滑
        item.x = -120
        if (index != currentIndex) item.x = 0;
      }
    })
    this.setData({
      list: this.data.list
    })
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
  }
})