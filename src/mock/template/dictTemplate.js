export const dictTemplate = {
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
          'name': '@cName',
          'remark': '@cparagraph(1, 5)',
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
    data: {}
  }
}