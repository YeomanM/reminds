//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    lastIndex : -1,
    productList: [
      {
        id: 1,
        name: '产品一',
        code: 100001,
        amount: 1
      },
      {
        id: 2,
        name: '产品二',
        code: 100002,
        amount: 5
      },
      {
        id: 3,
        name: '产品三',
        code: 300001,
        amount: 10
      }
    ],
    slideProductList: [
      {
        id: 4,
        name: '产品五',
        code: 400001,
        amount: 101
      },
      {
        id: 5,
        name: '产品六',
        code: 500002,
        amount: 500
      },
      {
        id: 6,
        name: '产品七',
        code: 600001,
        amount: 110
      }
    ]
  },

  onLoad: function () {

  },

  /**
   * 显示删除按钮
   */
  showDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex
    this.setXmove(productIndex, -130)
  },

  /**
   * 隐藏删除按钮
   */
  hideDeleteButton: function (e) {
    let productIndex = e.currentTarget.dataset.productindex

    this.setXmove(productIndex, 0)
  },

  /**
   * 设置movable-view位移
   */
  setXmove: function (productIndex, xmove) {
    let productList = this.data.productList
    productList[productIndex].xmove = xmove

    console.log("move = " + productIndex)
    this.setData({
      productList: productList
    })
  },

  setXmoveAndIndex: function (productIndex, xmove, i) {
    let productList = this.data.productList
    productList[productIndex].xmove = xmove

    console.log("move = " + productIndex)
    this.setData({
      productList: productList,
      lastIndex: i
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

  /**
   * 处理touchstart事件
   */
  handleTouchStart(e) {
    this.startX = e.touches[0].pageX
    let productIndex = e.currentTarget.dataset.productindex;
    console.log(this.data.lastIndex + ", " + productIndex)

    if(this.data.lastIndex == -1) {
      this.setData({
        lastIndex : productIndex
      });
    } else {
      if(this.data.lastIndex != productIndex) {
        this.setXmoveAndIndex(this.data.lastIndex, 0, productIndex)
      }
    }

  },

  /**
   * 处理touchend事件
   */
  handleTouchEnd(e) {
    if(e.changedTouches[0].pageX < this.startX && e.changedTouches[0].pageX - this.startX <= -30) {
      this.showDeleteButton(e)
    } else if(e.changedTouches[0].pageX > this.startX && e.changedTouches[0].pageX - this.startX < 30) {
      this.showDeleteButton(e)
    } else {
      this.hideDeleteButton(e)
    }
  },

  /**
   * 删除产品
   */
  handleDeleteProduct: function ({ currentTarget: { dataset: { id } } }) {
    let productList = this.data.productList
    let productIndex = productList.findIndex(item => item.id === id)

    productList.splice(productIndex, 1)

    this.setData({
      productList
    })
    if (productList[productIndex]) {
      this.setXmove(productIndex, 0)
    }
  },

  /**
   * slide-delete 删除产品
   */
  handleSlideDelete({ detail: { id } }) {
    let slideProductList = this.data.slideProductList
    let productIndex = slideProductList.findIndex(item => item.id === id)

    slideProductList.splice(productIndex, 1)

    this.setData({
      slideProductList
    })
  }
})
