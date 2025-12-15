export const itemTemplate = {
  query: {
    code: 200,
    message: '成功',
    data: {
      'total|100-1000': 100,
      'current|1': 1,
      'size|10': 10,
      'records|10': [
        {
          'id|+1': 1,
          'cover': '@img',
          'index|+1': 1,
          'shopId': '@id',
          'shopName': '@shopName',
          'price|1-100': 1,
          'catalogId': '@id',
          'name': '@catalog',
          'description': '@cparagraph',
          'createTime': '@datetime',
          'updateTime': '@datetime',
          'delFlag|0-1': 0
        }
      ]
    }
  },
  tree: {
    code: 200,
    message: '成功',
    'data|3-5': [
      {
        'id|+1': 1,
        'shopId': '@id',
        'shopName': '@shopName',
        'createTime': '@datetime',
        'updateTime': '@datetime',
        'type': 'shop',
        'children|1-5': [
          {
            'id|+1': 1,
            'parentId': '@id',
            'index|+1': 1,
            'name': '@catalog',
            'type': 'catalog',
          }
        ]
      }
    ]
  },
  detail: {
    code: 200,
    message: '成功',
    data: {
      'id|+1': 1,
      'cover': '@img',
      'index|+1': 1,
      'shopId': '@id',
      'catalogId': '@id',
      'name': '@cname',
      'description': '@cparagraph',
      'createTime': '@datetime',
      'updateTime': '@datetime',
      'images|1-6': ['@img'],
      'delFlag|0-1': 0,
      'skus|1-10': [{
        "id": '@id',
        "label": '@cname',
        "multi|0-1": 0,
        "options|1-3": [
          {
            "label": "正常糖",
            "value|+1": 1,
            "parentId": "@id",
            "disabled|0-1": 1,
            "addonalPrice|1-100.00": 1.00,
          }
        ]
      }]
    }
  }
}