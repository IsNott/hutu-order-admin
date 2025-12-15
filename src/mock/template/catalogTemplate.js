export const catalogTemplate = {
  query: {
    code: 200,
    message: '成功',
    data: {
      'total|100-1000': 100,
      'current|1': 1,
      'size|10': 10,
      'records|10':[
        {
          'id|+1':1,
          'shopName': '@shopName',
          'index|+1': 1,
          'shopId': '@id',
          'name': '@catalog',
          'showSide|0-1': 0,
          'createTime': '@datetime',
          'updateTime': '@datetime',
          'itemNum': '@integer(1, 100)',
          'delFlag|0-1': 0
        }
      ]
    }
  },
  detail: {
    code: 200,
    message: '成功',
    data: {
      'id|+1':1,
      'shopName': '@shopName',
      'index|+1': 1,
      'shopId': '@id',
      'name': '@cname',
      'showSide|0-1': 0,
      'createTime': '@datetime',
      'updateTime': '@datetime',
    }
  }
}