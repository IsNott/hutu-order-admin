export const skuTemplate = {
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
          'shopId': '@id',
          'name': '@cname',
          'description': '@cparagraph(1, 5)',
          'index|+1': 1,
          'createTime': '@datetime',
          'updateTime': '@datetime',
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
      'name': '@shopName',
      'phone': '@phone',
      'address': '@county(true)',
      'longitude': '@longitude',
      'latitude': '@lat',
      'status|0-1': 0,
      'description': '@cparagraph(1, 5)',
    }
  }
}